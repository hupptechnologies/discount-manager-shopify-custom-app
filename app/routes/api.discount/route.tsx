import { json } from '@remix-run/node';
import { createBulkDiscountCode } from 'app/controller/discounts/createBulkDiscountCode';
import { createBuyXGetYDiscountCode } from 'app/controller/discounts/createBuyxGetyDiscountCode';
import { createDiscountCode } from 'app/controller/discounts/createDicountCode';
import { deleteAllDiscountCodes } from 'app/controller/discounts/deleteAllDiscountCode';
import { deleteBulkRedeemDiscountCode } from 'app/controller/discounts/deleteBulkRedeemDiscountCode';
import { deleteDiscountCode } from 'app/controller/discounts/deleteDiscountCode';
import { getDiscountCodeById } from 'app/controller/discounts/getDiscountCodeById';
import { getDiscountCodes } from 'app/controller/discounts/getDiscountCodes';
import { updateBasicDiscountCode } from 'app/controller/discounts/updateBasicDiscountCode';
import { updateBuyXGetYDiscountCode } from 'app/controller/discounts/updateBuyxGetyDiscountCode';

interface ActionResponse {
	success: boolean;
	message: string;
}

export interface getDiscountCodeResponse {
	success: boolean;
	discountCode: object | null;
	advancedRule: object | null;
	discountScope: string | null;
	message: string;
	method: string;
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
		| 'pending'
		| 'expired';
	const usedCountGreaterThan = parseInt(
		url.searchParams.get('usedCountGreaterThan') ?? '0',
		10,
	);
	const searchQuery = url.searchParams.get('searchQuery') ?? '';
	const orderByCreatedAt = url.searchParams.get('orderByCreatedAt') as
		| 'asc'
		| 'desc';
	const id = Number(url.searchParams.get('id'));
	const discountType = url.searchParams.get('discountType') ?? '';
	const method = url.searchParams.get('method');

	if (id && discountType && method) {
		const getDiscountCodeResponse = await getDiscountCodeById(
			id,
			shop,
			discountType,
			method,
		);
		return json<getDiscountCodeResponse>(getDiscountCodeResponse);
	}

	const fetchDiscountCodes = await getDiscountCodes(
		shop,
		page,
		pageSize,
		status,
		usedCountGreaterThan,
		searchQuery,
		orderByCreatedAt,
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
	const method = url.searchParams.get('method') ?? '';
	const multiple = url.searchParams.get('multiple') ?? false;
	const id = Number(url.searchParams.get('id'));
	const dataPayload = await request.json();
	if (request.method === 'PUT') {
		if (!id) {
			return json<ActionResponse>({
				success: false,
				message: 'Id is required for update code',
			});
		}
		if (type === 'buyXgetY') {
			const buyXGetYResponse = await updateBuyXGetYDiscountCode(
				shop,
				dataPayload,
				id,
			);
			return json<ActionResponse>(buyXGetYResponse);
		}
		const updateBasicDiscountCodeResponse = await updateBasicDiscountCode(
			shop,
			dataPayload,
			id,
		);
		return json<ActionResponse>(updateBasicDiscountCodeResponse);
	}
	if (request.method === 'DELETE') {
		if (multiple) {
			const discountCodeResponse = await deleteBulkRedeemDiscountCode(shop, dataPayload);
			return json<ActionResponse>(discountCodeResponse);
		}
		if (type === 'all_code_delete') {
			const deleteAllDiscountCode = await deleteAllDiscountCodes(shop);
			return json<ActionResponse>(deleteAllDiscountCode);
		}
		const discountCodeResponse = await deleteDiscountCode(shop, dataPayload);
		return json<ActionResponse>(discountCodeResponse);
	}
	if (request.method === 'POST') {
		if (multiple) {
			const discountCodeResponse = await createBulkDiscountCode(
				shop,
				dataPayload
			);
			return json(discountCodeResponse);
		}
		if (type === 'buyXgetY') {
			const buyXGetYResponse = await createBuyXGetYDiscountCode(
				shop,
				dataPayload,
				type,
				method,
			);
			return json<ActionResponse>(buyXGetYResponse);
		}
		const discountCodeResponse = await createDiscountCode(
			shop,
			dataPayload,
			type,
			method,
		);
		return json<ActionResponse>(discountCodeResponse);
	}
	return json<ActionResponse>({
		success: false,
		message: 'Not found any method',
	});
};
