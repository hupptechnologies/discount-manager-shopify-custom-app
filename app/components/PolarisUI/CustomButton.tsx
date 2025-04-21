import React from 'react';
import { Button, ButtonProps } from '@shopify/polaris';

/**
	* CustomButton Component
	*
	* Purpose:
	* A reusable wrapper around the Shopify Polaris <Button> component.
	* This allows consistent button styling and simplifies usage across the app.
	*
	* Props:
	* - Inherits all props from Polaris ButtonProps.
	* - Supports children as button label/content.
*/

const CustomButton: React.FC<ButtonProps> = ({ children, ...rest }) => {
	return (
		<Button {...rest}>
			{children}
		</Button>
	);
};

export default CustomButton;
