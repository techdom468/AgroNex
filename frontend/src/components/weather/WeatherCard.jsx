import React from 'react';
import { motion } from 'framer-motion';

const WeatherCard = ({ title, value, icon: Icon, unit, delay = 0 }) => {
  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.5, delay }}
      className="bg-white/10 dark:bg-slate-800/50 backdrop-blur-md rounded-2xl p-6 border border-white/20 shadow-xl flex items-center space-x-4"
    >
      <div className="p-4 bg-emerald-500/20 rounded-full text-emerald-500">
        <Icon className="w-8 h-8" />
      </div>
      <div>
        <p className="text-sm text-gray-500 dark:text-gray-400 font-medium uppercase tracking-wider">{title}</p>
        <h3 className="text-2xl font-bold text-gray-800 dark:text-white mt-1">
          {value} <span className="text-lg font-medium text-gray-500">{unit}</span>
        </h3>
      </div>
    </motion.div>
  );
};

export default WeatherCard;
