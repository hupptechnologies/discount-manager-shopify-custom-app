import { AxiosError } from 'axios';
import { createAsyncThunk } from '@reduxjs/toolkit';
import { fetchAllSegments } from '../../service/customer';
import type { FetchAllSegmentsParams } from '../../service/customer'
import { SegmentFields } from './slice';

interface FetchAllSegmentReturnValue {
	segments: SegmentFields[];
	success: boolean;
	message: string;
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
				const { segments, success, message } = response.data;
				if (success && params?.callback) {
					params.callback(success);
				}
				return fulfillWithValue({ segments, message, success });
			}
			return fulfillWithValue({
				segments: [],
				message: '',
				success: false,
			});
		} catch (err: any) {
			const error = err as AxiosError;
			// eslint-disable-next-line no-console
			console.log(error?.response?.data, 'An error occurred');
			return rejectWithValue('An error occurred');
		}
	},
);