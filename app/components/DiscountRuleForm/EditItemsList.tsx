import {
	Card,
	ResourceList,
	ResourceItem,
	Text,
	Thumbnail,
	Icon,
	InlineStack,
	Box,
	Button,
} from '@shopify/polaris';
import { XIcon } from '@shopify/polaris-icons';
import type { ItemsList } from 'app/redux/discount/slice';

export interface EditItemsListProps {
	type: string;
	items: ItemsList[];
	handleVariantListOpen: any;
	handleCancelProduct: React.Dispatch<any>;
}

const EditItemsList: React.FC<EditItemsListProps> = ({
	type,
	items,
	handleVariantListOpen,
	handleCancelProduct,
}) => {
	const groupedItems = type === 'product' && items?.reduce(
		(acc, edge) => {
			const productId = edge.node.product.id;
			if (!acc[productId]) {
				acc[productId] = {
					node: {
						id: [],
						product: edge.node.product,
					},
				} as any;
			}
			acc[productId].node.id.push(edge.node.id);
			return acc;
		},
		{} as { [key: string]: any },
	);

	const consolidatedItems = Object.values(groupedItems);

	return (
		<div className="edit-item-list">
			<Card>
				{type === 'product' && (
					<ResourceList
						resourceName={{ singular: 'item', plural: 'items' }}
						items={consolidatedItems}
						renderItem={(item) => {
							const {
								id: variantId,
								product: {
									title,
									id,
									variantsCount: { count },
									featuredMedia: {
										preview: {
											image: { url },
										},
									},
								},
							} = item?.node;
							return (
								<ResourceItem
									id={id}
									url=""
									media={<Thumbnail size="small" alt="" source={url} />}
									accessibilityLabel={`View details for ${title}`}
								>
									<InlineStack align="space-between" blockAlign="center">
										<Box>
											<Text variant="bodyMd" fontWeight="bold" as="h3">
												{title}
											</Text>
											{type === 'product' && (
												<Text as="p" tone="subdued">
													(
													{Array.isArray(variantId) && variantId.length > 0
														? variantId.length
														: variantId === ''
															? 0
															: 1}{' '}
													of {count} variants selected)
												</Text>
											)}
										</Box>
										{type === 'product' && (
											<Box>
												<InlineStack align="space-between" blockAlign="center">
													<Button
														variant="plain"
														onClick={() =>
															handleVariantListOpen(id, variantId, title, url)
														}
													>
														Edit
													</Button>
													&nbsp;&nbsp;&nbsp;
													<div
														onClick={() => handleCancelProduct(variantId)}
														className="edit-item-cancel-icon"
													>
														<Icon source={XIcon} tone="subdued" />
													</div>
												</InlineStack>
											</Box>
										)}
									</InlineStack>
								</ResourceItem>
							);
						}}
					/>
				)}
				{type === 'collection' && (
					<ResourceList
						resourceName={{ singular: 'item', plural: 'items' }}
						items={items}
						renderItem={(item) => {
							const {
								id,
								title,
								productsCount: { count },
								image,
							} = item?.node;
							return (
								<ResourceItem
									id={id}
									url=""
									media={<Thumbnail size="small" alt="" source={image?.url} />}
									accessibilityLabel={`View details for ${title}`}
								>
									<InlineStack align="space-between" blockAlign="center">
										<Box>
											<Text variant="bodyMd" fontWeight="bold" as="h3">
												{title}
											</Text>
											{type === 'collection' && (
												<Text as="p" tone="subdued">
													{count} products
												</Text>
											)}
										</Box>
										<div className="edit-item-cancel-icon">
											<Icon source={XIcon} tone="subdued" />
										</div>
									</InlineStack>
								</ResourceItem>
							);
						}}
					/>
				)}
			</Card>
		</div>
	);
};

export default EditItemsList;
