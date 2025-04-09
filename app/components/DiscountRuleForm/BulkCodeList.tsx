import { useState } from 'react';
import {
	ResourceList,
	ResourceItem,
	Text,
	InlineStack,
	Box,
} from '@shopify/polaris';
import type { ResourceListProps } from '@shopify/polaris';

export interface CodeList {
	node: {
		id: string;
		code: string;
		asyncUsageCount: number;
	}
}

interface BulkCodeListProps {
	items: CodeList[]
};

const BulkCodeList: React.FC<BulkCodeListProps> = ({ items }) => {
	const [selectedItems, setSelectedItems] = useState<ResourceListProps['selectedItems']>([]);

	const resourceName = {
		singular: 'code',
		plural: 'codes',
	};

	return (
		<ResourceList
			resourceName={resourceName}
			items={items}
			renderItem={renderItem}
			selectedItems={selectedItems}
			selectable
			onSelectionChange={setSelectedItems}
		/>
	);

	function renderItem(item: any) {
		const { id, code, asyncUsageCount } = item?.node;
		return (
			<ResourceItem
				id={id}
				url=''
				accessibilityLabel={`View details for ${code}`}
			>
				<InlineStack gap="200" align="start" blockAlign="center">
					<Box>
						<Text fontWeight="bold" as="span">
							{code}
						</Text>
						<Text as="p">{asyncUsageCount} / 5 used</Text>
					</Box>
				</InlineStack>
			</ResourceItem>
		);
	}
};

export default BulkCodeList;