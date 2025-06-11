import { fetchWeather } from '../api/weather.js';

useEffect(() => {
    fetchWeather().then(weatherData => {
        setWeather(weatherData);
    });
}, []);