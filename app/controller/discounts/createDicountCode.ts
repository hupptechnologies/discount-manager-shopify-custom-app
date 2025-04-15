import prisma from '../../db.server';
import { getDetailUsingGraphQL } from 'app/service/product';
import { DiscountCodeCustomerSelection } from './updateBasicDiscountCode';
import { createBulkDiscountCode } from './createBulkDiscountCode';
import { CREATE_BASIC_DISCOUNT_CODE_QUERY, CREATE_AUTOMATIC_BASIC_DISCOUNTCODE_QUERY } from 'app/graphqlQuery/mutationDiscount';

type DiscountCodeItems =
	| { all: boolean }
	| { products: { productVariantsToAdd: string[]; productVariantsToRemove: string[]; } }
	| { collections: { add: string[]; remove: string[] } };

interface DiscountCodeBasicInput {
	title: string;
	code: string;
	startsAt: string;
	endsAt: string;
	customerSelection: DiscountCodeCustomerSelection;
	customerGets: {
		value: {
			percentage: number;
		};
		items: DiscountCodeItems;
	};
	usageLimit: number;
	appliesOncePerCustomer: boolean;
}

interface DiscountAutomaticBasicInput {
	title: string;
	code: string;
	startsAt: string;
	endsAt: string;
	customerGets: {
		value: {
			percentage: number;
		};
		items: DiscountCodeItems;
	};
}

interface DiscountCodeResponse {
	data: {
		data: {
			discountCodeBasicCreate?: {
				codeDiscountNode: {
					id: string;
					codeDiscount: {
						code: string;
						title: string;
					};
				};
			};
			discountAutomaticBasicCreate?: {
				automaticDiscountNode: {
					id: string;
					automaticDiscount: {
						title: string;
					};
				};
			};
		};
		errors?: Array<{ message: string }>;
	};
}

interface CreateDiscountCodeInput {
	title: string;
	codes: string[];
	startsAt: string;
	endsAt: string;
	usageLimit: number;
	appliesOncePerCustomer: boolean;
	customerGets: {
		percentage: string;
		quantity: string;
		productIDs: string[];
		collectionIDs: string[];
		removeCollectionIDs: string[];
		removeProductIDs: string[];
	};
	customers: {
		customerIDs: string[];
		removeCustomersIDs: string[];
	}
	advancedRule: object | null;
}

/**
	* Creates a basic and automated discount code for Shopify store.
	* 
	* This function creates a discount code based on the provided `dataPayload`, which defines the
	* details of the discount, such as eligible products, orders, or shipping discounts. The discount
	* code is created according to the specified `type` (e.g., product discount, order discount, shipping discount)
	* and `method` (e.g., automatic or manual application).
	* 
	* @param {string} shop - The domain of the Shopify store (e.g., 'my-shop.myshopify.com').
	* @param {CreateDiscountCodeInput} dataPayload - The data payload containing the details for the discount code (e.g., which products or orders are eligible, the amount or percentage off, etc.).
	* @param {string} type - The type of discount (e.g., "product", "order", "shipping").
	* @param {string} method - The method of applying the discount (e.g., "automatic" or "custom").
	* 
	* @returns {Promise<{ success: boolean; message: string }>} - A promise that resolves with an object containing the success status and a message.
*/

