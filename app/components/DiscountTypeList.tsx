import { useNavigate } from '@remix-run/react';
import {
	ResourceItem,
	Box,
	ResourceList,
	Text,
	Icon,
	InlineStack,
	Badge,
} from '@shopify/polaris';
import {
	ChevronRightIcon,
	ProductIcon,
	OrderIcon,
	DeliveryIcon,
} from '@shopify/polaris-icons';
import { useDispatch } from 'react-redux';
import type { AppDispatch } from 'app/redux/store';
import { handleResetGetDiscountCode } from 'app/redux/discount/slice';

const DiscountTypeList = () => {
	const dispatch = useDispatch<AppDispatch>();
	const navigate = useNavigate();
	const discountTypes = [
		{
			id: '1',
			url: '/app/create-discount?type=products',
			title: 'Amount off products',
			description: 'Discount specific products or collections of products',
			badge: <Badge icon={ProductIcon}>Product discount</Badge>,
		},
		{
			id: '2',
			url: '/app/create-discount?type=buyXgetY',
			title: 'Buy X get Y',
			description: 'Discount products based on a customer’s purchase',
			badge: <Badge icon={ProductIcon}>Product discount</Badge>,
		},
		{
			id: '3',
			url: '/app/create-discount?type=order',
			title: 'Amount off orders',
			description: 'Discount the total order amount',
			badge: <Badge icon={OrderIcon}>Order discount</Badge>,
		},
		{
			id: '4',
			url: '/app/create-discount?type=shipping',
			title: 'Free Shipping',
			description: 'Offer free shipping on an order',
			badge: <Badge icon={DeliveryIcon}>Shipping discount</Badge>,
		},
	];

	return (
		<ResourceList
			resourceName={{ singular: 'customer', plural: 'customers' }}
			items={discountTypes}
			renderItem={(item) => {
				const { id, url, title, description, badge } = item;

				return (
					<ResourceItem
						id={id}
						accessibilityLabel={`View details for ${title}`}
						onClick={() => {
							dispatch(handleResetGetDiscountCode());
							navigate(url);
						}}
					>
						<InlineStack align="space-between" blockAlign="center" gap="200">
							<Box>
								<Text variant="bodyMd" fontWeight="bold" as="h3">
									{title}
								</Text>
								<div>{description}</div>
							</Box>
							<Box>
								<InlineStack align="center" blockAlign="center" gap="200">
									{badge}
									<Icon source={ChevronRightIcon} tone="base" />
								</InlineStack>
							</Box>
						</InlineStack>
					</ResourceItem>
				);
			}}
		/>
	);
};

export default DiscountTypeList;
