import { createAsyncThunk } from '@reduxjs/toolkit';
import type { AxiosError } from 'axios';
import { fetchAllCollections, fetchAllProducts } from 'app/service/product';

interface FetchAllProductsParams {
	after?: string;
	before?: string;
	query?: string;
	shopName: string;
	callback?: (success: boolean) => void;
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
			console.log(error?.response?.data, 'An error occurred');
			return rejectWithValue('An error occurred');
		}
	},
);
