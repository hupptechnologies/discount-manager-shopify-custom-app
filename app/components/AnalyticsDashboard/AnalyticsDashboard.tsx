import { useState } from 'react';
import { useSelector } from 'react-redux';
import { getAllDiscountCodeDetail } from 'app/redux/discount/slice';
import type { RootState } from 'app/redux/store';
import { CustomLayout, CustomLayoutSection, CustomSpinner } from '../PolarisUI';
import IndexStateBox from './StateBox';
import AnalyticsTable from './AnalyticsTable';

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
		<CustomLayout>
			<IndexStateBox handleOpen={handleOpen} />
			<CustomLayoutSection>
				<AnalyticsTable setIsLoadingUpdate={setIsLoadingUpdate} />
			</CustomLayoutSection>
			{(isGetDiscountCodeById || isLoadingUpdate || isDeleteAllDiscountCode) && <CustomSpinner />}
		</CustomLayout>
	);
};

export default AnalyticsDashboard;
