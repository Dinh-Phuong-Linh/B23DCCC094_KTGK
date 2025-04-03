import type { IColumn } from '@/components/Table/typing';
import { Button, Modal, Table, Popconfirm } from 'antd';
import { useEffect } from 'react';
import { useModel } from 'umi';
import FormRandomUser from './Form';
import { DeleteOutlined } from '@ant-design/icons';

const RandomUser = () => {
	const { 
		data, 
		getDataUser, 
		setRow, 
		isEdit, 
		setVisible, 
		setIsEdit, 
		visible,
		deleteUserData
	} = useModel('randomuser');

	useEffect(() => {
		getDataUser();
	}, []);

	const columns: IColumn<RandomUser.Record>[] = [
		{
			title: 'Address',
			dataIndex: 'address',
			key: 'name',
			width: 200,
		},
		{
			title: 'Balance',
			dataIndex: 'balance',
			key: 'age',
			width: 100,
		},
		{
			title: 'Action',
			width: 200,
			align: 'center',
			render: (record) => {
				return (
					<div>
						<Button
							onClick={() => {
								setVisible(true);
								setRow(record);
								setIsEdit(true);
							}}
						>
							Edit
						</Button>
						{record.status === OrderStatus.PENDING && (
							<Popconfirm
								title='Bạn có chắc chắn muốn hủy đơn hàng này?'
								onConfirm={() => deleteUserData(record.address)}
								okText='Hủy đơn hàng'
								cancelText='Không'
							>
								<Button type='text' danger icon={<DeleteOutlined />} />
							</Popconfirm>
						)}
					</div>
				);
			},
		},
	];

	return (
		<div>
			<Button
				type='primary'
				onClick={() => {
					setVisible(true);
					setIsEdit(false);
				}}
			>
				Add User
			</Button>

			<Table dataSource={data} columns={columns} />

			<Modal
				destroyOnClose
				footer={false}
				title={isEdit ? 'Edit User' : 'Add User'}
				visible={visible}
				onOk={() => {}}
				onCancel={() => {
					setVisible(false);
				}}
			>
				<FormRandomUser />
			</Modal>
		</div>
	);
};

export default RandomUser;
