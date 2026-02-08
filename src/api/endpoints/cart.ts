import client from '../client';
import type { ApiResponse } from '../types';
import type { Cart } from '../../types/models';
import type { AddToCartRequest } from '../../types/api';

export const cartApi = {
  get: () =>
    client.get<ApiResponse<Cart>>('/cart').then(r => r.data),

  addItem: (data: AddToCartRequest) =>
    client.post<ApiResponse<Cart>>('/cart/add', data).then(r => r.data),

  removeItem: (productId: string) =>
    client.delete<ApiResponse<Cart>>(`/cart/item/${productId}`).then(r => r.data),
};
