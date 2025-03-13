import { useState } from 'react';
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
			/>
		</Scrollable>
	);
};

export default CollectionList;
