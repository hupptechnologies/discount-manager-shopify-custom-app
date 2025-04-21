import { useCallback, useEffect, useState } from "react";
import { useAppBridge } from "@shopify/app-bridge-react";
import pkg from 'lodash';
import { Box, InlineStack, Layout } from "@shopify/polaris";
import { useDispatch, useSelector } from "react-redux";
import { fetchAllSegmentsAsync } from "app/redux/customer";
import { getAllCustomerDetail } from "app/redux/customer/slice";
import type { AppDispatch, RootState } from "app/redux/store";
import CustomerSegmentTable from "./CustomerSegmentTable";
import CustomText from "../PolarisUI/CustomText";
import CustomButton from "../PolarisUI/CustomButton";
import CustomBlockStack from "../PolarisUI/CustomBlockStack";

const CustomerReport = () => {
	const dispatch = useDispatch<AppDispatch>();
	const shopify = useAppBridge();
	const { debounce } = pkg;
	const { segments, totalSegmentCount, pageInfo } = useSelector((state: RootState) => getAllCustomerDetail(state));
	const [queryValue, setQueryValue] = useState('');
	const [cursor, setCursor] = useState<string | undefined>(undefined);
	const [prevCursor, setPrevCursor] = useState<string | undefined>(undefined);

	const debouncedHandleFetch = useCallback(
		debounce((queryValue) => {
			dispatch(fetchAllSegmentsAsync({
				shopName: shopify.config.shop || '',
				query: queryValue
			}));
		}, 300),
		[],
	);

	useEffect(() => {
		debouncedHandleFetch(queryValue)
	}, [queryValue]);

	useEffect(() => {
		if (pageInfo) {
			setCursor(pageInfo.endCursor);
			setPrevCursor(pageInfo.startCursor);
		}
	}, [pageInfo]);

	const handleOpen = () => {
		shopify.modal.show('create-segment-modal');
	};

	return (
		<Layout>
			<Layout.Section>
				<Box padding="200">
					<CustomBlockStack gap="100">
						<InlineStack align="space-between" blockAlign="center" gap="100">
							<CustomText as="h6" variant="headingMd">
								Customer Segment Overview
							</CustomText>
							<CustomButton onClick={handleOpen} variant="primary">
								Create segment
							</CustomButton>
						</InlineStack>
						<CustomText as="p" variant="bodySm" tone="subdued">
							Shows the most recent customer segment statistics and trends.
						</CustomText>
					</CustomBlockStack>
				</Box>
			</Layout.Section>
			<Layout.Section>
				<CustomerSegmentTable
					segments={segments?.length > 0 ? segments : []}
					totalCount={totalSegmentCount}
					cursor={cursor}
					prevCursor={prevCursor}
					pageInfo={pageInfo}
					queryValue={queryValue}
					setQueryValue={setQueryValue}
				/>
			</Layout.Section>
		</Layout>
	)
};

export default CustomerReport;