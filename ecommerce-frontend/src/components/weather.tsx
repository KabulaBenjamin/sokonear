// src/components/Weather.tsx
import React, { useState, useEffect } from 'react';

interface WeatherData {
  temperature: number;
  description: string;
  icon: string;
}

const Weather: React.FC = () => {
  const [weather, setWeather] = useState<WeatherData | null>(null);
  const [loading, setLoading] = useState<boolean>(true);
  const [error, setError] = useState<string | null>(null);

  // Change the city as needed
  const city = 'London,uk';

  // OpenWeather API details
  const API_KEY = 'ca08678511df5d2b4bdd96754f55f262';
  const apiUrl = `https://api.openweathermap.org/data/2.5/weather?q=${city}&APPID=${API_KEY}&units=metric`;

  useEffect(() => {
    fetch(apiUrl)
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
  }, [apiUrl]);

  if (loading) {
    return <div>Loading weather...</div>;
  }

  if (error) {
    return <div>Error: {error}</div>;
  }

  return (
    <div className="weather-container p-4 border rounded shadow">
      <h2 className="text-2xl mb-2">Current Weather in {city}</h2>
      {weather && (
        <div className="flex items-center space-x-4">
          <img src={weather.icon} alt={weather.description} />
          <div>
            <p className="text-xl font-bold">{weather.temperature.toFixed(1)}°C</p>
            <p className="capitalize">{weather.description}</p>
          </div>
        </div>
      )}
    </div>
  );
};

export default Weather;