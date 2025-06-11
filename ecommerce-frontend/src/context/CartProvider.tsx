// src/context/CartProvider.tsx
import React, { createContext, useContext, useState } from 'react';
import type { ReactNode } from 'react';  // Use type-only import

// Define a type for your cart items.
export type CartItem = {
  id: string;
  name: string;
  price: number;
  quantity: number;
};

// Define the cart context properties.
interface CartContextType {
  cartItems: CartItem[];
  addToCart: (item: CartItem) => void;
  removeFromCart: (id: string) => void;
  clearCart: () => void;
}

// Create a CartContext with a default value of undefined.
const CartContext = createContext<CartContextType | undefined>(undefined);

// Custom hook to easily access the cart context.
export const useCart = (): CartContextType => {
  const context = useContext(CartContext);
  if (!context) {
    throw new Error('useCart must be used within a CartProvider');
  }
  return context;
};

interface CartProviderProps {
  children: ReactNode;
}

// The CartProvider component that wraps your app.
export const CartProvider: React.FC<CartProviderProps> = ({ children }) => {
  const [cartItems, setCartItems] = useState<CartItem[]>([]);

  // Function to add an item.
  const addToCart = (item: CartItem) => {
    setCartItems(prevItems => {
      const existingItem = prevItems.find(i => i.id === item.id);
      if (existingItem) {
        // Update the quantity.
        return prevItems.map(i =>
          i.id === item.id ? { ...i, quantity: i.quantity + item.quantity } : i
        );
      }
      return [...prevItems, item];
    });
  };

  // Function to remove an item.
  const removeFromCart = (id: string) => {
    setCartItems(prevItems => prevItems.filter(item => item.id !== id));
  };

  // Function to clear the entire cart.
  const clearCart = () => {
    setCartItems([]);
  };

  return (
    <CartContext.Provider value={{ cartItems, addToCart, removeFromCart, clearCart }}>
      {children}
      {/* If there is at least one item in the cart, show the sidebar */}
      {cartItems.length > 0 && <CartSidebar />}
    </CartContext.Provider>
  );
};

// The CartSidebar component shows cart details and is fixed on the right.
const CartSidebar: React.FC = () => {
  const { cartItems, removeFromCart, clearCart } = useCart();

  // Styling for the sidebar.
  const sidebarStyle: React.CSSProperties = {
    position: 'fixed',
    right: 0,
    top: 0,
    width: '300px',
    height: '100vh',
    backgroundColor: '#fff',
    boxShadow: '-2px 0 5px rgba(0,0,0,0.2)',
    padding: '1rem',
    overflowY: 'auto',
    zIndex: 1000,
  };

  return (
    <div style={sidebarStyle}>
      <h2>Your Cart</h2>
      <ul style={{ listStyle: 'none', padding: 0 }}>
        {cartItems.map(item => (
          <li key={item.id} style={{ marginBottom: '1rem' }}>
            <div>
              <strong>{item.name}</strong> x {item.quantity}
            </div>
            <div>
              Price: ${item.price.toFixed(2)}
            </div>
            <button onClick={() => removeFromCart(item.id)}>Remove</button>
          </li>
        ))}
      </ul>
      <button onClick={clearCart}>Clear Cart</button>
    </div>
  );
};