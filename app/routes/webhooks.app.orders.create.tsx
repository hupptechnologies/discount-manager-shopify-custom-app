import type { ActionFunctionArgs } from '@remix-run/node';
import { authenticate } from '../shopify.server';
import { handleOrderCreate } from 'app/webhookHandler/handleOrderCreate';

export const action = async ({ request }: ActionFunctionArgs) => {
	const { topic, shop, payload } = await authenticate.webhook(request);
	console.log(`Received ${topic} webhook for ${shop}`);
	if (payload?.discount_codes?.length > 0 && payload?.customer?.id) {
		handleOrderCreate(shop, payload?.discount_codes);
	}
	return new Response();
};
