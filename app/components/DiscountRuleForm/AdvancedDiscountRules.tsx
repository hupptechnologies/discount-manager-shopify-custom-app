import { useCallback, useState } from 'react';
import { useAppBridge } from '@shopify/app-bridge-react';
import {
	BlockStack,
	Box,
	Card,
	Checkbox,
	Divider,
	FormLayout,
	Icon,
	InlineStack,
	Popover,
	ResourceList,
	Select
} from '@shopify/polaris';
import { SearchIcon, ChevronRightIcon, ArrowLeftIcon } from '@shopify/polaris-icons';
import { useDispatch, useSelector } from 'react-redux';
import { AppDispatch, RootState } from 'app/redux/store';
import { getCreateDiscountDetail } from 'app/redux/create-discount/slice';
import { fetchAllProductCategoryAsync } from 'app/redux/create-discount';
import type { QueryType } from 'app/routes/app.create-discount';
import type { DiscountRule } from './DiscountRuleForm';
import EditItemsList from './EditItemsList';
import PrimaryButton from '../PolarisUI/CustomButton';
import CustomText from '../PolarisUI/CustomText';
import CustomTextField from '../PolarisUI/CustomTextField';

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
	const dispatch = useDispatch<AppDispatch>();
	const shopify = useAppBridge();
	const { categories } = useSelector((state: RootState) => getCreateDiscountDetail(state));
	const convertedCategories = categories?.length > 0 ? categories.map(category => ({
		...category,
		label: category?.node?.name,
		value: category?.node?.name,
	})) : [];
	const [popoverActive, setPopoverActive] = useState(false);
	const [visibleStaffIndex, setVisibleStaffIndex] = useState(5);

	const togglePopoverActive = useCallback(() => {
		appendCategoryClass();
		setPopoverActive((popoverActive) => !popoverActive);
	}, []);

	const handleScrolledToBottom = useCallback(() => {
		const totalIndexes = convertedCategories.length;
		const interval = visibleStaffIndex + 3 < totalIndexes ? 3 : totalIndexes - visibleStaffIndex;
		if (interval > 0) {
			setVisibleStaffIndex(visibleStaffIndex + interval);
		}
	}, [convertedCategories.length, visibleStaffIndex]);

	const handleResourceListItemClick = useCallback((item: any) => {
		if (item?.node?.childrenIds?.length > 0) {
			handleFetchAPI(item?.node?.id);
		}
		setNewRule({
			...newRule,
			productCategory: {
				currentName: item?.node?.fullName,
				prevID: item?.node?.id
			}
		});
	}, []);

	const handlePrevCategoryList = () => {
		if (newRule.productCategory.currentName.includes('>')) {
			const trimCategoryId = (id: string) => id.split('-').length > 1 ? id.split('-').slice(0, -1).join('-') : id;
			const trimmedID = trimCategoryId(newRule.productCategory.prevID);
			const updatedCurrentName = newRule.productCategory.currentName.includes('>') ? newRule.productCategory.currentName.split('>').slice(0, -1).join('>').trim() : '';
			handleFetchAPI(trimmedID);
			setNewRule({
				productCategory: {
					currentName: updatedCurrentName,
					prevID: trimmedID
				}
			});
		} else {
			handleFetchAPI('');
			setNewRule(({
				productCategory: {
					currentName: '',
					prevID: '',
					prevFullName: ''
				}
			}));
		}
	};

	const handleFetchAPI = (childrenOf: string) => {
		dispatch(fetchAllProductCategoryAsync({
			shopName: shopify.config.shop || '',
			childrenOf,
			type: 'category'
		}));
	};

	const appendCategoryClass = () => {
		const portalsContainer = document.getElementById('PolarisPortalsContainer');
		if (portalsContainer) {
			portalsContainer.classList.toggle('category-pane');
		}
	};

	return (
		<Card>
			<BlockStack gap="500">
				<FormLayout>
					<CustomText variant="headingMd" fontWeight="semibold" as="h6">
						Advance discount rules
					</CustomText>
					<FormLayout.Group condensed>
						<CustomTextField
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
							<CustomTextField
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
							<Popover
								sectioned
								active={popoverActive}
								activator={
									<CustomTextField
										label="Discount by Category"
										value={newRule?.productCategory?.currentName}
										placeholder="Category"
										autoComplete="off"
										onFocus={togglePopoverActive}
									/>
								}
								onClose={togglePopoverActive}
								ariaHaspopup={false}
							>
								{newRule?.productCategory?.currentName && 
									<Popover.Pane fixed>
										<Popover.Section>
											<InlineStack align='start' blockAlign='center'>
												<div onClick={handlePrevCategoryList} className='icon-category-back-arrow'>
													<Icon source={ArrowLeftIcon} tone="base" />
												</div>
												<CustomText variant="bodyMd" fontWeight="bold" as="h3">
													{newRule?.productCategory?.currentName}
												</CustomText>
											</InlineStack>
										</Popover.Section>
										<Divider borderWidth='0165' />
									</Popover.Pane>
								}
								<Popover.Pane onScrolledToBottom={handleScrolledToBottom}>
									<ResourceList items={convertedCategories} renderItem={renderItem} />
								</Popover.Pane>
							</Popover>
						)}
						{['order', 'shipping'].includes(queryType as string) && (
							<CustomTextField
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
								<CustomTextField
									label=""
									autoComplete="off"
									value={newRule?.customerSearch}
									onChange={handleSearchCustomer}
									prefix={<Icon source={SearchIcon} />}
									placeholder='Search Customer'
								/>
								<PrimaryButton
									onClick={() => handleOpen('customer', '')}
									variant="secondary"
									children={'Browse'}
								/>
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
	function renderItem(item: any, index: string) {
		return (
			<ResourceList.Item
				id={index}
				onClick={() => handleResourceListItemClick(item)}
			>
				<InlineStack align="space-between" blockAlign="center" gap="200">
					<Box>
						<CustomText variant="bodyMd" as="h3">
							{item?.label}
						</CustomText>
					</Box>
					{item?.node?.childrenIds?.length > 0 && 
						<Box>
							<InlineStack align="center" blockAlign="center" gap="200">
								<Icon source={ChevronRightIcon} tone="base" />
							</InlineStack>
						</Box>
					}
				</InlineStack>
			</ResourceList.Item>
		);
	};
};


export default AdvanceDiscountRules;
