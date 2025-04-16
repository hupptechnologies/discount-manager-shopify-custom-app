import React from 'react';

/* 
	Placeholder component

	Purpose:
	This component is used to render an empty space with configurable height.
	It can be helpful for spacing/layout purposes in the UI where content might
	be conditionally rendered or temporarily missing.
*/
const Placeholder: React.FC<{ height: string }> = ({ height = 'auto' }) => {
	return (
		<div
			style={{
				padding: '14px var(--p-space-200)',
				height: height,
			}}
		/>
	);
};

export default Placeholder;
