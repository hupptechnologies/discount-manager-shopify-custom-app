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
				codeDiscount: {
					discountClass: string;
					usageLimit: number;
					title: string;
					codes: {
						edges: Array<{
							node: {
								code: string;
							};
						}>;
					};
					startsAt: string;
					endsAt: string;
					customerGets: {
						value: {
							percentage: number;
						};
					};
				};
			};
		};
	};
}

export const handleDiscountCreate = async (
	payload: PayloadDiscountCreate,
	shop: string
): Promise<void> => {
	try {
		const response = await prisma.session.findMany({
			where: { shop },
		});
		const accessToken = response[0]?.accessToken;

		if (!accessToken) {
			throw new Error('Access token not found');
		}
		const data = {
			query: GET_BASIC_DISCOUNT_CODE_QUERY,
			variables: {
				ID: payload.admin_graphql_api_id,
			},
		};
		const graphQlResponse: GraphQLResponse = await getDetailUsingGraphQL(shop, accessToken, data);

		const {
			discountClass,
			usageLimit,
			title,
			codes: { edges },
			startsAt,
			endsAt,
			customerGets: { value },
		} = graphQlResponse?.data?.data?.codeDiscountNode?.codeDiscount;

		await prisma.discountCode.create({
			data: {
				code: edges[0]?.node?.code,
				title,
				shop,
				discountId: payload.admin_graphql_api_id,
				startDate: new Date(startsAt),
				endDate: new Date(endsAt),
				discountAmount: Number(value?.percentage) * 100,
				discountType: 'PERCENT',
				usageLimit: usageLimit ? usageLimit : 0,
				isActive: true,
				discountMethod: 'CUSTOM',
				discountScope: discountClass === 'PRODUCT' ? 'PRODUCT' : discountClass === 'ORDER' ? 'ORDER' : discountClass === 'SHIPPING' ? 'SHIPPING' : 'BUYXGETY' ,
			},
		});
	} catch (error) {
		console.error('Error in discount create webhook handler', error);
	}
};
