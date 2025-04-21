import { useState } from 'react';
import {
	BlockStack,
	Card,
	Checkbox,
	FormLayout,
	Icon,
} from '@shopify/polaris';
import { CalendarIcon, ClockIcon } from '@shopify/polaris-icons';
import type { DiscountRule } from './DiscountRuleForm';
import PopoverPicker from './PopoverPicker';
import CustomText from '../PolarisUI/CustomText';
import CustomTextField from '../PolarisUI/CustomTextField';
import { getYearMonthDay } from 'app/utils/json';

interface ActiveDatesProps {
	setNewRule: React.Dispatch<React.SetStateAction<any>>;
	newRule: DiscountRule;
	handleSaveBarOpen: any;
}

const ActiveDates: React.FC<ActiveDatesProps> = ({ setNewRule, newRule, handleSaveBarOpen }) => {
	const [popoverStartDateActive, setPopoverStartDateActive] = useState(true);
	const [popoverEndDateActive, setPopoverEndDateActive] = useState(true);
	const [popoverStartTimeActive, setPopoverStartTimeActive] = useState(true);
	const [popoverEndTimeActive, setPopoverEndTimeActive] = useState(true);

	return (
		<Card>
			<BlockStack gap="300">
				<CustomText variant="bodyLg" fontWeight="medium" as="h3">
					Active dates
				</CustomText>
				<FormLayout.Group>
					<PopoverPicker
						activator={
							<CustomTextField
								label="Start date"
								value={
									getYearMonthDay(newRule?.selectedStartDates?.start) || ''
								}
								autoComplete="off"
								prefix={<Icon source={CalendarIcon} tone="base" />}
								onFocus={() => {
									handleSaveBarOpen();
									setPopoverStartDateActive(!popoverStartDateActive)
								}}
							/>
						}
						popoverActive={popoverStartDateActive}
						setPopoverActive={setPopoverStartDateActive}
						mode="date"
						setSelectedDates={(dates: any) => {
							handleSaveBarOpen();
							setNewRule({
								...newRule,
								selectedStartDates: {
									...newRule.selectedStartDates,
									start: dates.start,
									end: dates.end,
								},
							});
							setPopoverStartDateActive(false);
						}}
						selectedDates={newRule?.selectedStartDates}
						setSelectedTime={newRule?.selectedStartTime}
					/>
					<PopoverPicker
						activator={
							<CustomTextField
								label="Start time (EDT)"
								value={newRule.selectedStartTime || ''}
								onChange={(value) =>
									setNewRule({ ...newRule, selectedStartTime: value })
								}
								autoComplete="off"
								prefix={<Icon source={ClockIcon} tone="base" />}
								onFocus={() => {
									handleSaveBarOpen();
									setPopoverStartTimeActive(!popoverStartTimeActive)
								}}
							/>
						}
						popoverActive={popoverStartTimeActive}
						setPopoverActive={setPopoverStartTimeActive}
						mode="time"
						setSelectedTime={(value: string) => {
							setNewRule({ ...newRule, selectedStartTime: value });
							setPopoverStartTimeActive(false);
						}}
						selectedDates={newRule?.selectedStartDates}
						setSelectedDates={() => {}}
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
								<CustomTextField
									label="End date"
									value={
										getYearMonthDay(newRule?.selectedEndDates?.start) || ''
									}
									autoComplete="off"
									prefix={<Icon source={CalendarIcon} tone="base" />}
									onFocus={() => {
										handleSaveBarOpen();
										setPopoverEndDateActive(!popoverEndDateActive);
									}}
								/>
							}
							popoverActive={popoverEndDateActive}
							setPopoverActive={setPopoverEndDateActive}
							mode="date"
							setSelectedDates={(dates: any) => {
								setNewRule({
									...newRule,
									selectedEndDates: {
										...newRule.selectedEndDates,
										start: dates.start,
										end: dates.end,
									},
								});
								setPopoverEndDateActive(false);
							}}
							selectedDates={newRule?.selectedEndDates}
							setSelectedTime={() => {}}
						/>
						<PopoverPicker
							activator={
								<CustomTextField
									label="End time (EDT)"
									value={newRule?.selectedEndTime}
									onChange={(value) =>
										setNewRule({ ...newRule, selectedEndTime: value })
									}
									autoComplete="off"
									type="text"
									prefix={<Icon source={ClockIcon} tone="base" />}
									onFocus={() => {
										handleSaveBarOpen();
										setPopoverEndTimeActive(!popoverEndTimeActive);
									}}
								/>
							}
							popoverActive={popoverEndTimeActive}
							setPopoverActive={setPopoverEndTimeActive}
							mode="time"
							setSelectedTime={(value: string) => {
								setNewRule({ ...newRule, selectedEndTime: value });
								setPopoverEndTimeActive(false);
							}}
							setSelectedDates={() => {}}
							selectedDates={newRule?.selectedEndDates}
						/>
					</FormLayout.Group>
				)}
			</BlockStack>
		</Card>
	);
};

export default ActiveDates;
