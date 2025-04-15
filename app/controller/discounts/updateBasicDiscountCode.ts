import prisma from '../../db.server';
import { getDetailUsingGraphQL } from 'app/service/product';
import { UPDATE_BASIC_DISCOUNT_CODE_QUERY, UPDATE_BASIC_AUTOMATIC_DISCOUNT_CODE_QUERY } from 'app/graphqlQuery/mutationDiscount';

type DiscountCodeItems =
	| { all: boolean }
	| { products: { productVariantsToAdd: string[]; productVariantsToRemove: string[]; } }
	| { collections: { add: string[]; remove: string[]; } };

export type DiscountCodeCustomerSelection =
	| { all: boolean }
	| { customers: { add: string[]; remove: string[]; } }

interface DiscountCodeBasicInput {
	code: string;
	startsAt: string;
	endsAt: string;
	appliesOncePerCustomer: boolean;
	usageLimit: number;
	customerSelection: DiscountCodeCustomerSelection;
	customerGets: {
		value: {
			percentage: number;
		};
		items: DiscountCodeItems;
	};
}

interface DiscountCodeBasicAutomaticInput {
	title: string;
	startsAt: string;
	endsAt: string;
	customerGets: {
		value: {
			percentage: number;
		};
		items: DiscountCodeItems;
	};
}

interface GraphQLResponse {
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
			discountAutomaticBasicUpdate: {
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

interface UpdateBasicDiscountCodeResponse {
	success: boolean;
	message: string;
}

interface CreateDiscountCodeInput {
	title: string;
	code: string;
	startsAt: string;
	endsAt: string;
	usageLimit: number;
	appliesOncePerCustomer: boolean;
	customers: {
		customerIDs: string[];
		removeCustomersIDs: string[];
	}
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
	* Updates a basic or automated discount code in both Shopify and our app's database.
	* 
	* This function is used to update the details of an existing discount code. It handles 
	* updates for different discount types such as order, product, and shipping discounts. 
	* The updated details are reflected both in Shopify and in our app's database to ensure 
	* consistency across platforms.
	* 
	* @param {string} shop - The domain of the Shopify store (e.g., 'my-shop.myshopify.com').
	* @param {CreateDiscountCodeInput} dataPayload - The updated discount code details to be applied.
	* @param {number} id - The ID of the discount code to update.
	* 
	* @returns {Promise<UpdateBasicDiscountCodeResponse>} 
	* - A promise that resolves with the response of the update operation, including success status and any relevant messages.
*/

export const updateBasicDiscountCode = async (
	shop: string,
	dataPayload: CreateDiscountCodeInput,
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
		advancedRule,
		customers
	} = dataPayload;

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

		const isCustom = findDiscountExist?.discountId.includes('DiscountCodeNode');

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
						...(!findDiscountExist?.isMultiple && {
							code: code,
						}),
						startsAt: startsAt,
						endsAt: endsAt,
						appliesOncePerCustomer: appliesOncePerCustomer,
						usageLimit: usageLimit,
						...(findDiscountExist?.discountScope !== 'SHIPPING' && {
							customerSelection: {
								...((customers.customerIDs?.length > 0 || customers.removeCustomersIDs.length > 0) && {
									customers: {
										...((customers.customerIDs?.length > 0 && isCustom) && {
											add: customers.customerIDs
										}),
										...((customers.removeCustomersIDs?.length > 0 && isCustom) && {
											remove: customers.removeCustomersIDs
										}),
									},
								}),
								...((customers.customerIDs?.length == 0 && customers.removeCustomersIDs.length == 0) && {
									all: true
								}),
							},
						}),
						...(findDiscountExist?.discountScope !== 'SHIPPING' && {
							customerGets: {
								value: {
									percentage: Number(customerGets.percentage) / 100,
								},
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
							},
						}),
						...(findDiscountExist?.discountScope === 'SHIPPING' && {
							customerGets: {
								value: {
									discountAmount: {
										amount: Number(customerGets.percentage) / 100,
										appliesOnEachItem: false
									}
								},
								items: {
									all: true
								}
							}
						})
					} as DiscountCodeBasicInput,
				},
			};

			const dataAuto = {
				query: UPDATE_BASIC_AUTOMATIC_DISCOUNT_CODE_QUERY,
				variables: {
					id: findDiscountExist?.discountId,
					automaticBasicDiscount: {
						title: title,
						startsAt: startsAt,
						endsAt: endsAt,
						customerGets: {
							value: {
								percentage: Number(customerGets.percentage) / 100,
							},
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
						},
					} as DiscountCodeBasicAutomaticInput,
				},
			};

			if (customerGets?.productIDs?.length === 0 && customerGets?.removeProductIDs?.length === 0 && customerGets.collectionIDs.length > 0 && customerGets.removeCollectionIDs.length === 0) {
				if (isCustom) {
					data.variables.basicCodeDiscount.customerGets.items = { all: true };
				} else {
					dataAuto.variables.automaticBasicDiscount.customerGets.items = {
						all: true,
					};
				}
			}

			const updateDiscountCodeFromShopify: GraphQLResponse =
				await getDetailUsingGraphQL(
					shop,
					accessToken,
					isCustom ? data : dataAuto,
				);

			if (
				updateDiscountCodeFromShopify.data.data?.discountCodeBasicUpdate
					?.userErrors.length > 0 ||
				updateDiscountCodeFromShopify.data.data?.discountAutomaticBasicUpdate
					?.userErrors.length > 0
			) {
				const errorsBasicQuery =
					updateDiscountCodeFromShopify.data.data?.discountCodeBasicUpdate?.userErrors
						.map((error) => `${error.field}: ${error.message}`)
						.join(', ');
				const errorsAutomaticBasicQuery =
					updateDiscountCodeFromShopify.data.data?.discountAutomaticBasicUpdate?.userErrors
						.map((error) => `${error.field}: ${error.message}`)
						.join(', ');
				throw new Error(
					`GraphQL errors: ${isCustom ? errorsBasicQuery : errorsAutomaticBasicQuery}`,
				);
			}

			await prisma.discountCode.update({
				where: { shop, id },
				data: {
					code: isCustom ? code: title,
					title: title,
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
					usageLimit: usageLimit ? usageLimit : 0,
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
