import { createSlice } from '@reduxjs/toolkit';
import { fetchAllSegmentsAsync, getCustomerBySegmentIdAsync } from './index';
import { PageInfo } from 'app/controller/segments/fetchAllSegments';

export interface CustomerInput {
	id: string;
	displayName: string;
	defaultEmailAddress: {
		marketingState: string;
	};
	defaultAddress: {
		city: string;
		province: string;
		country: string;
	};
	amountSpent: {
		amount: string;
		currencyCode: string;
	}
	numberOfOrders: string;
}

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
	segmentCustomers: CustomerInput[];
	isSegmentCustomerLoading: boolean;
	pageInfo: PageInfo | null;
}

const initialState: customerState = {
	isLoading: false,
	segments: [],
	segmentCustomers: [],
	isSegmentCustomerLoading: false,
	pageInfo: null
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
			state.pageInfo = payload.pageInfo;
		});
		builder.addCase(fetchAllSegmentsAsync.rejected, (state) => {
			state.isLoading = false;
			state.segments = [];
			state.pageInfo = null;
		});
		builder.addCase(getCustomerBySegmentIdAsync.pending, (state) => {
			state.isSegmentCustomerLoading = true;
		});
		builder.addCase(getCustomerBySegmentIdAsync.fulfilled, (state, { payload }) => {
			state.isSegmentCustomerLoading = false;
			state.segmentCustomers = payload.segmentCustomers;
			state.pageInfo = payload.pageInfo;
		});
		builder.addCase(getCustomerBySegmentIdAsync.rejected, (state) => {
			state.isSegmentCustomerLoading = false;
			state.segmentCustomers = [];
			state.pageInfo = null;
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
