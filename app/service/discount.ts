import type { AxiosInstance } from 'axios';
import { backendAPI } from './index';

export interface FetchAllDiscountCodesParams {
	page?: string;
	pageSize?: string;
	searchQuery?: string;
	status?: 'active' | 'pending' | null;
	orderByCode?: 'asc' | 'desc' | null;
	usedCountGreaterThan?: number | null;
	shopName: string;
	callback?: (success: boolean) => void;
}

export interface DeleteDiscountCodeParams {
	data: {
		id: number | null;
		code: string;
		discountId: string;
	};
	shopName: string;
	callback?: (success: boolean) => void;
}

export interface CreateDiscountCodeParams {
	data: {
		title: string;
		percentage: number;
		code: string;
		startsAt: string | null;
		endsAt: string | null;
		usageLimit: number;
		appliesOncePerCustomer: boolean;
		productIDs: string[];
		collectionIDs: string[];
		advancedRule: object | null;
	};
	shopName: string;
	type: string | null;
	callback?: (success: boolean) => void;
}

export interface CreateBuyXGetYDiscountCodeParams {
	data: {
		title: string;
		percentage: number;
		code: string;
		startsAt: string | null;
		endsAt: string | null;
		usageLimit: number;
		customerBuys: {
			quantity: string;
			collectionIDs: string[];
		};
		customerGets: {
			quantity: string;
			collectionIDs: string[];
		};
		advancedRule: object | null;
	};
	shopName: string;
	type: string | null;
	callback?: (success: boolean) => void;
}

export interface GetDiscountCodeByIdParams {
	shopName: string;
	id: number;
	discountType: string;
	callback?: (success: boolean) => void;
}

export interface AdvancedRuleObject {
	quantity: string;
	advanceDiscountType: 'stackable' | 'exclusive';
	region: string;
	condition: string;
	customerType: 'all' | 'vip' | 'first-time';
	productCategory: string;
	isAI: boolean;
	isStockBased: boolean;
}

export interface UpdateDiscountCodeParams {
	data: {
		title: string;
		percentage: number;
		code: string;
		startsAt: string | null;
		endsAt: string | null;
		usageLimit: number;
		appliesOncePerCustomer: boolean;
		productIDs: string[];
		collectionIDs: string[];
		advancedRule: AdvancedRuleObject | null;
	};
	shopName: string;
	id: number | null;
	type: string | null;
	callback?: (success: boolean) => void;
}

export interface UpdateBuyXGetYDiscountCodeParams {
	data: {
		title: string;
		percentage: number;
		code: string;
		startsAt: string | null;
		endsAt: string | null;
		usageLimit: number;
		customerBuys: {
			quantity: string;
			collectionIDs: string[];
		};
		customerGets: {
			quantity: string;
			collectionIDs: string[];
		};
		advancedRule: object | null;
	};
	shopName: string;
	id: number | null;
	type: string | null;
	callback?: (success: boolean) => void;
}

export const fetchAllDiscountCodes = (params: FetchAllDiscountCodesParams) => {
	const requestInstance: AxiosInstance = backendAPI();
	const {
		page = 1,
		pageSize = 10,
		shopName,
		status,
		searchQuery = '',
		usedCountGreaterThan,
		orderByCode,
	} = params;

	let url = `discount?shop=${shopName}`;
	if (page) {
		url += `&page=${page}`;
	}
	if (pageSize) {
		url += `&pageSize=${pageSize}`;
	}
	if (searchQuery) {
		url += `&searchQuery=${searchQuery}`;
	}
	if (status) {
		url += `&status=${status}`;
	}
	if (usedCountGreaterThan) {
		url += '&usedCountGreaterThan=1';
	}
	if (orderByCode) {
		url += `&orderByCode=${orderByCode}`;
	}

	return requestInstance.get(url);
};

export const deleteDiscountCode = (params: DeleteDiscountCodeParams) => {
	const requestInstance: AxiosInstance = backendAPI();
	const { shopName, data } = params;
	return requestInstance.delete(`discount?shop=${shopName}`, { data });
};

export const createDiscountCode = (params: CreateDiscountCodeParams) => {
	const requestInstance: AxiosInstance = backendAPI();
	const { shopName, data, type = 'product' } = params;
	return requestInstance.post(`discount?shop=${shopName}&type=${type}`, data);
};

export const createBuyXGetYDiscountCode = (
	params: CreateBuyXGetYDiscountCodeParams,
) => {
	const requestInstance: AxiosInstance = backendAPI();
	const { shopName, data, type = 'buyXgetY' } = params;
	return requestInstance.post(`discount?shop=${shopName}&type=${type}`, data);
};

export const getDiscountCodeById = (params: GetDiscountCodeByIdParams) => {
	const requestInstance: AxiosInstance = backendAPI();
	const { shopName, id, discountType } = params;
	return requestInstance.get(
		`discount?shop=${shopName}&id=${id}&discountType=${discountType}`,
	);
};

export const updateDiscountCode = (
	params: UpdateDiscountCodeParams,
) => {
	const requestInstance: AxiosInstance = backendAPI();
	const { shopName, id, type = 'products', data } = params;
	return requestInstance.put(`discount?shop=${shopName}&id=${id}&type=${type}`, data);
};

export const updateBuyXGetYDiscountCode = (
	params: UpdateBuyXGetYDiscountCodeParams,
) => {
	const requestInstance: AxiosInstance = backendAPI();
	const { shopName, id, type = 'buyXgetY', data } = params;
	return requestInstance.put(`discount?shop=${shopName}&id=${id}&type=${type}`, data);
};