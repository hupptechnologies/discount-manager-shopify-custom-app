import { BlockStack, Box, Button, InlineStack, Layout, Text } from "@shopify/polaris";
import CustomerTable from "./CustomersTable";

const CustomerReport = () => {
	return (
		<Layout>
			<Layout.Section>
				<Box padding="200">
					<BlockStack gap="100">
						<InlineStack align="space-between" blockAlign="center" gap="100">
							<Text as="h6" variant="headingMd">
								Customer Reports
							</Text>
							<Button variant="primary">
								Create customer
							</Button>
						</InlineStack>
						<Text as="p" variant="bodySm" tone="subdued">
							Shows the most recent customer statistics and trends.
						</Text>
					</BlockStack>
				</Box>
			</Layout.Section>
			<Layout.Section>
				<CustomerTable />
			</Layout.Section>
		</Layout>
	)
};

export default CustomerReport;