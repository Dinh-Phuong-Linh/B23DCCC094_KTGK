import React from 'react';
import { Descriptions, Table, Typography, Tag } from 'antd';
import { Order, OrderItem, OrderStatus } from '@/models/order';
import moment from 'moment';
import 'moment/locale/vi';

moment.locale('vi');

const { Title } = Typography;

interface OrderDetailProps {
	order: Order | null;
}

const OrderDetail: React.FC<OrderDetailProps> = ({ order }) => {
	if (!order) return null;

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

	const columns = [
		{
			title: 'Sản phẩm',
			dataIndex: 'productName',
			key: 'productName',
		},
		{
			title: 'Đơn giá',
			dataIndex: 'price',
			key: 'price',
			render: (price: number) => `${price.toLocaleString('vi-VN')} VNĐ`,
		},
		{
			title: 'Số lượng',
			dataIndex: 'quantity',
			key: 'quantity',
		},
		{
			title: 'Thành tiền',
			key: 'total',
			render: (record: OrderItem) => `${(record.price * record.quantity).toLocaleString('vi-VN')} VNĐ`,
		},
	];

	return (
		<div>
			<Title level={5}>Thông tin đơn hàng</Title>
			<Descriptions bordered column={2}>
				<Descriptions.Item label='Mã đơn hàng' span={2}>
					{order.id}
				</Descriptions.Item>
				<Descriptions.Item label='Khách hàng' span={2}>
					{order.customerName}
				</Descriptions.Item>
				<Descriptions.Item label='Ngày đặt hàng'>{moment(order.orderDate).format('DD/MM/YYYY')}</Descriptions.Item>
				<Descriptions.Item label='Trạng thái'>
					<Tag color={getStatusColor(order.status)}>{order.status}</Tag>
				</Descriptions.Item>
				<Descriptions.Item label='Tổng tiền' span={2}>
					<span style={{ fontWeight: 'bold', fontSize: '16px', color: '#f50' }}>
						{order.total.toLocaleString('vi-VN')} VNĐ
					</span>
				</Descriptions.Item>
			</Descriptions>

			<Title level={5} style={{ marginTop: 20 }}>
				Chi tiết sản phẩm
			</Title>
			<Table
				columns={columns}
				dataSource={order.items}
				rowKey='productId'
				pagination={false}
				summary={() => (
					<Table.Summary fixed>
						<Table.Summary.Row>
							<Table.Summary.Cell index={0} colSpan={3} align='right'>
								<strong>Tổng cộng:</strong>
							</Table.Summary.Cell>
							<Table.Summary.Cell index={1}>
								<span style={{ fontWeight: 'bold', fontSize: '16px', color: '#f50' }}>
									{order.total.toLocaleString('vi-VN')} VNĐ
								</span>
							</Table.Summary.Cell>
						</Table.Summary.Row>
					</Table.Summary>
				)}
			/>
		</div>
	);
};

export default OrderDetail;
