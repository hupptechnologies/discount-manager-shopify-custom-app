import React from "react";
import { Spinner, SpinnerProps } from "@shopify/polaris";

/**
	* CustomSpinner Component
	*
	* Purpose:
	* This component is a wrapper around Shopify Polaris's Spinner.
	* It can be used as a reusable loading indicator throughout the app.
	* 
	* Features:
	* - Renders a Polaris Spinner with a predefined size ("large").
	* - Wrapped in a container div for easier styling or positioning.
	*
	* Note:
	* Currently, this component does not accept props, but SpinnerProps is imported
	* for future extensibility (e.g., passing different sizes or accessibility labels).
*/

const CustomSpinner: React.FC<SpinnerProps> = () => {
	return(
		<div className="spinner-container">
			<Spinner size="large" />
		</div>
	)
};

export default CustomSpinner;