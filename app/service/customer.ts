import { backendAPI } from './index';
import type { AxiosInstance } from 'axios';

interface FetchAllCustomersParams {
	after?: string;
	before?: string;
	query?: string;
	shopName: string;
}

export interface FetchAllSegmentsParams {
	shopName: string;
	callback?: (success: boolean) => void;
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

/**
	* Fetches all customer segments for a given Shopify store.
	*
	* This service sends a GET request to the backend API to retrieve 
	* all available segments associated with the specified shop.
	*
	* @param params - An object containing the shopName (Shopify store identifier).
	* @returns A promise resolving to the response containing segment data.
*/
export const fetchAllSegments = (params: FetchAllSegmentsParams) => {
	const requestInstance: AxiosInstance = backendAPI();
	const { shopName } = params;
	return requestInstance.get(`segments?shop=${shopName}`);
};