import { json } from '@remix-run/node';
import { fetchCustomers } from '../../controller/customers/getCustomers';

export interface Customer {
	id: string;
	name: string;
	email: string;
	image: string | null;
}

interface LoaderResponse {
	customers: Customer[];
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

	const response = await fetchCustomers(shop, after, before, query);

	return json<LoaderResponse>({
		customers: response.customers,
		pageInfo: response.pageInfo,
		success: true,
		totalCount: response?.totalCount ?? 0,
	});
};
