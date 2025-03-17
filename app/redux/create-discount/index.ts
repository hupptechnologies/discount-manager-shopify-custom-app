import { createAsyncThunk } from '@reduxjs/toolkit';
import type { AxiosError } from 'axios';
import { fetchAllProducts } from 'app/service/product';

interface FetchAllProductsParams {
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
