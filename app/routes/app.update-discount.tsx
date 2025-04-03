import { useEffect, useState } from 'react';
import { Page } from '@shopify/polaris';
import type { QueryType } from './app.create-discount';
import { DiscountRuleForm } from 'app/components/DiscountRuleForm/DiscountRuleForm';
import Placeholder from 'app/components/Placeholder';

export default function UpdateDiscountPage () {
	const [queryType, setQueryType] = useState<QueryType>(null);

	useEffect(() => {
		const query = window.location.search || '?type=product';
		const urlParams = new URLSearchParams(query).get('type') as QueryType;
		setQueryType(urlParams);
	}, []);

	return (
		<Page
			backAction={{ content: '', url: '/app/manage-discount' }}
			title="Update discount"
		>
			{queryType && <DiscountRuleForm queryType={queryType} />}
			<Placeholder height='5px' />
		</Page>
	);
}
