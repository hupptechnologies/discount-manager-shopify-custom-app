import { createAsyncThunk } from '@reduxjs/toolkit';
import type { AxiosError } from 'axios';
import { FetchAllProductCategoryParams, fetchAllCollections, fetchAllProductCategory, fetchAllProducts } from 'app/service/product';
import { fetchAllCustomers } from 'app/service/customer';

interface FetchAllProductsParams {
	after?: string;
	before?: string;
	query?: string;
	shopName: string;
	id: string;
	callback?: (success: boolean) => void;
}

interface FetchProductVariantParams {
	shopName: string;
	id: string;
}

interface FetchAllCollectionsParams {
	after?: string;
	before?: string;
	query?: string;
	shopName: string;
	callback?: (success: boolean) => void;
}

interface FetchAllProductReturnValue {
	products: any[];
	pageInfo: {
		endCursor: string;
		hasNextPage: boolean;
		hasPreviousPage: boolean;
		startCursor: string;
	};
	totalCount: number;
}

interface FetchAllCollectionReturnValue {
	collections: any[];
	pageInfo: {
		endCursor: string;
		hasNextPage: boolean;
		hasPreviousPage: boolean;
		startCursor: string;
	};
	totalCount: number;
}

interface FetchAllCustomerReturnValue {
	customers: any[];
	pageInfo: {
		endCursor: string;
		hasNextPage: boolean;
		hasPreviousPage: boolean;
		startCursor: string;
	};
	totalCount: number;
}

interface FetchProductsVariantValue {
	variants: any[];
}

interface FetchAllProductCategoryReturnValue {
	success: boolean;
	message: string;
	categories: {
		node: {
			id: string;
			name: string;
			fullName: string;
			childrenIds: string[];
			parentId: string;
		}
	}[];
}

export const fetchAllProductsAsync = createAsyncThunk<
	FetchAllProductReturnValue,
	FetchAllProductsParams,
	{ rejectValue: string }
>(
	'createDiscount/fetchAllProducts',
	async (params, { rejectWithValue, fulfillWithValue }) => {
		try {
			const response = await fetchAllProducts(params);
			if (response.data) {
				const { products, success, pageInfo, totalCount } = response.data;
				if (success && params?.callback) {
					params.callback(success);
				}
				return fulfillWithValue({ products, pageInfo, totalCount });
			}
			return fulfillWithValue({
				products: [],
				pageInfo: {
					endCursor: '',
					hasNextPage: false,
					hasPreviousPage: false,
					startCursor: '',
				},
				totalCount: 0,
			});
		} catch (err: any) {
			const error = err as AxiosError;
			// eslint-disable-next-line no-console
			console.log(error?.response?.data, 'An error occurred');
			return rejectWithValue('An error occurred');
		}
	},
);

export const fetchAllCollectionsAsync = createAsyncThunk<
	FetchAllCollectionReturnValue,
	FetchAllCollectionsParams,
	{ rejectValue: string }
>(
	'createDiscount/fetchAllCollections',
	async (params, { rejectWithValue, fulfillWithValue }) => {
		try {
			const response = await fetchAllCollections(params);
			if (response.data) {
				const { collections, success, pageInfo, totalCount } = response.data;
				if (success && params?.callback) {
					params.callback(success);
				}
				return fulfillWithValue({ collections, pageInfo, totalCount });
			}
			return fulfillWithValue({
				collections: [],
				pageInfo: {
					endCursor: '',
					hasNextPage: false,
					hasPreviousPage: false,
					startCursor: '',
				},
				totalCount: 0,
			});
		} catch (err: any) {
			const error = err as AxiosError;
			// eslint-disable-next-line no-console
			console.log(error?.response?.data, 'An error occurred');
			return rejectWithValue('An error occurred');
		}
	},
);

export const fetchAllCustomersAsync = createAsyncThunk<
	FetchAllCustomerReturnValue,
	FetchAllCollectionsParams,
	{ rejectValue: string }
>(
	'createDiscount/fetchAllCustomers',
	async (params, { rejectWithValue, fulfillWithValue }) => {
		try {
			const response = await fetchAllCustomers(params);
			if (response.data) {
				const { customers, success, pageInfo, totalCount } = response.data;
				if (success && params?.callback) {
					params.callback(success);
				}
				return fulfillWithValue({ customers, pageInfo, totalCount });
			}
			return fulfillWithValue({
				customers: [],
				pageInfo: {
					endCursor: '',
					hasNextPage: false,
					hasPreviousPage: false,
					startCursor: '',
				},
				totalCount: 0,
			});
		} catch (err: any) {
			const error = err as AxiosError;
			// eslint-disable-next-line no-console
			console.log(error?.response?.data, 'An error occurred');
			return rejectWithValue('An error occurred');
		}
	},
);

export const fetchProductVariantsAsync = createAsyncThunk<
	FetchProductsVariantValue,
	FetchProductVariantParams,
	{ rejectValue: string }
>(
	'createDiscount/fetchProductVariants',
	async (params, { rejectWithValue, fulfillWithValue }) => {
		try {
			const response = await fetchAllProducts(params);
			if (response.data) {
				const { variants, success } = response.data;
				if (success) {
					return fulfillWithValue({ variants: variants?.variants?.edges });
				}
				return fulfillWithValue({
					variants: [],
				});
			}
			return fulfillWithValue({
				variants: [],
			});
		} catch (err: any) {
			const error = err as AxiosError;
			// eslint-disable-next-line no-console
			console.log(error?.response?.data, 'An error occurred');
			return rejectWithValue('An error occurred');
		}
	},
);

export const fetchAllProductCategoryAsync = createAsyncThunk<
	FetchAllProductCategoryReturnValue,
	FetchAllProductCategoryParams,
	{ rejectValue: string }
>(
	'createDiscount/fetchAllProductCategory',
	async (params, { rejectWithValue, fulfillWithValue }) => {
		try {
			const response = await fetchAllProductCategory(params);
			if (response.data) {
				const { categories, success, message } = response.data;
				if (success) {
					return fulfillWithValue({ categories, success, message });
				}
				return fulfillWithValue({
					categories: [],
					success: false,
					message: ''
				});
			}
			return fulfillWithValue({
				categories: [],
				success: false,
				message: ''
			});
		} catch (err: any) {
			const error = err as AxiosError;
			// eslint-disable-next-line no-console
			console.log(error?.response?.data, 'An error occurred');
			return rejectWithValue('An error occurred');
		}
	},
);