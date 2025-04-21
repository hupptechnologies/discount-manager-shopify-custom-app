import { useEffect, useState } from 'react';
import { useAppBridge } from '@shopify/app-bridge-react';
import {
	Box,
	Filters,
	InlineStack,
	ResourceItem,
	ResourceList,
	Scrollable,
	Thumbnail,
	type ResourceListProps,
} from '@shopify/polaris';
import { useDispatch, useSelector } from 'react-redux';
import type { AppDispatch, RootState } from 'app/redux/store';
import type { DiscountRule } from './DiscountRuleForm';
import { fetchAllCustomersAsync } from 'app/redux/create-discount';
import { getCreateDiscountDetail } from 'app/redux/create-discount/slice';
import CustomText from '../PolarisUI/CustomText';

interface Customer {
	id: string;
	name: string;
	email: string;
	image: string;
}

interface CustomerProps {
	newRule: DiscountRule;
	setNewRule: React.Dispatch<React.SetStateAction<any>>;
	reCallAPI: boolean;
	selectedItemsArray: string[];
}

const CustomersList: React.FC<CustomerProps> = ({
	newRule,
	setNewRule,
	reCallAPI,
	selectedItemsArray
}) => {
	const shopify = useAppBridge();
	const dispatch = useDispatch<AppDispatch>();
	const {
		customers,
		customerPageInfo,
		totalCustomerCount,
		isCustomersLoading,
	} = useSelector((state: RootState) => getCreateDiscountDetail(state));
	const [selectedItems, setSelectedItems] = useState<
		ResourceListProps['selectedItems']
	>([]);
	const [currentPage, setCurrentPage] = useState<number>(1);
	const [cursor, setCursor] = useState<string | undefined>(undefined);
	const [prevCursor, setPrevCursor] = useState<string | undefined>(undefined);

	const resourceName = {
		singular: 'customer',
		plural: 'customers',
	};

	const rowsCustomers: Customer[] = customers?.length > 0 ? customers : [];

	useEffect(() => {
		dispatch(
			fetchAllCustomersAsync({
				shopName: shopify.config.shop || '',
				query: newRule?.customerSearch,
			}),
		);
	}, [reCallAPI, newRule?.customerSearch]);

	useEffect(() => {
		if (customerPageInfo) {
			setCursor(customerPageInfo.endCursor);
			setPrevCursor(customerPageInfo.startCursor);
		}
	}, [customerPageInfo]);

	useEffect(() => {
		if (selectedItemsArray.length > 0) {
			setSelectedItems(selectedItemsArray);
		}
	}, [selectedItemsArray]);

	const loadMoreNext = () => {
		if (customerPageInfo?.hasNextPage) {
			dispatch(
				fetchAllCustomersAsync({
					shopName: shopify.config.shop || '',
					query: newRule?.customerSearch,
					after: cursor,
				}),
			);
			setCurrentPage((prevPage) => prevPage + 1);
		}
	};

	const loadMorePrevious = () => {
		if (customerPageInfo?.hasPreviousPage) {
			dispatch(
				fetchAllCustomersAsync({
					shopName: shopify.config.shop || '',
					query: newRule?.customerSearch,
					before: prevCursor,
				}),
			);
			setCurrentPage((prevPage) => prevPage - 1);
		}
	};

	const handleQueryChange = (value: string) => {
		setNewRule({
			...newRule,
			customerSearch: value
		});
	};

	const handleQueryClear = () => {
		setNewRule({ ...newRule, customerSearch: '' });
	};

	const handleClearAll = () => {
		setNewRule({ ...newRule, customerSearch: '' });
	};

	const handleSelectionChange = (value: string[]) => {
		const selectedObjects = rowsCustomers?.filter((row) => value.includes(row.id)).map((row) => ({
			id: row.id,
			displayName: row.name,
			email: row.email,
			image: {
				url: row.image,
			},
		}));
		setNewRule({
			...newRule,
			customers: {
				...newRule.customers,
				items: selectedObjects,
				customerIDs: value
			}
		})
		setSelectedItems(value);
	};

	const filterControl = (
		<Filters
			queryValue={newRule?.customerSearch}
			filters={[]}
			appliedFilters={[]}
			queryPlaceholder="Filter customers"
			onQueryChange={(value) => handleQueryChange(value)}
			onQueryClear={handleQueryClear}
			onClearAll={handleClearAll}
		/>
	);

	return (
		<Scrollable style={{ height: '471px' }}>
			<ResourceList
				filterControl={filterControl}
				resourceName={resourceName}
				items={rowsCustomers}
				selectable
				selectedItems={selectedItems}
				onSelectionChange={handleSelectionChange}
				renderItem={(item) => {
					const { id, image, name, email } = item;
					return (
						<ResourceItem
							id={id}
							accessibilityLabel={`View details for ${name}`}
							url=""
						>
							<InlineStack gap="200" align="start" blockAlign="center">
								<Thumbnail size="small" alt="" source={image} />
								<Box>
									<CustomText fontWeight="bold" as="span">
										{name}
									</CustomText>
									<CustomText as="p">{email}</CustomText>
								</Box>
							</InlineStack>
						</ResourceItem>
					);
				}}
				loading={isCustomersLoading}
				pagination={{
					hasPrevious: customerPageInfo?.hasPreviousPage,
					hasNext: customerPageInfo?.hasNextPage,
					onPrevious: () => loadMorePrevious(),
					onNext: () => loadMoreNext(),
					label: `Showing ${customers?.length} to ${currentPage} of ${totalCustomerCount} customers`,
				}}
			/>
		</Scrollable>
	);
};

export default CustomersList;
