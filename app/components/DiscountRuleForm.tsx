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
} from '@shopify/polaris';

interface DiscountRule {
	condition: string;
	discount: string;
	type: 'stackable' | 'exclusive';
	quantity: string;
	category: string;
	region: string;
	customerType: 'all' | 'vip' | 'first-time';
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
		isCustom: true
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
			isCustom: false
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
				<BlockStack gap="500">
					<FormLayout>
						<Text variant="bodyLg" fontWeight="medium" as="h3">
							Discount rules
						</Text>
						<FormLayout.Group>
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
								label="Discount Value"
								value={newRule.discount}
								onChange={(value) =>
									setNewRule({ ...newRule, discount: value })
								}
								placeholder="e.g. 10% off"
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
							<TextField
								label="Discount by Product Category"
								value={newRule.category}
								onChange={(value) =>
									setNewRule({ ...newRule, category: value })
								}
								placeholder="e.g. 20% off all shoes"
								autoComplete="off"
							/>
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
						<TextField
							label="Geo-Based Discount"
							value={newRule.region}
							onChange={(value) => setNewRule({ ...newRule, region: value })}
							placeholder="e.g. Black Friday discount in the US"
							autoComplete="off"
						/>
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
