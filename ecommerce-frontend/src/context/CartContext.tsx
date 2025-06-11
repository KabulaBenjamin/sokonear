// src/context/CartContext.tsx
import React, { createContext, useReducer, useEffect, ReactNode } from 'react';

// Define the type for a cart item.
export interface CartItem {
  id: number;
  name: string;
  price: number;
  // Add any other properties you require.
}

// Define action types for our reducer.
export type CartAction =
  | { type: 'ADD_ITEM'; payload: CartItem }
  | { type: 'REMOVE_ITEM'; payload: { id: number } }
  | { type: 'CLEAR_CART' };

// Define the shape of our context.
export interface CartContextType {
  cart: CartItem[];
  dispatch: React.Dispatch<CartAction>;
}

// Initialize cart state from localStorage, or default to an empty array.
const initialCart: CartItem[] = JSON.parse(localStorage.getItem('cart') || '[]');

// Create the context with a default value. The context value will be null if no provider is found.
export const CartContext = createContext<CartContextType | null>(null);

// Define a type for the provider props.
interface CartProviderProps {
  children: ReactNode;
}

// Define the provider component.
export const CartProvider = ({ children }: CartProviderProps) => {
  const [cart, dispatch] = useReducer(
    (state: CartItem[], action: CartAction): CartItem[] => {
      switch (action.type) {
        case 'ADD_ITEM':
          return [...state, action.payload];
        case 'REMOVE_ITEM':
          return state.filter(item => item.id !== action.payload.id);
        case 'CLEAR_CART':
          return [];
        default:
          return state;
      }
    },
    initialCart
  );

  // Persist the cart state in localStorage whenever it updates.
  useEffect(() => {
    localStorage.setItem('cart', JSON.stringify(cart));
  }, [cart]);

  return (
    <CartContext.Provider value={{ cart, dispatch }}>
      {children}
    </CartContext.Provider>
  );
};