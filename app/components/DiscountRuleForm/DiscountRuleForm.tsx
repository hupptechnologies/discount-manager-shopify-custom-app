import { useCallback, useEffect, useState } from 'react';
import { useNavigate } from '@remix-run/react';
import {
	Modal,
	SaveBar,
	TitleBar,
	useAppBridge,
} from '@shopify/app-bridge-react';
import { Layout } from '@shopify/polaris';
import pkg from 'lodash';
import { useDispatch, useSelector } from 'react-redux';
import {
	createBuyXGetYDiscountCodeAsync,
	createDiscountCodeAsync,
	updateBuyXGetYDiscountCodeAsync,
	updateDiscountCodeAsync,
} from 'app/redux/discount';
import type { AppDispatch, RootState } from 'app/redux/store';
import {
	getAllDiscountCodeDetail,
	type ItemsList,
} from 'app/redux/discount/slice';
import type { QueryType } from 'app/routes/app.create-discount';
import AdvanceDiscountRules from './AdvancedDiscountRules';
import DiscountCodeGen from './DiscountCodeGen';
import DiscountValue from './DiscountValue';
import ActiveDates from './ActiveDates';
import Summary from './Summary';
import CollectionList from './CollectionList';
import ProductsList from './ProductsList';
import DiscountBuyXGetY from './DiscountBuyXGetY';
import UsageLimit from './UsageLimit';
import Placeholder from '../Placeholder';
import { convertToLocalTime, formatDateWithTimeZone } from 'app/utils/json';

export interface DiscountRule {
	selectedDiscountType: string | null;
	selectedMethod: string;
	title: string;
	noOfCodeCount: string;
	codeLength: string;
	checkoutDiscountCode: string;
	condition: string;
	discount: string;
	advanceDiscountType: 'stackable' | 'exclusive';
	quantity: string;
	productCategory: string;
	region: string;
	searchOne: string;
	searchTwo: string;
	customerType: 'all' | 'vip' | 'first-time';
	discountType: 'per' | 'fixed';
	purchaseType: 'one-time' | 'subscription' | 'both';
	isStockBased: boolean;
	isAI: boolean;
	isEndDate: boolean;
	isCustom: boolean;
	isRandom: boolean;
	isMinQuantityItem: boolean;
	isMinPurchaseAmount: boolean;
	isPercentage: boolean;
	isAmountOfEach: boolean;
	isFree: boolean;
	selectedStartDates: {
		start: object | null;
		end: object | null;
	};
	selectedEndDates: {
		start: object | null;
		end: object | null;
	};
	selectedStartTime: string;
	selectedEndTime: string;
	buyItemFrom: string;
	getItemFrom: string;
	searchType: string;
	totalUsageLimit: boolean;
	onePerCustomer: boolean;
	totalLimitValue: string;
	dicountCodePrefix: string;
	customerBuys: {
		quantity: string;
		items: ItemsList[] | any;
		collectionIDs: string[];
		productIDs: string[];
		removeCollectionIDs: string[];
		removeProductIDs: string[];
	};
	customerGets: {
		quantity: string;
		percentage: string;
		items: ItemsList[] | any;
		collectionIDs: string[];
		productIDs: string[];
		removeCollectionIDs: string[];
		removeProductIDs: string[];
	};
}

interface DiscountRuleFormProps {
	queryType: QueryType;
}

