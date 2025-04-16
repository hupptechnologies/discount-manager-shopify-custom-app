import { useState } from 'react';
import { Modal, TitleBar } from '@shopify/app-bridge-react';
import {
	BlockStack,
	Box,
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
import EditItemsList from './EditItemsList';
import EditVariantList from './EditVariantList';
import { useDispatch, useSelector } from 'react-redux';
import { AppDispatch, RootState } from 'app/redux/store';
import { fetchProductVariantsAsync } from 'app/redux/create-discount';
import { getCreateDiscountDetail } from 'app/redux/create-discount/slice';
import type { QueryType } from 'app/routes/app.create-discount';
import type { DiscountRule } from './DiscountRuleForm';

interface DiscountValueProps {
	setNewRule: React.Dispatch<React.SetStateAction<any>>;
	handleSearchChange: React.Dispatch<any>;
	handleOpen: any;
	newRule: DiscountRule;
	queryType: QueryType;
	handleSaveBarOpen: any;
	handleCustomerGetCancelCollection: React.Dispatch<any>;
	handleCustomerGetCancelProduct: React.Dispatch<any>;
}

const DiscountValue: React.FC<DiscountValueProps> = ({
	newRule,
	setNewRule,
	handleOpen,
	handleSearchChange,
	queryType,
	handleSaveBarOpen,
	handleCustomerGetCancelCollection,
	handleCustomerGetCancelProduct
}) => {
	const dispatch = useDispatch<AppDispatch>();
	const { variants, isFetchProductVariants } = useSelector((state: RootState) =>
		getCreateDiscountDetail(state),
	);
	const [selectedVariantId, setSelectedVariantId] = useState<any>([]);
	const [productUrl, setProductUrl] = useState('');
	const [productId, setProductId] = useState('');
	const [productTitle, setProductTitle] = useState('');

	const handleVariantListOpen = (
		id: string,
		variantId: string,
		pTitle: string,
		pUrl: string,
	) => {
		shopify.modal.show('variant-list');
		if (Array.isArray(variantId)) {
			setSelectedVariantId(variantId);
		} else {
			setSelectedVariantId([variantId]);
		}
		setProductId(id);
		setProductUrl(pUrl);
		setProductTitle(pTitle);
		handleFetchProductVariants(id);
	};

	const handleVariantListClose = () => {
		shopify.modal.hide('variant-list');
	};

	const handleFetchProductVariants = (id: string) => {
		dispatch(
			fetchProductVariantsAsync({
				shopName: shopify.config.shop || '',
				id: id,
			}),
		);
	};
	return (
		<>
			<Card>
				<BlockStack>
					<FormLayout>
						<Text variant="headingMd" fontWeight="semibold" as="h6">
							Discount value
						</Text>
						{queryType !== 'shipping' && 
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
									value={newRule?.customerGets?.percentage}
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
						}
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
						{queryType === 'shipping' &&
							<FormLayout.Group>
								<Checkbox
									label="Exclude shipping rates over a certain amount"
									checked={newRule?.isShippingRate}
									onChange={() => {
										handleSaveBarOpen();
										setNewRule({
											...newRule,
											isShippingRate: !newRule.isShippingRate,
										})
									}}
									helpText={
										newRule?.isShippingRate && (
											<Box width="30%">
												<TextField
													label=""
													value={newRule?.shippingRate}
													type="integer"
													onChange={(value) =>
														setNewRule({
															...newRule,
															customerGets: {
																...newRule.customerGets,
																percentage: Number(value),
															},
															shippingRate: value
														})
													}
													prefix='$'
													autoComplete="off"
												/>
											</Box>
										)
									}
								/>
							</FormLayout.Group>
						}
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
						{queryType === 'products' && newRule?.customerGets?.items?.length > 0 && (
							<FormLayout.Group>
								<EditItemsList
									handleCustomerCancel={() => {}}
									handleCancelCollection={handleCustomerGetCancelCollection}
									handleCancelProduct={handleCustomerGetCancelProduct}
									handleVariantListOpen={handleVariantListOpen}
									type={newRule?.getItemFrom}
									items={newRule?.customerGets?.items}
								/>
							</FormLayout.Group>
						)}
					</FormLayout>
				</BlockStack>
			</Card>
			<Modal id="variant-list">
				<EditVariantList
					selectedVariantId={selectedVariantId}
					isFetchProductVariants={isFetchProductVariants}
					variants={variants}
					setNewRule={setNewRule}
					newRule={newRule}
					productUrl={productUrl}
					productTitle={productTitle}
					productId={productId}
				/>
				<TitleBar title="Edit variants">
					<button variant="primary" onClick={handleVariantListClose}>
						Done
					</button>
					<button onClick={handleVariantListClose}>Cancel</button>
				</TitleBar>
			</Modal>
		</>
	);
};
export default DiscountValue;
