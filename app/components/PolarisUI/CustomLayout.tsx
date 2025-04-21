import React from 'react';
import { Layout, LayoutProps } from '@shopify/polaris';

/**
	* CustomLayout
	* A reusable wrapper around Shopify Polaris `Layout` component.
	* Useful for applying consistent layout structure across the application.
	*
	* @param {LayoutProps} props - Props passed to the original Layout component.
	* @returns {JSX.Element} A wrapped Polaris Layout component.
*/
export const CustomLayout: React.FC<LayoutProps> = ({ children, ...rest }) => {
	return <Layout {...rest}>{children}</Layout>;
};

/**
	* CustomLayoutSection
	* A reusable wrapper around Shopify Polaris `Layout.Section` component.
	* Allows you to maintain consistent section layout and structure throughout the app.
	*
	* @param {React.ComponentProps<typeof Layout.Section>} props - Props passed to the Layout.Section component.
	* @returns {JSX.Element} A wrapped Polaris Layout.Section component.
*/
export const CustomLayoutSection: React.FC<React.ComponentProps<typeof Layout.Section>> = ({ children, ...rest }) => {
	return <Layout.Section {...rest}>{children}</Layout.Section>;
};
