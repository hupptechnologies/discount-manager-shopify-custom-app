import {
	BlockStack,
	Box,
	Card,
	InlineStack,
	List,
	Text,
} from '@shopify/polaris';
import type { QueryType } from 'app/routes/app.create-discount';
import type { DiscountRule } from './DiscountRuleForm';
import { formatDateRange, isToday } from 'app/utils/json';

interface DiscountRuleFormProps {
	queryType: QueryType;
	newRule: DiscountRule;
}

const Summary: React.FC<DiscountRuleFormProps> = ({ queryType, newRule }) => {
	const typeList = {
		order: 'Amount off orders',
		products: 'Amount off products',
		shipping: 'Free Shipping',
		buyXgetY: 'Buy X get Y',
	};

	const displayText =
		newRule?.selectedStartDates?.start &&
		isToday(newRule.selectedStartDates.start)
			? 'Active from today'
			: `Active from ${formatDateRange({ start: newRule.selectedStartDates.start as Date, end: newRule.selectedStartDates.end as Date }, { start: newRule.selectedEndDates.start as Date, end: newRule.selectedEndDates.end as Date })}`;
	const purchaseText =
		newRule?.purchaseType === 'one-time'
			? 'one-time'
			: newRule?.purchaseType === 'subscription'
				? 'subscriptions'
				: 'one time and subscriptions';
	const buyXgetYPurchaseText = `Buy ${newRule?.customerBuys?.quantity} item As a ${purchaseText} purchase Get ${newRule?.customerGets?.items?.length} items at ${newRule?.customerGets?.percentage}% off`;

	return (
		<Card>
			<InlineStack gap="400">
				<Text variant="bodyMd" as="h6">
					{newRule?.checkoutDiscountCode
						? newRule?.checkoutDiscountCode
						: 'No discount code yet'}
				</Text>
			</InlineStack>
			<BlockStack gap="400">
				<Text variant="headingSm" as="p">
					{newRule?.selectedMethod === 'code' ? 'Code' : 'Automatic'}
				</Text>
				<Box>
					<Text variant="headingSm" as="p">
						Type
					</Text>
					<Text as="p" variant="bodyMd">
						{queryType && typeList[queryType]}
					</Text>
				</Box>
				<Box>
					<Text variant="headingSm" as="p">
						Details
					</Text>
					<List>
						<List.Item>For Online Store</List.Item>
						<List.Item>
							{newRule?.isRandom
								? 'Selected code is generate'
								: 'Selected code is custom'}
						</List.Item>
						{Number(newRule?.customerGets?.percentage) > 0 && (
							<List.Item>{`${newRule?.customerGets?.percentage}% off ${newRule?.getItemFrom === 'collection' ? 'collections' : 'products'}`}</List.Item>
						)}
						{queryType !== 'buyXgetY' && (
							<List.Item>Applies to {purchaseText} purchases</List.Item>
						)}
						{queryType === 'buyXgetY' && (
							<List.Item>{buyXgetYPurchaseText}</List.Item>
						)}
						<List.Item>All customers</List.Item>
						<List.Item>
							{Number(newRule?.totalLimitValue) > 0
								? `Limit of ${newRule?.totalLimitValue} use`
								: 'No usage limits'}
						</List.Item>
						{newRule?.onePerCustomer && (
							<List.Item>One use per customer</List.Item>
						)}
						<List.Item>{displayText}</List.Item>
					</List>
				</Box>
				<Box>
					<Text variant="headingSm" as="p">
						Advanced Details
					</Text>
					<List>
						{Number(newRule?.quantity) > 0 && (
							<List.Item>{newRule?.quantity} quantity</List.Item>
						)}
						<List.Item>
							{newRule?.advanceDiscountType === 'exclusive'
								? 'Exclusive'
								: 'Stackable'}{' '}
							discount type
						</List.Item>
						<List.Item>
							{newRule?.productCategory === 'shoes' ? 'Shoes' : 'Electronic'}{' '}
							product category
						</List.Item>
						{queryType === 'order' && (
							<List.Item>
								{newRule?.customerType === 'all'
									? 'All Customers'
									: newRule?.customerType === 'vip'
										? 'VIP Customers'
										: 'First time buyer customers'}
							</List.Item>
						)}
						{newRule?.isStockBased && (
							<List.Item>
								Auto-apply 25% discount when stock is below 10 unitsry
							</List.Item>
						)}
						<List.Item>
							{newRule?.isAI ? 'Enabled' : 'Disabled'} AI discounts
						</List.Item>
					</List>
				</Box>
			</BlockStack>
		</Card>
	);
};

export default Summary;
