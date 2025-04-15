import type { AxiosInstance } from 'axios';
import { backendAPI } from './index';

export interface FetchAllDiscountCodesParams {
	page?: string;
	pageSize?: string;
	searchQuery?: string;
	status?: 'active' | 'pending' | 'expired' | null;
	orderByCreatedAt?: 'asc' | 'desc' | null;
	usedCountGreaterThan?: number | null;
	shopName: string;
	callback?: () => void;
}

export interface DeleteDiscountCodeParams {
	data: {
		id: number | null;
		code: string;
		discountId: string;
	};
	shopName: string;
	callback?: () => void;
}

export interface DeleteRedeemDiscountCodeParams {
	data: {
		discountId: string;
		ids: string[];
	};
	shopName: string;
	callback?: () => void;
}

export interface DeleteAllDiscountCodeParams {
	type: string;
	shopName: string;
	callback?: () => void;
}

export interface CreateDiscountCodeParams {
	data: {
		title: string;
		codes: string[];
		startsAt: string | null;
		endsAt: string | null;
		usageLimit: number;
		appliesOncePerCustomer: boolean;
		customerGets: {
			percentage: string;
			quantity: string;
			collectionIDs: string[];
			productIDs: string[];
		};
		customers: {
			customerIDs: string[];
			removeCustomersIDs: string[];
		};
		advancedRule: object | null;
	};
	shopName: string;
	type: string | null;
	method: string;
	callback?: () => void;
}

export interface CreateBuyXGetYDiscountCodeParams {
	data: {
		title: string;
		codes: string[];
		startsAt: string | null;
		endsAt: string | null;
		usageLimit: number;
		customerBuys: {
			quantity: string;
			collectionIDs: string[];
			productIDs: string[];
		};
		customerGets: {
			percentage: string;
			quantity: string;
			collectionIDs: string[];
			productIDs: string[];
		};
		advancedRule: object | null;
	};
	shopName: string;
	type: string | null;
	method: string;
	callback?: () => void;
}

export interface GetDiscountCodeByIdParams {
	shopName: string;
	id: number;
	discountType: string;
	method: string;
	callback?: () => void;
}

export interface AdvancedRuleObject {
	quantity: string;
	advanceDiscountType: 'stackable' | 'exclusive';
	region: string;
	condition: string;
	customerType: 'all' | 'vip' | 'first-time';
	productCategory: {
		prevID: string;
		currentName: string;
	};
	isAI: boolean;
	isStockBased: boolean;
}

export interface UpdateDiscountCodeParams {
	data: {
		title: string;
		code: string;
		startsAt: string | null;
		endsAt: string | null;
		usageLimit: number;
		appliesOncePerCustomer: boolean;
		customerGets: {
			percentage: string;
			quantity: string;
			collectionIDs: string[];
			productIDs: string[];
		};
		customers: {
			customerIDs: string[];
			removeCustomersIDs: string[];
		};
		advancedRule: AdvancedRuleObject | null;
	};
	shopName: string;
	id: number | null;
	type: string | null;
	callback?: () => void;
}

export interface UpdateBuyXGetYDiscountCodeParams {
	data: {
		title: string;
		code: string;
		startsAt: string | null;
		endsAt: string | null;
		usageLimit: number;
		customerBuys: {
			quantity: string;
			collectionIDs: string[];
			productIDs: string[];
		};
		customerGets: {
			percentage: string;
			quantity: string;
			collectionIDs: string[];
			productIDs: string[];
		};
		advancedRule: object | null;
	};
	shopName: string;
	id: number | null;
	type: string | null;
	callback?: () => void;
}

/**
	* Fetches all discount codes from the app's backend database.
	* 
	* This service function sends a GET request to the internal API to retrieve 
	* discount codes created via the app. It supports pagination, filtering, and 
	* searching, and works entirely with data stored in the app’s own database — 
	* not from Shopify.
	*
	* @param {FetchAllDiscountCodesParams} params - Query parameters for pagination, filtering, and search.
	* @returns {Promise<AxiosResponse>} - A promise resolving to the list of discount codes.
*/
export const fetchAllDiscountCodes = (params: FetchAllDiscountCodesParams) => {
	const requestInstance: AxiosInstance = backendAPI();
	const {
		page = 1,
		pageSize = 10,
		shopName,
		status,
		searchQuery = '',
		usedCountGreaterThan,
		orderByCreatedAt,
	} = params;

	let url = `discount?shop=${shopName}`;
	if (page) {
		url += `&page=${page}`;
	}
	if (pageSize) {
		url += `&pageSize=${pageSize}`;
	}
	if (searchQuery) {
		url += `&searchQuery=${searchQuery}`;
	}
	if (status) {
		url += `&status=${status}`;
	}
	if (usedCountGreaterThan) {
		url += '&usedCountGreaterThan=1';
	}
	if (orderByCreatedAt) {
		url += `&orderByCreatedAt=${orderByCreatedAt}`;
	}

	return requestInstance.get(url);
};

/**
	* This service provides the functionality to delete a single discount code 
	* from both the app's database and the connected Shopify store.
	* 
	* It sends a DELETE request with the shop domain and discount details, ensuring
	* the discount code is removed from both systems.
	* 
	* @param {DeleteDiscountCodeParams} params - Contains the Shopify shop domain and discount data to delete.
	* @returns {Promise<AxiosResponse>} - The result of the delete operation.
*/
export const deleteDiscountCode = (params: DeleteDiscountCodeParams) => {
	const requestInstance: AxiosInstance = backendAPI();
	const { shopName, data } = params;
	return requestInstance.delete(`discount?shop=${shopName}`, { data });
};

