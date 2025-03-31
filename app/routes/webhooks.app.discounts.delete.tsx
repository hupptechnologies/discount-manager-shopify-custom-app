import type { ActionFunctionArgs } from '@remix-run/node';
import { authenticate } from '../shopify.server';

export const action = async ({ request }: ActionFunctionArgs) => {
	const { shop, topic, payload} = await authenticate.webhook(request);
	console.log(`Received ${topic} webhook for ${shop}`, payload);
	return new Response();
};
