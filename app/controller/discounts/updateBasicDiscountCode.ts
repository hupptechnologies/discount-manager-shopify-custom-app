import prisma from '../../db.server';
import { getDetailUsingGraphQL } from 'app/service/product';

const UPDATE_BASIC_DISCOUNT_CODE_QUERY = `
mutation discountCodeBasicUpdate($id: ID!, $basicCodeDiscount: DiscountCodeBasicInput!) {
	discountCodeBasicUpdate(id: $id, basicCodeDiscount: $basicCodeDiscount) {
		codeDiscountNode {
			id
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
	| { products: { productVariantsToAdd: string[] } }
	| { collections: { add: string[] } };

type DiscountCodeBasicInput = {
	code: string;
	appliesOncePerCustomer: boolean;
	usageLimit: number;
	customerGets: {
		value: {
			percentage: number;
		};
		items: DiscountCodeItems;
	};
};

type GraphQLResponse = {
	data: {
		data: {
			discountCodeBasicUpdate: {
				codeDiscountNode: {
					id: string;
				};
				userErrors: Array<{
					field: string;
					code: string;
					message: string;
				}>;
			};
		};
	};
};

type UpdateBasicDiscountCodeResponse = {
	success: boolean;
	message: string;
};

interface CreateDiscountCodeInput {
	title: string;
	code: string;
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
	advancedRule: object | null;
}

export const updateBasicDiscountCode = async (
	shop: string,
	request: Request,
	id: number,
): Promise<UpdateBasicDiscountCodeResponse> => {
	const {
		title,
		code,
		startsAt,
		endsAt,
		usageLimit,
		appliesOncePerCustomer,
		customerGets,
		advancedRule
	}: CreateDiscountCodeInput = await request.json();
	try {
		if (!shop || !id) {
			return {
				success: false,
				message: 'Required fields id and shop'
			}
		}
		const findDiscountExist = await prisma.discountCode.findFirst({
			where: { shop, id },
		});

		if (findDiscountExist) {
			const response = await prisma.session.findMany({
				where: { shop },
			});
			const accessToken = response[0]?.accessToken;

			if (!accessToken) {
				throw new Error('Access token not found');
			}

			const data = {
				query: UPDATE_BASIC_DISCOUNT_CODE_QUERY,
				variables: {
					id: findDiscountExist?.discountId,
					basicCodeDiscount: {
						title: title,
						code: code,
						startsAt: startsAt,
						endsAt: endsAt,
						appliesOncePerCustomer: appliesOncePerCustomer,
						usageLimit: usageLimit,
						customerGets: {
							value: {
								percentage: Number(customerGets.percentage) / 100,
							},
							items: {} as DiscountCodeItems,
						},
					} as DiscountCodeBasicInput,
				},
			};

			if (customerGets.productIDs.length > 0 || customerGets.removeProductIDs.length > 0) {
				data.variables.basicCodeDiscount.customerGets.items = {
					products: {
						...(customerGets.productIDs.length > 0 && {
							productVariantsToAdd: customerGets.productIDs,
						}),
						...(customerGets.removeProductIDs.length > 0 && {
							productVariantsToRemove: customerGets.removeProductIDs,
						}),
					},
				} as DiscountCodeItems;
			} else if (customerGets.collectionIDs?.length > 0 || customerGets.removeCollectionIDs.length > 0) {
				data.variables.basicCodeDiscount.customerGets.items = {
					collections: {
						...(customerGets.collectionIDs.length > 0 && {
							add: customerGets.collectionIDs
						}),
						...(customerGets.removeCollectionIDs.length > 0 && {
							remove: customerGets.removeCollectionIDs
						})
					},
				} as DiscountCodeItems;
			} else {
				data.variables.basicCodeDiscount.customerGets.items = {
					all: true,
				} as DiscountCodeItems;
			}

			const updateDiscountCodeFromShopify: GraphQLResponse =
				await getDetailUsingGraphQL(shop, accessToken, data);

			if (
				updateDiscountCodeFromShopify.data.data?.discountCodeBasicUpdate
					.userErrors.length > 0
			) {
				const errors =
					updateDiscountCodeFromShopify.data.data?.discountCodeBasicUpdate.userErrors
						.map((error) => `${error.field}: ${error.message}`)
						.join(', ');
				throw new Error(`GraphQL errors: ${errors}`);
			}

			await prisma.discountCode.update({
				where: { shop, id },
				data: {
					code: code,
					title: title,
					shop,
					discountId:
						updateDiscountCodeFromShopify?.data?.data?.discountCodeBasicUpdate
							?.codeDiscountNode.id,
					startDate: new Date(startsAt),
					endDate: new Date(endsAt),
					discountAmount: Number(customerGets.percentage),
					discountType: 'PERCENT',
					advancedRule: advancedRule !== null && advancedRule !== undefined ? advancedRule : undefined,
					usageLimit,
					isActive: true,
				},
			});

			return { success: true, message: 'Discount code updated successfully' };
		}

		return { success: false, message: 'Record not found!' };
	} catch (error) {
		// eslint-disable-next-line no-console
		console.error(error, 'Error while updating basic discount code');
		return { success: false, message: 'Something went wrong' };
	}
};
