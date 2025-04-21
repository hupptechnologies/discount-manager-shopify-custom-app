import { BlockStack, Box } from '@shopify/polaris';
import CustomTextField from '../PolarisUI/CustomTextField';

const CreateSegment = () => {
	return (
		<BlockStack gap="400">
			<Box padding="400">
				<BlockStack gap="400">
					<CustomTextField
						label="Segment Name"
						value=''
						type='text'
						name='name'
						autoComplete="off"
					/>
					<CustomTextField
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
