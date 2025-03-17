import { createSlice } from '@reduxjs/toolkit';
import { fetchAllProductsAsync } from './index';

interface PageInfo {
	endCursor: string;
	hasNextPage: boolean;
	hasPreviousPage: boolean;
	startCursor: string;
}

interface CreateDiscountState {
	products: any[];
	isLoading: boolean;
	pageInfo: PageInfo | null;
}

const initialState: CreateDiscountState = {
	products: [],
	isLoading: false,
	pageInfo: null,
};

const createDiscountSlice = createSlice({
	name: 'createDiscount',
	initialState,
	reducers: {},
	extraReducers: (builder) => {
		builder.addCase(fetchAllProductsAsync.pending, (state) => {
			state.isLoading = true;
		});
		builder.addCase(fetchAllProductsAsync.fulfilled, (state, { payload }) => {
			state.isLoading = false;
			state.products = payload.products;
			state.pageInfo = payload.pageInfo;
		});
		builder.addCase(fetchAllProductsAsync.rejected, (state) => {
			state.isLoading = false;
			state.products = [];
			state.pageInfo = null;
		});
	},
});

export const getCreateDiscountDetail = (state: {
	createDiscount: CreateDiscountState;
}) => state.createDiscount;

export default createDiscountSlice.reducer;
