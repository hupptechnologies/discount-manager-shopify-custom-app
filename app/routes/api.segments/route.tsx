import { json } from '@remix-run/node';
import { PageInfo, fetchAllSegment } from 'app/controller/segments/fetchAllSegments';
import { CustomerInput, fetchCustomerBySegmentId } from 'app/controller/segments/fetchCustomerBySegmentId';

interface SegmentInput {
	id: string;
	query: string;
	name: string;
	creationDate: string;
	lastEditDate: string;
	percentage: number;
}

export interface Segment {
	node: SegmentInput
};

export interface FetchSegmentResponse {
	success: boolean;
	message: string;
	segments: SegmentInput[];
	pageInfo: PageInfo | null;
	totalCount: number;
}

export interface CustomerBySegmentIdResponse {
	success: boolean;
	message: string;
	segmentCustomers: CustomerInput[];
	pageInfo: PageInfo | null;
	totalCount: number;
}

/**
	* Handles GET requests to retrieve customer segments or customers within a segment.
	*
	* - If `segmentId` is provided in the query params, it fetches customers in that segment using `fetchCustomerBySegmentId`.
	* - If no `segmentId` is provided, it fetches all available segments using `fetchAllSegment`.
	*
	* @param {Request} request - The incoming HTTP request.
	* @returns {Promise<Response>} - A JSON response with segment list or customer data.
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
	const segmentId = url.searchParams.get('segmentId');
	if (segmentId) {
		const response = await fetchCustomerBySegmentId(shop, segmentId, after, before);
		return json<CustomerBySegmentIdResponse>(response);
	}
	const response = await fetchAllSegment(shop, after, before, query);
	return json<FetchSegmentResponse>(response);
};