export const createDiscountCode = async (
	shop: string,
	dataPayload: CreateDiscountCodeInput,
	type: string,
	method: string,
): Promise<{ success: boolean; message: string }> => {
	const {
		title,
		codes,
		startsAt,
		endsAt,
		usageLimit,
		appliesOncePerCustomer,
		customerGets,
		customers,
		advancedRule
	} = dataPayload;

	try {
		if (!customerGets.percentage || codes.length === 0) {
			return {
				success: false,
				message: 'Required fields percentage and code',
			};
		}

		const checkCodeExist = await prisma.discountCode.count({
			where: { shop, code: codes[0] },
		});

		if (checkCodeExist > 0) {
			return {
				success: false,
				message: `The discount code "${codes[0]}" already exists. Please try using a different code.`,
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
			query: CREATE_BASIC_DISCOUNT_CODE_QUERY,
			variables: {
				basicCodeDiscount: {
					code: codes[0],
					title,
					startsAt,
					endsAt,
					customerSelection: {
						...((customers.customerIDs?.length > 0 || customers.removeCustomersIDs.length > 0) && {
							customers: {
								...((customers.customerIDs?.length > 0 && method === 'custom') && {
									add: customers.customerIDs
								}),
								...((customers.removeCustomersIDs?.length > 0 && method === 'custom') && {
									remove: customers.removeCustomersIDs
								}),
							},
						}),
						...(customers.customerIDs?.length == 0 && customers.removeCustomersIDs.length == 0 && {
							all: true
						}),
					},
					customerGets: {
						...(type !== 'shipping' && {
							value: {
								percentage: Number(customerGets.percentage) / 100,
							},
						}),
						...(type === 'shipping' && {
							discountAmount: {
								amount: Number(customerGets.percentage) / 100,
								appliesOnEachItem: false
							}
						}),
						items: {} as DiscountCodeItems,
					},
					usageLimit,
					appliesOncePerCustomer,
				} as DiscountCodeBasicInput,
			},
		};

		const dataAuto: any = {
			query: CREATE_AUTOMATIC_BASIC_DISCOUNTCODE_QUERY,
			variables: {
				automaticBasicDiscount: {
					title,
					startsAt,
					endsAt,
					customerGets: {
						value: {
							percentage: Number(customerGets.percentage) / 100,
						},
						items: {} as DiscountCodeItems,
					},
				} as DiscountAutomaticBasicInput,
			},
		};
		if (
			customerGets.productIDs.length > 0 ||
			customerGets.removeProductIDs.length > 0
		) {
			const productData = {
				productVariantsToAdd: customerGets.productIDs,
				productVariantsToRemove: customerGets.removeProductIDs,
			};
			if (method === 'custom') {
				data.variables.basicCodeDiscount.customerGets.items = {
					products: productData,
				};
			} else {
				dataAuto.variables.automaticBasicDiscount.customerGets.items = {
					products: productData,
				};
			}
		} else if (
			customerGets.collectionIDs.length > 0 ||
			customerGets.removeCollectionIDs.length > 0
		) {
			const collectionData = {
				add: customerGets.collectionIDs,
				remove: customerGets.removeCollectionIDs,
			};
			if (method === 'custom') {
				data.variables.basicCodeDiscount.customerGets.items = {
					collections: collectionData,
				};
			} else {
				dataAuto.variables.automaticBasicDiscount.customerGets.items = {
					collections: collectionData,
				};
			}
		} else {
			if (method === 'custom') {
				data.variables.basicCodeDiscount.customerGets.items = { all: true };
			} else { 
				dataAuto.variables.automaticBasicDiscount.customerGets.items = {
					all: true,
				};
			}
		}
		const createDiscountResponse: DiscountCodeResponse = await getDetailUsingGraphQL(shop, accessToken, method === 'custom' ? data : dataAuto);
		
		if (createDiscountResponse.data.errors) {
			throw new Error(
				createDiscountResponse.data.errors.map((e) => e.message).join(', '),
			);
		}
		const discountCodeData =
			method === 'custom'
				? createDiscountResponse.data?.data?.discountCodeBasicCreate
						?.codeDiscountNode
				: createDiscountResponse.data?.data?.discountAutomaticBasicCreate
						?.automaticDiscountNode;
		if (codes?.length > 1 && discountCodeData?.id) {
			const bulkDataPayload = {
				discountId: discountCodeData?.id,
				codes
			};
			await createBulkDiscountCode(shop, bulkDataPayload);
		}

		if (discountCodeData) {
			await prisma.discountCode.create({
				data: {
					code: method === 'custom' ? codes[0] : title,
					title,
					shop,
					discountId: discountCodeData?.id,
					advancedRule: advancedRule || undefined,
					startDate: new Date(startsAt),
					endDate: new Date(endsAt),
					discountAmount: Number(customerGets.percentage),
					discountType: 'PERCENT',
					usageLimit,
					isMultiple: codes?.length > 1,
					isActive: true,
					discountMethod: method === 'custom' ? 'CUSTOM' : 'AUTOMATIC',
					discountScope: type === 'products' ? 'PRODUCT' : type === 'order' ? 'ORDER' : 'SHIPPING',
				},
			});
			return { success: true, message: 'Multiple discount codes created successfully' };
		};
		return { success: false, message: 'Discount record not added in database' };
	} catch (error) {
		console.error(error, 'Error while creating discount code');
		return { success: false, message: 'Something went wrong' };
	}
};