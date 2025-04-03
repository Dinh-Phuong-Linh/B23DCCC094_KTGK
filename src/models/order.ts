import { useState, useEffect } from 'react';
import { message } from 'antd';
import { v4 as uuidv4 } from 'uuid';

// Định nghĩa enum trạng thái đơn hàng
export enum OrderStatus {
  PENDING = 'Chờ xác nhận',
  SHIPPING = 'Đang giao',
  COMPLETED = 'Hoàn thành',
  CANCELLED = 'Hủy'
}

// Định nghĩa interface cho sản phẩm
export interface Product {
  id: string;
  name: string;
  price: number;
  inventory: number;
}

// Định nghĩa interface cho khách hàng
export interface Customer {
  id: string;
  name: string;
  phone: string;
  address: string;
}

// Định nghĩa interface cho sản phẩm trong đơn hàng
export interface OrderItem {
  productId: string;
  productName: string;
  quantity: number;
  price: number;
}

// Định nghĩa interface cho đơn hàng
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

  // Khởi tạo dữ liệu mẫu khi component mount
  useEffect(() => {
    // Khôi phục dữ liệu từ localStorage (nếu có)
    const savedOrders = localStorage.getItem('orders');
    const savedCustomers = localStorage.getItem('customers');
    const savedProducts = localStorage.getItem('products');

    if (savedOrders) {
      try {
        const parsedOrders = JSON.parse(savedOrders);
        // Chuyển đổi chuỗi thời gian thành đối tượng Date
        const formattedOrders = parsedOrders.map((order: any) => ({
          ...order,
          orderDate: new Date(order.orderDate)
        }));
        setOrders(formattedOrders);
        setFilteredOrders(formattedOrders);
      } catch (error) {
        console.error('Error parsing orders from localStorage:', error);
        initializeSampleData();
      }
    } else {
      initializeSampleData();
    }

    if (savedCustomers) {
      try {
        setCustomers(JSON.parse(savedCustomers));
      } catch (error) {
        console.error('Error parsing customers from localStorage:', error);
        initializeSampleCustomers();
      }
    } else {
      initializeSampleCustomers();
    }

    if (savedProducts) {
      try {
        setProducts(JSON.parse(savedProducts));
      } catch (error) {
        console.error('Error parsing products from localStorage:', error);
        initializeSampleProducts();
      }
    } else {
      initializeSampleProducts();
    }
  }, []);

  // Khởi tạo dữ liệu mẫu
  const initializeSampleData = () => {
    const sampleOrders: Order[] = [
      {
        id: "DH001",
        customerId: "KH001",
        customerName: "Nguyễn Văn A",
        orderDate: new Date(2023, 5, 15),
        status: OrderStatus.COMPLETED,
        items: [
          { productId: "SP001", productName: "Laptop Dell XPS 13", quantity: 1, price: 30000000 },
          { productId: "SP003", productName: "Chuột không dây Logitech", quantity: 2, price: 700000 }
        ],
        total: 31400000
      },
      {
        id: "DH002",
        customerId: "KH002",
        customerName: "Trần Thị B",
        orderDate: new Date(2023, 6, 20),
        status: OrderStatus.PENDING,
        items: [
          { productId: "SP002", productName: "iPhone 14 Pro", quantity: 1, price: 29000000 }
        ],
        total: 29000000
      },
      {
        id: "DH003",
        customerId: "KH003",
        customerName: "Lê Văn C",
        orderDate: new Date(2023, 7, 10),
        status: OrderStatus.SHIPPING,
        items: [
          { productId: "SP004", productName: "Bàn phím cơ Keychron", quantity: 1, price: 2200000 },
          { productId: "SP005", productName: "Tai nghe Sony WH-1000XM4", quantity: 1, price: 6500000 }
        ],
        total: 8700000
      },
      {
        id: "DH004",
        customerId: "KH001",
        customerName: "Nguyễn Văn A",
        orderDate: new Date(2023, 8, 5),
        status: OrderStatus.CANCELLED,
        items: [
          { productId: "SP002", productName: "iPhone 14 Pro", quantity: 1, price: 29000000 }
        ],
        total: 29000000
      }
    ];

    setOrders(sampleOrders);
    setFilteredOrders(sampleOrders);
    localStorage.setItem('orders', JSON.stringify(sampleOrders));
  };

  // Khởi tạo dữ liệu khách hàng mẫu
  const initializeSampleCustomers = () => {
    const sampleCustomers: Customer[] = [
      {
        id: "KH001",
        name: "Nguyễn Văn A",
        phone: "0901234567",
        address: "123 Đường Lê Lợi, Quận 1, TP. HCM"
      },
      {
        id: "KH002",
        name: "Trần Thị B",
        phone: "0912345678",
        address: "456 Đường Nguyễn Huệ, Quận 1, TP. HCM"
      },
      {
        id: "KH003",
        name: "Lê Văn C",
        phone: "0923456789",
        address: "789 Đường Võ Văn Tần, Quận 3, TP. HCM"
      },
      {
        id: "KH004",
        name: "Phạm Thị D",
        phone: "0934567890",
        address: "101 Đường Cách Mạng Tháng 8, Quận 10, TP. HCM"
      }
    ];

    setCustomers(sampleCustomers);
    localStorage.setItem('customers', JSON.stringify(sampleCustomers));
  };

  // Khởi tạo dữ liệu sản phẩm mẫu
  const initializeSampleProducts = () => {
    const sampleProducts: Product[] = [
      {
        id: "SP001",
        name: "Laptop Dell XPS 13",
        price: 30000000,
        inventory: 10
      },
      {
        id: "SP002",
        name: "iPhone 14 Pro",
        price: 29000000,
        inventory: 20
      },
      {
        id: "SP003",
        name: "Chuột không dây Logitech",
        price: 700000,
        inventory: 50
      },
      {
        id: "SP004",
        name: "Bàn phím cơ Keychron",
        price: 2200000,
        inventory: 15
      },
      {
        id: "SP005",
        name: "Tai nghe Sony WH-1000XM4",
        price: 6500000,
        inventory: 8
      }
    ];

    setProducts(sampleProducts);
    localStorage.setItem('products', JSON.stringify(sampleProducts));
  };

  // Hàm tạo mã đơn hàng mới
  const generateOrderId = (): string => {
    const latestOrder = [...orders].sort((a, b) => {
      // So sánh mã đơn hàng theo số thứ tự
      const numA = parseInt(a.id.replace(/\D/g, ''));
      const numB = parseInt(b.id.replace(/\D/g, ''));
      return numB - numA;
    })[0];

    if (latestOrder) {
      const latestNumber = parseInt(latestOrder.id.replace(/\D/g, ''));
      return `DH${String(latestNumber + 1).padStart(3, '0')}`;
    }
    
    return 'DH001';
  };

  // Hàm thêm đơn hàng mới
  const addOrder = (order: Omit<Order, 'id'>) => {
    setLoading(true);
    try {
      const newOrder: Order = {
        ...order,
        id: generateOrderId(),
        orderDate: new Date()
      };

      const updatedOrders = [...orders, newOrder];
      setOrders(updatedOrders);
      setFilteredOrders(applyFiltersAndSort(updatedOrders, filterStatus, searchKeyword, sortField, sortDirection));
      
      // Lưu vào localStorage
      localStorage.setItem('orders', JSON.stringify(updatedOrders));
      
      message.success('Thêm đơn hàng thành công');
      return true;
    } catch (error) {
      console.error('Error adding order:', error);
      message.error('Có lỗi xảy ra khi thêm đơn hàng');
      return false;
    } finally {
      setLoading(false);
    }
  };

  // Hàm cập nhật đơn hàng
  const updateOrder = (orderId: string, updatedOrder: Partial<Order>) => {
    setLoading(true);
    try {
      const index = orders.findIndex(order => order.id === orderId);
      if (index === -1) {
        message.error('Không tìm thấy đơn hàng');
        return false;
      }

      const newOrders = [...orders];
      newOrders[index] = { ...newOrders[index], ...updatedOrder };
      
      setOrders(newOrders);
      setFilteredOrders(applyFiltersAndSort(newOrders, filterStatus, searchKeyword, sortField, sortDirection));
      
      // Lưu vào localStorage
      localStorage.setItem('orders', JSON.stringify(newOrders));
      
      message.success('Cập nhật đơn hàng thành công');
      return true;
    } catch (error) {
      console.error('Error updating order:', error);
      message.error('Có lỗi xảy ra khi cập nhật đơn hàng');
      return false;
    } finally {
      setLoading(false);
    }
  };

  // Hàm hủy đơn hàng
  const cancelOrder = (orderId: string) => {
    setLoading(true);
    try {
      const order = orders.find(o => o.id === orderId);
      if (!order) {
        message.error('Không tìm thấy đơn hàng');
        return false;
      }

      if (order.status !== OrderStatus.PENDING) {
        message.error('Chỉ có thể hủy đơn hàng ở trạng thái Chờ xác nhận');
        return false;
      }

      const updatedOrder = { ...order, status: OrderStatus.CANCELLED };
      return updateOrder(orderId, updatedOrder);
    } catch (error) {
      console.error('Error cancelling order:', error);
      message.error('Có lỗi xảy ra khi hủy đơn hàng');
      return false;
    } finally {
      setLoading(false);
    }
  };

  // Hàm áp dụng bộ lọc và sắp xếp
  const applyFiltersAndSort = (
    orderList: Order[],
    status: OrderStatus | '',
    keyword: string,
    sortBy: 'orderDate' | 'total',
    direction: 'ascend' | 'descend'
  ): Order[] => {
    let filtered = [...orderList];
    
    // Lọc theo trạng thái
    if (status) {
      filtered = filtered.filter(order => order.status === status);
    }
    
    // Tìm kiếm theo từ khóa
    if (keyword) {
      const search = keyword.toLowerCase();
      filtered = filtered.filter(
        order => order.id.toLowerCase().includes(search) || order.customerName.toLowerCase().includes(search)
      );
    }
    
    // Sắp xếp theo trường và hướng
    filtered.sort((a, b) => {
      if (sortBy === 'orderDate') {
        return direction === 'ascend'
          ? a.orderDate.getTime() - b.orderDate.getTime()
          : b.orderDate.getTime() - a.orderDate.getTime();
      } else {
        return direction === 'ascend'
          ? a.total - b.total
          : b.total - a.total;
      }
    });
    
    return filtered;
  };

  // Hàm lọc đơn hàng theo trạng thái
  const filterOrdersByStatus = (status: OrderStatus | '') => {
    setFilterStatus(status);
    setFilteredOrders(applyFiltersAndSort(orders, status, searchKeyword, sortField, sortDirection));
  };

  // Hàm tìm kiếm đơn hàng
  const searchOrders = (keyword: string) => {
    setSearchKeyword(keyword);
    setFilteredOrders(applyFiltersAndSort(orders, filterStatus, keyword, sortField, sortDirection));
  };

  // Hàm sắp xếp đơn hàng
  const sortOrders = (field: 'orderDate' | 'total', direction: 'ascend' | 'descend') => {
    setSortField(field);
    setSortDirection(direction);
    setFilteredOrders(applyFiltersAndSort(orders, filterStatus, searchKeyword, field, direction));
  };

  // Hàm tính tổng tiền của đơn hàng
  const calculateOrderTotal = (items: OrderItem[]): number => {
    return items.reduce((total, item) => total + (item.price * item.quantity), 0);
  };

  // Hàm kiểm tra trùng mã đơn hàng
  const isOrderIdDuplicate = (id: string): boolean => {
    return orders.some(order => order.id === id);
  };

  return {
    orders,
    filteredOrders,
    customers,
    products,
    selectedOrder,
    loading,
    modalVisible,
    modalType,
    filterStatus,
    searchKeyword,
    sortField,
    sortDirection,
    setSelectedOrder,
    setModalVisible,
    setModalType,
    addOrder,
    updateOrder,
    cancelOrder,
    filterOrdersByStatus,
    searchOrders,
    sortOrders,
    calculateOrderTotal,
    isOrderIdDuplicate
  };
} 