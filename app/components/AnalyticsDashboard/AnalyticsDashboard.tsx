import { useState } from 'react';
import { Layout } from '@shopify/polaris';
import { useSelector } from 'react-redux';
import { getAllDiscountCodeDetail } from 'app/redux/discount/slice';
import type { RootState } from 'app/redux/store';
import IndexStateBox from './StateBox';
import AnalyticsTable from './AnalyticsTable';
import CustomSpinner from '../PolarisUI/CustomSpinner';

interface AnalyticsDashboardProps {
	handleOpen: any;
}

/**
	* AnalyticsDashboard component.
	* Displays the overall analytics dashboard with discount stats and actions.
	*
	* @param handleOpen - Function to trigger a modal or drawer open event.
*/

const AnalyticsDashboard: React.FC<AnalyticsDashboardProps> = ({
	handleOpen,
}) => {
	const [isLoadingUpdate, setIsLoadingUpdate] = useState(false);
	const { isGetDiscountCodeById, isDeleteAllDiscountCode } = useSelector(
		(state: RootState) => getAllDiscountCodeDetail(state),
	);
	return (
		<Layout>
			<IndexStateBox handleOpen={handleOpen} />
			<Layout.Section>
				<AnalyticsTable setIsLoadingUpdate={setIsLoadingUpdate} />
			</Layout.Section>
			{(isGetDiscountCodeById || isLoadingUpdate || isDeleteAllDiscountCode) && <CustomSpinner />}
		</Layout>
	);
};

export default AnalyticsDashboard;
