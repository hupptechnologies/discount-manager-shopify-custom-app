import { useState, useCallback } from 'react';
import { useNavigate } from '@remix-run/react';
import {
	IndexTable,
	LegacyCard,
	IndexFilters,
	useSetIndexFiltersMode,
	useIndexResourceState,
	Text,
	useBreakpoints,
} from '@shopify/polaris';
import type { IndexFiltersProps } from '@shopify/polaris';
import { useDispatch } from 'react-redux';
import { SegmentFields, handleSetSegmentName } from 'app/redux/customer/slice';
import { fetchAllSegmentsAsync } from 'app/redux/customer';
import type { AppDispatch } from 'app/redux/store';
import type { PageInfo } from 'app/controller/segments/fetchAllSegments';

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
	const dispatch = useDispatch<AppDispatch>();
	const [currentPage, setCurrentPage] = useState<number>(1);
	const [selected, setSelected] = useState(0);
	const sortOptions: IndexFiltersProps['sortOptions'] = [
		{ label: 'Customer', value: 'customer asc', directionLabel: 'A-Z' },
		{ label: 'Customer', value: 'customer desc', directionLabel: 'Z-A' }
	];
	const [sortSelected, setSortSelected] = useState(['customer asc']);
	const { mode, setMode } = useSetIndexFiltersMode();

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

	const resourceName = {
		singular: 'segment',
		plural: 'segments',
	};

	const { selectedResources, allResourcesSelected, handleSelectionChange } = useIndexResourceState(segments as any);

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
					<Text variant="bodyMd" fontWeight="bold" as="span">
						{name}
					</Text>
				</IndexTable.Cell>
				<IndexTable.Cell>{percentage}%</IndexTable.Cell>
				<IndexTable.Cell>{lastEditDate}</IndexTable.Cell>
				<IndexTable.Cell>
					App
				</IndexTable.Cell>
			</IndexTable.Row>
		),
	);

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
			>
				{rowMarkup}
			</IndexTable>
		</LegacyCard>
	);
};

export default CustomerSegmentTable;
