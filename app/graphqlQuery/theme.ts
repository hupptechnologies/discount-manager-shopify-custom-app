export const GET_PUBLISHED_THEME_QUERY = `
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

export const GET_THEME_SETTINGS_QUERY = `
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