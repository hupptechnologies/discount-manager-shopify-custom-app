import { AxiosInstance } from "axios";
import { backendAPI } from "./index";

interface FetchAllDiscountCodesParams {
	page?: string;
	pageSize?: string;
	status?: 'active' | 'pending';
	searchQuery?: string;
	shopName: string;
}

export const fetchAllDiscountCodes = (params: FetchAllDiscountCodesParams) => {
	const requestInstance: AxiosInstance = backendAPI();
	const { page = 1, pageSize = 10, shopName, status, searchQuery = '' } = params;

	let url = `discount?shop=${shopName}`;
	if (page) {
		url += `&page=${page}`;
	}
	if (pageSize) {
		url += `&pageSize=${pageSize}`;
	}
	if (searchQuery) {
		url += `&searchQuery=${searchQuery}`
	}
	if (status) {
		url += `&status=${status}`
	}

	return requestInstance.get(url);
};