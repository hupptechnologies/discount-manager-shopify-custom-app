import prisma from '../db.server';
import { DiscountCodeBasic, DiscountCodeBxgy } from 'app/controller/discounts/getDiscountCodeById';
import { getDetailUsingGraphQL } from 'app/service/product';
import { GET_ALL_DISCOUNT_DETAILS_QUERY } from './handleDiscountCreate';

interface PayloadDiscountCreate {
	admin_graphql_api_id: string;
	title: string;
	status: string;
	created_at: string;
	updated_at: string;
}

interface GraphQLResponse {
	data: {
		data: {
			codeDiscountNode: {
				id: string;
				codeDiscount: DiscountCodeBasic | DiscountCodeBxgy;
			};
			automaticDiscountNode: {
				id: string;
				automaticDiscount: DiscountCodeBasic | DiscountCodeBxgy;
			};
		};
	};
}

/**
	* Handles the update of a discount code via webhook from Shopify.
	* 
	* This function is triggered when an admin updates the details of a discount 
	* code on Shopify. It processes the incoming webhook payload containing the 
	* updated discount code information and updates the corresponding data in 
	* our app's database, ensuring that the latest details are reflected in the 
	* discount code stored in our system.
	* 
	* @param {PayloadDiscountCreate} payload - The payload containing the updated details of the discount code.
	* @param {string} shop - The Shopify store's domain (e.g., 'my-shop.myshopify.com').
	* 
	* @returns {Promise<void>} 
	* - A promise that resolves when the discount code has been successfully updated in the database.
*/

export const handleDiscountUpdate = async (
	payload: PayloadDiscountCreate,
	shop: string,
): Promise<void> => {
	try {
		const isCustom = payload?.admin_graphql_api_id?.includes('DiscountCodeNode');

		const discountCodeResponse = await prisma.discountCode.findFirst({
			where: { shop, discountId: payload.admin_graphql_api_id },
		});

		const discountScope = discountCodeResponse?.discountScope;

		if (!discountCodeResponse) {
			return;
		}

		const response = await prisma.session.findMany({
			where: { shop },
		});
		const accessToken = response[0]?.accessToken;

		if (!accessToken) {
			throw new Error('Access token not found');
		}

		const data = {
			query: GET_ALL_DISCOUNT_DETAILS_QUERY,
			variables: {
				ID: payload.admin_graphql_api_id,
			},
		};

		const graphQlResponse: GraphQLResponse = await getDetailUsingGraphQL(
			shop,
			accessToken,
			data,
		);
		
		const {
			discountClass,
			title,
			startsAt,
			endsAt,
			customerGets,
			maximumShippingPrice,
		} = isCustom ? graphQlResponse?.data?.data?.codeDiscountNode?.codeDiscount : graphQlResponse?.data?.data?.automaticDiscountNode?.automaticDiscount;

		if (!discountClass || !title || !startsAt || !endsAt) {
			console.error('Missing required discount data', graphQlResponse?.data?.data?.codeDiscountNode, graphQlResponse?.data?.data?.automaticDiscountNode);
			return;
		}
		const discountCodeData = isCustom ? graphQlResponse?.data?.data?.codeDiscountNode?.codeDiscount : graphQlResponse?.data?.data?.automaticDiscountNode?.automaticDiscount;
		const discountCode = isCustom ? discountCodeData?.codes?.edges[0]?.node?.code : title;
		const discountAmount = discountScope === 'BUYXGETY' ? (customerGets?.value && 'effect' in customerGets.value ? Number(customerGets.value.effect.percentage) * 100 : 0)
			: (customerGets?.value && 'percentage' in customerGets.value ? Number(customerGets.value.percentage) * 100 : 0);
		const usageLimit = 'usageLimit' in discountCodeData ? discountCodeData.usageLimit ?? 0 : 0;
		const usesPerOrderLimit = 'usesPerOrderLimit' in discountCodeData ? discountCodeData.usesPerOrderLimit ?? 0 : 0;
	  
		await prisma.discountCode.update({
			where: {
				shop,
				id: discountCodeResponse?.id,
				discountId: payload.admin_graphql_api_id,
			},
			data: {
				code: discountCode,
				title: title,
				shop,
				discountId: payload.admin_graphql_api_id,
				startDate: new Date(startsAt),
				endDate: new Date(endsAt),
				discountAmount: discountScope == 'SHIPPING' ? Number(maximumShippingPrice?.amount) : discountAmount,
				discountType: 'PERCENT',
				usageLimit: isCustom ? usageLimit : usesPerOrderLimit,
				isActive: true,
			},
		});
	} catch (error) {
		console.error('Error in discount update webhook handler', error);
	}
};