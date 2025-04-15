import { ShopifyAPIInstance, backendAPI } from './index';
import type { AxiosInstance } from 'axios';

interface GraphQLData {
	query: string;
	variables?: Record<string, any>;
}

interface FetchAllProductsParams {
	after?: string;
	before?: string;
	query?: string;
	shopName: string;
	id: string;
}

interface FetchAllCollectionsParams {
	after?: string;
	before?: string;
	query?: string;
	shopName: string;
}

export interface FetchAllProductCategoryParams {
	type?: string;
	childrenOf?: string;
	shopName: string;
}

/**
	* Fetches data from Shopify's GraphQL API using a POST request.
	*
	* This service sends a POST request to the Shopify GraphQL endpoint (`graphql.json`) to fetch data based on the provided GraphQL query.
	* It requires the shop domain, access token, and the GraphQL query (in the `data` parameter).
	*
	* @param {string} shop - The Shopify store domain (e.g., 'my-shop.myshopify.com').
	* @param {string} accessToken - The access token for authenticating the request.
	* @param {GraphQLData} data - The GraphQL query data, which includes the query and any variables required.
	*
	* @returns {Promise<AxiosResponse>} A promise that resolves with the response from the Shopify GraphQL API.
	* The response contains the result of the query or an error message.
*/
export const getDetailUsingGraphQL = (
	shop: string,
	accessToken: string,
	data: GraphQLData,
) => {
	const instance: AxiosInstance = ShopifyAPIInstance({ shop, accessToken });
	return instance.post('graphql.json', data);
};

/**
	* Fetches a list of products from Shopify with optional filters and pagination.
	* This service provides functionality to fetch all products from the Shopify store,
	* with support for search query, pagination (next/previous pages), and filtering by product ID.
	*
	* @param {FetchAllProductsParams} params - Parameters for filtering and pagination.
	* @param {string} params.shopName - Shopify store domain.
	* @param {string} [params.query] - Optional product search query.
	* @param {string} [params.after] - Pagination cursor to fetch products after a specific product.
	* @param {string} [params.before] - Pagination cursor to fetch products before a specific product.
	* @param {string} [params.id] - Optional product ID to fetch a specific product.
	*
	* @returns {Promise<AxiosResponse>} The response containing product details.
*/
export const fetchAllProducts = (params: FetchAllProductsParams) => {
	const requestInstance: AxiosInstance = backendAPI();
	const { after, before, query, shopName, id } = params;

	let url = `products?shop=${shopName}`;
	if (query) {
		url += `&query=${query}`;
	}
	if (after) {
		url += `&after=${after}`;
	}
	if (before) {
		url += `&before=${before}`;
	}
	if (id !== '') {
		url += `&id=${id}`;
	}

	return requestInstance.get(url);
};

/**
	* Fetches a list of collections from Shopify with optional filters and pagination.
	* This service provides functionality to fetch all collections from the Shopify store,
	* with support for filtering by query and pagination (next/previous pages).
	*
	* @param {FetchAllCollectionsParams} params - Parameters for filtering and pagination.
	* @param {string} params.shopName - Shopify store domain.
	* @param {string} [params.query] - Optional query to search for collections.
	* @param {string} [params.after] - Pagination cursor to fetch collections after a specific collection.
	* @param {string} [params.before] - Pagination cursor to fetch collections before a specific collection.
	*
	* @returns {Promise<AxiosResponse>} The response containing collections data.
*/
export const fetchAllCollections = (params: FetchAllCollectionsParams) => {
	const requestInstance: AxiosInstance = backendAPI();
	const { after, before, query, shopName } = params;

	let url = `collections?shop=${shopName}`;
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
	* Fetches a list of products or product categories from Shopify with optional filters.
	* This service provides functionality to fetch product categories based on type or parent-child relations.
	*
	* @param {FetchAllProductCategoryParams} params - Parameters for filtering categories.
	* @param {string} params.shopName - Shopify store domain.
	* @param {string} [params.type] - Optional filter for product category type.
	* @param {string} [params.childrenOf] - Optional parent category ID to fetch child categories.
	*
	* @returns {Promise<AxiosResponse>} The response containing product categories data.
*/
export const fetchAllProductCategory = (params: FetchAllProductCategoryParams) => {
	const requestInstance: AxiosInstance = backendAPI();
	const { childrenOf, type, shopName } = params;
	let url = `products?shop=${shopName}`;
	if (type) {
		url += `&type=${type}`;
	}
	if (childrenOf) {
		url += `&childrenOf=${childrenOf}`;
	}
	return requestInstance.get(url);
};
