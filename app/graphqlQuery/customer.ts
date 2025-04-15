export const GET_CUSTOMERS_QUERY = `
query GetCustomers($first: Int, $last: Int, $after: String, $before: String, $query: String) {
	customers(first: $first, last: $last, after: $after, before: $before, query: $query) {
		pageInfo {
			endCursor
			hasNextPage
			hasPreviousPage
			startCursor
		}
		edges {
			node {
				id
				displayName
				email
				image {
					url
				}
				numberOfOrders
			}
		}
	}
}`;

export const CUSTOMERS_COUNT_QUERY = `
query getCustomers {
	customersCount {
		count
	}
}`;