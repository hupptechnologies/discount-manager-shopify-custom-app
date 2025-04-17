export const GET_SEGMENTS_QUERY = `
query getSegments {
	segments(first: 100, reverse: true) {
		pageInfo {
			endCursor
			hasNextPage
			hasPreviousPage
			startCursor
		}
		edges {
			node {
				id
				query
				name
				creationDate
				lastEditDate
			}
		}
	}
}`;

export const GET_SEGMENT_CUSTOMER_COUNT_QUERY = `
query getSegmentCustomerCount($segmentId: ID!) {
	customerSegmentMembers(first: 1000, segmentId: $segmentId) {
		totalCount
	}
}`;

export const GET_SEGMENT_CUSTOMERS_QUERY = `
query getSegmentCustomers($segmentId: ID!, $first: Int = 1000) {
	customerSegmentMembers(first: $first, segmentId: $segmentId) {
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
				defaultEmailAddress {
					marketingState
				}
				defaultAddress {
					city
					province
					country
				}
				amountSpent {
					amount
					currencyCode
				}
				numberOfOrders
			}
		}
	}
}`;