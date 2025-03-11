import { Layout, Page } from '@shopify/polaris';
import DiscountRuleForm from 'app/components/DiscountRuleForm';

export default function CreateDiscountPage () {
	return (
		<Page
			backAction={{ content: '', url: '/app/manage-discount' }}
			title="Create discount"
		>
			<Layout>
				<DiscountRuleForm />
			</Layout>
			<br />
		</Page>
	);
}
