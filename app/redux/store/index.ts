import { AxiosError } from "axios";
import { createAsyncThunk } from "@reduxjs/toolkit";
import { FetchAppEmbedStatusParams, fetchAppEmbedStatus } from "app/service/store";

interface FetchAppEmbedStatusReturnValue {
	success: boolean;
	appBlock: any;
	appEmbedID: string;
};

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