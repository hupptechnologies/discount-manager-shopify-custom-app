import { getDetailUsingGraphQL } from "app/service/product";

const GET_PUBLISHED_THEME_QUERY = `
query getThemes {
	themes(first: 1, roles: MAIN) {
		edges {
			node {
				name
				id
				role
			}
		}
	}
}`;

const GET_THEME_SETTINGS_QUERY = `
query getThemeData($themeId: ID!) {
	theme(id: $themeId) {
		id
		name
		role
		files(filenames: ["config/settings_data.json"], first: 1) {
			edges {
				node {
					body {
						... on OnlineStoreThemeFileBodyText {
							content
						}
					}
				}
			}
		}
	}
}`;

interface AppEmbedBlockResponse {
	success: boolean;
	message: string | null;
	appBlock: any;
	appEmbedID: string;
}

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