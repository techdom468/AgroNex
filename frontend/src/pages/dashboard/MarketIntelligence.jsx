import React, { useState, useEffect } from 'react';
import { motion } from 'framer-motion';
import { FaSearch, FaMapMarkerAlt, FaChartLine, FaHistory } from 'react-icons/fa';
import MarketChart from '../../components/market/MarketChart';
import RecommendationCard from '../../components/market/RecommendationCard';
import { getMarketPrediction, getLivePrices } from '../../services/marketService';

const MarketIntelligence = () => {
  const [searchQuery, setSearchQuery] = useState('Wheat');
  const [loading, setLoading] = useState(false);
  const [marketData, setMarketData] = useState(null);
  const [predictionData, setPredictionData] = useState(null);
  
  const fetchMarketData = async (crop) => {
    setLoading(true);
    try {
      // Fetch Prediction and Recommendation
      const prediction = await getMarketPrediction(crop);
      setPredictionData(prediction);
      
      // Fetch Live Prices from DB
      const live = await getLivePrices({ crop });
      if (live && live.length > 0) {
        // Average or top market for today
        setMarketData(live);
      } else {
        setMarketData([]);
      }
    } catch (error) {
      console.error("Error fetching market intelligence:", error);
    }
    setLoading(false);
  };

  useEffect(() => {
    fetchMarketData(searchQuery);
    // eslint-disable-next-line
  }, []);

  const handleSearch = (e) => {
    e.preventDefault();
    if (searchQuery.trim()) {
      fetchMarketData(searchQuery);
    }
  };

  const chartData = predictionData?.predictions?.map(p => ({
    date: p.date,
    price: p.predicted_price
  })) || [];

  return (
    <div className="space-y-6">
      {/* Header & Search */}
      <div className="flex flex-col md:flex-row justify-between items-start md:items-center gap-4">
        <div>
          <h1 className="text-3xl font-bold bg-gradient-to-r from-white to-gray-400 bg-clip-text text-transparent">
            Market Intelligence
          </h1>
          <p className="text-gray-400 mt-1">AI-powered price predictions and market analysis</p>
        </div>
        
        <form onSubmit={handleSearch} className="relative w-full md:w-auto">
          <input 
            type="text" 
            placeholder="Search crop (e.g., Wheat, Cotton)..." 
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            className="w-full md:w-72 bg-black/30 border border-white/10 rounded-xl py-3 px-4 pl-11 text-white focus:outline-none focus:border-green-500/50 transition-colors placeholder:text-gray-600"
          />
          <FaSearch className="absolute left-4 top-1/2 -translate-y-1/2 text-gray-500" />
          <button type="submit" className="hidden">Search</button>
        </form>
      </div>

      {loading ? (
        <div className="h-64 flex items-center justify-center">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-green-500"></div>
        </div>
      ) : (
        <>
          {/* Top Cards Grid */}
          <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
            
            {/* Price Info Card */}
            <motion.div 
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              className="glass-panel p-6 rounded-2xl border border-white/5 flex flex-col justify-between relative overflow-hidden"
            >
              <div className="absolute top-0 right-0 p-6 opacity-10">
                <FaChartLine className="text-6xl text-white" />
              </div>
              <div>
                <h3 className="text-gray-400 font-medium">Today's Est. Price</h3>
                <div className="mt-2 flex items-baseline gap-2">
                  <span className="text-4xl font-bold text-white">
                    ₹{predictionData?.today_price || '---'}
                  </span>
                  <span className="text-gray-500 text-sm">/ qtl</span>
                </div>
                <div className="mt-6">
                  <h3 className="text-gray-400 font-medium text-sm">Tomorrow's Prediction</h3>
                  <div className="mt-1 flex items-baseline gap-2">
                    <span className="text-2xl font-bold text-green-400">
                      ₹{predictionData?.predictions?.[0]?.predicted_price || '---'}
                    </span>
                  </div>
                </div>
              </div>
              <div className="mt-6 pt-4 border-t border-white/5 flex justify-between text-sm">
                <span className="text-gray-500">Crop: {predictionData?.crop}</span>
                <span className="text-gray-500">Trend: {predictionData?.trend}</span>
              </div>
            </motion.div>

            {/* Recommendation Card */}
            <RecommendationCard recommendationData={predictionData} />

            {/* Market Info Card (Latest Scraped) */}
            <motion.div 
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.1 }}
              className="glass-panel p-6 rounded-2xl border border-white/5 overflow-hidden flex flex-col"
            >
              <h3 className="text-gray-400 font-medium flex items-center gap-2">
                <FaMapMarkerAlt /> Top Markets (Latest Arrival)
              </h3>
              
              <div className="mt-4 flex-1 overflow-y-auto pr-2 space-y-3 custom-scrollbar">
                {marketData && marketData.length > 0 ? (
                  marketData.slice(0, 4).map((market, idx) => (
                    <div key={idx} className="bg-black/20 p-3 rounded-lg border border-white/5 flex justify-between items-center">
                      <div>
                        <p className="text-white text-sm font-medium">{market.market}</p>
                        <p className="text-gray-500 text-xs">{market.state}</p>
                      </div>
                      <div className="text-right">
                        <p className="text-white text-sm font-bold">₹{market.modalPrice}</p>
                        <p className="text-gray-500 text-xs text-[10px]">Arrival: {market.arrivalQuantity}qtl</p>
                      </div>
                    </div>
                  ))
                ) : (
                  <div className="h-full flex items-center justify-center text-sm text-gray-500">
                    No recent market data found
                  </div>
                )}
              </div>
            </motion.div>
          </div>

          {/* Chart Section */}
          <motion.div 
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.2 }}
            className="glass-panel p-6 rounded-2xl border border-white/5"
          >
            <div className="flex justify-between items-center mb-6">
              <h3 className="text-xl font-bold text-white flex items-center gap-2">
                <FaHistory className="text-green-500" />
                7-Day AI Price Forecast
              </h3>
            </div>
            
            {chartData.length > 0 ? (
              <div className="h-[350px]">
                <MarketChart data={chartData} title={`${predictionData?.crop} Forecast`} color="#3b82f6" />
              </div>
            ) : (
              <div className="h-[350px] flex items-center justify-center text-gray-500">
                Insufficient data to generate chart
              </div>
            )}
          </motion.div>
        </>
      )}
    </div>
  );
};

export default MarketIntelligence;
