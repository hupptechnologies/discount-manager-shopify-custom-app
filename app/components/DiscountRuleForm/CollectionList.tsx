import { useState } from 'react';
import {  
	Box,
	InlineStack,
	ResourceItem,
	ResourceList,
	Scrollable,
	Text,
	Thumbnail,
} from '@shopify/polaris';
import type { ResourceListProps } from '@shopify/polaris';
import { DeleteIcon } from '@shopify/polaris-icons';
import { collectionData } from 'app/utils/json';

interface Collection {
	id: string;
	productCount: number;
	title: string;
	image: string;
}

const CollectionList = () => {
	const [selectedItems, setSelectedItems] = useState<
		ResourceListProps['selectedItems']
	>([]);

	const resourceName = {
		singular: 'customer',
		plural: 'customers',
	};

	const rowsCollection: Collection[] = collectionData;

	const promotedBulkActions = [
		{
			content: 'Edit customers',
			onAction: () => console.log('Todo: implement bulk edit'),
		},
	];

	const bulkActions = [
		{
			content: 'Add tags',
			onAction: () => console.log('Todo: implement bulk add tags'),
		},
		{
			content: 'Remove tags',
			onAction: () => console.log('Todo: implement bulk remove tags'),
		},
		{
			icon: DeleteIcon,
			destructive: true,
			content: 'Delete customers',
			onAction: () => console.log('Todo: implement bulk delete'),
		},
	];

	return (
		<Scrollable shadow style={{ height: '400px' }}>
			<ResourceList
				resourceName={resourceName}
				items={rowsCollection}
				bulkActions={bulkActions}
				promotedBulkActions={promotedBulkActions}
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
			/>
		</Scrollable>
	);
};

export default CollectionList;