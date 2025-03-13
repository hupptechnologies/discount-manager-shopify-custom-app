import { DatePicker, Popover } from "@shopify/polaris"
import { useCallback, useState } from "react";

interface PopoverDatePickerProps {
	popoverActive: boolean;
	setPopoverActive: any;
	activator: any;
}

const PopoverDatePicker: React.FC<PopoverDatePickerProps> = ({ activator, popoverActive, setPopoverActive }) => {
	const [{month, year}, setDate] = useState({month: 1, year: 2018});
	const [selectedDates, setSelectedDates] = useState({
		start: new Date('Wed Feb 07 2018 00:00:00 GMT-0500 (EST)'),
		end: new Date('Wed Feb 07 2018 00:00:00 GMT-0500 (EST)'),
	});

	const handleMonthChange = useCallback(
		(month: number, year: number) => setDate({month, year}),
		[],
	);

	return	(
		<Popover
			activator={activator}
			active={popoverActive}
			autofocusTarget="first-node"
			onClose={() => setPopoverActive(!popoverActive)}
		>
			<DatePicker
				month={month}
				year={year}
				onChange={setSelectedDates}
				onMonthChange={handleMonthChange}
				selected={selectedDates}
			/>
		</Popover>
	)
};

export default PopoverDatePicker;