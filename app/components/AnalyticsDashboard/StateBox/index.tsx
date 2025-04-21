import {
	Layout,
	Grid,
	Text,
	BlockStack,
	Box,
	InlineStack
} from '@shopify/polaris';
import { useSelector } from 'react-redux';
import type { RootState } from 'app/redux/store';
import { getAllDiscountCodeDetail } from 'app/redux/discount/slice';
import { StatBox } from './StateBox';
import PrimaryButton from 'app/components/Button';

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
							<Text as="h6" variant="headingMd">
								Analytics Overview
							</Text>
							<PrimaryButton
								variant='primary'
								onClick={handleOpen}
								children={'Create discount'}
							/>
						</InlineStack>
						<Text as="p" variant="bodySm" tone="subdued">
							Shows the most recent discount code statistics and trends.
						</Text>
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
