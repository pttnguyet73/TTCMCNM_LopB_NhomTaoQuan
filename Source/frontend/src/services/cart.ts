import api from '@/lib/api';

export interface CartItemFromApi {
  id: number;
  quantity: number;
  color: string;
  product: {
    id: number;
    name: string;
    price: number;
  };
  image: string;
}

export interface AddToCartPayload {
  product_id: number;
  color: string;
  quantity: number;
}


export const cartService = {
  async getCart(): Promise<CartItemFromApi[]> {
    const res = await api.get('/cart');
    return res.data;
  },

  async addToCart(payload: AddToCartPayload) {
    const res = await api.post('/cart', payload);
    return res.data;
  },

  async updateQuantity(cartItemId: number, quantity: number) {
    return api.put(`/cart/${cartItemId}`, { quantity });
  },

  async removeItem(cartItemId: number) {
    return api.delete(`/cart/${cartItemId}`);
  },

  async clearCart() {
    return api.delete('/cart');
  },
};
