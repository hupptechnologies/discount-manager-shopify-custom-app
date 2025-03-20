import { AxiosError } from "axios";
import { createAsyncThunk } from "@reduxjs/toolkit";
import { fetchAllDiscountCodes } from "app/service/discount";

interface DiscountCode {
	id: number;
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
		activeDiscount: { count: number; percentage: string; data: number[]; },
		usedDiscount: { count: number; percentage: string; data: number[]; },
		expiredDiscount: { count: number; percentage: string; data:number[]; },
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