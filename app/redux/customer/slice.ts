import { createSlice } from '@reduxjs/toolkit';
import { fetchAllSegmentsAsync, getCustomerBySegmentIdAsync } from './index';
import type { PageInfo } from 'app/controller/segments/fetchAllSegments';

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
	customerPageInfo: PageInfo | null;
	totalSegmentCount: number;
	totalCustomerCount: number;
	segmentName: string;
}

const initialState: customerState = {
	isLoading: false,
	segments: [],
	segmentCustomers: [],
	isSegmentCustomerLoading: false,
	pageInfo: null,
	customerPageInfo: null,
	totalSegmentCount: 0,
	totalCustomerCount: 0,
	segmentName: ''
};

const customerSlice = createSlice({
	name: 'customer',
	initialState,
	reducers: {
		handleSetSegmentName: (state, { payload }) => {
			state.segmentName = payload?.name;
		}
	},
	extraReducers: (builder) => {
		builder.addCase(fetchAllSegmentsAsync.pending, (state) => {
			state.isLoading = true;
		});
		builder.addCase(fetchAllSegmentsAsync.fulfilled, (state, { payload }) => {
			state.isLoading = false;
			state.segments = payload.segments;
			state.pageInfo = payload.pageInfo;
			state.totalSegmentCount = payload.totalCount;
		});
		builder.addCase(fetchAllSegmentsAsync.rejected, (state) => {
			state.isLoading = false;
			state.segments = [];
			state.pageInfo = null;
			state.totalSegmentCount = 0;
		});
		builder.addCase(getCustomerBySegmentIdAsync.pending, (state) => {
			state.isSegmentCustomerLoading = true;
		});
		builder.addCase(getCustomerBySegmentIdAsync.fulfilled, (state, { payload }) => {
			state.isSegmentCustomerLoading = false;
			state.segmentCustomers = payload.segmentCustomers;
			state.customerPageInfo = payload.pageInfo;
			state.totalCustomerCount = payload.totalCount;
		});
		builder.addCase(getCustomerBySegmentIdAsync.rejected, (state) => {
			state.isSegmentCustomerLoading = false;
			state.segmentCustomers = [];
			state.customerPageInfo = null;
			state.totalCustomerCount = 0;
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

export const { handleSetSegmentName } = customerSlice.actions;
export default customerSlice.reducer;
