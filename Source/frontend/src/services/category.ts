// // src/services/categoryService.ts
// import api from '@/lib/api';
// import { Category } from '@/types/products';

// export interface ApiResponse<T = any> {
//   success?: boolean;
//   data?: T;
//   message?: string;
// }

// export const categoryService = {
//   // Lấy tất cả danh mục (alias cho getAll)
//   async getCategories(params?: { status?: number }): Promise<Category[]> {
//     return this.getAll(params);
//   },

//   // Lấy tất cả danh mục
//   async getAll(params?: { status?: number }): Promise<Category[]> {
//     try {
//       const res = await api.get<ApiResponse<Category[]>>('/categories', { params });

//       if (res.data.success && res.data.data) {
//         return res.data.data;
//       } else if (Array.isArray(res.data)) {
//         return res.data;
//       } else if (res.data && Array.isArray(res.data.data)) {
//         return res.data.data;
//       }

//       return [];
//     } catch (error) {
//       console.error('Error fetching categories:', error);
//       // Trả về danh mục mặc định nếu API không hoạt động
//       return [
//         { id: 1, name: 'iPhone', slug: 'iphone', status: 1 },
//         { id: 2, name: 'iPad', slug: 'ipad', status: 1 },
//         { id: 3, name: 'Mac', slug: 'mac', status: 1 },
//       ];
//     }
//   },

//   // Lấy danh mục theo ID
//   async getById(id: number): Promise<Category | null> {
//     try {
//       const res = await api.get<ApiResponse<Category>>(`/categories/${id}`);
//       return res.data.data || null;
//     } catch (error) {
//       console.error('Error fetching category:', error);
//       return null;
//     }
//   },
// };
