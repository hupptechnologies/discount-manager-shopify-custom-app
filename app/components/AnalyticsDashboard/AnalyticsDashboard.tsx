import { useState } from 'react';
import { Layout, Spinner } from '@shopify/polaris';
import IndexStateBox from './StateBox';
import AnalyticsTable from './AnalyticsTable';
import { getAllDiscountCodeDetail } from 'app/redux/discount/slice';
import { RootState } from 'app/redux/store';
import { useSelector } from 'react-redux';

interface AnalyticsDashboardProps {
	handleOpen: any;
}

const AnalyticsDashboard: React.FC<AnalyticsDashboardProps> = ({
	handleOpen,
}) => {
	const [isLoadingUpdate, setIsLoadingUpdate] = useState(false);
	const { isGetDiscountCodeById } = useSelector((state: RootState) => getAllDiscountCodeDetail(state));
	return (
		<Layout>
			<IndexStateBox handleOpen={handleOpen} />
			<Layout.Section>
				<AnalyticsTable setIsLoadingUpdate={setIsLoadingUpdate} />
			</Layout.Section>
			{(isGetDiscountCodeById || isLoadingUpdate) &&
				<div className="spinner-container">
					<Spinner size="large" />
				</div>
			}
		</Layout>
	);
};

export default AnalyticsDashboard;
