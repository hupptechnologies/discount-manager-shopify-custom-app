import prisma from "app/db.server";
import { FetchCategoryResponse } from "app/routes/api.products/route";
import { getDetailUsingGraphQL } from "app/service/product";

const  GET_CATEGORIES_QUERY = (childrenOf: string) => `
query GetAllCategories {
	taxonomy {
		categories(first: 250${childrenOf ? `, childrenOf: "${childrenOf}"` : ''}) {
			edges {
				node {
					id
					name
					fullName
					childrenIds
					parentId
				}
			}
		}
	}
}`;

interface GraphqlResponse {
	data: {
		data: {
			taxonomy:{
				categories: {
					edges: {
						node: {
							id: string;
							name: string;
							fullName: string;
							childrenIds: string[];
							parentId: string;
						};
					}[];
				};
			};
		};
	};
};

export const fetchAllCategories = async (shop: string, childrenOf: string): Promise<FetchCategoryResponse> => {
	try {
		const response = await prisma.session.findMany({
			where: { shop },
		});
		const accessToken = response[0]?.accessToken;
		if (!accessToken) {
			throw new Error('Access token not found');
		}
		const data = {
			query: GET_CATEGORIES_QUERY(childrenOf)
		};
		const taxonomyRes: GraphqlResponse = await getDetailUsingGraphQL(shop, accessToken, data);
		const categories = taxonomyRes?.data?.data?.taxonomy?.categories?.edges || [];
		return { success: true, message: 'Retrive all products categories', categories };
	} catch (error) {
		console.log(error, 'Error while fetching categories');
		return { success: false, message: 'Something went wrong', categories: [] };
	}
};