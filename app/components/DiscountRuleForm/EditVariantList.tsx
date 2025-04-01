import React, { useState } from 'react';
import {
    ResourceList,
    ResourceItem,
    Text,
    InlineStack,
    Thumbnail,
    ResourceListProps,
} from '@shopify/polaris';

interface VariantItem {
    id: string;
    image: string;
    title: string;
    count: number;
    price?: string;
}

interface ResourceName {
    singular: string;
    plural: string;
}

const EditVariantList: React.FC = () => {

    const [selectedItems, setSelectedItems] = useState<
        ResourceListProps['selectedItems']
    >([]);

    const resourceName: ResourceName = {
        singular: 'variant',
        plural: 'variants',
    };

    const items: VariantItem[] = [
        {
            id: "1",
            image: 'https://cdn.shopify.com/s/files/1/0723/3277/1569/files/Main_9129b69a-0c7b-4f66-b6cf-c4222f18028a.jpg?v=1734584398',
            title: 'Ice',
            count: 2,
            price: '$10',
        },
        {
            id: "2",
            image: 'https://cdn.shopify.com/s/files/1/0723/3277/1569/files/Main_9129b69a-0c7b-4f66-b6cf-c4222f18028a.jpg?v=1734584398',
            title: 'Down',
            count: 1,
            price: '$20',
        },
        {
            id: "3",
            image: 'https://cdn.shopify.com/s/files/1/0723/3277/1569/files/Main_9129b69a-0c7b-4f66-b6cf-c4222f18028a.jpg?v=1734584398',
            title: 'Powder',
            count: 5,
            price: '$15',
        },
        {
            id: "4",
            image: 'https://cdn.shopify.com/s/files/1/0723/3277/1569/files/Main_9129b69a-0c7b-4f66-b6cf-c4222f18028a.jpg?v=1734584398',
            title: 'Electric',
            count: 6,
            price: '$25',
        },
    ];

    return (
        <ResourceList
            resourceName={resourceName}
            items={items}
            selectedItems={selectedItems}
            onSelectionChange={setSelectedItems}
            selectable
            renderItem={(item: VariantItem) => {
                const { id, title, image, count, price } = item;
                return (
                    <ResourceItem id={id} url='' accessibilityLabel={`View details for ${title}`}>
                        <div style={{ padding: "10px 10px" }}>
                            <InlineStack align="space-between" blockAlign="center">
                                <Thumbnail size="small" alt="" source={image} />
                                <Text fontWeight="bold" as="span">
                                    {title}
                                </Text>
                                <Text as="p">{count} available</Text>
                                <Text as="p">{price}</Text>
                            </InlineStack>
                        </div>
                    </ResourceItem>
                );
            }}
        />
    );
};

export default EditVariantList;