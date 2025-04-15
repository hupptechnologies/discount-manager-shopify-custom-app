import { json } from '@remix-run/node';
import { fetchAppEmbedBlock } from 'app/controller/themes/fetchAppEmbedBlock';

interface LoaderResponse {
	success: boolean;
	message: string | null;
	appBlock: any;
	appEmbedID: string;
}

/**
	* Loader function for handling the theme `api.appEmbedStatus` API route.
	* 
	* This function is used to retrieve the app embed block object from the Shopify theme
	* and check whether the app embed block is currently enabled or disabled.
	* 
	* Typically used to determine if the app's frontend extension (like banner or widget)
	* is active on the storefront.
	* 
	* @param {Request} request - The incoming HTTP request.
	* @returns {Promise<Response>} - Returns a response containing the app embed block status.
*/
export const loader = async ({
	request,
}: {
	request: Request;
}): Promise<Response> => {
	const url = new URL(request.url);
	const shop = url.searchParams.get('shop') ?? '';
	const getAppEmbedResponse = await fetchAppEmbedBlock(shop);
	return json<LoaderResponse>(getAppEmbedResponse);
};