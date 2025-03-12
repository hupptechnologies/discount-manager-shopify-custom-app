import {
	BlockStack,
	Button,
	Card,
	FormLayout,
	Icon,
	Select,
	Text,
	TextField
} from "@shopify/polaris";
import { SearchIcon } from '@shopify/polaris-icons';

interface DiscountValueProps {
	setNewRule: React.Dispatch<React.SetStateAction<any>>;
	handleOpen: any;
	newRule: {
		discount: string;
		discountType: 'per' | 'fixed';
		appliesTo: 'collection' | 'product';
		purchaseType: 'one-time' | 'subscription' | 'both';
		search: string;
	};
}

const DiscountValue: React.FC<DiscountValueProps> = ({ newRule, setNewRule, handleOpen }) => {
	return	(
		<Card>
			<BlockStack>
				<FormLayout>
					<Text variant="bodyLg" fontWeight="medium" as="h3">
						Discount value
					</Text>
					<FormLayout.Group condensed>
						<Select
							label=""
							options={[
								{ label: 'Percentage', value: 'per' },
								{ label: 'Fixed amount', value: 'fixed' },
							]}
							value={newRule.discountType}
							onChange={(value) =>
								setNewRule({
									...newRule,
									discountType: value as 'per' | 'fixed',
								})
							}
						/>
						<TextField
							label=""
							value={newRule.discount}
							onChange={(value) =>
								setNewRule({ ...newRule, discount: value })
							}
							autoComplete="off"
							prefix={newRule.discountType === 'fixed' ? 'INR' : ''}
							suffix={newRule.discountType === 'per' ? '%' : ''}
							placeholder='10'
						/>
					</FormLayout.Group>
					<FormLayout.Group condensed>
						<Select
							label="Applies to"
							options={[
								{ label: 'Specific collections', value: 'collection' },
								{ label: 'Specific products', value: 'product' },
							]}
							value={newRule.appliesTo}
							onChange={(value) =>
								setNewRule({
									...newRule,
									appliesTo: value as 'collection' | 'product',
								})
							}
						/>
						<Select
							label="Purchase type"
							options={[
								{ label: 'One-time purchase', value: 'one-time' },
								{ label: 'Subscription', value: 'subscription' },
								{ label: 'Both', value: 'both' },
							]}
							value={newRule.purchaseType}
							onChange={(value) =>
								setNewRule({
									...newRule,
									purchaseType: value as 'one-time' | 'subscription',
								})
							}
						/>
					</FormLayout.Group>
					<FormLayout.Group>
						<TextField
							label=""
							value={newRule.search}
							onChange={(value) =>
								setNewRule({ ...newRule, search: value })
							}
							autoComplete="off"
							prefix={<Icon source={SearchIcon} />}
							placeholder={`Search ${newRule.appliesTo === 'collection' ? 'collection' : 'product'}`}
						/>
						<Button onClick={handleOpen} variant='secondary'>Browse</Button>
					</FormLayout.Group>
				</FormLayout>
			</BlockStack>
		</Card>
	)
}
export default DiscountValue;