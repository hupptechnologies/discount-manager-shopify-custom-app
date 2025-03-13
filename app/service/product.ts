import { ShopifyAPIInstance } from './index';
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
