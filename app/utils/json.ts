export const collectionData = [
	{
		id: '1',
		title: 'Collection Accessories',
		productCount: 20,
		image:
			'https://cdn.shopify.com/s/files/1/0723/3277/1569/collections/Main_200x200.jpg?v=1737541820',
	},
	{
		id: '2',
		title: 'Collection of Fashion',
		productCount: 20,
		image: '',
	},
	{
		id: '3',
		title: 'Smart Products Filter Index - Do not delete',
		productCount: 20,
		image: '',
	},
];

export const productData = [
	{
		id: '1',
		quantity: 1,
		price: '$200',
		image:
			'https://cdn.shopify.com/s/files/1/0723/3277/1569/files/kids-beanie_200x200.jpg?v=1737961620',
		variant: 'Grey / Jute',
		title: 'Example Hat',
	},
	{
		id: '2',
		quantity: 2,
		price: '$400',
		variant: 'Grey / Leather',
		title: 'Example Hat',
	},
	{
		id: '3',
		quantity: 3,
		price: '$400',
		variant: 'Grey / Latex',
		title: 'Example Hat',
	},
	{
		id: '4',
		quantity: 4,
		price: '$400',
		variant: 'Grey / Fur',
		title: 'Example Hat',
	},
	{
		id: '5',
		quantity: 5,
		price: '$400',
		variant: 'Grey / Fleece',
		title: 'Example Hat',
	},
	{
		id: '6',
		quantity: 6,
		price: '$400',
		variant: 'Grey / Flannel',
		title: 'Example Hat',
	},
	{
		id: '8',
		quantity: 8,
		price: '$240',
		image:
			'https://cdn.shopify.com/s/files/1/0723/3277/1569/files/green-t-shirt_200x200.jpg?v=1737961612',
		variant: 'Lithograph - Height: 9" x Width: 12"',
		title: 'Example T-Shirt',
	},
	{
		id: '9',
		quantity: 9,
		price: '$240',
		variant: 'Small',
		title: 'Example T-Shirt',
	},
	{
		id: '10',
		quantity: 10,
		price: '$240',
		variant: 'Medium',
		title: 'Example T-Shirt',
	},
];

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

export const generateTimeList = () => {
	const timeList = [];
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