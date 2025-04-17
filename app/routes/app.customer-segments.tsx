import { Modal, TitleBar, useAppBridge } from '@shopify/app-bridge-react';
import { Page } from '@shopify/polaris';
import CreateSegment from 'app/components/CustomerReport/CreateSegment';
import CustomerReport from 'app/components/CustomerReport/CustomerReport';

export default function CustomerSegmentsPage () {
	const shopify = useAppBridge();

	const handleClose = () => {
		shopify.modal.hide('create-segment-modal');
	};

	return (
		<Page>
            <CustomerReport />
			<Modal id="create-segment-modal">
				<CreateSegment />
				<TitleBar title="Add segment rule">
					<button variant='primary' onClick={handleClose}>Save</button>
					<button onClick={handleClose}>Cancel</button>
				</TitleBar>
			</Modal>
		</Page>
	);
}
