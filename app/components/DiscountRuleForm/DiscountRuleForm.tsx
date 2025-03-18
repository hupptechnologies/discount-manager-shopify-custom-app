import { useCallback, useState } from 'react';
import { Modal, TitleBar, useAppBridge } from '@shopify/app-bridge-react';
import { Layout } from '@shopify/polaris';
import pkg from 'lodash';
import AdvanceDiscountRules from './AdvancedDiscountRules';
import DiscountCodeGen from './DiscountCodeGen';
import DiscountValue from './DiscountValue';
import ActiveDates from './ActiveDates';
import Summary from './Summary';
import CollectionList from './CollectionList';
import ProductsList from './ProductsList';
import DiscountBuyXGetY from './DiscountBuyXGetY';
import UsageLimit from './UsageLimit';

interface DiscountRule {
	selectedDiscountType: string | null;
	selectedMethod: string,
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
	minBuyQuantity: string,
	minGetQuantity: string,
	isPercentage: boolean;
	isAmountOfEach: boolean;
	isFree: boolean;
	selectedStartDates: {
		start: object | null;
		end: object | null;
	},
	selectedEndDates: {
		start: object | null;
		end: object | null;
	},
	selectedStartTime: string;
	selectedEndTime: string;
	buyItemFrom: string;
	getItemFrom: string;
	searchType: string;
	totalUsageLimit: boolean,
	onePerCustomer: boolean
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
	const [activeButtonIndex, setActiveButtonIndex] = useState(0);
	const [rules, setRules] = useState<DiscountRule[]>([]);
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
		dicountCodePrefix: ''
	});

	const handleSearchTypeChange = (type: string) => {
		setNewRule((prev) => ({ ...prev, searchType: type }));
	};

	const handleButtonClick = useCallback(
		(index: number) => {
			if (activeButtonIndex === index) {
				return;
			}
			setNewRule({ ...newRule, selectedMethod: index === 0 ? 'code' : 'automatic' });
			setActiveButtonIndex(index);
		},
		[activeButtonIndex],
	);

	const debouncedHandleOpen = useCallback(
		debounce(() => {
		  handleOpen();
		}, 500),
		[]
	);

	const handleSearchOneChange = (value: string) => {
		handleSearchTypeChange('one');
		setNewRule((prev) => ({ ...prev, searchOne: value }));
		debouncedHandleOpen();
	};

	const handleSearchTwoChange = (value: string) => {
		handleSearchTypeChange('two');
		setNewRule((prev) => ({ ...prev, searchTwo: value }));
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
			dicountCodePrefix: ''
		});
	};

	const handleOpen = () => {
		shopify.modal.show('product-collection-modal');
	};

	const handleClose = () => {
		shopify.modal.hide('product-collection-modal');
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
				<UsageLimit
					newRule={newRule}
					setNewRule={setNewRule}
				/>
				<br />
				<ActiveDates newRule={newRule} setNewRule={setNewRule} />
			</Layout.Section>
			<Layout.Section variant="oneThird">
				<Summary />
			</Layout.Section>
			<Modal id="product-collection-modal">
				{(queryType === 'buyXgetY' ? ['collection'].includes(newRule?.buyItemFrom || newRule?.getItemFrom) : newRule?.appliesTo === 'collection') && <CollectionList newRule={newRule} setNewRule={setNewRule} />}
				{(queryType === 'buyXgetY' ? ['product'].includes(newRule?.buyItemFrom || newRule?.getItemFrom) : newRule?.appliesTo === 'product') && <ProductsList newRule={newRule} setNewRule={setNewRule} />}
				<TitleBar
					title={`Add ${(queryType === 'buyXgetY' ? ['product'].includes(newRule?.buyItemFrom || newRule?.getItemFrom) : newRule?.appliesTo === 'product') ? 'products' : 'collections'}`}
				>
					<button variant="primary">Add</button>
					<button onClick={handleClose}>Cancel</button>
				</TitleBar>
			</Modal>
		</Layout>
	);
};
