import axios, { type AxiosInstance } from 'axios';

interface ShopifyAPIInstanceProps {
	shop: string;
	accessToken: string;
}

/**
	* Creates an Axios instance configured to interact with the Shopify API.
	* 
	* This function sets up the base URL and authorization headers for making requests 
	* to the Shopify Admin API. It returns an Axios instance that can be used for both 
	* REST and GraphQL API calls to the specified Shopify store.
	*
	* @param {ShopifyAPIInstanceProps} shop - The Shopify store domain (e.g., 'my-store.myshopify.com').
	* @param {string} accessToken - The access token required for authenticating API requests.
	* 
	* @returns {AxiosInstance} - An Axios instance configured with the base URL and authentication headers.
*/
export const ShopifyAPIInstance = ({
	shop,
	accessToken,
}: ShopifyAPIInstanceProps): AxiosInstance =>
	axios.create({
		baseURL: `https://${shop}/admin/api/2025-01/`,
		headers: {
			'X-Shopify-Access-Token': accessToken,
		},
	});

/**
	* Creates an Axios instance configured for the backend API.
	* 
	* This function sets up the base URL for all HTTP requests made using Axios, pointing to 
	* the '/api/' endpoint. The returned Axios instance can be used to make various HTTP 
	* requests to the backend API, ensuring a consistent base URL for all API calls.
	*
	* @returns {AxiosInstance} - An Axios instance configured with the base URL '/api/'.
*/
export const backendAPI = (): AxiosInstance => {
	return axios.create({
		baseURL: '/api/',
	});
};
