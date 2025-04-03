import { Order, Customer, Product, OrderStatus } from '@/models/order';
import { STORAGE_KEYS, getLocalData, setLocalData } from '../localStorage';

/**
 * Service quản lý đơn hàng
 */
export class OrderService {
  /**
   * Lấy danh sách đơn hàng từ localStorage
   */
  static getOrders(): Order[] {
    const savedOrders = getLocalData<any[]>(STORAGE_KEYS.ORDERS, []);
    // Chuyển đổi chuỗi thời gian thành đối tượng Date
    try {
      return savedOrders.map(order => ({
        ...order,
        orderDate: new Date(order.orderDate)
      }));
    } catch (error) {
      console.error('Lỗi khi xử lý dữ liệu đơn hàng:', error);
      return [];
    }
  }

  /**
   * Lưu danh sách đơn hàng vào localStorage
   */
  static saveOrders(orders: Order[]): boolean {
    return setLocalData(STORAGE_KEYS.ORDERS, orders);
  }

  /**
   * Thêm đơn hàng mới
   */
  static addOrder(order: Order): boolean {
    const orders = this.getOrders();
    orders.push(order);
    return this.saveOrders(orders);
  }

  /**
   * Cập nhật đơn hàng
   */
  static updateOrder(orderId: string, updatedOrder: Partial<Order>): boolean {
    const orders = this.getOrders();
    const index = orders.findIndex(order => order.id === orderId);
    
    if (index === -1) return false;
    
    orders[index] = { ...orders[index], ...updatedOrder };
    return this.saveOrders(orders);
  }

  /**
   * Hủy đơn hàng
   */
  static cancelOrder(orderId: string): boolean {
    const orders = this.getOrders();
    const index = orders.findIndex(order => order.id === orderId);
    
    if (index === -1) return false;
    
    orders[index].status = OrderStatus.CANCELLED;
    return this.saveOrders(orders);
  }

  /**
   * Lấy danh sách khách hàng
   */
  static getCustomers(): Customer[] {
    return getLocalData<Customer[]>(STORAGE_KEYS.CUSTOMERS, []);
  }

  /**
   * Lưu danh sách khách hàng
   */
  static saveCustomers(customers: Customer[]): boolean {
    return setLocalData(STORAGE_KEYS.CUSTOMERS, customers);
  }

  /**
   * Lấy danh sách sản phẩm
   */
  static getProducts(): Product[] {
    return getLocalData<Product[]>(STORAGE_KEYS.PRODUCTS, []);
  }

  /**
   * Lưu danh sách sản phẩm
   */
  static saveProducts(products: Product[]): boolean {
    return setLocalData(STORAGE_KEYS.PRODUCTS, products);
  }

  /**
   * Sinh mã đơn hàng mới
   */
  static generateOrderId(): string {
    const orders = this.getOrders();
    if (orders.length === 0) return 'DH001';

    const latestOrder = [...orders].sort((a, b) => {
      const numA = parseInt(a.id.replace(/\D/g, ''));
      const numB = parseInt(b.id.replace(/\D/g, ''));
      return numB - numA;
    })[0];

    const latestNum = parseInt(latestOrder.id.replace(/\D/g, ''));
    const newNum = latestNum + 1;
    return `DH${newNum.toString().padStart(3, '0')}`;
  }

  /**
   * Tính tổng giá trị đơn hàng
   */
  static calculateTotal(items: { quantity: number; price: number }[]): number {
    return items.reduce((total, item) => total + item.quantity * item.price, 0);
  }

  /**
   * Kiểm tra mã đơn hàng có bị trùng không
   */
  static isOrderIdDuplicate(id: string): boolean {
    const orders = this.getOrders();
    return orders.some(order => order.id === id);
  }

  /**
   * Khởi tạo dữ liệu mẫu nếu chưa có dữ liệu
   */
  static initSampleDataIfNeeded(): void {
    const orders = this.getOrders();
    const customers = this.getCustomers();
    const products = this.getProducts();

    if (orders.length === 0) this.initSampleOrders();
    if (customers.length === 0) this.initSampleCustomers();
    if (products.length === 0) this.initSampleProducts();
  }

  /**
   * Khởi tạo đơn hàng mẫu
   */
  private static initSampleOrders(): void {
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
      }
    ];
    
    this.saveOrders(sampleOrders);
  }

  /**
   * Khởi tạo khách hàng mẫu
   */
  private static initSampleCustomers(): void {
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
    
    this.saveCustomers(sampleCustomers);
  }

  /**
   * Khởi tạo sản phẩm mẫu
   */
  private static initSampleProducts(): void {
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
    
    this.saveProducts(sampleProducts);
  }
} 