import prisma from '../db.server';
import { DiscountCodeBasic, DiscountCodeBxgy } from 'app/controller/discounts/getDiscountCodeById';
import { getDetailUsingGraphQL } from 'app/service/product';

const GET_BASIC_DISCOUNT_CODE_QUERY = `
query getDiscountCode($ID: ID!) {
	codeDiscountNode(id: $ID) {
		codeDiscount {
			... on DiscountCodeBasic {
				status
				title
				startsAt
				endsAt
				discountClass
				codes(first: 1) {
					edges {
						node {
							code
						}
					}
				}
				customerGets {
					value {
						...on DiscountPercentage {
							percentage
						}
					}
				}
				usageLimit
				appliesOncePerCustomer
			}
		}
	}
}`;

const GET_AUTOMATIC_BASIC_DISCOUNT_CODE_QUERY = `
query getDiscountCode($ID: ID!) {
	automaticDiscountNode(id: $ID) {
		id
		automaticDiscount {
			... on DiscountAutomaticBasic {
				status
				title
				startsAt
				endsAt
				discountClass
				customerGets {
					value {
						... on DiscountPercentage {
							percentage
						}
					}
				}
			}
		}
	}
}`;

const GET_BUYXGETY_DISCOUNT_CODE_QUERY = `
query getDiscountcode($ID: ID!) {
	codeDiscountNode(id: $ID) {
		id
		codeDiscount {
			__typename
			... on DiscountCodeBxgy {
				status
				title
				startsAt
				endsAt
				discountClass
				usesPerOrderLimit
				codes(first: 1) {
					edges {
						node {
							code
						}
					}
				}
				customerGets {
					value {
						... on DiscountOnQuantity {
							effect {
								... on DiscountPercentage {
									percentage
								}
							}
						}
					}
				}
			}
		}
	}
}`;

const GET_AUTOMATIC_BUYXGETY_DISCOUNT_CODE_QUERY = `
query getDiscountcode($ID: ID!) {
	automaticDiscountNode(id: $ID) {
		id
		automaticDiscount {
			... on DiscountAutomaticBxgy {
				status
				title
				startsAt
				endsAt
				discountClass
				usesPerOrderLimit
				customerGets {
					value {
						... on DiscountOnQuantity {
							effect {
								... on DiscountPercentage {
									percentage
								}
							}
						}
					}
				}
			}
		}
	}
}`;

interface PayloadDiscountCreate {
	admin_graphql_api_id: string;
	title: string;
	status: string;
	created_at: string;
	updated_at: string;
}

interface GraphQLResponse {
	data: {
		data: {
			codeDiscountNode: {
				id: string;
				codeDiscount: DiscountCodeBasic | DiscountCodeBxgy;
			};
			automaticDiscountNode: {
				id: string;
				automaticDiscount: DiscountCodeBasic | DiscountCodeBxgy;
			};
		};
	};
}

export const handleDiscountUpdate = async (
	payload: PayloadDiscountCreate,
	shop: string,
): Promise<void> => {
	try {
		const isCustom = payload?.admin_graphql_api_id?.includes('DiscountCodeNode');

		const discountCodeResponse = await prisma.discountCode.findFirst({
			where: { shop, discountId: payload.admin_graphql_api_id },
		});

		const discountScope = discountCodeResponse?.discountScope;

		if (!discountCodeResponse) {
			return;
		}

		const response = await prisma.session.findMany({
			where: { shop },
		});
		const accessToken = response[0]?.accessToken;

		if (!accessToken) {
			throw new Error('Access token not found');
		}

		const data = {
			query: discountScope === 'BUYXGETY' ? isCustom ? GET_BUYXGETY_DISCOUNT_CODE_QUERY : GET_AUTOMATIC_BUYXGETY_DISCOUNT_CODE_QUERY : isCustom ? GET_BASIC_DISCOUNT_CODE_QUERY : GET_AUTOMATIC_BASIC_DISCOUNT_CODE_QUERY,
			variables: {
				ID: payload.admin_graphql_api_id,
			},
		};

		const graphQlResponse: GraphQLResponse = await getDetailUsingGraphQL(
			shop,
			accessToken,
			data,
		);

		const {
			discountClass,
			title,
			startsAt,
			endsAt,
			customerGets,
		} = isCustom ? graphQlResponse?.data?.data?.codeDiscountNode?.codeDiscount : graphQlResponse?.data?.data?.automaticDiscountNode?.automaticDiscount;

		if (!discountClass || !title || !startsAt || !endsAt) {
			console.error('Missing required discount data', graphQlResponse);
			return;
		}
		const discountCodeData = isCustom ? graphQlResponse?.data?.data?.codeDiscountNode?.codeDiscount : graphQlResponse?.data?.data?.automaticDiscountNode?.automaticDiscount;
		const discountCode = isCustom ? discountCodeData?.codes?.edges[0]?.node?.code : title;
		const discountAmount = discountScope === 'BUYXGETY' ? (customerGets?.value && 'effect' in customerGets.value ? Number(customerGets.value.effect.percentage) * 100 : 0)
			: (customerGets?.value && 'percentage' in customerGets.value ? Number(customerGets.value.percentage) * 100 : 0);
		const usageLimit = 'usageLimit' in discountCodeData ? discountCodeData.usageLimit ?? 0 : 0;
		const usesPerOrderLimit = 'usesPerOrderLimit' in discountCodeData ? discountCodeData.usesPerOrderLimit ?? 0 : 0;
	  
		await prisma.discountCode.update({
			where: {
				shop,
				id: discountCodeResponse?.id,
				discountId: payload.admin_graphql_api_id,
			},
			data: {
				code: discountCode,
				title: title,
				shop,
				discountId: payload.admin_graphql_api_id,
				startDate: new Date(startsAt),
				endDate: new Date(endsAt),
				discountAmount: discountAmount,
				discountType: 'PERCENT',
				usageLimit: isCustom ? usageLimit : usesPerOrderLimit,
				isActive: true,
			},
		});
	} catch (error) {
		console.error('Error in discount update webhook handler', error);
	}
};