import prisma from '../../db.server';
import type { getDiscountCodeResponse } from 'app/routes/api.discount/route';
import { getDetailUsingGraphQL } from 'app/service/product';

const GET_BASIC_DISCOUNT_CODE_QUERY = `
query getDiscountCode($ID: ID!) {
	codeDiscountNode(id: $ID) {
		id
		codeDiscount {
			__typename
			... on DiscountCodeBasic {
				status
				title
				startsAt
				endsAt
				codes(first: 1) {
					edges {
						node {
							code
						}
					}
				}
				customerGets {
					value {
						... on DiscountPercentage {
							percentage
						}
					}
					items {
						... on DiscountProducts {
							productVariants(first: 10) {
								edges {
									node {
										id
										title
										product {
											id
											title
											variantsCount {
												count
											}
											featuredMedia {
												preview {
													image {
														url
													}
												}
											}
										}
									}
								}
							}
						}
						... on DiscountCollections {
							collections(first: 10) {
								edges {
									node {
										id
										title
										productsCount {
											count
										}
										image {
											url
										}
									}
								}
							}
						}
					}
				}
				usageLimit
				appliesOncePerCustomer
			}
		}
	}
}`;

const GET_BUYXGETY_DISCOUNT_CODE_QUERY = `
query getDiscountcode($ID: ID!) {
	codeDiscountNode(id: $ID) {
		id
		codeDiscount {
			__typename
			... on DiscountCodeBxgy {
				status
				title
				startsAt
				endsAt
				codes(first: 1) {
					edges {
						node {
							code
						}
					}
				}
				customerBuys {
					value {
						... on DiscountQuantity {
							quantity
						}
					}
					items {
						... on DiscountCollections {
							collections(first: 10) {
								edges {
									node {
										id
										title
										productsCount {
											count
										}
										image {
											url
										}
									}
								}
							}
						}
						... on DiscountProducts {
							productVariants(first: 10) {
								edges {
									node {
										id
										title
										product {
											id
											title
											variantsCount {
												count
											}
											featuredMedia {
												preview {
													image {
														url
													}
												}
											}
										}
									}
								}
							}
						}
					}
				}
				customerGets {
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
						... on DiscountCollections {
							collections(first: 10) {
								edges {
									node {
										id
										title
										productsCount {
											count
										}
										image {
											url
										}
									}
								}
							}
						}
						... on DiscountProducts {
							productVariants(first: 10) {
								edges {
									node {
										id
										title
										product {
											id
											title
											variantsCount {
												count
											}
											featuredMedia {
												preview {
													image {
														url
													}
												}
											}
										}
									}
								}
							}
						}
					}
				}
				usesPerOrderLimit
				appliesOncePerCustomer
			}
		}
	}
}`;

const GET_AUTOMATIC_BUYXGETY_DISCOUNT_CODE_QUERY = `
query getDiscountcode($ID: ID!) {
	automaticDiscountNode(id: $ID) {
		id
		automaticDiscount {
			... on DiscountAutomaticBxgy {
				status
				title
				startsAt
				endsAt
				usesPerOrderLimit
				customerBuys {
					value {
						... on DiscountQuantity {
							quantity
						}
					}
					items {
						... on DiscountCollections {
							collections(first: 10) {
								edges {
									node {
										id
										title
										productsCount {
											count
										}
										image {
											url
										}
									}
								}
							}
						}
						... on DiscountProducts {
							productVariants(first: 10) {
								edges {
									node {
										id
										title
										product {
											id
											title
											variantsCount {
												count
											}
											featuredMedia {
												preview {
													image {
														url
													}
												}
											}
										}
									}
								}
							}
						}
					}
				}
				customerGets {
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
						... on DiscountCollections {
							collections(first: 10) {
								edges {
									node {
										id
										title
										productsCount {
											count
										}
										image {
											url
										}
									}
								}
							}
						}
						... on DiscountProducts {
							productVariants(first: 10) {
								edges {
									node {
										id
										title
										product {
											id
											title
											variantsCount {
												count
											}
											featuredMedia {
												preview {
													image {
														url
													}
												}
											}
										}
									}
								}
							}
						}
					}
				}
			}
		}
	}
}`;

const GET_AUTOMATIC_BASIC_DISCOUNT_CODE_QUERY = `
query getDiscountCode($ID: ID!) {
	automaticDiscountNode(id: $ID) {
		id
		automaticDiscount {
			... on DiscountAutomaticBasic {
				status
				title
				startsAt
				endsAt
				customerGets {
					value {
						... on DiscountPercentage {
							percentage
						}
					}
					items {
						... on DiscountProducts {
							productVariants(first: 10) {
								edges {
									node {
										id
										title
										product {
											id
											title
											variantsCount {
												count
											}
											featuredMedia {
												preview {
													image {
														url
													}
												}
											}
										}
									}
								}
							}
						}
						... on DiscountCollections {
							collections(first: 10) {
								edges {
									node {
										id
										title
										productsCount {
											count
										}
										image {
											url
										}
									}
								}
							}
						}
					}
				}
			}
		}
	}
}`;

