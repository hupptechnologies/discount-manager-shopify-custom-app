import { json } from '@remix-run/node';
import { createBuyXGetYDiscountCode } from 'app/controller/discounts/createBuyxGetyDiscountCode';
import { createDiscountCode } from 'app/controller/discounts/createDicountCode';
import { deleteDiscountCode } from 'app/controller/discounts/deleteDiscountCode';
import { getDiscountCodeById } from 'app/controller/discounts/getDiscountCodeById';
import { getDiscountCodes } from 'app/controller/discounts/getDiscountCodes';
import { updateBasicDiscountCode } from 'app/controller/discounts/updateBasicDiscountCode';
import { updateBuyXGetYDiscountCode } from 'app/controller/discounts/updateBuyxGetyDiscountCode';

interface ActionResponse {
	success: boolean;
	message: string;
}

interface getDiscountCodeResponse {
	success: boolean;
	discountCode: object | null;
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
	const shop = url.searchParams.get('shop') ?? '';
	const page = parseInt(url.searchParams.get('page') ?? '1', 10);
	const pageSize = parseInt(url.searchParams.get('pageSize') ?? '10', 10);
	const status = url.searchParams.get('status') as
		| 'active'
		| 'pending';
	const usedCountGreaterThan = parseInt(
		url.searchParams.get('usedCountGreaterThan') ?? '0',
		10,
	);
	const searchQuery = url.searchParams.get('searchQuery') ?? '';
	const orderByCode = url.searchParams.get('orderByCode') as | 'asc' | 'desc';
	const id = Number(url.searchParams.get('id'));

	if (id) {
		const getDiscountCodeResponse = await getDiscountCodeById(id, shop); 
		return json<getDiscountCodeResponse>(getDiscountCodeResponse);
	}

	const fetchDiscountCodes = await getDiscountCodes(
		shop,
		page,
		pageSize,
		status,
		usedCountGreaterThan,
		searchQuery,
		orderByCode
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
	const type = url.searchParams.get('type') ?? '';
	const id = Number(url.searchParams.get('id'))
	if (request.method === 'PUT') {
		if (!id) {
			return json<ActionResponse>({ success: false, message: 'Id is required for update code' });
		}
		if (type === 'buyxgety') {
			const buyXGetYResponse = await updateBuyXGetYDiscountCode(shop, request, id);
			return json<ActionResponse>(buyXGetYResponse);
		}
		const updateBasicDiscountCodeResponse = await updateBasicDiscountCode(shop, request, id);
		return json<ActionResponse>(updateBasicDiscountCodeResponse);
	}
	if (request.method === 'DELETE') {
		const discountCodeResponse = await deleteDiscountCode(shop, request);
		return json<ActionResponse>(discountCodeResponse);
	}
	if (request.method === 'POST') {
		if (type === 'buyxgety') {
			const buyXGetYResponse = await createBuyXGetYDiscountCode(shop, request);
			return json<ActionResponse>(buyXGetYResponse);
		}
		const discountCodeResponse = await createDiscountCode(shop, request);
		return json<ActionResponse>(discountCodeResponse);
	}
	return json<ActionResponse>({ success: false, message: 'Not found any method' });
};
