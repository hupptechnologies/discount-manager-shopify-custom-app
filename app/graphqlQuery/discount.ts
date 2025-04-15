export const DISCOUNT_TYPE_QUERY = `
query getDiscountCode($ID: ID!) {
	codeDiscountNode(id: $ID) {
		codeDiscount {
			__typename
		}
	}
	automaticDiscountNode(id: $ID) {
		automaticDiscount {
			__typename
		}
	}
}`;

export const GET_DISCOUNT_CODES_QUERY = `
query GetDiscountCodes($id: ID!) {
	codeDiscountNode(id: $id) {
		codeDiscount {
			... on DiscountCodeBasic {
				codes(first: 100) {
					edges {
						node {
							code
						}
					}
				}
			}
		}
	}
}`;

export const GET_ALL_DISCOUNT_DETAILS_QUERY = `
query getDiscountCode($ID: ID!) {
	codeDiscountNode(id: $ID) {
		codeDiscount {
			__typename
			... on DiscountCodeBasic {
				status
				title
				startsAt
				endsAt
				discountClass
				appliesOncePerCustomer
				usageLimit
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
			}
			... on DiscountCodeFreeShipping {
				status
				title
				startsAt
				endsAt
				discountClass
				appliesOncePerCustomer
				usageLimit
				maximumShippingPrice {
					amount
					currencyCode
				}
				codes(first: 1) {
					edges {
						node {
							code
						}
					}
				}
			}
			... on DiscountCodeBxgy {
				status
				title
				startsAt
				endsAt
				discountClass
				usageLimit
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
	automaticDiscountNode(id: $ID) {
		automaticDiscount {
			__typename
			... on DiscountAutomaticBasic {
				status
				title
				startsAt
				endsAt
				discountClass
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
			... on DiscountAutomaticFreeShipping {
				status
				title
				startsAt
				endsAt
				discountClass
				maximumShippingPrice {
					amount
					currencyCode
				}
			}
			... on DiscountAutomaticBxgy {
				status
				title
				startsAt
				endsAt
				usesPerOrderLimit
				discountClass
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

export const GET_BASIC_DISCOUNT_CODE_USAGE_COUNT_QUERY = `
query getDiscountCode($ID: ID!) {
	codeDiscountNode(id: $ID) {
		codeDiscount {
			... on DiscountCodeBasic {
				asyncUsageCount
			}
		}
	}
}`;