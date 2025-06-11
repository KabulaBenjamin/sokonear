// src/pages/Dashboard.tsx
import React, { useContext, useEffect, useState } from 'react';
import { AuthContext } from '../context/AuthContext';
import axios from 'axios';
import { useNavigate } from 'react-router-dom';

interface ProductType {
  _id: string;
  name: string;
  price: number;
  category: string;
  subCategory?: string;
  imageUrl?: string;
  seller?: string;
}

interface CartType {
  products: ProductType[];
  total: number;
}

const Dashboard: React.FC = () => {
  const { user, logout } = useContext(AuthContext);
  const [products, setProducts] = useState<ProductType[]>([]);
  const [cart, setCart] = useState<CartType>({ products: [], total: 0 });
  const [shippingOption, setShippingOption] = useState<'standard' | 'express'>('standard');
  const [location, setLocation] = useState<string>('Kenya');
  const [error, setError] = useState<string>('');
  const [weather, setWeather] = useState<any>(null);
  const navigate = useNavigate();

  // Fetch products on mount.
  useEffect(() => {
    axios
      .get('http://localhost:5000/api/products')
      .then((res) => setProducts(res.data))
      .catch((err) => {
        console.error('Failed to fetch products:', err);
        setError('Failed to fetch products.');
      });
  }, []);

  // Fetch weather data using geolocation.
  useEffect(() => {
    if (navigator.geolocation) {
      navigator.geolocation.getCurrentPosition((position) => {
        const lat = position.coords.latitude;
        const lon = position.coords.longitude;
        fetch(
          `https://api.openweathermap.org/data/2.5/weather?lat=${lat}&lon=${lon}&units=metric&appid=${process.env.REACT_APP_WEATHER_KEY}`
        )
          .then((res) => res.json())
          .then((data) => setWeather(data))
          .catch((err) => console.error('Weather fetch error:', err));
      });
    }
  }, []);

  // Greeting based on time.
  const currentHour = new Date().getHours();
  const greeting =
    currentHour < 12 ? 'Good morning' : currentHour < 18 ? 'Good afternoon' : 'Good evening';

  // Local cart handling.
  const addToCart = (product: ProductType) => {
    const price = typeof product.price === 'number' ? product.price : Number(product.price);
    setCart((prevCart) => ({
      products: [...prevCart.products, product],
      total: prevCart.total + price,
    }));
  };

  // Calculate shipping cost.
  const getShippingCost = () => {
    let baseCost = location === 'Kenya' ? 5 : 10;
    return shippingOption === 'express' ? baseCost * 1.5 : baseCost;
  };

  return (
    <div className="p-6">
      {/* Sign In / Sign Up buttons when not logged in */}
      {!user && (
        <div className="flex justify-end space-x-4">
          <button
            onClick={() => navigate('/login')}
            className="bg-blue-500 text-white px-4 py-2 rounded"
          >
            Sign In
          </button>
          <button
            onClick={() => navigate('/signup')}
            className="bg-green-500 text-white px-4 py-2 rounded"
          >
            Sign Up
          </button>
        </div>
      )}

      {/* Personalized greeting when a user is signed in and weather is available */}
      {user && weather && (
        <p className="text-xl font-bold mb-4">
          {greeting}, {user.name}! The current weather in {weather.name} is{' '}
          {weather.weather[0].description} with {weather.main.temp}°C.
        </p>
      )}

      <h1 className="text-2xl font-bold">Welcome to SokoNear!</h1>

      {/* Cart Summary */}
      <div className="border p-4 rounded-md mt-4">
        <h2 className="text-xl font-bold">Cart Summary</h2>
        <p>Total Items: {cart.products.length}</p>
        <p className="text-lg font-semibold">Subtotal: ${cart.total.toFixed(2)}</p>
        <p className="text-lg font-semibold">Shipping: ${getShippingCost().toFixed(2)}</p>
        <p className="text-lg font-semibold">
          Grand Total: ${(cart.total + getShippingCost()).toFixed(2)}
        </p>
        <div className="mt-4">
          <label className="block font-bold">Shipping Location:</label>
          <select
            value={location}
            onChange={(e) => {
              setLocation(e.target.value);
              alert('Shipping costs updated based on your location');
            }}
            className="border p-2 mt-2 w-full"
          >
            <option value="Kenya">Kenya (Local)</option>
            <option value="International">International</option>
          </select>
          <p className="mt-2 font-semibold">Selected Location: {location}</p>
        </div>
        <button className="bg-green-600 text-white px-4 py-2 mt-4 rounded">Checkout</button>
      </div>

      {error && <p className="text-red-500">{error}</p>}

      {/* Product Listings */}
      <h2 className="text-xl font-bold mt-6">Available Products</h2>
      <div className="grid grid-cols-2 gap-4 mt-2">
        {products.map((product) => (
          <div key={product._id} className="border p-3 rounded shadow-sm">
            {product.imageUrl ? (
              <img
                src={product.imageUrl}
                alt={product.name}
                className="w-full h-40 object-cover rounded"
              />
            ) : (
              <div className="w-full h-40 flex items-center justify-center bg-gray-200">
                <span className="text-gray-500">No Image Available</span>
              </div>
            )}
            <h4 className="text-md font-semibold">{product.name}</h4>
            <p className="text-sm text-gray-600">${product.price}</p>
            <button
              onClick={() => addToCart(product)}
              className="bg-yellow-500 text-white px-4 py-2 mt-2 rounded"
            >
              Add to Cart
            </button>

            {/* Edit button: Always available on every product.
                If the user is not logged in, clicking Edit navigates to the Login page.
                Otherwise, it navigates to the EditProduct page for that product. */}
            <button
              onClick={() =>
                user ? navigate(`/edit/${product._id}`) : navigate('/login')
              }
              className="bg-blue-500 text-white px-2 py-1 rounded mt-2 mr-2"
            >
              Edit
            </button>

            {/* Optionally, the Delete button can be conditionally rendered here */}
            {user &&
              (user.role === 'admin' ||
                (user.role === 'seller' && product.seller === user.id)) && (
                <button className="bg-red-500 text-white px-2 py-1 rounded mt-2">
                  Delete
                </button>
              )}
          </div>
        ))}
      </div>

      {/* Logout button if a user is signed in */}
      {user && (
        <button onClick={logout} className="mt-4 bg-red-600 text-white px-4 py-2 rounded">
          Logout
        </button>
      )}
    </div>
  );
};

export default Dashboard;