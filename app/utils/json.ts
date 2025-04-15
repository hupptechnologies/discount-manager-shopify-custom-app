import { DateTime } from 'luxon';

interface DateRange {
	start: Date | null;
	end?: Date | null;
}

/**
	* Generates a list of time strings in 30-minute intervals from 1:00 AM to 12:30 PM.
	* Example: ['1:00 AM', '1:30 AM', ..., '12:30 PM']
*/
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

/**
	* Formats a JS Date object into 'YYYY-MM-DD' format.
*/
export const getYearMonthDay = (date: any): string => {
	const year = date?.getFullYear();
	const month = (date?.getMonth() + 1).toString().padStart(2, '0');
	const day = date?.getDate().toString().padStart(2, '0');
	return `${year}-${month}-${day}`;
};

/**
	* Formats a date string into 'YYYY-MM-DD' format (without time).
*/
export const formatDateWithTime = (dateString: string): string => {
	const date = new Date(dateString);
	const year = date?.getFullYear();
	const month = (date?.getMonth() + 1).toString().padStart(2, '0');
	const day = date?.getDate().toString().padStart(2, '0');
	return `${year}-${month}-${day}`;
};

/**
	* Combines a date and time string into an ISO timestamp in 'Asia/Kolkata' timezone.
	* Example input: ('2024-04-15', '4:30 PM') => '2024-04-15T11:00:00.000Z'
*/
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

/**
	* Converts UTC ISO start and end timestamps to local Date objects and time strings in 'Asia/Kolkata' timezone.
*/
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

/**
	* Generates a single random discount code with a random prefix and percentage.
 * Example: 'WINTER25%'
*/
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

/**
	* Formats a date range into a human-readable string.
	* Example: '12 Apr to 15 Apr' or '14 Apr' (if same day)
*/
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

/**
	* Checks whether a given date is today.
*/
export const isToday = (date: any): boolean => {
	const today = new Date();
	return date.toDateString() === today.toDateString();
};

/**
	* Generates an array of random discount codes with a specific prefix and length.
	* 
	* @param numberOfCodes Number of codes to generate
	* @param codeLength Total length of each code (including prefix)
	* @param prefix Code prefix (e.g., 'SALE')
	* 
	* Example: generateDiscountCodes(2, 10, 'SALE') => ['SALE8F92XZ', 'SALE23JQ9D']
*/
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