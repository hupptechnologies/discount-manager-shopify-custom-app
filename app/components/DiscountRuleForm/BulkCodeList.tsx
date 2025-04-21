import { useState } from 'react';
import { useAppBridge } from '@shopify/app-bridge-react';
import { useNavigate } from '@remix-run/react';
import {
	ResourceList,
	ResourceItem,
	InlineStack,
	Box,
	EmptyState,
} from '@shopify/polaris';
import { DeleteIcon } from '@shopify/polaris-icons';
import type { ResourceListProps } from '@shopify/polaris';
import { useDispatch } from 'react-redux';
import { deleteBulkRedeemDiscountCodeAsync } from 'app/redux/discount';
import type { AppDispatch } from 'app/redux/store';
import { CustomText } from '../PolarisUI';

export interface CodeList {
	node: {
		id: string;
		code: string;
		asyncUsageCount: number;
	}
}

interface BulkCodeListProps {
	items: CodeList[];
	discountId: string;
};

const BulkCodeList: React.FC<BulkCodeListProps> = ({ items, discountId }) => {
	const dispatch = useDispatch<AppDispatch>();
	const shopify = useAppBridge();
	const navigate = useNavigate();
	const [selectedItems, setSelectedItems] = useState<ResourceListProps['selectedItems']>([]);

	const resourceName = {
		singular: 'code',
		plural: 'codes',
	};

	const promotedBulkActions = [
		{
			icon: DeleteIcon,
			destructive: true,
			content: 'Delete code',
			onAction: () => handleDelete(),
		},
	];

	const handleDelete = () => {
		const findIds = Array.isArray(selectedItems) ? selectedItems?.map((item: string) => items[Number(item)]?.node?.id) : [];
		if (selectedItems === "All") {
			findIds.push(...Object.values(items).map(item => item.node.id));
		}
		dispatch(deleteBulkRedeemDiscountCodeAsync({
			shopName: shopify.config.shop || '',
			data: {
				discountId: discountId,
				ids: findIds
			},
			callback: () => {
				shopify.modal.hide('bulk-codes-modal');
				navigate('/app/manage-discount');
			}
		}));
	};

	const emptyStateMarkup = !items.length ? (
		<EmptyState
			heading="No codes found. Please create or generate codes."
			image="https://cdn.shopify.com/s/files/1/2376/3301/products/emptystate-files.png"
		>
			<p>
				You can create or generate new discount codes to get started.
			</p>
		</EmptyState>
    ) : undefined;

	return (
		<ResourceList
			emptyState={emptyStateMarkup}
			resourceName={resourceName}
			items={items}
			renderItem={renderItem}
			selectedItems={selectedItems}
			selectable
			onSelectionChange={setSelectedItems}
			promotedBulkActions={promotedBulkActions}
		/>
	);

	function renderItem(item: any, index: string) {
		const { code, asyncUsageCount } = item?.node;
		return (
			<ResourceItem
				id={index}
				url=''
				accessibilityLabel={`View details for ${code}`}
			>
				<InlineStack gap="200" align="start" blockAlign="center">
					<Box>
						<CustomText fontWeight="bold" as="span">
							{code}
						</CustomText>
						<CustomText as="p">{asyncUsageCount} / 5 used</CustomText>
					</Box>
				</InlineStack>
			</ResourceItem>
		);
	}
};

export default BulkCodeList;