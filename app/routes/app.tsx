import { NavMenu } from '@shopify/app-bridge-react';
import {
	NavLink,
	Outlet,
	useLoaderData,
	useRouteError,
} from '@remix-run/react';
import { AppProvider } from '@shopify/shopify-app-remix/react';
import { Provider } from 'react-redux';
import store from 'app/redux/store';
import type { HeadersFunction, LoaderFunctionArgs } from '@remix-run/node';
import { authenticate } from '../shopify.server';
import { boundary } from '@shopify/shopify-app-remix/server';
import polarisStyles from '@shopify/polaris/build/esm/styles.css?url';

export const links = () => [{ rel: 'stylesheet', href: polarisStyles }];

export const loader = async ({ request }: LoaderFunctionArgs) => {
	await authenticate.admin(request);

	return { apiKey: process.env.SHOPIFY_API_KEY || '' };
};

export default function App () {
	const { apiKey } = useLoaderData<typeof loader>();

	return (
		<AppProvider isEmbeddedApp apiKey={apiKey}>
			<Provider store={store}>
				<NavMenu>
					<NavLink to="/app" rel="home">
						Home
					</NavLink>
					<NavLink to="/app/manage-discount">Manage Discounts</NavLink>
				</NavMenu>
				<Outlet />
			</Provider>
		</AppProvider>
	);
}

// Shopify needs Remix to catch some thrown responses, so that their headers are included in the response.
export function ErrorBoundary () {
	return boundary.error(useRouteError());
}

export const headers: HeadersFunction = (headersArgs) => {
	return boundary.headers(headersArgs);
};
