import { DiscountCodeBasic } from 'app/controller/discounts/getDiscountCodeById';
import prisma from '../db.server';
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
				codeDiscount: DiscountCodeBasic;
			};
			automaticDiscountNode: {
				id: string;
				automaticDiscount: DiscountCodeBasic;
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
			query: payload?.admin_graphql_api_id?.includes('DiscountCodeNode') ? GET_BASIC_DISCOUNT_CODE_QUERY : GET_AUTOMATIC_BASIC_DISCOUNT_CODE_QUERY,
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
			customerGets: { value },
		} = isCustom ? graphQlResponse?.data?.data?.codeDiscountNode?.codeDiscount : graphQlResponse?.data?.data?.automaticDiscountNode?.automaticDiscount;

		if (!discountClass) {
			console.error('Discount class is missing', graphQlResponse);
		}

		const discountCode = graphQlResponse?.data?.data?.codeDiscountNode?.codeDiscount?.codes?.edges[0]?.node?.code;

		await prisma.discountCode.update({
			where: {
				shop,
				id: discountCodeResponse?.id,
				discountId: payload.admin_graphql_api_id,
			},
			data: {
				code: isCustom ? discountCode : title,
				title: title,
				shop,
				discountId: payload.admin_graphql_api_id,
				startDate: new Date(startsAt),
				endDate: new Date(endsAt),
				discountAmount: Number(value.percentage) * 100,
				discountType: 'PERCENT',
				discountScope:
					discountClass === 'PRODUCT'
						? 'PRODUCT'
						: discountClass === 'ORDER'
							? 'ORDER'
							: discountClass === 'SHIPPING'
								? 'SHIPPING'
								: 'BUYXGETY',
				usageLimit: graphQlResponse?.data?.data?.codeDiscountNode?.codeDiscount?.usageLimit || 0,
				isActive: true,
			},
		});
	} catch (error) {
		console.error('Error in discount update webhook handler', error);
	}
};
