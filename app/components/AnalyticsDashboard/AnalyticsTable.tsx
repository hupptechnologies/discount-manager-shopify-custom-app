import { useState, useCallback, useEffect } from 'react';
import { Modal, TitleBar, useAppBridge } from '@shopify/app-bridge-react';
import { useNavigate } from '@remix-run/react';
import pkg from 'lodash';
import {
	IndexTable,
	LegacyCard,
	IndexFilters,
	useSetIndexFiltersMode,
	useIndexResourceState,
	Text,
	Badge,
	type IndexFiltersProps,
	type TabProps,
	ButtonGroup,
	Button,
	Layout,
	Tooltip,
} from '@shopify/polaris';
import { EditIcon, DeleteIcon } from '@shopify/polaris-icons';
import { useDispatch, useSelector } from 'react-redux';
import type { AppDispatch, RootState } from 'app/redux/store';
import {
	getAllDiscountCodeDetail,
	handleUpdateDiscountCodeId,
} from 'app/redux/discount/slice';
import {
	deleteAllDiscountCodeAsync,
	deleteDiscountCodeAsync,
	fetchAllDiscountCodesAsync,
	getDiscountCodeByIdAsync,
} from 'app/redux/discount';
import Placeholder from '../Placeholder';
import { formatDateWithTime } from 'app/utils/json';

interface AnalyticsTableProps {
	setIsLoadingUpdate: any;
}

interface DeleteDataList {
	id: null | number;
	code: string;
	discountId: string;
}

