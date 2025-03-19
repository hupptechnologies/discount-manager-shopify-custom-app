import axios, { type AxiosInstance } from 'axios';

interface ShopifyAPIInstanceProps {
	shop: string;
	accessToken: string;
}

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

export const backendAPI = (): AxiosInstance => {
	return axios.create({
		baseURL: '/api/',
	});
};
