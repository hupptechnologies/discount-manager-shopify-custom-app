import { GET_SEGMENTS_QUERY } from "app/graphqlQuery/segment";
import { FetchSegmentResponse, Segment } from "app/routes/api.segments/route";
import { getDetailUsingGraphQL } from "app/service/product";

interface GraphqlResponse {
	data: {
		data: {
			segments: {
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
		const data = {
			query: GET_SEGMENTS_QUERY 
		}
		const getSegments: GraphqlResponse = await getDetailUsingGraphQL(shop, accessToken, data);
		return { success: true, message: 'Fetch all segments successfuly', segments: getSegments?.data?.data?.segments?.edges || [] };
	} catch (error) {
		console.error(error, 'Error fetching segments');
		return { success: true, message: '', segments: [] };
	}
}