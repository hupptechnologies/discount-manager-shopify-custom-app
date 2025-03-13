import { Layout } from '@shopify/polaris';
import IndexStateBox from './StateBox';
import AnalyticsTable from './AnalyticsTable';

interface AnalyticsDashboardProps {
	handleOpen: any;
}

const AnalyticsDashboard: React.FC<AnalyticsDashboardProps> = ({
	handleOpen,
}) => {
	return (
		<Layout>
			<IndexStateBox handleOpen={handleOpen} />
			<Layout.Section>
				<AnalyticsTable />
			</Layout.Section>
		</Layout>
	);
};

export default AnalyticsDashboard;