export const DiscountRuleForm: React.FC<DiscountRuleFormProps> = ({
	queryType,
}) => {
	const { debounce } = pkg;
	const shopify = useAppBridge();
	const dispatch = useDispatch<AppDispatch>();
	const {
		getDiscountCode,
		discountScope,
		updateDiscountCodeId,
		advancedRule,
		method,
	} = useSelector((state: RootState) => getAllDiscountCodeDetail(state));
	const navigate = useNavigate();
	const [activeButtonIndex, setActiveButtonIndex] = useState(0);
	const [rules, setRules] = useState<DiscountRule[]>([]);
	const [selected, setSelected] = useState<number>(0);
	const [run, setRun] = useState<boolean>(false);
	const [isEdit, setIsEdit] = useState<boolean>(false);
	const [newRule, setNewRule] = useState<DiscountRule>({
		selectedDiscountType: queryType,
		selectedMethod: 'code',
		title: '',
		noOfCodeCount: '1',
		codeLength: '2',
		checkoutDiscountCode: '',
		condition: '',
		discount: '',
		advanceDiscountType: 'stackable',
		quantity: '',
		productCategory: '',
		region: '',
		customerType: 'vip',
		isStockBased: false,
		isAI: false,
		isEndDate: false,
		isRandom: false,
		isCustom: true,
		discountType: 'per',
		purchaseType: 'one-time',
		searchOne: '',
		searchTwo: '',
		isMinPurchaseAmount: false,
		isMinQuantityItem: true,
		isPercentage: true,
		isAmountOfEach: false,
		isFree: false,
		selectedStartDates: {
			start: new Date(),
			end: new Date(),
		},
		selectedEndDates: {
			start: new Date(),
			end: new Date(),
		},
		selectedStartTime: '4:30 AM',
		selectedEndTime: '4:30 AM',
		buyItemFrom: 'product',
		getItemFrom: 'product',
		searchType: 'one',
		totalUsageLimit: false,
		onePerCustomer: false,
		totalLimitValue: '',
		dicountCodePrefix: '',
		customerBuys: {
			items: [],
			productIDs: [],
			collectionIDs: [],
			quantity: '0',
			removeCollectionIDs: [],
			removeProductIDs: [],
		},
		customerGets: {
			items: [],
			productIDs: [],
			collectionIDs: [],
			quantity: '0',
			percentage: '0',
			removeCollectionIDs: [],
			removeProductIDs: [],
		},
	});

	useEffect(() => {
		if (getDiscountCode?.length > 0) {
			const ifExist = ['PRODUCT', 'ORDER', 'SHIPPING'].includes(discountScope);
			const isCustomMethod = method === 'custom';
			const productVariantsExistForGet =
				getDiscountCode[0]?.codeDiscount?.customerGets?.items.productVariants
					?.edges?.length > 0 ||
				getDiscountCode[0]?.automaticDiscount?.customerGets?.items
					.productVariants?.edges?.length > 0;
			const productVariantsExistForBuy =
				getDiscountCode[0]?.codeDiscount?.customerBuys?.items.productVariants
					?.edges?.length > 0 ||
				getDiscountCode[0]?.automaticDiscount?.customerBuys?.items
					.productVariants?.edges?.length;
			const items = productVariantsExistForGet
				? (getDiscountCode[0]?.codeDiscount?.customerGets?.items
						?.productVariants?.edges ?? [])
				: (getDiscountCode[0]?.codeDiscount?.customerGets?.items?.collections
						?.edges ?? []);
			const automaticItems = productVariantsExistForGet
				? (getDiscountCode[0]?.automaticDiscount?.customerGets?.items
						?.productVariants?.edges ?? [])
				: (getDiscountCode[0]?.automaticDiscount?.customerGets?.items
						?.collections?.edges ?? []);
			const buyItems = productVariantsExistForBuy
				? (getDiscountCode[0]?.codeDiscount?.customerBuys?.items
						?.productVariants?.edges ?? [])
				: (getDiscountCode[0]?.codeDiscount?.customerBuys?.items?.collections
						?.edges ?? []);
			const automaticBuyItems = productVariantsExistForBuy
				? (getDiscountCode[0]?.automaticDiscount?.customerBuys?.items
						?.productVariants?.edges ?? [])
				: (getDiscountCode[0]?.automaticDiscount?.customerBuys?.items
						?.collections?.edges ?? []);
			const {
				selectedStartDates,
				selectedEndDates,
				selectedEndTime,
				selectedStartTime,
			} = isCustomMethod
				? convertToLocalTime(
						getDiscountCode[0]?.codeDiscount?.startsAt,
						getDiscountCode[0]?.codeDiscount?.endsAt,
					)
				: convertToLocalTime(
						getDiscountCode[0]?.automaticDiscount?.startsAt,
						getDiscountCode[0]?.automaticDiscount?.endsAt,
					);
			const totalLimitValue = ifExist
				? isCustomMethod
					? getDiscountCode[0]?.codeDiscount?.usageLimit
					: getDiscountCode[0]?.automaticDiscount?.usageLimit
				: isCustomMethod
					? getDiscountCode[0]?.codeDiscount?.usesPerOrderLimit
					: getDiscountCode[0]?.automaticDiscount?.usesPerOrderLimit;
			setIsEdit(true);
			setNewRule({
				...newRule,
				getItemFrom: productVariantsExistForGet ? 'product' : 'collection',
				buyItemFrom: productVariantsExistForBuy ? 'product' : 'collection',
				title: isCustomMethod
					? getDiscountCode[0]?.codeDiscount?.title
					: getDiscountCode[0]?.automaticDiscount?.title || '',
				checkoutDiscountCode: isCustomMethod
					? getDiscountCode[0]?.codeDiscount?.codes?.edges[0].node?.code
					: getDiscountCode[0]?.automaticDiscount?.title || '',
				customerGets: {
					...newRule.customerGets,
					percentage: isCustomMethod
						? String(
								Math.round(
									(ifExist
										? getDiscountCode[0]?.codeDiscount?.customerGets?.value
												?.percentage
										: getDiscountCode[0]?.codeDiscount?.customerGets?.value
												?.effect?.percentage) * 100,
								),
							)
						: String(
								Math.round(
									(ifExist
										? getDiscountCode[0]?.automaticDiscount?.customerGets?.value
												?.percentage
										: getDiscountCode[0]?.automaticDiscount?.customerGets?.value
												?.effect?.percentage) * 100,
								),
							),
					quantity: isCustomMethod
						? getDiscountCode[0]?.codeDiscount?.customerGets?.value?.quantity
								?.quantity
						: getDiscountCode[0]?.automaticDiscount?.customerGets?.value
								?.quantity?.quantity,
					items: isCustomMethod ? items : automaticItems,
					productIDs: productVariantsExistForGet
						? isCustomMethod
							? items.map((item) => item.node.id)
							: automaticItems.map((item) => item.node.id)
						: [],
					collectionIDs: !productVariantsExistForGet
						? isCustomMethod
							? items.map((item) => item.node.id)
							: automaticItems.map((item) => item.node.id)
						: [],
				},
				customerBuys: {
					...newRule.customerBuys,
					quantity: isCustomMethod
						? getDiscountCode[0]?.codeDiscount?.customerBuys?.value?.quantity
						: getDiscountCode[0]?.automaticDiscount?.customerBuys?.value
								?.quantity,
					items: isCustomMethod ? buyItems : automaticBuyItems,
					productIDs: productVariantsExistForBuy
						? isCustomMethod
							? buyItems.map((item) => item.node.id)
							: automaticBuyItems.map((item) => item.node.id)
						: [],
					collectionIDs: !productVariantsExistForBuy
						? isCustomMethod
							? buyItems.map((item) => item.node.id)
							: automaticBuyItems.map((item) => item.node.id)
						: [],
				},
				totalUsageLimit: Number(totalLimitValue) > 0 ? true : false,
				totalLimitValue: totalLimitValue,
				onePerCustomer:
					getDiscountCode[0]?.codeDiscount?.appliesOncePerCustomer,
				selectedStartDates: selectedStartDates,
				selectedEndDates: selectedEndDates,
				selectedEndTime: selectedEndTime,
				selectedStartTime: selectedStartTime,
				quantity: advancedRule?.quantity ?? '',
				advanceDiscountType: advancedRule?.advanceDiscountType ?? 'exclusive',
				region: advancedRule?.region ?? '',
				condition: advancedRule?.condition ?? '',
				customerType: advancedRule?.customerType ?? 'all',
				productCategory: advancedRule?.productCategory ?? '',
				isAI: advancedRule?.isAI ?? false,
				isStockBased: advancedRule?.isStockBased ?? false,
				selectedMethod: isCustomMethod ? 'code' : 'automatic',
			});
		}
	}, [getDiscountCode, discountScope, advancedRule, run]);

	const handleSearchTypeChange = (type: string) => {
		setNewRule((prev) => ({ ...prev, searchType: type }));
	};

	const handleButtonClick = useCallback(
		(index: number) => {
			if (activeButtonIndex === index) {
				return;
			}
			setNewRule({
				...newRule,
				selectedMethod: index === 0 ? 'code' : 'automatic',
			});
			setActiveButtonIndex(index);
		},
		[activeButtonIndex],
	);

	const debouncedHandleOpen = useCallback(
		debounce(() => {
			handleOpen('', '');
		}, 500),
		[],
	);

	const handleSearchOneChange = (value: string) => {
		handleSearchTypeChange('one');
		setNewRule((prev) => ({ ...prev, searchOne: value }));
		setSelected(1);
		debouncedHandleOpen();
	};

	const handleSearchTwoChange = (value: string) => {
		handleSearchTypeChange('two');
		setNewRule((prev) => ({ ...prev, searchTwo: value }));
		setSelected(0);
		debouncedHandleOpen();
	};

	const handleAddRule = () => {
		setRules([...rules, newRule]);
		setNewRule({
			selectedDiscountType: queryType,
			selectedMethod: 'code',
			title: '',
			noOfCodeCount: '1',
			codeLength: '2',
			checkoutDiscountCode: '',
			condition: '',
			discount: '',
			advanceDiscountType: 'stackable',
			quantity: '',
			productCategory: '',
			region: '',
			customerType: 'vip',
			isStockBased: false,
			isAI: false,
			isEndDate: false,
			isRandom: false,
			isCustom: true,
			discountType: 'per',
			purchaseType: 'one-time',
			searchOne: '',
			searchTwo: '',
			isMinPurchaseAmount: false,
			isMinQuantityItem: false,
			isPercentage: true,
			isAmountOfEach: false,
			isFree: false,
			selectedStartDates: {
				start: new Date(),
				end: new Date(),
			},
			selectedEndDates: {
				start: new Date(),
				end: new Date(),
			},
			selectedStartTime: '4:30 AM',
			selectedEndTime: '4:30 AM',
			buyItemFrom: 'product',
			getItemFrom: 'product',
			searchType: 'one',
			totalUsageLimit: false,
			onePerCustomer: false,
			totalLimitValue: '',
			dicountCodePrefix: '',
			customerBuys: {
				items: [],
				productIDs: [],
				collectionIDs: [],
				quantity: '0',
				removeCollectionIDs: [],
				removeProductIDs: [],
			},
			customerGets: {
				items: [],
				productIDs: [],
				collectionIDs: [],
				quantity: '0',
				percentage: '',
				removeCollectionIDs: [],
				removeProductIDs: [],
			},
		});
		setIsEdit(false);
	};

	const handleOpen = (type: string | null, value: string) => {
		if (type === 'buy') {
			setSelected(1);
			setNewRule({ ...newRule, buyItemFrom: value });
		}
		if (type === 'get') {
			setSelected(0);
			setNewRule({ ...newRule, getItemFrom: value });
		}
		shopify.modal.show('product-collection-modal');
	};

	const handleClose = () => {
		shopify.modal.hide('product-collection-modal');
	};

	const handleSaveBarOpen = () => {
		shopify.saveBar.show('save-bar');
	};

	const handleSave = () => {
		if (isEdit) {
			return handleUpdate();
		}
		handleSubmit();
	};

	const handleDiscard = () => {
		if (isEdit) {
			setRun(!run);
		}
		handleAddRule();
		shopify.saveBar.hide('save-bar');
	};

	const handleSubmit = () => {
		const advancedRule = {
			quantity: newRule?.quantity,
			advanceDiscountType: newRule?.advanceDiscountType,
			region: newRule?.region,
			condition: newRule?.condition,
			customerType: newRule?.customerType,
			productCategory: newRule?.productCategory,
			isAI: newRule?.isAI,
			isStockBased: newRule?.isStockBased,
		};
		if (queryType === 'buyXgetY') {
			dispatch(
				createBuyXGetYDiscountCodeAsync({
					shopName: shopify.config.shop || '',
					data: {
						title: newRule?.title,
						code: newRule?.checkoutDiscountCode,
						startsAt: formatDateWithTimeZone(
							newRule?.selectedStartDates?.start,
							newRule?.selectedStartTime,
						),
						endsAt: formatDateWithTimeZone(
							newRule?.selectedEndDates?.start,
							newRule?.selectedEndTime,
						),
						usageLimit: Number(newRule?.totalLimitValue),
						customerBuys: newRule.customerBuys,
						customerGets: newRule.customerGets,
						advancedRule,
					},
					type: queryType,
					method: newRule?.selectedMethod === 'code' ? 'custom' : 'auto',
					callback () {
						handleAddRule();
						shopify.saveBar.hide('save-bar');
						navigate('/app/manage-discount');
					},
				}),
			);
			return;
		}
		dispatch(
			createDiscountCodeAsync({
				shopName: shopify.config.shop || '',
				data: {
					title: newRule?.title,
					code: newRule?.checkoutDiscountCode,
					startsAt: formatDateWithTimeZone(
						newRule?.selectedStartDates?.start,
						newRule?.selectedStartTime,
					),
					endsAt: formatDateWithTimeZone(
						newRule?.selectedEndDates?.start,
						newRule?.selectedEndTime,
					),
					customerGets: newRule.customerGets,
					usageLimit: Number(newRule?.totalLimitValue),
					appliesOncePerCustomer: newRule?.onePerCustomer,
					advancedRule,
				},
				type: queryType,
				method: newRule?.selectedMethod === 'code' ? 'custom' : 'auto',
				callback () {
					handleAddRule();
					shopify.saveBar.hide('save-bar');
					navigate('/app/manage-discount');
				},
			}),
		);
	};

	const handleUpdate = () => {
		const advancedRule = {
			quantity: newRule?.quantity,
			advanceDiscountType: newRule?.advanceDiscountType,
			region: newRule?.region,
			condition: newRule?.condition,
			customerType: newRule?.customerType,
			productCategory: newRule?.productCategory,
			isAI: newRule?.isAI,
			isStockBased: newRule?.isStockBased,
		};
		if (newRule?.customerGets?.items?.length > 0) {
			delete newRule.customerGets.items;
		}
		if (newRule?.customerBuys?.items?.length > 0) {
			delete newRule.customerBuys.items;
		}
		if (queryType === 'buyXgetY') {
			dispatch(
				updateBuyXGetYDiscountCodeAsync({
					shopName: shopify.config.shop || '',
					data: {
						title: newRule?.title,
						code: newRule?.checkoutDiscountCode,
						startsAt: formatDateWithTimeZone(
							newRule?.selectedStartDates?.start,
							newRule?.selectedStartTime,
						),
						endsAt: formatDateWithTimeZone(
							newRule?.selectedEndDates?.start,
							newRule?.selectedEndTime,
						),
						usageLimit: Number(newRule?.totalLimitValue),
						customerBuys: newRule.customerBuys,
						customerGets: newRule.customerGets,
						advancedRule,
					},
					type: queryType,
					id: updateDiscountCodeId,
					callback () {
						handleAddRule();
						shopify.saveBar.hide('save-bar');
						navigate('/app/manage-discount');
					},
				}),
			);
			return;
		}
		dispatch(
			updateDiscountCodeAsync({
				shopName: shopify.config.shop || '',
				data: {
					title: newRule?.title,
					code: newRule?.checkoutDiscountCode,
					startsAt: formatDateWithTimeZone(
						newRule?.selectedStartDates?.start,
						newRule?.selectedStartTime,
					),
					endsAt: formatDateWithTimeZone(
						newRule?.selectedEndDates?.start,
						newRule?.selectedEndTime,
					),
					usageLimit: Number(newRule?.totalLimitValue),
					customerGets: newRule.customerGets,
					appliesOncePerCustomer: newRule?.onePerCustomer,
					advancedRule,
				},
				type: queryType,
				id: updateDiscountCodeId,
				callback () {
					handleAddRule();
					shopify.saveBar.hide('save-bar');
					navigate('/app/manage-discount');
				},
			}),
		);
	};

	const handleCustomerGetCancelProduct = (productIds: string[]) => {
		setNewRule((prevState) => {
			const updatedItems = prevState.customerGets.items.filter(
				(item: any) => !productIds.includes(item.node.id)
			);

			const updatedProductIDs = prevState.customerGets.productIDs.filter(
				(id) => !productIds.includes(id)
			);

			const newRemoveProductIDs = productIds.filter(
				(productId) => !prevState.customerGets.removeProductIDs.includes(productId)
			);

			if (newRemoveProductIDs.length > 0) {
				return {
					...prevState,
					customerGets: {
						...prevState.customerGets,
						productIDs: updatedProductIDs,
						items: updatedItems,
						removeProductIDs: [
							...prevState.customerGets.removeProductIDs,
							...newRemoveProductIDs,
						],
					},
				};
			}
			return prevState;
		});
	};

	const handleCustomerBuyCancelProduct = (productIds: string[]) => {
		setNewRule((prevState) => {
			const updatedItems = prevState.customerBuys.items.filter(
				(item: any) => !productIds.includes(item.node.id)
			);

			const updatedProductIDs = prevState.customerBuys.productIDs.filter(
				(id) => !productIds.includes(id)
			);

			const newRemoveProductIDs = productIds.filter(
				(productId) => !prevState.customerBuys.removeProductIDs.includes(productId)
			);

			if (newRemoveProductIDs.length > 0) {
				return {
					...prevState,
					customerBuys: {
						...prevState.customerBuys,
						productIDs: updatedProductIDs,
						items: updatedItems,
						removeProductIDs: [
							...prevState.customerBuys.removeProductIDs,
							...newRemoveProductIDs,
						],
					},
				};
			}

			return prevState;
		});
	};

	const handleCustomerGetCancelCollection = (collectionId: string) => {
		setNewRule((prevState) => {
		  const updatedCollectionIDs = prevState.customerGets.collectionIDs.filter(
			(id) => id !== collectionId
		  );
	  
		  const updatedItems = prevState.customerGets.items.filter(
			(item: any) => item.node?.id !== collectionId
		  );
	  
		  const newRemoveCollectionIDs = prevState.customerGets.removeCollectionIDs.includes(collectionId)
			? []
			: [collectionId];
	  
		  if (newRemoveCollectionIDs.length > 0) {
			return {
			  ...prevState,
			  customerGets: {
				...prevState.customerGets,
				collectionIDs: updatedCollectionIDs,
				items: updatedItems,
				removeCollectionIDs: [
				  ...prevState.customerGets.removeCollectionIDs,
				  ...newRemoveCollectionIDs,
				],
			  },
			};
		  }
	  
		  return prevState;
		});
	};

	const handleCustomerBuyCancelCollection = (collectionId: string) => {
		setNewRule((prevState) => {
			const updatedCollectionIDs = prevState.customerBuys.collectionIDs.filter(
				(id) => id !== collectionId
			);
			const updatedItems = prevState.customerBuys.items.filter(
				(item: any) => item.node?.id !== collectionId
			);
			const newRemoveCollectionIDs = prevState.customerBuys.removeCollectionIDs.includes(collectionId)
				? []
				: [collectionId];
	  
			if (newRemoveCollectionIDs.length > 0) {
				return {
					...prevState,
					customerBuys: {
						...prevState.customerBuys,
						collectionIDs: updatedCollectionIDs,
						items: updatedItems,
						removeCollectionIDs: [
						...prevState.customerBuys.removeCollectionIDs,
						...newRemoveCollectionIDs,
						],
					},
				};
			}
		  	return prevState;
		});
	};

	return (
		<Layout>
			<Layout.Section>
				<DiscountCodeGen
					heading={
						['buyXgetY'].includes(queryType as string)
							? 'Buy X Get Y'
							: ['shipping'].includes(queryType as string)
								? 'Free shipping'
								: `Amount off ${['products'].includes(queryType as string) ? 'products' : 'orders'}`
					}
					newRule={newRule}
					setNewRule={setNewRule}
					activeButtonIndex={activeButtonIndex}
					handleButtonClick={handleButtonClick}
					queryType={queryType}
					handleSaveBarOpen={handleSaveBarOpen}
					isEdit={isEdit}
				/>
				<Placeholder height="5px" />
				{['buyXgetY'].includes(queryType as string) ? (
					<DiscountBuyXGetY
						handleOpen={handleOpen}
						newRule={newRule}
						setNewRule={setNewRule}
						handleSearchOneChange={handleSearchOneChange}
						handleSearchTwoChange={handleSearchTwoChange}
						queryType={queryType}
						handleCustomerGetCancelProduct={handleCustomerGetCancelProduct}
						handleCustomerBuyCancelProduct={handleCustomerBuyCancelProduct}
						handleCustomerBuyCancelCollection={handleCustomerBuyCancelCollection}
						handleCustomerGetCancelCollection={handleCustomerGetCancelCollection}
					/>
				) : (
					<DiscountValue
						handleOpen={handleOpen}
						newRule={newRule}
						setNewRule={setNewRule}
						handleSearchChange={handleSearchOneChange}
						queryType={queryType}
						handleSaveBarOpen={handleSaveBarOpen}
						handleCustomerGetCancelCollection={handleCustomerGetCancelCollection}
						handleCustomerGetCancelProduct={handleCustomerGetCancelProduct}
					/>
				)}
				<Placeholder height="5px" />
				<AdvanceDiscountRules
					queryType={queryType}
					newRule={newRule}
					setNewRule={setNewRule}
					handleSaveBarOpen={handleSaveBarOpen}
				/>
				<Placeholder height="5px" />
				<UsageLimit newRule={newRule} setNewRule={setNewRule} />
				<Placeholder height="5px" />
				<ActiveDates newRule={newRule} setNewRule={setNewRule} />
			</Layout.Section>
			<Layout.Section variant="oneThird">
				<Summary newRule={newRule} queryType={queryType} />
			</Layout.Section>
			{(queryType === 'buyXgetY' || queryType === 'products') && <Modal id="product-collection-modal">
				{newRule?.buyItemFrom === 'collection' && selected === 1 && (
					<CollectionList
						selectedItemsArray={newRule?.customerBuys?.collectionIDs}
						selected={selected}
						newRule={newRule}
						setNewRule={setNewRule}
					/>
				)}
				{newRule?.buyItemFrom === 'product' && selected === 1 && (
					<ProductsList
						selected={selected}
						newRule={newRule}
						setNewRule={setNewRule}
					/>
				)}
				{newRule?.getItemFrom === 'collection' && selected === 0 && (
					<CollectionList
						selectedItemsArray={newRule?.customerGets?.collectionIDs}
						selected={selected}
						newRule={newRule}
						setNewRule={setNewRule}
					/>
				)}
				{newRule?.getItemFrom === 'product' && selected === 0 && (
					<ProductsList
						selected={selected}
						newRule={newRule}
						setNewRule={setNewRule}
					/>
				)}
				<TitleBar
					title={`Add ${queryType === 'buyXgetY' ? ['product'].includes(newRule?.buyItemFrom || newRule?.getItemFrom) : 'collections'}`}
				>
					<button variant="primary" onClick={handleClose}>
						Add
					</button>
					<button onClick={handleClose}>Cancel</button>
				</TitleBar>
			</Modal>}
			<SaveBar id="save-bar">
				<button variant="primary" onClick={handleSave}></button>
				<button onClick={handleDiscard}></button>
			</SaveBar>
		</Layout>
	);
};
