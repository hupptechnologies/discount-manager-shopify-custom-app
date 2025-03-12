import { useCallback, useState } from 'react';
import { Layout } from '@shopify/polaris';
import Summary from './Summary';
import ActiveDates from './ActiveDates';
import AdvanceDiscountRules from './AdvancedDiscountRules';
import DiscountValue from './DiscountValue';
import DiscountCodeGen from './DiscountCodeGen';

interface DiscountRule {
	condition: string;
	discount: string;
	type: 'stackable' | 'exclusive';
	quantity: string;
	category: string;
	region: string;
	search: string;
	customerType: 'all' | 'vip' | 'first-time';
	discountType: 'per' | 'fixed';
	appliesTo: 'collection' | 'product';
	purchaseType: 'one-time' | 'subscription' | 'both';
	isStockBased: boolean;
	isAI: boolean;
	isEndDate: boolean;
	isCustom: boolean;
	isRandom: boolean;
}

type DiscountRuleFormProps = {
	queryType: 'order' | 'products' | 'shipping' | 'buyXgetY' | null;
}

export const DiscountRuleForm: React.FC<DiscountRuleFormProps> = ({ queryType }) => {
	const [activeButtonIndex, setActiveButtonIndex] = useState(0);
	const [rules, setRules] = useState<DiscountRule[]>([]);
	const [newRule, setNewRule] = useState<DiscountRule>({
		condition: '',
		discount: '',
		type: 'stackable',
		quantity: '',
		category: '',
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
		search: ''
	});

	const handleButtonClick = useCallback(
		(index: number) => {
			if (activeButtonIndex === index) return;
				setActiveButtonIndex(index);
			},
		[activeButtonIndex],
	);

	const handleAddRule = () => {
		setRules([...rules, newRule]);
		setNewRule({
			condition: '',
			discount: '',
			type: 'stackable',
			quantity: '',
			category: '',
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
			search: ''
		});
	};

	return	(
	<>
		<Layout.Section>
			<DiscountCodeGen
				title={['shipping'].includes(queryType as string) ? 'Free shipping' : `Amount off ${['products'].includes(queryType as string) ? 'products' : 'orders'}`}
				newRule={newRule}
				setNewRule={setNewRule}
				activeButtonIndex={activeButtonIndex}
				handleButtonClick={handleButtonClick}
			/>
			<br />
			<DiscountValue
				newRule={newRule}
				setNewRule={setNewRule}
			/>
			<br />
			<AdvanceDiscountRules
				newRule={newRule}
				setNewRule={setNewRule}
			/>
			<br />
			<ActiveDates
				newRule={newRule}
				setNewRule={setNewRule}
			/>
		</Layout.Section>
		<Layout.Section variant="oneThird">
			<Summary />
		</Layout.Section>
	</>
	);
}
