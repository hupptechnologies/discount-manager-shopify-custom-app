import prisma from 'app/db.server';

/**
 * Handles the creation of an order via webhook from Shopify.
 * 
 * This function is triggered when a customer creates an order on Shopify.
 * If a discount code is applied to the order, the function checks the 
 * `discount_codes` array in the webhook payload to find the applied 
 * discount codes. For each code, it checks if the code exists in our 
 * app's database. If a match is found, it increments the usage count 
 * of that discount code, ensuring that the application of the discount 
 * is accurately tracked.
 * 
 * @param {string} shop - The Shopify store's domain (e.g., 'my-shop.myshopify.com').
 * @param {any[]} discount_codes - An array of discount codes applied to the order.
 * 
 * @returns {Promise<void>} 
 * - A promise that resolves when the discount code usage count is updated in the database.
*/

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
