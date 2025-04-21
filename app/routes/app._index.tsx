import { useEffect, useState } from 'react';
import { useAppBridge } from '@shopify/app-bridge-react';
import { Badge, Card, InlineStack, Layout, List, Page } from '@shopify/polaris';
import { useDispatch, useSelector } from 'react-redux';
import { ComposeIcon } from '@shopify/polaris-icons';
import { AppDispatch, RootState } from 'app/redux/store';
import { fetchAppEmbedStatusAsync } from 'app/redux/store/index';
import { getAllStoreDetail } from 'app/redux/store/slice';
import CustomButton from 'app/components/PolarisUI/CustomButton';
import CustomText from 'app/components/PolarisUI/CustomText';
import CustomBlockStack from 'app/components/PolarisUI/CustomBlockStack';

export default function Index () {
	const { appEmbedID, appEmbedStatus, isAppEmbedLoading } = useSelector((state: RootState) => getAllStoreDetail(state));
	const dispatch = useDispatch<AppDispatch>();
	const [shop, setShop] = useState<string | null>(null);
	const deepLink = `https://${shop || ''}/admin/themes/current/editor?context=apps&template=body&activateAppId=${appEmbedID}/discount_manager`

	useEffect(() => {
		const app = useAppBridge();
		if (app) {
			setShop(app.config.shop || null);
			dispatch(fetchAppEmbedStatusAsync({
				shopName: app.config.shop || ''
			}))
		};
	}, []);

	return (
		<Page>
			<CustomBlockStack gap="500">
				<Layout>
					<Layout.Section>
						<Card>
							<CustomBlockStack gap="500">
								<CustomBlockStack gap="200">
									<InlineStack align='space-between' blockAlign='center'>
										<CustomText as="h2" variant="headingMd">
											Welcome to Smart Discount Manager 🎉  <Badge tone={appEmbedStatus ? 'success' : 'critical'} size='small'>{appEmbedStatus ? 'Active' : 'Inactive'}</Badge>
										</CustomText>
										<CustomButton loading={isAppEmbedLoading} disabled={appEmbedStatus} variant='primary' icon={ComposeIcon} onClick={() => window.parent.location.href = deepLink}>
											App Embed
										</CustomButton>
									</InlineStack>
									<CustomText variant="bodyMd" as="p">
										The Smart Discount Manager Shopify app helps merchants
										automate discounts using AI-driven insights. It dynamically
										applies discount rules based on customer behavior, order
										history, stock levels, and real-time analytics.
									</CustomText>
								</CustomBlockStack>
								<CustomBlockStack gap="200">
									<CustomText as="h3" variant="headingMd">
										App Features
									</CustomText>
									<CustomText as="p" variant="bodyMd">
										This Shopify app provides the following features for
										merchants:
									</CustomText>
									<List>
										<List.Item>
											Create advanced discount rules based on real-time
											conditions.
										</List.Item>
										<List.Item>
											Personalize discounts using AI to optimize revenue.
										</List.Item>
										<List.Item>
											Automate flash sales with schedule-based rules.
										</List.Item>
										<List.Item>
											Track discount performance with analytics.
										</List.Item>
									</List>
								</CustomBlockStack>
							</CustomBlockStack>
						</Card>
					</Layout.Section>
				</Layout>
			</CustomBlockStack>
		</Page>
	);
}
