import React, { useState } from 'react';
import { PageContainer } from '@ant-design/pro-components';
import { Drawer, Button, Space } from 'antd';
import { useOrderModel, Order, OrderStatus, OrderItem } from '@/models/order';
import OrderList from './components/OrderList';
import OrderModal from './components/OrderModal';
import OrderDetail from './components/OrderDetail';
import { ReloadOutlined } from '@ant-design/icons';

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

  // Hàm reset dữ liệu
  const handleResetData = () => {
    // Xóa tất cả dữ liệu đơn hàng trong localStorage
    localStorage.removeItem('orders');
    localStorage.removeItem('customers');
    localStorage.removeItem('products');
    
    // Tải lại trang
    window.location.reload();
  };

  return (
    <PageContainer 
      title="Order Management"
      extra={[
        <Button 
          key="reset" 
          icon={<ReloadOutlined />} 
          onClick={handleResetData}
          style={{ marginRight: 8 }}
        >
          Reset Data
        </Button>,
        <Button 
          key="add" 
          type="primary" 
          onClick={handleAdd}
        >
          Add Order
        </Button>
      ]}
    >
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
        title="Order Details"
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