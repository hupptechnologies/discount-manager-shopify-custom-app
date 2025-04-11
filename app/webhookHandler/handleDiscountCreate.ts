import prisma from '../db.server';
import { getDetailUsingGraphQL } from 'app/service/product';

const FIND_BASIC_DISCOUNT_CODE_TYPE_QUERY = `
query getDiscountCode($ID: ID!) {
	codeDiscountNode(id: $ID) {
		codeDiscount {
			__typename
		}
	}
}`;

const FIND_AUTOMATIC_DISCOUNT_CODE_TYPE_QUERY = `
query getDiscountCode($ID: ID!) {
	automaticDiscountNode(id: $ID) {
		automaticDiscount {
			__typename
		}
	}
}`;

export const GET_BASIC_DISCOUNT_CODE_SHIPPING_QUERY = `
query getDiscountCode($ID: ID!) {
	codeDiscountNode(id: $ID) {
		codeDiscount {
			... on DiscountCodeFreeShipping {
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
				maximumShippingPrice{
					amount
					currencyCode
				}
				usageLimit
				appliesOncePerCustomer
			}
		}
	}
}`;

export const GET_AUTOMATIC_DISCOUNT_CODE_SHIPPING_QUERY = `
query getDiscountCode($ID: ID!) {
	automaticDiscountNode(id: $ID) {
		automaticDiscount {
			... on DiscountAutomaticFreeShipping {
				status
				title
				startsAt
				endsAt
				discountClass
				maximumShippingPrice{
					amount
					currencyCode
				}
			}
		}
	}
}`;

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

const GET_AUTOMATIC_DISCOUNT_CODE_QUERY = `
query getDiscountCode($ID: ID!) {
	automaticDiscountNode(id: $ID) {
		automaticDiscount {
			... on DiscountAutomaticBasic {
				status
				title
				startsAt
				endsAt
				discountClass
				customerGets {
					value {
						...on DiscountPercentage {
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
			... on DiscountCodeBxgy {
				status
				title
				startsAt
				endsAt
				discountClass
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
				usesPerOrderLimit
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
				usesPerOrderLimit
				discountClass
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

interface DiscountCodeProps {
	discountClass: string;
	usageLimit: number;
	usesPerOrderLimit: number;
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
			effect: {
				percentage: number;
			}
			percentage: number;
		};
	};
	maximumShippingPrice: {
		amount: string;
		currencyCode: string;
	}
}

interface GraphQLResponse {
	data: {
		data: {
			codeDiscountNode: {
				codeDiscount: DiscountCodeProps;
			};
			automaticDiscountNode: {
				automaticDiscount: DiscountCodeProps;
			};
		};
	};
}

export const handleDiscountCreate = async (
	payload: PayloadDiscountCreate,
	shop: string,
): Promise<void> => {
	try {
		const isCustomMethod = payload.admin_graphql_api_id.includes('DiscountCodeNode');

		const existingDiscountCode = await prisma.discountCode.findFirst({
			where: {
				shop,
				discountId: payload?.admin_graphql_api_id
			},
		});

		if (existingDiscountCode) {
			console.log('Discount code already exists:', existingDiscountCode?.code);
			return;
		}

		const response = await prisma.session.findMany({
			where: { shop },
		});
		const accessToken = response[0]?.accessToken;

		if (!accessToken) {
			throw new Error('Access token not found');
		}

		const typeData = {
			query: isCustomMethod ? FIND_BASIC_DISCOUNT_CODE_TYPE_QUERY : FIND_AUTOMATIC_DISCOUNT_CODE_TYPE_QUERY,
			variables: {
				ID: payload.admin_graphql_api_id,
			}
		}

		const getTypeOfDiscount = await getDetailUsingGraphQL(shop, accessToken, typeData);
		const __typename = isCustomMethod ? getTypeOfDiscount?.data?.data?.codeDiscountNode?.codeDiscount?.__typename : getTypeOfDiscount?.data?.data?.automaticDiscountNode?.automaticDiscount?.__typename
		const isShipping = __typename === 'DiscountCodeFreeShipping';
		const isBuyxGety = __typename === 'DiscountCodeBxgy';

		const isAutomatic = __typename === 'DiscountAutomaticBasic';
		const isAutomaticShipping = __typename === 'DiscountAutomaticFreeShipping';
		const isAutomaticBuyxGety = __typename === 'DiscountAutomaticBxgy';

		const data = {
			query: isAutomaticShipping ? GET_AUTOMATIC_DISCOUNT_CODE_SHIPPING_QUERY : isAutomaticBuyxGety ? GET_AUTOMATIC_BUYXGETY_DISCOUNT_CODE_QUERY : isBuyxGety ? GET_BUYXGETY_DISCOUNT_CODE_QUERY : isShipping ? GET_BASIC_DISCOUNT_CODE_SHIPPING_QUERY : isAutomatic ? GET_AUTOMATIC_DISCOUNT_CODE_QUERY : GET_BASIC_DISCOUNT_CODE_QUERY,
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
			usageLimit,
			title,
			codes,
			startsAt,
			endsAt,
			customerGets,
			maximumShippingPrice,
			usesPerOrderLimit
		} = isCustomMethod ? graphQlResponse?.data?.data?.codeDiscountNode?.codeDiscount : graphQlResponse?.data?.data?.automaticDiscountNode?.automaticDiscount;
		await prisma.discountCode.create({
			data: {
				code: isBuyxGety || isAutomaticBuyxGety || !isCustomMethod ? title : codes?.edges[0]?.node?.code,
				title,
				shop,
				discountId: payload.admin_graphql_api_id,
				startDate: new Date(startsAt),
				endDate: new Date(endsAt),
				discountAmount: isShipping || isAutomaticShipping ? Number(maximumShippingPrice?.amount || 0) : Number(isBuyxGety || isAutomaticBuyxGety ? customerGets?.value?.effect?.percentage : customerGets?.value?.percentage) * 100,
				discountType: 'PERCENT',
				usageLimit: isBuyxGety || isAutomaticBuyxGety ? usesPerOrderLimit : usageLimit ? usageLimit : 0,
				isActive: true,
				discountMethod: isCustomMethod ? 'CUSTOM' : 'AUTOMATIC',
				discountScope: discountClass === 'PRODUCT' ? 'PRODUCT' : discountClass === 'ORDER' ? 'ORDER' : discountClass === 'SHIPPING' ? 'SHIPPING' : 'BUYXGETY',
			},
		});
	} catch (error) {
		console.error('Error in discount create webhook handler', error);
	}
};
