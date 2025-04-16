import { authenticate } from '../shopify.server';
import type { ActionFunctionArgs } from '@remix-run/node';

export const action = async ({
	request,
}: ActionFunctionArgs): Promise<Response> => {
	const { shop, topic, payload } = await authenticate.webhook(request);
	console.log(`Received ${topic} webhook for ${shop}`, payload);
	return new Response();
};
