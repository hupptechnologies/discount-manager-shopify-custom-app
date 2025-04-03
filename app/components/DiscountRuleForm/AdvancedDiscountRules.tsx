import {
	BlockStack,
	Card,
	Checkbox,
	FormLayout,
	Select,
	Text,
	TextField,
} from '@shopify/polaris';
import type { DiscountRule } from './DiscountRuleForm';
import type { QueryType } from 'app/routes/app.create-discount';

export interface AdvanceDiscountRuleProps {
	setNewRule: React.Dispatch<React.SetStateAction<any>>;
	queryType: QueryType;
	newRule: DiscountRule;
	handleSaveBarOpen: any;
}

const AdvanceDiscountRules: React.FC<AdvanceDiscountRuleProps> = ({
	newRule,
	setNewRule,
	queryType,
	handleSaveBarOpen,
}) => {
	return (
		<Card>
			<BlockStack gap="500">
				<FormLayout>
					<Text variant="headingMd" fontWeight="semibold" as="h6">
						Advance discount rules
					</Text>
					<FormLayout.Group condensed>
						<TextField
							label="Discount Condition"
							value={newRule.condition}
							onChange={(value) => {
								handleSaveBarOpen();
								setNewRule({ ...newRule, condition: value });
							}}
							placeholder="e.g. Buy 2, Get 1 Free"
							autoComplete="off"
						/>
						{['products', 'buyXgetY'].includes(queryType as string) && (
							<TextField
								label="Quantity-Based Discount"
								type="integer"
								min={0}
								value={newRule.quantity}
								onChange={(value) => {
									handleSaveBarOpen();
									setNewRule({ ...newRule, quantity: value });
								}}
								placeholder="e.g. Buy 3+ items"
								autoComplete="off"
							/>
						)}
					</FormLayout.Group>
					<FormLayout.Group condensed>
						{['order', 'shipping'].includes(queryType as string) && (
							<Select
								label="Customer Segment"
								options={[
									{ label: 'All Customers', value: 'all' },
									{ label: 'VIP', value: 'vip' },
									{ label: 'First-Time Buyers', value: 'first-time' },
								]}
								value={newRule.customerType}
								onChange={(value) => {
									handleSaveBarOpen();
									setNewRule({
										...newRule,
										customerType: value as 'all' | 'vip' | 'first-time',
									});
								}}
							/>
						)}
						<Select
							label="Discount Type"
							options={[
								{ label: 'Stackable', value: 'stackable' },
								{ label: 'Exclusive', value: 'exclusive' },
							]}
							value={newRule.advanceDiscountType}
							onChange={(value) => {
								handleSaveBarOpen();
								setNewRule({
									...newRule,
									advanceDiscountType: value as 'stackable' | 'exclusive',
								});
							}}
						/>
					</FormLayout.Group>
					<FormLayout.Group condensed>
						{['products', 'buyXgetY'].includes(queryType as string) && (
							<Select
								label="Discount by Product Category"
								options={[
									{ label: 'Shoes', value: 'shoes' },
									{ label: 'Electronic', value: 'electronic' },
								]}
								value={newRule.productCategory}
								onChange={(value) => {
									handleSaveBarOpen();
									setNewRule({
										...newRule,
										productCategory: value,
									});
								}}
							/>
						)}
						{['order', 'shipping'].includes(queryType as string) && (
							<TextField
								label="Geo-Based Discount"
								value={newRule.region}
								onChange={(value) => setNewRule({ ...newRule, region: value })}
								placeholder="e.g. Black Friday discount in the US"
								autoComplete="off"
							/>
						)}
					</FormLayout.Group>
					{['products'].includes(queryType as string) && (
						<Checkbox
							label="Stock-Based Discount"
							checked={newRule.isStockBased}
							onChange={() => {
								handleSaveBarOpen();
								setNewRule({
									...newRule,
									isStockBased: !newRule.isStockBased,
								});
							}}
							helpText="Auto-apply 25% discount when stock is below 10 units"
						/>
					)}
					<Checkbox
						label="Enable AI Discounts"
						checked={newRule.isAI}
						onChange={() => {
							handleSaveBarOpen();
							setNewRule({ ...newRule, isAI: !newRule.isAI });
						}}
					/>
				</FormLayout>
			</BlockStack>
		</Card>
	);
};

export default AdvanceDiscountRules;
