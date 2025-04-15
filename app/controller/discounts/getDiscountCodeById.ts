import prisma from '../../db.server';
import type { getDiscountCodeResponse } from 'app/routes/api.discount/route';
import { getDetailUsingGraphQL } from 'app/service/product';
import { GET_ALL_DISCOUNT_DETAILS_QUERY } from 'app/webhookHandler/handleDiscountCreate';

export interface DiscountCodeBxgy {
	__typename: 'DiscountCodeBxgy';
	status: string;
	title: string;
	startsAt: string;
	endsAt: string;
	discountClass: string;
	codes: {
		edges: {
			node: {
				code: string;
			};
		}[];
	};
	maximumShippingPrice: {
		amount: string;
		currencyCode: string;
	};
	customerBuys: {
		value: {
			quantity: number;
		};
		items: {
			collections: {
				edges: {
					node: {
						id: string;
						title: string;
						productsCount: {
							count: number;
						};
						image: {
							url: string;
						};
					};
				}[];
			};
			productVariants: {
				edges: {
					node: {
						id: string;
						title: string;
						product: {
							id: string;
							title: string;
							variantsCount: {
								count: number | null;
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
			};
		}[];
	};
	customerGets: {
		value: {
			effect: {
				percentage: number;
			};
			quantity: {
				quantity: number;
			};
		};
		items: {
			collections: {
				edges: {
					node: {
						id: string;
						title: string;
						productsCount: {
							count: number;
						};
						image: {
							url: string;
						};
					};
				}[];
			};
			productVariants: {
				edges: {
					node: {
						id: string;
						title: string;
						product: {
							id: string;
							title: string;
							variantsCount: {
								count: number | null;
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
			};
		}[];
	};
	usesPerOrderLimit: number | null;
	appliesOncePerCustomer: boolean;
}
export interface DiscountCodeBasic {
	__typename: string;
	status: string;
	title: string;
	startsAt: string;
	endsAt: string;
	discountClass: string;
	codes: {
		edges: {
			node: {
				code: string;
			};
		}[];
	};
	maximumShippingPrice: {
		amount: string;
		currencyCode: string;
	};
	customerSelection: {
		customers: {
			id: string;
			displayName: string;
			email: string;
			image: {
				url: string;
			}
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
						product: {
							id: string;
							title: string;
							variantsCount: {
								count: number | null;
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
			};
			collections: {
				edges: {
					node: {
						id: string;
						title: string;
						productsCount: {
							count: number;
						};
						image: {
							url: string | null;
						};
					};
				}[];
			};
		}[];
	};
	usageLimit: number | null;
	appliesOncePerCustomer: boolean;
}

interface BasicDiscountQueryResponse {
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

/**
	* Fetches the details of a discount code by its ID from the Shopify store.
	* 
	* This function is used when an admin clicks on the "Update" button for any discount code in the app’s admin interface. 
	* It retrieves the required fields of the discount code based on the specified parameters, 
	* such as the discount's title, status, start date, and discount details.
	* The function supports fetching details for **basic** and **automated** discount codes, 
	* including various discount types such as **order discounts**, **product discounts**, **shipping discounts**, 
	* **buyXGetY discounts**, and **bulk discount codes**.
	* 
	* @param {number} id - The unique identifier of the discount code to retrieve.
	* @param {string} shop - The domain of the Shopify store (e.g., 'my-shop.myshopify.com').
	* @param {string} discountType - The type of the discount code (e.g., 'order', 'product', 'buyXGetY', 'shipping', etc.).
	* @param {string} method - The method used for the discount (e.g., 'basic', 'automated', etc.).
	* 
	* @returns {Promise<getDiscountCodeResponse>} - A promise that resolves with the required discount code details.
*/

export const getDiscountCodeById = async (
	id: number,
	shop: string,
	discountType: string,
	method: string,
): Promise<getDiscountCodeResponse> => {
	try {
		const isMethodCustom = method === 'custom';
		if (!shop || !id || !discountType) {
			return {
				success: false,
				message: 'Required fields id, discountType and shop',
				discountCode: null,
				discountScope: '',
				isMultiple: false,
				advancedRule: null,
				method,
			};
		}
		const response = await prisma.session.findMany({
			where: { shop },
		});
		const accessToken = response[0]?.accessToken;

		if (!accessToken) {
			throw new Error('Access token not found');
		}

		const data = {
			query: GET_ALL_DISCOUNT_DETAILS_QUERY,
			variables: {
				ID: isMethodCustom ? `gid://shopify/DiscountCodeNode/${id}` : `gid://shopify/DiscountAutomaticNode/${id}`,
			},
		};
		const getDiscountCodeByIdFromShopify: BasicDiscountQueryResponse =
			await getDetailUsingGraphQL(shop, accessToken, data);

		const getCodeObj = await prisma.discountCode.findFirst({
			where: {
				shop,
				discountId: isMethodCustom ? `gid://shopify/DiscountCodeNode/${id}` : `gid://shopify/DiscountAutomaticNode/${id}`,
			},
		});
		const discountCode = isMethodCustom ? getDiscountCodeByIdFromShopify.data?.data?.codeDiscountNode : getDiscountCodeByIdFromShopify.data?.data?.automaticDiscountNode;
		if (
			getDiscountCodeByIdFromShopify.data?.data?.codeDiscountNode ||
			getDiscountCodeByIdFromShopify.data?.data?.automaticDiscountNode
		) {
			return {
				success: true,
				discountCode: [discountCode],
				discountScope: getCodeObj?.discountScope || '',
				advancedRule: getCodeObj?.advancedRule as object | null,
				isMultiple: getCodeObj?.isMultiple || false, 
				message: 'Fetch discount code successfully',
				method: method,
			};
		}

		return {
			success: false,
			message: 'Record not found!',
			discountCode: null,
			discountScope: '',
			isMultiple: false,
			advancedRule: null,
			method,
		};
	} catch (error) {
		// eslint-disable-next-line no-console
		console.log(
			error,
			'Error fetching dicount code details using an discount id',
		);
		return {
			success: false,
			discountCode: [],
			message: 'Something went wrong',
			discountScope: '',
			isMultiple: false,
			advancedRule: null,
			method,
		};
	}
};
