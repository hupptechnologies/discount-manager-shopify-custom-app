import {
	Layout,
	Grid,
	BlockStack,
	Box,
	InlineStack
} from '@shopify/polaris';
import { useSelector } from 'react-redux';
import type { RootState } from 'app/redux/store';
import { getAllDiscountCodeDetail } from 'app/redux/discount/slice';
import { StatBox } from './StateBox';
import PrimaryButton from 'app/components/PolarisUI/CustomButton';
import CustomText from 'app/components/PolarisUI/CustomText';

interface IndexStateBoxProps {
	handleOpen: any;
}

/**
	* IndexStateBox component displays a summary of discount statistics 
	* and triggers an action when interacted with.
	* @param handleOpen - Callback to handle opening modals or dialogs.
*/
const IndexStateBox: React.FC<IndexStateBoxProps> = ({ handleOpen }) => {
	const { discountStats } = useSelector((state: RootState) =>
		getAllDiscountCodeDetail(state),
	);

	return (
		<>
			<Layout.Section>
				<Box padding="200">
					<BlockStack gap="100">
						<InlineStack align="space-between" blockAlign="center" gap="100">
							<CustomText
								as="h6"
								variant="headingMd"
								children={'Analytics Overview'}
							/>
							<PrimaryButton
								variant='primary'
								onClick={handleOpen}
								children={'Create discount'}
							/>
						</InlineStack>
						<CustomText
							as="p"
							variant="bodySm"
							tone="subdued"
							children={'Shows the most recent discount code statistics and trends.'}
						/>
					</BlockStack>
				</Box>
			</Layout.Section>
			<Layout.Section>
				<Grid>
					<Grid.Cell columnSpan={{ xs: 6, lg: 4 }}>
						<StatBox
							title="Active Discounts"
							value={discountStats?.activeDiscount?.count ?? 0}
							data={discountStats?.activeDiscount?.data}
						/>
					</Grid.Cell>
					<Grid.Cell columnSpan={{ xs: 6, lg: 4 }}>
						<StatBox
							title="Used Discounts"
							value={discountStats?.usedDiscount?.count ?? 0}
							data={discountStats?.usedDiscount?.data}
						/>
					</Grid.Cell>
					<Grid.Cell columnSpan={{ xs: 6, lg: 4 }}>
						<StatBox
							title="Expired Discounts"
							value={discountStats?.expiredDiscount?.count ?? 0}
							data={discountStats?.expiredDiscount?.data}
						/>
					</Grid.Cell>
				</Grid>
			</Layout.Section>
		</>
	);
};

export default IndexStateBox;
