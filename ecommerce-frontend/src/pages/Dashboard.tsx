// src/pages/Dashboard.tsx
import React, { useContext, useEffect, useState } from "react";
import { AuthContext } from "../context/AuthContext";
import axios from "axios";
import { useNavigate } from "react-router-dom";
import Cart from "./Cart";
import Footer from "../components/Footer"; // Import the Footer component
import type { CartData } from "../services/CartData";


interface ProductType {
  _id: string;
  name: string;
  price: number;
  category: string;
  subCategory?: string;
  imageUrl?: string;
  seller?: string;
}

const Dashboard: React.FC = () => {
  const { user, logout } = useContext(AuthContext);
  const [products, setProducts] = useState<ProductType[]>([]);
  const [shippingOption, setShippingOption] = useState<"standard" | "express">("standard");
  const [location, setLocation] = useState<string>("Kenya");
  const [error, setError] = useState<string>("");
  const [weather, setWeather] = useState<any>(null);
  const [cartTotal, setCartTotal] = useState<number>(0);
  const [cartRefresh, setCartRefresh] = useState<number>(0);
  const navigate = useNavigate();

  // State for AI Assistant
  const [aiPrompt, setAiPrompt] = useState<string>("");
  const [aiResponse, setAiResponse] = useState<string>("");
  const [aiLoading, setAiLoading] = useState<boolean>(false);
  const [aiError, setAiError] = useState<string>("");

  console.log("Current user in Dashboard:", user);

  const canAddProduct = user && (user.role === "admin" || user.role === "seller");

  // Fetch products.
  useEffect(() => {
    axios
      .get("http://localhost:5000/api/products")
      .then((res) => setProducts(res.data))
      .catch((err) => {
        console.error("Failed to fetch products:", err);
        setError("Failed to fetch products.");
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
          .catch((err) => console.error("Weather fetch error:", err));
      });
    }
  }, []);

  const currentHour = new Date().getHours();
  const greeting =
    currentHour < 12 ? "Good morning" : currentHour < 18 ? "Good afternoon" : "Good evening";

  // New addToCart function that calls the backend API.
  const addToCart = (product: ProductType) => {
    if (!user) {
      navigate("/login");
      return;
    }
    axios
      .post(`http://localhost:5000/api/cart/${user.id}/add`, {
        product: product._id,
        name: product.name,
        price: product.price,
        quantity: 1,
      })
      .then(() => {
        alert("Product added to cart.");
        setCartRefresh((prev) => prev + 1); // Trigger Cart refresh
      })
      .catch((err) => {
        console.error("Failed to add product to cart:", err);
        setError("Failed to add product to cart.");
      });
  };

  // Callback to capture cart updates (e.g., total) from the Cart component.
  const handleCartUpdate = (cart: CartData) => {
    setCartTotal(cart.total);
  };

  // Calculate shipping cost.
  const getShippingCost = () => {
    let baseCost = location === "Kenya" ? 5 : 10;
    return shippingOption === "express" ? baseCost * 1.5 : baseCost;
  };

  // Handle AI assistant query.
  const handleAiSubmit = async () => {
    if (!aiPrompt.trim()) return;
    setAiLoading(true);
    setAiError("");
    try {
      const response = await axios.post("http://localhost:5000/api/ai/assistant", { prompt: aiPrompt });
      setAiResponse(response.data.reply);
    } catch (err: any) {
      console.error("Error calling AI assistant:", err);
      setAiError("Error calling AI assistant.");
    }
    setAiLoading(false);
  };

  return (
    <div className="flex flex-col min-h-screen">
      <main className="flex-1 p-6">
        {/* Sign In / Sign Up when not logged in */}
        {!user && (
          <div className="flex justify-end space-x-4">
            <button onClick={() => navigate("/login")} className="bg-blue-500 text-white px-4 py-2 rounded">
              Sign In
            </button>
            <button onClick={() => navigate("/signup")} className="bg-green-500 text-white px-4 py-2 rounded">
              Sign Up
            </button>
          </div>
        )}

        {/* Greeting with weather info */}
        {user && weather && (
          <p className="text-xl font-bold mb-4">
            {greeting}, {user.name}! The current weather in {weather.name} is{" "}
            {weather.weather[0].description} with {weather.main.temp}°C.
          </p>
        )}

        {/* Add Product button for admin and seller */}
        {canAddProduct && (
          <button onClick={() => navigate("/products/add")} className="px-4 py-2 bg-blue-600 text-white rounded mb-4">
            Add Product
          </button>
        )}

        <h1 className="text-2xl font-bold">Welcome to SokoNear!</h1>

        {/* Render the updated Cart component */}
        <Cart refreshSignal={cartRefresh} onCartUpdate={handleCartUpdate} />

        {/* Shipping & Checkout Section */}
        <div className="border p-4 rounded-md mt-4">
          <h2 className="text-xl font-bold">Shipping & Checkout</h2>
          <p className="text-lg font-semibold">Cart Total: Kshs {cartTotal.toFixed(2)}</p>

          {/* Shipping Option Dropdown */}
          <div className="mt-4">
            <label htmlFor="shippingOption" className="block font-bold">
              Shipping Option:
            </label>
            <select
              id="shippingOption"
              value={shippingOption}
              onChange={(e) => setShippingOption(e.target.value as "standard" | "express")}
              className="border p-2 mt-2 w-full"
            >
              <option value="standard">Standard Shipping</option>
              <option value="express">Express Shipping</option>
            </select>
            <p className="mt-2 font-semibold">Selected Option: {shippingOption}</p>
          </div>

          {/* Shipping Location Dropdown */}
          <div className="mt-4">
            <label htmlFor="shippingLocation" className="block font-bold">
              Shipping Location:
            </label>
            <select
              id="shippingLocation"
              value={location}
              onChange={(e) => {
                setLocation(e.target.value);
                alert("Shipping costs updated based on your location");
              }}
              className="border p-2 mt-2 w-full"
            >
              <option value="Kenya">Kenya (Local)</option>
              <option value="International">International</option>
            </select>
            <p className="mt-2 font-semibold">Selected Location: {location}</p>
          </div>

          <p className="mt-2 text-lg font-semibold">Shipping: Kshs {getShippingCost().toFixed(2)}</p>
          <p className="mt-2 text-lg font-semibold">
            Grand Total: Kshs {(cartTotal + getShippingCost()).toFixed(2)}
          </p>
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
                  src={
                    product.imageUrl.startsWith("http")
                      ? product.imageUrl
                      : `http://localhost:5000/${product.imageUrl}`
                  }
                  alt={product.name}
                  className="w-auto h-auto object-contain rounded"
                />
              ) : (
                <div className="w-auto h-auto flex items-center justify-center bg-gray-200">
                  <span className="text-gray-500">No Image Available</span>
                </div>
              )}
              <h4 className="text-md font-semibold">{product.name}</h4>
              <p className="text-sm text-gray-600">Kshs {product.price}</p>
              <button onClick={() => addToCart(product)} className="bg-yellow-500 text-white px-4 py-2 mt-2 rounded">
                Add to Cart
              </button>
              <button
                onClick={() => (user ? navigate(`/edit/${product._id}`) : navigate("/login"))}
                className="bg-blue-500 text-white px-2 py-1 rounded mt-2 mr-2"
              >
                Edit
              </button>
              {user &&
                (user.role === "admin" || (user.role === "seller" && product.seller === user.id)) && (
                  <button className="bg-red-500 text-white px-2 py-1 rounded mt-2">Delete</button>
                )}
            </div>
          ))}
        </div>

        {/* AI Assistant Section */}
        <div className="mt-6 p-4 border rounded shadow">
          <h2 className="text-xl font-bold mb-2">AI Assistant</h2>
          <textarea
            value={aiPrompt}
            onChange={(e) => setAiPrompt(e.target.value)}
            placeholder="Ask me anything..."
            className="w-full p-2 border rounded h-24"
          ></textarea>
          <button
            onClick={handleAiSubmit}
            className="mt-2 bg-blue-600 text-white px-4 py-2 rounded"
          >
            {aiLoading ? "Sending..." : "Ask AI"}
          </button>
          {aiError && <p className="text-red-500 mt-2">{aiError}</p>}
          {aiResponse && (
            <div className="mt-4 p-4 border rounded bg-gray-100">
              <p className="text-gray-700">{aiResponse}</p>
            </div>
          )}
        </div>

        {/* Logout */}
        {user && (
          <button onClick={logout} className="mt-4 bg-red-600 text-white px-4 py-2 rounded">
            Logout
          </button>
        )}
      </main>

      <Footer /> {/* Footer renders at the bottom */}
    </div>
  );
};

export default Dashboard;