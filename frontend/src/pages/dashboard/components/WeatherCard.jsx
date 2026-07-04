import React from 'react';
import Card from '../../../components/ui/Card';
import Button from '../../../components/ui/Button';
import { Link } from 'react-router-dom';
import { Cloud, Droplets, Wind, CloudRain, ArrowRight } from 'lucide-react';

const WeatherCard = ({ weatherData }) => {
  if (!weatherData) return (
    <Card className="p-6 h-full flex items-center justify-center bg-white/50 dark:bg-gray-900/50">
      <div className="animate-pulse flex flex-col items-center">
        <div className="w-12 h-12 bg-gray-200 dark:bg-gray-700 rounded-full mb-4"></div>
        <div className="h-4 bg-gray-200 dark:bg-gray-700 rounded w-24 mb-2"></div>
        <div className="h-3 bg-gray-200 dark:bg-gray-700 rounded w-16"></div>
      </div>
    </Card>
  );

  const { current, location: locationObj } = weatherData;
  const locationName = locationObj?.name || 'Rajkot, Gujarat';

  return (
    <Card hoverable className="p-6 h-full flex flex-col justify-between bg-gradient-to-br from-blue-50 to-white dark:from-blue-900/20 dark:to-gray-900 border-t-4 border-t-blue-500 relative overflow-hidden">
      {/* Decorative background icon */}
      <Cloud className="absolute -top-10 -right-10 w-40 h-40 text-blue-500/5 dark:text-blue-400/5" />
      
      <div className="relative z-10">
        <div className="flex justify-between items-start mb-6">
          <div>
            <h3 className="text-sm font-semibold text-gray-500 dark:text-gray-400 tracking-wider uppercase mb-1">Today's Weather</h3>
            <p className="text-xl font-bold text-gray-900 dark:text-white">{locationName}</p>
          </div>
          <div className="bg-blue-100 dark:bg-blue-900/40 p-3 rounded-2xl">
            <Cloud className="text-blue-600 dark:text-blue-400 w-8 h-8" />
          </div>
        </div>

        <div className="flex items-end gap-3 mb-6">
          <span className="text-5xl font-black text-gray-900 dark:text-white tracking-tighter">
            {current?.temperature_2m || '--'}°C
          </span>
          <span className="text-lg font-medium text-gray-600 dark:text-gray-300 mb-1">
            Mostly Clear
          </span>
        </div>

        <div className="grid grid-cols-3 gap-4 mb-8">
          <div className="flex flex-col gap-1">
            <div className="flex items-center gap-1.5 text-gray-500 dark:text-gray-400 text-xs font-medium">
              <Droplets size={14} className="text-blue-500" /> Humidity
            </div>
            <span className="text-sm font-bold text-gray-900 dark:text-white">{current?.relative_humidity_2m || '--'}%</span>
          </div>
          <div className="flex flex-col gap-1">
            <div className="flex items-center gap-1.5 text-gray-500 dark:text-gray-400 text-xs font-medium">
              <Wind size={14} className="text-teal-500" /> Wind
            </div>
            <span className="text-sm font-bold text-gray-900 dark:text-white">{current?.wind_speed_10m || '--'} km/h</span>
          </div>
          <div className="flex flex-col gap-1">
            <div className="flex items-center gap-1.5 text-gray-500 dark:text-gray-400 text-xs font-medium">
              <CloudRain size={14} className="text-indigo-500" /> Rain
            </div>
            <span className="text-sm font-bold text-gray-900 dark:text-white">{current?.precipitation || '0'} mm</span>
          </div>
        </div>
      </div>

      <Link to="/dashboard/weather">
        <Button variant="outline" className="w-full relative z-10 flex items-center justify-center gap-2 group">
          View Full Forecast <ArrowRight size={16} className="group-hover:translate-x-1 transition-transform" />
        </Button>
      </Link>
    </Card>
  );
};

export default WeatherCard;
