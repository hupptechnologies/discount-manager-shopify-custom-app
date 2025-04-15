import { AxiosInstance } from "axios";
import { ShopifyAPIInstance, backendAPI } from "./index";

export interface FetchAppEmbedStatusParams {
	shopName: string;
	callback?: () => void;
};

/**
	* Fetches the embed status of the app from the Shopify store.
	* This service checks the app embed status, which indicates whether the app's embed block is active or disabled.
	*
	* @param {FetchAppEmbedStatusParams} params - Parameters for fetching app embed status.
	* @param {string} params.shopName - Shopify store domain.
	*
	* @returns {Promise<AxiosResponse>} The response containing the app embed status.
*/
export const fetchAppEmbedStatus = (params: FetchAppEmbedStatusParams) => {
	const requestInstance: AxiosInstance = backendAPI();
	const { shopName } = params;
	return requestInstance.get(`appEmbedStatus?shop=${shopName}`);
};

/**
	* Creates bulk discount codes for a given price rule in Shopify.
	* This service allows for the creation of multiple discount codes under a specific price rule.
	* The discount codes are created through the Shopify API for a specified price rule.
	*
	* @param {string} priceRuleId - The ID of the price rule under which discount codes will be created.
	* @param {object | null} data - The data for creating the discount codes. This should contain details like the discount value, code formats, etc.
	* @param {string} shop - The Shopify store domain.
	* @param {string} accessToken - The access token for authenticating the Shopify API request.
	*
	* @returns {Promise<AxiosResponse>} The response containing the result of the bulk discount code creation.
*/
export const createBulkDiscountCodes = (priceRuleId: string, data: object | null, shop: string, accessToken: string) => {
	const requestInstance: AxiosInstance = ShopifyAPIInstance({ shop, accessToken });
	return requestInstance.post(`price_rules/${priceRuleId}/discount_codes.json`, data);
};