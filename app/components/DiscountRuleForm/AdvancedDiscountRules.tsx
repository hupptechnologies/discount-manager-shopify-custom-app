import { useCallback, useState } from 'react';
import {
	Autocomplete,
	BlockStack,
	Button,
	Card,
	Checkbox,
	FormLayout,
	Icon,
	Select,
	Text,
	TextField,
} from '@shopify/polaris';
import { SearchIcon } from '@shopify/polaris-icons';
import { useSelector } from 'react-redux';
import { RootState } from 'app/redux/store';
import { getCreateDiscountDetail } from 'app/redux/create-discount/slice';
import EditItemsList from './EditItemsList';
import type { DiscountRule } from './DiscountRuleForm';
import type { QueryType } from 'app/routes/app.create-discount';

export interface AdvanceDiscountRuleProps {
	setNewRule: React.Dispatch<React.SetStateAction<any>>;
	queryType: QueryType;
	newRule: DiscountRule;
	handleSaveBarOpen: any;
	handleOpen: any;
	handleSearchCustomer: any;
	handleCustomerCancel: any;
}

const AdvanceDiscountRules: React.FC<AdvanceDiscountRuleProps> = ({
	newRule,
	setNewRule,
	queryType,
	handleSaveBarOpen,
	handleOpen,
	handleSearchCustomer,
	handleCustomerCancel
}) => {
	const { categories } = useSelector((state: RootState) => getCreateDiscountDetail(state));
	const convertedCategories = categories?.length > 0 && categories.map(category => ({
		label: category?.node?.name,
		value: category?.node?.name
	}));
	const [selectedOptions, setSelectedOptions] = useState<string[]>([]);
	const [options, setOptions] = useState(convertedCategories);
	const updateText = useCallback(
		(value: string) => {
			setNewRule({
				...newRule,
				productCategory: value,
			});
			if (value === '') {
				setOptions(convertedCategories);
				return;
			}
			const filterRegex = new RegExp(value, 'i');
			const resultOptions = Array.isArray(convertedCategories)
				? convertedCategories.filter((option) => option.label.match(filterRegex) !== null)
			: [];
			setOptions(resultOptions);
		},
		[convertedCategories],
	);
	const updateSelection = useCallback(
		(selected: string[]) => {
			const selectedValue = selected.map((selectedItem) => {
			const matchedOption = Array.isArray(options) ? options.find((option) => {
				return option.value.match(selectedItem);
			}) : null;
				return matchedOption && matchedOption.label;
			});
			setSelectedOptions(selected);
			setNewRule({
				...newRule,
				productCategory: selectedValue[0],
			});
		},
		[options],
	);

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
							<Autocomplete
								options={options || []}
								selected={selectedOptions}
								onSelect={updateSelection}
								textField={<Autocomplete.TextField
									onChange={updateText}
									label="Discount by Category"
									value={newRule?.productCategory}
									placeholder="Category"
									autoComplete="off"
								/>}
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
					{newRule.customerType === 'vip' && newRule?.selectedMethod === 'code' && (
							<FormLayout.Group>
								<TextField
									label=""
									autoComplete="off"
									value={newRule?.customerSearch}
									onChange={handleSearchCustomer}
									prefix={<Icon source={SearchIcon} />}
									placeholder='Search Customer'
								/>
								<Button onClick={() => handleOpen('customer', '')} variant="secondary">
									Browse
								</Button>
							</FormLayout.Group>
						)}
					{queryType === 'order' && newRule?.selectedMethod === 'code' && newRule?.customers?.items?.length > 0 && (
						<FormLayout.Group>
							<EditItemsList
								type={'customer'}
								items={newRule?.customers?.items}
								handleCancelCollection={() => ''}
								handleCancelProduct={() => ''}
								handleVariantListOpen={() => ''}
								handleCustomerCancel={handleCustomerCancel}
							/>
						</FormLayout.Group>
					)}
				</FormLayout>
			</BlockStack>
		</Card>
	);
};

export default AdvanceDiscountRules;
