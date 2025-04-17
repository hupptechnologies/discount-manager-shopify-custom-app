import { createSlice } from '@reduxjs/toolkit';
import { fetchAllSegmentsAsync } from './index';

export interface SegmentFields {
	id: string;
	query: string;
	name: string;
	creationDate: string;
	lastEditDate: string;
	percentage: number;
};

interface customerState {
	isLoading: boolean;
	segments: SegmentFields[];
}

const initialState: customerState = {
	isLoading: false,
	segments: []
};

const customerSlice = createSlice({
	name: 'customer',
	initialState,
	reducers: {},
	extraReducers: (builder) => {
		builder.addCase(fetchAllSegmentsAsync.pending, (state) => {
			state.isLoading = true;
		});
		builder.addCase(fetchAllSegmentsAsync.fulfilled, (state, { payload }) => {
			state.isLoading = false;
			state.segments = payload.segments;
		});
		builder.addCase(fetchAllSegmentsAsync.rejected, (state) => {
			state.isLoading = false;
			state.segments = [];
		});
	},
});

/**
	* Selector to get the `customer` slice from the Redux state.
	* 
	* @param {object} state - The Redux state.
	* @returns {customerState} The `customer` slice.
*/
export const getAllCustomerDetail = (state: { customer: customerState }) => state.customer;

export default customerSlice.reducer;
