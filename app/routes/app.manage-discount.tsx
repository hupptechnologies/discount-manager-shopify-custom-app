import { Modal, TitleBar, useAppBridge } from '@shopify/app-bridge-react';
import { Page } from '@shopify/polaris';
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
			<TitleBar title="Rule-Based Discounts">
				<button variant="primary" onClick={handleOpen}>
					Create discount rules
				</button>
			</TitleBar>
			<Modal id="select-discount-type">
				<DiscountTypeList />
				<TitleBar title="Select discount type">
					<button onClick={handleClose}>Cancel</button>
				</TitleBar>
			</Modal>
		</Page>
	);
}
