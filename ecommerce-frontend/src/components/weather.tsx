// src/components/Weather.tsx
import React, { useEffect, useState } from 'react';

interface WeatherData {
  temperature: number;
  description: string;
  icon: string;
}

interface WeatherProps {
  defaultCity?: string; // Optional fallback city if geolocation fails
}

const Weather: React.FC<WeatherProps> = ({ defaultCity = 'London,UK' }) => {
  const [weather, setWeather] = useState<WeatherData | null>(null);
  const [loading, setLoading] = useState<boolean>(true);
  const [error, setError] = useState<string | null>(null);

  // OpenWeather API key (ideally, you would move this to an environment variable)
  const API_KEY = 'ca08678511df5d2b4bdd96754f55f262';

  // Function to fetch weather data using a URL
  const fetchWeather = (url: string) => {
    fetch(url)
      .then((response) => response.json())
      .then((data) => {
        if (data.cod !== 200) {
          setError(data.message);
        } else {
          const weatherData: WeatherData = {
            temperature: data.main.temp,
            description: data.weather[0].description,
            icon: `https://openweathermap.org/img/wn/${data.weather[0].icon}@2x.png`,
          };
          setWeather(weatherData);
        }
        setLoading(false);
      })
      .catch((err) => {
        console.error('Error fetching weather data:', err);
        setError('Failed to fetch weather data');
        setLoading(false);
      });
  };

  useEffect(() => {
    if (navigator.geolocation) {
      // Try to get the user's actual coordinates
      navigator.geolocation.getCurrentPosition(
        (position) => {
          const lat = position.coords.latitude;
          const lon = position.coords.longitude;
          const apiUrl = `https://api.openweathermap.org/data/2.5/weather?lat=${lat}&lon=${lon}&APPID=${API_KEY}&units=metric`;
          fetchWeather(apiUrl);
        },
        (err) => {
          console.error('Geolocation error, falling back to default city', err);
          const apiUrl = `https://api.openweathermap.org/data/2.5/weather?q=${defaultCity}&APPID=${API_KEY}&units=metric`;
          fetchWeather(apiUrl);
        }
      );
    } else {
      // If geolocation is not available, use the default city.
      const apiUrl = `https://api.openweathermap.org/data/2.5/weather?q=${defaultCity}&APPID=${API_KEY}&units=metric`;
      fetchWeather(apiUrl);
    }
  }, [defaultCity]);

  if (loading) {
    return <div>Loading weather...</div>;
  }

  if (error || !weather) {
    return <div>Error: {error}</div>;
  }

  return (
    <div className="weather-container p-4 border rounded shadow">
      <h2 className="text-2xl mb-2">Current Weather</h2>
      <div className="flex items-center space-x-4">
        <img src={weather.icon} alt={weather.description} />
        <div>
          <p className="text-xl font-bold">{weather.temperature.toFixed(1)}°C</p>
          <p className="capitalize">{weather.description}</p>
        </div>
      </div>
    </div>
  );
};

export default Weather;