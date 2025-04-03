import React from 'react';
import { Table, Space, Button, Tag, Popconfirm, Input, Select } from 'antd';
import { SearchOutlined, PlusOutlined, EditOutlined, DeleteOutlined, EyeOutlined } from '@ant-design/icons';
import { Order, OrderStatus } from '@/models/order';
import moment from 'moment';
import 'moment/locale/vi';
import type { TableProps } from 'antd/es/table';
import type { ColumnsType } from 'antd/es/table';

moment.locale('vi');

const { Option } = Select;

interface OrderListProps {
	orders: Order[];
	loading: boolean;
	filterStatus: OrderStatus | '';
	searchKeyword: string;
	onSearch: (value: string) => void;
	onFilterByStatus: (status: OrderStatus | '') => void;
	onSort: (field: 'orderDate' | 'total', direction: 'ascend' | 'descend') => void;
	onAdd: () => void;
	onEdit: (order: Order) => void;
	onCancel: (orderId: string) => void;
	onView: (order: Order) => void;
}

const OrderList: React.FC<OrderListProps> = ({
	orders,
	loading,
	filterStatus,
	searchKeyword,
	onSearch,
	onFilterByStatus,
	onSort,
	onAdd,
	onEdit,
	onCancel,
	onView,
}) => {
	const getStatusColor = (status: OrderStatus) => {
		switch (status) {
			case OrderStatus.PENDING:
				return 'orange';
			case OrderStatus.SHIPPING:
				return 'blue';
			case OrderStatus.COMPLETED:
				return 'green';
			case OrderStatus.CANCELLED:
				return 'red';
			default:
				return 'default';
		}
	};

	const columns: ColumnsType<Order> = [
		{
			title: 'Mã đơn hàng',
			dataIndex: 'id',
			key: 'id',
			width: 140,
		},
		{
			title: 'Khách hàng',
			dataIndex: 'customerName',
			key: 'customerName',
			width: 200,
		},
		{
			title: 'Ngày đặt hàng',
			dataIndex: 'orderDate',
			key: 'orderDate',
			width: 150,
			render: (date: Date) => moment(date).format('DD/MM/YYYY'),
			sorter: true,
			sortDirections: ['ascend', 'descend'],
			defaultSortOrder: 'descend',
		},
		{
			title: 'Tổng tiền',
			dataIndex: 'total',
			key: 'total',
			width: 180,
			render: (total: number) => `${total.toLocaleString('vi-VN')} VNĐ`,
			sorter: true,
			sortDirections: ['ascend', 'descend'],
		},
		{
			title: 'Trạng thái',
			dataIndex: 'status',
			key: 'status',
			width: 150,
			render: (status: OrderStatus) => <Tag color={getStatusColor(status)}>{status}</Tag>,
			filters: [
				{ text: 'Chờ xác nhận', value: OrderStatus.PENDING },
				{ text: 'Đang giao', value: OrderStatus.SHIPPING },
				{ text: 'Hoàn thành', value: OrderStatus.COMPLETED },
				{ text: 'Hủy', value: OrderStatus.CANCELLED },
			],
			filteredValue: filterStatus ? [filterStatus] : null,
		},
		{
			title: 'Thao tác',
			key: 'action',
			width: 200,
			render: (_: any, record: Order) => (
				<Space size='small'>
					<Button type='text' icon={<EyeOutlined />} onClick={() => onView(record)} />
					<Button type='text' icon={<EditOutlined />} onClick={() => onEdit(record)} />
					{record.status === OrderStatus.PENDING && (
						<Popconfirm
							title='Bạn có chắc chắn muốn hủy đơn hàng này?'
							onConfirm={() => onCancel(record.id)}
							okText='Hủy đơn hàng'
							cancelText='Không'
						>
							<Button type='text' danger icon={<DeleteOutlined />} />
						</Popconfirm>
					)}
				</Space>
			),
		},
	];

	const handleTableChange: TableProps<Order>['onChange'] = (pagination, filters, sorter, extra) => {
		if (sorter && 'field' in sorter && 'order' in sorter) {
			const field = sorter.field as 'orderDate' | 'total';
			const direction = (sorter.order as 'ascend' | 'descend') || 'descend';
			onSort(field, direction);
		}

		if (filters.status && filters.status.length > 0) {
			onFilterByStatus(filters.status[0] as OrderStatus);
		} else {
			onFilterByStatus('');
		}
	};

	return (
		<div>
			<div style={{ marginBottom: 16, display: 'flex', justifyContent: 'space-between' }}>
				<Space>
					<Input
						placeholder='Tìm kiếm theo mã đơn hàng hoặc khách hàng'
						value={searchKeyword}
						onChange={(e) => onSearch(e.target.value)}
						style={{ width: 300 }}
						prefix={<SearchOutlined />}
						allowClear
					/>
					<Select
						placeholder='Lọc theo trạng thái'
						style={{ width: 200 }}
						allowClear
						onChange={(value) => onFilterByStatus((value as OrderStatus) || '')}
						value={filterStatus || undefined}
					>
						{Object.values(OrderStatus).map((status) => (
							<Option key={status} value={status}>
								{status}
							</Option>
						))}
					</Select>
				</Space>
				<Button type='primary' icon={<PlusOutlined />} onClick={onAdd}>
					Thêm đơn hàng
				</Button>
			</div>
			<Table
				columns={columns}
				dataSource={orders}
				rowKey='id'
				loading={loading}
				onChange={handleTableChange}
				pagination={{
					defaultPageSize: 10,
					showSizeChanger: true,
					pageSizeOptions: ['10', '20', '50'],
					showTotal: (total) => `Tổng cộng ${total} đơn hàng`,
				}}
			/>
		</div>
	);
};

export default OrderList;
