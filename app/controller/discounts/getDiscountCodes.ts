import prisma from 'app/db.server';

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

export const getDiscountCodes = async (
	shop: string,
	page: number = 1,
	pageSize: number = 10,
	status?: 'active' | 'pending' | 'expired',
	usedCountGreaterThan: number = 0,
	searchQuery?: string,
	orderByCreatedAt?: 'asc' | 'desc',
): Promise<{
	success: boolean;
	message: string;
	discountCodes: any;
	discountStats: any;
	pagination: { totalCount: number; totalPages: number; currentPage: number };
}> => {
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
				where.isActive = (status === 'active' && true) || (status === 'pending' && false);
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

		return {
			success: true,
			discountCodes,
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