interface DiscountCodeBxgy {
	__typename: 'DiscountCodeBxgy';
	status: string;
	title: string;
	startsAt: string;
	endsAt: string;
	codes: {
		edges: {
			node: {
				code: string;
			};
		}[];
	};
	customerBuys: {
		value: {
			quantity: number;
		};
		items: {
			collections: {
				edges: {
					node: {
						id: string;
						title: string;
						productsCount: {
							count: number;
						};
						image: {
							url: string;
						};
					};
				}[];
			};
			productVariants: {
				edges: {
					node: {
						id: string;
						title: string;
						product: {
							id: string;
							title: string;
							variantsCount: {
								count: number | null;
							};
							featuredMedia: {
								preview: {
									image: {
										url: string;
									};
								};
							};
						};
					};
				}[];
			};
		}[];
	};
	customerGets: {
		value: {
			effect: {
				percentage: number;
			};
			quantity: {
				quantity: number;
			};
		};
		items: {
			collections: {
				edges: {
					node: {
						id: string;
						title: string;
						productsCount: {
							count: number;
						};
						image: {
							url: string;
						};
					};
				}[];
			};
			productVariants: {
				edges: {
					node: {
						id: string;
						title: string;
						product: {
							id: string;
							title: string;
							variantsCount: {
								count: number | null;
							};
							featuredMedia: {
								preview: {
									image: {
										url: string;
									};
								};
							};
						};
					};
				}[];
			};
		}[];
	};
	usesPerOrderLimit: number | null;
	appliesOncePerCustomer: boolean;
}
export interface DiscountCodeBasic {
	__typename: string;
	status: string;
	title: string;
	startsAt: string;
	endsAt: string;
	discountClass: string;
	codes: {
		edges: {
			node: {
				code: string;
			};
		}[];
	};
	customerGets: {
		value: {
			percentage: number;
		};
		items: {
			productVariants: {
				edges: {
					node: {
						id: string;
						title: string;
						product: {
							id: string;
							title: string;
							variantsCount: {
								count: number | null;
							};
							featuredMedia: {
								preview: {
									image: {
										url: string;
									};
								};
							};
						};
					};
				}[];
			};
			collections: {
				edges: {
					node: {
						id: string;
						title: string;
						productsCount: {
							count: number;
						};
						image: {
							url: string | null;
						};
					};
				}[];
			};
		}[];
	};
	usageLimit: number | null;
	appliesOncePerCustomer: boolean;
}

interface BasicDiscountQueryResponse {
	data: {
		data: {
			codeDiscountNode: {
				id: string;
				codeDiscount: DiscountCodeBasic | DiscountCodeBxgy;
			};
			automaticDiscountNode: {
				id: string;
				automaticDiscount: DiscountCodeBasic | DiscountCodeBxgy;
			};
		};
	};
}

export const getDiscountCodeById = async (
	id: number,
	shop: string,
	discountType: string,
	method: string,
): Promise<getDiscountCodeResponse> => {
	try {
		if (!shop || !id || !discountType) {
			return {
				success: false,
				message: 'Required fields id, discountType and shop',
				discountCode: null,
				discountScope: '',
				advancedRule: null,
				method,
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
			query:
				discountType === 'BUYXGETY'
					? method === 'custom'
						? GET_BUYXGETY_DISCOUNT_CODE_QUERY
						: GET_AUTOMATIC_BUYXGETY_DISCOUNT_CODE_QUERY
					: method === 'custom'
						? GET_BASIC_DISCOUNT_CODE_QUERY
						: GET_AUTOMATIC_BASIC_DISCOUNT_CODE_QUERY,
			variables: {
				ID:
					method === 'custom'
						? `gid://shopify/DiscountCodeNode/${id}`
						: `gid://shopify/DiscountAutomaticNode/${id}`,
			},
		};
		const getDiscountCodeByIdFromShopify: BasicDiscountQueryResponse =
			await getDetailUsingGraphQL(shop, accessToken, data);

		const getCodeObj = await prisma.discountCode.findFirst({
			where: {
				shop,
				discountId:
					method === 'custom'
						? `gid://shopify/DiscountCodeNode/${id}`
						: `gid://shopify/DiscountAutomaticNode/${id}`,
			},
		});
		const discountCode =
			method === 'custom'
				? getDiscountCodeByIdFromShopify.data?.data?.codeDiscountNode
				: getDiscountCodeByIdFromShopify.data?.data?.automaticDiscountNode;
		if (
			getDiscountCodeByIdFromShopify.data?.data?.codeDiscountNode ||
			getDiscountCodeByIdFromShopify.data?.data?.automaticDiscountNode
		) {
			return {
				success: true,
				discountCode: [discountCode],
				discountScope: getCodeObj?.discountScope || '',
				advancedRule: getCodeObj?.advancedRule as object | null,
				message: 'Fetch discount code successfully',
				method: method,
			};
		}

		return {
			success: false,
			message: 'Record not found!',
			discountCode: null,
			discountScope: '',
			advancedRule: null,
			method,
		};
	} catch (error) {
		// eslint-disable-next-line no-console
		console.log(
			error,
			'Error fetching dicount code details using an discount id',
		);
		return {
			success: false,
			discountCode: [],
			message: 'Something went wrong',
			discountScope: '',
			advancedRule: null,
			method,
		};
	}
};
