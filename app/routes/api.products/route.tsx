import { json } from '@remix-run/node';
import { fetchProducts } from '../../controller/products/fetchProducts';
import { FetchProductVariantsResult, fetchProductVariants } from 'app/controller/products/fetchProductVariants';

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

	if (id) {
		const response = await fetchProductVariants(shop, id);
		return json<FetchProductVariantsResult>(response)
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
