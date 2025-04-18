export const GET_SEGMENTS_QUERY = `
query getSegments ($first: Int, $last: Int,  $after: String, $before: String, $query: String) {
	segments (first: $first, last: $last, after: $after, before: $before, query: $query, reverse: true) {
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
query getSegmentCustomerCount ($segmentId: ID!) {
	customerSegmentMembers (first: 1000, segmentId: $segmentId) {
		totalCount
	}
}`;

export const GET_SEGMENT_CUSTOMERS_QUERY = `
query getSegmentCustomers ($segmentId: ID!, $first: Int, $last: Int,  $after: String, $before: String) {
	customerSegmentMembers (first: $first, last: $last, after: $after, before: $before, segmentId: $segmentId) {
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

export const GET_SEGMENTS_COUNT_QUERY = `
query getSegmentsCount { 
	segmentsCount {
		count
		precision
	}
}`;