// src/services/cartService.ts

import API from '../api/api';

//–– Your payload types right here:
export interface CartItem {
  _id: string;
  product: string;
  name: string;
  price: number;
  quantity: number;
}

export interface CartData {
  _id: string;
  user: string;
  items: CartItem[];
  total: number;
}

//–– Your service functions
export const fetchCart = (userId: string) =>
  API.get<CartData>(`/cart/${userId}`);

export const updateCartItem = (userId: string, itemId: string, quantity: number) =>
  API.put<{ cart: CartData }>(`/cart/${userId}/update/${itemId}`, { quantity });

export const removeCartItem = (userId: string, itemId: string) =>
  API.delete<{ cart: CartData }>(`/cart/${userId}/remove/${itemId}`);