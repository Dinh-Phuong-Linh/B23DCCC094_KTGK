import { Order, OrderStatus } from '@/models/order';

/**
 * Service xử lý hiển thị dữ liệu đơn hàng
 */
export class OrderDisplayService {
  /**
   * Định dạng tiền tệ (VND)
   */
  static formatCurrency(amount: number): string {
    return new Intl.NumberFormat('vi-VN', { 
      style: 'currency', 
      currency: 'VND',
      minimumFractionDigits: 0,
      maximumFractionDigits: 0
    }).format(amount);
  }

  /**
   * Định dạng ngày tháng
   */
  static formatDate(date: Date): string {
    return new Intl.DateTimeFormat('vi-VN', {
      year: 'numeric',
      month: '2-digit',
      day: '2-digit',
      hour: '2-digit',
      minute: '2-digit'
    }).format(date);
  }

  /**
   * Lấy màu sắc hiển thị theo trạng thái đơn hàng
   */
  static getStatusColor(status: OrderStatus): string {
    switch (status) {
      case OrderStatus.PENDING:
        return '#faad14'; // Màu vàng
      case OrderStatus.SHIPPING:
        return '#1890ff'; // Màu xanh
      case OrderStatus.COMPLETED:
        return '#52c41a'; // Màu xanh lá
      case OrderStatus.CANCELLED:
        return '#ff4d4f'; // Màu đỏ
      default:
        return '#d9d9d9'; // Màu xám
    }
  }

  /**
   * Lấy tên hiển thị của trạng thái đơn hàng
   */
  static getStatusName(status: OrderStatus): string {
    switch (status) {
      case OrderStatus.PENDING:
        return 'Chờ xác nhận';
      case OrderStatus.SHIPPING:
        return 'Đang giao';
      case OrderStatus.COMPLETED:
        return 'Hoàn thành';
      case OrderStatus.CANCELLED:
        return 'Đã hủy';
      default:
        return 'Không xác định';
    }
  }

  /**
   * Tạo nội dung tóm tắt đơn hàng
   */
  static createOrderSummary(order: Order): string {
    const itemCount = order.items.length;
    const totalQuantity = order.items.reduce((sum, item) => sum + item.quantity, 0);
    
    let summary = `Đơn hàng ${order.id} - ${this.formatCurrency(order.total)}`;
    summary += `\nKhách hàng: ${order.customerName}`;
    summary += `\nSố lượng: ${totalQuantity} sản phẩm (${itemCount} loại)`;
    summary += `\nTrạng thái: ${this.getStatusName(order.status)}`;
    
    return summary;
  }

  /**
   * Lấy thông tin sản phẩm nổi bật nhất trong đơn hàng
   */
  static getMainProduct(order: Order): string {
    if (!order.items.length) return 'Không có sản phẩm';
    
    // Sắp xếp theo giá trị để tìm sản phẩm có giá trị cao nhất
    const sortedItems = [...order.items].sort((a, b) => 
      (b.price * b.quantity) - (a.price * a.quantity)
    );
    
    const mainItem = sortedItems[0];
    return `${mainItem.productName} x ${mainItem.quantity}`;
  }

  /**
   * Tính toán thống kê đơn giản từ danh sách đơn hàng
   */
  static calculateOrderStatistics(orders: Order[]): { 
    totalOrders: number; 
    totalRevenue: number;
    completedOrders: number;
    pendingOrders: number;
    cancelledOrders: number;
  } {
    const stats = {
      totalOrders: orders.length,
      totalRevenue: 0,
      completedOrders: 0,
      pendingOrders: 0,
      cancelledOrders: 0
    };
    
    orders.forEach(order => {
      if (order.status === OrderStatus.COMPLETED) {
        stats.totalRevenue += order.total;
        stats.completedOrders++;
      } else if (order.status === OrderStatus.PENDING) {
        stats.pendingOrders++;
      } else if (order.status === OrderStatus.CANCELLED) {
        stats.cancelledOrders++;
      }
    });
    
    return stats;
  }
} 