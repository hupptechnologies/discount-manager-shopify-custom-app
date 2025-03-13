import { json } from '@remix-run/node';
import { fetchProducts } from '../../controller/products/fetchProducts';

interface LoaderResponse {
	products: any[];
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

	const response = await fetchProducts(shop, after, before, query);

	return json<LoaderResponse>({
		products: response.products,
		pageInfo: response.pageInfo,
		success: true,
		totalCount: response?.totalCount ?? 0,
	});
};
