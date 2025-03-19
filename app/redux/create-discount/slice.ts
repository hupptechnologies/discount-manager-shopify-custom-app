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
	totalProductCount: number;
	totalCollectionCount: number;
}

const initialState: CreateDiscountState = {
	products: [],
	isLoading: false,
	pageInfo: null,
	collections: [],
	isCollectionLoading: false,
	collectionPageInfo: null,
	totalProductCount: 0,
	totalCollectionCount: 0,
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
			state.totalProductCount = payload.totalCount;
		});
		builder.addCase(fetchAllProductsAsync.rejected, (state) => {
			state.isLoading = false;
			state.products = [];
			state.pageInfo = null;
			state.totalProductCount = 0;
		});
		builder.addCase(fetchAllCollectionsAsync.pending, (state) => {
			state.isCollectionLoading = true;
		});
		builder.addCase(
			fetchAllCollectionsAsync.fulfilled,
			(state, { payload }) => {
				state.isCollectionLoading = false;
				state.collections = payload.collections;
				state.collectionPageInfo = payload.pageInfo;
				state.totalCollectionCount = payload.totalCount;
			},
		);
		builder.addCase(fetchAllCollectionsAsync.rejected, (state) => {
			state.isCollectionLoading = false;
			state.collections = [];
			state.collectionPageInfo = null;
			state.totalCollectionCount = 0;
		});
	},
});

export const getCreateDiscountDetail = (state: {
	createDiscount: CreateDiscountState;
}) => state.createDiscount;

export default createDiscountSlice.reducer;
