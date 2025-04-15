import prisma from 'app/db.server';
import { getDetailUsingGraphQL } from 'app/service/product';

interface DeleteResponse {
	success: boolean;
	message: string;
}

const DELETE_DISCOUNT_CODE_QUERY = `
mutation DeleteDiscountCode($id: ID!) {
	discountCodeDelete(id: $id) {
		deletedCodeDiscountId
		userErrors {
			field
			code
			message
		}
	}
}`;

const DELETE_AUTOMATIC_DISCOUNT_CODE_QUERY = `
mutation DeleteDiscountCode($id: ID!) {
	discountAutomaticDelete(id: $id) {
		deletedAutomaticDiscountId
		userErrors {
			field
			code
			message
		}
	}
}`;

/**
	* Deletes all discount codes (both basic and automated) created by the app from both the app's database and the Shopify store.
	* 
	* This function performs a two-step process:
	* 1. It deletes all **basic** and **automated** discount codes created by the app in the app's database.
	* 2. It removes the corresponding discount codes from the Shopify store.
	* 
	* The function will handle different types of discount codes, ensuring that both basic discount codes (such as percentage, fixed amount) 
	* and automated discount codes (such as "Buy X Get Y" or other automatic discount rules) are fully removed.
	* 
	* @param {string} shop - The domain of the Shopify store (e.g., 'my-shop.myshopify.com').
	* 
	* @returns {Promise<DeleteResponse>} - A promise that resolves with an object containing the status of the deletion process.
*/

export const deleteAllDiscountCodes = async (
	shop: string,
): Promise<DeleteResponse> => {
	try {
		const discountCodes = await prisma.discountCode.findMany({
			where: { shop },
		});

		if (discountCodes.length === 0) {
			return {
				success: false,
				message: 'No discount codes found for the shop',
			};
		}

		const response = await prisma.session.findMany({
			where: { shop },
		});

		const accessToken = response[0]?.accessToken;

		if (!accessToken) {
			throw new Error('Access token not found');
		}

		let successCount = 0;
		let failureCount = 0;

		for (const discountCode of discountCodes) {
			const data = {
				query: discountCode.discountId.includes('DiscountCodeNode')
					? DELETE_DISCOUNT_CODE_QUERY
					: DELETE_AUTOMATIC_DISCOUNT_CODE_QUERY,
				variables: {
					id: discountCode.discountId,
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
				successCount++;
			} else {
				failureCount++;
			}
		}

		return {
			success: successCount > 0,
			message:
				successCount > 0
					? `Successfully deleted ${successCount} discount codes.`
					: `Failed to delete ${failureCount} discount codes.`,
		};
	} catch (error) {
		// eslint-disable-next-line no-console
		console.error('Error deleting all discount codes: ', error);
		return {
			success: false,
			message: 'Failed to delete all discount codes',
		};
	}
};
