import React, { useState, useEffect, useContext } from 'react';
import { motion } from 'framer-motion';
import { MapPin } from 'lucide-react';
import { dashboardService } from '../../services/dashboardService';
import { AuthContext } from '../../context/AuthContext';

// Import New Components
import WeatherCard from './components/WeatherCard';
import MarketCard from './components/MarketCard';
import RecommendationCard from './components/RecommendationCard';
import QuickActions from './components/QuickActions';
import SchemeCard from './components/SchemeCard';

// Simple Error Boundary to prevent one failing card from blanking the whole page
class ErrorBoundary extends React.Component {
  constructor(props) {
    super(props);
    this.state = { hasError: false };
  }
  static getDerivedStateFromError() {
    return { hasError: true };
  }
  render() {
    if (this.state.hasError) {
      return (
        <div className="rounded-xl border border-red-200 dark:border-red-900/40 bg-red-50 dark:bg-red-900/20 p-6 text-center text-sm text-red-500 dark:text-red-400">
          Failed to load this section.
        </div>
      );
    }
    return this.props.children;
  }
}

const DashboardHome = () => {
  const { user } = useContext(AuthContext);
  const [summary, setSummary] = useState(null);
  const [weather, setWeather] = useState(null);
  const [market, setMarket] = useState(null);
  const [schemes, setSchemes] = useState(null);

  // Fetch all data concurrently, failures don't block other cards
  useEffect(() => {
    // 1. Get Summary (User Profile & Recommendations)
    dashboardService.getSummary()
      .then(res => setSummary(res))
      .catch(e => {
        console.error("Summary error:", e);
        setSummary({ user: { name: 'Farmer', location: 'Gujarat, India' }, recommendations: [] });
      });

    // 2. Get Weather using browser GPS → fallback to Rajkot
    const fetchWeatherForLocation = (lat, lon, locationLabel) => {
      dashboardService.getCurrentWeather(lat, lon, locationLabel)
        .then(res => setWeather(res))
        .catch(e => { console.error("Weather error:", e); setWeather({}); });
    };

    if (navigator.geolocation) {
      navigator.geolocation.getCurrentPosition(
        (position) => {
          const { latitude, longitude } = position.coords;
          // Use reverse geocoding label from coords (the API will return the name)
          fetchWeatherForLocation(latitude, longitude, `${latitude.toFixed(2)}°N, ${longitude.toFixed(2)}°E`);
        },
        (error) => {
          // Permission denied or unavailable → fall back to Rajkot
          console.warn("GPS unavailable, using Rajkot default:", error.message);
          fetchWeatherForLocation(22.3039, 70.8022, 'Rajkot, Gujarat');
        },
        { timeout: 8000, maximumAge: 300000 } // 5 min cache
      );
    } else {
      // Browser doesn't support geolocation
      fetchWeatherForLocation(22.3039, 70.8022, 'Rajkot, Gujarat');
    }

    // 3. Get Recommended Schemes (already returns array from service)
    dashboardService.getRecommendedSchemes()
      .then(schemesArr => setSchemes(schemesArr))
      .catch(e => { console.error("Schemes error:", e); setSchemes([]); });
  }, []);

  // Fetch market price when user profile is loaded (to use their crop)
  useEffect(() => {
    if (user === undefined) return; // still initializing
    const userCrop = user?.main_crop || 'Cotton';
    dashboardService.getLiveMarketPrice(userCrop)
      .then(res => setMarket(res))
      .catch(e => { console.error("Market error:", e); setMarket(null); });
  }, [user?.main_crop]);

  // Greeting based on time of day
  const getGreeting = () => {
    const hour = new Date().getHours();
    if (hour < 12) return 'Good Morning';
    if (hour < 18) return 'Good Afternoon';
    return 'Good Evening';
  };

  const userName = summary?.user?.name || 'Farmer';
  const location = summary?.user?.location || 'Gujarat, India';

  return (
    <div className="space-y-8 max-w-7xl mx-auto pb-10">
      
      {/* ── SECTION 1 : Welcome Header ── */}
      <motion.div
        initial={{ opacity: 0, y: -20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.4 }}
        className="flex flex-col sm:flex-row sm:items-center justify-between gap-4"
      >
        <div>
          <h1 className="text-3xl font-bold text-gray-900 dark:text-white">
            {getGreeting()}, {userName} 👋
          </h1>
          <p className="text-gray-500 dark:text-gray-400 mt-1 text-base">
            Welcome back to AgroNex. Here is your farm summary for today.
          </p>
        </div>
        <div className="flex items-center gap-2 text-sm text-gray-700 dark:text-gray-200 bg-white dark:bg-gray-800/80 px-4 py-2.5 rounded-xl border border-gray-200 dark:border-gray-700 shadow-sm backdrop-blur-sm shrink-0">
          <MapPin size={16} className="text-primary-500" />
          <span className="font-medium">{location}</span>
        </div>
      </motion.div>

      {/* ── SECTION 2 : Weather + Market + Recommendations ── */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.1 }}>
          <ErrorBoundary><WeatherCard weatherData={weather} /></ErrorBoundary>
        </motion.div>
        <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.2 }}>
          <ErrorBoundary><MarketCard marketData={market} /></ErrorBoundary>
        </motion.div>
        <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.3 }}>
          <ErrorBoundary><RecommendationCard recommendations={summary?.recommendations} /></ErrorBoundary>
        </motion.div>
      </div>

      {/* ── SECTION 3 : Quick Actions + Scheme Card ── */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6 items-start">
        <div className="lg:col-span-2">
          <h2 className="text-xl font-bold text-gray-900 dark:text-white mb-4">Quick Actions</h2>
          <ErrorBoundary><QuickActions /></ErrorBoundary>
        </div>
        <div>
          <h2 className="text-xl font-bold text-gray-900 dark:text-white mb-4">Recommended for You</h2>
          <motion.div initial={{ opacity: 0, x: 20 }} animate={{ opacity: 1, x: 0 }} transition={{ delay: 0.4 }}>
            <ErrorBoundary><SchemeCard schemeData={schemes} /></ErrorBoundary>
          </motion.div>
        </div>
      </div>



    </div>
  );
};

export default DashboardHome;
