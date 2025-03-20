import { createSlice } from '@reduxjs/toolkit';
import { deleteDiscountCodeAsync, fetchAllDiscountCodesAsync } from './index';

interface Pagination {
	totalCount: number;
	totalPages: number;
	currentPage: number;
}

interface DiscountCode {
	id: number;
	discountId: string;
	code: string;
	discountAmount: number;
	usageLimit: number;
	isActive: boolean;
	startDate: string;
	endDate: string;
	createdAt: string;
}

interface discountState {
	discountCodes: DiscountCode[];
	isLoading: boolean;
	isDeleteDiscountCode: boolean;
	pagination: Pagination;
	discountStats: {
		activeDiscount: { count: number; data: number[]; },
		usedDiscount: { count: number; data: number[]; },
		expiredDiscount: { count: number; data: number[]; },
	};
}

const initialState: discountState = {
	discountCodes: [],
	isLoading: false,
	pagination: {
		totalCount: 0,
		totalPages: 0,
		currentPage: 0
	},
	discountStats: {
		activeDiscount: { count: 0, data: [0,0,0,0,0,0,0] },
		usedDiscount: { count: 0, data: [0,0,0,0,0,0,0] },
		expiredDiscount: { count: 0, data: [0,0,0,0,0,0,0] },
	},
	isDeleteDiscountCode: false
};

const discountSlice = createSlice({
	name: 'discount',
	initialState,
	reducers: {},
	extraReducers: (builder) => {
		builder.addCase(fetchAllDiscountCodesAsync.pending, (state) => {
			state.isLoading = true;
		});
		builder.addCase(fetchAllDiscountCodesAsync.fulfilled, (state, { payload }) => {
			state.isLoading = false;
			state.discountCodes = payload.discountCodes;
			state.pagination = payload.pagination;
			state.discountStats = payload.discountStats;
		});
		builder.addCase(fetchAllDiscountCodesAsync.rejected, (state) => {
			state.isLoading = false;
			state.discountCodes = [];
			state.pagination = {
				totalCount: 0,
				totalPages: 0,
				currentPage: 0
			};
			state.discountStats = {
				activeDiscount: { count: 0, data: [0,0,0,0,0,0,0] },
				usedDiscount: { count: 0, data: [0,0,0,0,0,0,0] },
				expiredDiscount: { count: 0, data: [0,0,0,0,0,0,0] },
			}
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
	},
});

export const getAllDiscountCodeDetail = (state: {
	discount: discountState;
}) => state.discount;

export default discountSlice.reducer;
