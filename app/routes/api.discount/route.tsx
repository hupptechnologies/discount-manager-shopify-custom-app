import { json } from '@remix-run/node';
import { createDiscountCode } from 'app/controller/discounts/createDicountCode';
import { deleteDiscountCode } from 'app/controller/discounts/deleteDiscountCode';
import { getDiscountCodes } from 'app/controller/discounts/getDiscountCodes';

interface ActionResponse {
	success: boolean;
	message: string;
}

interface LoaderResponse {
	success: boolean;
	discountCodes: string[];
	message: string;
	pagination: {
		totalCount: number;
		totalPages: number;
		currentPage: number;
	};
}

export const loader = async ({
	request,
}: {
	request: Request;
}): Promise<Response> => {
	const url = new URL(request.url);
	const shop = url.searchParams.get("shop") ?? '';
	const page = parseInt(url.searchParams.get("page") ?? '1', 10);
	const pageSize = parseInt(url.searchParams.get("pageSize") ?? '10', 10);
	const status = url.searchParams.get("status") as 'active' | 'pending' | undefined;
	const usedCountGreaterThan = parseInt(url.searchParams.get("usedCountGreaterThan") ?? '0', 10);
	const searchQuery = url.searchParams.get("searchQuery") ?? '';
	
	const fetchDiscountCodes = await getDiscountCodes(
		shop,
		page,
		pageSize,
		status,
		usedCountGreaterThan,
		searchQuery
	);
	
	return json<LoaderResponse>(fetchDiscountCodes);
};

export const action = async ({
	request,
}: {
	request: Request;
}): Promise<Response> => {
	const url = new URL(request.url);
	const shop = url.searchParams.get('shop') ?? '';
	if (request.method === "DELETE") {
		const discountCodeResponse = await deleteDiscountCode(shop, request);
		return json<ActionResponse>(discountCodeResponse);
	}
	const discountCodeResponse = await createDiscountCode(shop, request);
	return json<ActionResponse>(discountCodeResponse);
};
