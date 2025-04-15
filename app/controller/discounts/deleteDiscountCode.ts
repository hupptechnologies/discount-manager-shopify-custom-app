import prisma from 'app/db.server';
import { getDetailUsingGraphQL } from 'app/service/product';
import { DELETE_DISCOUNT_CODE_QUERY, DELETE_AUTOMATIC_DISCOUNT_CODE_QUERY } from 'app/graphqlQuery/mutationDiscount';

interface DeleteResponse {
	success: boolean;
	message: string;
}

interface DeleteDiscountCodeInput {
	id: number;
	code: string;
	discountId: string;
}

/**
	* Deletes a single discount code (either basic or automated) from the Shopify store and the app's database.
	* 
	* This function allows you to delete one discount code at a time, whether it's a basic discount or an automated discount code.
	* The function will process the deletion of the provided discount code based on the `discountID` passed in the payload.
	* 
	* - The `discountID` refers to the unique identifier of the discount code that you want to delete.
	* 
	* The function ensures that the specified discount code is removed both from the Shopify store and from the app’s database.
	* 
	* @param {string} shop - The domain of the Shopify store (e.g., 'my-shop.myshopify.com').
	* @param {DeleteDiscountCodeInput} dataPayload - The payload containing the `discountID` of the discount code to be deleted.
	* 
	* @returns {Promise<DeleteResponse>} - A promise that resolves with the status of the deletion process.
*/

export const deleteDiscountCode = async (
	shop: string,
	dataPayload: DeleteDiscountCodeInput,
): Promise<DeleteResponse> => {
	const { id, code, discountId }: DeleteDiscountCodeInput = dataPayload;

	try {
		if (!id || !code || !discountId) {
			return {
				success: false,
				message: 'Required fields id, code, discountId',
			};
		}
		const discountCode = await prisma.discountCode.findFirst({
			where: { shop, code, id, discountId },
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
			query: discountId.includes('DiscountCodeNode')
				? DELETE_DISCOUNT_CODE_QUERY
				: DELETE_AUTOMATIC_DISCOUNT_CODE_QUERY,
			variables: {
				id: discountId,
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

		return {
			success: true,
			message: 'Discount code deleted successfully',
		};
	} catch (error) {
		// eslint-disable-next-line no-console
		console.error('Error deleting discount code: ', error);
		return {
			success: false,
			message: 'Failed to delete discount code',
		};
	}
};
