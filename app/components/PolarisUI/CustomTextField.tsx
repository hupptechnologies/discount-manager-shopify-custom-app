import React from 'react';
import { TextField, TextFieldProps } from '@shopify/polaris';

/**
	* CustomTextField component
	* 
	* This component wraps the Shopify Polaris TextField to create a reusable
	* TextField component that can be used throughout your app.
	* 
	* @param {TextFieldProps} rest - All the properties from Polaris TextField are passed as props.
	* 
	* @returns {React.Element} - Returns a TextField component with the passed props.
*/

const CustomTextField: React.FC<TextFieldProps> = ({ ...rest }) => {
	return (
		<TextField {...rest} />
	);
};

export default CustomTextField;
