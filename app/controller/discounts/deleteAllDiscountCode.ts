import prisma from 'app/db.server';
import { getDetailUsingGraphQL } from 'app/service/product';

interface DeleteResponse {
	success: boolean;
	message: string;
}

const DELETE_DISCOUNT_CODE_QUERY = `
mutation DeleteDiscountCode($id: ID!) {
	discountCodeDelete(id: $id) {
		deletedCodeDiscountId
		userErrors {
			field
			code
			message
		}
	}
}`;

const DELETE_AUTOMATIC_DISCOUNT_CODE_QUERY = `
mutation DeleteDiscountCode($id: ID!) {
	discountAutomaticDelete(id: $id) {
		deletedAutomaticDiscountId
		userErrors {
			field
			code
			message
		}
	}
}`;

export const deleteAllDiscountCodes = async (shop: string): Promise<DeleteResponse> => {
	try {
		const discountCodes = await prisma.discountCode.findMany({
			where: { shop },
		});

		if (discountCodes.length === 0) {
			return {
				success: false,
				message: 'No discount codes found for the shop',
			};
		}

		const response = await prisma.session.findMany({
			where: { shop },
		});

		const accessToken = response[0]?.accessToken;

		if (!accessToken) {
			throw new Error('Access token not found');
		}

		let successCount = 0;
		let failureCount = 0;

		for (const discountCode of discountCodes) {
			const data = {
				query: discountCode.discountId.includes('DiscountCodeNode') ? DELETE_DISCOUNT_CODE_QUERY : DELETE_AUTOMATIC_DISCOUNT_CODE_QUERY,
				variables: {
					id: discountCode.discountId
				},
			};
			const responseFromShopify = await getDetailUsingGraphQL(
				shop,
				accessToken,
				data,
			);
			if (responseFromShopify?.data?.data) {
				await prisma.discountCode.delete({
					where: {
						id: discountCode.id,
					},
				});
				successCount++;
			} else {
				failureCount++;
			}
		}

		return {
			success: successCount > 0,
			message: successCount > 0 ? `Successfully deleted ${successCount} discount codes.` : `Failed to delete ${failureCount} discount codes.`,
		};
	} catch (error) {
		// eslint-disable-next-line no-console
		console.error('Error deleting all discount codes: ', error);
		return {
			success: false,
			message: 'Failed to delete all discount codes',
		};
	}
};
