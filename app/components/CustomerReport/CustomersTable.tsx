import { useState } from 'react';
import { Modal, TitleBar } from '@shopify/app-bridge-react';
import {
	IndexTable,
	LegacyCard,
	useIndexResourceState,
	Badge,
	Layout
} from '@shopify/polaris';
import { useDispatch } from 'react-redux';
import { getCustomerBySegmentIdAsync } from 'app/redux/customer';
import type { AppDispatch } from 'app/redux/store';
import type { CustomerInput } from 'app/redux/customer/slice';
import type { PageInfo } from 'app/controller/segments/fetchAllSegments';
import Placeholder from '../Placeholder';
import CustomText from '../PolarisUI/CustomText';

interface CustomersTableProps {
	segmentCustomers: CustomerInput[];
	totalCount: number;
	pageInfo: PageInfo | null;
	cursor: string | undefined;
	prevCursor: string | undefined;
	segmentId: string | null;
}

const CustomersTable: React.FC<CustomersTableProps> = ({
	segmentCustomers,
	totalCount,
	pageInfo,
	cursor,
	prevCursor,
	segmentId
}) => {
	const dispatch = useDispatch<AppDispatch>();
	const [currentPage, setCurrentPage] = useState<number>(1);
	const { selectedResources, allResourcesSelected, handleSelectionChange } = useIndexResourceState(segmentCustomers as any);	

	const resourceName = {
		singular: 'customer',
		plural: 'customers',
	};

	const promotedBulkActions = [
		{
			content: 'Delete customer',
			destructive: true,
			onAction: () => handleOpen(),
		},
	];

	const loadMoreNext = () => {
		if (pageInfo?.hasNextPage) {
			dispatch(
				getCustomerBySegmentIdAsync({
					shopName: shopify.config.shop || '',
					after: cursor,
					segmentId: `gid://shopify/Segment/${segmentId}`
				}),
			);
			setCurrentPage((prevPage) => prevPage + 1);
		}
	};

	const loadMorePrevious = () => {
		if (pageInfo?.hasPreviousPage) {
			dispatch(
				getCustomerBySegmentIdAsync({
					shopName: shopify.config.shop || '',
					before: prevCursor,
					segmentId: `gid://shopify/Segment/${segmentId}`
				}),
			);
			setCurrentPage((prevPage) => Math.max(prevPage - 1, 0));
		}
	};

	const handleOpen = () => {
		shopify.modal.show('customer-confirmation-modal');
	};

	const handleClose = () => {
		shopify.modal.hide('customer-confirmation-modal');
	};

	const rowMarkup = segmentCustomers.map(
		(
			{ id, displayName, numberOfOrders, defaultAddress, defaultEmailAddress, amountSpent },
			index,
		) => (
			<IndexTable.Row
				id={id}
				key={id}
				selected={selectedResources.includes(id)}
				position={index}
			>
				<IndexTable.Cell>
					<CustomText variant="bodyMd" fontWeight="bold" as="span">
						{displayName}
					</CustomText>
				</IndexTable.Cell>
				<IndexTable.Cell>
					<Badge tone={defaultEmailAddress?.marketingState === 'SUBSCRIBED' ? 'success' : 'new'}>{defaultEmailAddress?.marketingState}</Badge>
				</IndexTable.Cell>
				<IndexTable.Cell>{defaultAddress ? `${defaultAddress?.city} ${defaultAddress?.province}, ${defaultAddress?.country}` : 'Not found'}</IndexTable.Cell>
				<IndexTable.Cell>{numberOfOrders} orders</IndexTable.Cell>
				<IndexTable.Cell>
					₹{amountSpent?.amount}
				</IndexTable.Cell>
			</IndexTable.Row>
		),
	);

	return (
		<LegacyCard>
			<IndexTable
				resourceName={resourceName}
				itemCount={segmentCustomers?.length}
				selectedItemsCount={
					allResourcesSelected ? 'All' : selectedResources.length
				}
				onSelectionChange={handleSelectionChange}
				headings={[
					{ title: 'Customer name' },
					{ title: 'Email subscription' },
					{ title: 'Location' },
					{ title: 'Orders' },
					{ title: 'Amount spent' }
				]}
				pagination={{
					hasPrevious: pageInfo?.hasPreviousPage,
					hasNext: pageInfo?.hasNextPage,
					onPrevious: () => loadMorePrevious(),
					onNext: () => loadMoreNext(),
					label: `Showing ${segmentCustomers?.length} to ${currentPage} of ${totalCount} customers`,
				}}
				promotedBulkActions={promotedBulkActions}
			>
				{rowMarkup}
			</IndexTable>
			<Modal id="customer-confirmation-modal">
				<Layout.Section>
					<CustomText as="p" tone="subdued" truncate>
						Are you sure you want to delete this customer?
					</CustomText>
				</Layout.Section>
				<Placeholder height="5px" />
				<TitleBar title='Delete customer'>
					<button variant="primary" tone="critical">
						Delete
					</button>
					<button onClick={handleClose}>Cancel</button>
				</TitleBar>
			</Modal>
		</LegacyCard>
	);
};

export default CustomersTable;
