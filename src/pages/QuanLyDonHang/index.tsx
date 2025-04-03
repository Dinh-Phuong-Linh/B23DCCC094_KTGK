import React, { useState } from 'react';
import { PageContainer } from '@ant-design/pro-components';
import { Drawer } from 'antd';
import { useOrderModel, Order, OrderStatus, OrderItem } from '@/models/order';
import OrderList from './components/OrderList';
import OrderModal from './components/OrderModal';
import OrderDetail from './components/OrderDetail';

const OrderManager: React.FC = () => {
  const {
    filteredOrders,
    customers,
    products,
    loading,
    filterStatus,
    searchKeyword,
    modalVisible,
    modalType,
    selectedOrder,
    setModalVisible,
    setModalType,
    setSelectedOrder,
    addOrder,
    updateOrder,
    cancelOrder,
    filterOrdersByStatus,
    searchOrders,
    sortOrders,
    calculateOrderTotal,
  } = useOrderModel();

  const [detailVisible, setDetailVisible] = useState<boolean>(false);

  // Xử lý khi nhấn nút thêm mới
  const handleAdd = () => {
    setSelectedOrder(null);
    setModalType('add');
    setModalVisible(true);
  };

  // Xử lý khi nhấn nút chỉnh sửa
  const handleEdit = (order: Order) => {
    setSelectedOrder(order);
    setModalType('edit');
    setModalVisible(true);
  };

  // Xử lý khi nhấn nút xem chi tiết
  const handleView = (order: Order) => {
    setSelectedOrder(order);
    setDetailVisible(true);
  };

  // Xử lý khi submit form modal
  const handleSubmitModal = (values: any) => {
    if (modalType === 'add') {
      addOrder(values);
    } else {
      updateOrder(values.id, values);
    }
    setModalVisible(false);
  };

  return (
    <PageContainer title="Quản lý đơn hàng">
      <OrderList
        orders={filteredOrders}
        loading={loading}
        filterStatus={filterStatus}
        searchKeyword={searchKeyword}
        onSearch={searchOrders}
        onFilterByStatus={filterOrdersByStatus}
        onSort={sortOrders}
        onAdd={handleAdd}
        onEdit={handleEdit}
        onCancel={cancelOrder}
        onView={handleView}
      />

      <OrderModal
        visible={modalVisible}
        type={modalType}
        order={selectedOrder}
        customers={customers}
        products={products}
        onCancel={() => setModalVisible(false)}
        onSubmit={handleSubmitModal}
        calculateTotal={calculateOrderTotal}
      />

      <Drawer
        title="Chi tiết đơn hàng"
        width={700}
        onClose={() => setDetailVisible(false)}
        visible={detailVisible}
      >
        <OrderDetail order={selectedOrder} />
      </Drawer>
    </PageContainer>
  );
};

export default OrderManager; 