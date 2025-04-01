import { Fragment, useEffect, useState } from 'react';
import { useAppBridge } from '@shopify/app-bridge-react';
import {
	Text,
	useIndexResourceState,
	IndexTable,
	Thumbnail,
	InlineStack,
	Scrollable,
	type IndexTableRowProps,
	type IndexTableProps,
	Filters,
	Spinner,
} from '@shopify/polaris';
import { useDispatch, useSelector } from 'react-redux';
import type { AppDispatch, RootState } from 'app/redux/store';
import type { DiscountRule } from './DiscountRuleForm';
import { fetchAllProductsAsync } from 'app/redux/create-discount';
import { getCreateDiscountDetail } from 'app/redux/create-discount/slice';

interface Product {
	id: string;
	quantity: number;
	price: string;
	variant: string;
	title: string;
	image?: string;
	disabled?: boolean;
	variantsCount: object | null;
};

interface ProductRow extends Product {
	position: number;
};

interface ProductGroup {
	id: string;
	position: number;
	products: ProductRow[];
};

interface Groups {
	[key: string]: ProductGroup;
};

interface ProductProps {
	newRule: DiscountRule;
	setNewRule: React.Dispatch<React.SetStateAction<any>>;
	selected: number;
};

const ProductsList: React.FC<ProductProps> = ({ newRule, setNewRule, selected }) => {
	const shopify = useAppBridge();
	const dispatch = useDispatch<AppDispatch>();
	const { products, pageInfo, totalProductCount, isLoading } = useSelector(
		(state: RootState) => getCreateDiscountDetail(state),
	);
	const [currentPage, setCurrentPage] = useState<number>(1);
	const [cursor, setCursor] = useState<string | undefined>(undefined);
	const [prevCursor, setPrevCursor] = useState<string | undefined>(undefined);
	const rowsProduct: Product[] = products?.length > 0 ? products : [];

	const columnHeadings = [
		{ title: 'Products' },
		{
			title: 'Total available',
		},
		{
			alignment: 'end',
			title: 'Price',
		},
		{},
	];

	useEffect(() => {
		dispatch(
			fetchAllProductsAsync({
				shopName: shopify.config.shop || '',
				query: newRule?.searchType === 'one' ? newRule?.searchOne : newRule?.searchTwo,
				id: ''
			}),
		);
	}, [newRule?.searchOne, newRule?.searchTwo]);

	useEffect(() => {
		if (pageInfo) {
			setCursor(pageInfo.endCursor);
			setPrevCursor(pageInfo.startCursor);
		}
	}, [pageInfo]);

	const loadMoreNext = () => {
		if (pageInfo?.hasNextPage) {
			dispatch(
				fetchAllProductsAsync({
					shopName: shopify.config.shop || '',
					query:
						newRule?.searchType === 'one'
							? newRule?.searchOne
							: newRule?.searchTwo,
					after: cursor,
					id: ''
				}),
			);
			setCurrentPage((prevPage) => prevPage + 1);
		}
	};

	const loadMorePrevious = () => {
		if (pageInfo?.hasPreviousPage) {
			dispatch(
				fetchAllProductsAsync({
					shopName: shopify.config.shop || '',
					query:
						newRule?.searchType === 'one'
							? newRule?.searchOne
							: newRule?.searchTwo,
					before: prevCursor,
					id: ''
				}),
			);
			setCurrentPage((prevPage) => prevPage - 1);
		}
	};

	const groupRowsByGroupKey = (
		groupKey: keyof Product,
		resolveId: (groupVal: string) => string,
	) => {
		let position = -1;
		const groups: Groups = rowsProduct.reduce(
			(groups: Groups, product: Product) => {
				const groupVal: string = product[groupKey] as string;
				if (!groups[groupVal]) {
					position += 1;

					groups[groupVal] = {
						position,
						products: [],
						id: resolveId(groupVal),
					};
				}
				groups[groupVal].products.push({
					...product,
					position: position + 1,
				});

				position += 1;
				return groups;
			},
			{},
		);

		return groups;
	};

	const resourceName = {
		singular: 'product',
		plural: 'products',
	};

	const { selectedResources, allResourcesSelected, handleSelectionChange } =
		useIndexResourceState(
			rowsProduct as unknown as { [key: string]: unknown }[],
			{
				resourceFilter: ({ disabled }) => !disabled,
			},
		);
	useEffect(() => {
		if (selectedResources.length > 0) {
			const selectedObjects = rowsProduct.filter((row) => selectedResources.includes(row.id))
				.map((row) => ({
					node: {
						id: row.id,
						product: {
							title: row.title,
							variantsCount: row.variantsCount,
							featuredMedia: {
								preview: {
									image: { url: row.image },
								},
							},
						},
					},
				}
			));
			if (selected === 0) {
				setNewRule({ ...newRule, customerGets: { ...newRule.customerGets, collectionIDs: [], productIDs: selectedResources, items: selectedObjects } });
			}
			if (selected === 1) {
				setNewRule({ ...newRule, customerBuys: { ...newRule.customerBuys, collectionIDs: [], productIDs: selectedResources, items: selectedObjects } });
			}
		}
	}, [selectedResources, selected]);

	const groupedProducts = groupRowsByGroupKey(
		'title',
		(title) => `color--${title.toLowerCase()}`,
	);

	const rowMarkup = Object.keys(groupedProducts).map((title, index) => {
		const { products, position, id: productId } = groupedProducts[title];

		let selected: IndexTableRowProps['selected'] = false;

		const someProductsSelected = products.some(({ id }) =>
			selectedResources.includes(id),
		);

		const allProductsSelected = products.every(({ id }) =>
			selectedResources.includes(id),
		);

		if (allProductsSelected) {
			selected = true;
		} else if (someProductsSelected) {
			selected = 'indeterminate';
		}

		const selectableRows = rowsProduct.filter(({ disabled }) => !disabled);
		const rowRange: IndexTableRowProps['selectionRange'] = [
			selectableRows.findIndex((row) => row.id === products[0].id),
			selectableRows.findIndex(
				(row) => row.id === products[products.length - 1].id,
			),
		];

		const disabled = products.every(({ disabled }) => disabled);

		return (
			<Fragment key={productId}>
				<IndexTable.Row
					rowType="data"
					selectionRange={rowRange}
					id={`Parent-${index}`}
					position={position}
					selected={selected}
					disabled={disabled}
					accessibilityLabel={`Select all products which have color ${title}`}
				>
					<IndexTable.Cell scope="col" id={productId}>
						<InlineStack align="start" gap="200" blockAlign="center">
							<Thumbnail
								size="small"
								alt="index"
								source={products[0]?.image as string}
							/>
							<Text as="span" fontWeight="semibold">
								{title}
							</Text>
						</InlineStack>
					</IndexTable.Cell>
					<IndexTable.Cell />
					<IndexTable.Cell />
				</IndexTable.Row>
				{products.map(
					({ id, variant, quantity, price, position, disabled }, rowIndex) => (
						<IndexTable.Row
							rowType="child"
							key={rowIndex}
							id={id}
							position={position}
							selected={selectedResources.includes(id)}
							disabled={disabled}
						>
							<IndexTable.Cell scope="row">
								<Text variant="bodyMd" as="span">
									{variant}
								</Text>
							</IndexTable.Cell>
							<IndexTable.Cell>
								<Text as="span" numeric>
									{price}
								</Text>
							</IndexTable.Cell>
							<IndexTable.Cell>
								<Text as="span" alignment="end" numeric>
									{quantity}
								</Text>
							</IndexTable.Cell>
						</IndexTable.Row>
					),
				)}
			</Fragment>
		);
	});

	const handleQueryChange = (value: string, type: string) => {
		setNewRule({
			...newRule,
			searchOne: type === 'one' ? value : '',
			searchTwo: type === 'two' ? value : '',
		});
	};

	const handleQueryClear = () => {
		setNewRule({ ...newRule, searchOne: '', searchTwo: '' });
	};

	const handleClearAll = () => {
		setNewRule({ ...newRule, searchOne: '', searchTwo: '' });
	};

	return (
		<Scrollable style={{ height: '400px' }}>
			<Filters
				queryValue={
					newRule?.searchType === 'one'
						? newRule?.searchOne
						: newRule?.searchTwo
				}
				filters={[]}
				appliedFilters={[]}
				queryPlaceholder="Filter product"
				onQueryChange={(value) => handleQueryChange(value, newRule?.searchType)}
				onQueryClear={handleQueryClear}
				onClearAll={handleClearAll}
				loading={newRule?.searchOne || newRule?.searchTwo ? isLoading : false}
			/>
			<IndexTable
				onSelectionChange={handleSelectionChange}
				selectedItemsCount={
					allResourcesSelected ? 'All' : selectedResources.length
				}
				resourceName={resourceName}
				itemCount={rowsProduct.length}
				headings={columnHeadings as IndexTableProps['headings']}
				pagination={{
					hasPrevious: pageInfo?.hasPreviousPage,
					hasNext: pageInfo?.hasNextPage,
					onPrevious: () => loadMorePrevious(),
					onNext: () => loadMoreNext(),
					label: `Showing ${products?.length} to ${currentPage} of ${totalProductCount} products`,
				}}
			>
				{rowMarkup}
			</IndexTable>
			{newRule?.searchOne === '' && newRule?.searchTwo === '' && isLoading && (
				<div className="spinner-container">
					<Spinner size="large" />
				</div>
			)}
		</Scrollable>
	);
};

export default ProductsList;
