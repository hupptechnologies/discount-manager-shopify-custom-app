import {
	Box,
	ButtonGroup,
	Card,
	FormLayout,
	InlineStack,
	Link,
	RadioButton,
	Select
} from '@shopify/polaris';
import Placeholder from '../Placeholder';
import type { DiscountRule } from './DiscountRuleForm';
import type { CodeList } from './BulkCodeList';
import type { QueryType } from 'app/routes/app.create-discount';
import PrimaryButton from '../PolarisUI/CustomButton';
import CustomText from '../PolarisUI/CustomText';
import CustomTextField from '../PolarisUI/CustomTextField';
import CustomBlockStack from '../PolarisUI/CustomBlockStack';
import { generateDiscountCode } from 'app/utils/json';

interface DiscountCodeGenProps {
	setNewRule: React.Dispatch<React.SetStateAction<any>>;
	handleButtonClick: React.Dispatch<React.SetStateAction<any>>;
	handleOpenBulkCode: () => void;
	handleGenerateCodeList: any;
	handleSaveBarOpen: any;
	activeButtonIndex: number;
	queryType: QueryType;
	heading: string;
	newRule: DiscountRule;
	isEdit: boolean;
	generateList: string[];
	codesList: CodeList[];
	isMultiple: boolean;
}

const DiscountCodeGen: React.FC<DiscountCodeGenProps> = ({
	heading,
	activeButtonIndex,
	handleButtonClick,
	newRule,
	setNewRule,
	queryType,
	handleSaveBarOpen,
	isEdit,
	handleGenerateCodeList,
	generateList,
	handleOpenBulkCode,
	codesList,
	isMultiple
}) => {
	return (
		<Card>
			<InlineStack align="space-between" gap="200" blockAlign="center">
				<CustomText variant="headingMd" fontWeight="semibold" as="h6">
					{heading}
				</CustomText>
				<CustomText as="p">{queryType} discount</CustomText>
			</InlineStack>
			<Placeholder height="5px" />
			<CustomBlockStack gap="200">
				{!isEdit && (
					<CustomText variant="bodyMd" as="h3">
						Method
					</CustomText>
				)}
				{!isEdit && (
					<ButtonGroup variant="segmented">
						<PrimaryButton
							variant={activeButtonIndex === 0 ? 'primary' : 'secondary'}
							onClick={() => handleButtonClick(0)}
							children={'Discount code'}
						/>
						<PrimaryButton
							variant={activeButtonIndex === 1 ? 'primary' : 'secondary'}
							onClick={() => handleButtonClick(1)}
							children={'Automatic discount'}
						/>
					</ButtonGroup>
				)}
				<CustomTextField
					label="Title"
					helpText="The name of the discount the codes will be grouped under."
					autoComplete="off"
					value={newRule?.title}
					onChange={(value) => {
						if (value.length <= 10) {
							handleSaveBarOpen();
							setNewRule({
								...newRule,
								title: value,
							})
						}
					}}
				/>
			</CustomBlockStack>
			<Placeholder height="5px" />
			{!isEdit && newRule?.selectedMethod === 'code' && queryType !== 'buyXgetY' &&
				<CustomBlockStack gap="100">
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
				</CustomBlockStack>
			}
			{!isEdit && newRule?.selectedMethod === 'code' && queryType !== 'buyXgetY' && <Placeholder height="5px" />}
			{queryType !== 'buyXgetY' && newRule.isCustom && newRule?.selectedMethod === 'code' && (
				<Box>
					<InlineStack align="space-between" blockAlign="center" gap="200">
						<CustomText variant="bodyMd" as="h3">
							Discount code
						</CustomText>
						{(codesList?.length > 0 && isMultiple) ?
							<Link removeUnderline onClick={handleOpenBulkCode}>
								Views all codes
							</Link> :
							<Link
								onClick={() => {
									handleSaveBarOpen();
									setNewRule({
										...newRule,
										checkoutDiscountCode: generateDiscountCode(),
									});
								}}
								removeUnderline
							>
								Generate code
							</Link>
						}
					</InlineStack>
					<CustomTextField
						label
						value={newRule.checkoutDiscountCode}
						onChange={(value) => {
							if (value.length <= 10) {
								handleSaveBarOpen();
								setNewRule({ ...newRule, checkoutDiscountCode: value });
							};
						}}
						helpText="Customers must enter this code at checkout."
						autoComplete="off"
						readOnly={codesList?.length > 0 && isMultiple}
					/>
				</Box>
			)}
			{newRule.isRandom && (
				<FormLayout.Group condensed>
					<CustomTextField
						label="Number of codes to generate"
						type="integer"
						value={newRule.noOfCodeCount}
						onChange={(value) =>
							setNewRule({ ...newRule, noOfCodeCount: value })
						}
						autoComplete="off"
					/>
					<CustomTextField
						label="Code length"
						type="number"
						value={newRule.codeLength}
						onChange={(value) => setNewRule({ ...newRule, codeLength: value })}
						autoComplete="off"
						max={10}
						min={0}
					/>
					<CustomTextField
						label="Dicount prefix"
						type="text"
						value={newRule?.dicountCodePrefix}
						onChange={(value) => {
							if (value?.length <= 5) {
								setNewRule({ ...newRule, dicountCodePrefix: value })
							}
						}}
						autoComplete="off"
					/>
				</FormLayout.Group>
			)}
			{newRule?.isRandom && (
				<div className='generate-discount-codes-list'>
					<FormLayout.Group condensed>
							<Select
								label="Generated Codes"
								options={generateList}
							/>
							<PrimaryButton
								onClick={handleGenerateCodeList}
								variant='secondary'
								children={'Generate codes'}
							/>
					</FormLayout.Group>
				</div>
			)}
		</Card>
	);
};

export default DiscountCodeGen;
