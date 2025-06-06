import React, { useEffect, useState } from 'react';
import { Modal, Form, Select, DatePicker, Input, Button, Row, Col, InputNumber, Table, Space, Divider } from 'antd';
import { PlusOutlined, DeleteOutlined } from '@ant-design/icons';
import { Order, OrderItem, OrderStatus, Product, Customer } from '@/models/order';
import moment from 'moment';
import 'moment/locale/vi';

moment.locale('vi');

const { Option } = Select;

interface OrderModalProps {
	visible: boolean;
	type: 'add' | 'edit';
	order: Order | null;
	customers: Customer[];
	products: Product[];
	onCancel: () => void;
	onSubmit: (values: any) => void;
	calculateTotal: (items: OrderItem[]) => number;
}

const OrderModal: React.FC<OrderModalProps> = ({
	visible,
	type,
	order,
	customers,
	products,
	onCancel,
	onSubmit,
	calculateTotal,
}) => {
	const [form] = Form.useForm();
	const [selectedItems, setSelectedItems] = useState<OrderItem[]>([]);
	const [total, setTotal] = useState<number>(0);

	useEffect(() => {
		if (visible) {
			if (type === 'edit' && order) {
				form.setFieldsValue({
					customerId: order.customerId,
					status: order.status,
				});
				setSelectedItems(order.items);
				setTotal(order.total);
			} else {
				form.resetFields();
				setSelectedItems([]);
				setTotal(0);
			}
		}
	}, [visible, type, order, form]);

	// Cập nhật tổng tiền khi items thay đổi
	useEffect(() => {
		setTotal(calculateTotal(selectedItems));
	}, [selectedItems, calculateTotal]);

	const handleAdd = () => {
		form.validateFields().then((values) => {
			const customer = customers.find((c) => c.id === values.customerId);

			const formattedValues: Partial<Order> = {
				customerId: values.customerId,
				customerName: customer ? customer.name : '',
				status: values.status || OrderStatus.PENDING,
				items: selectedItems,
				total: total,
			};

			if (type === 'edit' && order) {
				formattedValues.id = order.id;
				formattedValues.orderDate = order.orderDate;
			}

			onSubmit(formattedValues);
			form.resetFields();
			setSelectedItems([]);
			setTotal(0);
		});
	};

	const handleSelectProduct = (productId: string) => {
		const product = products.find((p) => p.id === productId);
		if (product) {
			// Kiểm tra xem sản phẩm đã được thêm vào chưa
			const existingItem = selectedItems.find((item) => item.productId === productId);
			if (existingItem) {
				// Nếu sản phẩm đã tồn tại, tăng số lượng lên 1
				const updatedItems = selectedItems.map((item) =>
					item.productId === productId ? { ...item, quantity: item.quantity + 1 } : item,
				);
				setSelectedItems(updatedItems);
			} else {
				// Nếu sản phẩm chưa tồn tại, thêm mới với số lượng = 1
				const newItem: OrderItem = {
					productId: product.id,
					productName: product.name,
					price: product.price,
					quantity: 1,
				};
				setSelectedItems([...selectedItems, newItem]);
			}
		}
	};

	const handleChangeQuantity = (productId: string, quantity: number) => {
		if (quantity > 0) {
			const updatedItems = selectedItems.map((item) => (item.productId === productId ? { ...item, quantity } : item));
			setSelectedItems(updatedItems);
		}
	};

	const handleRemoveItem = (productId: string) => {
		const updatedItems = selectedItems.filter((item) => item.productId !== productId);
		setSelectedItems(updatedItems);
	};

	const columns = [
		{
			title: 'Product',
			dataIndex: 'productName',
			key: 'productName',
		},
		{
			title: 'Price',
			dataIndex: 'price',
			key: 'price',
			render: (price: number) => `${price.toLocaleString('vi-VN')} VNĐ`,
		},
		{
			title: 'Quantity',
			dataIndex: 'quantity',
			key: 'quantity',
			render: (quantity: number, record: OrderItem) => (
				<InputNumber
					min={1}
					value={quantity}
					onChange={(value) => handleChangeQuantity(record.productId, value as number)}
				/>
			),
		},
		{
			title: 'Total',
			key: 'total',
			render: (record: OrderItem) => `${(record.price * record.quantity).toLocaleString('vi-VN')} VNĐ`,
		},
		{
			title: 'Action',
			key: 'action',
			render: (record: OrderItem) => (
				<Button type='text' danger icon={<DeleteOutlined />} onClick={() => handleRemoveItem(record.productId)} />
			),
		},
	];

	const title = type === 'add' ? 'Add New Order' : 'Edit Order';

	return (
		<Modal
			title={title}
			visible={visible}
			onCancel={onCancel}
			width={800}
			footer={[
				<Button key='back' onClick={onCancel}>
					Cancel
				</Button>,
				<Button key='submit' type='primary' onClick={handleAdd}>
					{type === 'add' ? 'Add' : 'Update'}
				</Button>,
			]}
		>
			<Form
				form={form}
				layout='vertical'
				initialValues={{
					status: OrderStatus.PENDING,
				}}
			>
				<Row gutter={16}>
					<Col span={12}>
						<Form.Item
							name='customerId'
							label='Customer'
							rules={[{ required: true, message: 'Please select a customer!' }]}
						>
							<Select placeholder='Select customer'>
								{customers.map((customer) => (
									<Option key={customer.id} value={customer.id}>
										{customer.name} - {customer.phone}
									</Option>
								))}
							</Select>
						</Form.Item>
					</Col>
					<Col span={12}>
						<Form.Item name='status' label='Status'>
							<Select placeholder='Select status'>
								<Option key={OrderStatus.PENDING} value={OrderStatus.PENDING}>
									Pending
								</Option>
								<Option key={OrderStatus.SHIPPING} value={OrderStatus.SHIPPING}>
									Shipping
								</Option>
								<Option key={OrderStatus.COMPLETED} value={OrderStatus.COMPLETED}>
									Completed
								</Option>
								<Option key={OrderStatus.CANCELLED} value={OrderStatus.CANCELLED}>
									Cancelled
								</Option>
							</Select>
						</Form.Item>
					</Col>
				</Row>

				<Divider>Product Information</Divider>

				<Row gutter={16} style={{ marginBottom: 16 }}>
					<Col span={18}>
						<Select
							style={{ width: '100%' }}
							placeholder='Select product'
							onChange={handleSelectProduct}
							optionFilterProp='children'
							showSearch
						>
							{products.map((product) => (
								<Option key={product.id} value={product.id}>
									{product.name} - {product.price.toLocaleString('vi-VN')} VNĐ
								</Option>
							))}
						</Select>
					</Col>
					<Col span={6}>
						<Button
							type='primary'
							icon={<PlusOutlined />}
							onClick={() => {
								const select = document.querySelector('.ant-select') as HTMLElement;
								if (select) select.click();
							}}
						>
							Add Product
						</Button>
					</Col>
				</Row>

				<Table
					columns={columns}
					dataSource={selectedItems}
					rowKey='productId'
					pagination={false}
					summary={() => (
						<Table.Summary fixed>
							<Table.Summary.Row>
								<Table.Summary.Cell index={0} colSpan={2}>
									Total Amount
								</Table.Summary.Cell>
								<Table.Summary.Cell index={1} colSpan={3}>
									<span style={{ fontWeight: 'bold', fontSize: '16px' }}>{total.toLocaleString('vi-VN')} VNĐ</span>
								</Table.Summary.Cell>
							</Table.Summary.Row>
						</Table.Summary>
					)}
				/>
			</Form>
		</Modal>
	);
};

export default OrderModal;
