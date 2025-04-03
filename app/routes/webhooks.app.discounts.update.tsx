import { authenticate } from '../shopify.server';
import type { ActionFunctionArgs } from '@remix-run/node';
import { handleDiscountUpdate } from 'app/webhookHandler/handleDiscountUpdate';

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
	if (!payload?.admin_graphql_api_id?.includes('DiscountCodeNode')) {
		handleDiscountUpdate(typedPayload, shop);
	}
	return new Response();
};
