import type { AxiosError } from 'axios';
import { createAsyncThunk } from '@reduxjs/toolkit';
import type {
	AdvancedRuleObject,
	CreateBuyXGetYDiscountCodeParams,
	CreateDiscountCodeParams,
	DeleteAllDiscountCodeParams,
	DeleteDiscountCodeParams,
	DeleteRedeemDiscountCodeParams,
	FetchAllDiscountCodesParams,
	GetDiscountCodeByIdParams,
	UpdateBuyXGetYDiscountCodeParams,
	UpdateDiscountCodeParams,
} from 'app/service/discount';
import {
	createBuyXGetYDiscountCode,
	createDiscountCode,
	deleteAllDiscountCode,
	deleteBulkRedeemDiscountCode,
	deleteDiscountCode,
	fetchAllDiscountCodes,
	getDiscountCodeById,
	updateBuyXGetYDiscountCode,
	updateDiscountCode,
} from 'app/service/discount';
import type { GetDiscountCodeList } from './slice';

export interface DiscountCode {
	id: number;
	discountId: string;
	code: string;
	discountAmount: number;
	asyncUsageCount: number;
	usageLimit: number;
	isActive: boolean;
	startDate: string;
	endDate: string;
	createdAt: string;
	discountScope: string;
}

interface FetchAllDiscountCodeReturnValue {
	discountCodes: DiscountCode[];
	pagination: {
		totalCount: number;
		totalPages: number;
		currentPage: number;
	};
	discountStats: {
		activeDiscount: { count: number; data: number[] };
		usedDiscount: { count: number; data: number[] };
		expiredDiscount: { count: number; data: number[] };
	};
}

interface ReturnValue {
	success: boolean;
	message: string;
}

interface GetDiscountCodeByIdReturnValue {
	success: boolean;
	message: string;
	discountCode: GetDiscountCodeList[];
	discountScope: string;
	advancedRule: AdvancedRuleObject | null;
	isMultiple: boolean;
	method: string;
}

export const fetchAllDiscountCodesAsync = createAsyncThunk<
	FetchAllDiscountCodeReturnValue,
	FetchAllDiscountCodesParams
>(
	'discount/fetchAllDiscountCodes',
	async (params, { rejectWithValue, fulfillWithValue }) => {
		try {
			const response = await fetchAllDiscountCodes(params);
			if (response.data) {
				const { discountCodes, pagination, success, discountStats } =
					response.data;
				if (success && params?.callback) {
					params.callback();
				}
				return fulfillWithValue({ discountCodes, pagination, discountStats });
			}
			return fulfillWithValue({
				discountCodes: [],
				pagination: {
					totalCount: 0,
					totalPages: 0,
					currentPage: 0,
				},
				discountStats: null,
			});
		} catch (err: any) {
			const error = err as AxiosError;
			// eslint-disable-next-line no-console
			console.log(error?.response?.data, 'An error occurred');
			return rejectWithValue('An error occurred');
		}
	},
);

export const deleteDiscountCodeAsync = createAsyncThunk<
	ReturnValue,
	DeleteDiscountCodeParams
>(
	'discount/deleteDiscountCode',
	async (params, { rejectWithValue, fulfillWithValue }) => {
		try {
			const response = await deleteDiscountCode(params);
			if (response.data) {
				const { success, message } = response.data;
				if (message) {
					shopify.toast.show(message);
				}
				if (success && params.callback) {
					params.callback();
				}
				return fulfillWithValue({ success, message });
			}
			return fulfillWithValue({ success: false, message: '' });
		} catch (err: any) {
			const error = err as AxiosError;
			// eslint-disable-next-line no-console
			console.log(error?.response?.data, 'An error occurred');
			return rejectWithValue('An error occurred');
		}
	},
);

export const deleteAllDiscountCodeAsync = createAsyncThunk<
	ReturnValue,
	DeleteAllDiscountCodeParams
>(
	'discount/deleteAllDiscountCode',
	async (params, { rejectWithValue, fulfillWithValue }) => {
		try {
			const response = await deleteAllDiscountCode(params);
			if (response.data) {
				const { success, message } = response.data;
				if (message) {
					shopify.toast.show(message);
				}
				if (success && params.callback) {
					params.callback();
				}
				return fulfillWithValue({ success, message });
			}
			return fulfillWithValue({ success: false, message: '' });
		} catch (err: any) {
			const error = err as AxiosError;
			// eslint-disable-next-line no-console
			console.log(error, 'An error occurred');
			return rejectWithValue('An error occurred');
		}
	},
);

export const createDiscountCodeAsync = createAsyncThunk<
	ReturnValue,
	CreateDiscountCodeParams
