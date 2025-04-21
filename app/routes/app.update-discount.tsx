import { useEffect, useState } from 'react';
import { useAppBridge } from '@shopify/app-bridge-react';
import { Page } from '@shopify/polaris';
import { useDispatch } from 'react-redux';
import { fetchAllProductCategoryAsync } from 'app/redux/create-discount';
import type { AppDispatch } from 'app/redux/store';
import type { QueryType } from './app.create-discount';
import { DiscountRuleForm } from 'app/components/DiscountRuleForm/DiscountRuleForm';
import Placeholder from 'app/components/Placeholder';

export default function UpdateDiscountPage () {
	const dispatch = useDispatch<AppDispatch>();
	const shopify = useAppBridge();
	const [queryType, setQueryType] = useState<QueryType>(null);

	useEffect(() => {
		const query = window.location.search || '?type=product';
		const urlParams = new URLSearchParams(query).get('type') as QueryType;
		setQueryType(urlParams);
		dispatch(fetchAllProductCategoryAsync({
			shopName: shopify.config.shop || '',
			type: 'category'
		}));
	}, []);

	return (
		<Page
			backAction={{ content: '', url: '/app/manage-discount' }}
			title="Update discount"
		>
			{queryType && <DiscountRuleForm queryType={queryType} />}
			<Placeholder height="5px" />
		</Page>
	);
}
