import React from 'react';
import { Card, Text, Box } from '@shopify/polaris';
import { SparkLineChart } from '@shopify/polaris-viz';
import { ArrowUpIcon, ArrowDownIcon } from '@shopify/polaris-icons';
import styles from './StatBox.module.css';

interface StatBoxProps {
	title: string;
	value: string | number;
	data?: number[];
}

export const StatBox: React.FC<StatBoxProps> = ({
	title,
	value,
	data = [],
}) => {
	const hasData = data && data.length;

	const percentageChange = hasData
		? getPercentageChange(Number(data[0]), Number(data.at(-1))) || 0
		: null;

	return (
		<Card padding="0">
			<Box paddingBlock="400" paddingInlineStart="400">
				<div className={styles.statBoxContainer}>
					<div className={styles.statBoxLeft}>
						<div className={styles.statBoxPositionContainer}>
							<Text as="p" variant="headingSm">
								{title}
							</Text>
						</div>
						<Text as="h2" variant="headingLg" fontWeight="bold">
							{value}
						</Text>
						<div className={styles.statBoxFlex}>
							{percentageChange ? (
								percentageChange > 0 ? (
									<ArrowUpIcon
										style={{ height: 12, width: 12 }}
										fill={'green'}
									/>
								) : (
									<ArrowDownIcon
										style={{ height: 12, width: 12 }}
										fill={'red'}
									/>
								)
							) : null}
							<Text as="p" variant="bodySm" tone="subdued">
								<span
									style={
										percentageChange
											? {
													color: percentageChange > 0 ? 'green' : 'red',
												}
											: undefined
									}
								>
									{percentageChange !== null
										? `${Math.abs(percentageChange)}%`
										: '-'}
								</span>
							</Text>
						</div>
					</div>
					{hasData ? (
						<div className={styles.statBoxSparkLine}>
							<SparkLineChart
								offsetLeft={4}
								offsetRight={0}
								data={formatChartData(data)}
							/>
						</div>
					) : null}
				</div>
			</Box>
		</Card>
	);
};

const formatChartData = (values: number[] = []) => {
	return [{ data: values.map((stat, idx) => ({ key: idx, value: stat })) }];
};

const getPercentageChange = (
	start: number = 0,
	end: number = 0,
): number | null => {
	if (isNaN(start) || isNaN(end)) {
		return null;
	}

	const percentage = (((end - start) / start) * 100).toFixed(0);
	const numericPercentage = Number(percentage);

	if (numericPercentage > 999) {
		return 999;
	}

	if (numericPercentage < -999) {
		return -999;
	}

	return numericPercentage;
};
