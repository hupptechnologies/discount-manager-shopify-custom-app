import IndexStateBox from "./StateBox"

interface AnalyticsDashboardProps {
    handleOpen: any;
}

const AnalyticsDashboard: React.FC<AnalyticsDashboardProps> = ({ handleOpen }) => {
    return  (
        <IndexStateBox handleOpen={handleOpen} />
    )
};

export default AnalyticsDashboard;