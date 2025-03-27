import prisma from '../../db.server';
import { ProductVariant } from 'app/routes/api.products/route';
import { getDetailUsingGraphQL } from '../../service/product';

const PRODUCT_VARIANTS_QUERY = `
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

const PRODUCT_VARIANTS_COUNT_QUERY = `
	query ProductVariantsCount {
		productVariantsCount {
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

interface ProductVariantCountResponse {
	data: {
		data: {
			productVariantsCount: {
				count: number;
			};
		};
	};
}

interface GraphQLResponse {
	data: {
		data: {
			productVariants: {
				edges: {
					node: {
						id: string;
						title: string;
						price: string;
						inventoryQuantity: number;
						product: {
							title: string;
							variantsCount: {
								count: number;
							};
							featuredMedia: {
								preview: {
									image: {
										url: string;
									};
								};
							};
						};
					};
				}[];
				pageInfo: PageInfo;
			};
		};
	};
}

interface FetchProductsResponse {
	products: ProductVariant[];
	pageInfo: PageInfo;
	totalCount: number;
}

export const fetchProducts = async (
	shop: string,
	after?: string | null,
	before?: string | null,
	query?: string,
): Promise<FetchProductsResponse> => {
	try {
		const response = await prisma.session.findMany({
			where: { shop },
		});
		const accessToken = response[0]?.accessToken;

		if (!accessToken) {
			throw new Error('Access token not found');
		}

		const data = {
			query: PRODUCT_VARIANTS_QUERY,
			variables: after
				? { first: 5, after, query }
				: before
					? { last: 5, before, query }
					: { first: 5, query },
		};

		const productResponse: GraphQLResponse = await getDetailUsingGraphQL(
			shop,
			accessToken,
			data,
		);
		const products = productResponse?.data?.data?.productVariants?.edges;

		const productData: ProductVariant[] =
			products?.map((product) => ({
				id: product?.node?.id || '',
				variant: product?.node?.title || '',
				title: product?.node?.product?.title || '',
				price: product?.node?.price || '',
				quantity: product?.node?.inventoryQuantity || 0,
				variantsCount: product?.node?.product?.variantsCount,
				image:
					product?.node?.product?.featuredMedia?.preview?.image?.url || null,
			})) || [];

		const productVariantCount: ProductVariantCountResponse =
			await getDetailUsingGraphQL(shop, accessToken, {
				query: PRODUCT_VARIANTS_COUNT_QUERY,
			});

		return {
			products: productData,
			pageInfo: productResponse?.data?.data?.productVariants?.pageInfo || {
				endCursor: null,
				hasNextPage: false,
				hasPreviousPage: false,
				startCursor: null,
			},
			totalCount:
				productVariantCount?.data?.data?.productVariantsCount?.count || 0,
		};
	} catch (error) {
		// eslint-disable-next-line no-console
		console.error(error, 'Error fetching products');
		return {
			products: [],
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
