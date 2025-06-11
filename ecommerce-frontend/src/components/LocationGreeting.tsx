// src/components/LocationGreeting.tsx
import React, { useState, useEffect } from 'react';

const LocationGreeting: React.FC = () => {
  const [greeting, setGreeting] = useState("Hello!");

  useEffect(() => {
    if (navigator.geolocation) {
      navigator.geolocation.getCurrentPosition(
        async (position) => {
          const { latitude, longitude } = position.coords;
          try {
            const response = await fetch(`https://nominatim.openstreetmap.org/reverse?format=jsonv2&lat=${latitude}&lon=${longitude}`);
            const data = await response.json();
            const city = data.address.city || data.address.town || data.address.village || '';
            const country = data.address.country || '';

            setGreeting(city || country ? `Hello from ${city}, ${country}!` : "Hello!");
          } catch (error) {
            console.error("Location error:", error);
            setGreeting("Hello!");
          }
        },
        () => setGreeting("Unable to retrieve location.")
      );
    }
  }, []);

  return <h1 className="location-greeting">{greeting}</h1>;
};

export default LocationGreeting;