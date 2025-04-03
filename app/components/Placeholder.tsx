import React from 'react';

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
