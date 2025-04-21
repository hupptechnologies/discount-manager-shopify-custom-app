import {
	Box,
	Card,
	Checkbox,
	FormLayout
} from '@shopify/polaris';
import type { DiscountRule } from './DiscountRuleForm';
import { CustomText, CustomTextField, CustomBlockStack } from '../PolarisUI';

interface UsageLimitProps {
	newRule: DiscountRule;
	setNewRule: React.Dispatch<any>;
	handleSaveBarOpen: any;
}

const UsageLimit: React.FC<UsageLimitProps> = ({ newRule, setNewRule, handleSaveBarOpen }) => {
	return (
		<Card>
			<CustomBlockStack gap="300">
				<CustomText variant="bodyLg" fontWeight="medium" as="h3">
					Maximum discount uses
				</CustomText>
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
									<CustomTextField
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
			</CustomBlockStack>
		</Card>
	);
};

export default UsageLimit;
