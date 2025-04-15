import { json } from '@remix-run/node';
import { fetchProducts } from '../../controller/products/fetchProducts';
import type { FetchProductVariantsResult } from 'app/controller/products/fetchProductVariants';
import { fetchProductVariants } from 'app/controller/products/fetchProductVariants';
import { fetchAllCategories } from 'app/controller/products/fetchProductsCategories';

export interface ProductVariant {
	id: string;
	variant: string;
	title: string;
	price: string;
	quantity: number;
	image: string | null;
}

interface LoaderResponse {
	products: ProductVariant[];
	pageInfo: {
		endCursor: string | null;
		hasNextPage: boolean;
		hasPreviousPage: boolean;
		startCursor: string | null;
	};
	success: boolean;
	totalCount: number;
}

export interface FetchCategoryResponse {
	success: boolean;
	message: string;
	categories: object | null;
}

/**
	* Loader function to handle GET requests for products, including variants and categories.
	*
	* This function processes incoming GET requests to retrieve product-related data such as
	* product listings, their associated variants, and category information.
	* The response is typically used to populate product selection options in the app.
	*
	* @param {Request} request - The incoming HTTP request.
	* @returns {Promise<Response>} - A response containing product, variant, and category data.
*/
export const loader = async ({
	request,
}: {
	request: Request;
}): Promise<Response> => {
	const url = new URL(request.url);
	const shop = url.searchParams.get('shop') ?? '';
	const after = url.searchParams.get('after') ?? null;
	const before = url.searchParams.get('before') ?? null;
	const query = url.searchParams.get('query') ?? '';
	const id = url.searchParams.get('id');
	const type = url.searchParams.get('type');
	const childrenOf = url.searchParams.get('childrenOf') ?? '';
	if (type === 'category') {
		const response = await fetchAllCategories(shop, childrenOf);
		return json<FetchCategoryResponse>(response);
	}
	if (id) {
		const response = await fetchProductVariants(shop, id);
		return json<FetchProductVariantsResult>(response);
	} else {
		const response = await fetchProducts(shop, after, before, query);
		return json<LoaderResponse>({
			products: response.products,
			pageInfo: response.pageInfo,
			success: true,
			totalCount: response?.totalCount ?? 0,
		});
	}
};
