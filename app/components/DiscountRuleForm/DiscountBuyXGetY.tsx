import {
	BlockStack,
	Box,
	Button,
	Card,
	Divider,
	FormLayout,
	Icon,
	RadioButton,
	Select,
	Text,
	TextField,
} from '@shopify/polaris';
import { SearchIcon } from '@shopify/polaris-icons';

interface DiscountBuyXGetYProps {
	setNewRule: React.Dispatch<React.SetStateAction<any>>;
	handleOpen: any;
	newRule: {
		isMinQuantityItem: boolean;
		isMinPurchaseAmount: boolean;
		appliesTo: 'collection' | 'product';
		purchaseType: 'one-time' | 'subscription' | 'both';
		search: string;
		minQuantity: string;
		isPercentage: boolean;
		isAmountOfEach: boolean;
		isFree: boolean;
		discount: string;
	};
}

const DiscountBuyXGetY: React.FC<DiscountBuyXGetYProps> = ({
	newRule,
	setNewRule,
	handleOpen,
}) => {
	return (
		<Card>
			<FormLayout>
				<Text variant="headingMd" fontWeight="semibold" as="h6">
					Customer {newRule?.isMinPurchaseAmount ? 'spends' : 'buys'}
				</Text>
				<BlockStack gap="100">
					<RadioButton
						label="Minimum quantity of items"
						checked={newRule.isMinQuantityItem}
						onChange={() =>
							setNewRule({
								...newRule,
								isMinQuantityItem: !newRule.isMinQuantityItem,
								isMinPurchaseAmount: false,
							})
						}
					/>
					<RadioButton
						label="Minimum purchase amount"
						checked={newRule.isMinPurchaseAmount}
						onChange={() =>
							setNewRule({
								...newRule,
								isMinPurchaseAmount: !newRule.isMinPurchaseAmount,
								isMinQuantityItem: false,
							})
						}
					/>
				</BlockStack>
				<FormLayout.Group condensed>
					<TextField
						label={newRule?.isMinPurchaseAmount ? 'Amount' : 'Quantity'}
						type="text"
						min={0}
						value={newRule.minQuantity}
						onChange={(value) => setNewRule({ ...newRule, minQuantity: value })}
						autoComplete="off"
						placeholder={newRule?.isMinPurchaseAmount ? '0.00' : ''}
						prefix={newRule?.isMinPurchaseAmount ? '$' : ''}
					/>
					<Select
						label="Any items from"
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
						onChange={(value) => setNewRule({ ...newRule, search: value })}
						autoComplete="off"
						prefix={<Icon source={SearchIcon} />}
						placeholder={`Search ${newRule.appliesTo === 'collection' ? 'collection' : 'product'}`}
					/>
					<Button onClick={handleOpen} variant="secondary">
						Browse
					</Button>
				</FormLayout.Group>
				<Divider borderColor="border" />
				<BlockStack gap="300">
					<Text variant="headingMd" fontWeight="semibold" as="h6">
						Customer gets
					</Text>
					<Text as="p" tone="subdued">
						Customers must add the quantity of items specified below to their
						cart.
					</Text>
				</BlockStack>
				<FormLayout.Group condensed>
					<TextField
						label="Quantity"
						type="text"
						min={0}
						value={newRule.minQuantity}
						onChange={(value) => setNewRule({ ...newRule, minQuantity: value })}
						autoComplete="off"
					/>
					<Select
						label="Any items from"
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
				</FormLayout.Group>
				<FormLayout.Group>
					<TextField
						label=""
						value={newRule.search}
						onChange={(value) => setNewRule({ ...newRule, search: value })}
						autoComplete="off"
						prefix={<Icon source={SearchIcon} />}
						placeholder={`Search ${newRule.appliesTo === 'collection' ? 'collection' : 'product'}`}
					/>
					<Button onClick={handleOpen} variant="secondary">
						Browse
					</Button>
				</FormLayout.Group>
				<Text variant="bodyMd" fontWeight="bold" as="h4">
					At a discounted value
				</Text>
				<BlockStack gap="100">
					<RadioButton
						label="Percentage"
						checked={newRule.isPercentage}
						onChange={() =>
							setNewRule({
								...newRule,
								isPercentage: !newRule.isPercentage,
								isAmountOfEach: false,
								isFree: false,
							})
						}
						helpText={
							newRule.isPercentage && (
								<Box width="30%">
									<TextField
										label=""
										type="text"
										min={0}
										value={newRule.discount}
										onChange={(value) =>
											setNewRule({ ...newRule, discount: value })
										}
										autoComplete="off"
										suffix="%"
									/>
								</Box>
							)
						}
					/>
					<RadioButton
						label="Amount off each"
						checked={newRule.isAmountOfEach}
						onChange={() =>
							setNewRule({
								...newRule,
								isAmountOfEach: !newRule.isAmountOfEach,
								isPercentage: false,
								isFree: false,
							})
						}
						helpText={
							newRule.isAmountOfEach && (
								<BlockStack gap="100">
									<Box width="30%">
										<TextField
											label=""
											type="text"
											min={0}
											value={newRule.discount}
											onChange={(value) =>
												setNewRule({ ...newRule, discount: value })
											}
											autoComplete="off"
											placeholder="0.00"
											prefix="$"
										/>
									</Box>
									<Text as="p" tone="subdued">
										For multiple quantities, the discount amount will be taken
										off each Y item.
									</Text>
								</BlockStack>
							)
						}
					/>
					<RadioButton
						label="Free"
						checked={newRule.isFree}
						onChange={() =>
							setNewRule({
								...newRule,
								isFree: !newRule.isFree,
								isPercentage: false,
								isAmountOfEach: false,
							})
						}
					/>
				</BlockStack>
			</FormLayout>
		</Card>
	);
};

export default DiscountBuyXGetY;
