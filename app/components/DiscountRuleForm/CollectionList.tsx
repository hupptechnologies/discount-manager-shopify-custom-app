import { useEffect, useState } from 'react';
import { useAppBridge } from '@shopify/app-bridge-react';
import {
	Box,
	InlineStack,
	ResourceItem,
	ResourceList,
	Scrollable,
	Text,
	Thumbnail,
	type ResourceListProps
} from '@shopify/polaris';
import { useDispatch, useSelector } from 'react-redux';
import { AppDispatch, RootState } from 'app/redux/store';
import { fetchAllCollectionsAsync } from 'app/redux/create-discount';
import { getCreateDiscountDetail } from 'app/redux/create-discount/slice';
import { collectionData } from 'app/utils/json';

interface Collection {
	id: string;
	productCount: number;
	title: string;
	image: string;
}

const CollectionList = () => {
	const shopify = useAppBridge();
	const dispatch = useDispatch<AppDispatch>();
	const { collections, collectionPageInfo, totalCollectionCount, isCollectionLoading } = useSelector((state: RootState) => getCreateDiscountDetail(state));
	const [selectedItems, setSelectedItems] = useState<
		ResourceListProps['selectedItems']
	>([]);
	const [currentPage, setCurrentPage] = useState(1);

	const resourceName = {
		singular: 'customer',
		plural: 'customers',
	};

	const rowsCollection: Collection[] = collections?.length > 0 ? collections : collectionData;

	useEffect(() => {
		dispatch(fetchAllCollectionsAsync({
			shopName: shopify.config.shop || ''
		}))
	}, []);

	return (
		<Scrollable style={{ height: '400px' }}>
			<ResourceList
				resourceName={resourceName}
				items={rowsCollection}
				selectable
				selectedItems={selectedItems}
				onSelectionChange={setSelectedItems}
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
					label: `Showing ${collections?.length} to ${currentPage} of ${totalCollectionCount} products`,
				}}
			/>
		</Scrollable>
	);
};

export default CollectionList;
