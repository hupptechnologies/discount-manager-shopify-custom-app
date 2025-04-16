import prisma from 'app/db.server';
import { getDetailUsingGraphQL } from 'app/service/product';
import { CREATE_BUYXGETY_DISCOUNT_QUERY, CREATE_BUYXGETY_AUTOMATIC_DISCOUNT_CODE_QUERY } from 'app/graphqlQuery/mutationDiscount';

interface CreateBxgyDiscountResponse {
	data: {
		data: {
			discountCodeBxgyCreate?: {
				codeDiscountNode: {
					id: string;
					codeDiscount: {
						title: string;
						codes: {
							nodes: { code: string }[];
						};
						startsAt: string;
						endsAt: string;
						customerBuys: {
							items: {
								products: {
									productVariantsToAdd: string[];
									productVariantsToRemove: string[];
								};
								collections: { add: string[]; remove: string[] };
							}[];
							value: { quantity: string };
						};
						customerGets: {
							items: {
								products: {
									productVariantsToAdd: string[];
									productVariantsToRemove: string[];
								};
								collections: { add: string[]; remove: string[] };
							}[];
							value: {
								discountOnQuantity: {
									effect: { percentage: number };
									quantity: string;
								};
							};
						};
						customerSelection: { all: boolean };
						appliesOncePerCustomer: boolean;
						usageLimit: number;
					};
				};
				userErrors: { field: string; code: string; message: string }[];
			};
			discountAutomaticBxgyCreate: {
				automaticDiscountNode: {
					id: string;
					automaticDiscount: {
						title: string;
						codes: {
							nodes: { code: string }[];
						};
						startsAt: string;
						endsAt: string;
						customerBuys: {
							items: {
								products: {
									productVariantsToAdd: string[];
									productVariantsToRemove: string[];
								};
								collections: { add: string[]; remove: string[] };
							}[];
							value: { quantity: string };
						};
						customerGets: {
							items: {
								products: {
									productVariantsToAdd: string[];
									productVariantsToRemove: string[];
								};
								collections: { add: string[]; remove: string[] };
							}[];
							value: {
								discountOnQuantity: {
									effect: { percentage: number };
									quantity: string;
								};
							};
						};
						customerSelection: { all: boolean };
						appliesOncePerCustomer: boolean;
					};
				};
				userErrors: { field: string; code: string; message: string }[];
			};
		};
		errors?: Array<{ message: string }>;
	};
}
interface CreateBuyxGetYDiscountCodeInput {
	title: string;
	code: string;
	startsAt: string;
	endsAt: string;
	usageLimit: number;
	appliesOncePerCustomer: boolean;
	customerBuys: {
		quantity: string;
		productIDs: string[];
		collectionIDs: string[];
		removeCollectionIDs: string[];
		removeProductIDs: string[];
	};
	customerGets: {
		percentage: string;
		quantity: string;
		productIDs: string[];
		collectionIDs: string[];
		removeCollectionIDs: string[];
		removeProductIDs: string[];
	};
	advancedRule: object | null;
}

/**
	* Creates an automated Buy X Get Y discount code for a Shopify store.
	* 
	* This function creates a Buy X Get Y type discount code, where customers can get a discount
	* on purchasing certain items. The function uses the provided `dataPayload` to define the details
	* of the discount, such as the eligible products, quantities, and the type of discount. It also uses
	* `type` and `method` to determine how the discount should be applied.
	* 
	* @param {string} shop - The domain of the Shopify store (e.g., 'my-shop.myshopify.com').
	* @param {CreateBuyxGetYDiscountCodeInput} dataPayload - The data payload containing the details for the Buy X Get Y discount code (e.g., which items are eligible for the discount, quantities, etc.).
	* @param {string} type - The type of the Buy X Get Y discount (e.g., percentage, fixed value, etc.).
	* @param {string} method - The method of applying the discount (e.g., automatic or manual).
	* 
	* @returns {Promise<{ success: boolean; message: string }>} - A promise that resolves with an object containing the success status and a message.
*/

