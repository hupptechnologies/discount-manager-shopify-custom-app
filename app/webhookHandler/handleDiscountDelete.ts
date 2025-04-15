import prisma from '../db.server';
import { getDetailUsingGraphQL } from 'app/service/product';
import {
	DELETE_AUTOMATIC_DISCOUNT_CODE_QUERY,
	DELETE_DISCOUNT_CODE_QUERY,
} from 'app/controller/discounts/deleteDiscountCode';

interface PayloadDiscountDelete {
	admin_graphql_api_id: string;
}

/**
	* Handles the deletion of a discount code via webhook from Shopify.
	* 
	* This function is triggered when an admin deletes a discount code on Shopify.
	* It processes the incoming webhook payload containing the discount code ID
	* and deletes the corresponding discount code data from our app's database.
	* This ensures that the discount code is removed from our app's admin interface.
	* 
	* @param {PayloadDiscountDelete} payload - The payload containing the discount code ID to be deleted.
	* @param {string} shop - The Shopify store's domain (e.g., 'my-shop.myshopify.com').
*/

export const handleDiscountDelete = async (
	payload: PayloadDiscountDelete,
	shop: string,
) => {
	try {
		const discountCode = await prisma.discountCode.findFirst({
			where: { shop, discountId: payload.admin_graphql_api_id },
		});

		if (!discountCode) {
			return {
				success: false,
				message: 'Discount code not found with the provided criteria',
			};
		}

		const response = await prisma.session.findMany({
			where: { shop },
		});
		const accessToken = response[0]?.accessToken;

		if (!accessToken) {
			throw new Error('Access token not found');
		}

		const data = {
			query: payload.admin_graphql_api_id.includes('DiscountCodeNode')
				? DELETE_DISCOUNT_CODE_QUERY
				: DELETE_AUTOMATIC_DISCOUNT_CODE_QUERY,
			variables: {
				id: payload.admin_graphql_api_id,
			},
		};

		const responseFromShopify = await getDetailUsingGraphQL(
			shop,
			accessToken,
			data,
		);

		if (responseFromShopify?.data?.data) {
			await prisma.discountCode.delete({
				where: {
					id: discountCode.id,
				},
			});
		}
	} catch (error) {
		console.error('Error in discount delete webhook handler', error);
	}
};
