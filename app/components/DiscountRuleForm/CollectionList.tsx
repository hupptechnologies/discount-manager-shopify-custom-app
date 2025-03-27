import { useEffect, useState } from 'react';
import { useAppBridge } from '@shopify/app-bridge-react';
import {
	Box,
	Filters,
	InlineStack,
	ResourceItem,
	ResourceList,
	Scrollable,
	Text,
	Thumbnail,
	type ResourceListProps,
} from '@shopify/polaris';
import { useDispatch, useSelector } from 'react-redux';
import type { AppDispatch, RootState } from 'app/redux/store';
import type { DiscountRule } from './DiscountRuleForm';
import { fetchAllCollectionsAsync } from 'app/redux/create-discount';
import { getCreateDiscountDetail } from 'app/redux/create-discount/slice';

interface Collection {
	id: string;
	productCount: number;
	title: string;
	image: string;
};

interface CollectionProps {
	newRule: DiscountRule;
	setNewRule: React.Dispatch<React.SetStateAction<any>>;
	selected: number;
};

const CollectionList: React.FC<CollectionProps> = ({ newRule, setNewRule, selected }) => {
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
		singular: 'customer',
		plural: 'customers',
	};

	const rowsCollection: Collection[] =
		collections?.length > 0 ? collections : [];

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
				onSelectionChange={(value) => {
					if (selected !== 1) {
						setNewRule({ ...newRule, customerGets: { ...newRule.customerGets, collectionIDs: value, productIDs: [] } });
					}
					if (selected === 1) {
						setNewRule({ ...newRule, customerBuys: { ...newRule.customerBuys, collectionIDs: value, productIDs: [] } });
					}
					setSelectedItems(value);
				}}
				renderItem={(item) => {
					const { id, image, title, productCount } = item;
					return (
						<ResourceItem
							id={id}
							accessibilityLabel={`View details for ${title}`}
							onClick={() => ''}
						>
							<InlineStack gap="200" align="start" blockAlign="center">
								<Thumbnail size="small" alt="" source={image} />
								<Box>
									<Text fontWeight="bold" as="span">
										{title}
									</Text>
									<Text as="p">{productCount} products</Text>
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
