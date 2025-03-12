import { useCallback, useState } from 'react';
import {
	Card,
	TextField,
	Select,
	BlockStack,
	Checkbox,
	Text,
	Layout,
	InlineStack,
	Box,
	List,
	FormLayout,
	ButtonGroup,
	Button,
	Link,
	RadioButton,
	Icon,
} from '@shopify/polaris';
import { SearchIcon } from '@shopify/polaris-icons';

interface DiscountRule {
	condition: string;
	discount: string;
	type: 'stackable' | 'exclusive';
	quantity: string;
	category: string;
	region: string;
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

export default function DiscountRuleForm() {
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
		purchaseType: 'one-time'
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
			purchaseType: 'one-time'
		});
	};

  return (
    <>
		<Layout.Section>
			<Card>
				<InlineStack align="space-between" gap="200" blockAlign="center">
					<Text variant="bodyLg" fontWeight="medium" as="h3">
						Amount off products
					</Text>
					<Text as="p">Product discount</Text>
				</InlineStack>
				<br />
				<BlockStack gap='200'>
					<Text variant="bodyMd" as="h3">
						Method
					</Text>
					<ButtonGroup variant="segmented">
						<Button
							variant={activeButtonIndex === 0 ? 'primary' : 'secondary'}
							onClick={() => handleButtonClick(0)}
						>
							Discount code
						</Button>
						<Button
							variant={activeButtonIndex === 1 ? 'primary' : 'secondary'}
							onClick={() => handleButtonClick(1)}
						>
							Automatic discount
						</Button>
					</ButtonGroup>
					<TextField
						label='Title'
						helpText='The name of the discount the codes will be grouped under.'
						autoComplete="off"
					/>
				</BlockStack>
				<br />
				<BlockStack gap='100'>
					<RadioButton
						label="Generate random code"
						checked={newRule.isRandom}
						onChange={() => setNewRule({ ...newRule, isRandom: !newRule.isRandom, isCustom: false })}
					/>
					<RadioButton
						label="Provide custom code"
						checked={newRule.isCustom}
						onChange={() => setNewRule({ ...newRule, isCustom: !newRule.isCustom, isRandom: false })}
					/>
				</BlockStack>
				<br />
				{newRule.isCustom &&
					<Box>
						<InlineStack align='space-between' blockAlign='center' gap='200'>
							<Text variant="bodyMd" as="h3">
								Discount code
							</Text>
							<Link removeUnderline>
								Generate code
							</Link>
						</InlineStack>
						<TextField
							label
							value={newRule.condition}
							onChange={(value) =>
								setNewRule({ ...newRule, condition: value })
							}
							helpText='Customers must enter this code at checkout.'
							autoComplete="off"
						/>
					</Box>
				}
				{newRule.isRandom &&
					<FormLayout.Group>
						<TextField
							label="Number of codes to generate"
							type='integer'
							value='123456'
							autoComplete="off"
						/>
						<TextField
							label="Code length"
							type='integer'
							value='6'
							autoComplete="off"
						/>
					</FormLayout.Group>
				}
			</Card>
			<br />
			<Card>
				<BlockStack>
					<FormLayout>
						<Text variant="bodyLg" fontWeight="medium" as="h3">
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
								onChange={(value) =>
									setNewRule({
										...newRule,
										discountType: value as 'per' | 'fixed',
									})
								}
							/>
							<TextField
								label=""
								value={newRule.discount}
								onChange={(value) =>
									setNewRule({ ...newRule, discount: value })
								}
								autoComplete="off"
								prefix={newRule.discountType === 'fixed' ? 'INR' : ''}
								suffix={newRule.discountType === 'per' ? '%' : ''}
								placeholder='10'
							/>
						</FormLayout.Group>
						<FormLayout.Group condensed>
							<Select
								label=""
								options={[
									{ label: 'Specific collections', value: 'collection' },
									{ label: 'Specific products', value: 'product' },
								]}
								value={newRule.appliesTo}
								onChange={(value) =>
									setNewRule({
										...newRule,
										appliesTo: value as 'collection' | 'product',
									})
								}
							/>
							<Select
								label=""
								options={[
									{ label: 'One-time purchase', value: 'one-time' },
									{ label: 'Subscription', value: 'subscription' },
									{ label: 'Both', value: 'both' },
								]}
								value={newRule.purchaseType}
								onChange={(value) =>
									setNewRule({
										...newRule,
										purchaseType: value as 'one-time' | 'subscription',
									})
								}
							/>
						</FormLayout.Group>
						<FormLayout.Group>
							<TextField
								label=""
								value={newRule.discount}
								onChange={(value) =>
									setNewRule({ ...newRule, discount: value })
								}
								autoComplete="off"
								prefix={<Icon source={SearchIcon} />}
								placeholder={`Search ${newRule.appliesTo === 'collection' ? 'collection' : 'product'}`}
							/>
							<Button variant='secondary'>Browse</Button>
						</FormLayout.Group>
					</FormLayout>
				</BlockStack>
			</Card>
			<br />
			<Card>
				<BlockStack gap="500">
					<FormLayout>
						<Text variant="bodyLg" fontWeight="medium" as="h3">
							Advance discount rules
						</Text>
						<FormLayout.Group condensed>
							<TextField
								label="Discount Condition"
								value={newRule.condition}
								onChange={(value) =>
									setNewRule({ ...newRule, condition: value })
								}
								placeholder="e.g. Buy 2, Get 1 Free"
								autoComplete="off"
							/>
							<TextField
								label="Quantity-Based Discount"
								value={newRule.quantity}
								onChange={(value) =>
									setNewRule({ ...newRule, quantity: value })
								}
								placeholder="e.g. Buy 3+ items"
								autoComplete="off"
							/>
						</FormLayout.Group>
						<FormLayout.Group condensed>
							<Select
								label="Customer Segment"
								options={[
									{ label: 'All Customers', value: 'all' },
									{ label: 'VIP', value: 'vip' },
									{ label: 'First-Time Buyers', value: 'first-time' },
								]}
								value={newRule.customerType}
								onChange={(value) =>
									setNewRule({
										...newRule,
										customerType: value as 'all' | 'vip' | 'first-time',
									})
								}
							/>
							<Select
								label="Discount Type"
								options={[
									{ label: 'Stackable', value: 'stackable' },
									{ label: 'Exclusive', value: 'exclusive' },
								]}
								value={newRule.type}
								onChange={(value) =>
									setNewRule({
										...newRule,
										type: value as 'stackable' | 'exclusive',
									})
								}
							/>
						</FormLayout.Group>
						<FormLayout.Group condensed>
							<TextField
								label="Discount by Product Category"
								value={newRule.category}
								onChange={(value) =>
									setNewRule({ ...newRule, category: value })
								}
								placeholder="e.g. 20% off all shoes"
								autoComplete="off"
							/>
							<TextField
								label="Geo-Based Discount"
								value={newRule.region}
								onChange={(value) => setNewRule({ ...newRule, region: value })}
								placeholder="e.g. Black Friday discount in the US"
								autoComplete="off"
							/>
						</FormLayout.Group>
						<Checkbox
							label="Stock-Based Discount"
							checked={newRule.isStockBased}
							onChange={() =>
								setNewRule({
									...newRule,
									isStockBased: !newRule.isStockBased,
								})
							}
						/>
						<Checkbox
							label="Enable AI Discounts"
							checked={newRule.isAI}
							onChange={() => setNewRule({ ...newRule, isAI: !newRule.isAI })}
						/>
					</FormLayout>
				</BlockStack>
			</Card>
			<br />
			<Card>
				<BlockStack gap='300'>
					<Text variant="bodyLg" fontWeight="medium" as="h3">
						Active dates
					</Text>
					<FormLayout.Group>
						<TextField
							label="Start date"
							value='2025-03-31'
							onChange={(value) =>
								setNewRule({ ...newRule, condition: value })
							}
							autoComplete="off"
						/>
						<TextField
							label="Start time (EDT)"
							value='7:00 am'
							onChange={(value) =>
								setNewRule({ ...newRule, discount: value })
							}
							autoComplete="off"
						/>
					</FormLayout.Group>
					<Checkbox
						label="Set end date"
						checked={newRule.isEndDate}
						onChange={() =>
							setNewRule({
								...newRule,
								isEndDate: !newRule.isEndDate,
							})
						}
					/>
					{newRule.isEndDate &&
						<FormLayout.Group>
							<TextField
								label="End date"
								value='2025-03-31'
								onChange={(value) =>
									setNewRule({ ...newRule, condition: value })
								}
								autoComplete="off"
							/>
							<TextField
								label="End time (EDT)"
								value='7:00 am'
								onChange={(value) =>
									setNewRule({ ...newRule, discount: value })
								}
								autoComplete="off"
							/>
						</FormLayout.Group>
					}
				</BlockStack>
			</Card>
		</Layout.Section>
		<Layout.Section variant="oneThird">
			<Card>
				<InlineStack gap="400">
					<Text variant="bodyMd" as="h6">
						No discount code yet
					</Text>
				</InlineStack>
				<BlockStack gap="400">
					<Text variant="headingSm" as="p">
						CODE123
					</Text>
					<Box>
						<Text variant="headingSm" as="p">
							Type
						</Text>
						<Text as="p" variant="bodyMd">
							Amount off products
						</Text>
					</Box>
					<Box>
						<Text variant="headingSm" as="p">
							Details
						</Text>
						<List>
						<List.Item>For Online Store</List.Item>
						<List.Item>Applies to one-time purchases</List.Item>
						<List.Item>No minimum purchase requirement</List.Item>
						<List.Item>All customers</List.Item>
						<List.Item>Can’t combine with other discounts</List.Item>
						<List.Item>No usage limits</List.Item>
						<List.Item>Active from today</List.Item>
						</List>
					</Box>
				</BlockStack>
			</Card>
		</Layout.Section>
    </>
  );
}
