export const GET_SEGMENTS_QUERY = `
query getSegments {
	segments(first: 100) {
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