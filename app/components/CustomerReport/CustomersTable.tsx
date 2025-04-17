import { useState, useCallback } from 'react';
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
import { customersList } from 'app/utils/json';

const CustomersTable = () => {
	const sleep = (ms: number) => new Promise((resolve) => setTimeout(resolve, ms));

	const [selected, setSelected] = useState(0);
	const onCreateNewView = async (value: string) => {
		await sleep(500);
		return true;
	};
	const sortOptions: IndexFiltersProps['sortOptions'] = [
		{ label: 'Customer', value: 'customer asc', directionLabel: 'A-Z' },
		{ label: 'Customer', value: 'customer desc', directionLabel: 'Z-A' }
	];
	const [sortSelected, setSortSelected] = useState(['customer asc']);
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

	const customers = customersList;

	const resourceName = {
		singular: 'customer',
		plural: 'customers',
	};

	const { selectedResources, allResourcesSelected, handleSelectionChange } =
		useIndexResourceState(customers);

	const rowMarkup = customers.map(
		(
			{ id, name, lastEditDate },
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
						{name}
					</Text>
				</IndexTable.Cell>
				<IndexTable.Cell>15%</IndexTable.Cell>
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
				onQueryClear={() => setQueryValue('')}
				onSort={setSortSelected}
				cancelAction={{
					onAction: onHandleCancel,
					disabled: false,
					loading: false,
				}}
				tabs={[]}
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
				itemCount={customers.length}
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
					label: 'Total customers 10'
				}}
			>
				{rowMarkup}
			</IndexTable>
		</LegacyCard>
	);

	function disambiguateLabel(key: string, value: string | any[]): string {
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

	function isEmpty(value: string | string[]): boolean {
		if (Array.isArray(value)) {
			return value.length === 0;
		} else {
			return value === '' || value == null;
		}
	}
};

export default CustomersTable;
