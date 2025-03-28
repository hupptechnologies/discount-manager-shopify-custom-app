import { createSlice } from '@reduxjs/toolkit';
import type { DiscountCode } from './index';
import {
	createBuyXGetYDiscountCodeAsync,
	createDiscountCodeAsync,
	deleteAllDiscountCodeAsync,
	deleteDiscountCodeAsync,
	fetchAllDiscountCodesAsync,
	getDiscountCodeByIdAsync,
	updateBuyXGetYDiscountCodeAsync,
	updateDiscountCodeAsync,
} from './index';
import { AdvancedRuleObject } from 'app/service/discount';

interface Pagination {
	totalCount: number;
	totalPages: number;
	currentPage: number;
}

export interface nodeList {
	node: {
		code: string;
	};
}

export interface ItemsList {
	node: {
		title: string;
		id: string;
		product: {
			variantsCount: {
				count: number;
			};
			featuredMedia: {
				preview: {
					image: {
						url: string;
					};
				};
			};
		};
		productsCount: {
			count: number;
		};
		image: {
			url: string;
		}
	};
}

export interface GetDiscountCodeList {
	codeDiscount: {
		title: string;
		usageLimit: string;
		startsAt: string;
		endsAt: string;
		appliesOncePerCustomer: boolean;
		codes: {
			edges: nodeList[];
		};
		usesPerOrderLimit: string;
		customerGets: {
			value: {
				effect: {
					percentage: number;
				}
				quantity: {
					quantity: string;
				}
				percentage: number;
			};
			items: {
				productVariants: {
					edges: ItemsList[];
				};
				collections: {
					edges: ItemsList[];
				}
			};
		};
		customerBuys: {
			value: {
				quantity: string;
			};
			items: {
				productVariants: {
					edges: ItemsList[];
				};
				collections: {
					edges: ItemsList[];
				}
			};
		}
	};
	automaticDiscount: {
		title: string;
		usageLimit: string;
		startsAt: string;
		endsAt: string;
		appliesOncePerCustomer: boolean;
		codes: {
			edges: nodeList[];
		};
		usesPerOrderLimit: string;
		customerGets: {
			value: {
				effect: {
					percentage: number;
				}
				quantity: {
					quantity: string;
				}
				percentage: number;
			};
			items: {
				productVariants: {
					edges: ItemsList[];
				};
				collections: {
					edges: ItemsList[];
				}
			};
		};
		customerBuys: {
			value: {
				quantity: string;
			};
			items: {
				productVariants: {
					edges: ItemsList[];
				};
				collections: {
					edges: ItemsList[];
				}
			};
		}
	};
}

interface discountState {
	discountCodes: DiscountCode[];
	isLoading: boolean;
	isDeleteDiscountCode: boolean;
	isDeleteAllDiscountCode: boolean;
	isCreateDiscountCode: boolean;
	isBuyXGetYCreateDiscountCode: boolean;
	isGetDiscountCodeById: boolean;
	isUpdateDiscountCode: boolean;
	isUpdateBuyXGetyDiscountCode: boolean;
	pagination: Pagination;
	discountStats: {
		activeDiscount: { count: number; data: number[] };
		usedDiscount: { count: number; data: number[] };
		expiredDiscount: { count: number; data: number[] };
	};
	getDiscountCode: GetDiscountCodeList[];
	discountScope: string;
	advancedRule: AdvancedRuleObject | null;
	updateDiscountCodeId: number | null;
	method: string;
}

const initialState: discountState = {
	discountCodes: [],
	isLoading: false,
	pagination: {
		totalCount: 0,
		totalPages: 0,
		currentPage: 0,
	},
	discountStats: {
		activeDiscount: { count: 0, data: [0, 0, 0, 0, 0, 0, 0] },
		usedDiscount: { count: 0, data: [0, 0, 0, 0, 0, 0, 0] },
		expiredDiscount: { count: 0, data: [0, 0, 0, 0, 0, 0, 0] },
	},
	isDeleteDiscountCode: false,
	isDeleteAllDiscountCode: false,
	isCreateDiscountCode: false,
	isBuyXGetYCreateDiscountCode: false,
	isGetDiscountCodeById: false,
	isUpdateDiscountCode: false,
	isUpdateBuyXGetyDiscountCode: false,
	getDiscountCode: [],
	discountScope: '',
	updateDiscountCodeId: null,
	advancedRule: null,
	method: ''
};

