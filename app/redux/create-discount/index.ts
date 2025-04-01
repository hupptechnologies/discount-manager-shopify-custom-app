import { createAsyncThunk } from '@reduxjs/toolkit';
import type { AxiosError } from 'axios';
import { fetchAllCollections, fetchAllProducts } from 'app/service/product';

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

interface FetchProductsVariantValue {
	variants: any[];
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
					variants: []
				});
			}
			return fulfillWithValue({
				variants: []
			});
		} catch (err: any) {
			const error = err as AxiosError;
			// eslint-disable-next-line no-console
			console.log(error?.response?.data, 'An error occurred');
			return rejectWithValue('An error occurred');
		}
	},
);