import React, { useState, useEffect } from 'react';
import { motion } from 'framer-motion';
import { FaSearch, FaMapMarkerAlt, FaChartLine, FaHistory, FaLeaf, FaChartBar, FaExclamationTriangle } from 'react-icons/fa';
import { 
  getStates, 
  getDistricts, 
  getCommodities, 
  getCurrentPrices, 
  getHistoricalPrices, 
  getPrediction 
} from '../../services/marketService';
import MarketChart from '../../components/market/MarketChart';
import RecommendationCard from '../../components/market/RecommendationCard';

const MarketIntelligence = () => {
  // State for Filters
  const [statesList, setStatesList] = useState([]);
  const [districtsList, setDistrictsList] = useState([]);
  const [commoditiesList, setCommoditiesList] = useState([]);
  
  const [selectedState, setSelectedState] = useState('');
  const [selectedDistrict, setSelectedDistrict] = useState('');
  const [selectedCommodity, setSelectedCommodity] = useState('');
  
  // State for Data
  const [currentPrices, setCurrentPrices] = useState([]);
  const [historicalPrices, setHistoricalPrices] = useState([]);
  const [predictionData, setPredictionData] = useState(null);
  
  // UI States
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);
  const [searched, setSearched] = useState(false);

  // Initial Load: Fetch States
  useEffect(() => {
    const fetchStates = async () => {
      try {
        const res = await getStates();
        if (res?.data) setStatesList(res.data);
      } catch (err) {
        console.error("Failed to fetch states:", err);
      }
    };
    fetchStates();
  }, []);

  // When State Changes: Fetch Districts
  useEffect(() => {
    const fetchDistricts = async () => {
      if (!selectedState) {
        setDistrictsList([]);
        setSelectedDistrict('');
        return;
      }
      try {
        const res = await getDistricts(selectedState);
        if (res?.data) setDistrictsList(res.data);
      } catch (err) {
        console.error("Failed to fetch districts:", err);
      }
    };
    fetchDistricts();
  }, [selectedState]);

  // When State or District Changes: Fetch Commodities
  useEffect(() => {
    const fetchCommodities = async () => {
      if (!selectedState) {
        setCommoditiesList([]);
        setSelectedCommodity('');
        return;
      }
      try {
        const res = await getCommodities(selectedState, selectedDistrict);
        if (res?.data) setCommoditiesList(res.data);
      } catch (err) {
        console.error("Failed to fetch commodities:", err);
      }
    };
    fetchCommodities();
  }, [selectedState, selectedDistrict]);

  const handleSearch = async (e) => {
    e.preventDefault();
    if (!selectedState || !selectedDistrict || !selectedCommodity) {
        return;
    }
    
    setLoading(true);
    setError(null);
    setSearched(true);
    
    try {
      // Fetch Current Prices
      const currentRes = await getCurrentPrices({
        state: selectedState,
        district: selectedDistrict,
        commodity: selectedCommodity
      });
      setCurrentPrices(currentRes?.data || []);

      // Fetch Historical Prices
      const histRes = await getHistoricalPrices({
        state: selectedState,
        district: selectedDistrict,
        commodity: selectedCommodity
      });
      setHistoricalPrices(histRes?.data || []);

      // Fetch Prediction
      // Usually, prediction needs market name, so we can just pass the first current market found, 
      // or we just predict by commodity and district level.
      const firstMarket = currentRes?.data?.[0]?.market || 'Unknown';
      try {
          const predRes = await getPrediction(selectedCommodity, firstMarket);
          setPredictionData(predRes?.data || null);
      } catch (predErr) {
          console.warn("Prediction failed or not enough data", predErr);
          setPredictionData(null);
      }
      
    } catch (err) {
      console.error("Search failed:", err);
      setError("Failed to fetch market data. Please try again later.");
    } finally {
      setLoading(false);
    }
  };

  // Prepare chart data (Map historical prices for Recharts)
  const chartData = historicalPrices.map(item => ({
    date: item.arrival_date,
    price: item.modal_price
  })).reverse(); // Reverse to show oldest to newest

  return (
    <div className="space-y-6">
      {/* Hero Section */}
      <div className="bg-gradient-to-r from-primary-900 to-black p-8 rounded-2xl border border-white/10 shadow-2xl relative overflow-hidden">
        <div className="absolute top-0 right-0 p-8 opacity-10 pointer-events-none">
          <FaChartLine className="text-9xl text-white" />
        </div>
        <div className="relative z-10">
          <h1 className="text-4xl font-bold text-white mb-2">Market Intelligence</h1>
          <p className="text-gray-300 max-w-2xl text-lg">
            Make informed decisions with real-time APMC prices, historical trends, and AI-driven market predictions.
          </p>
        </div>
      </div>

      {/* Search Filters Card */}
      <div className="glass-panel p-6 rounded-2xl border border-white/5 shadow-lg">
        <form onSubmit={handleSearch} className="grid grid-cols-1 md:grid-cols-4 gap-4 items-end">
          <div className="space-y-2">
            <label className="text-sm text-gray-400 font-medium">State</label>
            <select 
              value={selectedState} 
              onChange={(e) => setSelectedState(e.target.value)}
              className="w-full bg-black/40 border border-white/10 rounded-xl py-3 px-4 text-white focus:outline-none focus:border-primary-500 transition-colors appearance-none"
            >
              <option value="">Select State</option>
              {statesList.map(st => <option key={st} value={st}>{st}</option>)}
            </select>
          </div>
          
          <div className="space-y-2">
            <label className="text-sm text-gray-400 font-medium">District</label>
            <select 
              value={selectedDistrict} 
              onChange={(e) => setSelectedDistrict(e.target.value)}
              disabled={!selectedState}
              className="w-full bg-black/40 border border-white/10 rounded-xl py-3 px-4 text-white focus:outline-none focus:border-primary-500 transition-colors disabled:opacity-50 appearance-none"
            >
              <option value="">Select District</option>
              {districtsList.map(dist => <option key={dist} value={dist}>{dist}</option>)}
            </select>
          </div>

          <div className="space-y-2">
            <label className="text-sm text-gray-400 font-medium">Commodity</label>
            <select 
              value={selectedCommodity} 
              onChange={(e) => setSelectedCommodity(e.target.value)}
              disabled={!selectedDistrict}
              className="w-full bg-black/40 border border-white/10 rounded-xl py-3 px-4 text-white focus:outline-none focus:border-primary-500 transition-colors disabled:opacity-50 appearance-none"
            >
              <option value="">Select Commodity</option>
              {commoditiesList.map(com => <option key={com} value={com}>{com}</option>)}
            </select>
          </div>

          <button 
            type="submit" 
            disabled={!selectedState || !selectedDistrict || !selectedCommodity || loading}
            className="w-full bg-primary-600 hover:bg-primary-500 text-white font-bold py-3 px-6 rounded-xl transition-colors flex items-center justify-center gap-2 disabled:opacity-50"
          >
            {loading ? (
              <div className="animate-spin rounded-full h-5 w-5 border-b-2 border-white"></div>
            ) : (
              <><FaSearch /> Analyze Market</>
            )}
          </button>
        </form>
      </div>

      {/* Error State */}
      {error && (
        <div className="bg-red-500/10 border border-red-500/50 p-4 rounded-xl flex items-center gap-3 text-red-400">
          <FaExclamationTriangle />
          <p>{error}</p>
        </div>
      )}

      {/* Loading Skeleton */}
      {loading && !error && (
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6 animate-pulse">
          <div className="h-64 bg-white/5 rounded-2xl"></div>
          <div className="h-64 bg-white/5 rounded-2xl"></div>
          <div className="h-64 bg-white/5 rounded-2xl"></div>
          <div className="h-96 bg-white/5 rounded-2xl lg:col-span-3"></div>
        </div>
      )}

      {/* Empty State */}
      {!loading && searched && !error && currentPrices.length === 0 && (
        <div className="glass-panel p-12 rounded-2xl border border-white/5 flex flex-col items-center justify-center text-center space-y-4">
          <FaChartBar className="text-6xl text-gray-600" />
          <h2 className="text-2xl font-bold text-gray-300">No Data Found</h2>
          <p className="text-gray-500 max-w-md">
            We couldn't find any recent market data for {selectedCommodity} in {selectedDistrict}. 
            Please try another combination or check back later.
          </p>
        </div>
      )}

      {/* Results Section */}
      {!loading && !error && currentPrices.length > 0 && (
        <>
          {/* Top Cards Grid */}
          <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
            
            {/* Current Price Card */}
            <motion.div 
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              className="glass-panel p-6 rounded-2xl border border-white/5 flex flex-col justify-between relative overflow-hidden"
            >
              <div className="absolute top-0 right-0 p-6 opacity-5 pointer-events-none">
                <FaMapMarkerAlt className="text-8xl text-white" />
              </div>
              <div>
                <h3 className="text-gray-400 font-medium text-sm tracking-wider uppercase">Live Market Average</h3>
                <div className="mt-4 flex items-baseline gap-2">
                  <span className="text-5xl font-bold text-white">
                    ₹{currentPrices[0]?.modal_price || '---'}
                  </span>
                  <span className="text-gray-500 text-sm font-medium">/ Quintal</span>
                </div>
                <p className="text-xs text-gray-500 mt-2">
                  Based on recent arrivals in {currentPrices[0]?.market}, {selectedDistrict}
                </p>
              </div>
              <div className="mt-6 pt-4 border-t border-white/5 flex justify-between text-sm">
                <span className="text-gray-400">Min: <strong className="text-white">₹{currentPrices[0]?.min_price}</strong></span>
                <span className="text-gray-400">Max: <strong className="text-white">₹{currentPrices[0]?.max_price}</strong></span>
              </div>
            </motion.div>

            {/* Prediction Card */}
            <motion.div 
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.1 }}
              className="glass-panel p-6 rounded-2xl border border-white/5 flex flex-col justify-between relative overflow-hidden bg-gradient-to-br from-black/40 to-primary-900/20"
            >
               <div>
                <h3 className="text-gray-400 font-medium text-sm tracking-wider uppercase">AI Prediction (7 Days)</h3>
                <div className="mt-4 flex items-baseline gap-2">
                  <span className="text-5xl font-bold text-primary-400">
                    {predictionData?.predicted_price_7d ? `₹${predictionData.predicted_price_7d}` : 'Analyzing...'}
                  </span>
                </div>
                {predictionData && (
                    <div className="mt-2 inline-flex items-center gap-1.5 px-2.5 py-1 rounded-full text-xs font-semibold bg-white/10 text-white border border-white/10">
                        Confidence: {predictionData.confidence}%
                    </div>
                )}
              </div>
              
              <div className="mt-6 pt-4 border-t border-white/5 text-sm flex gap-4">
                  <div className="flex-1">
                      <p className="text-gray-500 text-xs uppercase mb-1">15 Days</p>
                      <p className="text-white font-bold">{predictionData?.predicted_price_15d ? `₹${predictionData.predicted_price_15d}` : '-'}</p>
                  </div>
                  <div className="flex-1">
                      <p className="text-gray-500 text-xs uppercase mb-1">30 Days</p>
                      <p className="text-white font-bold">{predictionData?.predicted_price_30d ? `₹${predictionData.predicted_price_30d}` : '-'}</p>
                  </div>
              </div>
            </motion.div>

            {/* Recommendation Card */}
            <RecommendationCard data={predictionData} />

          </div>

          {/* Historical Chart Section */}
          <motion.div 
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.2 }}
            className="glass-panel p-6 rounded-2xl border border-white/5"
          >
            <div className="flex justify-between items-center mb-6">
              <h3 className="text-xl font-bold text-white flex items-center gap-2">
                <FaHistory className="text-primary-500" />
                Historical Price Trend
              </h3>
            </div>
            
            {chartData.length > 0 ? (
              <div className="h-[400px]">
                <MarketChart data={chartData} title={`${selectedCommodity} Prices`} color="#10b981" />
              </div>
            ) : (
              <div className="h-[400px] flex items-center justify-center text-gray-500">
                Insufficient historical data to generate chart.
              </div>
            )}
          </motion.div>
        </>
      )}
    </div>
  );
};

export default MarketIntelligence;
