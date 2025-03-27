import {
	BlockStack,
	Button,
	Card,
	FormLayout,
	Icon,
	Select,
	Text,
	TextField,
} from '@shopify/polaris';
import { SearchIcon } from '@shopify/polaris-icons';
import type { ItemsList } from 'app/redux/discount/slice';
import EditItemsList from './EditItemsList';
import { QueryType } from 'app/routes/app.create-discount';
import { DiscountRule } from './DiscountRuleForm';

export interface EditObj {
	type: 'product' | 'collection';
	isEdit: boolean;
	items: ItemsList[];
};

interface DiscountValueProps {
	setNewRule: React.Dispatch<React.SetStateAction<any>>;
	handleSearchChange: React.Dispatch<any>;
	handleOpen: any;
	newRule: DiscountRule;
	editObj: EditObj;
	queryType: QueryType;
	handleSaveBarOpen: any;
};

const DiscountValue: React.FC<DiscountValueProps> = ({
	editObj,
	newRule,
	setNewRule,
	handleOpen,
	handleSearchChange,
	queryType,
	handleSaveBarOpen
}) => {
	return (
		<Card>
			<BlockStack>
				<FormLayout>
					<Text variant="headingMd" fontWeight="semibold" as="h6">
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
							onChange={(value) => {
								handleSaveBarOpen();
								setNewRule({
									...newRule,
									discountType: value as 'per' | 'fixed',
								});
							}}
						/>
						<TextField
							label=""
							value={newRule.customerGets.percentage}
							onChange={(value) => {
								handleSaveBarOpen();
								setNewRule({ ...newRule,  customerGets: { ...newRule.customerGets, percentage: Number(value) }});
							}}
							autoComplete="off"
							prefix={newRule.discountType === 'fixed' ? '$' : ''}
							suffix={newRule.discountType === 'per' ? '%' : ''}
							placeholder="10"
						/>
					</FormLayout.Group>
					<FormLayout.Group condensed>
						{queryType === 'products' && (
							<Select
								label="Applies to"
								options={[
									{ label: 'Specific collections', value: 'collection' },
									{ label: 'Specific products', value: 'product' },
								]}
								value={newRule.appliesTo}
								onChange={(value) => {
									handleSaveBarOpen();
									setNewRule({
										...newRule,
										appliesTo: value as 'collection' | 'product',
										searchOne: '',
									});
								}}
							/>
						)}
						<Select
							label="Purchase type"
							options={[
								{ label: 'One-time purchase', value: 'one-time' },
								{ label: 'Subscription', value: 'subscription' },
								{ label: 'Both', value: 'both' },
							]}
							value={newRule.purchaseType}
							onChange={(value) => {
								handleSaveBarOpen();
								setNewRule({
									...newRule,
									purchaseType: value as 'one-time' | 'subscription',
								});
							}}
						/>
					</FormLayout.Group>
					{queryType === 'products' && (
						<FormLayout.Group>
							<TextField
								label=""
								value={newRule.searchOne}
								onChange={handleSearchChange}
								autoComplete="off"
								prefix={<Icon source={SearchIcon} />}
								placeholder={`Search ${newRule.appliesTo === 'collection' ? 'collection' : 'product'}`}
							/>
							<Button
								onClick={() => handleOpen('none', newRule.appliesTo)}
								variant="secondary"
							>
								Browse
							</Button>
						</FormLayout.Group>
					)}
					{editObj?.isEdit && queryType === 'products' && newRule?.customerGets?.items?.length > 0 && (
						<FormLayout.Group>
							<EditItemsList type={editObj.type} items={newRule?.customerGets?.items} />
						</FormLayout.Group>
					)}
				</FormLayout>
			</BlockStack>
		</Card>
	);
};
export default DiscountValue;
