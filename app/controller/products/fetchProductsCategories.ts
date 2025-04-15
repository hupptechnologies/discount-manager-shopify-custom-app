import prisma from "app/db.server";
import { FetchCategoryResponse } from "app/routes/api.products/route";
import { getDetailUsingGraphQL } from "app/service/product";
import { GET_CATEGORIES_QUERY } from "app/graphqlQuery/product";

interface GraphqlResponse {
	data: {
		data: {
			taxonomy:{
				categories: {
					edges: {
						node: {
							id: string;
							name: string;
							fullName: string;
							childrenIds: string[];
							parentId: string;
						};
					}[];
				};
			};
		};
	};
};

/**
	* Fetches all categories, including subcategories, from a Shopify store.
	* 
	* This function retrieves all available categories in a Shopify store, including nested subcategories.
	* It uses the provided `childrenOf` parameter to fetch categories and subcategories for a specific parent category.
	* 
	* @param {string} shop - The domain of the Shopify store (e.g., 'my-shop.myshopify.com').
	* @param {string} childrenOf - The ID or handle of the parent category to fetch subcategories for.
	* 
	* @returns {Promise<FetchCategoryResponse>} - A promise that resolves to an object containing the categories and their subcategories for the given shop.
*/

export const fetchAllCategories = async (shop: string, childrenOf: string): Promise<FetchCategoryResponse> => {
	try {
		const response = await prisma.session.findMany({
			where: { shop },
		});
		const accessToken = response[0]?.accessToken;
		if (!accessToken) {
			throw new Error('Access token not found');
		}
		const data = {
			query: GET_CATEGORIES_QUERY(childrenOf)
		};
		const taxonomyRes: GraphqlResponse = await getDetailUsingGraphQL(shop, accessToken, data);
		const categories = taxonomyRes?.data?.data?.taxonomy?.categories?.edges || [];
		return { success: true, message: 'Retrive all products categories', categories };
	} catch (error) {
		console.log(error, 'Error while fetching categories');
		return { success: false, message: 'Something went wrong', categories: [] };
	}
};