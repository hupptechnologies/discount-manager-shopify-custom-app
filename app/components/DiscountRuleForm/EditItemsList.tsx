import {
	Card,
	ResourceList,
	ResourceItem,
	Thumbnail,
	Icon,
	InlineStack,
	Box
} from '@shopify/polaris';
import { XIcon } from '@shopify/polaris-icons';
import type { ItemsList } from 'app/redux/discount/slice';
import PrimaryButton from '../Button';
import CustomText from '../shopify/CustomText';

export interface EditItemsListProps {
	type: string;
	items: ItemsList[];
	handleVariantListOpen: any;
	handleCancelProduct: React.Dispatch<any>;
	handleCancelCollection: React.Dispatch<any>;
	handleCustomerCancel: any;
}

const EditItemsList: React.FC<EditItemsListProps> = ({
	type,
	items,
	handleVariantListOpen,
	handleCancelProduct,
	handleCancelCollection,
	handleCustomerCancel
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
											<CustomText variant="bodyMd" fontWeight="bold" as="h3">
												{title}
											</CustomText>
											{type === 'product' && (
												<CustomText as="p" tone="subdued">
													(
													{Array.isArray(variantId) && variantId.length > 0
														? variantId.length
														: variantId === ''
															? 0
															: 1}{' '}
													of {count} variants selected)
												</CustomText>
											)}
										</Box>
										{type === 'product' && (
											<Box>
												<InlineStack align="space-between" blockAlign="center">
													{count > 1 &&
														<PrimaryButton
															variant="plain"
															onClick={() => handleVariantListOpen(id, variantId, title, url)}
															children={'Edit'}
														/>
													}
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
											<CustomText variant="bodyMd" fontWeight="bold" as="h3">
												{title}
											</CustomText>
											{type === 'collection' && (
												<CustomText as="p" tone="subdued">
													{count} products
												</CustomText>
											)}
										</Box>
										<div onClick={() => handleCancelCollection(id)} className="edit-item-cancel-icon">
											<Icon source={XIcon} tone="subdued" />
										</div>
									</InlineStack>
								</ResourceItem>
							);
						}}
					/>
				)}
				{type === 'customer' && (
					<ResourceList
						resourceName={{ singular: 'item', plural: 'items' }}
						items={items}
						renderItem={(item) => {
							const {
								id,
								displayName,
								email,
								image,
							} = item;
							return (
								<ResourceItem
									id={id}
									url=""
									media={<Thumbnail size="small" alt="" source={image?.url} />}
									accessibilityLabel={`View details for ${displayName}`}
								>
									<InlineStack align="space-between" blockAlign="center">
										<Box>
											<CustomText variant="bodyMd" fontWeight="bold" as="h3">
												{displayName}
											</CustomText>
											<CustomText as="p" tone="subdued">
												{email}
											</CustomText>
										</Box>
										<div onClick={() => handleCustomerCancel(id)} className="edit-item-cancel-icon">
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
