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
import EditItemsList from './EditItemsList';
import type { QueryType } from 'app/routes/app.create-discount';
import type { DiscountRule } from './DiscountRuleForm';

interface DiscountValueProps {
	setNewRule: React.Dispatch<React.SetStateAction<any>>;
	handleSearchChange: React.Dispatch<any>;
	handleOpen: any;
	newRule: DiscountRule;
	queryType: QueryType;
	handleSaveBarOpen: any;
}

const DiscountValue: React.FC<DiscountValueProps> = ({
	newRule,
	setNewRule,
	handleOpen,
	handleSearchChange,
	queryType,
	handleSaveBarOpen,
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
								setNewRule({
									...newRule,
									customerGets: {
										...newRule.customerGets,
										percentage: Number(value),
									},
								});
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
								value={newRule.getItemFrom}
								onChange={(value) =>
									setNewRule((prevState: any) => {
										if (
											prevState.getItemFrom === 'collection' &&
											value === 'product'
										) {
											return {
												...prevState,
												getItemFrom: value as 'collection' | 'product',
												searchTwo: '',
												customerGets: {
													...prevState.customerGets,
													items: [],
													removeCollectionIDs: [
														...prevState.customerGets.collectionIDs,
													],
													collectionIDs: [],
												},
											};
										}
										return {
											...prevState,
											getItemFrom: value as 'collection' | 'product',
											searchTwo: '',
											customerGets: { ...prevState.customerGets, items: [] },
										};
									})
								}
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
								placeholder={`Search ${newRule.getItemFrom === 'collection' ? 'collection' : 'product'}`}
							/>
							<Button
								onClick={() => handleOpen('none', newRule.getItemFrom)}
								variant="secondary"
							>
								Browse
							</Button>
						</FormLayout.Group>
					)}
					{queryType === 'products' &&
						newRule?.customerGets?.items?.length > 0 && (
							<FormLayout.Group>
								<EditItemsList
									handleCancelProduct={() => {}}
									handleVariantListOpen={() => {}}
									type={newRule?.getItemFrom}
									items={newRule?.customerGets?.items}
								/>
							</FormLayout.Group>
						)}
				</FormLayout>
			</BlockStack>
		</Card>
	);
};
export default DiscountValue;
