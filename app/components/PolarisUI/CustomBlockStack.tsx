import React from 'react';
import { BlockStack, BlockStackProps } from '@shopify/polaris';

/**
	* CustomBlockStack component
	* 
	* This component wraps the Shopify Polaris BlockStack to create a reusable
	* BlockStack component that can be used throughout your app.
	* 
	* @param {BlockStackProps} rest - All the properties from Polaris BlockStack are passed as props.
	* 
	* @returns {React.Element} - Returns a BlockStack component with the passed props.
*/

const CustomBlockStack: React.FC<BlockStackProps> = ({ children, ...rest }) => {
	return (
		<BlockStack {...rest}>
			{children}
		</BlockStack>
	);
};

export default CustomBlockStack;
