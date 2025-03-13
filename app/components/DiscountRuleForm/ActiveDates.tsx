import { useState } from 'react';
import {
	BlockStack,
	Card,
	Checkbox,
	FormLayout,
	Text,
	TextField,
	Icon,
} from '@shopify/polaris';
import {
	CalendarIcon,
	ClockIcon
} from '@shopify/polaris-icons';
import PopoverDatePicker from './PopoverDatePicker';

interface ActiveDatesProps {
	setNewRule: React.Dispatch<React.SetStateAction<any>>;
	newRule: {
		condition: string;
		discount: string;
		isEndDate: boolean;
	};
}

const ActiveDates: React.FC<ActiveDatesProps> = ({ setNewRule, newRule }) => {
	const [popoverStartDateActive, setPopoverStartDateActive] = useState(true);
	const [popoverEndDateActive, setPopoverEndDateActive] = useState(true);

	return (
		<Card>
			<BlockStack gap="300">
				<Text variant="bodyLg" fontWeight="medium" as="h3">
					Active dates
				</Text>
				<FormLayout.Group>
					<PopoverDatePicker
						activator={
							<TextField
								label="Start date"
								value="2025-03-31"
								onChange={(value) => setNewRule({ ...newRule, condition: value })}
								autoComplete="off"
								prefix={<Icon source={CalendarIcon} tone="base" />}
								onFocus={() => setPopoverStartDateActive(true)}
							/>
						}
						popoverActive={popoverStartDateActive}
						setPopoverActive={setPopoverStartDateActive}
					/>
					<TextField
						label="Start time (EDT)"
						value="7:00 am"
						onChange={(value) => setNewRule({ ...newRule, discount: value })}
						autoComplete="off"
						prefix={<Icon source={ClockIcon} tone="base" />}
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
				{newRule.isEndDate && (
					<FormLayout.Group>
						<PopoverDatePicker
							activator={
								<TextField
									label="End date"
									value="2025-03-31"
									onChange={(value) => setNewRule({ ...newRule, condition: value })}
									autoComplete="off"
									prefix={<Icon source={CalendarIcon} tone="base" />}
									onFocus={() => setPopoverEndDateActive(true)}
								/>
							}
							popoverActive={popoverEndDateActive}
							setPopoverActive={setPopoverEndDateActive}
						/>
						<TextField
							label="End time (EDT)"
							value="7:00 am"
							onChange={(value) => setNewRule({ ...newRule, discount: value })}
							autoComplete="off"
							type='text'
							prefix={<Icon source={ClockIcon} tone="base" />}
						/>
					</FormLayout.Group>
				)}
			</BlockStack>
		</Card>
	);
};

export default ActiveDates;
