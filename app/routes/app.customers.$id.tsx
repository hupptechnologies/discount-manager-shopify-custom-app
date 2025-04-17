import { useEffect, useState } from "react";
import { Layout, Page } from "@shopify/polaris";
import CustomersTable from "app/components/CustomerReport/CustomersTable";
import { useDispatch, useSelector } from "react-redux";
import { AppDispatch, RootState } from "app/redux/store";
import { useAppBridge } from "@shopify/app-bridge-react";
import { getAllCustomerDetail } from "app/redux/customer/slice";
import { getCustomerBySegmentIdAsync } from "app/redux/customer";

export default function ManageCustomer(){
	const dispatch = useDispatch<AppDispatch>();
	const shopify = useAppBridge();
	const { isSegmentCustomerLoading, segmentCustomers } = useSelector((state: RootState) => getAllCustomerDetail(state));
	const [segmentId, setSegmentId] = useState<string | null>(null);

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

	return (
		<Page title="Customers who have purchased at least once" backAction={{ content: 'Settings', url: '/app/customer-segments' }}>
			<Layout>
				<Layout.Section>
					<CustomersTable segmentCustomers={segmentCustomers} loading={isSegmentCustomerLoading} />
				</Layout.Section>
			</Layout>
		</Page>
	)
};