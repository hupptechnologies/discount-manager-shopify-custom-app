import { useCallback, useState } from 'react';
import { Modal, SaveBar, TitleBar, useAppBridge } from '@shopify/app-bridge-react';
import { Layout } from '@shopify/polaris';
import pkg from 'lodash';
import { useDispatch } from 'react-redux';
import { createDiscountCodeAsync } from 'app/redux/discount';
import { AppDispatch } from 'app/redux/store';
import { useNavigate } from '@remix-run/react';
import AdvanceDiscountRules from './AdvancedDiscountRules';
import DiscountCodeGen from './DiscountCodeGen';
import DiscountValue from './DiscountValue';
import ActiveDates from './ActiveDates';
import Summary from './Summary';
import CollectionList from './CollectionList';
import ProductsList from './ProductsList';
import DiscountBuyXGetY from './DiscountBuyXGetY';
import UsageLimit from './UsageLimit';
import { getYearMonthDay } from 'app/utils/json';

interface DiscountRule {
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
	appliesTo: 'collection' | 'product';
	purchaseType: 'one-time' | 'subscription' | 'both';
	isStockBased: boolean;
	isAI: boolean;
	isEndDate: boolean;
	isCustom: boolean;
	isRandom: boolean;
	isMinQuantityItem: boolean;
	isMinPurchaseAmount: boolean;
	minBuyQuantity: string;
	minGetQuantity: string;
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
}

type DiscountRuleFormProps = {
	queryType: 'order' | 'products' | 'shipping' | 'buyXgetY' | null;
};

export const DiscountRuleForm: React.FC<DiscountRuleFormProps> = ({
	queryType,
}) => {
	const { debounce } = pkg;
	const shopify = useAppBridge();
	const dispatch = useDispatch<AppDispatch>();
	const navigate = useNavigate();
	const [activeButtonIndex, setActiveButtonIndex] = useState(0);
	const [rules, setRules] = useState<DiscountRule[]>([]);
	const [selected, setSelected] = useState<number>(0);
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
		appliesTo: 'collection',
		purchaseType: 'one-time',
		searchOne: '',
		searchTwo: '',
		isMinPurchaseAmount: false,
		isMinQuantityItem: true,
		minBuyQuantity: '',
		minGetQuantity: '',
		isPercentage: true,
		isAmountOfEach: false,
		isFree: false,
		selectedStartDates: {
			start: new Date('Wed Feb 07 2018 00:00:00 GMT-0500 (EST)'),
			end: new Date('Wed Feb 07 2018 00:00:00 GMT-0500 (EST)'),
		},
		selectedEndDates: {
			start: new Date('Wed Feb 07 2018 00:00:00 GMT-0500 (EST)'),
			end: new Date('Wed Feb 07 2018 00:00:00 GMT-0500 (EST)'),
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
	});

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
		setSelected(2);
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
			isCustom: false,
			discountType: 'per',
			appliesTo: 'collection',
			purchaseType: 'one-time',
			searchOne: '',
			searchTwo: '',
			isMinPurchaseAmount: false,
			isMinQuantityItem: false,
			minBuyQuantity: '',
			minGetQuantity: '',
			isPercentage: true,
			isAmountOfEach: false,
			isFree: false,
			selectedStartDates: {
				start: new Date('Wed Feb 07 2018 00:00:00 GMT-0500 (EST)'),
				end: new Date('Wed Feb 07 2018 00:00:00 GMT-0500 (EST)'),
			},
			selectedEndDates: {
				start: new Date('Wed Feb 07 2018 00:00:00 GMT-0500 (EST)'),
				end: new Date('Wed Feb 07 2018 00:00:00 GMT-0500 (EST)'),
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
		});
	};

	const handleOpen = (type: string | null, value: string) => {
		if (type === 'buy') {
			setSelected(1);
			setNewRule({ ...newRule, buyItemFrom: value });
		}
		if (type === 'get') {
			setSelected(2);
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
		handleSubmit();
	};
	
	const handleDiscard = () => {
		shopify.saveBar.hide('save-bar');
	};
	
	const handleSubmit = () => {
		dispatch(createDiscountCodeAsync({
			shopName: shopify.config.shop || '',
			data: {
				title: newRule?.title,
				code: newRule?.checkoutDiscountCode,
				percentage: Number(newRule?.discount),
				startsAt: getYearMonthDay(newRule?.selectedStartDates?.start),
				endsAt: getYearMonthDay(newRule?.selectedEndDates?.start),
				collectionIDs: [],
				productIDs: ["gid://shopify/ProductVariant/45807212593393"],
				usageLimit: Number(newRule?.totalLimitValue),
				appliesOncePerCustomer: newRule?.onePerCustomer,
			},
			callback(success) {
				if (success) {
					handleAddRule();
					shopify.saveBar.hide('save-bar');
					navigate('/app/manage-discount');
				}
			},
		}))
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
				/>
				<br />
				{['buyXgetY'].includes(queryType as string) ? (
					<DiscountBuyXGetY
						handleOpen={handleOpen}
						newRule={newRule}
						setNewRule={setNewRule}
						handleSearchOneChange={handleSearchOneChange}
						handleSearchTwoChange={handleSearchTwoChange}
					/>
				) : (
					<DiscountValue
						handleOpen={handleOpen}
						newRule={newRule}
						setNewRule={setNewRule}
						handleSearchChange={handleSearchOneChange}
					/>
				)}
				<br />
				<AdvanceDiscountRules
					queryType={queryType}
					newRule={newRule}
					setNewRule={setNewRule}
				/>
				<br />
				<UsageLimit newRule={newRule} setNewRule={setNewRule} />
				<br />
				<ActiveDates newRule={newRule} setNewRule={setNewRule} />
			</Layout.Section>
			<Layout.Section variant="oneThird">
				<Summary />
			</Layout.Section>
			<Modal id="product-collection-modal">
				{(newRule?.buyItemFrom === 'collection' && selected === 1) && (
					<CollectionList newRule={newRule} setNewRule={setNewRule} />
				)}
				{(newRule?.buyItemFrom === 'product' && selected === 1) && (
					<ProductsList newRule={newRule} setNewRule={setNewRule} />
				)}
				{(newRule?.getItemFrom === 'collection' && selected === 2) && (
					<CollectionList newRule={newRule} setNewRule={setNewRule} />
				)}
				{(newRule?.getItemFrom === 'product' && selected === 2) && (
					<ProductsList newRule={newRule} setNewRule={setNewRule} />
				)}
				{(newRule?.appliesTo === 'collection' && selected === 0) && (
					<CollectionList newRule={newRule} setNewRule={setNewRule} />
				)}
				{(newRule?.appliesTo === 'product' && selected === 0) && (
					<ProductsList newRule={newRule} setNewRule={setNewRule} />
				)}
				<TitleBar
					title={`Add ${(queryType === 'buyXgetY' ? ['product'].includes(newRule?.buyItemFrom || newRule?.getItemFrom) : newRule?.appliesTo === 'product') ? 'products' : 'collections'}`}
				>
					<button variant="primary">Add</button>
					<button onClick={handleClose}>Cancel</button>
				</TitleBar>
			</Modal>
			<SaveBar id="save-bar">
				<button variant="primary" onClick={handleSave}></button>
				<button onClick={handleDiscard}></button>
			</SaveBar>
		</Layout>
	);
};
