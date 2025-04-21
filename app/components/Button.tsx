import React from 'react';
import { Button, ButtonProps } from '@shopify/polaris';

type PrimaryButtonProps = React.PropsWithChildren<ButtonProps>;

const PrimaryButton: React.FC<PrimaryButtonProps> = ({ children, ...rest }) => {
	return (
		<Button {...rest}>
			{children}
		</Button>
	);
};

export default PrimaryButton;
