import prisma from '../db.server';
import { getDetailUsingGraphQL } from 'app/service/product';

const DISCOUNT_TYPE_QUERY = `
query getDiscountCode($ID: ID!) {
	codeDiscountNode(id: $ID) {
		codeDiscount {
			__typename
		}
	}
	automaticDiscountNode(id: $ID) {
		automaticDiscount {
			__typename
		}
	}
}`;

export const GET_ALL_DISCOUNT_DETAILS_QUERY = `
query getDiscountCode($ID: ID!) {
	codeDiscountNode(id: $ID) {
		codeDiscount {
			__typename
			... on DiscountCodeBasic {
				status
				title
				startsAt
				endsAt
				discountClass
				appliesOncePerCustomer
				usageLimit
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
						... on DiscountAmount {
							amount {
								amount
								currencyCode
							}
						}
					}
				}
			}
			... on DiscountCodeFreeShipping {
				status
				title
				startsAt
				endsAt
				discountClass
				appliesOncePerCustomer
				usageLimit
				maximumShippingPrice {
					amount
					currencyCode
				}
				codes(first: 1) {
					edges {
						node {
							code
						}
					}
				}
			}
			... on DiscountCodeBxgy {
				status
				title
				startsAt
				endsAt
				discountClass
				usageLimit
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
	automaticDiscountNode(id: $ID) {
		automaticDiscount {
			__typename
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
			... on DiscountAutomaticFreeShipping {
				status
				title
				startsAt
				endsAt
				discountClass
				maximumShippingPrice {
					amount
					currencyCode
				}
			}
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
				codeDiscount: DiscountCodeProps & { __typename: string };
			};
			automaticDiscountNode: {
				automaticDiscount: DiscountCodeProps & { __typename: string };
			};
		};
	};
}

/**
	* Handles the creation of a discount code via webhook from Shopify.
	* 
	* This function is triggered when an admin creates a discount code on Shopify.
	* It processes the incoming webhook payload containing discount code details
	* and saves the information to our app's database. The newly created discount code 
	* will then be displayed in the discount code table on the app's admin interface.
	* 
	* @param {PayloadDiscountCreate} payload - The payload containing the discount code details from Shopify.
	* @param {string} shop - The Shopify store's domain (e.g., 'my-shop.myshopify.com').
	* 
	* @returns {Promise<void>} 
	* - A promise that resolves when the discount code has been successfully saved to the database.
*/

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

		if (existingDiscountCode) return;

		const session = await prisma.session.findFirst({
			where: { shop },
		});
		const accessToken = session?.accessToken;
		if (!accessToken) throw new Error('Access token not found');

		const typeData = {
			query: DISCOUNT_TYPE_QUERY,
			variables: {
				ID: payload.admin_graphql_api_id,
			}
		};

		const getTypeOfDiscount = await getDetailUsingGraphQL(shop, accessToken, typeData);
		const typename = isCustomMethod ? getTypeOfDiscount?.data?.data?.codeDiscountNode?.codeDiscount?.__typename : getTypeOfDiscount?.data?.data?.automaticDiscountNode?.automaticDiscount?.__typename;

		const isShipping = typename === 'DiscountCodeFreeShipping';
		const isBuyxGety = typename === 'DiscountCodeBxgy';
		const isAutomaticShipping = typename === 'DiscountAutomaticFreeShipping';
		const isAutomaticBuyxGety = typename === 'DiscountAutomaticBxgy';

		const detailsData = {
			query: GET_ALL_DISCOUNT_DETAILS_QUERY,
			variables: {
				ID: payload.admin_graphql_api_id,
			},
		};

		const graphQlResponse: GraphQLResponse = await getDetailUsingGraphQL(
			shop,
			accessToken,
			detailsData,
		);

		const node = isCustomMethod ? graphQlResponse?.data?.data?.codeDiscountNode?.codeDiscount : graphQlResponse?.data?.data?.automaticDiscountNode?.automaticDiscount;

		const {
			discountClass,
			usageLimit,
			title,
			codes,
			startsAt,
			endsAt,
			customerGets,
			maximumShippingPrice,
		} = node;

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
				usageLimit: usageLimit || 0,
				isActive: true,
				discountMethod: isCustomMethod ? 'CUSTOM' : 'AUTOMATIC',
				discountScope: isBuyxGety || isAutomaticBuyxGety ? 'BUYXGETY' : discountClass === 'PRODUCT' ? 'PRODUCT' : discountClass === 'ORDER' ? 'ORDER' : discountClass === 'SHIPPING' ? 'SHIPPING' : 'BUYXGETY',
			},
		});
	} catch (error) {
		console.error('Error in discount create webhook handler', error);
	}
};
