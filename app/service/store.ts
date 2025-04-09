import { AxiosInstance } from "axios";
import { ShopifyAPIInstance, backendAPI } from "./index";

export interface FetchAppEmbedStatusParams {
	shopName: string;
	callback?: () => void;
};

export const fetchAppEmbedStatus = (params: FetchAppEmbedStatusParams) => {
	const requestInstance: AxiosInstance = backendAPI();
	const { shopName } = params;
	return requestInstance.get(`appEmbedStatus?shop=${shopName}`);
};

export const createBulkDiscountCodes = ( priceRuleId: string, data: object | null, shop: string, accessToken: string) => {
	const requestInstance: AxiosInstance = ShopifyAPIInstance({ shop, accessToken });
	return requestInstance.post(`price_rules/${priceRuleId}/discount_codes.json`, data);
};