import prisma from '../../db.server';
import { getDetailUsingGraphQL } from 'app/service/product';

const PRODUCT_VARIANT_QUERY = `
query GetProduct($ID: ID!) {
	product(id: $ID) {
		variantsCount{
			count
		}
		variants(first: 10) {
			edges{
				node {
					id
					title
					price
					inventoryQuantity
					image {
						url
					}
				}
			}
		}
	}
}`;

interface ProductVariant {
	id: string;
	title: string;
	price: string;
	inventoryQuantity: number;
	image: {
		url: string;
	};
}

interface ProductVariantsResponse {
	variantsCount: {
		count: number;
	};
	variants: {
		edges: {
			node: ProductVariant;
		}[];
	};
}

export interface FetchProductVariantsResult {
	success: boolean;
	variants?: ProductVariantsResponse;
	message?: string;
}

/**
	* Fetches all variants for a specific product in a Shopify store.
	* 
	* This function retrieves all variants associated with a given product ID from a Shopify store.
	* The product variants include different options like sizes, colors, prices, and inventory data.
	* 
	* @param {string} shop - The domain of the Shopify store (e.g., 'my-shop.myshopify.com').
	* @param {string} id - The unique ID of the product for which variants should be fetched.
	* 
	* @returns {Promise<FetchProductVariantsResult>} - A promise that resolves to an object containing all variants for the specified product.
*/

export const fetchProductVariants = async (
	shop: string,
	id: string,
): Promise<FetchProductVariantsResult> => {
	try {
		const response = await prisma.session.findMany({
			where: { shop },
		});
		const accessToken = response[0]?.accessToken;

		if (!accessToken) {
			throw new Error('Access token not found');
		}
		const data = {
			query: PRODUCT_VARIANT_QUERY,
			variables: {
				ID: id,
			},
		};
		const productResponse = await getDetailUsingGraphQL(
			shop,
			accessToken,
			data,
		);
		return { success: true, variants: productResponse?.data?.data?.product };
	} catch (error) {
		console.log(error, 'Error in fetching product variants');
		return {
			success: false,
			message: error instanceof Error ? error.message : 'Unknown error',
		};
	}
};
