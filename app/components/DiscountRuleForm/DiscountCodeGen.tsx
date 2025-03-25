import {
	BlockStack,
	Box,
	Button,
	ButtonGroup,
	Card,
	FormLayout,
	InlineStack,
	Link,
	RadioButton,
	Text,
	TextField,
} from '@shopify/polaris';

interface DiscountCodeGenProps {
	setNewRule: React.Dispatch<React.SetStateAction<any>>;
	handleButtonClick: React.Dispatch<React.SetStateAction<any>>;
	handleSaveBarOpen: any;
	activeButtonIndex: number;
	queryType: 'order' | 'products' | 'shipping' | 'buyXgetY' | null;
	heading: string;
	newRule: {
		isCustom: boolean;
		isRandom: boolean;
		checkoutDiscountCode: string;
		title: string;
		noOfCodeCount: string;
		codeLength: string;
		dicountCodePrefix: string;
	};
}

const DiscountCodeGen: React.FC<DiscountCodeGenProps> = ({
	heading,
	activeButtonIndex,
	handleButtonClick,
	newRule,
	setNewRule,
	queryType,
	handleSaveBarOpen,
}) => {
	return (
		<Card>
			<InlineStack align="space-between" gap="200" blockAlign="center">
				<Text variant="headingMd" fontWeight="semibold" as="h6">
					{heading}
				</Text>
				<Text as="p">{queryType} discount</Text>
			</InlineStack>
			<br />
			<BlockStack gap="200">
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
					label="Title"
					helpText="The name of the discount the codes will be grouped under."
					autoComplete="off"
					value={newRule?.title}
					onChange={(value) =>
						setNewRule({
							...newRule,
							title: value,
						})
					}
				/>
			</BlockStack>
			<br />
			<BlockStack gap="100">
				<RadioButton
					label="Generate random code"
					checked={newRule.isRandom}
					onChange={() =>
						setNewRule({
							...newRule,
							isRandom: !newRule.isRandom,
							isCustom: false,
						})
					}
				/>
				<RadioButton
					label="Provide custom code"
					checked={newRule.isCustom}
					onChange={() =>
						setNewRule({
							...newRule,
							isCustom: !newRule.isCustom,
							isRandom: false,
						})
					}
				/>
			</BlockStack>
			<br />
			{newRule.isCustom && (
				<Box>
					<InlineStack align="space-between" blockAlign="center" gap="200">
						<Text variant="bodyMd" as="h3">
							Discount code
						</Text>
						<Link removeUnderline>Generate code</Link>
					</InlineStack>
					<TextField
						label
						value={newRule.checkoutDiscountCode}
						onChange={(value) => {
							handleSaveBarOpen();
							setNewRule({ ...newRule, checkoutDiscountCode: value });
						}}
						helpText="Customers must enter this code at checkout."
						autoComplete="off"
					/>
				</Box>
			)}
			{newRule.isRandom && (
				<FormLayout.Group condensed>
					<TextField
						label="Number of codes to generate"
						type="integer"
						value={newRule.noOfCodeCount}
						onChange={(value) =>
							setNewRule({ ...newRule, noOfCodeCount: value })
						}
						autoComplete="off"
					/>
					<TextField
						label="Code length"
						type="integer"
						value={newRule.codeLength}
						onChange={(value) => setNewRule({ ...newRule, codeLength: value })}
						autoComplete="off"
					/>
					<TextField
						label="Dicount prefix"
						type="text"
						value={newRule?.dicountCodePrefix}
						onChange={(value) =>
							setNewRule({ ...newRule, dicountCodePrefix: value })
						}
						autoComplete="off"
					/>
				</FormLayout.Group>
			)}
		</Card>
	);
};

export default DiscountCodeGen;