const discountSlice = createSlice({
	name: 'discount',
	initialState,
	reducers: {
		handleUpdateDiscountCodeId: (state, { payload }) => {
			state.updateDiscountCodeId = payload.id;
		},
		handleResetGetDiscountCode: (state) => {
			state.getDiscountCode = [];
		}
	},
	extraReducers: (builder) => {
		builder.addCase(fetchAllDiscountCodesAsync.pending, (state) => {
			state.isLoading = true;
		});
		builder.addCase(
			fetchAllDiscountCodesAsync.fulfilled,
			(state, { payload }) => {
				state.isLoading = false;
				state.discountCodes = payload.discountCodes;
				state.pagination = payload.pagination;
				state.discountStats = payload.discountStats;
			},
		);
		builder.addCase(fetchAllDiscountCodesAsync.rejected, (state) => {
			state.isLoading = false;
			state.discountCodes = [];
			state.pagination = {
				totalCount: 0,
				totalPages: 0,
				currentPage: 0,
			};
			state.discountStats = {
				activeDiscount: { count: 0, data: [0, 0, 0, 0, 0, 0, 0] },
				usedDiscount: { count: 0, data: [0, 0, 0, 0, 0, 0, 0] },
				expiredDiscount: { count: 0, data: [0, 0, 0, 0, 0, 0, 0] },
			};
		});
		builder.addCase(deleteDiscountCodeAsync.pending, (state) => {
			state.isDeleteDiscountCode = true;
		});
		builder.addCase(deleteDiscountCodeAsync.fulfilled, (state) => {
			state.isDeleteDiscountCode = false;
		});
		builder.addCase(deleteDiscountCodeAsync.rejected, (state) => {
			state.isDeleteDiscountCode = false;
		});
		builder.addCase(deleteAllDiscountCodeAsync.pending, (state) => {
			state.isDeleteAllDiscountCode = true;
		});
		builder.addCase(deleteAllDiscountCodeAsync.fulfilled, (state) => {
			state.isDeleteAllDiscountCode = false;
		});
		builder.addCase(deleteAllDiscountCodeAsync.rejected, (state) => {
			state.isDeleteAllDiscountCode = false;
		});
		builder.addCase(createDiscountCodeAsync.pending, (state) => {
			state.isCreateDiscountCode = true;
		});
		builder.addCase(createDiscountCodeAsync.fulfilled, (state) => {
			state.isCreateDiscountCode = false;
		});
		builder.addCase(createDiscountCodeAsync.rejected, (state) => {
			state.isCreateDiscountCode = false;
		});
		builder.addCase(createBuyXGetYDiscountCodeAsync.pending, (state) => {
			state.isBuyXGetYCreateDiscountCode = true;
		});
		builder.addCase(createBuyXGetYDiscountCodeAsync.fulfilled, (state) => {
			state.isBuyXGetYCreateDiscountCode = false;
		});
		builder.addCase(createBuyXGetYDiscountCodeAsync.rejected, (state) => {
			state.isBuyXGetYCreateDiscountCode = false;
		});
		builder.addCase(getDiscountCodeByIdAsync.pending, (state) => {
			state.isGetDiscountCodeById = true;
		});
		builder.addCase(
			getDiscountCodeByIdAsync.fulfilled,
			(state, { payload }) => {
				state.isGetDiscountCodeById = false;
				state.getDiscountCode = payload.discountCode;
				state.discountScope = payload.discountScope;
				state.advancedRule = payload.advancedRule;
				state.method = payload.method;
			},
		);
		builder.addCase(getDiscountCodeByIdAsync.rejected, (state) => {
			state.isGetDiscountCodeById = false;
			state.getDiscountCode = [];
			state.discountScope = '';
			state.advancedRule = null;
			state.method = '';
		});
		builder.addCase(updateDiscountCodeAsync.pending, (state) => {
			state.isUpdateDiscountCode = true;
		});
		builder.addCase(updateDiscountCodeAsync.rejected, (state) => {
			state.isUpdateDiscountCode = false;
		});
		builder.addCase(updateBuyXGetYDiscountCodeAsync.pending, (state) => {
			state.isUpdateBuyXGetyDiscountCode = true;
		});
		builder.addCase(updateBuyXGetYDiscountCodeAsync.rejected, (state) => {
			state.isUpdateBuyXGetyDiscountCode = false;
		});
	},
});

export const { handleUpdateDiscountCodeId, handleResetGetDiscountCode } = discountSlice.actions;

export const getAllDiscountCodeDetail = (state: { discount: discountState }) =>
	state.discount;

export default discountSlice.reducer;
