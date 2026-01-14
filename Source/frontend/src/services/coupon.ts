import api from '@/lib/api';

export const couponService = {
  getAll: () => api.get('/coupons').then(res => res.data),

  create: (data: any) =>
    api.post('/coupons', data).then(res => res.data),

  update: (id: number, data: any) =>
    api.put(`/coupons/${id}`, data).then(res => res.data),

  remove: (id: number) =>
    api.delete(`/coupons/${id}`),
};
