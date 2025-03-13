import {
  Layout,
  Grid,
  Text,
  BlockStack,
  Box,
  InlineStack,
  Button,
} from '@shopify/polaris';
import { StatBox } from './StateBox';

interface DiscountStats {
  activeDiscounts: number[];
  usedDiscounts: number[];
  expiredDiscounts: number[];
}

interface IndexStateBoxProps {
  handleOpen: any;
}

const IndexStateBox: React.FC<IndexStateBoxProps> = ({ handleOpen }) => {
  const discountStats: DiscountStats = {
    activeDiscounts: [15, 22, 18, 10, 14, 19, 25],
    usedDiscounts: [5, 8, 10, 4, 6, 7, 12],
    expiredDiscounts: [2, 3, 1, 4, 2, 1, 0],
  };

  return (
    <Layout>
      <Layout.Section>
        <Box padding="200">
          <BlockStack gap="100">
            <InlineStack align='space-between' blockAlign='center' gap='100'>
              <Text as="h6" variant="headingMd">
                Analytics Overview
              </Text>
              <Button variant="primary" onClick={handleOpen}>Create discount rules</Button>
            </InlineStack>
            <Text as="p" variant="bodySm" tone="subdued">
              Shows the most recent discount code statistics and trends.
            </Text>
          </BlockStack>
        </Box>
      </Layout.Section>
      <Layout.Section>
        <Grid>
          <Grid.Cell columnSpan={{ xs: 6, lg: 4 }}>
            <StatBox
              title="Active Discounts"
              value={discountStats.activeDiscounts.at(-1) ?? 0}
              data={discountStats.activeDiscounts}
            />
          </Grid.Cell>
          <Grid.Cell columnSpan={{ xs: 6, lg: 4 }}>
            <StatBox
              title="Used Discounts"
              value={discountStats.usedDiscounts.at(-1) ?? 0}
              data={discountStats.usedDiscounts}
            />
          </Grid.Cell>
          <Grid.Cell columnSpan={{ xs: 6, lg: 4 }}>
            <StatBox
              title="Expired Discounts"
              value={discountStats.expiredDiscounts.at(-1) ?? 0}
              data={discountStats.expiredDiscounts}
            />
          </Grid.Cell>
        </Grid>
      </Layout.Section>
    </Layout>
  );
};

export default IndexStateBox;
