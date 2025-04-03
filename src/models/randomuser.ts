import { getData } from '@/services/RandomUser';
import { getLocalData, setLocalData } from '@/services/localStorage';
import { useState } from 'react';

// LocalStorage key
const USER_DATA_KEY = 'userData';

export default () => {
	const [data, setData] = useState<RandomUser.Record[]>([]);
	const [visible, setVisible] = useState<boolean>(false);
	const [isEdit, setIsEdit] = useState<boolean>(false);
	const [row, setRow] = useState<RandomUser.Record>();

	const getDataUser = async () => {
		const dataLocal = getLocalData<RandomUser.Record[]>(USER_DATA_KEY, []);
		if (!dataLocal?.length) {
			try {
				const res = await getData();
				const userData = res?.data ?? [];
				setLocalData(USER_DATA_KEY, userData);
				setData(userData);
			} catch (error) {
				console.error('Lỗi khi lấy dữ liệu user:', error);
				setData([]);
			}
			return;
		}
		setData(dataLocal);
	};

	const addUserData = (newUser: RandomUser.Record) => {
		const newData = [newUser, ...data];
		setLocalData(USER_DATA_KEY, newData);
		setData(newData);
	};

	const updateUserData = (updatedUser: RandomUser.Record, userKey: string) => {
		const index = data.findIndex((item: RandomUser.Record) => item.address === userKey);
		if (index !== -1) {
			const newData = [...data];
			newData[index] = updatedUser;
			setLocalData(USER_DATA_KEY, newData);
			setData(newData);
		}
	};

	const deleteUserData = (userKey: string) => {
		const newData = data.filter((item: RandomUser.Record) => item.address !== userKey);
		setLocalData(USER_DATA_KEY, newData);
		setData(newData);
	};

	return {
		data,
		visible,
		setVisible,
		row,
		setRow,
		isEdit,
		setIsEdit,
		setData,
		getDataUser,
		addUserData,
		updateUserData,
		deleteUserData
	};
};