const AnalyticsTable: React.FC<AnalyticsTableProps> = ({
	setIsLoadingUpdate,
}) => {
	const { debounce } = pkg;
	const { mode, setMode } = useSetIndexFiltersMode();
	const navigate = useNavigate();
	const shopify = useAppBridge();
	const dispatch = useDispatch<AppDispatch>();
	const {
		discountCodes,
		isLoading,
		pagination: { totalPages, totalCount },
		isDeleteDiscountCode,
	} = useSelector((state: RootState) => getAllDiscountCodeDetail(state));
	const [queryValue, setQueryValue] = useState('');
	const itemStrings = [
		'All',
		'Active codes',
		'Pending codes',
		'Expired codes',
		'Used codes',
	];
	const [selected, setSelected] = useState(0);
	const [currentPage, setCurrentPage] = useState<number>(1);
	const [sortSelected, setSortSelected] = useState(['createdAt desc']);
	const [deleteData, setDeleteData] = useState<DeleteDataList>({
		id: null,
		code: '',
		discountId: '',
	});
	const [call, setCall] = useState(false);

	const limit = 10;
	const sortOptions: IndexFiltersProps['sortOptions'] = [
		{
			label: 'Created At',
			value: 'createdAt asc',
			directionLabel: 'Ascending',
		},
		{
			label: 'Created At',
			value: 'createdAt desc',
			directionLabel: 'Descending',
		},
	];

	const debouncedHandleFetch = useCallback(
		debounce((queryValue, selected, currentPage, sortSelected) => {
			dispatch(
				fetchAllDiscountCodesAsync({
					page: currentPage,
					pageSize: String(limit),
					shopName: shopify.config.shop || '',
					searchQuery: queryValue,
					usedCountGreaterThan: (selected === 4 && 1) || null,
					orderByCreatedAt: sortSelected.includes('createdAt asc')
						? 'asc'
						: 'desc',
					status:
						(selected === 1 && 'active') ||
						(selected === 2 && 'pending') ||
						(selected === 3 && 'expired') ||
						null,
				}),
			);
		}, 300),
		[],
	);

	useEffect(() => {
		debouncedHandleFetch(queryValue, selected, currentPage, sortSelected);
	}, [queryValue, selected, currentPage, limit, sortSelected, call]);

	const tabs: TabProps[] = itemStrings.map((item, index) => ({
		content: item,
		index,
		onAction: () => {},
		id: `${item}-${index}`,
		isLocked: index === 0,
	}));

	const handleFiltersQueryChange = useCallback(
		(value: string) => setQueryValue(value),
		[],
	);

	const handleQueryValueRemove = useCallback(() => {
		setQueryValue('');
	}, []);

	const resourceName = {
		singular: 'discountCode',
		plural: 'discountCodes',
	};

	const handleOpen = (e: any, data: DeleteDataList): void => {
		e.stopPropagation();
		setDeleteData(data);
		shopify.modal.show('delete-comfirmation-modal');
	};

	const handleClose = () => {
		setDeleteData({
			id: null,
			code: '',
			discountId: '',
		});
		shopify.modal.hide('delete-comfirmation-modal');
	};

	const handleDelete = () => {
		if (deleteData.code === 'all_code_delete') {
			dispatch(
				deleteAllDiscountCodeAsync({
					shopName: shopify.config.shop || '',
					type: deleteData.code,
					callback () {
						setCall(!call);
					},
				}),
			);
		} else {
			dispatch(
				deleteDiscountCodeAsync({
					shopName: shopify.config.shop || '',
					data: {
						id: deleteData.id,
						code: deleteData.code,
						discountId: deleteData.discountId,
					},
					callback () {
						setCall(!call);
					},
				}),
			);
		}
		handleClose();
	};

	const handleEdit = (
		e: React.MouseEvent<HTMLElement>,
		discountId: number,
		id: number,
		type: string,
		isCustom: boolean,
	): void => {
		e.stopPropagation();
		setIsLoadingUpdate(true);
		dispatch(handleUpdateDiscountCodeId({ id }));
		dispatch(
			getDiscountCodeByIdAsync({
				shopName: shopify.config.shop || '',
				id: discountId,
				discountType: type,
				method: isCustom ? 'custom' : 'auto',
				callback () {
					setIsLoadingUpdate(false);
					navigate(
						`/app/update-discount?type=${type === 'BUYXGETY' ? 'buyXgetY' : type === 'PRODUCT' ? 'products' : type === 'ORDER' ? 'order' : 'shipping'}`,
					);
				},
			}),
		);
	};

	const bulkActions: any[] = [
		{
			icon: DeleteIcon,
			destructive: true,
			content: 'Delete all codes',
			onAction: (e: any) => {
				setDeleteData({ ...deleteData, code: 'all_code_delete' });
				shopify.modal.show('delete-comfirmation-modal');
			},
		}
	];

	const { selectedResources, allResourcesSelected, handleSelectionChange } =
		useIndexResourceState(discountCodes as any[]);

	const rowMarkup =
		discountCodes?.length > 0 &&
		discountCodes.map(
			(
				{
					id,
					code,
					discountId,
					discountAmount,
					asyncUsageCount,
					isActive,
					startDate,
					endDate,
					createdAt,
					discountScope,
				},
				index,
			) => (
				<IndexTable.Row
					id={id as any}
					key={id}
					selected={selectedResources.includes(id as any)}
					position={index}
				>
					<IndexTable.Cell>
						<Text variant="bodyMd" fontWeight="bold" as="span">
							{code}
						</Text>
					</IndexTable.Cell>
					<IndexTable.Cell>{discountAmount}%</IndexTable.Cell>
					<IndexTable.Cell>{discountScope}</IndexTable.Cell>
					<IndexTable.Cell>
						<Text as="span" alignment="start">
							{asyncUsageCount}
						</Text>
					</IndexTable.Cell>
					<IndexTable.Cell>
						<Badge
							tone={
								new Date(endDate) < new Date()
									? 'warning'
									: isActive
										? 'success'
										: 'attention'
							}
						>
							{new Date(endDate) < new Date()
								? 'Expired'
								: isActive
									? 'Active'
									: 'Pending'}
						</Badge>
					</IndexTable.Cell>
					<IndexTable.Cell>{formatDateWithTime(startDate)}</IndexTable.Cell>
					<IndexTable.Cell>{formatDateWithTime(endDate)}</IndexTable.Cell>
					<IndexTable.Cell>{formatDateWithTime(createdAt)}</IndexTable.Cell>
					<IndexTable.Cell>
						<ButtonGroup noWrap gap="tight">
							<Tooltip content="Edit discount" dismissOnMouseOut>
								<Button
									onClick={(e: any) =>
										handleEdit(
											e,
											parseInt(discountId.split('/').pop() as string),
											id,
											discountScope,
											discountId.includes('DiscountCodeNode') as boolean,
										)
									}
									variant="secondary"
									icon={EditIcon}
									tone="success"
								></Button>
							</Tooltip>
							<Tooltip content="Delete discount" dismissOnMouseOut>
								<Button
									onClick={(e: any) => handleOpen(e, { id, code, discountId })}
									variant="secondary"
									icon={DeleteIcon}
									tone="critical"
								></Button>
							</Tooltip>
						</ButtonGroup>
					</IndexTable.Cell>
				</IndexTable.Row>
			),
		);

	return (
		<LegacyCard>
			<IndexFilters
				sortOptions={sortOptions}
				sortSelected={sortSelected}
				queryValue={queryValue}
				queryPlaceholder="Searching in all"
				onQueryChange={handleFiltersQueryChange}
				onQueryClear={handleQueryValueRemove}
				onSort={setSortSelected}
				cancelAction={{
					onAction: handleQueryValueRemove,
					disabled: false,
					loading: false,
				}}
				tabs={tabs}
				selected={selected}
				onSelect={(index) => {
					setCurrentPage(1);
					setSelected(index);
				}}
				canCreateNewView={false}
				filters={[]}
				appliedFilters={[]}
				onClearAll={handleQueryValueRemove}
				mode={mode}
				loading={isLoading || isDeleteDiscountCode}
				setMode={setMode}
			/>
			<IndexTable
				resourceName={resourceName}
				itemCount={discountCodes.length}
				selectedItemsCount={
					allResourcesSelected ? 'All' : selectedResources.length
				}
				onSelectionChange={handleSelectionChange}
				bulkActions={selectedResources?.length === discountCodes?.length ? bulkActions : []}
				headings={[
					{ title: 'Discount Code' },
					{ title: 'Discount Percentage' },
					{ title: 'Applicable Scope' },
					{ title: 'Usage Count' },
					{ title: 'Status' },
					{ title: 'Start Date' },
					{ title: 'End Date' },
					{ title: 'Created At' },
					{ title: 'Action' },
				]}
				pagination={{
					hasPrevious: currentPage > 1,
					hasNext: currentPage < totalPages,
					onPrevious: () => setCurrentPage((prev) => prev - 1),
					onNext: () => setCurrentPage((prev) => prev + 1),
					label: `Showing ${(currentPage - 1) * limit + 1} to ${Math.min(currentPage * limit, totalCount)} of ${totalCount} codes`,
				}}
			>
				{rowMarkup}
			</IndexTable>
			<Modal id="delete-comfirmation-modal">
				<Layout.Section>
					<Text as="p" tone="subdued" truncate>
						Are you sure you want to delete <b>{deleteData.code}</b> discount
						code? this will remove all related data.
					</Text>
				</Layout.Section>
				<Placeholder height="5px" />
				<TitleBar title="Delete Confirmation">
					<button onClick={handleDelete} variant="primary" tone="critical">
						Confirm Delete
					</button>
					<button onClick={handleClose}>Cancel</button>
				</TitleBar>
			</Modal>
		</LegacyCard>
	);
};

export default AnalyticsTable;
