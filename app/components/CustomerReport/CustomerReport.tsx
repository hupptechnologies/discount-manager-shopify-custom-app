import { BlockStack, Box, Button, InlineStack, Layout, Text } from "@shopify/polaris";
import CustomerSegmentTable from "./CustomerSegmentTable";
import { useAppBridge } from "@shopify/app-bridge-react";

const CustomerReport = () => {
	const shopify = useAppBridge();

	const handleOpen = () => {
		shopify.modal.show('create-segment-modal');
	};

	return (
		<Layout>
			<Layout.Section>
				<Box padding="200">
					<BlockStack gap="100">
						<InlineStack align="space-between" blockAlign="center" gap="100">
							<Text as="h6" variant="headingMd">
								Customer Segment Overview
							</Text>
							<Button onClick={handleOpen} variant="primary">
								Create segment
							</Button>
						</InlineStack>
						<Text as="p" variant="bodySm" tone="subdued">
							Shows the most recent customer segment statistics and trends.
						</Text>
					</BlockStack>
				</Box>
			</Layout.Section>
			<Layout.Section>
				<CustomerSegmentTable />
			</Layout.Section>
		</Layout>
	)
};

export default CustomerReport;