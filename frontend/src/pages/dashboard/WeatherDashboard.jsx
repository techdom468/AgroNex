import React, { useState, useEffect } from 'react';
import { motion } from 'framer-motion';
import { 
  FaThermometerHalf, FaTint, FaWind, FaCloud, FaSun, FaMoon, FaMapMarkerAlt, FaSync 
} from 'react-icons/fa';
import { weatherService } from '../../services/weatherService';
import WeatherCard from '../../components/weather/WeatherCard';
import WeatherChart from '../../components/weather/WeatherChart';
import RecommendationPanel from '../../components/weather/RecommendationPanel';

const WeatherDashboard = () => {
  const [weatherData, setWeatherData] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  
  // Location state
  const [location, setLocation] = useState({ lat: null, lon: null, name: 'Detecting location...' });

  const fetchWeather = async (lat, lon, locName, forceRefresh = false) => {
    try {
      setLoading(true);
      setError(null);
      const data = await weatherService.getCurrentWeather(lat, lon, locName, forceRefresh);
      setWeatherData(data);
    } catch (err) {
      setError("Failed to fetch weather data. Please try again.");
      console.error(err);
    } finally {
      setLoading(false);
    }
  };

  const requestLocation = () => {
    if (!navigator.geolocation) {
      setError("Geolocation is not supported by your browser.");
      setLoading(false);
      return;
    }

    navigator.geolocation.getCurrentPosition(
      (position) => {
        const lat = position.coords.latitude;
        const lon = position.coords.longitude;
        setLocation({ lat, lon, name: 'Current Location' });
        fetchWeather(lat, lon, 'Current Location');
      },
      (error) => {
        console.warn("Geolocation denied or failed.", error);
        setError("Location access denied. Please enable GPS to get weather updates.");
        setLoading(false);
      },
      { timeout: 10000 }
    );
  };

  useEffect(() => {
    requestLocation();
  }, []);



  if (loading && !weatherData) {
    return (
      <div className="flex flex-col items-center justify-center min-h-[60vh]">
        <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-emerald-500 mb-4"></div>
        <p className="text-gray-500 dark:text-gray-400">Loading Smart Weather Advisor...</p>
      </div>
    );
  }

  return (
    <div className="p-4 md:p-8 max-w-7xl mx-auto">
      {/* Header Section */}
      <div className="flex flex-col md:flex-row justify-between items-start md:items-center mb-8 gap-4">
        <div>
          <h1 className="text-3xl font-bold text-gray-800 dark:text-white">Smart Weather Advisor</h1>
          <p className="text-gray-500 dark:text-gray-400 flex items-center mt-2">
            <FaMapMarkerAlt className="mr-2 text-emerald-500" /> 
            {location.name} (Lat: {location.lat?.toFixed(2)}, Lon: {location.lon?.toFixed(2)})
          </p>
        </div>
        
        <div className="flex space-x-3">
          <button 
            onClick={() => {
              if (location.lat && location.lon) {
                fetchWeather(location.lat, location.lon, location.name, true);
              } else {
                requestLocation();
              }
            }}
            disabled={loading}
            className="flex items-center px-4 py-2 bg-white dark:bg-slate-800 border border-gray-200 dark:border-slate-700 rounded-lg text-sm font-medium text-gray-600 dark:text-gray-300 hover:bg-gray-50 dark:hover:bg-slate-700 transition-colors shadow-sm disabled:opacity-50"
          >
            <FaSync className={`mr-2 ${loading ? 'animate-spin' : ''}`} /> Refresh
          </button>
        </div>
      </div>

      {error && (
        <div className="mb-8 p-4 bg-red-100 dark:bg-red-900/30 border-l-4 border-red-500 text-red-700 dark:text-red-400 rounded-r-lg">
          {error}
        </div>
      )}

      {weatherData && (
        <div className="space-y-8">
          {/* Current Weather Cards */}
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
            <WeatherCard 
              title="Temperature" 
              value={weatherData.current?.temperature_2m} 
              unit="°C" 
              icon={FaThermometerHalf} 
              delay={0.1} 
            />
            <WeatherCard 
              title="Humidity" 
              value={weatherData.current?.relative_humidity_2m} 
              unit="%" 
              icon={FaTint} 
              delay={0.2} 
            />
            <WeatherCard 
              title="Wind Speed" 
              value={weatherData.current?.wind_speed_10m} 
              unit="km/h" 
              icon={FaWind} 
              delay={0.3} 
            />
            <WeatherCard 
              title="Rain Prob." 
              value={weatherData.daily?.precipitation_probability_max?.[0] || 0} 
              unit="%" 
              icon={FaCloud} 
              delay={0.4} 
            />
          </div>

          {/* AI Recommendations */}
          <div>
            <h2 className="text-2xl font-bold text-gray-800 dark:text-white mb-6">AI Farming Recommendations</h2>
            <RecommendationPanel recommendations={weatherData.recommendations} />
          </div>

          {/* Weather Trends Chart */}
          <div>
            <WeatherChart hourlyData={weatherData.hourly} />
          </div>
        </div>
      )}
    </div>
  );
};

export default WeatherDashboard;
