import { createSlice } from '@reduxjs/toolkit';
import { fetchAllDiscountCodesAsync } from './index';

interface Pagination {
	totalCount: number;
	totalPages: number;
	currentPage: number;
}

interface DiscountCode {
	id: number;
	code: string;
	discountAmount: number;
	usageLimit: number;
	isActive: boolean;
	startDate: string;
	endDate: string;
}

interface discountState {
	discountCodes: DiscountCode[];
	isLoading: boolean;
	pagination: Pagination | null;
}

const initialState: discountState = {
	discountCodes: [],
	isLoading: false,
	pagination: null
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
		});
		builder.addCase(fetchAllDiscountCodesAsync.rejected, (state) => {
			state.isLoading = false;
			state.discountCodes = [];
			state.pagination = null;
		});
	},
});

export const getAllDiscountCodeDetail = (state: {
	discount: discountState;
}) => state.discount;

export default discountSlice.reducer;
