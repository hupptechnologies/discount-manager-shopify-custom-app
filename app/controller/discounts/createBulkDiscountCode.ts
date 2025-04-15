import prisma from "app/db.server";
import { getDetailUsingGraphQL } from "app/service/product";
import { createBulkDiscountCodes } from "app/service/store";
import { GET_DISCOUNT_CODES_QUERY } from "app/graphqlQuery/discount";

interface DataPayload {
	discountId: string;
	codes: string[];
}

/**
	* Creates multiple discount codes in bulk for a Shopify store.
	* 
	* This function generates multiple discount codes in bulk and applies them to a Shopify store.
	* The discount codes are created based on the provided data payload, which includes details
	* about the discount types, values, and other settings.
	* 
	* @param {string} shop - The domain of the Shopify store (e.g., 'my-shop.myshopify.com').
	* @param {DataPayload} dataPayload - The data payload that includes details for creating the discount codes.
*/

export const createBulkDiscountCode = async (shop: string, dataPayload: DataPayload) => {
	try {
		const response = await prisma.session.findMany({
			where: { shop },
		});
		const accessToken = response[0]?.accessToken;
		if (!accessToken) {
			throw new Error('Access token not found');
		}

		const allData = {
			query: GET_DISCOUNT_CODES_QUERY,
			variables: {
				id: dataPayload.discountId,
			},
		};

		const getAllCodes = await getDetailUsingGraphQL(shop, accessToken, allData);
		const existingCodes = getAllCodes?.data?.data?.codeDiscountNode?.codeDiscount?.codes?.edges?.map(
			(item: any) => item.node.code
		);

		const codesToCreate = dataPayload.codes.filter((code) => !existingCodes.includes(code));

		if (codesToCreate.length === 0) {
			console.log('All discount codes already exist');
		}
		const priceRuleId = dataPayload.discountId.split('/').pop() || '';

		for (let code of codesToCreate) {
			const data = {
				discount_code: { price_rule_id: priceRuleId, code },
			};
			const bulkCodeResponse = await createBulkDiscountCodes(priceRuleId, data, shop, accessToken);
			console.log(bulkCodeResponse.data, 'bulk code response');
		}
	} catch (error) {
		console.log(error, 'Error creating bulk discount codes');
	}
};