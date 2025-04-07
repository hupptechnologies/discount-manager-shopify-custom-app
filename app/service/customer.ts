import { backendAPI } from './index';
import type { AxiosInstance } from 'axios';

interface FetchAllCustomersParams {
	after?: string;
	before?: string;
	query?: string;
	shopName: string;
}
export const fetchAllCustomers = (params: FetchAllCustomersParams) => {
	const requestInstance: AxiosInstance = backendAPI();
	const { after, before, query, shopName } = params;

	let url = `customers?shop=${shopName}`;
	if (query) {
		url += `&query=${query}`;
	}
	if (after) {
		url += `&after=${after}`;
	}
	if (before) {
		url += `&before=${before}`;
	}

	return requestInstance.get(url);
};
