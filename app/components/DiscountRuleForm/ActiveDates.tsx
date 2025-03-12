import {
	BlockStack,
	Card,
	Checkbox,
	FormLayout,
	Text,
	TextField
} from "@shopify/polaris";

interface ActiveDatesProps {
	setNewRule: React.Dispatch<React.SetStateAction<any>>;
	newRule: {
		condition: string;
		discount: string;
		isEndDate: boolean;
	};
}

const ActiveDates: React.FC<ActiveDatesProps> = ({ setNewRule, newRule }) => {
	return	(
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
	)
};

export default ActiveDates;