import { Modal, TitleBar, useAppBridge } from '@shopify/app-bridge-react';
import { Page } from '@shopify/polaris';
import { useSelector } from 'react-redux';
import { RootState } from 'app/redux/store';
import { getAllCustomerDetail } from 'app/redux/customer/slice';
import CreateSegment from 'app/components/CustomerReport/CreateSegment';
import CustomerReport from 'app/components/CustomerReport/CustomerReport';
import CustomSpinner from 'app/components/PolarisUI/CustomSpinner';

export default function CustomerSegmentsPage () {
	const shopify = useAppBridge();
	const { isLoading } = useSelector((state: RootState) => getAllCustomerDetail(state));

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
			{isLoading && <CustomSpinner />}
		</Page>
	);
}
