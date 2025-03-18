import { DatePicker, Popover, ResourceList } from "@shopify/polaris"
import { generateTimeList } from "app/utils/json";
import { useCallback, useState } from "react";

interface PopoverProps {
	popoverActive: boolean;
	setPopoverActive: any;
	activator: any;
	mode: string;
	setSelectedTime: any;
	selectedDates: any;
	setSelectedDates: any;
}

const PopoverPicker: React.FC<PopoverProps> = ({
	activator, 
	popoverActive,
	setPopoverActive,
	mode = 'date',
	setSelectedTime,
	setSelectedDates,
	selectedDates
}) => {
	const [{month, year}, setDate] = useState({month: 1, year: 2018});

	const handleMonthChange = useCallback(
		(month: number, year: number) => setDate({month, year}),
		[],
	);

	const timeList = generateTimeList().map((time) => ({
		time
	}));

	return	(
		<Popover
			activator={activator}
			active={popoverActive}
			autofocusTarget="first-node"
			onClose={() => setPopoverActive(!popoverActive)}
		>
			{mode === 'date' && <DatePicker
				month={month}
				year={year}
				onChange={(value) => setSelectedDates({ ...selectedDates.selectedStartDates, start: value.start, end: value.end })}
				onMonthChange={handleMonthChange}
				selected={selectedDates}
			/>}
			{mode === 'time' && <ResourceList items={timeList} renderItem={renderItem} />}
		</Popover>
	)

	function renderItem({time}: {time: string;}) {
		return (
			<ResourceList.Item
				id={time}
				onClick={() => setSelectedTime(time)}
			>
				{time}
			</ResourceList.Item>
		);
	}
};

export default PopoverPicker;