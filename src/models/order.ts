import { useEffect, useState } from 'react';
import { OrderService } from '@/services/DonHang/order.service';

// Enum trạng thái đơn hàng
export enum OrderStatus {
  PENDING = 'pending',
  SHIPPING = 'shipping',
  COMPLETED = 'completed',
  CANCELLED = 'cancelled'
}

// Interface cho sản phẩm
export interface Product {
  id: string;
  name: string;
  price: number;
  inventory: number;
}

// Interface cho khách hàng
export interface Customer {
  id: string;
  name: string;
  phone: string;
  address: string;
}

// Interface cho item trong đơn hàng
export interface OrderItem {
  productId: string;
  productName: string;
  quantity: number;
  price: number;
}

// Interface cho đơn hàng
export interface Order {
  id: string;
  customerId: string;
  customerName: string;
  orderDate: Date;
  status: OrderStatus;
  items: OrderItem[];
  total: number;
}

// Hook quản lý state và logic cho đơn hàng
export function useOrderModel() {
  const [orders, setOrders] = useState<Order[]>([]);
  const [customers, setCustomers] = useState<Customer[]>([]);
  const [products, setProducts] = useState<Product[]>([]);
  const [selectedOrder, setSelectedOrder] = useState<Order | null>(null);
  const [loading, setLoading] = useState<boolean>(false);
  const [modalVisible, setModalVisible] = useState<boolean>(false);
  const [modalType, setModalType] = useState<'add' | 'edit'>('add');
  const [filteredOrders, setFilteredOrders] = useState<Order[]>([]);
  const [filterStatus, setFilterStatus] = useState<OrderStatus | ''>('');
  const [searchKeyword, setSearchKeyword] = useState<string>('');
  const [sortField, setSortField] = useState<'orderDate' | 'total'>('orderDate');
  const [sortDirection, setSortDirection] = useState<'ascend' | 'descend'>('descend');

  // Khởi tạo dữ liệu từ service khi component mount
  useEffect(() => {
    loadInitialData();
  }, []);

  // Load dữ liệu ban đầu từ service
  const loadInitialData = () => {
    setLoading(true);
    try {
      // Khởi tạo dữ liệu mẫu nếu chưa có
      OrderService.initSampleDataIfNeeded();
      
      // Lấy dữ liệu từ service
      const ordersData = OrderService.getOrders();
      const customersData = OrderService.getCustomers();
      const productsData = OrderService.getProducts();
      
      setOrders(ordersData);
      setFilteredOrders(ordersData);
      setCustomers(customersData);
      setProducts(productsData);
    } catch (error) {
      console.error('Lỗi khi tải dữ liệu ban đầu:', error);
    } finally {
      setLoading(false);
    }
  };

  // Thêm đơn hàng mới
  const addOrder = (orderData: Omit<Order, 'id'>) => {
    const newOrder: Order = {
      ...orderData,
      id: OrderService.generateOrderId(),
    };

    if (OrderService.addOrder(newOrder)) {
      setOrders(prev => [...prev, newOrder]);
      setFilteredOrders(prev => [...prev, newOrder]);
    }
  };

  // Cập nhật đơn hàng
  const updateOrder = (orderId: string, orderData: Partial<Order>) => {
    if (OrderService.updateOrder(orderId, orderData)) {
      const updatedOrders = orders.map(order => 
        order.id === orderId ? { ...order, ...orderData } : order
      );
      
      setOrders(updatedOrders);
      setFilteredOrders(
        filteredOrders.map(order => 
          order.id === orderId ? { ...order, ...orderData } : order
        )
      );
    }
  };

  // Hủy đơn hàng
  const cancelOrder = (orderId: string) => {
    if (OrderService.cancelOrder(orderId)) {
      const updatedOrders = orders.map(order => 
        order.id === orderId 
          ? { ...order, status: OrderStatus.CANCELLED } 
          : order
      );
      
      setOrders(updatedOrders);
      setFilteredOrders(
        filteredOrders.map(order => 
          order.id === orderId 
            ? { ...order, status: OrderStatus.CANCELLED } 
            : order
        )
      );
    }
  };

  // Lọc đơn hàng theo trạng thái
  const filterOrdersByStatus = (status: OrderStatus | '') => {
    setFilterStatus(status);
    
    if (status === '') {
      // Nếu không có trạng thái, áp dụng tìm kiếm hiện tại
      searchOrders(searchKeyword);
    } else {
      // Lọc theo trạng thái và từ khóa tìm kiếm
      const filtered = orders.filter(order => 
        order.status === status &&
        (
          searchKeyword === '' || 
          order.id.toLowerCase().includes(searchKeyword.toLowerCase()) ||
          order.customerName.toLowerCase().includes(searchKeyword.toLowerCase())
        )
      );
      setFilteredOrders(filtered);
    }
  };

  // Tìm kiếm đơn hàng theo từ khóa
  const searchOrders = (keyword: string) => {
    setSearchKeyword(keyword);
    
    if (keyword === '' && filterStatus === '') {
      // Nếu không có từ khóa và không lọc trạng thái, hiển thị tất cả
      setFilteredOrders(orders);
    } else {
      // Lọc theo từ khóa và trạng thái
      const filtered = orders.filter(order => 
        (
          filterStatus === '' || 
          order.status === filterStatus
        ) &&
        (
          keyword === '' || 
          order.id.toLowerCase().includes(keyword.toLowerCase()) ||
          order.customerName.toLowerCase().includes(keyword.toLowerCase())
        )
      );
      setFilteredOrders(filtered);
    }
  };

  // Sắp xếp đơn hàng
  const sortOrders = (field: 'orderDate' | 'total', direction: 'ascend' | 'descend') => {
    setSortField(field);
    setSortDirection(direction);
    
    const sorted = [...filteredOrders].sort((a, b) => {
      if (field === 'orderDate') {
        return direction === 'ascend'
          ? a.orderDate.getTime() - b.orderDate.getTime()
          : b.orderDate.getTime() - a.orderDate.getTime();
      } else {
        return direction === 'ascend'
          ? a.total - b.total
          : b.total - a.total;
      }
    });
    
    setFilteredOrders(sorted);
  };

  // Tính tổng giá trị đơn hàng
  const calculateOrderTotal = (items: OrderItem[]): number => {
    return OrderService.calculateTotal(items);
  };

  return {
    orders,
    customers,
    products,
    loading,
    selectedOrder,
    modalVisible,
    modalType,
    filteredOrders,
    filterStatus,
    searchKeyword,
    addOrder,
    updateOrder,
    cancelOrder,
    filterOrdersByStatus,
    searchOrders,
    sortOrders,
    calculateOrderTotal,
    setSelectedOrder,
    setModalVisible,
    setModalType,
  };
} 