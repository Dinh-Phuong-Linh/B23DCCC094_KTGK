import { Order, OrderItem, OrderStatus } from '@/models/order';

/**
 * Service xác thực dữ liệu đơn hàng
 */
export class OrderValidationService {
  /**
   * Xác thực mã đơn hàng
   */
  static validateOrderId(id: string): boolean {
    if (!id) return false;
    // Mã đơn hàng phải bắt đầu bằng DH và theo sau là 3 số
    const pattern = /^DH\d{3,}$/;
    return pattern.test(id);
  }

  /**
   * Xác thực mã khách hàng
   */
  static validateCustomerId(id: string): boolean {
    if (!id) return false;
    // Mã khách hàng phải bắt đầu bằng KH và theo sau là 3 số
    const pattern = /^KH\d{3,}$/;
    return pattern.test(id);
  }

  /**
   * Xác thực tên khách hàng
   */
  static validateCustomerName(name: string): boolean {
    return !!name && name.trim().length > 0 && name.trim().length <= 100;
  }

  /**
   * Xác thực ngày đặt hàng
   */
  static validateOrderDate(date: Date | null): boolean {
    if (!date) return false;
    
    const now = new Date();
    // Ngày đặt hàng không thể trong tương lai
    return date <= now;
  }

  /**
   * Xác thực trạng thái đơn hàng
   */
  static validateOrderStatus(status: string): boolean {
    return Object.values(OrderStatus).includes(status as OrderStatus);
  }

  /**
   * Xác thực các sản phẩm trong đơn hàng
   */
  static validateOrderItems(items: OrderItem[]): boolean {
    if (!items || items.length === 0) return false;
    
    // Kiểm tra từng sản phẩm trong đơn hàng
    return items.every(item => 
      !!item.productId && 
      !!item.productName && 
      item.quantity > 0 && 
      item.price >= 0
    );
  }

  /**
   * Xác thực tổng giá trị đơn hàng
   */
  static validateOrderTotal(total: number, items: OrderItem[]): boolean {
    if (total < 0) return false;
    
    // Tính lại tổng tiền từ các sản phẩm
    const calculatedTotal = items.reduce((sum, item) => sum + item.quantity * item.price, 0);
    
    // So sánh tổng tiền được cung cấp với tổng tiền tính lại
    // Cho phép sai số nhỏ do làm tròn
    return Math.abs(total - calculatedTotal) < 1;
  }

  /**
   * Xác thực toàn bộ đơn hàng
   */
  static validateOrder(order: Order): { isValid: boolean; errors: string[] } {
    const errors: string[] = [];
    
    if (!this.validateOrderId(order.id)) {
      errors.push('Mã đơn hàng không hợp lệ.');
    }
    
    if (!this.validateCustomerId(order.customerId)) {
      errors.push('Mã khách hàng không hợp lệ.');
    }
    
    if (!this.validateCustomerName(order.customerName)) {
      errors.push('Tên khách hàng không hợp lệ.');
    }
    
    if (!this.validateOrderDate(order.orderDate)) {
      errors.push('Ngày đặt hàng không hợp lệ.');
    }
    
    if (!this.validateOrderStatus(order.status)) {
      errors.push('Trạng thái đơn hàng không hợp lệ.');
    }
    
    if (!this.validateOrderItems(order.items)) {
      errors.push('Danh sách sản phẩm trong đơn hàng không hợp lệ.');
    }
    
    if (!this.validateOrderTotal(order.total, order.items)) {
      errors.push('Tổng giá trị đơn hàng không khớp với danh sách sản phẩm.');
    }
    
    return {
      isValid: errors.length === 0,
      errors
    };
  }
} 