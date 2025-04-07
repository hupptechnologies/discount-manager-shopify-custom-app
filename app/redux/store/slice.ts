import { createSlice } from '@reduxjs/toolkit';
import { fetchAppEmbedStatusAsync } from './index';

interface discountState {
	isAppEmbedLoading: boolean;
	appBlock: object | null;
	appEmbedID: string;
	appEmbedStatus: boolean;
}

const initialState: discountState = {
	isAppEmbedLoading: false,
	appBlock: null,
	appEmbedID: '',
	appEmbedStatus: false
};

const storeSlice = createSlice({
	name: 'store',
	initialState,
	reducers: {},
	extraReducers: (builder) => {
		builder.addCase(fetchAppEmbedStatusAsync.pending, (state) => {
			state.isAppEmbedLoading = true;
		});
		builder.addCase(fetchAppEmbedStatusAsync.fulfilled, (state, { payload }) => {
			state.isAppEmbedLoading = false;
			state.appBlock = payload.appBlock;
			state.appEmbedID = payload.appEmbedID;
			Object.keys(payload.appBlock).forEach(key => {
				const block = payload.appBlock[key];
				const type = block.type;
				if (type.includes(payload.appEmbedID)) {
					state.appEmbedStatus = block.disabled ? false: true;
				}
			});
		});
		builder.addCase(fetchAppEmbedStatusAsync.rejected, (state) => {
			state.isAppEmbedLoading = false;
			state.appBlock = null;
			state.appEmbedID = '';
			state.appEmbedStatus = false;
		});
	},
});

export const getAllStoreDetail = (state: { store: discountState }) => state.store;

export default storeSlice.reducer;
