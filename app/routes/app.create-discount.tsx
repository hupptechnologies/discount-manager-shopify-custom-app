import { useEffect, useState } from 'react';
import { useAppBridge } from '@shopify/app-bridge-react';
import { Page, Spinner } from '@shopify/polaris';
import { useDispatch, useSelector } from 'react-redux';
import { getCreateDiscountDetail } from 'app/redux/create-discount/slice';
import { AppDispatch, RootState } from 'app/redux/store';
import { DiscountRuleForm } from 'app/components/DiscountRuleForm/DiscountRuleForm';
import { fetchAllProductCategoryAsync } from 'app/redux/create-discount';
import Placeholder from 'app/components/Placeholder';

export type QueryType = 'order' | 'products' | 'shipping' | 'buyXgetY' | null;

export default function CreateDiscountPage () {
	const dispatch = useDispatch<AppDispatch>();
	const shopify = useAppBridge();
	const { isCategory, isLoading } = useSelector((state: RootState) => getCreateDiscountDetail(state));
	const [queryType, setQueryType] = useState<QueryType>(null);

	useEffect(() => {
		const query = window.location.search || '?type=products';
		const urlParams = new URLSearchParams(query).get('type') as QueryType;
		setQueryType(urlParams);
		dispatch(fetchAllProductCategoryAsync({
			shopName: shopify.config.shop || '',
			type: 'category'
		}));
	}, []);

	return (
		<Page
			backAction={{
				url: '/app/manage-discount',
				onAction: () => shopify.saveBar.hide('save-bar'),
			}}
			title="Create discount"
		>
			{queryType && <DiscountRuleForm queryType={queryType} />}
			<Placeholder height="5px" />
			{(isCategory || isLoading) && 
				<div className="spinner-container">
					<Spinner size="large" />
				</div>
			}
		</Page>
	);
}
