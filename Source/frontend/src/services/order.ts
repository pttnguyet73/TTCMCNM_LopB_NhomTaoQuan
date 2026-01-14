import api from '@/lib/api';

export const orderAPI = {
  getOrders: async () => {
    const response = await api.get('/admin/orders');
    return response.data;
  },
  getUserOrders: async () => {
  const token = localStorage.getItem("token");

  const response = await api.get('/my-orders', {
    headers: {
      Authorization: `Bearer ${token}`,
    },
  });

  return response.data;
},

  getOrderDetailPublic: async (id: number) => {
    const response = await api.get(`/orders/${id}`);
    return response.data;
  },

  getOrderDetail: async (id: number) => {
    const response = await api.get(`/admin/orders/${id}`);
    return response.data;
  },

  updateOrderStatus: async (orderId: number, status: string) => {
    const response = await api.patch(`/admin/orders/${orderId}/status`, { status });
    return response.data;
  },

};