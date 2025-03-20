export const discountCodeData = [
	{
		id: '1',
		code: 'SAVE10',
		discount: '10%',
		products: 'All Products',
		limit: 100,
		status: 'Active',
		startDate: '2025-03-01',
		endDate: '2025-04-01',
	},
	{
		id: '2',
		code: 'SUMMER20',
		discount: '20%',
		products: 'Summer Collection',
		limit: 50,
		status: 'Active',
		startDate: '2025-06-01',
		endDate: '2025-06-30',
	},
	{
		id: '3',
		code: 'WINTER15',
		discount: '15%',
		products: 'Winter Jackets',
		limit: 'Unlimited',
		status: 'Expired',
		startDate: '2024-12-01',
		endDate: '2024-12-31',
	},
	{
		id: '4',
		code: 'BLACKFRIDAY',
		discount: '30%',
		products: 'Electronics',
		limit: 200,
		status: 'Pending',
		startDate: '2025-11-01',
		endDate: '2025-11-30',
	},
];

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