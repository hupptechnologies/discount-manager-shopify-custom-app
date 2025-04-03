import prisma from 'app/db.server';

export const handleOrderCreate = async (
	shop: string,
	discount_codes: any[],
) => {
	try {
		for (const application of discount_codes) {
			const discountCode = application.code;
			const discount = await prisma.discountCode.findFirst({
				where: { shop, code: discountCode },
			});
			if (discount) {
				await prisma.discountCode.update({
					where: {
						id: discount.id,
					},
					data: {
						usedCount: {
							increment: 1,
						},
					},
				});
			}
		}
	} catch (error) {
		console.error('Error in order create webhook handler', error);
	}
};
