import React from 'react';
import { motion } from 'framer-motion';
import { 
  FaLightbulb, FaTint, FaTractor, 
  FaLeaf, FaThermometerFull, FaCloudRain, FaWind 
} from 'react-icons/fa';

const iconMap = {
  todays_advice: FaLightbulb,
  tomorrows_advice: FaLightbulb,
  irrigation: FaTint,
  spraying: FaTractor,
  harvest: FaLeaf,
  fertilizer: FaTractor,
  disease_risk: FaLeaf,
  heat_stress: FaThermometerFull,
  rain_warning: FaCloudRain,
  wind_warning: FaWind
};

const titleMap = {
  todays_advice: "Today's Advice",
  tomorrows_advice: "Tomorrow's Advice",
  irrigation: "Irrigation",
  spraying: "Pesticide Spraying",
  harvest: "Harvesting",
  fertilizer: "Fertilizer",
  disease_risk: "Disease Risk",
  heat_stress: "Heat Stress",
  rain_warning: "Rain Warning",
  wind_warning: "Wind Warning"
};

const RecommendationPanel = ({ recommendations }) => {
  if (!recommendations) return null;

  const entries = Object.entries(recommendations);

  return (
    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
      {entries.map(([key, value], index) => {
        const Icon = iconMap[key] || FaLightbulb;
        const title = titleMap[key] || key;
        
        // Skip default/empty values if we want a cleaner UI
        if (!value || value.includes("normal") || value.includes("No major")) return null;

        return (
          <motion.div
            key={key}
            initial={{ opacity: 0, scale: 0.9 }}
            animate={{ opacity: 1, scale: 1 }}
            transition={{ duration: 0.3, delay: index * 0.1 }}
            className="bg-white dark:bg-slate-800 rounded-xl p-5 shadow-lg border-l-4 border-emerald-500 hover:shadow-xl transition-shadow"
          >
            <div className="flex items-center space-x-3 mb-3">
              <div className="bg-emerald-100 dark:bg-emerald-900/50 p-2 rounded-lg text-emerald-600 dark:text-emerald-400">
                <Icon className="w-5 h-5" />
              </div>
              <h4 className="font-semibold text-gray-800 dark:text-white">{title}</h4>
            </div>
            <p className="text-gray-600 dark:text-gray-300 text-sm leading-relaxed">
              {value}
            </p>
          </motion.div>
        );
      })}
    </div>
  );
};

export default RecommendationPanel;
