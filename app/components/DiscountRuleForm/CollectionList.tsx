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
import { fetchAllCollectionsAsync } from 'app/redux/create-discount';
import { getCreateDiscountDetail } from 'app/redux/create-discount/slice';
import CustomText from '../PolarisUI/CustomText';

interface Collection {
	id: string;
	productCount: number;
	title: string;
	image: string;
}

interface CollectionProps {
	newRule: DiscountRule;
	setNewRule: React.Dispatch<React.SetStateAction<any>>;
	selected: number;
	selectedItemsArray: string[];
	handleSaveBarOpen:any;
}

const CollectionList: React.FC<CollectionProps> = ({
	newRule,
	setNewRule,
	selected,
	selectedItemsArray,
	handleSaveBarOpen
}) => {
	const shopify = useAppBridge();
	const dispatch = useDispatch<AppDispatch>();
	const {
		collections,
		collectionPageInfo,
		totalCollectionCount,
		isCollectionLoading,
	} = useSelector((state: RootState) => getCreateDiscountDetail(state));
	const [selectedItems, setSelectedItems] = useState<
		ResourceListProps['selectedItems']
	>([]);
	const [currentPage, setCurrentPage] = useState<number>(1);
	const [cursor, setCursor] = useState<string | undefined>(undefined);
	const [prevCursor, setPrevCursor] = useState<string | undefined>(undefined);

	const resourceName = {
		singular: 'collection',
		plural: 'collections',
	};

	const rowsCollection: Collection[] = collections?.length > 0 ? collections : [];

	useEffect(() => {
		dispatch(
			fetchAllCollectionsAsync({
				shopName: shopify.config.shop || '',
				query:
					newRule?.searchOne === '' ? newRule?.searchTwo : newRule?.searchOne,
			}),
		);
	}, [newRule?.searchOne, newRule?.searchTwo]);

	useEffect(() => {
		if (collectionPageInfo) {
			setCursor(collectionPageInfo.endCursor);
			setPrevCursor(collectionPageInfo.startCursor);
		}
	}, [collectionPageInfo]);

	useEffect(() => {
		if (selectedItemsArray.length > 0) {
			setSelectedItems(selectedItemsArray);
		}
	}, [selectedItemsArray]);

	const loadMoreNext = () => {
		if (collectionPageInfo?.hasNextPage) {
			dispatch(
				fetchAllCollectionsAsync({
					shopName: shopify.config.shop || '',
					query: newRule?.searchOne,
					after: cursor,
				}),
			);
			setCurrentPage((prevPage) => prevPage + 1);
		}
	};

	const loadMorePrevious = () => {
		if (collectionPageInfo?.hasPreviousPage) {
			dispatch(
				fetchAllCollectionsAsync({
					shopName: shopify.config.shop || '',
					query: newRule?.searchOne,
					before: prevCursor,
				}),
			);
			setCurrentPage((prevPage) => prevPage - 1);
		}
	};

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

	const handleSelectionChange = (value: string[]) => {
		handleSaveBarOpen();
		const selectedObjects = rowsCollection
			.filter((row) => value.includes(row.id))
			.map((row) => ({
				node: {
					id: row.id,
					title: row.title,
					productsCount: {
						count: row.productCount || 0,
					},
					image: {
						url: row.image,
					},
				},
			}));
		if (selected === 0) {
			setNewRule({
				...newRule,
				customerGets: {
					...newRule.customerGets,
					collectionIDs: value,
					...(newRule.customerGets.productIDs.length > 0 && {
						removeProductIDs: newRule.customerGets.productIDs,
					}),
					productIDs: [],
					items: selectedObjects,
				},
			});
		}
		if (selected === 1) {
			setNewRule({
				...newRule,
				customerBuys: {
					...newRule.customerBuys,
					collectionIDs: value,
					...(newRule.customerBuys.productIDs.length > 0 && {
						removeProductIDs: newRule.customerBuys.productIDs,
					}),
					productIDs: [],
					items: selectedObjects,
				},
			});
		}
		setSelectedItems(value);
	};

	const filterControl = (
		<Filters
			queryValue={
				newRule?.searchType === 'one' ? newRule?.searchOne : newRule?.searchTwo
			}
			filters={[]}
			appliedFilters={[]}
			queryPlaceholder="Filter collection"
			onQueryChange={(value) => handleQueryChange(value, newRule?.searchType)}
			onQueryClear={handleQueryClear}
			onClearAll={handleClearAll}
		/>
	);

	return (
		<Scrollable style={{ height: '471px' }}>
			<ResourceList
				filterControl={filterControl}
				resourceName={resourceName}
				items={rowsCollection}
				selectable
				selectedItems={selectedItems}
				onSelectionChange={handleSelectionChange}
				renderItem={(item) => {
					const { id, image, title, productCount } = item;
					return (
						<ResourceItem
							id={id}
							accessibilityLabel={`View details for ${title}`}
							url=""
						>
							<InlineStack gap="200" align="start" blockAlign="center">
								<Thumbnail size="small" alt="" source={image} />
								<Box>
									<CustomText fontWeight="bold" as="span">
										{title}
									</CustomText>
									<CustomText as="p">{productCount} products</CustomText>
								</Box>
							</InlineStack>
						</ResourceItem>
					);
				}}
				loading={isCollectionLoading}
				pagination={{
					hasPrevious: collectionPageInfo?.hasPreviousPage,
					hasNext: collectionPageInfo?.hasNextPage,
					onPrevious: () => loadMorePrevious(),
					onNext: () => loadMoreNext(),
					label: `Showing ${collections?.length} to ${currentPage} of ${totalCollectionCount} products`,
				}}
			/>
		</Scrollable>
	);
};

export default CollectionList;
