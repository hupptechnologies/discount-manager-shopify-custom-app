import { GET_SEGMENT_CUSTOMERS_QUERY } from "app/graphqlQuery/segment";
import { CustomerBySegmentIdResponse } from "app/routes/api.segments/route";
import { getDetailUsingGraphQL } from "app/service/product";
import { PageInfo } from "./fetchAllSegments";

export interface CustomerInput {
	displayName: string;
	defaultEmailAddress: {
		marketingState: string;
	};
	defaultAddress: {
		city: string;
		province: string;
		country: string;
	};
	amountSpent: {
		amount: string;
		currencyCode: string;
	}
	numberOfOrders: string;
}

interface GraphqlResponse {
	data: {
		data: {
			customerSegmentMembers: {
				pageInfo: PageInfo | null;
				edges: {
					node: CustomerInput;
				}[];
			}
		}
	}
}

/**
	* Fetches customers from a specific Shopify segment.
	*
	* Retrieves:
	*  - Email status, location, total spent, order count
	*
	* @param shop - Shopify store domain
	* @param segmentId - Shopify segment ID
	* @returns Promise with customer data for the segment
*/
export const fetchCustomerBySegmentId = async (shop: string, segmentId: string): Promise<CustomerBySegmentIdResponse> => {
	try {
		const response = await prisma.session.findMany({
			where: { shop },
		});
		const accessToken = response[0]?.accessToken;

		if (!accessToken) {
			throw new Error('Access token not found');
		}

		const data = {
			query: GET_SEGMENT_CUSTOMERS_QUERY,
			variables: {
				segmentId
			}
		}
		const getSegmentCustomers: GraphqlResponse = await getDetailUsingGraphQL(shop, accessToken, data);
		const segmentCustomers = getSegmentCustomers?.data?.data?.customerSegmentMembers?.edges?.map(item=> item?.node) || [];
		const pageInfo = getSegmentCustomers?.data?.data?.customerSegmentMembers?.pageInfo || null;
		return { success: true, message: 'Fetch segment customers successfuly', segmentCustomers, pageInfo };
	} catch (error) {
		console.log(error);
		return { success: false, message: '', segmentCustomers: [], pageInfo: null }
	}
}