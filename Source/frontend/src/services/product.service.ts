import api from "@/lib/api";
import { Product } from "@/types/products";

export const productService = {
  async getAll(): Promise<Product[]> {
    const res = await api.get("/products");
    return res.data.data;
  },

  async create(payload: any) {
    return api.post("/products", payload);
  },

  async update(id: string, payload: any) {
    return api.put(`/products/${id}`, payload);
  },

  async remove(id: string) {
    return api.delete(`/products/${id}`);
  },
};
