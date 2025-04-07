import { AxiosInstance } from "axios";
import { backendAPI } from "./index";

export interface FetchAppEmbedStatusParams {
	shopName: string;
	callback?: () => void;
};

export const fetchAppEmbedStatus = (params: FetchAppEmbedStatusParams) => {
	const requestInstance: AxiosInstance = backendAPI();
	const { shopName } = params;
	return requestInstance.get(`appEmbedStatus?shop=${shopName}`);
};