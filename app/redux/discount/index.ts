import { AxiosError } from "axios";
import { createAsyncThunk } from "@reduxjs/toolkit";
import { createBuyXGetYDiscountCode, createDiscountCode, deleteDiscountCode, fetchAllDiscountCodes } from "app/service/discount";

interface DiscountCode {
	id: number;
	discountId: string;
	code: string;
	discountAmount: number;
	usageLimit: number;
	isActive: boolean;
	startDate: string;
	endDate: string;
	createdAt: string;
}

interface FetchAllDiscountCodeReturnValue {
	discountCodes: DiscountCode[];
	pagination: {
		totalCount: number;
		totalPages: number;
		currentPage: number;
	};
	discountStats: {
		activeDiscount: { count: number; data: number[]; },
		usedDiscount: { count: number; data: number[]; },
		expiredDiscount: { count: number; data:number[]; },
	};
}

interface fetchAllDiscountCodesParams {
	page?: string;
	pageSize?: string;
	searchQuery?: string;
	status?: 'active' | 'pending' | null;
	orderByCode?: 'asc' | 'desc' | null;
	usedCountGreaterThan?: number | null;
	shopName: string;
	callback?: (success: boolean) => void;
}

interface ReturnValue {
	success: boolean;
	message: string;
}

interface DeleteDiscountCodeParams {
	data: {
		id: number | null;
		code: string;
		discountId: string;
	}
	shopName: string;
	callback?: (success: boolean) => void;
}

interface CreateDiscountCodeParams {
	data: {
		title: string;
		percentage: number;
		code: string;
		startsAt: string;
		endsAt: string;
		usageLimit: number;
		appliesOncePerCustomer: boolean;
		productIDs: string[];
		collectionIDs: string[];
	}
	shopName: string;
	callback?: (success: boolean) => void;
}

interface CreateBuyXGetYDiscountCodeParams {
	data: {
		title: string;
		percentage: number;
		code: string;
		startsAt: string;
		endsAt: string;
		usesPerOrderLimit: number;
		customerBuys: {
			quantity: string;
			collectionIDs: string[];
		};
		customerGets: {
			quantity: string;
			collectionIDs: string[];
		};
	},
	shopName: string;
	callback?: (success: boolean) => void;
}

export const fetchAllDiscountCodesAsync = createAsyncThunk<
	FetchAllDiscountCodeReturnValue,
	fetchAllDiscountCodesParams
>(
	'discount/fetchAllDiscountCodes',
	async (params, { rejectWithValue, fulfillWithValue }) => {
		try {
			const response = await fetchAllDiscountCodes(params);
			if (response.data) {
				const { discountCodes, pagination, success, discountStats } = response.data;
				if (success && params?.callback) {
					params.callback(success);
				}
				return fulfillWithValue({ discountCodes, pagination, discountStats });
			}
			return fulfillWithValue({
				discountCodes: [],
				pagination: {
					totalCount: 0,
					totalPages: 0,
					currentPage: 0
				},
				discountStats: null
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
	"discount/deleteDiscountCode",
	async (params, { rejectWithValue, fulfillWithValue }) => {
		try {
			const response = await deleteDiscountCode(params);
			if (response.data) {
				const { success, message } = response.data;
				if (message) {
					shopify.toast.show(message);
				}
				if (success && params.callback) {
					params.callback(success);
				}
				return fulfillWithValue({ success, message });
			}
			return fulfillWithValue({ success: false, message: '' });
		}	catch (err: any) {
			const error = err as AxiosError;
			// eslint-disable-next-line no-console
			console.log(error?.response?.data, 'An error occurred');
			return rejectWithValue('An error occurred');
		}
	}
);

export const createDiscountCodeAsync = createAsyncThunk<
	ReturnValue,
	CreateDiscountCodeParams
>(
	"discount/createDiscountCode",
	async (params, { rejectWithValue, fulfillWithValue }) => {
		try {
			const response = await createDiscountCode(params);
			if (response.data) {
				const { success, message } = response.data;
				if (message) {
					shopify.toast.show(message);
				}
				if (success && params.callback) {
					params.callback(success);
				}
				return fulfillWithValue({ success, message });
			}
			return fulfillWithValue({ success: false, message: '' });
		}	catch (err: any) {
			const error = err as AxiosError;
			// eslint-disable-next-line no-console
			console.log(error?.response?.data, 'An error occurred');
			return rejectWithValue('An error occurred');
		}
	}
);

export const createBuyXGetYDiscountCodeAsync = createAsyncThunk<
	ReturnValue,
	CreateBuyXGetYDiscountCodeParams
>(
	"discount/createBuyXGetYDiscountCode",
	async (params, { rejectWithValue, fulfillWithValue }) => {
		try {
			const response = await createBuyXGetYDiscountCode(params);
			if (response.data) {
				const { success, message } = response.data;
				if (message) {
					shopify.toast.show(message);
				}
				if (success && params.callback) {
					params.callback(success);
				}
				return fulfillWithValue({ success, message });
			}
			return fulfillWithValue({ success: false, message: '' });
		}	catch (err: any) {
			const error = err as AxiosError;
			// eslint-disable-next-line no-console
			console.log(error?.response?.data, 'An error occurred');
			return rejectWithValue('An error occurred');
		}
	}
);