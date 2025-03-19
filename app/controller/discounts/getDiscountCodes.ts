import prisma from 'app/db.server';

export const getDiscountCodes = async (
	shop: string,
	page: number = 1,
	pageSize: number = 10,
	status?: 'active' | 'pending',
	usedCountGreaterThan: number = 0,
	searchQuery?: string
): Promise<{ success: boolean; message: string; discountCodes: string[]; pagination: { totalCount: number; totalPages: number; currentPage: number }; }> => {
	try {
		const where: any = {
			shop,
			usedCount: {
				gte: usedCountGreaterThan,
			},
		};

		if (status) {
			where.status = status;
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
		});

		const totalPages = Math.ceil(totalCount / pageSize);

		return {
			success: true,
			discountCodes,
			message: 'Fetch discount codes successfuly',
			pagination: {
				totalCount,
				totalPages,
				currentPage: page,
			},
		};

	} catch (error) {
		console.log(error, 'Error fetching discount code from database');
		return {
			success: false,
			message: 'Something went wrong',
			discountCodes: [],
			pagination: {
				totalCount: 0,
				totalPages: 0,
				currentPage: page,
			},
		};
	}
};
