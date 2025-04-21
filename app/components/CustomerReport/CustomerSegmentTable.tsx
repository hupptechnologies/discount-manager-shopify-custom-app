import { useState, useCallback } from 'react';
import { Modal, TitleBar } from '@shopify/app-bridge-react';
import { useNavigate } from '@remix-run/react';
import {
	IndexTable,
	LegacyCard,
	IndexFilters,
	useSetIndexFiltersMode,
	useIndexResourceState,
	useBreakpoints,
	Layout,
} from '@shopify/polaris';
import type { IndexFiltersProps } from '@shopify/polaris';
import { useDispatch, useSelector } from 'react-redux';
import { SegmentFields, getAllCustomerDetail, handleSetSegmentName } from 'app/redux/customer/slice';
import { fetchAllSegmentsAsync } from 'app/redux/customer';
import type { AppDispatch, RootState } from 'app/redux/store';
import type { PageInfo } from 'app/controller/segments/fetchAllSegments';
import Placeholder from '../Placeholder';
import CustomText from '../shopify/CustomText';

interface CustomerSegmentTableProps {
	segments: SegmentFields[];
	totalCount: number;
	pageInfo: PageInfo | null;
	cursor: string | undefined;
	prevCursor: string | undefined;
	setQueryValue: any;
	queryValue: string;
}

const CustomerSegmentTable: React.FC<CustomerSegmentTableProps> = ({
	segments,
	totalCount,
	pageInfo,
	cursor,
	prevCursor,
	setQueryValue,
	queryValue
}) => {
	const navigate = useNavigate();
	const { segmentName } = useSelector((state: RootState) => getAllCustomerDetail(state));
	const dispatch = useDispatch<AppDispatch>();
	const [currentPage, setCurrentPage] = useState<number>(1);
	const [selected, setSelected] = useState(0);
	const [sortSelected, setSortSelected] = useState(['customer asc']);
	const sortOptions: IndexFiltersProps['sortOptions'] = [
		{ label: 'Customer', value: 'customer asc', directionLabel: 'A-Z' },
		{ label: 'Customer', value: 'customer desc', directionLabel: 'Z-A' }
	];
	const { mode, setMode } = useSetIndexFiltersMode();
	const { selectedResources, allResourcesSelected, handleSelectionChange } = useIndexResourceState(segments as any);

	const resourceName = {
		singular: 'segment',
		plural: 'segments',
	};

	const promotedBulkActions = [
		{
			content: 'Delete segment',
			destructive: true,
			onAction: () => handleOpen(),
		},
	];

	const handleFiltersQueryChange = useCallback(
		(value: string) => setQueryValue(value),
		[],
	);

	const handleQueryValueRemove = useCallback(() => setQueryValue(''), []);
	
	const loadMoreNext = () => {
		if (pageInfo?.hasNextPage) {
			dispatch(
				fetchAllSegmentsAsync({
					shopName: shopify.config.shop || '',
					query: queryValue,
					after: cursor,
				}),
			);
			setCurrentPage((prevPage) => prevPage + 1);
		}
	};

	const loadMorePrevious = () => {
		if (pageInfo?.hasPreviousPage) {
			dispatch(
				fetchAllSegmentsAsync({
					shopName: shopify.config.shop || '',
					query: queryValue,
					before: prevCursor,
				}),
			);
			setCurrentPage((prevPage) => Math.max(prevPage - 1, 0));
		}
	};

	const handleNavigate = (url: string) => {
		navigate(url);
	};

	const handleOpen = () => {
		shopify.modal.show('confirmation-modal');
	};

	const handleClose = () => {
		shopify.modal.hide('confirmation-modal');
	};

	const rowMarkup = segments.map(
		(
			{ id, name, lastEditDate, percentage },
			index,
		) => (
			<IndexTable.Row
				id={id}
				key={id}
				selected={selectedResources.includes(id)}
				position={index}
				onClick={() => {
					dispatch(handleSetSegmentName({ name }))
					handleNavigate(`/app/customers/${id.split('/').pop()}`);
				}}
			>
				<IndexTable.Cell>
					<CustomText variant="bodyMd" fontWeight="bold" as="span">
						{name}
					</CustomText>
				</IndexTable.Cell>
				<IndexTable.Cell>{percentage}%</IndexTable.Cell>
				<IndexTable.Cell>{lastEditDate}</IndexTable.Cell>
				<IndexTable.Cell>
					App
				</IndexTable.Cell>
			</IndexTable.Row>
		),
	);

	const confirmationTitle = selectedResources?.length === 1 ? segments?.filter((item) => item?.id === selectedResources[0])[0]?.name : `Delete ${selectedResources?.length} segments`;

	return (
		<LegacyCard>
			<IndexFilters
				sortOptions={sortOptions}
				sortSelected={sortSelected}
				queryValue={queryValue}
				queryPlaceholder="Searching in all"
				onQueryChange={handleFiltersQueryChange}
				onQueryClear={handleQueryValueRemove}
				onSort={setSortSelected}
				cancelAction={{
					onAction: handleQueryValueRemove,
					disabled: false,
					loading: false,
				}}
				tabs={[]}
				selected={selected}
				onSelect={setSelected}
				canCreateNewView={false}
				filters={[]}
				appliedFilters={[]}
				onClearAll={handleQueryValueRemove}
				mode={mode}
				setMode={setMode}
			/>
			<IndexTable
				condensed={useBreakpoints().smDown}
				resourceName={resourceName}
				itemCount={segments.length}
				selectedItemsCount={
					allResourcesSelected ? 'All' : selectedResources.length
				}
				onSelectionChange={handleSelectionChange}
				headings={[
					{ title: 'Name' },
					{ title: '% of customers' },
					{ title: 'Last activity' },
					{ title: 'Author' }
				]}
				pagination={{
					hasPrevious: pageInfo?.hasPreviousPage,
					hasNext: pageInfo?.hasNextPage,
					onPrevious: () => loadMorePrevious(),
					onNext: () => loadMoreNext(),
					label: `Showing ${segments?.length} to ${currentPage} of ${totalCount} segments`,
				}}
				promotedBulkActions={promotedBulkActions}
			>
				{rowMarkup}
			</IndexTable>
			<Modal id="confirmation-modal">
				<Layout.Section>
					<CustomText as="p" tone="subdued" truncate>
						Are you sure you want to delete the segment Customers who have purchased at least once?
					</CustomText>
					<CustomText as="p" tone="subdued" truncate>
						No customer profiles will be deleted, only the segment will be removed.
					</CustomText>
				</Layout.Section>
				<Placeholder height="5px" />
				<TitleBar title={confirmationTitle + '?'}>
					<button variant="primary" tone="critical">
						Delete segment
					</button>
					<button onClick={handleClose}>Cancel</button>
				</TitleBar>
			</Modal>
		</LegacyCard>
	);
};

export default CustomerSegmentTable;
