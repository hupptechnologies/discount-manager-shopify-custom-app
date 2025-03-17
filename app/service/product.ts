import { ShopifyAPIInstance, backendAPI } from './index';
import type { AxiosInstance } from 'axios';

interface GraphQLData {
	query: string;
	variables?: Record<string, any>;
}

export const getDetailUsingGraphQL = (
	shop: string,
	accessToken: string,
	data: GraphQLData,
) => {
	const instance: AxiosInstance = ShopifyAPIInstance({ shop, accessToken });
	return instance.post('graphql.json', data);
};

interface FetchAllProductsParams {
	after?: string;
	before?: string;
	query?: string;
	shopName: string;
}

interface FetchAllCollectionsParams {
	after?: string;
	before?: string;
	query?: string;
	shopName: string;
}

export const fetchAllProducts = (params: FetchAllProductsParams) => {
	const requestInstance: AxiosInstance = backendAPI();
	const { after, before, query, shopName } = params;

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

	return requestInstance.get(url);
};

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
