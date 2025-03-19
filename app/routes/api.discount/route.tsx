import { json } from '@remix-run/node';
import { createDiscountCode } from 'app/controller/discounts/createDicountCode';

interface LoaderResponse {
	success: boolean;
	message: string;
}

export const action = async ({
	request,
}: {
	request: Request;
}): Promise<Response> => {
	const url = new URL(request.url);
	const shop = url.searchParams.get('shop') ?? '';
	const discountCodeResponse = await createDiscountCode(shop, request);
	return json<LoaderResponse>(discountCodeResponse);
};
