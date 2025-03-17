import { createSlice } from '@reduxjs/toolkit';
import { fetchAllCollectionsAsync, fetchAllProductsAsync } from './index';

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
	collections: any[];
	isCollectionLoading: boolean;
	collectionPageInfo: PageInfo | null;
}

const initialState: CreateDiscountState = {
	products: [],
	isLoading: false,
	pageInfo: null,
	collections: [],
	isCollectionLoading: false,
	collectionPageInfo: null
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
		builder.addCase(fetchAllCollectionsAsync.pending, (state) => {
			state.isCollectionLoading = true;
		});
		builder.addCase(fetchAllCollectionsAsync.fulfilled, (state, { payload }) => {
			state.isCollectionLoading = false;
			state.collections = payload.collections;
			state.collectionPageInfo = payload.pageInfo;
		});
		builder.addCase(fetchAllCollectionsAsync.rejected, (state) => {
			state.isCollectionLoading = false;
			state.collections = [];
			state.collectionPageInfo = null;
		});
	},
});

export const getCreateDiscountDetail = (state: {
	createDiscount: CreateDiscountState;
}) => state.createDiscount;

export default createDiscountSlice.reducer;
