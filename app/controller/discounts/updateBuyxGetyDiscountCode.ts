import { getDetailUsingGraphQL } from 'app/service/product';

const UPDATE_BUY_X_GET_Y_DISCOUNT_CODE_QUERY = `
mutation discountCodeBxgyUpdate($id: ID!, $bxgyCodeDiscount: DiscountCodeBxgyInput!) {
	discountCodeBxgyUpdate(id: $id, bxgyCodeDiscount: $bxgyCodeDiscount) {
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

type DiscountCodeBxgyInput = {
	code: string;
	endsAt: string;
	startsAt: string;
	title: string;
	usesPerOrderLimit: number;
	customerBuys: {
		items: {
			collections: {
				add: string[];
				remove: string[];
			};
		};
		value: {
			quantity: string;
		};
	};
	customerGets: {
		items: {
			collections: {
				add: string[];
				remove: string[];
			};
		};
		value: {
			discountOnQuantity: {
				effect: {
					percentage: number;
				};
				quantity: string;
			};
		};
	};
};

type GraphQLResponse = {
	data: {
		data: {
			discountCodeBxgyUpdate: {
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

type UpdateBuyXGetYDiscountCodeResponse = {
	success: boolean;
	message: string;
};

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
	advancedRule: object | null;
}

export const updateBuyXGetYDiscountCode = async (
	shop: string,
	request: Request,
	id: number,
): Promise<UpdateBuyXGetYDiscountCodeResponse> => {
	const {
		title,
		percentage,
		code,
		startsAt,
		endsAt,
		usageLimit,
		customerBuys,
		customerGets,
		advancedRule
	}: CreateBuyxGetYDiscountCodeInput = await request.json();
	try {
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
				query: UPDATE_BUY_X_GET_Y_DISCOUNT_CODE_QUERY,
				variables: {
					id: findDiscountExist.discountId,
					bxgyCodeDiscount: {
						code,
						endsAt,
						startsAt,
						title,
						usesPerOrderLimit: usageLimit,
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
					} as DiscountCodeBxgyInput,
				},
			};

			const updateDiscountCodeFromShopify: GraphQLResponse =
				await getDetailUsingGraphQL(shop, accessToken, data);

			if (
				updateDiscountCodeFromShopify.data?.data?.discountCodeBxgyUpdate
					.userErrors.length > 0
			) {
				const errors =
					updateDiscountCodeFromShopify.data?.data?.discountCodeBxgyUpdate.userErrors
						.map((error) => `${error.field}: ${error.message}`)
						.join(', ');
				throw new Error(`GraphQL errors: ${errors}`);
			}

			await prisma.discountCode.update({
				where: { shop, id },
				data: {
					code,
					title,
					shop,
					discountId:
						updateDiscountCodeFromShopify?.data?.data?.discountCodeBxgyUpdate
							?.codeDiscountNode?.id,
					startDate: new Date(startsAt),
					endDate: new Date(endsAt),
					discountAmount: percentage,
					discountType: 'PERCENT',
					advancedRule,
					usageLimit,
					isActive: true,
				},
			});

			return {
				success: true,
				message: 'Buy X Get Y discount code updated successfully',
			};
		}

		return { success: false, message: 'Record not found' };
	} catch (error) {
		// eslint-disable-next-line no-console
		console.error(error, 'Error while updating Buy X Get Y discount code');
		return { success: false, message: 'Something went wrong' };
	}
};
