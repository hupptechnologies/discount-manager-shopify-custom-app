import { getDetailUsingGraphQL } from 'app/service/product';
import { UPDATE_BUY_X_GET_Y_DISCOUNT_CODE_QUERY, UPDATE_BUY_X_GET_Y_AUTOMATIC_DISCOUNT_CODE_QUERY } from 'app/graphqlQuery/mutationDiscount';

interface DiscountCodeBxgyInput {
	code: string;
	endsAt: string;
	startsAt: string;
	title: string;
	usageLimit: number;
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
}

interface DiscountCodeAutomaticBxgyInput {
	code: string;
	endsAt: string;
	startsAt: string;
	title: string;
	usageLimit: number;
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
}

interface GraphQLResponse {
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
			discountAutomaticBxgyUpdate: {
				automaticDiscountNode: {
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
}

interface UpdateBuyXGetYDiscountCodeResponse {
	success: boolean;
	message: string;
}

interface CreateBuyxGetYDiscountCodeInput {
	title: string;
	code: string;
	startsAt: string;
	endsAt: string;
	usageLimit: String;
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
	* Updates a Buy X Get Y discount code in both Shopify and our app's database.
	* 
	* This function is used to update an existing Buy X Get Y type discount code. It handles 
	* the update operation for both basic and automated Buy X Get Y discount codes in Shopify 
	* and ensures that the updated details are reflected in our app's database as well.
	* 
	* @param {string} shop - The domain of the Shopify store (e.g., 'my-shop.myshopify.com').
	* @param {CreateBuyxGetYDiscountCodeInput} dataPayload - The updated Buy X Get Y discount code details to be applied.
	* @param {number} id - The ID of the Buy X Get Y discount code to update.
	* 
	* @returns {Promise<UpdateBuyXGetYDiscountCodeResponse>} 
	* - A promise that resolves with the response of the update operation, including success status and any relevant messages.
*/

export const updateBuyXGetYDiscountCode = async (
	shop: string,
	dataPayload: CreateBuyxGetYDiscountCodeInput,
	id: number,
): Promise<UpdateBuyXGetYDiscountCodeResponse> => {
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
		if (!shop || !id) {
			return {
				success: false,
				message: 'Required fields id and shop',
			};
		}
		const findDiscountExist = await prisma.discountCode.findFirst({
			where: { shop, id },
		});

		const isCustom = findDiscountExist?.discountMethod === 'CUSTOM';

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
						endsAt,
						startsAt,
						title,
						...(Number(usageLimit) > 0 && {
							usageLimit: Number(usageLimit),
						}),
						customerBuys: {
							items: {
								...((customerBuys.collectionIDs.length > 0 ||
									customerBuys.removeCollectionIDs.length > 0) && {
									collections: {
										...(customerBuys.collectionIDs.length > 0 && {
											add: customerBuys.collectionIDs,
										}),
										...(customerBuys.removeCollectionIDs.length > 0 && {
											remove: customerBuys.removeCollectionIDs,
										}),
									},
								}),
								...((customerBuys.productIDs.length > 0 ||
									customerBuys.removeProductIDs.length > 0) && {
									products: {
										...(customerBuys.productIDs.length > 0 && {
											productVariantsToAdd: customerBuys.productIDs,
										}),
										...(customerBuys.removeProductIDs.length > 0 && {
											productVariantsToRemove: customerBuys.removeProductIDs,
										}),
									},
								}),
							},
							value: {
								quantity: customerBuys.quantity,
							},
						},
						customerGets: {
							items: {
								...((customerGets.collectionIDs.length > 0 ||
									customerGets.removeCollectionIDs.length > 0) && {
									collections: {
										...(customerGets.collectionIDs.length > 0 && {
											add: customerGets.collectionIDs,
										}),
										...(customerGets.removeCollectionIDs.length > 0 && {
											remove: customerGets.removeCollectionIDs,
										}),
									},
								}),
								...((customerGets.productIDs.length > 0 ||
									customerGets.removeProductIDs.length > 0) && {
									products: {
										...(customerGets.productIDs.length > 0 && {
											productVariantsToAdd: customerGets.productIDs,
										}),
										...(customerGets.removeProductIDs.length > 0 && {
											productVariantsToRemove: customerGets.removeProductIDs,
										}),
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
					} as DiscountCodeBxgyInput,
				},
			};

			const dataAuto = {
				query: UPDATE_BUY_X_GET_Y_AUTOMATIC_DISCOUNT_CODE_QUERY,
				variables: {
					id: findDiscountExist.discountId,
					automaticBxgyDiscount: {
						endsAt,
						startsAt,
						title,
						...(Number(usageLimit) > 0 && {
							usageLimit: Number(usageLimit),
						}),
						customerBuys: {
							items: {
								...((customerBuys.collectionIDs.length > 0 ||
									customerBuys.removeCollectionIDs.length > 0) && {
									collections: {
										...(customerBuys.collectionIDs.length > 0 && {
											add: customerBuys.collectionIDs,
										}),
										...(customerBuys.removeCollectionIDs.length > 0 && {
											remove: customerBuys.removeCollectionIDs,
										}),
									},
								}),
								...((customerBuys.productIDs.length > 0 ||
									customerBuys.removeProductIDs.length > 0) && {
									products: {
										...(customerBuys.productIDs.length > 0 && {
											productVariantsToAdd: customerBuys.productIDs,
										}),
										...(customerBuys.removeProductIDs.length > 0 && {
											productVariantsToRemove: customerBuys.removeProductIDs,
										}),
									},
								}),
							},
							value: {
								quantity: customerBuys.quantity,
							},
						},
						customerGets: {
							items: {
								...((customerGets.collectionIDs.length > 0 ||
									customerGets.removeCollectionIDs.length > 0) && {
									collections: {
										...(customerGets.collectionIDs.length > 0 && {
											add: customerGets.collectionIDs,
										}),
										...(customerGets.removeCollectionIDs.length > 0 && {
											remove: customerGets.removeCollectionIDs,
										}),
									},
								}),
								...((customerGets.productIDs.length > 0 ||
									customerGets.removeProductIDs.length > 0) && {
									products: {
										...(customerGets.productIDs.length > 0 && {
											productVariantsToAdd: customerGets.productIDs,
										}),
										...(customerGets.removeProductIDs.length > 0 && {
											productVariantsToRemove: customerGets.removeProductIDs,
										}),
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
					} as DiscountCodeAutomaticBxgyInput,
				},
			};

			const updateDiscountCodeFromShopify: GraphQLResponse =
				await getDetailUsingGraphQL(
					shop,
					accessToken,
					isCustom ? data : dataAuto,
				);

			if (
				updateDiscountCodeFromShopify?.data?.data?.discountCodeBxgyUpdate
					?.userErrors.length > 0 ||
				updateDiscountCodeFromShopify?.data?.data?.discountAutomaticBxgyUpdate
					?.userErrors?.length > 0
			) {
				const errorsBasicQuery =
					updateDiscountCodeFromShopify.data?.data?.discountCodeBxgyUpdate?.userErrors
						.map((error) => `${error.field}: ${error.message}`)
						.join(', ');
				const errorsAutomaticBasicQuery =
					updateDiscountCodeFromShopify.data.data?.discountAutomaticBxgyUpdate?.userErrors
						.map((error) => `${error.field}: ${error.message}`)
						.join(', ');
				throw new Error(
					`GraphQL errors: ${isCustom ? errorsBasicQuery : errorsAutomaticBasicQuery}`,
				);
			}

			await prisma.discountCode.update({
				where: { shop, id },
				data: {
					code,
					title,
					shop,
					discountId: findDiscountExist?.discountId,
					startDate: new Date(startsAt),
					endDate: new Date(endsAt),
					discountAmount: Number(customerGets.percentage),
					discountType: 'PERCENT',
					advancedRule:
						advancedRule !== null && advancedRule !== undefined
							? advancedRule
							: undefined,
					usageLimit: Number(usageLimit) ? Number(usageLimit) : 0,
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
