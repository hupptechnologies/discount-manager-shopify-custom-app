import prisma from 'app/db.server';
import { getDetailUsingGraphQL } from 'app/service/product';
import { GET_BASIC_DISCOUNT_CODE_USAGE_COUNT_QUERY } from 'app/graphqlQuery/discount';

interface DiscountStats {
	activeDiscount: {
		count: number;
		data: number[];
	};
	usedDiscount: {
		count: number;
		data: number[];
	};
	expiredDiscount: {
		count: number;
		data: number[];
	};
}

interface GetDiscountCodeResponse {
	success: boolean;
	message: string;
	discountCodes: any;
	discountStats: any;
	pagination: { totalCount: number; totalPages: number; currentPage: number };
}

/**
	* Fetches discount statistics for the last 7 days, including total counts and daily data for active, used, and expired discount codes.
	* 
	* This function retrieves the following:
	* - Total active discount codes (those that are active and have not expired).
	* - Total used discount codes (those that have been used at least once).
	* - Total expired discount codes (those whose `endDate` is in the past).
	* 
	* Additionally, it provides daily breakdowns of:
	* - The count of active discount codes created in the last 7 days.
	* - The count of used discount codes created in the last 7 days.
	* - The count of expired discount codes created in the last 7 days.
	*
	* @returns {Promise<DiscountStats>} An object containing the discount statistics, including total counts and daily data for each discount category.
*/
const getDiscountStats = async (): Promise<DiscountStats> => {
	const activeDiscountsCount = await prisma.discountCode.count({
		where: { isActive: true, endDate: { gt: new Date() } },
	});

	const usedDiscountsCount = await prisma.discountCode.count({
		where: { usedCount: { gt: 0 } },
	});

	const expiredDiscountsCount = await prisma.discountCode.count({
		where: { endDate: { lt: new Date() } },
	});

	const today = new Date();
	const last7Days = Array.from({ length: 7 }, (_, i) => {
		const date = new Date(today);
		date.setDate(today.getDate() - i);
		return date.toISOString().split('T')[0];
	});

	const getDiscountCountPerDay = async (whereCondition: any) => {
		const counts = await Promise.all(
			last7Days.map(async (date) => {
				const count = await prisma.discountCode.count({
					where: {
						...whereCondition,
						createdAt: {
							gte: new Date(date),
							lt: new Date(
								new Date(date).setDate(new Date(date).getDate() + 1),
							),
						},
					},
				});
				return count || 0;
			}),
		);
		return counts;
	};

	const activeDiscounts = await getDiscountCountPerDay({ isActive: true });
	const usedDiscounts = await getDiscountCountPerDay({ usedCount: { gt: 0 } });
	const expiredDiscounts = await getDiscountCountPerDay({
		endDate: { lt: new Date() },
	});

	const discountSummary: DiscountStats = {
		activeDiscount: { count: activeDiscountsCount, data: activeDiscounts },
		usedDiscount: { count: usedDiscountsCount, data: usedDiscounts },
		expiredDiscount: { count: expiredDiscountsCount, data: expiredDiscounts },
	};

	return discountSummary;
};

/**
	* Retrieves a paginated list of discount codes from our database, 
	* with optional filters for status, usage count, search query, and ordering.
	* 
	* This function fetches discount code data from our app's database, allowing 
	* admins to view the details of all created discount codes. It supports filtering 
	* by status (active, pending, expired), usage count (discount codes with more than 
	* a certain number of uses), search query, and ordering by creation date (ascending or descending). 
	* It also returns pagination details so that the result can be split into pages.
	* 
	* @param {string} shop - The domain of the Shopify store (e.g., 'my-shop.myshopify.com').
	* @param {number} page - The page number to fetch (default is 1).
	* @param {number} pageSize - The number of discount codes to fetch per page (default is 10).
	* @param {'active' | 'pending' | 'expired'} [status] - The status of the discount codes to filter by (optional).
	* @param {number} usedCountGreaterThan - Filters discount codes with a usage count greater than this value (default is 0).
	* @param {string} [searchQuery] - A search query to filter discount codes by title, code, or other fields (optional).
	* @param {'asc' | 'desc'} [orderByCreatedAt] - Order the results by creation date, either ascending ('asc') or descending ('desc') (optional).
	* * @returns {Promise<GetDiscountCodeResponse>} - A promise that resolves with the required discount code details.
*/
export const getDiscountCodes = async (
	shop: string,
	page: number = 1,
	pageSize: number = 10,
	status?: 'active' | 'pending' | 'expired',
	usedCountGreaterThan: number = 0,
	searchQuery?: string,
	orderByCreatedAt?: 'asc' | 'desc',
): Promise<GetDiscountCodeResponse> => {
	try {
		const where: any = {
			shop,
			usedCount: {
				gte: usedCountGreaterThan,
			},
		};

		if (status) {
			if (status === 'expired') {
				where.endDate = {
					lt: new Date(),
				};
			} else {
				where.isActive =
					(status === 'active' && true) || (status === 'pending' && false);
				where.endDate = {
					gt: new Date(),
				};
			}
		}

		if (searchQuery) {
			where.code = {
				contains: searchQuery,
				mode: 'insensitive',
			};
		}

		const totalCount = await prisma.discountCode.count({
			where,
		});

		const discountCodes = await prisma.discountCode.findMany({
			where,
			skip: (page - 1) * pageSize,
			take: pageSize,
			orderBy: {
				createdAt: orderByCreatedAt,
			},
		});

		const totalPages = Math.ceil(totalCount / pageSize);

		const discountStatsData = await getDiscountStats();

		const response = await prisma.session.findMany({
			where: { shop },
		});
		const accessToken = response[0]?.accessToken;

		if (!accessToken) {
			throw new Error('Access token not found');
		}

		const discountCodesWithUsageCount = await Promise.all(
			discountCodes.map(async (discountCode) => {
				let asyncUsageCount = 0;
				if (discountCode.discountId.includes('DiscountCodeNode')) {
					const data = {
						query: GET_BASIC_DISCOUNT_CODE_USAGE_COUNT_QUERY,
						variables: {
							ID: discountCode.discountId,
						},
					};
					const usageCount = await getDetailUsingGraphQL(
						shop,
						accessToken,
						data,
					);
					asyncUsageCount =
						usageCount?.data?.data?.codeDiscountNode?.codeDiscount
							?.asyncUsageCount || 0;
				}
				return {
					...discountCode,
					asyncUsageCount,
				};
			}),
		);

		return {
			success: true,
			discountCodes: discountCodesWithUsageCount,
			discountStats: discountStatsData,
			message: 'Fetch discount codes successfully',
			pagination: {
				totalCount,
				totalPages,
				currentPage: page,
			},
		};
	} catch (error) {
		// eslint-disable-next-line no-console
		console.log(error, 'Error fetching discount code from database');
		return {
			success: false,
			message: 'Something went wrong',
			discountCodes: [],
			discountStats: null,
			pagination: {
				totalCount: 0,
				totalPages: 0,
				currentPage: page,
			},
		};
	}
};
