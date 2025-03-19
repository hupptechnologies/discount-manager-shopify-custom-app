import { useState, useCallback } from 'react';
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
import { discountCodeData } from 'app/utils/json';

const AnalyticsTable = () => {
	const sleep = (ms: number) =>
		new Promise((resolve) => setTimeout(resolve, ms));
	const [itemStrings, setItemStrings] = useState([
		'All',
		'Active',
		'Expire',
		'Used',
	]);

	const tabs: TabProps[] = itemStrings.map((item, index) => ({
		content: item,
		index,
		onAction: () => {},
		id: `${item}-${index}`,
		isLocked: index === 0,
	}));
	const [selected, setSelected] = useState(0);
	const onCreateNewView = async (value: string) => {
		await sleep(500);
		setItemStrings([...itemStrings, value]);
		setSelected(itemStrings.length);
		return true;
	};
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
		{ label: 'Product', value: 'product asc', directionLabel: 'A-Z' },
		{ label: 'Product', value: 'product desc', directionLabel: 'Z-A' },
		{ label: 'Date Applied', value: 'dateApplied asc', directionLabel: 'A-Z' },
		{ label: 'Date Applied', value: 'dateApplied desc', directionLabel: 'Z-A' },
		{
			label: 'Discount Amount',
			value: 'discountAmount asc',
			directionLabel: 'Ascending',
		},
		{
			label: 'Discount Amount',
			value: 'discountAmount desc',
			directionLabel: 'Descending',
		},
	];
	const [sortSelected, setSortSelected] = useState(['discountAmount asc']);
	const { mode, setMode } = useSetIndexFiltersMode();
	const onHandleCancel = () => {};

	const [accountStatus, setAccountStatus] = useState<string[] | undefined>(
		undefined,
	);
	const [moneySpent, setMoneySpent] = useState<[number, number] | undefined>(
		undefined,
	);
	const [taggedWith, setTaggedWith] = useState('');
	const [queryValue, setQueryValue] = useState('');

	const handleFiltersQueryChange = useCallback(
		(value: string) => setQueryValue(value),
		[],
	);
	const handleAccountStatusRemove = useCallback(
		() => setAccountStatus(undefined),
		[],
	);
	const handleMoneySpentRemove = useCallback(
		() => setMoneySpent(undefined),
		[],
	);
	const handleTaggedWithRemove = useCallback(() => setTaggedWith(''), []);
	const handleQueryValueRemove = useCallback(() => setQueryValue(''), []);
	const handleFiltersClearAll = useCallback(() => {
		handleAccountStatusRemove();
		handleMoneySpentRemove();
		handleTaggedWithRemove();
		handleQueryValueRemove();
	}, [
		handleAccountStatusRemove,
		handleMoneySpentRemove,
		handleQueryValueRemove,
		handleTaggedWithRemove,
	]);

	const appliedFilters: IndexFiltersProps['appliedFilters'] = [];
	if (accountStatus && !isEmpty(accountStatus)) {
		const key = 'accountStatus';
		appliedFilters.push({
			key,
			label: disambiguateLabel(key, accountStatus),
			onRemove: handleAccountStatusRemove,
		});
	}
	if (moneySpent) {
		const key = 'moneySpent';
		appliedFilters.push({
			key,
			label: disambiguateLabel(key, moneySpent),
			onRemove: handleMoneySpentRemove,
		});
	}
	if (!isEmpty(taggedWith)) {
		const key = 'taggedWith';
		appliedFilters.push({
			key,
			label: disambiguateLabel(key, taggedWith),
			onRemove: handleTaggedWithRemove,
		});
	}

	const discountCodes = discountCodeData;
	const resourceName = {
		singular: 'discountCode',
		plural: 'discountCodes',
	};

	const { selectedResources, allResourcesSelected, handleSelectionChange } =
		useIndexResourceState(discountCodes);

	const rowMarkup = discountCodes.map(
		(
			{ id, code, discount, products, limit, status, startDate, endDate },
			index,
		) => (
			<IndexTable.Row
				id={id}
				key={id}
				selected={selectedResources.includes(id)}
				position={index}
			>
				<IndexTable.Cell>
					<Text variant="bodyMd" fontWeight="bold" as="span">
						{code}
					</Text>
				</IndexTable.Cell>
				<IndexTable.Cell>{discount}</IndexTable.Cell>
				<IndexTable.Cell>{products}</IndexTable.Cell>
				<IndexTable.Cell>
					<Text as="span" alignment="start">
						{limit}
					</Text>
				</IndexTable.Cell>
				<IndexTable.Cell>
					<Badge
						tone={
							status === 'Active'
								? 'success'
								: status === 'Pending'
									? 'info'
									: 'warning'
						}
					>
						{status}
					</Badge>
				</IndexTable.Cell>
				<IndexTable.Cell>{startDate}</IndexTable.Cell>
				<IndexTable.Cell>{endDate}</IndexTable.Cell>
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
				onQueryClear={() => setQueryValue('')}
				onSort={setSortSelected}
				cancelAction={{
					onAction: onHandleCancel,
					disabled: false,
					loading: false,
				}}
				tabs={tabs}
				selected={selected}
				onSelect={setSelected}
				canCreateNewView={false}
				onCreateNewView={onCreateNewView}
				filters={[]}
				appliedFilters={[]}
				onClearAll={handleFiltersClearAll}
				mode={mode}
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
				]}
				pagination={{
					hasNext: true,
					onNext: () => {},
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
