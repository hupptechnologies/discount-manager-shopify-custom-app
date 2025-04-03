import { authenticate } from '../shopify.server';
import { handleDiscountCreate } from 'app/webhookHandler/handleDiscountCreate';
import type { ActionFunctionArgs } from '@remix-run/node';

interface WebhookPayload {
	admin_graphql_api_id: string;
	title: string;
	status: string;
	created_at: string;
	updated_at: string;
}

export const action = async ({
	request,
}: ActionFunctionArgs): Promise<Response> => {
	const { shop, topic, payload } = await authenticate.webhook(request);
	const typedPayload = payload as WebhookPayload;
	console.log(`Received ${topic} webhook for ${shop}`);
	handleDiscountCreate(typedPayload, shop);
	return new Response();
};
