import { Modal, TitleBar, useAppBridge } from '@shopify/app-bridge-react';
import { Page } from '@shopify/polaris';
import AnalyticsDashboard from 'app/components/AnalyticsDashboard/AnalyticsDashboard';
import DiscountTypeList from 'app/components/DiscountTypeList';

export default function ManageDiscountPage () {
	const shopify = useAppBridge();

	const handleOpen = () => {
		shopify.modal.show('select-discount-type');
	};

	const handleClose = () => {
		shopify.modal.hide('select-discount-type');
	};

	return (
		<Page>
			<AnalyticsDashboard handleOpen={handleOpen} />
			<Modal id="select-discount-type">
				<DiscountTypeList />
				<TitleBar title="Select discount type">
					<button onClick={handleClose}>Cancel</button>
				</TitleBar>
			</Modal>
		</Page>
	);
}
