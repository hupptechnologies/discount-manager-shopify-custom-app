import React from 'react';
import { Button, ButtonProps } from '@shopify/polaris';

type PrimaryButtonProps = React.PropsWithChildren<ButtonProps>;

const CustomButton: React.FC<PrimaryButtonProps> = ({ children, ...rest }) => {
	return (
		<Button {...rest}>
			{children}
		</Button>
	);
};

export default CustomButton;
