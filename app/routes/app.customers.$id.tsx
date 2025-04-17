import { Layout, Page } from "@shopify/polaris";
import CustomersTable from "app/components/CustomerReport/CustomersTable";

export default function ManageCustomer(){
	return (
		<Page title="Customers who have purchased at least once" backAction={{ content: 'Settings', url: '/app/customer-segments' }}>
			<Layout>
				<Layout.Section>
					<CustomersTable />
				</Layout.Section>
			</Layout>
		</Page>
	)
};