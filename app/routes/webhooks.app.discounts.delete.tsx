import { authenticate } from '../shopify.server';
import { handleDiscountDelete } from 'app/webhookHandler/handleDiscountDelete';
import type { ActionFunctionArgs } from '@remix-run/node';

interface WebhookPayload {
	admin_graphql_api_id: string;
}

export const action = async ({ request }: ActionFunctionArgs): Promise<Response> => {
	const { shop, topic, payload } = await authenticate.webhook(request);
	const typedPayload = payload as WebhookPayload;
	console.log(`Received ${topic} webhook for ${shop}`);
	handleDiscountDelete(typedPayload, shop);
	return new Response();
};