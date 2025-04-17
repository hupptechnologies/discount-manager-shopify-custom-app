import { AxiosError } from 'axios';
import { createAsyncThunk } from '@reduxjs/toolkit';
import { fetchAllSegments, getCustomerBySegmentId } from '../../service/customer';
import type { FetchAllSegmentsParams, FetchSegmentCustomersParams } from '../../service/customer'
import { SegmentFields } from './slice';

interface PageInfo {
	endCursor: string;
	hasNextPage: string;
	hasPreviousPage: string;
	startCursor: string;
};

interface FetchAllSegmentReturnValue {
	segments: SegmentFields[];
	success: boolean;
	message: string;
	pageInfo: PageInfo | null;
}

interface FetchSegmentCustomersReturnValue {
	segmentCustomers: any;
	success: boolean;
	message: string;
	pageInfo: PageInfo | null;
}

/**
	* Async thunk to fetch all customer segments for a Shopify store.
	*
	* This thunk calls the `fetchAllSegments` API function, handles success and failure cases,
	* and integrates with Redux Toolkit's async flow using `createAsyncThunk`.
	*
	* @param params - Contains the shop name and an optional callback to run on success.
	* @returns A fulfilled or rejected action depending on the API call result.
*/
export const fetchAllSegmentsAsync = createAsyncThunk<
	FetchAllSegmentReturnValue,
	FetchAllSegmentsParams,
	{ rejectValue: string }
>(
	'createDiscount/fetchAllSegments',
	async (params, { rejectWithValue, fulfillWithValue }) => {
		try {
			const response = await fetchAllSegments(params);
			if (response.data) {
				const { segments, success, message, pageInfo } = response.data;
				if (success && params?.callback) {
					params.callback(success);
				}
				return fulfillWithValue({ segments, message, success, pageInfo });
			}
			return fulfillWithValue({
				segments: [],
				message: '',
				success: false,
				pageInfo: null
			});
		} catch (err: any) {
			const error = err as AxiosError;
			// eslint-disable-next-line no-console
			console.log(error?.response?.data, 'An error occurred');
			return rejectWithValue('An error occurred');
		}
	},
);

/**
	* Async thunk to fetch customers by segment ID from the backend API.
	*
	* This function is used in Redux Toolkit to handle the async operation
	* of retrieving segment customers. It manages loading, success, and error states.
	*
	* - Sends a GET request using the `getCustomerBySegmentId` service.
	* - On success, it returns the customer data using `fulfillWithValue`.
	* - If a callback is provided in the params, it is called with the success status.
	* - On failure, it logs the error and returns a rejected value.
	*
	* @param params - Object containing shop name, segment ID, and optional callback.
	* @returns Redux action result containing segment customers or an error message.
*/
export const getCustomerBySegmentIdAsync = createAsyncThunk<
	FetchSegmentCustomersReturnValue,
	FetchSegmentCustomersParams,
	{ rejectValue: string }
>(
	'createDiscount/getCustomerBySegmentId',
	async (params, { rejectWithValue, fulfillWithValue }) => {
		try {
			const response = await getCustomerBySegmentId(params);
			if (response.data) {
				const { segmentCustomers, success, message, pageInfo } = response.data;
				if (success && params?.callback) {
					params.callback(success);
				}
				return fulfillWithValue({ segmentCustomers, message, success, pageInfo });
			}
			return fulfillWithValue({
				segmentCustomers: [],
				message: '',
				success: false,
				pageInfo: null
			});
		} catch (err: any) {
			const error = err as AxiosError;
			// eslint-disable-next-line no-console
			console.log(error?.response?.data, 'An error occurred');
			return rejectWithValue('An error occurred');
		}
	},
);