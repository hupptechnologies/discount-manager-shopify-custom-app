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
						items {
							...collectionsFragment
						}
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
						items {
							...collectionsFragment
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
}

fragment collectionsFragment on DiscountCollections {
	collections(first: 10) {
		nodes {
			id
			title
		}
	}
}
`;

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
							items: { collections: { add: string[] } }[];
							value: { quantity: string };
						};
						customerGets: {
							items: { collections: { add: string[] } }[];
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
	percentage: number;
	code: string;
	startsAt: string;
	endsAt: string;
	usageLimit: number;
	appliesOncePerCustomer: boolean;
	customerBuys: {
		quantity: string;
		productIDs: string[];
		collectionIDs: string[];
	};
	customerGets: {
		quantity: string;
		productIDs: string[];
		collectionIDs: string[];
	};
}

export const createBuyXGetYDiscountCode = async (
	shop: string,
	request: Request,
	type: string,
): Promise<{ success: boolean; message: string }> => {
	const {
		title,
		percentage,
		code,
		startsAt,
		endsAt,
		usageLimit,
		customerBuys,
		customerGets,
	}: CreateBuyxGetYDiscountCodeInput = await request.json();

	try {
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
							collections: {
								add: customerBuys.collectionIDs,
							},
						},
						value: {
							quantity: customerBuys.quantity,
						},
					},
					customerGets: {
						items: {
							collections: {
								add: customerGets.collectionIDs,
							},
						},
						value: {
							discountOnQuantity: {
								effect: {
									percentage: percentage / 100,
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
					discountAmount: percentage,
					usageLimit: usageLimit,
					discountType: 'PERCENT',
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
