// src/components/Header.jsx
import React, { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';

const Header = () => {
  const [greetingMessage, setGreetingMessage] = useState('');
  const [weatherData, setWeatherData] = useState('');
  const [darkMode, setDarkMode] = useState(false);
  // Simulate the cart count (change this value to test; 0 means no cart, >=1 shows cart)
  const [cartCount, setCartCount] = useState(0);

  // Generate a greeting based on the current time
  const getGreeting = () => {
    const hours = new Date().getHours();
    if (hours < 12) return "Good morning!";
    if (hours < 18) return "Good afternoon!";
    return "Good evening!";
  };

  // Toggle dark mode by updating state and applying a class to the body element
  const toggleDarkMode = () => {
    const newDarkMode = !darkMode;
    setDarkMode(newDarkMode);
    document.body.classList.toggle('dark-mode', newDarkMode);
  };

  // Fetch weather data from OpenWeatherMap for Nairobi, Kenya
  const fetchWeather = async () => {
    try {
      const response = await fetch(
        "http://api.openweathermap.org/data/2.5/weather?q=Nairobi,KE&units=metric&APPID=ca08678511df5d2b4bdd96754f55f262"
      );
      if (!response.ok) {
        throw new Error("Network response was not ok");
      }
      const data = await response.json();
      setWeatherData(`${data.main.temp}°C - ${data.weather[0].description}`);
    } catch (error) {
      console.error("Error fetching weather:", error);
      setWeatherData("Unavailable");
    }
  };

  useEffect(() => {
    setGreetingMessage(getGreeting());
    fetchWeather();
    // Refresh weather data every hour (3600000 ms)
    const intervalId = setInterval(fetchWeather, 3600000);
    return () => clearInterval(intervalId);
  }, []);

  return (
    <header className={darkMode ? "dark-header" : "light-header"}>
      <div className="header-top">
        <div className="header-left">
          <h1>{greetingMessage}</h1>
          <p>Current Weather: {weatherData}</p>
        </div>
        <div className="header-right">
          <button onClick={toggleDarkMode} className="button">
            Toggle Dark Mode
          </button>
          {/* Conditionally render the cart. It shows only if cartCount > 0 */}
          {cartCount > 0 && (
            <div className="cart">
              <Link to="/cart" className="cart-link">
                🛒 <span className="cart-count">{cartCount}</span>
              </Link>
            </div>
          )}
        </div>
      </div>
      <nav className="nav-links">
        <Link to="/login" className="nav-link">Sign In</Link>
        <Link to="/register" className="nav-link">Sign Up</Link>
      </nav>
    </header>
  );
};

export default Header;