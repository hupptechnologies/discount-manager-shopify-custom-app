import { getDetailUsingGraphQL } from "app/service/product";
import { DELETE_BULK_REDEEM_DISCOUNT_CODES_QUERY } from "app/graphqlQuery/mutationDiscount";

interface DataPayload {
	discountId: string;
	ids: string[];
}

/**
	* Deletes multiple basic discount codes (bulk redeem codes) that were created previously, one by one.
	* 
	* This function takes a list of **discount IDs** and their corresponding **bulk redeem IDs**, 
	* and deletes those specific discount codes from the Shopify store.
	* 
	* - The `discountID` is the ID of the specific discount code.
	* - The `bulkRedeemIDs` is an array of IDs associated with multiple redeemable discount codes for the specific discount.
	* 
	* The function processes each ID in the payload to ensure that all related discount codes are removed from the Shopify store 
	* as well as from the app's database.
	* 
	* @param {string} shop - The domain of the Shopify store (e.g., 'my-shop.myshopify.com').
	* @param {DataPayload} dataPayload - The payload containing the `discountID` and an array of `bulkRedeemIDs` we called `ids` to be deleted.
*/

export const deleteBulkRedeemDiscountCode = async (shop: string, dataPayload: DataPayload) => {
	const { discountId, ids } = dataPayload;
	try {
		const response = await prisma.session.findMany({
			where: { shop },
		});
		const accessToken = response[0]?.accessToken;

		if (!accessToken) {
			throw new Error('Access token not found');
		}

		const data = {
			query: DELETE_BULK_REDEEM_DISCOUNT_CODES_QUERY,
			variables: {
				discountId,
				ids,
			}
		};

		const deleteResponse = await getDetailUsingGraphQL(shop, accessToken, data);

		if (deleteResponse?.data?.discountCodeRedeemCodeBulkDelete?.userErrors?.length > 0) {
			throw new Error(deleteResponse.data.discountCodeRedeemCodeBulkDelete.userErrors.map((err: any) => err.message).join(', '));
		}

		return { success: true, message: 'Bulk redeem discount code delete successfully' };
	} catch (error) {
		console.error(error);
		return { success: false, message: 'Something went wrong' };
	}
};