import prisma from '../../db.server';
import { getDetailUsingGraphQL } from "app/service/product";

const GET_DISCOUNT_CODE_DETAILS_QUERY = `
query getDiscountCode($query: String!) {
	codeDiscountNodes(first: 1, query: $query) {
		nodes {
			id
			codeDiscount {
				__typename
				... on DiscountCodeBasic {
					status
					title
					startsAt
					endsAt
					codes(first: 1) {
						edges {
							node {
								code
							}
						}
					}
					customerGets {
						value {
							... on DiscountPercentage {
								percentage
							}
						}
						items {
							... on DiscountProducts {
								productVariants(first: 10) {
									edges {
										node {
											title
											id
										}
									}
								}
							}
						}
					}
					usageLimit
					appliesOncePerCustomer
				}
			}
		}
	}
}`;

interface DiscountQueryResponse {
	data: {
		data: {
			codeDiscountNodes: {
				nodes: {
					id: string;
					codeDiscount: {
						__typename: string;
						status: string;
						title: string;
						startsAt: string;
						endsAt: string;
						codes: {
							edges: {
								node: {
									code: string;
								};
							}[];
						};
						customerGets: {
							value: {
								percentage: number;
							};
							items: {
								productVariants: {
									edges: {
										node: {
											id: string;
											title: string;
										};
									}[];
								};
								products: {
									edges: {
										node: {
											id: string;
											title: string;
										};
									}[];
								};
							}[];
						};
						usageLimit: number | null;
						appliesOncePerCustomer: boolean;
					};
				}[];
			};
		}
	}
}

export const getDiscountCodeById = async (id: number, shop: string): Promise<{
	success: boolean;
	message: string;
	discountCode: object | null;
}> => {
	try {
		const response = await prisma.session.findMany({
			where: { shop },
		});
		const accessToken = response[0]?.accessToken;

		if (!accessToken) {
			throw new Error('Access token not found');
		}
		
		const data = {
			query: GET_DISCOUNT_CODE_DETAILS_QUERY,
			variables: {
				query: `id:${id}`
			}
		}
		const getDiscountCodeByIdFromShopify: DiscountQueryResponse = await getDetailUsingGraphQL(shop, accessToken, data);
		const discountCode = getDiscountCodeByIdFromShopify.data?.data?.codeDiscountNodes || null;
		if (getDiscountCodeByIdFromShopify.data?.data?.codeDiscountNodes?.nodes) {
			return { success: true, discountCode: discountCode?.nodes, message: 'Fetch discount code successfuly' };
		}

		return { success: false, message: 'Record not found!', discountCode: null, };
	} catch (error) {
		console.log(error, 'Error fetching dicount code details using an discount id');
		return { success: false, discountCode: [], message: 'Something went wrong' };
	}
};