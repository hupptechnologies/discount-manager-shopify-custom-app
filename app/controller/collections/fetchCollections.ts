import prisma from '../../db.server';
import type { Collection } from 'app/routes/api.collections/route';
import { getDetailUsingGraphQL } from 'app/service/product';

const GET_COLLECTIONS_QUERY = `
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

const COLLECTION_COUNT_QUERY = `
	query CollectionsCount {
		collectionsCount {
			count
		}
	}
`;

interface PageInfo {
	endCursor: string | null;
	hasNextPage: boolean;
	hasPreviousPage: boolean;
	startCursor: string | null;
}

interface CollectionsCountResponse {
	data: {
		data: {
			collectionsCount: {
				count: number;
			};
		};
	};
}

interface GraphQLResponse {
	data: {
		data: {
			collections: {
				edges: {
					node: {
						id: string;
						title: string;
						image: {
							url: string;
						};
						productsCount: {
							count: number;
						};
					};
				}[];
				pageInfo: PageInfo;
			};
		};
	};
}

interface FetchCollectionResponse {
	collections: Collection[];
	pageInfo: PageInfo;
	totalCount: number;
}

/**
	* Fetches collections from Shopify.
	* 
	* This function fetches collections from the Shopify API based on provided parameters. 
	* It supports pagination through `after` and `before` parameters and allows filtering using a `query` string.
	* 
	* @param {string} shop - The shop's domain (e.g., 'my-shop.myshopify.com').
	* @param {string | null} [after] - The cursor to fetch results after a specific collection (for pagination).
	* @param {string | null} [before] - The cursor to fetch results before a specific collection (for pagination).
	* @param {string} [query] - The optional query string for filtering collections.
	* @returns {Promise<FetchCollectionResponse>} - A promise that resolves to the fetched collections data.
*/

export const fetchCollections = async (
	shop: string,
	after?: string | null,
	before?: string | null,
	query?: string,
): Promise<FetchCollectionResponse> => {
	try {
		const response = await prisma.session.findMany({
			where: { shop },
		});
		const accessToken = response[0]?.accessToken;

		if (!accessToken) {
			throw new Error('Access token not found');
		}

		const data = {
			query: GET_COLLECTIONS_QUERY,
			variables: after
				? { first: 5, after, query }
				: before
					? { last: 5, before, query }
					: { first: 5, query },
		};

		const collectionCount: CollectionsCountResponse =
			await getDetailUsingGraphQL(shop, accessToken, {
				query: COLLECTION_COUNT_QUERY,
			});

		const collectionResponse: GraphQLResponse = await getDetailUsingGraphQL(
			shop,
			accessToken,
			data,
		);

		const collections = collectionResponse?.data?.data?.collections?.edges;

		const collectionData: Collection[] =
			collections?.map((collection) => ({
				id: collection?.node?.id || '',
				title: collection?.node?.title || '',
				image: collection?.node?.image?.url || '',
				productCount: collection?.node?.productsCount?.count || 0,
			})) || [];
		return {
			collections: collectionData,
			pageInfo: collectionResponse?.data?.data?.collections?.pageInfo || {
				endCursor: null,
				hasNextPage: false,
				hasPreviousPage: false,
				startCursor: null,
			},
			totalCount: collectionCount?.data?.data?.collectionsCount.count || 0,
		};
	} catch (error) {
		// eslint-disable-next-line no-console
		console.log(error, 'Error fecthing collections');
		return {
			collections: [],
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
