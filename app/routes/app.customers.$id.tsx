import { useEffect, useState } from "react";
import { useAppBridge } from "@shopify/app-bridge-react";
import { Layout, Page } from "@shopify/polaris";
import { useDispatch, useSelector } from "react-redux";
import type { AppDispatch, RootState } from "app/redux/store";
import { getAllCustomerDetail } from "app/redux/customer/slice";
import { getCustomerBySegmentIdAsync } from "app/redux/customer";
import CustomersTable from "app/components/CustomerReport/CustomersTable";
import CustomSpinner from "app/components/PolarisUI/CustomSpinner";

export default function ManageCustomer(){
	const dispatch = useDispatch<AppDispatch>();
	const shopify = useAppBridge();
	const { isSegmentCustomerLoading, segmentCustomers, totalCustomerCount, segmentName, customerPageInfo } = useSelector((state: RootState) => getAllCustomerDetail(state));
	const [segmentId, setSegmentId] = useState<string | null>(null);
	const [queryValue, setQueryValue] = useState('');
	const [cursor, setCursor] = useState<string | undefined>(undefined);
	const [prevCursor, setPrevCursor] = useState<string | undefined>(undefined);

	useEffect(() => {
		const path = window.location.pathname;
		const segments = path.split('/');
		const lastSegment = segments.pop() || null;
		setSegmentId(lastSegment);
	}, []);

	useEffect(() => {
		if (segmentId) {
			dispatch(getCustomerBySegmentIdAsync({
				shopName: shopify.config.shop || '',
				segmentId: `gid://shopify/Segment/${segmentId}`
			}))
		}
	}, [segmentId]);

	useEffect(() => {
		if (customerPageInfo) {
			setCursor(customerPageInfo.endCursor);
			setPrevCursor(customerPageInfo.startCursor);
		}
	}, [customerPageInfo]);

	return (
		<Page title={segmentName} backAction={{ content: 'Settings', url: '/app/customer-segments' }}>
			<Layout>
				<Layout.Section>
					<CustomersTable
						segmentCustomers={segmentCustomers}
						totalCount={totalCustomerCount}
						pageInfo={customerPageInfo}
						cursor={cursor}
						prevCursor={prevCursor}
						segmentId={segmentId}
					/>
				</Layout.Section>
			</Layout>
			{isSegmentCustomerLoading && <CustomSpinner />}
		</Page>
	)
};