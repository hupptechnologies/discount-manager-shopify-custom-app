import { TitleBar } from '@shopify/app-bridge-react';
import {
	BlockStack,
	Card,
	Layout,
	List,
	Page,
	Text
} from '@shopify/polaris';

export default function Index () {
	return (
		<Page>
			<TitleBar title="Smart Discount Manager – AI-Powered Discount Rules"></TitleBar>
			<BlockStack gap="500">
				<Layout>
					<Layout.Section>
						<Card>
							<BlockStack gap="500">
								<BlockStack gap="200">
									<Text as="h2" variant="headingMd">
										Welcome to Smart Discount Manager 🎉
									</Text>
									<Text variant="bodyMd" as="p">
										The Smart Discount Manager Shopify app helps merchants
										automate discounts using AI-driven insights. It dynamically
										applies discount rules based on customer behavior, order
										history, stock levels, and real-time analytics.
									</Text>
								</BlockStack>

								<BlockStack gap="200">
									<Text as="h3" variant="headingMd">
										App Features
									</Text>
									<Text as="p" variant="bodyMd">
										This Shopify app provides the following features for
										merchants:
									</Text>
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
								</BlockStack>
							</BlockStack>
						</Card>
					</Layout.Section>
				</Layout>
			</BlockStack>
		</Page>
	);
}
