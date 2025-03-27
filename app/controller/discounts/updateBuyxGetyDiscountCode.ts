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

export const updateBuyXGetYDiscountCode = async (
	shop: string,
	request: Request,
	id: number,
): Promise<UpdateBuyXGetYDiscountCodeResponse> => {
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
								...((customerBuys.collectionIDs.length > 0 || customerBuys.removeCollectionIDs.length > 0) && {
									collections: {
										...(customerBuys.collectionIDs.length > 0 && {
											add: customerBuys.collectionIDs
										}),
										...(customerBuys.removeCollectionIDs.length > 0 && {
											remove: customerBuys.removeCollectionIDs
										}),
									}
								}),
								...((customerBuys.productIDs.length > 0 || customerBuys.removeProductIDs.length > 0) && {
									products: {
										...(customerBuys.productIDs.length > 0 && {
											productVariantsToAdd: customerBuys.productIDs,
										}),
										...(customerBuys.removeProductIDs.length > 0 && {
											productVariantsToRemove: customerBuys.removeProductIDs,
										}),
									}
								})
							},
							value: {
								quantity: customerBuys.quantity,
							},
						},
						customerGets: {
							items: {
								...((customerGets.collectionIDs.length > 0 || customerGets.removeCollectionIDs.length > 0) && {
									collections: {
										...(customerGets.collectionIDs.length > 0 && {
											add: customerGets.collectionIDs
										}),
										...(customerGets.removeCollectionIDs.length > 0 && {
											remove: customerGets.removeCollectionIDs
										}),
									}
								}),
								...((customerGets.productIDs.length > 0 || customerGets.removeProductIDs.length > 0) && {
									products: {
										...(customerGets.productIDs.length > 0 && {
											productVariantsToAdd: customerGets.productIDs,
										}),
										...(customerGets.removeProductIDs.length > 0 && {
											productVariantsToRemove: customerGets.removeProductIDs,
										}),
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
					discountAmount: Number(customerGets.percentage),
					discountType: 'PERCENT',
					advancedRule: advancedRule !== null && advancedRule !== undefined ? advancedRule : undefined,
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
