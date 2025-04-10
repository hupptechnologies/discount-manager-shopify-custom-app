import {
	BlockStack,
	Box,
	Card,
	Checkbox,
	FormLayout,
	Text,
	TextField,
} from '@shopify/polaris';
import type { DiscountRule } from './DiscountRuleForm';

interface UsageLimitProps {
	newRule: DiscountRule;
	setNewRule: React.Dispatch<any>;
	handleSaveBarOpen: any;
}

const UsageLimit: React.FC<UsageLimitProps> = ({ newRule, setNewRule, handleSaveBarOpen }) => {
	return (
		<Card>
			<BlockStack gap="300">
				<Text variant="bodyLg" fontWeight="medium" as="h3">
					Maximum discount uses
				</Text>
				<FormLayout.Group>
					<Checkbox
						label="Limit number of times this discount can be used in total"
						checked={newRule?.totalUsageLimit}
						onChange={() => {
							handleSaveBarOpen();
							setNewRule({
								...newRule,
								totalUsageLimit: !newRule.totalUsageLimit,
							})
						}}
						helpText={
							newRule?.totalUsageLimit && (
								<Box width="30%">
									<TextField
										label=""
										value={newRule?.totalLimitValue}
										type="integer"
										onChange={(value) =>
											setNewRule({ ...newRule, totalLimitValue: value })
										}
										autoComplete="off"
									/>
								</Box>
							)
						}
					/>
					<Checkbox
						label="Limit to one use per customer"
						checked={newRule?.onePerCustomer}
						onChange={() => {
							handleSaveBarOpen();
							setNewRule({
								...newRule,
								onePerCustomer: !newRule.onePerCustomer,
							})
						}}
					/>
				</FormLayout.Group>
			</BlockStack>
		</Card>
	);
};

export default UsageLimit;
