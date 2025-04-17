import { CUSTOMERS_COUNT_QUERY } from "app/graphqlQuery/customer";
import { GET_SEGMENTS_QUERY, GET_SEGMENT_CUSTOMER_COUNT_QUERY } from "app/graphqlQuery/segment";
import { FetchSegmentResponse, Segment } from "app/routes/api.segments/route";
import { getDetailUsingGraphQL } from "app/service/product";

export interface PageInfo {
	endCursor: string;
	hasNextPage: string;
	hasPreviousPage: string;
	startCursor: string;
};

interface GraphqlResponse {
	data: {
		data: {
			segments: {
				pageInfo: PageInfo | null;
				edges: Segment[]
			}
		}
	}
}

/**
	* Fetches all available customer segments for the given Shopify shop.
	*
	* This function is used to retrieve a list of customer segments defined in the shop,
	* including details like segment name, query, and creation dates.
	*
	* @param shop - The unique domain or identifier of the Shopify store.
	* @returns A Promise resolving to the list of customer segments (FetchSegmentResponse).
*/

export const fetchAllSegment = async (shop: string): Promise<FetchSegmentResponse> => {
	try {
		const response = await prisma.session.findMany({
			where: { shop },
		});
		const accessToken = response[0]?.accessToken;

		if (!accessToken) {
			throw new Error('Access token not found');
		}

		const getCustomerCount = await getDetailUsingGraphQL(shop, accessToken, { query: CUSTOMERS_COUNT_QUERY });
		const count = getCustomerCount?.data?.data?.customersCount?.count || 0;

		const data = {
			query: GET_SEGMENTS_QUERY 
		}
		const getSegments: GraphqlResponse = await getDetailUsingGraphQL(shop, accessToken, data);
		const segments = getSegments?.data?.data?.segments?.edges || [];
		const pageInfo = getSegments?.data?.data?.segments?.pageInfo || null;
		const segmentsWithCounts = await Promise.all(
			segments.map(async (item) => {
				const datas = { query: GET_SEGMENT_CUSTOMER_COUNT_QUERY, variables: { segmentId: item?.node?.id } };
				const customerCount = await getDetailUsingGraphQL(shop, accessToken, datas);
				return {
					...item?.node,
					percentage: (customerCount?.data?.data?.customerSegmentMembers?.totalCount / count) * 100 || 0,
				};
			})
		);
		return { success: true, message: 'Fetch all segments successfuly', segments: segmentsWithCounts || [], pageInfo };
	} catch (error) {
		console.error(error, 'Error fetching segments');
		return { success: true, message: '', segments: [], pageInfo: null };
	}
}