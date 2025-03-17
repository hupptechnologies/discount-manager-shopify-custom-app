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
import PopoverPicker from './PopoverPicker';

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
	const [popoverStartTimeActive, setPopoverStartTimeActive] = useState(true);
	const [popoverEndTimeActive, setPopoverEndTimeActive] = useState(true);
	const [selectedStartTime, setSelectedStartTime] = useState<string | null>('4:30 AM');
	const [selectedEndTime, setSelectedEndTime] = useState<string | null>('4:30 AM');
	const [selectedStartDates, setSelectedStartDates] = useState({
		start: new Date('Wed Feb 07 2018 00:00:00 GMT-0500 (EST)'),
		end: new Date('Wed Feb 07 2018 00:00:00 GMT-0500 (EST)'),
	});
	const [selectedEndDates, setSelectedEndDates] = useState({
		start: new Date('Wed Feb 07 2018 00:00:00 GMT-0500 (EST)'),
		end: new Date('Wed Feb 07 2018 00:00:00 GMT-0500 (EST)'),
	});

	return (
		<Card>
			<BlockStack gap="300">
				<Text variant="bodyLg" fontWeight="medium" as="h3">
					Active dates
				</Text>
				<FormLayout.Group>
					<PopoverPicker
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
						mode='date'
						setSelectedDates={setSelectedEndDates}
						selectedDates={selectedStartDates}
						setSelectedTime={setSelectedStartTime}
					/>
					<PopoverPicker
						activator={
							<TextField
								label="Start time (EDT)"
								value="7:00 am"
								onChange={(value) => setNewRule({ ...newRule, discount: value })}
								autoComplete="off"
								prefix={<Icon source={ClockIcon} tone="base" />}
								onFocus={() => setPopoverStartTimeActive(true)}
							/>
						}
						popoverActive={popoverStartTimeActive}
						setPopoverActive={setPopoverStartTimeActive}
						mode='time'
						setSelectedTime={setSelectedEndTime}
						selectedDates={setSelectedStartTime}
						setSelectedDates={setSelectedStartDates}

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
						<PopoverPicker
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
							mode='date'
							setSelectedDates={setSelectedEndDates}
							selectedDates={selectedEndDates}
							setSelectedTime={setSelectedEndTime}
						/>
						<PopoverPicker
							activator={
								<TextField
									label="End time (EDT)"
									value="7:00 am"
									onChange={(value) => setNewRule({ ...newRule, discount: value })}
									autoComplete="off"
									type='text'
									prefix={<Icon source={ClockIcon} tone="base" />}
									onFocus={() => setPopoverEndTimeActive(true)}
								/>
							}
							popoverActive={popoverEndTimeActive}
							setPopoverActive={setPopoverEndTimeActive}
							mode='time'
							setSelectedTime={setSelectedEndTime}
							setSelectedDates={setSelectedEndDates}
							selectedDates={selectedEndDates}
						/>
					</FormLayout.Group>
				)}
			</BlockStack>
		</Card>
	);
};

export default ActiveDates;
