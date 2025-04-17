import { json } from '@remix-run/node';
import { fetchAllSegment } from 'app/controller/segments/fetchAllSegments';

export interface Segment {
	node: {
		id: string;
		query: string;
		name: string;
		creationDate: string;
		lastEditDate: string;
	}
};

export interface FetchSegmentResponse {
	success: boolean;
	message: string;
	segments: Segment[];
}

/**
	* Loader function to handle GET requests for segments.
	*
	* This function processes incoming GET requests to retrieve customer - related segments such as
	* query and name information.
	* The response is typically used to customer segment options in the app.
	*
	* @param {Request} request - The incoming HTTP request.
	* @returns {Promise<Response>} - A response containing segment data.
*/
export const loader = async ({
	request,
}: {
	request: Request;
}): Promise<Response> => {
	const url = new URL(request.url);
	const shop = url.searchParams.get('shop') ?? '';
    const response = await fetchAllSegment(shop);
    return json<FetchSegmentResponse>(response);
};
