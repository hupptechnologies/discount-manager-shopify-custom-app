import React, { useEffect, useState } from 'react';
import {
	type ResourceListProps,
	ResourceList,
	ResourceItem,
	Text,
	InlineStack,
	Thumbnail,
	Scrollable,
} from '@shopify/polaris';
import type { VariantItem } from 'app/redux/create-discount/slice';
import type { DiscountRule } from './DiscountRuleForm';

interface EditVariantListProps {
	variants: VariantItem[];
	isFetchProductVariants: boolean;
	selectedVariantId: string[];
	setNewRule: React.Dispatch<any>;
	newRule: DiscountRule;
	productUrl: string;
	productTitle: string;
	productId: string;
}

interface ResourceName {
	singular: string;
	plural: string;
}

const EditVariantList: React.FC<EditVariantListProps> = ({
	variants,
	isFetchProductVariants,
	selectedVariantId,
	setNewRule,
	newRule,
	productId,
}) => {
	const [selectedItems, setSelectedItems] = useState<
		ResourceListProps['selectedItems']
	>([]);

	useEffect(() => {
		if (selectedVariantId.length > 0) {
			setSelectedItems(selectedVariantId);
		}
	}, [selectedVariantId]);

	const handleSelectionChange = (value: string[]) => {
		setNewRule({
			...newRule,
			customerBuys: {
				...newRule.customerBuys,
				productIDs: value,
				items: newRule.customerBuys.items.map((item: any) => {
					if (item?.node?.product?.id === productId) {
						return {
							...item,
							node: {
								...item.node,
								id: value,
							},
						};
					}
					return item;
				}),
			},
		});
		setSelectedItems(value);
	};

	return (
		<Scrollable style={{ height: '400px' }}>
			<ResourceList
				resourceName={{ singular: 'variant', plural: 'variants' }}
				items={variants?.length > 0 ? variants : []}
				selectedItems={selectedItems}
				onSelectionChange={handleSelectionChange}
				selectable
				loading={isFetchProductVariants}
				renderItem={(item) => {
					const { id, title, image, inventoryQuantity, price } = item.node;
					return (
						<ResourceItem
							id={id}
							url=""
							accessibilityLabel={`View details for ${title}`}
						>
							<div style={{ padding: '10px 10px' }}>
								<InlineStack align="space-between" blockAlign="center">
									<Thumbnail
										size="small"
										alt=""
										source={
											image?.url ||
											'https://cdn.shopify.com/s/files/1/0723/3277/1569/files/images_4e34079b-8a8a-4e98-89a2-6c53923e2264.jpg?v=1738837951'
										}
									/>
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
