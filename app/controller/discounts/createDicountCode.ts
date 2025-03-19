import prisma from '../../db.server';
import { getDetailUsingGraphQL } from 'app/service/product';

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

type DiscountCodeItems = 
  | { all: boolean }
  | { products: { productVariantsToAdd: string[] } }
  | { collections: { add: string[] } };

interface DiscountCodeBasicInput {
	title: string;
	code: string;
	startsAt: string;
	endsAt: string;
	customerSelection: {
		all: boolean;
	};
	customerGets: {
		value: {
			percentage: number;
		};
		items: DiscountCodeItems
	};
	usageLimit: number;
	appliesOncePerCustomer: boolean;
}

interface DiscountCodeResponse {
	data: {
		data: {
			discountCodeBasicCreate: {
				codeDiscountNode: {
					id: string;
					codeDiscount: {
						code: string;
						title: string;
					};
				};
			};
		};
		errors?: Array<{ message: string }>;
	}
}

interface CreateDiscountCodeInput {
	title: string;
	percentage: number;
	code: string;
	startsAt: string;
	endsAt: string;
	usageLimit: number;
	appliesOncePerCustomer: boolean;
	productIDs: string[];
	collectionIDs: string[];
}

export const createDiscountCode = async (
	shop: string,
	request: Request,
): Promise<{ success: boolean; message: string; }> => {
	const {
		title,
		percentage,
		code,
		startsAt,
		endsAt,
		usageLimit,
		appliesOncePerCustomer,
		productIDs = [],
		collectionIDs = []
	}: CreateDiscountCodeInput = await request.json();

	try {
		const checkCodeExist = await prisma.discountCode.count({ where: { shop, code: code } });
		if (checkCodeExist > 0) {
			return { success: false, message: `The discount code "${code}" already exists. Please try using a different code.` }
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
					title,
					code,
					startsAt,
					endsAt,
					customerSelection: {
						all: true,
					},
					customerGets: {
						value: {
							percentage: percentage / 100,
						},
						items: {} as DiscountCodeItems,
					},
					usageLimit,
					appliesOncePerCustomer,
				} as DiscountCodeBasicInput,
			},
		};

		if (productIDs.length > 0) {
			data.variables.basicCodeDiscount.customerGets.items = {
				products: {
					productVariantsToAdd: productIDs
				}
			} as DiscountCodeItems;
		} else if (collectionIDs?.length > 0) {
			data.variables.basicCodeDiscount.customerGets.items = {
				collections: {
					add: collectionIDs
				}
			} as DiscountCodeItems;
		} else {
			data.variables.basicCodeDiscount.customerGets.items = {
				all: true,
			} as DiscountCodeItems;
		}

		const createDiscountResponse: DiscountCodeResponse = await getDetailUsingGraphQL(shop, accessToken, data);

		if (createDiscountResponse.data.errors) {
			throw new Error(
				createDiscountResponse.data.errors.map((e) => e.message).join(', '),
			);
		}

		const discountCodeData = createDiscountResponse.data?.data?.discountCodeBasicCreate?.codeDiscountNode;
		if (discountCodeData) {
			await prisma.discountCode.create({
				data: {
					code: code,
					title: title,
					shop,
					discountId: discountCodeData?.id,
					startDate: new Date(startsAt),
					endDate: new Date(endsAt),
					discountAmount: percentage,
					discountType: 'PERCENT',
					usageLimit,
					isActive: true,
				},
			});
			return { success: true, message: 'Discount code created successfully' };
		}
		return { success: false, message: 'discount record not added in database' };
	} catch (error) {
		console.error(error, 'Error while creating discount code');
		return { success: false, message: 'Something went wrong' };
	}
};
