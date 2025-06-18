// src/pages/Cart.tsx
import React, { useState, useEffect, useContext } from 'react';
import API from '../api/api';
import { AuthContext } from '../context/AuthContext';

interface CartItem {
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

interface CartProps {
  refreshSignal?: number;
  onCartUpdate?: (cart: CartData) => void;
}

const Cart: React.FC<CartProps> = ({ refreshSignal, onCartUpdate }) => {
  const { user } = useContext(AuthContext);
  // When no user is available, treat as guest.
  const userId = user?.id || 'guest';
  const isGuest = userId === 'guest';

  const [cart, setCart] = useState<CartData | null>(null);
  const [loading, setLoading] = useState<boolean>(false);
  const [updatingItemIds, setUpdatingItemIds] = useState<string[]>([]);
  const [error, setError] = useState<string>('');

  // Fetch the cart only for logged-in users.
  const fetchCart = () => {
    setLoading(true);
    console.log(`Fetching cart for "${userId}"...`);
    if (isGuest) {
      // For guest visitors, initialize an empty cart.
      setCart({ _id: 'guest-cart', user: 'guest', items: [], total: 0 });
      setLoading(false);
      return;
    }
    // For authenticated users, call the API.
    API.get(`/cart/${userId}`)
      .then((res) => {
        console.log("Cart fetched successfully:", res.data);
        setCart(res.data);
        onCartUpdate && onCartUpdate(res.data);
        setLoading(false);
      })
      .catch((err) => {
        console.error("Error fetching cart:", err);
        setError('Failed to fetch cart');
        setLoading(false);
      });
  };

  useEffect(() => {
    console.log("Fetching cart for:", user ? user.id : "guest");
    fetchCart();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [user, refreshSignal]);

  const updateQuantity = (itemId: string, newQuantity: number) => {
    if (!cart) return;
    // Optimistically update the cart locally
    const updatedCart: CartData = {
      ...cart,
      items: cart.items.map((item) =>
        item._id === itemId ? { ...item, quantity: newQuantity } : item
      ),
      total: cart.items.reduce(
        (acc, item) =>
          acc +
          (item._id === itemId
            ? item.price * newQuantity
            : item.price * item.quantity),
        0
      ),
    };
    setCart(updatedCart);
    onCartUpdate && onCartUpdate(updatedCart);

    // For guest visitors, do not call the API.
    if (isGuest) return;

    setUpdatingItemIds((prev) => [...prev, itemId]);
    API.put(`/cart/${userId}/update/${itemId}`, { quantity: newQuantity })
      .then((res) => {
        console.log("Quantity updated successfully:", res.data);
        setCart(res.data.cart);
        onCartUpdate && onCartUpdate(res.data.cart);
      })
      .catch((err) => {
        console.error("Error updating cart item:", err);
        setError('Failed to update cart item');
      })
      .finally(() =>
        setUpdatingItemIds((prev) => prev.filter((id) => id !== itemId))
      );
  };

  const removeItem = (itemId: string) => {
    if (!cart) return;
    const updatedCart: CartData = {
      ...cart,
      items: cart.items.filter((item) => item._id !== itemId),
      total: cart.items
        .filter((item) => item._id !== itemId)
        .reduce((acc, item) => acc + item.price * item.quantity, 0),
    };
    setCart(updatedCart);
    onCartUpdate && onCartUpdate(updatedCart);

    if (isGuest) return;

    API.delete(`/cart/${userId}/remove/${itemId}`)
      .then((res) => {
        console.log("Item removed successfully:", res.data);
        setCart(res.data.cart);
        onCartUpdate && onCartUpdate(res.data.cart);
      })
      .catch((err) => {
        console.error("Error removing cart item:", err);
        setError('Failed to remove cart item');
      });
  };

  if (error) return <p className="text-red-500">{error}</p>;
  if (loading || !cart) return <p>Loading cart...</p>;

  return (
    <div className="max-w-3xl mx-auto p-4 border rounded shadow-sm">
      <h2 className="text-2xl mb-4">Your Cart</h2>
      {cart.items.length === 0 ? (
        <p>Your cart is empty.</p>
      ) : (
        <div>
          {cart.items.map((item) => (
            <div
              key={item._id}
              className="flex flex-col sm:flex-row justify-between border-b py-2"
            >
              <div>
                <p className="font-bold">{item.name}</p>
                <div className="flex items-center space-x-2">
                  <label htmlFor={`quantity-${item._id}`} className="sr-only">
                    Quantity for {item.name}
                  </label>
                  <span>Price: ${item.price}</span>
                  <input
                    id={`quantity-${item._id}`}
                    type="number"
                    value={item.quantity}
                    min="1"
                    onChange={(e) =>
                      updateQuantity(item._id, Number(e.target.value))
                    }
                    className="border p-1 w-16"
                    disabled={updatingItemIds.includes(item._id)}
                  />
                  {updatingItemIds.includes(item._id) && (
                    <span className="text-sm text-gray-600">Updating...</span>
                  )}
                </div>
              </div>
              <button
                onClick={() => removeItem(item._id)}
                className="bg-red-500 text-white p-2 rounded mt-2 sm:mt-0"
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