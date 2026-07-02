import React from 'react';
import { motion } from 'framer-motion';
import { FaArrowUp, FaArrowDown, FaMinus, FaLightbulb } from 'react-icons/fa';

const RecommendationCard = ({ recommendationData }) => {
  if (!recommendationData) return null;

  const { recommendation, reason, confidence, expectedProfitDifference, trend } = recommendationData;

  const getStyleParams = (rec) => {
    switch (rec) {
      case 'Sell Today':
        return {
          bg: 'bg-red-500/10',
          border: 'border-red-500/20',
          text: 'text-red-500',
          icon: <FaArrowDown className="text-xl" />,
          glow: 'shadow-[0_0_20px_rgba(239,68,68,0.15)]'
        };
      case 'Wait 1 Day':
      case 'Wait 2 Days':
        return {
          bg: 'bg-green-500/10',
          border: 'border-green-500/20',
          text: 'text-green-500',
          icon: <FaArrowUp className="text-xl" />,
          glow: 'shadow-[0_0_20px_rgba(34,197,94,0.15)]'
        };
      case 'Hold Stock':
      default:
        return {
          bg: 'bg-yellow-500/10',
          border: 'border-yellow-500/20',
          text: 'text-yellow-500',
          icon: <FaMinus className="text-xl" />,
          glow: 'shadow-[0_0_20px_rgba(234,179,8,0.15)]'
        };
    }
  };

  const style = getStyleParams(recommendation);

  return (
    <motion.div 
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      className={`glass-panel p-6 flex flex-col gap-4 border ${style.border} ${style.glow} rounded-2xl relative overflow-hidden`}
    >
      {/* Background Decor */}
      <div className={`absolute -right-10 -top-10 w-32 h-32 rounded-full blur-3xl opacity-20 ${style.bg.replace('/10', '')}`} />

      <div className="flex items-center gap-3">
        <div className={`p-3 rounded-xl ${style.bg} ${style.text}`}>
          <FaLightbulb className="text-2xl" />
        </div>
        <div>
          <h3 className="text-gray-400 text-sm font-medium">AI Recommendation</h3>
          <p className={`text-2xl font-bold ${style.text}`}>{recommendation}</p>
        </div>
      </div>

      <div className="mt-2 bg-black/20 p-4 rounded-xl border border-white/5">
        <p className="text-gray-300 text-sm leading-relaxed">
          {reason}
        </p>
        
        <div className="mt-4 pt-4 border-t border-white/5 flex justify-between items-center text-sm">
          <div className="flex flex-col gap-1">
            <span className="text-gray-500 text-xs">Expected Price Diff</span>
            <div className="flex items-center gap-2 font-semibold">
              <span className={expectedProfitDifference > 0 ? 'text-green-500' : 'text-red-500'}>
                ₹{Math.abs(expectedProfitDifference).toFixed(2)}
              </span>
              <span className="text-gray-400">/ qtl</span>
            </div>
          </div>
          
          <div className="flex flex-col gap-1 items-end">
            <span className="text-gray-500 text-xs">AI Confidence</span>
            <span className="text-white font-semibold font-mono">{confidence}</span>
          </div>
        </div>
      </div>
    </motion.div>
  );
};

export default RecommendationCard;
