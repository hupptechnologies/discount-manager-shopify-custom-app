import { AxiosInstance } from "axios";
import { backendAPI } from "./index";

interface FetchAllDiscountCodesParams {
	page?: string;
	pageSize?: string;
	status?: 'active' | 'pending' | null;
	searchQuery?: string;
	usedCountGreaterThan?: number | null;
	orderByCode?: 'asc' | 'desc' | null;
	shopName: string;
}

interface DeleteDiscountCodeParams {
	data: {
		id: number | null;
		code: string;
		discountId: string;
	};
	shopName: string;
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
	},
	shopName: string;
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
}

export const fetchAllDiscountCodes = (params: FetchAllDiscountCodesParams) => {
	const requestInstance: AxiosInstance = backendAPI();
	const { page = 1, pageSize = 10, shopName, status, searchQuery = '', usedCountGreaterThan, orderByCode } = params;

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
		url += `&usedCountGreaterThan=1`;
	}
	if (orderByCode) {
		url += `&orderByCode=${orderByCode}`
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
	const { shopName, data } = params;
	return requestInstance.post(`discount?shop=${shopName}`, data);
};

export const createBuyXGetYDiscountCode = (params: CreateBuyXGetYDiscountCodeParams) => {
	const requestInstance: AxiosInstance = backendAPI();
	const { shopName, data } = params;
	return requestInstance.post(`discount?shop=${shopName}&type=buyxgety`, data);
};