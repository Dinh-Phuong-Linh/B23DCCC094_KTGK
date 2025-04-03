/**
 * Service xử lý localStorage 
 */

// Các key lưu trong localStorage
export const STORAGE_KEYS = {
  USER_DATA: 'userData',
  ORDERS: 'orders',
  CUSTOMERS: 'customers',
  PRODUCTS: 'products',
  SEARCH_DATA: 'dataTimKiem'
};

/**
 * Lấy dữ liệu từ localStorage
 * @param key Key trong localStorage
 * @param defaultValue Giá trị mặc định khi không tìm thấy dữ liệu
 * @returns Dữ liệu đã parse hoặc defaultValue
 */
export const getLocalData = <T>(key: string, defaultValue: T): T => {
  try {
    const data = localStorage.getItem(key);
    if (!data) return defaultValue;
    return JSON.parse(data) as T;
  } catch (error) {
    console.error(`Lỗi khi lấy dữ liệu ${key} từ localStorage:`, error);
    return defaultValue;
  }
};

/**
 * Lưu dữ liệu vào localStorage
 * @param key Key trong localStorage
 * @param data Dữ liệu cần lưu
 * @returns Boolean thành công hay thất bại
 */
export const setLocalData = <T>(key: string, data: T): boolean => {
  try {
    localStorage.setItem(key, JSON.stringify(data));
    return true;
  } catch (error) {
    console.error(`Lỗi khi lưu dữ liệu ${key} vào localStorage:`, error);
    return false;
  }
};

/**
 * Xóa dữ liệu từ localStorage
 * @param key Key trong localStorage
 */
export const removeLocalData = (key: string): void => {
  try {
    localStorage.removeItem(key);
  } catch (error) {
    console.error(`Lỗi khi xóa dữ liệu ${key} từ localStorage:`, error);
  }
};

/**
 * Xóa tất cả dữ liệu trong localStorage
 */
export const clearLocalData = (): void => {
  try {
    localStorage.clear();
  } catch (error) {
    console.error('Lỗi khi xóa toàn bộ dữ liệu localStorage:', error);
  }
}; 