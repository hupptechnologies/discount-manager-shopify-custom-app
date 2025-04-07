import prisma from '../../db.server';
import { getDetailUsingGraphQL } from 'app/service/product';
import { DiscountCodeCustomerSelection } from './updateBasicDiscountCode';

const CREATE_BASIC_DISCOUNT_CODE_QUERY = `
mutation CreateDiscountCode($basicCodeDiscount: DiscountCodeBasicInput!) {
	discountCodeBasicCreate(basicCodeDiscount: $basicCodeDiscount) {
		codeDiscountNode {
			id
			codeDiscount {
				... on DiscountCodeBasic {
					title
					startsAt
					endsAt
					customerSelection {
						... on DiscountCustomers {
							customers {
								id
							}
						}
					}
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
		userErrors {
			field
			message
		}
	}
}`;

const CREATE_AUTOMATIC_BASIC_DISCOUNTCODE_QUERY = `
mutation discountAutomaticBasicCreate($automaticBasicDiscount: DiscountAutomaticBasicInput!) {
	discountAutomaticBasicCreate(automaticBasicDiscount: $automaticBasicDiscount) {
		automaticDiscountNode {
			id
			automaticDiscount {
				... on DiscountAutomaticBasic {
					title
					startsAt
					endsAt
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
		userErrors {
			field
			code
			message
		}
	}
}`;

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

		if (codes.length > 0) {
			for (const code of codes) {
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
				const data: any = {
					query: CREATE_BASIC_DISCOUNT_CODE_QUERY,
					variables: {
						basicCodeDiscount: {
							code,
							title,
							startsAt,
							endsAt,
							customerSelection: {
								customers: {
									...((customers.customerIDs?.length > 0 && type === 'custom') && {
										add: customers.customerIDs
									}),
									...((customers.removeCustomersIDs?.length > 0 && type === 'custom') && {
										remove: customers.removeCustomersIDs
									}),
								},
								...((customers.customerIDs?.length == 0 && customers.removeCustomersIDs.length == 0) && {
									all: true
								}),
							},
							customerGets: {
								value: {
									percentage: Number(customerGets.percentage) / 100,
								},
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

				if (discountCodeData) {
					await prisma.discountCode.create({
						data: {
							code,
							title,
							shop,
							discountId: discountCodeData?.id,
							advancedRule: advancedRule || undefined,
							startDate: new Date(startsAt),
							endDate: new Date(endsAt),
							discountAmount: Number(customerGets.percentage),
							discountType: 'PERCENT',
							usageLimit,
							isActive: true,
							discountMethod: method === 'custom' ? 'CUSTOM' : 'AUTOMATIC',
							discountScope: type === 'products' ? 'PRODUCT' : type === 'order' ? 'ORDER' : 'SHIPPING',
						},
					});
				} else {
					return { success: false, message: 'Discount record not added in database' };
				}
			}
			return { success: true, message: 'Multiple discount codes created successfully' };
		}
		return { success: false, message: 'No discount code found' }
	} catch (error) {
		console.error(error, 'Error while creating discount code');
		return { success: false, message: 'Something went wrong' };
	}
};