export const createBuyXGetYDiscountCode = async (
	shop: string,
	dataPayload: CreateBuyxGetYDiscountCodeInput,
	type: string,
	method: string,
): Promise<{ success: boolean; message: string }> => {
	const {
		title,
		startsAt,
		endsAt,
		usageLimit,
		customerBuys,
		customerGets,
		advancedRule,
	} = dataPayload;
	const code = title;

	try {
		if (!customerGets.percentage || !code) {
			return {
				success: false,
				message: 'Required fields percentage, code',
			};
		}
		const checkCodeExist = await prisma.discountCode.count({
			where: { shop, code },
		});

		if (checkCodeExist > 0) {
			return {
				success: false,
				message: `The discount code "${code}" already exists. Please try using a different code.`,
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
			query: CREATE_BUYXGETY_DISCOUNT_QUERY,
			variables: {
				bxgyCodeDiscount: {
					endsAt,
					startsAt,
					title,
					code: title,
					usageLimit: usageLimit,
					customerBuys: {
						items: {
							...(customerBuys.collectionIDs.length > 0 && {
								collections: {
									add: customerBuys.collectionIDs,
								},
							}),
							...(customerBuys.removeCollectionIDs.length > 0 && {
								collections: {
									remove: customerBuys.removeCollectionIDs,
								},
							}),
							...(customerBuys.productIDs.length > 0 && {
								products: {
									productVariantsToAdd: customerBuys.productIDs,
								},
							}),
							...(customerBuys.removeProductIDs.length > 0 && {
								products: {
									productVariantsToRemove: customerBuys.removeProductIDs,
								},
							}),
						},
						value: {
							quantity: customerBuys.quantity,
						},
					},
					customerGets: {
						items: {
							...(customerGets.collectionIDs.length > 0 && {
								collections: {
									add: customerGets.collectionIDs,
								},
							}),
							...(customerGets.removeCollectionIDs.length > 0 && {
								collections: {
									remove: customerGets.removeCollectionIDs,
								},
							}),
							...(customerGets.productIDs.length > 0 && {
								products: {
									productVariantsToAdd: customerGets.productIDs,
								},
							}),
							...(customerGets.removeProductIDs.length > 0 && {
								products: {
									productVariantsToRemove: customerGets.removeProductIDs,
								},
							}),
						},
						value: {
							discountOnQuantity: {
								effect: {
									percentage: Number(customerGets.percentage) / 100,
								},
								quantity: customerGets.quantity,
							},
						},
					},
					customerSelection: {
						all: true,
					},
				},
			},
		};

		const dataAuto = {
			query: CREATE_BUYXGETY_AUTOMATIC_DISCOUNT_CODE_QUERY,
			variables: {
				automaticBxgyDiscount: {
					title,
					endsAt,
					startsAt,
					customerBuys: {
						items: {
							...(customerBuys.collectionIDs.length > 0 && {
								collections: {
									add: customerBuys.collectionIDs,
								},
							}),
							...(customerBuys.removeCollectionIDs.length > 0 && {
								collections: {
									remove: customerBuys.removeCollectionIDs,
								},
							}),
							...(customerBuys.productIDs.length > 0 && {
								products: {
									productVariantsToAdd: customerBuys.productIDs,
								},
							}),
							...(customerBuys.removeProductIDs.length > 0 && {
								products: {
									productVariantsToRemove: customerBuys.removeProductIDs,
								},
							}),
						},
						value: {
							quantity: customerBuys.quantity,
						},
					},
					customerGets: {
						items: {
							...(customerGets.collectionIDs.length > 0 && {
								collections: {
									add: customerGets.collectionIDs,
								},
							}),
							...(customerGets.removeCollectionIDs.length > 0 && {
								collections: {
									remove: customerGets.removeCollectionIDs,
								},
							}),
							...(customerGets.productIDs.length > 0 && {
								products: {
									productVariantsToAdd: customerGets.productIDs,
								},
							}),
							...(customerGets.removeProductIDs.length > 0 && {
								products: {
									productVariantsToRemove: customerGets.removeProductIDs,
								},
							}),
						},
						value: {
							discountOnQuantity: {
								effect: {
									percentage: Number(customerGets.percentage) / 100,
								},
								quantity: customerGets.quantity,
							},
						},
					},
				},
			},
		};

		const responseBuyxGetY: CreateBxgyDiscountResponse =
			await getDetailUsingGraphQL(
				shop,
				accessToken,
				method === 'custom' ? data : dataAuto,
			);

		if (responseBuyxGetY.data.errors) {
			throw new Error(
				responseBuyxGetY.data.errors.map((e) => e.message).join(', '),
			);
		}

		const discountCodeData =
			method === 'custom'
				? responseBuyxGetY.data?.data?.discountCodeBxgyCreate?.codeDiscountNode
				: responseBuyxGetY.data?.data?.discountAutomaticBxgyCreate
						?.automaticDiscountNode;
		if (discountCodeData) {
			await prisma.discountCode.create({
				data: {
					code,
					title,
					shop,
					discountId: discountCodeData.id,
					startDate: new Date(startsAt),
					endDate: new Date(endsAt),
					discountAmount: Number(customerGets.percentage),
					usageLimit: usageLimit,
					discountType: 'PERCENT',
					discountMethod: method === 'custom' ? 'CUSTOM' : 'AUTOMATIC',
					advancedRule:
						advancedRule !== null && advancedRule !== undefined
							? advancedRule
							: undefined,
					isActive: true,
					discountScope: type === 'buyXgetY' ? 'BUYXGETY' : 'PRODUCT',
				},
			});
			return { success: true, message: 'Discount code created successfully' };
		}

		return { success: false, message: 'Discount record not added in database' };
	} catch (error) {
		// eslint-disable-next-line no-console
		console.error(error);
		return { success: false, message: 'Something went wrong' };
	}
};