>(
	'discount/createDiscountCode',
	async (params, { rejectWithValue, fulfillWithValue }) => {
		try {
			const response = await createDiscountCode(params);
			if (response.data) {
				const { success, message } = response.data;
				if (message) {
					shopify.toast.show(message);
				}
				if (success && params.callback) {
					params.callback();
				}
				return fulfillWithValue({ success, message });
			}
			return fulfillWithValue({ success: false, message: '' });
		} catch (err: any) {
			const error = err as AxiosError;
			// eslint-disable-next-line no-console
			console.log(error?.response?.data, 'An error occurred');
			return rejectWithValue('An error occurred');
		}
	},
);

export const createBuyXGetYDiscountCodeAsync = createAsyncThunk<
	ReturnValue,
	CreateBuyXGetYDiscountCodeParams
>(
	'discount/createBuyXGetYDiscountCode',
	async (params, { rejectWithValue, fulfillWithValue }) => {
		try {
			const response = await createBuyXGetYDiscountCode(params);
			if (response.data) {
				const { success, message } = response.data;
				if (message) {
					shopify.toast.show(message);
				}
				if (success && params.callback) {
					params.callback();
				}
				return fulfillWithValue({ success, message });
			}
			return fulfillWithValue({ success: false, message: '' });
		} catch (err: any) {
			const error = err as AxiosError;
			// eslint-disable-next-line no-console
			console.log(error?.response?.data, 'An error occurred');
			return rejectWithValue('An error occurred');
		}
	},
);

export const getDiscountCodeByIdAsync = createAsyncThunk<
	GetDiscountCodeByIdReturnValue,
	GetDiscountCodeByIdParams
>(
	'discount/getDiscountCodeById',
	async (params, { rejectWithValue, fulfillWithValue }) => {
		try {
			const response = await getDiscountCodeById(params);
			if (response.data) {
				const {
					success,
					discountCode,
					message,
					discountScope,
					advancedRule,
					method,
					isMultiple
				} = response.data;
				if (success && params.callback) {
					params.callback();
				}
				return fulfillWithValue({
					success,
					discountCode,
					message,
					discountScope,
					advancedRule,
					method,
					isMultiple
				});
			}
			return fulfillWithValue({
				success: false,
				discountCode: null,
				message: '',
				discountScope: '',
				advancedRule: null,
				method: '',
				isMultiple: false
			});
		} catch (err: any) {
			const error = err as AxiosError;
			// eslint-disable-next-line no-console
			console.log(error?.response?.data, 'An error occurred');
			return rejectWithValue('An error occurred');
		}
	},
);

export const updateDiscountCodeAsync = createAsyncThunk<
	ReturnValue,
	UpdateDiscountCodeParams
>(
	'discount/updateDiscountCode',
	async (params, { rejectWithValue, fulfillWithValue }) => {
		try {
			const response = await updateDiscountCode(params);
			if (response.data) {
				const { success, message } = response.data;
				if (message) {
					shopify.toast.show(message);
				}
				if (success && params.callback) {
					params.callback();
				}
				return fulfillWithValue({ success, message });
			}
			return fulfillWithValue({ success: false, message: '' });
		} catch (err: any) {
			const error = err as AxiosError;
			// eslint-disable-next-line no-console
			console.log(error?.response?.data, 'An error occurred');
			return rejectWithValue('An error occurred');
		}
	},
);

export const updateBuyXGetYDiscountCodeAsync = createAsyncThunk<
	ReturnValue,
	UpdateBuyXGetYDiscountCodeParams
>(
	'discount/updateBuyXGetYDiscountCode',
	async (params, { rejectWithValue, fulfillWithValue }) => {
		try {
			const response = await updateBuyXGetYDiscountCode(params);
			if (response.data) {
				const { success, message } = response.data;
				if (message) {
					shopify.toast.show(message);
				}
				if (success && params.callback) {
					params.callback();
				}
				return fulfillWithValue({ success, message });
			}
			return fulfillWithValue({ success: false, message: '' });
		} catch (err: any) {
			const error = err as AxiosError;
			// eslint-disable-next-line no-console
			console.log(error?.response?.data, 'An error occurred');
			return rejectWithValue('An error occurred');
		}
	},
);

export const deleteBulkRedeemDiscountCodeAsync = createAsyncThunk<
	ReturnValue,
	DeleteRedeemDiscountCodeParams
>(
	'discount/deleteBulkRedeemDiscountCode',
	async (params, { rejectWithValue, fulfillWithValue }) => {
		try {
			const response = await deleteBulkRedeemDiscountCode(params);
			if (response.data) {
				const { success, message } = response.data;
				if (message) {
					shopify.toast.show(message);
				}
				if (success && params.callback) {
					params.callback();
				}
				return fulfillWithValue({ success, message });
			}
			return fulfillWithValue({ success: false, message: '' });
		} catch (err: any) {
			const error = err as AxiosError;
			// eslint-disable-next-line no-console
			console.log(error?.response?.data, 'An error occurred');
			return rejectWithValue('An error occurred');
		}
	},
);