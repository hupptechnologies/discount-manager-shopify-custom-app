import { useEffect } from "react";
import { useAppBridge } from "@shopify/app-bridge-react";
import { BlockStack, Box, Button, InlineStack, Layout, Text } from "@shopify/polaris";
import { useDispatch, useSelector } from "react-redux";
import { AppDispatch, RootState } from "app/redux/store";
import { fetchAllSegmentsAsync } from "app/redux/customer";
import CustomerSegmentTable from "./CustomerSegmentTable";
import { getAllCustomerDetail } from "app/redux/customer/slice";

const CustomerReport = () => {
	const dispatch = useDispatch<AppDispatch>();
	const shopify = useAppBridge();
	const { segments, isLoading } = useSelector((state: RootState) => getAllCustomerDetail(state));

	useEffect(() => {
		dispatch(fetchAllSegmentsAsync({
			shopName: shopify.config.shop || ''
		}))
	}, []);

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
				<CustomerSegmentTable
					segments={segments?.length > 0 ? segments : []}
					isLoading={isLoading}
				/>
			</Layout.Section>
		</Layout>
	)
};

export default CustomerReport;