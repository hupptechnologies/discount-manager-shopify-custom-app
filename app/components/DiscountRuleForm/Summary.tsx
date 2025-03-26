import {
	BlockStack,
	Box,
	Card,
	InlineStack,
	List,
	Text,
} from '@shopify/polaris';

type DiscountRuleFormProps = {
	queryType: 'order' | 'products' | 'shipping' | 'buyXgetY' | null;
	newRule: {
		checkoutDiscountCode: string;
	};
};

const Summary: React.FC<DiscountRuleFormProps> = ({ queryType, newRule }) => {
	const typeList = {
		order: 'Amount off orders',
		products: 'Amount off products',
		shipping: 'Free Shipping',
		buyXgetY: 'Buy X get Y'
	};

	return (
		<Card>
			<InlineStack gap="400">
				<Text variant="bodyMd" as="h6">
					{newRule?.checkoutDiscountCode ? newRule?.checkoutDiscountCode : 'No discount code yet'}
				</Text>
			</InlineStack>
			<BlockStack gap="400">
				<Text variant="headingSm" as="p">
					Code
				</Text>
				<Box>
					<Text variant="headingSm" as="p">
						Type
					</Text>
					<Text as="p" variant="bodyMd">
						{queryType && typeList[queryType]}
					</Text>
				</Box>
				<Box>
					<Text variant="headingSm" as="p">
						Details
					</Text>
					<List>
						<List.Item>For Online Store</List.Item>
						<List.Item>Applies to one-time purchases</List.Item>
						<List.Item>No minimum purchase requirement</List.Item>
						<List.Item>All customers</List.Item>
						<List.Item>Can’t combine with other discounts</List.Item>
						<List.Item>No usage limits</List.Item>
						<List.Item>Active from today</List.Item>
					</List>
				</Box>
			</BlockStack>
		</Card>
	);
};

export default Summary;