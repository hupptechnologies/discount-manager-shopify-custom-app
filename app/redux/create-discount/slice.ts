import { createSlice } from '@reduxjs/toolkit';
import {
	fetchAllCollectionsAsync,
	fetchAllCustomersAsync,
	fetchAllProductCategoryAsync,
	fetchAllProductsAsync,
	fetchProductVariantsAsync,
} from './index';

export interface VariantItem {
	node: {
		id: string;
		title: string;
		price: string;
		inventoryQuantity: number;
		image: {
			url: string;
		};
	};
}

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
	variants: VariantItem[];
	isFetchProductVariants: boolean;
	customers: any[];
	isCustomersLoading: boolean;
	customerPageInfo: PageInfo | null;
	totalCustomerCount: number;
	categories: {
		node: {
			id: string;
			name: string;
			fullName: string;
			childrenIds: string[];
		}
	}[];
	isCategory: boolean;
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
	variants: [],
	isFetchProductVariants: false,
	customers: [],
	isCustomersLoading: false,
	customerPageInfo: null,
	totalCustomerCount: 0,
	categories: [],
	isCategory: false
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
		builder.addCase(fetchProductVariantsAsync.pending, (state) => {
			state.isFetchProductVariants = true;
		});
		builder.addCase(
			fetchProductVariantsAsync.fulfilled,
			(state, { payload }) => {
				state.isFetchProductVariants = false;
				state.variants = payload.variants;
			},
		);
		builder.addCase(fetchProductVariantsAsync.rejected, (state) => {
			state.isFetchProductVariants = false;
			state.variants = [];
		});
		builder.addCase(fetchAllCustomersAsync.pending, (state) => {
			state.isCustomersLoading = true;
		});
		builder.addCase(
			fetchAllCustomersAsync.fulfilled,
			(state, { payload }) => {
				state.isCustomersLoading = false;
				state.customers = payload.customers;
				state.customerPageInfo = payload.pageInfo;
				state.totalCustomerCount = payload.totalCount;
			},
		);
		builder.addCase(fetchAllCustomersAsync.rejected, (state) => {
			state.isCustomersLoading = false;
			state.customers = [];
			state.collectionPageInfo = null;
			state.totalCustomerCount = 0;
		});
		builder.addCase(fetchAllProductCategoryAsync.pending, (state) => {
			state.isCategory = true;
		});
		builder.addCase(fetchAllProductCategoryAsync.fulfilled, (state, { payload }) => {
			state.isCategory = false;
			state.categories = payload.categories;
		});
		builder.addCase(fetchAllProductCategoryAsync.rejected, (state) => {
			state.isCategory = false;
		});
	},
});

export const getCreateDiscountDetail = (state: {
	createDiscount: CreateDiscountState;
}) => state.createDiscount;

export default createDiscountSlice.reducer;
