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
	discountMethod: string;
	isMultiple: boolean;
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

/**
	* Fetches all discount codes from the database.
	* 
	* This Redux async thunk makes an API call to retrieve a list of all discount codes 
	* stored in the application's database. It handles the request, and if successful, 
	* it returns the list of discount codes. If there is an error, it rejects the 
	* promise with an error message.
	*
	* @param {FetchAllDiscountCodesParams} params - The parameters used to filter and 
	* fetch the discount codes from the database.
	* @returns {Promise<FetchAllDiscountCodeReturnValue>} - A promise that resolves 
	* with the list of discount codes from the database.
*/
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

/**
	* Deletes a discount code from both Shopify and the application's database.
	* 
	* This Redux async thunk takes in a discount code ID, and then calls the 
	* necessary API to delete the corresponding discount code from both Shopify 
	* and the app's database. If successful, it returns a confirmation response. 
	* If an error occurs, it rejects the promise with an error message.
	*
	* @param {DeleteDiscountCodeParams} params - The parameters containing the 
	* discount code ID to be deleted.
	* @returns {Promise<ReturnValue>} - A promise that resolves with a success 
	* message or an error message if deletion fails.
*/
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

/**
	* Deletes all discount codes from both Shopify and the application's database.
	* 
	* This Redux async thunk takes no specific discount code ID but instead deletes 
	* all discount codes from both Shopify and the app's database. It sends a request 
	* to Shopify to delete all discount codes and then clears all corresponding records 
	* from the app's database. If successful, it returns a confirmation response. 
	* If an error occurs, it rejects the promise with an error message.
	*
	* @param {DeleteAllDiscountCodeParams} params - The parameters (if any) needed 
	* to delete all discount codes (this may be empty or contain other optional information).
	* @returns {Promise<ReturnValue>} - A promise that resolves with a success 
	* message or an error message if deletion fails.
*/
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

/**
	* Creates a new discount code in both the application and Shopify.
	* 
	* This Redux async thunk handles the process of creating a new discount code.
	* It receives the discount code details from the app, sends the data to Shopify
	* to create the discount, and then stores the discount code details in the app's
	* database. If successful, it returns a success response. If an error occurs, 
	* it rejects the promise with an error message.
	*
	* @param {CreateDiscountCodeParams} params - The parameters that contain 
	* the details for the new discount code (such as discount type, value, code, etc.).
	* @returns {Promise<ReturnValue>} - A promise that resolves with a success 
	* message or an error message if the creation fails.
*/
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

/**
	* Creates a "Buy X Get Y" discount code in both the application and Shopify.
	* 
	* This Redux async thunk handles the creation of a "Buy X Get Y" discount code.
	* It receives the discount details from the app, sends the data to Shopify to 
	* create the discount, and then stores the discount code details in the app's 
	* database. If successful, it returns a success response. If an error occurs, 
	* it rejects the promise with an error message.
	*
	* @param {CreateBuyXGetYDiscountCodeParams} params - The parameters that contain 
	* the details for the "Buy X Get Y" discount (such as products, quantities, and 
	* discount type).
	* @returns {Promise<ReturnValue>} - A promise that resolves with a success 
	* message or an error message if the creation fails.
*/
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

/**
	* Fetches a specific discount code's details from Shopify based on its ID.
	* 
	* This Redux async thunk retrieves details of a specific discount code from 
	* Shopify using the provided discount code ID. It sends a request to Shopify's 
	* API to fetch the discount code details, including properties like the title, 
	* start date, status, and other relevant information. If successful, it returns 
	* the discount details; otherwise, it handles any errors and rejects the promise.
	*
	* @param {GetDiscountCodeByIdParams} params - The parameters that contain 
	* the discount code ID and other necessary information for fetching the code details.
	* @returns {Promise<GetDiscountCodeByIdReturnValue>} - A promise that resolves with 
	* the discount code details or an error message if the fetch fails.
*/
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

/**
	* Updates an existing discount code in both Shopify and our database.
	* 
	* This Redux async thunk handles the process of updating a discount code in 
	* Shopify using the provided details. It also ensures that the discount code 
	* is updated in our database to keep everything synchronized. This function 
	* sends an update request to Shopify's API and updates the discount code 
	* information both remotely (in Shopify) and locally (in our app's database).
	*
	* @param {UpdateDiscountCodeParams} params - The parameters that contain 
	* the details of the discount code to be updated (e.g., discount code ID, new values).
	* @returns {Promise<ReturnValue>} - A promise that resolves with a success or 
	* failure message after attempting to update the discount code.
*/
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