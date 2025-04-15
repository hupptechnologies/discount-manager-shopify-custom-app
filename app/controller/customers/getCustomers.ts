import { getDetailUsingGraphQL } from "app/service/product";
import { GET_CUSTOMERS_QUERY, CUSTOMERS_COUNT_QUERY } from "app/graphqlQuery/customer";

interface FetchCustomersProps {
	customers: Array<{
		id: string;
		name: string;
		image: string;
		email: string;
	}>;
	pageInfo: {
		endCursor: string | null;
		hasNextPage: boolean;
		hasPreviousPage: boolean;
		startCursor: string | null;
	};
	totalCount: number;
}

interface CustomersCountResponse {
	data: {
		data: {
			customersCount: {
				count: number;
			};
		};
	};
}

interface PageInfo {
	endCursor: string | null;
	hasNextPage: boolean;
	hasPreviousPage: boolean;
	startCursor: string | null;
}

interface GraphQLResponse {
	data: {
		data: {
			customers: {
				edges: {
					node: {
						id: string;
						displayName: string;
						email: string;
						image: {
							url: string;
						};
						numberOfOrders: string;
					};
				}[];
				pageInfo: PageInfo;
			};
		};
	};
}

/**
	* Fetches a list of customers from a Shopify store.
	* 
	* This function retrieves a list of customers from the specified Shopify store. 
	* You can paginate through customers using the `after` and `before` parameters, 
	* and filter the results using a search query.
	* 
	* @param {string} shop - The domain of the Shopify store (e.g., 'my-shop.myshopify.com').
	* @param {string | null} [after] - The cursor for fetching results after a specific customer. Used for pagination.
	* @param {string | null} [before] - The cursor for fetching results before a specific customer. Used for pagination.
	* @param {string} [query] - An optional search query to filter customers by specific criteria (e.g., name, email).
	* 
	* @returns {Promise<FetchCustomersProps>} - A promise that resolves to a list of customers with their details.
*/

export const fetchCustomers = async (
	shop: string,
	after?: string | null,
	before?: string | null,
	query?: string,
): Promise<FetchCustomersProps> => {
	try {
		const response = await prisma.session.findMany({
			where: { shop },
		});
		const accessToken = response[0]?.accessToken;

		if (!accessToken) {
			throw new Error('Access token not found');
		}

		const data = {
			query: GET_CUSTOMERS_QUERY,
			variables: after
				? { first: 5, after, query }
				: before
					? { last: 5, before, query }
					: { first: 5, query },
		};

		const customersCount: CustomersCountResponse = await getDetailUsingGraphQL(shop, accessToken, { query: CUSTOMERS_COUNT_QUERY });

		const customerResponse: GraphQLResponse = await getDetailUsingGraphQL(shop, accessToken, data);

		const customers = customerResponse?.data?.data?.customers?.edges;

		const customerData =
			customers?.map((customer) => ({
				id: customer?.node?.id || '',
				name: customer?.node?.displayName || '',
				image: customer?.node?.image?.url || '',
				email: customer?.node?.email
			})) || [];
		return {
			customers: customerData,
			pageInfo: customerResponse?.data?.data?.customers?.pageInfo || {
				endCursor: null,
				hasNextPage: false,
				hasPreviousPage: false,
				startCursor: null,
			},
			totalCount: customersCount?.data?.data?.customersCount.count || 0,
		};
	} catch (error) {
		console.log(error, 'Error fecthing customers');
		return {
			customers: [],
			pageInfo: {
				endCursor: null,
				hasNextPage: false,
				hasPreviousPage: false,
				startCursor: null,
			},
			totalCount: 0,
		};
	}
};