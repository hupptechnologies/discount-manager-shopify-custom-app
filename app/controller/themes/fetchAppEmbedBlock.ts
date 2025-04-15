import { getDetailUsingGraphQL } from "app/service/product";
import { GET_PUBLISHED_THEME_QUERY, GET_THEME_SETTINGS_QUERY } from "app/graphqlQuery/theme";

interface AppEmbedBlockResponse {
	success: boolean;
	message: string | null;
	appBlock: any;
	appEmbedID: string;
}

/**
	* Fetches the status of the app embed block for a Shopify store.
	* 
	* This function checks whether the app embed block is enabled or disabled for a 
	* specific Shopify store. The status is returned as a boolean, where `true` 
	* indicates that the app embed block is enabled, and `false` indicates it is disabled.
	* 
	* @param {string} shop - The domain of the Shopify store (e.g., 'my-shop.myshopify.com').
	* 
	* @returns {Promise<AppEmbedBlockResponse>} - A promise that resolves to the app embed block status.
*/

export const fetchAppEmbedBlock = async (shop: string): Promise<AppEmbedBlockResponse> => {
	try {
		const response = await prisma.session.findMany({
			where: { shop },
		});

		const accessToken = response[0]?.accessToken;

		if (!accessToken) {
			throw new Error('Access token not found');
		}

		const data = {
			query: GET_PUBLISHED_THEME_QUERY,
		};

		const themeResponse = await getDetailUsingGraphQL(shop, accessToken, data);
		const getPublishedTheme = themeResponse?.data?.data?.themes?.edges?.[0]?.node || null;

		if (getPublishedTheme) {
			const settingData = {
				query: GET_THEME_SETTINGS_QUERY,
				variables: {
					themeId: getPublishedTheme?.id
				}
			};
			const appEmbedBlock = await getDetailUsingGraphQL(shop, accessToken, settingData);
			const removeCommentsFromJson = (jsonString: string): string => {
				return jsonString.replace(/\\"|"(?:\\"|[^"])*"|(\/\/.*|\/\*[\s\S]*?\*\/)/g, (m, g) => g ? "" : m);
			};						
			const appBlock = appEmbedBlock?.data?.data?.theme?.files?.edges?.[0]?.node?.body?.content || null;
			const jsonString = removeCommentsFromJson(appBlock);
			return {
				success: true,
				message: 'Fetch app embed status successfully',
				appEmbedID: process.env.SHOPIFY_DISCOUNT_MANAGER_ID || '',
				appBlock: JSON.parse(jsonString)?.current?.blocks
			};
		};
		return {
			success: false,
			message: 'Not found published theme',
			appBlock: getPublishedTheme,
			appEmbedID: process.env.SHOPIFY_DISCOUNT_MANAGER_ID || '',
		}

	} catch (error) {
		console.error(error);
		return {
			success: false,
			message: error instanceof Error ? error.message : 'An unknown error occurred',
			appBlock: null,
			appEmbedID: process.env.SHOPIFY_DISCOUNT_MANAGER_ID || '',
		};
	}
};