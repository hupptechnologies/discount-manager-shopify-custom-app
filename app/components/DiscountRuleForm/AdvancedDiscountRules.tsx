import {
	BlockStack,
	Card,
	Checkbox,
	FormLayout,
	Select,
	Text,
	TextField
} from "@shopify/polaris";

interface AdvanceDiscountRuleProps {
	setNewRule: React.Dispatch<React.SetStateAction<any>>;
	newRule: {
		quantity: string;
		type: 'stackable' | 'exclusive';
		region: string;
		condition: string;
		customerType: 'all' | 'vip' | 'first-time';
		category: string;
		isAI: boolean;
		isStockBased: boolean;
	};
}

const AdvanceDiscountRules: React.FC<AdvanceDiscountRuleProps> = ({ newRule, setNewRule }) => {
	return	(
		<Card>
			<BlockStack gap="500">
				<FormLayout>
					<Text variant="bodyLg" fontWeight="medium" as="h3">
						Advance discount rules
					</Text>
					<FormLayout.Group condensed>
						<TextField
							label="Discount Condition"
							value={newRule.condition}
							onChange={(value) =>
								setNewRule({ ...newRule, condition: value })
							}
							placeholder="e.g. Buy 2, Get 1 Free"
							autoComplete="off"
						/>
						<TextField
							label="Quantity-Based Discount"
							value={newRule.quantity}
							onChange={(value) =>
								setNewRule({ ...newRule, quantity: value })
							}
							placeholder="e.g. Buy 3+ items"
							autoComplete="off"
						/>
					</FormLayout.Group>
					<FormLayout.Group condensed>
						<Select
							label="Customer Segment"
							options={[
								{ label: 'All Customers', value: 'all' },
								{ label: 'VIP', value: 'vip' },
								{ label: 'First-Time Buyers', value: 'first-time' },
							]}
							value={newRule.customerType}
							onChange={(value) =>
								setNewRule({
									...newRule,
									customerType: value as 'all' | 'vip' | 'first-time',
							})}
						/>
						<Select
							label="Discount Type"
							options={[
								{ label: 'Stackable', value: 'stackable' },
								{ label: 'Exclusive', value: 'exclusive' },
							]}
							value={newRule.type}
							onChange={(value) =>
								setNewRule({
									...newRule,
									type: value as 'stackable' | 'exclusive',
								})
							}
						/>
					</FormLayout.Group>
					<FormLayout.Group condensed>
						<TextField
							label="Discount by Product Category"
							value={newRule.category}
							onChange={(value) =>
								setNewRule({ ...newRule, category: value })
							}
							placeholder="e.g. 20% off all shoes"
							autoComplete="off"
						/>
						<TextField
							label="Geo-Based Discount"
							value={newRule.region}
							onChange={(value) => setNewRule({ ...newRule, region: value })}
							placeholder="e.g. Black Friday discount in the US"
							autoComplete="off"
						/>
					</FormLayout.Group>
					<Checkbox
						label="Stock-Based Discount"
						checked={newRule.isStockBased}
						onChange={() =>
							setNewRule({
								...newRule,
								isStockBased: !newRule.isStockBased,
							})
						}
					/>
					<Checkbox
						label="Enable AI Discounts"
						checked={newRule.isAI}
						onChange={() => setNewRule({ ...newRule, isAI: !newRule.isAI })}
					/>
				</FormLayout>
			</BlockStack>
		</Card>
	)
};

export default AdvanceDiscountRules;