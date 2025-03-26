import { useEffect, useState } from 'react';
import { Page } from '@shopify/polaris';
import { DiscountRuleForm } from 'app/components/DiscountRuleForm/DiscountRuleForm';

export type QueryType = 'order' | 'products' | 'shipping' | 'buyXgetY' | null;

export default function CreateDiscountPage () {
	const [queryType, setQueryType] = useState<QueryType>(null);

	useEffect(() => {
		const query = window.location.search || '?type=products';
		const urlParams = new URLSearchParams(query).get('type') as QueryType;
		setQueryType(urlParams);
	}, []);

	return (
		<Page
			backAction={{ content: '', url: '/app/manage-discount' }}
			title="Create discount"
		>
			{queryType && <DiscountRuleForm queryType={queryType} />}
			<br />
		</Page>
	);
}
