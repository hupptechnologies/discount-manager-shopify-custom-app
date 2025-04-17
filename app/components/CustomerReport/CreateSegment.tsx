import { BlockStack, Box, TextField } from '@shopify/polaris';

const CreateSegment = () => {
	return (
		<BlockStack gap="400">
			<Box padding="400">
				<BlockStack gap="400">
					<TextField
						label="Segment Name"
						value=''
						type='text'
						name='name'
						autoComplete="off"
					/>
					<TextField
						label="Segment Rule (Query)"
						multiline={3}
						autoComplete="off"
						helpText={`Example: totalSpent > 100 AND tags CONTAINS 'VIP'`}
					/>
				</BlockStack>
			</Box>
		</BlockStack>
	);
};

export default CreateSegment;
