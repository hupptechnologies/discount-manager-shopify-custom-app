export const CREATE_BUYXGETY_DISCOUNT_QUERY = `
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
					usageLimit
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

export const CREATE_BUYXGETY_AUTOMATIC_DISCOUNT_CODE_QUERY = `
mutation CreateBxgyDiscount($automaticBxgyDiscount: DiscountAutomaticBxgyInput!) {
	discountAutomaticBxgyCreate(automaticBxgyDiscount: $automaticBxgyDiscount) {
		automaticDiscountNode {
			id
			automaticDiscount {
				... on DiscountAutomaticBxgy {
					title
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
						appliesOnSubscription
						appliesOnOneTimePurchase
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
				}
			}
		}
		userErrors {
			field
			message
		}
	}
}`;

export const CREATE_BASIC_DISCOUNT_CODE_QUERY = `
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

export const CREATE_AUTOMATIC_BASIC_DISCOUNTCODE_QUERY = `
mutation discountAutomaticBasicCreate($automaticBasicDiscount: DiscountAutomaticBasicInput!) {
	discountAutomaticBasicCreate(automaticBasicDiscount: $automaticBasicDiscount) {
		automaticDiscountNode {
			id
			automaticDiscount {
				... on DiscountAutomaticBasic {
					title
					startsAt
					endsAt
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
			code
			message
		}
	}
}`;

export const DELETE_DISCOUNT_CODE_QUERY = `
mutation DeleteDiscountCode($id: ID!) {
	discountCodeDelete(id: $id) {
		deletedCodeDiscountId
		userErrors {
			field
			code
			message
		}
	}
}`;

export const DELETE_AUTOMATIC_DISCOUNT_CODE_QUERY = `
mutation DeleteDiscountCode($id: ID!) {
	discountAutomaticDelete(id: $id) {
		deletedAutomaticDiscountId
		userErrors {
			field
			code
			message
		}
	}
}`;

export const DELETE_BULK_REDEEM_DISCOUNT_CODES_QUERY = `
mutation discountCodeRedeemCodeBulkDelete($discountId: ID!, $ids: [ID!]) {
	discountCodeRedeemCodeBulkDelete(discountId: $discountId, ids: $ids) {
		job {
			id
		}
		userErrors {
			code
			field
			message
		}
	}
}`;

export const UPDATE_BASIC_DISCOUNT_CODE_QUERY = `
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

export const UPDATE_BASIC_AUTOMATIC_DISCOUNT_CODE_QUERY = `
mutation discountAutomaticBasicUpdate($automaticBasicDiscount: DiscountAutomaticBasicInput!, $id: ID!) {
	discountAutomaticBasicUpdate(automaticBasicDiscount: $automaticBasicDiscount, id: $id) {
		automaticDiscountNode {
			id
		}
		userErrors {
			field
			message
		}
	}
}`;

export const UPDATE_BUY_X_GET_Y_DISCOUNT_CODE_QUERY = `
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

export const UPDATE_BUY_X_GET_Y_AUTOMATIC_DISCOUNT_CODE_QUERY = `
mutation UpdateBxgyDiscount($id: ID!, $automaticBxgyDiscount: DiscountAutomaticBxgyInput!) {
	discountAutomaticBxgyUpdate(id: $id, automaticBxgyDiscount: $automaticBxgyDiscount) {
		automaticDiscountNode {
			id
			automaticDiscount {
				... on DiscountAutomaticBxgy {
					title
					startsAt
					endsAt
				}
			}
		}
		userErrors {
			field
			message
		}
	}
}`;