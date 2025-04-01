import React, { useState } from 'react';
import {
	ResourceList,
	ResourceItem,
	Text,
	InlineStack,
	Thumbnail,
	ResourceListProps,
	Scrollable,
} from '@shopify/polaris';
import { VariantItem } from 'app/redux/create-discount/slice';

interface EditVariantListProps {
	variants: VariantItem[];
	isFetchProductVariants: boolean;
}

interface ResourceName {
	singular: string;
	plural: string;
}

const EditVariantList: React.FC<EditVariantListProps> = ({ variants, isFetchProductVariants }) => {

	const [selectedItems, setSelectedItems] = useState<
		ResourceListProps['selectedItems']
	>([]);

	const resourceName: ResourceName = {
		singular: 'variant',
		plural: 'variants',
	};

	return (
		<Scrollable style={{height: '400px'}} focusable>
			<ResourceList
				resourceName={resourceName}
				items={variants?.length > 0 ? variants : []}
				selectedItems={selectedItems}
				onSelectionChange={setSelectedItems}
				selectable
				loading={isFetchProductVariants}
				renderItem={(item) => {
					const { id, title, image, inventoryQuantity, price } = item.node;
					return (
						<ResourceItem id={id} url='' accessibilityLabel={`View details for ${title}`}>
							<div style={{ padding: "10px 10px" }}>
								<InlineStack align="space-between" blockAlign="center">
									<Thumbnail size="small" alt="" source={image?.url || 'https://cdn.shopify.com/s/files/1/0723/3277/1569/files/images_4e34079b-8a8a-4e98-89a2-6c53923e2264.jpg?v=1738837951'} />
									<Text fontWeight="bold" as="span">
										{title}
									</Text>
									<Text as="p">{inventoryQuantity} available</Text>
									<Text as="p">{price}</Text>
								</InlineStack>
							</div>
						</ResourceItem>
					);
				}}
			/>
		</Scrollable>
	);
};

export default EditVariantList;