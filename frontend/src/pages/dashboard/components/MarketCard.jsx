import React from 'react';
import Card from '../../../components/ui/Card';
import Button from '../../../components/ui/Button';
import { Link } from 'react-router-dom';
import { TrendingUp, MapPin, Clock, ArrowRight } from 'lucide-react';

const MarketCard = ({ marketData }) => {
  if (!marketData) return (
    <Card className="p-6 h-full flex items-center justify-center bg-white/50 dark:bg-gray-900/50">
      <div className="animate-pulse flex flex-col items-center">
        <div className="w-12 h-12 bg-gray-200 dark:bg-gray-700 rounded-full mb-4"></div>
        <div className="h-4 bg-gray-200 dark:bg-gray-700 rounded w-24 mb-2"></div>
        <div className="h-3 bg-gray-200 dark:bg-gray-700 rounded w-16"></div>
      </div>
    </Card>
  );

  // API returns array directly from get_live_prices
  const rawData = Array.isArray(marketData) ? marketData : (marketData?.data || []);
  const data = rawData[0] || null;

  // No data yet — show a friendly empty state
  if (!data) return (
    <Card className="p-6 h-full flex flex-col justify-center items-center text-center bg-gradient-to-br from-green-50 to-white dark:from-green-900/20 dark:to-gray-900 border-t-4 border-t-green-500">
      <TrendingUp className="w-10 h-10 text-gray-300 dark:text-gray-600 mb-3" />
      <p className="text-sm font-semibold text-gray-500 dark:text-gray-400">Market data unavailable</p>
      <p className="text-xs text-gray-400 dark:text-gray-500 mt-1">Check your internet connection or try again later.</p>
      <Link to="/dashboard/market" className="mt-4">
        <Button variant="outline" className="text-xs px-4 py-2">View Market Details</Button>
      </Link>
    </Card>
  );

  const commodity = data.crop || data.commodity || 'Commodity';
  const market = data.market || '—';
  const price = data.modalPrice || data.modal_price || data.price || null;
  const minPrice = data.minimumPrice || data.min_price || null;
  const maxPrice = data.maximumPrice || data.max_price || null;
  const date = data.scrapedDate || data.arrival_date || 'Today';

  return (
    <Card hoverable className="p-6 h-full flex flex-col justify-between bg-gradient-to-br from-green-50 to-white dark:from-green-900/20 dark:to-gray-900 border-t-4 border-t-green-500 relative overflow-hidden">
      <TrendingUp className="absolute -top-10 -right-10 w-40 h-40 text-green-500/5 dark:text-green-400/5" />
      
      <div className="relative z-10">
        <div className="flex justify-between items-start mb-6">
          <div>
            <h3 className="text-sm font-semibold text-gray-500 dark:text-gray-400 tracking-wider uppercase mb-1">Live Market Price</h3>
            <p className="text-xl font-bold text-gray-900 dark:text-white capitalize">{commodity}</p>
          </div>
          <div className="bg-green-100 dark:bg-green-900/40 p-3 rounded-2xl">
            <TrendingUp className="text-green-600 dark:text-green-400 w-8 h-8" />
          </div>
        </div>

        <div className="flex items-end gap-3 mb-3">
          <span className="text-5xl font-black text-gray-900 dark:text-white tracking-tighter">
            {price !== null ? `₹${Number(price).toLocaleString('en-IN')}` : '₹—'}
          </span>
          <span className="text-sm font-medium text-gray-500 dark:text-gray-400 mb-2">
            / Quintal
          </span>
        </div>

        {(minPrice || maxPrice) && (
          <div className="flex gap-4 mb-5">
            <span className="text-xs text-gray-500 dark:text-gray-400">
              Min: <span className="font-semibold text-green-600 dark:text-green-400">
                ₹{Number(minPrice).toLocaleString('en-IN')}
              </span>
            </span>
            <span className="text-xs text-gray-500 dark:text-gray-400">
              Max: <span className="font-semibold text-red-500 dark:text-red-400">
                ₹{Number(maxPrice).toLocaleString('en-IN')}
              </span>
            </span>
          </div>
        )}

        <div className="space-y-3 mb-8">
          <div className="flex items-center gap-2 text-sm text-gray-600 dark:text-gray-300">
            <MapPin size={16} className="text-red-400" />
            <span className="font-medium">{market}</span>
          </div>
          <div className="flex items-center gap-2 text-sm text-gray-600 dark:text-gray-300">
            <Clock size={16} className="text-blue-400" />
            <span>Updated: <span className="font-medium">{date}</span></span>
          </div>
        </div>
      </div>

      <Link to="/dashboard/market">
        <Button variant="outline" className="w-full relative z-10 flex items-center justify-center gap-2 group">
          View Market Details <ArrowRight size={16} className="group-hover:translate-x-1 transition-transform" />
        </Button>
      </Link>
    </Card>
  );
};

export default MarketCard;
