import { DateTime } from 'luxon';

interface DateRange {
	start: Date | null;
	end?: Date | null;
}

export const generateTimeList = (): string[] => {
	const timeList: string[] = [];
	let hour = 1;
	let isAM = true;

	while (hour <= 12) {
		timeList.push(`${hour}:00 ${isAM ? 'AM' : 'PM'}`);
		timeList.push(`${hour}:30 ${isAM ? 'AM' : 'PM'}`);
		hour++;
		if (hour === 12) {
			isAM = false;
		}
	}
	return timeList;
};

export const getYearMonthDay = (date: any): string => {
	const year = date.getFullYear();
	const month = (date.getMonth() + 1).toString().padStart(2, '0');
	const day = date.getDate().toString().padStart(2, '0');
	return `${year}-${month}-${day}`;
};

export const formatDateWithTime = (dateString: string): string => {
	const date = new Date(dateString);
	const year = date.getFullYear();
	const month = (date.getMonth() + 1).toString().padStart(2, '0');
	const day = date.getDate().toString().padStart(2, '0');
	return `${year}-${month}-${day}`;
};

export const formatDateWithTimeZone = (
	dateString: any,
	timeString: string,
): string | null => {
	const date = DateTime.fromJSDate(dateString);
	const timeParts = timeString.match(/(\d{1,2}):(\d{2})\s([APM]{2})/);
	if (!timeParts) {
		throw new Error('Invalid time format');
	}
	let hours = parseInt(timeParts[1], 10);
	const minutes = parseInt(timeParts[2], 10);
	const period = timeParts[3];
	if (period === 'PM' && hours !== 12) {
		hours += 12;
	} else if (period === 'AM' && hours === 12) {
		hours = 0;
	}
	const updatedDate = date.set({ hour: hours, minute: minutes });
	return updatedDate.setZone('Asia/Kolkata').toISO();
};

export const convertToLocalTime = (startsAt: string, endsAt: string) => {
	const startDateTime = DateTime.fromISO(startsAt, { zone: 'utc' }).setZone(
		'Asia/Kolkata',
	);
	const endDateTime = DateTime.fromISO(endsAt, { zone: 'utc' }).setZone(
		'Asia/Kolkata',
	);
	return {
		selectedStartDates: {
			start: startDateTime.toJSDate(),
			end: startDateTime.toJSDate(),
		},
		selectedEndDates: {
			start: endDateTime.toJSDate(),
			end: endDateTime.toJSDate(),
		},
		selectedStartTime: startDateTime.toFormat('hh:mm a'),
		selectedEndTime: endDateTime.toFormat('hh:mm a'),
	};
};

export const generateDiscountCode = (): string => {
	const prefixes = [
		'FREE',
		'EVENT',
		'STANDARD',
		'SUMMER',
		'WINTER',
		'FESTIVAL',
		'HOLIDAY',
	];
	const randomPrefix = prefixes[Math.floor(Math.random() * prefixes.length)];
	const randomPercentage = Math.floor(Math.random() * 100) + 1;
	return `${randomPrefix}${randomPercentage}%`;
};

export const formatDateRange = (
	selectedStartDates: DateRange,
	selectedEndDates: DateRange,
) => {
	const formatDate = (date: Date): string => {
		const day = date.getDate();
		const month = date.toLocaleString('en-GB', { month: 'short' });
		return `${day} ${month}`;
	};
	const formattedStartDate = selectedStartDates.start
		? formatDate(selectedStartDates.start)
		: '';
	const formattedEndDate = selectedEndDates.start
		? formatDate(selectedEndDates.start)
		: '';
	if (formattedStartDate === formattedEndDate) {
		return formattedStartDate;
	} else {
		return `${formattedStartDate} to ${formattedEndDate}`;
	}
};

export const isToday = (date: any): boolean => {
	const today = new Date();
	return date.toDateString() === today.toDateString();
};

export const generateDiscountCodes = (numberOfCodes: number, codeLength: number, prefix: string): string[] => {
	const codes: string[] = [];
	const characters: string = 'ABCDEFGHIJKLMNOPQRSTUVWXYZ0123456789';
	const generateCode = (length: number): string => {
		let code: string = prefix;
		for (let i = 0; i < length - prefix.length; i++) {
			const randomChar: string = characters.charAt(Math.floor(Math.random() * characters.length));
			code += randomChar;
		}
		return code;
	};
	for (let i = 0; i < numberOfCodes; i++) {
		codes.push(generateCode(codeLength));
	}
	return codes;
};