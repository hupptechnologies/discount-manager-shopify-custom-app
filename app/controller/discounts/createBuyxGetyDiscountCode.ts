import prisma from 'app/db.server';
import { getDetailUsingGraphQL } from 'app/service/product';

const CREATE_BUYXGETY_DISCOUNT_QUERY = `
mutation discountCodeBxgyCreate($bxgyCodeDiscount: DiscountCodeBxgyInput!) {
	discountCodeBxgyCreate(bxgyCodeDiscount: $bxgyCodeDiscount) {
		codeDiscountNode {
            id
			codeDiscount {
				... on DiscountCodeBxgy {
					title
					codes(first: 10) {
						nodes {
							code
						}
					}
					startsAt
					endsAt
					customerBuys {
						value {
							... on DiscountQuantity {
								quantity
							}
						}
					}
					customerGets {
						appliesOnOneTimePurchase
						appliesOnSubscription
						value {
							... on DiscountOnQuantity {
								effect {
									... on DiscountPercentage {
										percentage
									}
								}
								quantity {
									quantity
								}
							}
						}
					}
					customerSelection {
						... on DiscountCustomerAll {
							allCustomers
						}
					}
					appliesOncePerCustomer
					usesPerOrderLimit
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

interface CreateBxgyDiscountResponse {
	data: {
		data: {
			discountCodeBxgyCreate: {
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
								products: { productVariantsToAdd: string[]; productVariantsToRemove: string[]; }
								collections: { add: string[]; remove: string[]; }
							}[];
							value: { quantity: string };
						};
						customerGets: {
							items: {
								products: { productVariantsToAdd: string[]; productVariantsToRemove: string[]; }
								collections: { add: string[]; remove: string[]; }
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
						usesPerOrderLimit: number;
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

export const createBuyXGetYDiscountCode = async (
	shop: string,
	request: Request,
	type: string,
): Promise<{ success: boolean; message: string }> => {
	const {
		title,
		code,
		startsAt,
		endsAt,
		usageLimit,
		customerBuys,
		customerGets,
		advancedRule
	}: CreateBuyxGetYDiscountCodeInput = await request.json();

	try {
		if (!customerGets.percentage || !code) {
			return {
				success: false,
				message: 'Required fields percentage, code'
			}
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
					code,
					customerBuys: {
						items: {
							...(customerBuys.collectionIDs.length > 0 && {
								collections: {
									add: customerBuys.collectionIDs,
									remove: customerBuys.removeCollectionIDs
								}
							}),
							...(customerBuys.productIDs.length > 0 && {
								products: {
									productVariantsToAdd: customerBuys.productIDs,
									productVariantsToRemove: customerBuys.removeProductIDs
								}
							})
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
									remove: customerGets.removeCollectionIDs
								}
							}),
							...(customerGets.productIDs.length > 0 && {
								products: {
									productVariantsToAdd: customerGets.productIDs,
									productVariantsToRemove: customerGets.removeProductIDs
								}
							})
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
					endsAt,
					startsAt,
					title,
					usesPerOrderLimit: usageLimit,
				},
			},
		};

		const responseBuyxGetY: CreateBxgyDiscountResponse =
			await getDetailUsingGraphQL(shop, accessToken, data);

		if (responseBuyxGetY.data.errors) {
			throw new Error(
				responseBuyxGetY.data.errors.map((e) => e.message).join(', '),
			);
		}

		const discountCodeData =
			responseBuyxGetY.data?.data?.discountCodeBxgyCreate?.codeDiscountNode;

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
					advancedRule: advancedRule !== null && advancedRule !== undefined ? advancedRule : undefined,
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
