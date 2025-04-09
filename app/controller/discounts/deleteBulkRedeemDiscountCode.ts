import { getDetailUsingGraphQL } from "app/service/product";

const DELETE_BULK_REDEEM_DISCOUNT_CODES_QUERY = `
mutation discountCodeRedeemCodeBulkDelete($discountId: ID!, $ids: [ID!]) {
	discountCodeRedeemCodeBulkDelete(discountId: $discountId, ids: $ids) {
		job {
			id
		}
		userErrors {
			code
			field
			message
		}
	}
}`;

interface DataPayload {
	discountId: string;
	ids: string[];
}

export const deleteBulkRedeemDiscountCode = async (shop: string, dataPayload: DataPayload) => {
	const { discountId, ids } = dataPayload;
	try {
		const response = await prisma.session.findMany({
			where: { shop },
		});
		const accessToken = response[0]?.accessToken;

		if (!accessToken) {
			throw new Error('Access token not found');
		}

		const data = {
			query: DELETE_BULK_REDEEM_DISCOUNT_CODES_QUERY,
			variables: {
				discountId,
				ids,
			}
		};

		const deleteResponse = await getDetailUsingGraphQL(shop, accessToken, data);

		if (deleteResponse?.data?.discountCodeRedeemCodeBulkDelete?.userErrors?.length > 0) {
			throw new Error(deleteResponse.data.discountCodeRedeemCodeBulkDelete.userErrors.map((err: any) => err.message).join(', '));
		}

		return { success: true, message: 'Bulk redeem discount code delete successfully' };
	} catch (error) {
		console.error(error);
		return { success: false, message: 'Something went wrong' };
	}
};