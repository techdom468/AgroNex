import React from 'react';
import { motion } from 'framer-motion';
import { FaCheckCircle, FaExclamationTriangle, FaInfoCircle, FaArrowUp, FaArrowDown, FaMinus } from 'react-icons/fa';

const RecommendationCard = ({ data }) => {
  
  if (!data) {
    return (
      <motion.div 
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 0.15 }}
        className="glass-panel p-6 rounded-2xl border border-white/5 flex flex-col items-center justify-center text-center space-y-4"
      >
        <FaInfoCircle className="text-4xl text-gray-600" />
        <h3 className="text-gray-400 font-medium">No Recommendation Available</h3>
        <p className="text-xs text-gray-500">Wait for prediction analysis to complete.</p>
      </motion.div>
    );
  }

  const { recommendation, trend, reason } = data;

  let bgClass = "bg-gray-500/10 border-gray-500/20";
  let iconColor = "text-gray-400";
  let TrendIcon = FaMinus;
  let titleColor = "text-gray-300";

  if (recommendation === 'BUY') {
    bgClass = "bg-blue-500/10 border-blue-500/30";
    iconColor = "text-blue-400";
    TrendIcon = FaArrowUp;
    titleColor = "text-blue-400";
  } else if (recommendation === 'SELL') {
    bgClass = "bg-green-500/10 border-green-500/30";
    iconColor = "text-green-400";
    TrendIcon = FaArrowDown;
    titleColor = "text-green-400";
  } else if (recommendation === 'HOLD') {
    bgClass = "bg-yellow-500/10 border-yellow-500/30";
    iconColor = "text-yellow-400";
    TrendIcon = FaMinus;
    titleColor = "text-yellow-400";
  }

  return (
    <motion.div 
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ delay: 0.15 }}
      className={`glass-panel p-6 rounded-2xl border flex flex-col relative overflow-hidden ${bgClass}`}
    >
      <div className="flex justify-between items-start mb-4">
        <div>
            <h3 className="text-gray-400 font-medium text-sm tracking-wider uppercase mb-1">AI Recommendation</h3>
            <div className={`text-4xl font-black tracking-tight ${titleColor}`}>
                {recommendation || 'UNKNOWN'}
            </div>
        </div>
        <div className={`p-3 rounded-full bg-black/20 ${iconColor}`}>
            <TrendIcon className="text-2xl" />
        </div>
      </div>
      
      <div className="mt-4 flex-1">
        <p className="text-gray-300 text-sm leading-relaxed">
            {reason || "Based on historical price movements and seasonality, our AI suggests proceeding with caution."}
        </p>
      </div>

      <div className="mt-6 pt-4 border-t border-white/5 flex items-center justify-between text-xs">
          <span className="text-gray-500 font-medium uppercase">Trend Status</span>
          <span className={`font-bold px-2 py-1 rounded bg-black/30 ${titleColor}`}>
              {trend || 'STABLE'}
          </span>
      </div>
    </motion.div>
  );
};

export default RecommendationCard;
