import '@shopify/shopify-app-remix/adapters/node';
import {
	ApiVersion,
	AppDistribution,
	DeliveryMethod,
	shopifyApp,
} from '@shopify/shopify-app-remix/server';
import { PrismaSessionStorage } from '@shopify/shopify-app-session-storage-prisma';
import prisma from './db.server';

const shopify = shopifyApp({
	apiKey: process.env.SHOPIFY_API_KEY,
	apiSecretKey: process.env.SHOPIFY_API_SECRET || '',
	apiVersion: ApiVersion.January25,
	scopes: process.env.SCOPES?.split(','),
	appUrl: process.env.SHOPIFY_APP_URL || '',
	authPathPrefix: '/auth',
	sessionStorage: new PrismaSessionStorage(prisma),
	distribution: AppDistribution.AppStore,
	future: {
		unstable_newEmbeddedAuthStrategy: true,
		removeRest: true,
	},
	...(process.env.SHOP_CUSTOM_DOMAIN
		? { customShopDomains: [process.env.SHOP_CUSTOM_DOMAIN] }
		: {}),
	hooks: {
		afterAuth: async ({ session }) => {
			shopify.registerWebhooks({session});
		},
	},
	webhooks: {
		APP_UNINSTALLED: {
		  deliveryMethod: DeliveryMethod.Http,
		  callbackUrl: '/webhooks/app/uninstalled'
		},
		DISCOUNTS_CREATE: {
		  deliveryMethod: DeliveryMethod.Http,
		  callbackUrl: '/webhooks/app/discounts/create'
		},
		DISCOUNTS_UPDATE: {
		  deliveryMethod: DeliveryMethod.Http,
		  callbackUrl: '/webhooks/app/discounts/update'
		},
		DISCOUNTS_DELETE: {
			deliveryMethod: DeliveryMethod.Http,
			callbackUrl: '/webhooks/app/discounts/delete'
		},
		ORDERS_CREATE: {
			deliveryMethod: DeliveryMethod.Http,
			callbackUrl: '/webhooks/app/orders/create'
		}
	}
});

export default shopify;
export const apiVersion = ApiVersion.January25;
export const addDocumentResponseHeaders = shopify.addDocumentResponseHeaders;
export const authenticate = shopify.authenticate;
export const unauthenticated = shopify.unauthenticated;
export const login = shopify.login;
export const registerWebhooks = shopify.registerWebhooks;
export const sessionStorage = shopify.sessionStorage;
