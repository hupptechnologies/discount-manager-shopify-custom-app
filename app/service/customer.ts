import { backendAPI } from './index';
import type { AxiosInstance } from 'axios';

interface FetchAllCustomersParams {
	after?: string;
	before?: string;
	query?: string;
	shopName: string;
}

/**
	* This service fetches all customer data from Shopify based on the provided filters 
	* such as search query and pagination options (before and after).
	* 
	* Used when retrieving customer information from the Shopify store for further processing 
	* or displaying in the app.
	* 
	* @param {FetchAllCustomersParams} params - The parameters containing the shop name and optional filters like search query, 
	* pagination (`after`, `before`), and the shop domain.
	* @returns {Promise<AxiosResponse>} - The response containing the list of customers based on the applied filters.
*/
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
