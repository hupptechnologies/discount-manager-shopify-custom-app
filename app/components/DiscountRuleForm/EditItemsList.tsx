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
import type { EditObj } from './DiscountValue';

export interface EditItemsListProps {
	editObj: EditObj;
}

const EditItemsList: React.FC<EditItemsListProps> = ({ editObj }) => {
	return (
		<Card>
			{editObj?.type === 'product' && (
				<ResourceList
					resourceName={{ singular: 'item', plural: 'items' }}
					items={editObj?.items}
					renderItem={(item) => {
						const {
							id,
							title,
							product: {
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
										{editObj?.type === 'product' && (
											<Text as="p" tone="subdued">
												(1 of {count} variants selected)
											</Text>
										)}
									</Box>
									{editObj?.type === 'product' && (
										<Box>
											<InlineStack align="space-between" blockAlign="center">
												<Button variant="plain">Edit</Button>
												&nbsp;&nbsp;&nbsp;
												<div className="edit-item-cancel-icon">
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
			{editObj?.type === 'collection' && (
				<ResourceList
					resourceName={{ singular: 'item', plural: 'items' }}
					items={editObj?.items}
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
										{editObj?.type === 'collection' && (
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
	);
};

export default EditItemsList;
