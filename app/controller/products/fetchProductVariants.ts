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

export const fetchProductVariants = async (
	shop: string,
	id: string
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
		const productResponse = await getDetailUsingGraphQL(shop, accessToken, data);
		return { success: true, variants: productResponse?.data?.data?.product };
	} catch (error) {
		console.log(error, 'Error in fetching product variants');
		return { success: false, message: error instanceof Error ? error.message : 'Unknown error' };
	}
};