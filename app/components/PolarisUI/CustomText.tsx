import React from 'react';
import { Text, TextProps } from '@shopify/polaris';

/**
	* CustomText Component
	*
	* Purpose:
	* A reusable wrapper around the Shopify Polaris <Text> component.
	* Useful for rendering styled text consistently across the app.
	*
	* Props:
	* - Inherits all props from Polaris TextProps.
	* - Supports children as the content to be displayed.
*/

const CustomText: React.FC<TextProps> = ({ children, ...rest }) => {
	return <Text {...rest}>{children}</Text>;
};

export default CustomText;
