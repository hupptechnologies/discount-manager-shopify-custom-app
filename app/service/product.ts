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
