import { Fragment } from 'react';
import {
	Text,
	useIndexResourceState,
	IndexTable,
	useBreakpoints,
	Thumbnail,
	InlineStack,
	Scrollable,
	type IndexTableRowProps,
	type IndexTableProps,
} from '@shopify/polaris';
import { productData } from 'app/utils/json';

interface Product {
	id: string;
	quantity: number;
	price: string;
	variant: string;
	title: string;
	image?: string;
	disabled?: boolean;
}

interface ProductRow extends Product {
	position: number;
}

interface ProductGroup {
	id: string;
	position: number;
	products: ProductRow[];
}

interface Groups {
	[key: string]: ProductGroup;
}

const ProductsList = () => {
	const rowsProduct: Product[] = productData;

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

	return (
		<Scrollable style={{ height: '400px' }}>
			<IndexTable
				condensed={useBreakpoints().smDown}
				onSelectionChange={handleSelectionChange}
				selectedItemsCount={
					allResourcesSelected ? 'All' : selectedResources.length
				}
				resourceName={resourceName}
				itemCount={rowsProduct.length}
				headings={columnHeadings as IndexTableProps['headings']}
			>
				{rowMarkup}
			</IndexTable>
		</Scrollable>
	);
};

export default ProductsList;
