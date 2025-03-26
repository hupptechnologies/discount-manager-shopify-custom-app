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

interface DeleteDiscountCodeInput {
	id: number;
	code: string;
	discountId: string;
}

export const deleteDiscountCode = async (
	shop: string,
	request: Request,
): Promise<DeleteResponse> => {
	const { id, code, discountId }: DeleteDiscountCodeInput =
		await request.json();
	try {
		if (!id || !code || !discountId) {
			return {
				success: false,
				message: 'Required fields id, code, discountId'
			}
		}
		const discountCode = await prisma.discountCode.findFirst({
			where: { shop, code, id, discountId },
		});

		if (!discountCode) {
			return {
				success: false,
				message: 'Discount code not found with the provided criteria',
			};
		}

		const response = await prisma.session.findMany({
			where: { shop },
		});
		const accessToken = response[0]?.accessToken;

		if (!accessToken) {
			throw new Error('Access token not found');
		}

		const data = {
			query: DELETE_DISCOUNT_CODE_QUERY,
			variables: {
				id: discountId,
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
		}

		return {
			success: true,
			message: 'Discount code deleted successfully',
		};
	} catch (error) {
		// eslint-disable-next-line no-console
		console.error('Error deleting discount code: ', error);
		return {
			success: false,
			message: 'Failed to delete discount code',
		};
	}
};
