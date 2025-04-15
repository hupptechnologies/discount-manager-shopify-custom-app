import { AxiosError } from "axios";
import { createAsyncThunk } from "@reduxjs/toolkit";
import { FetchAppEmbedStatusParams, fetchAppEmbedStatus } from "app/service/store";

interface FetchAppEmbedStatusReturnValue {
	success: boolean;
	appBlock: any;
	appEmbedID: string;
};

/**
	* Redux async thunk to fetch the App Embed Block status from the server.
	*
	* This thunk calls an API to retrieve whether the theme app embed block 
	* is enabled or not for the current Shopify store.
	*
	* @param {FetchAppEmbedStatusParams} params - Parameters containing the shop or necessary identifiers.
	* @returns {Promise<FetchAppEmbedStatusReturnValue>} - Returns a promise with the app embed block status (true/false).
*/
export const fetchAppEmbedStatusAsync = createAsyncThunk<
	FetchAppEmbedStatusReturnValue,
	FetchAppEmbedStatusParams
>(
	'store/fetchAppEmbedStatus',
	async (params, { rejectWithValue, fulfillWithValue }) => {
		try {
			const response = await fetchAppEmbedStatus(params);
			if (response.data) {
				const { appBlock, appEmbedID, success } = response.data;
				if (success && params?.callback) {
					params.callback();
				}
				return fulfillWithValue({ appBlock, appEmbedID, success });
			}
			return fulfillWithValue({
				appBlock: null,
				appEmbedID: '',
				success: false
			});
		} catch (err: any) {
			const error = err as AxiosError;
			// eslint-disable-next-line no-console
			console.log(error?.response?.data, 'An error occurred');
			return rejectWithValue('An error occurred');
		}
	},
);