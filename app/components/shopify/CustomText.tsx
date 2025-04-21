import React from 'react';
import { Text, TextProps } from '@shopify/polaris';

const CustomText: React.FC<TextProps> = ({ children, ...rest }) => {
	return <Text {...rest}>{children}</Text>;
};

export default CustomText;
