// src/pages/Cart.tsx
import React, { useEffect, useState } from 'react';
import API from '../api/api';

interface CartItem {
  _id: string;
  product: string;
  name: string;
  price: number;
  quantity: number;
}

interface Cart {
  _id: string;
  user: string;
  items: CartItem[];
  total: number;
}

const Cart: React.FC = () => {
  const [cart, setCart] = useState<Cart | null>(null);
  const [error, setError] = useState<string>('');
  const userId = 'user123'; // Replace with logic to get the current user's ID

  const fetchCart = () => {
    API.get(`/cart/${userId}`)
      .then((res) => setCart(res.data))
      .catch((err) => setError('Failed to fetch cart'));
  };

  useEffect(() => {
    fetchCart();
  }, []);

  const updateQuantity = (itemId: string, newQuantity: number) => {
    API.put(`/cart/${userId}/update/${itemId}`, { quantity: newQuantity })
      .then((res) => setCart(res.data.cart))
      .catch((err) => setError('Failed to update cart item'));
  };

  const removeItem = (itemId: string) => {
    API.delete(`/cart/${userId}/remove/${itemId}`)
      .then((res) => setCart(res.data.cart))
      .catch((err) => setError('Failed to remove cart item'));
  };

  if (error) return <p>{error}</p>;
  if (!cart) return <p>Loading cart...</p>;

  return (
    <div className="max-w-3xl mx-auto p-4">
      <h2 className="text-2xl mb-4">Your Cart</h2>
      {cart.items.length === 0 ? (
        <p>Your cart is empty.</p>
      ) : (
        <div>
          {cart.items.map((item) => (
            <div key={item._id} className="flex justify-between border-b py-2">
              <div>
                <p className="font-bold">{item.name}</p>
                <p>
                  Price: ${item.price} x{' '}
                  <input
                    type="number"
                    value={item.quantity}
                    min="1"
                    onChange={(e) =>
                      updateQuantity(item._id, Number(e.target.value))
                    }
                    className="border p-1 w-16"
                  />
                </p>
              </div>
              <button
                onClick={() => removeItem(item._id)}
                className="bg-red-500 text-white p-2 rounded"
              >
                Remove
              </button>
            </div>
          ))}
          <div className="mt-4 text-xl">
            Total: ${cart.total.toFixed(2)}
          </div>
        </div>
      )}
    </div>
  );
};

export default Cart;