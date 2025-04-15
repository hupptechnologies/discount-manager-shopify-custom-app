export const GET_COLLECTIONS_QUERY = `
	query GetCollections($first: Int, $last: Int, $after: String, $before: String, $query: String) {
		collections(first: $first, last: $last, after: $after, before: $before, query: $query) {
			pageInfo {
				endCursor
				startCursor
				hasNextPage
				hasPreviousPage
			}
			edges {
				node {
					id
					image {
						url
					}
					title
					productsCount {
						count
					}
				}
			}
		}
	}
`;

export const COLLECTION_COUNT_QUERY = `
	query CollectionsCount {
		collectionsCount {
			count
		}
	}
`;