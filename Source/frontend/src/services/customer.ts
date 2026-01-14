import api from '@/lib/api';

export interface Customer {
  id: number;
  name: string;
  email: string;
  google_id?: string;
  email_verified_at?: string;
  password: string;
  remember_token?: string;
  current_team_id?: number;
  profile_photo_path?: string;
  created_at: string;
  updated_at: string;
  code?: string;
  code_expires_at?: string;
  role: string;
  status: 'active' | 'inactive' | 'vip' | 'banned';
  phone?: string;
  address?: string;
  orders_count?: number;
  total_spent?: number;
  last_order_date?: string | null;
  avatar?: string;
}

export interface Order {
  id: number;
  user_id: number;
  address_id: number;
  total_amount: number;
  status: string;
  shipping_fee: number;
  tracking_number?: string;
  coupon_code?: string;
  created_at: string;
  updated_at: string;
  order_number?: string;
}

// API calls
export const customerAPI = {
  getCustomers: async () => {
    try {
      const response = await api.get('/admin/customers');
      return response.data;
    } catch (error) {
      console.error('Error fetching customers:', error);
      throw error;
    }
  },

  // Lấy thông tin chi tiết khách hàng
  getCustomerDetail: async (id: number) => {
    try {
      const response = await api.get(`/admin/customers/${id}`);
      return response.data;
    } catch (error) {
      console.error('Error fetching customer detail:', error);
      throw error;
    }
  },

  // Cập nhật trạng thái khách hàng
  updateCustomerStatus: async (id: number, status: 'active' | 'inactive' | 'vip') => {
    try {
      const response = await api.put(`/admin/customers/${id}/status`, { status });
      return response.data;
    } catch (error) {
      console.error('Error updating customer status:', error);
      throw error;
    }
  },

  // Lấy danh sách đơn hàng của khách hàng
  getCustomerOrders: async (customerId: number) => {
    try {
      const response = await api.get('/admin/orders', {
        params: {
          customer_id: customerId,
        },
      });
      return response.data;
    } catch (error) {
      console.error('Error fetching customer orders:', error);
      throw error;
    }
  },

  // Tìm kiếm khách hàng
  searchCustomers: async (searchTerm: string) => {
    try {
      const response = await api.get(`/admin/customers/search`, {
        params: { q: searchTerm },
      });
      return response.data;
    } catch (error) {
      console.error('Error searching customers:', error);
      throw error;
    }
  },

  // Xuất Excel
  exportCustomers: async () => {
    try {
      const response = await api.get(`/admin/customers/export`, {
        responseType: 'blob',
      });
      return response.data;
    } catch (error) {
      console.error('Error exporting customers:', error);
      throw error;
    }
  },
};

// Các hàm helper
export const formatCustomerId = (id: number): string => {
  return `CUS-${String(id).padStart(3, '0')}`;
};

export const getAvatarFromName = (name: string): string => {
  if (!name || name.trim() === '') return '??';
  const nameParts = name.trim().split(' ');
  if (nameParts.length >= 2) {
    return (nameParts[0][0] + nameParts[nameParts.length - 1][0]).toUpperCase();
  }
  return name.substring(0, 2).toUpperCase();
};

export const formatDate = (dateString: string | null | undefined): string => {
  if (!dateString) return 'Chưa có';
  try {
    const date = new Date(dateString);
    return date.toLocaleDateString('vi-VN', {
      year: 'numeric',
      month: '2-digit',
      day: '2-digit',
    });
  } catch (error) {

    return dateString || "Chưa cập nhật";

  }
};
