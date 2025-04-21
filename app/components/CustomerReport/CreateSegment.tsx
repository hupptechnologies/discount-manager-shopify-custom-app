import { Box } from '@shopify/polaris';
import CustomTextField from '../PolarisUI/CustomTextField';
import CustomBlockStack from '../PolarisUI/CustomBlockStack';

const CreateSegment = () => {
	return (
		<CustomBlockStack gap="400">
			<Box padding="400">
				<CustomBlockStack gap="400">
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
				</CustomBlockStack>
			</Box>
		</CustomBlockStack>
	);
};

export default CreateSegment;
