import { json } from '@remix-run/node';
import { fetchCollections } from '../../controller/collections/fetchCollections';

interface LoaderResponse {
	collections: any[];
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

	const response = await fetchCollections(shop, after, before, query);

	return json<LoaderResponse>({
		collections: response.collections,
		pageInfo: response.pageInfo,
		success: true,
		totalCount: response?.totalCount ?? 0,
	});
};
