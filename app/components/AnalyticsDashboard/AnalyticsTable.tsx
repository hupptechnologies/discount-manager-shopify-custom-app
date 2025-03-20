import { useState, useCallback, useEffect } from 'react';
import { useAppBridge } from '@shopify/app-bridge-react';
import pkg from 'lodash';
import {
	IndexTable,
	LegacyCard,
	IndexFilters,
	useSetIndexFiltersMode,
	useIndexResourceState,
	Text,
	Badge,
	useBreakpoints,
	type IndexFiltersProps,
	type TabProps,
} from '@shopify/polaris';
import { useDispatch, useSelector } from 'react-redux';
import { AppDispatch, RootState } from 'app/redux/store';
import { getAllDiscountCodeDetail } from 'app/redux/discount/slice';
import { fetchAllDiscountCodesAsync } from 'app/redux/discount';
import { formatDateWithTime } from 'app/utils/json';

const AnalyticsTable = () => {
	const { debounce } = pkg;
	const { mode, setMode } = useSetIndexFiltersMode();
	const shopify = useAppBridge();
	const dispatch = useDispatch<AppDispatch>();
	const { discountCodes, isLoading, pagination: { totalPages, totalCount } } = useSelector((state: RootState) => getAllDiscountCodeDetail(state));
	const [queryValue, setQueryValue] = useState('');
	const [itemStrings, setItemStrings] = useState([
		'All',
		'Active codes',
		'Pending codes',
		'Used codes',
	]);
	const [selected, setSelected] = useState(0);
	const [currentPage, setCurrentPage] = useState(1);
	const [sortSelected, setSortSelected] = useState(['discountCode asc']);

	const limit = 10;
	const sortOptions: IndexFiltersProps['sortOptions'] = [
		{
			label: 'Discount Code',
			value: 'discountCode asc',
			directionLabel: 'Ascending',
		},
		{
			label: 'Discount Code',
			value: 'discountCode desc',
			directionLabel: 'Descending',
		},
	];
	
	const debouncedHandleFetch = useCallback(
		debounce((queryValue, selected, currentPage, sortSelected) => {
			dispatch(fetchAllDiscountCodesAsync({
				page: currentPage,
				pageSize: String(limit),
				shopName: shopify.config.shop || '',
				searchQuery: queryValue,
				usedCountGreaterThan: selected === 3 && 1 || null,
				orderByCode: sortSelected.includes('discountCode asc') ? 'asc' : 'desc',
				status: selected === 1 && 'active' || selected === 2 && 'pending' || null
			}));
		}, 300),
		[],
	);

	useEffect(() => {
		debouncedHandleFetch(queryValue, selected, currentPage, sortSelected)
	}, [queryValue, selected, currentPage, limit, sortSelected]);

	const tabs: TabProps[] = itemStrings.map((item, index) => ({
		content: item,
		index,
		onAction: () => {},
		id: `${item}-${index}`,
		isLocked: index === 0,
	}));
	const onHandleCancel = () => {
		setQueryValue('')
	};

	const handleFiltersQueryChange = useCallback(
		(value: string) => setQueryValue(value),
		[],
	);
	const handleQueryValueRemove = useCallback(() => {
		onHandleCancel();
	}, []);
	const handleFiltersClearAll = useCallback(() => {
		handleQueryValueRemove();
	}, [
		handleQueryValueRemove
	]);

	const resourceName = {
		singular: 'discountCode',
		plural: 'discountCodes',
	};
	
	const { selectedResources, allResourcesSelected, handleSelectionChange } = useIndexResourceState(discountCodes as any[]);

	const rowMarkup = discountCodes?.length > 0 && discountCodes.map(
		(
			{ id, code, discountAmount, usageLimit, isActive, startDate, endDate, createdAt },
			index,
		) => (
			<IndexTable.Row
				id={String(id)}
				key={id}
				selected={selectedResources.includes(String(id))}
				position={index}
			>
				<IndexTable.Cell>
					<Text variant="bodyMd" fontWeight="bold" as="span">
						{code}
					</Text>
				</IndexTable.Cell>
				<IndexTable.Cell>{discountAmount}</IndexTable.Cell>
				<IndexTable.Cell>Summer Collection</IndexTable.Cell>
				<IndexTable.Cell>
					<Text as="span" alignment="start">
						{usageLimit}
					</Text>
				</IndexTable.Cell>
				<IndexTable.Cell>
					<Badge
						tone={
							isActive
								? 'success'
								:'info'
						}
					>
						{isActive ? 'Active' : 'Pending'}
					</Badge>
				</IndexTable.Cell>
				<IndexTable.Cell>{formatDateWithTime(startDate)}</IndexTable.Cell>
				<IndexTable.Cell>{formatDateWithTime(endDate)}</IndexTable.Cell>
				<IndexTable.Cell>{formatDateWithTime(createdAt)}</IndexTable.Cell>
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
					onAction: onHandleCancel,
					disabled: false,
					loading: false,
				}}
				tabs={tabs}
				selected={selected}
				onSelect={(index) => {
					setCurrentPage(1);
					setSelected(index);
				}}
				canCreateNewView={false}
				filters={[]}
				appliedFilters={[]}
				onClearAll={handleFiltersClearAll}
				mode={mode}
				loading={isLoading}
				setMode={setMode}
			/>
			<IndexTable
				condensed={useBreakpoints().smDown}
				resourceName={resourceName}
				itemCount={discountCodes.length}
				selectedItemsCount={
					allResourcesSelected ? 'All' : selectedResources.length
				}
				onSelectionChange={handleSelectionChange}
				headings={[
					{ title: 'Discount Code' },
					{ title: 'Discount Percentage' },
					{ title: 'Applicable Products' },
					{ title: 'Usage Limit' },
					{ title: 'Status' },
					{ title: 'Start Date' },
					{ title: 'End Date' },
					{ title: 'Created At' },
				]}
				pagination={{
					hasPrevious: currentPage > 1,
					hasNext: currentPage < totalPages,
					onPrevious: () => setCurrentPage((prev) => prev - 1),
					onNext: () => setCurrentPage((prev) => prev + 1),
					label: `Showing ${(currentPage - 1) * limit + 1} to ${Math.min(currentPage * limit, totalCount)} of ${totalCount} codes`
				}}
			>
				{rowMarkup}
			</IndexTable>
		</LegacyCard>
	);

	function disambiguateLabel (key: string, value: string | any[]): string {
		switch (key) {
			case 'moneySpent':
				return `Money spent is between $${value[0]} and $${value[1]}`;
			case 'taggedWith':
				return `Tagged with ${value}`;
			case 'accountStatus':
				return (value as string[]).map((val) => `Customer ${val}`).join(', ');
			default:
				return value as string;
		}
	}

	function isEmpty (value: string | string[]): boolean {
		if (Array.isArray(value)) {
			return value.length === 0;
		} else {
			return value === '' || value === null;
		}
	}
};

export default AnalyticsTable;
