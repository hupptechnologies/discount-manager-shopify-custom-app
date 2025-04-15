export const PRODUCT_VARIANTS_QUERY = `
	query GetProductVariants($first: Int, $last: Int,  $after: String, $before: String, $query: String) {
		productVariants(first: $first, last: $last, after: $after, before: $before, query: $query) {
			pageInfo {
				endCursor
				hasNextPage
				hasPreviousPage
				startCursor
			}
			edges {
				node {
					id
					title
					price
					inventoryQuantity
					product {
						title
						variantsCount {
							count
						}
						featuredMedia {
							preview {
								image {
									url
								}
							}
						}
					}
				}
			}
		}
	}
`;

export const PRODUCT_VARIANTS_COUNT_QUERY = `
	query ProductVariantsCount {
		productVariantsCount {
			count
		}
	}
`;

export const GET_CATEGORIES_QUERY = (childrenOf: string) => `
query GetAllCategories {
	taxonomy {
		categories(first: 250${childrenOf ? `, childrenOf: "${childrenOf}"` : ''}) {
			edges {
				node {
					id
					name
					fullName
					childrenIds
					parentId
				}
			}
		}
	}
}`;

export const PRODUCT_VARIANT_BY_ID_QUERY = `
query GetProduct($ID: ID!) {
	product(id: $ID) {
		variantsCount{
			count
		}
		variants(first: 10) {
			edges{
				node {
					id
					title
					price
					inventoryQuantity
					image {
						url
					}
				}
			}
		}
	}
}`;