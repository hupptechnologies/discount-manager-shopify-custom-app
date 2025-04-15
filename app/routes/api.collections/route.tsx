import { json } from '@remix-run/node';
import { fetchCollections } from '../../controller/collections/fetchCollections';

export interface Collection {
	id: string;
	title: string;
	productCount: number;
	image: string | null;
}

interface LoaderResponse {
	collections: Collection[];
	pageInfo: {
		endCursor: string | null;
		hasNextPage: boolean;
		hasPreviousPage: boolean;
		startCursor: string | null;
	};
	success: boolean;
	totalCount: number;
}

/**
	* Loader function to handle GET requests for the `api.collection` API route.
	* 
	* This function is triggered on a page load or fetch request in Remix,
	* and it processes incoming GET requests. Typically used to fetch
	* collection data from the Shopify store or our backend service.
	* 
	* @param {Request} request - The incoming HTTP request.
	* 
	* @returns {Promise<Response>} - A promise that resolves with a response containing
	* collection data or an error.
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

	const response = await fetchCollections(shop, after, before, query);

	return json<LoaderResponse>({
		collections: response.collections,
		pageInfo: response.pageInfo,
		success: true,
		totalCount: response?.totalCount ?? 0,
	});
};