/**
	* This service provides the functionality to delete all discount codes 
	* of a specified type from both the app's database and the connected Shopify store.
	* 
	* It sends a DELETE request with the shop domain and discount type to identify 
	* and remove all matching discount codes.
	* 
	* @param {DeleteAllDiscountCodeParams} params - Contains the Shopify shop domain and the type of discounts to delete.
	* @returns {Promise<AxiosResponse>} - The result of the bulk delete operation.
*/
export const deleteAllDiscountCode = (params: DeleteAllDiscountCodeParams) => {
	const requestInstance: AxiosInstance = backendAPI();
	const { shopName, type } = params;
	return requestInstance.delete(`discount?shop=${shopName}&type=${type}`, { data: {}});
};

/**
	* This service provides the functionality to create a discount code 
	* (basic or automated) for a specified type (e.g., product, order, shipping) 
	* in both the app's database and the connected Shopify store.
	* 
	* It sends a POST request with the discount details, including type and method, 
	* to initiate the creation process.
	* 
	* @param {CreateDiscountCodeParams} params - Includes shop domain, discount data, type (default: 'product'), and method.
	* @returns {Promise<AxiosResponse>} - The response containing the created discount code data.
*/
export const createDiscountCode = (params: CreateDiscountCodeParams) => {
	const requestInstance: AxiosInstance = backendAPI();
	const { shopName, data, type = 'product', method } = params;
	return requestInstance.post(`discount?shop=${shopName}&type=${type}&method=${method}`, data);
};

/**
	* This service provides functionality to create a Buy X Get Y type discount 
	* (basic or automated) in both the Shopify store and the app's database.
	* 
	* It sends a POST request with the necessary discount details, including 
	* the discount type (defaulted to 'buyXgetY') and method of creation.
	* 
	* @param {CreateBuyXGetYDiscountCodeParams} params - Includes shop domain, discount data, type, and method.
	* @returns {Promise<AxiosResponse>} - The response from the API after creating the discount.
*/
export const createBuyXGetYDiscountCode = (params: CreateBuyXGetYDiscountCodeParams) => {
	const requestInstance: AxiosInstance = backendAPI();
	const { shopName, data, type = 'buyXgetY', method } = params;
	return requestInstance.post(`discount?shop=${shopName}&type=${type}&method=${method}`, data);
};

/**
	* This service provides functionality to fetch a specific discount code's 
	* details from Shopify using its ID, discount type, and method.
	* 
	* Useful when editing or viewing a discount within the app's admin panel.
	* 
	* @param {GetDiscountCodeByIdParams} params - Includes shop domain, discount ID, type, and method.
	* @returns {Promise<AxiosResponse>} - The response containing the discount code details.
*/
export const getDiscountCodeById = (params: GetDiscountCodeByIdParams) => {
	const requestInstance: AxiosInstance = backendAPI();
	const { shopName, id, discountType, method } = params;
	return requestInstance.get(`discount?shop=${shopName}&id=${id}&discountType=${discountType}&method=${method}`);
};

/**
	* This service provides functionality to update an existing discount code's 
	* details in both Shopify and the app's database.
	* 
	* Commonly used when an admin edits a discount through the app interface.
	* 
	* @param {UpdateDiscountCodeParams} params - Includes shop domain, discount ID, type, and updated data.
	* @returns {Promise<AxiosResponse>} - The response confirming the update operation.
*/
export const updateDiscountCode = (params: UpdateDiscountCodeParams) => {
	const requestInstance: AxiosInstance = backendAPI();
	const { shopName, id, type = 'products', data } = params;
	return requestInstance.put(`discount?shop=${shopName}&id=${id}&type=${type}`, data);
};

/**
	* This service provides functionality to update an existing Buy X Get Y discount code
	* in both Shopify and the app's database.
	* 
	* Typically used when an admin modifies a Buy X Get Y discount via the app dashboard.
	* 
	* @param {UpdateBuyXGetYDiscountCodeParams} params - Includes shop domain, discount ID, type, and updated data.
	* @returns {Promise<AxiosResponse>} - The response from the update operation.
*/
export const updateBuyXGetYDiscountCode = (params: UpdateBuyXGetYDiscountCodeParams) => {
	const requestInstance: AxiosInstance = backendAPI();
	const { shopName, id, type = 'buyXgetY', data } = params;
	return requestInstance.put(`discount?shop=${shopName}&id=${id}&type=${type}`, data);
};

/**
	* This service allows for the deletion of multiple bulk redeem discount codes 
	* from Shopify.
	* 
	* Typically used when an admin wants to delete multiple discount codes at once.
	* 
	* @param {DeleteRedeemDiscountCodeParams} params - Includes the shop domain and the data (discount IDs) to be deleted.
	* @returns {Promise<AxiosResponse>} - The response from the deletion operation.
*/
export const deleteBulkRedeemDiscountCode = (params: DeleteRedeemDiscountCodeParams) => {
	const requestInstance: AxiosInstance = backendAPI();
	const { shopName, data } = params;
	return requestInstance.delete(`discount?shop=${shopName}&multiple=true`, { data });
};