import React from 'react';
import { motion } from 'framer-motion';
import { 
  Sprout, Activity, TrendingUp, CloudRain, 
  ArrowUpRight, ArrowDownRight, MapPin
} from 'lucide-react';
import {
  Chart as ChartJS,
  CategoryScale,
  LinearScale,
  PointElement,
  LineElement,
  Title,
  Tooltip,
  Legend,
  Filler
} from 'chart.js';
import { Line } from 'react-chartjs-2';
import Card from '../../components/ui/Card';
import Button from '../../components/ui/Button';

// Register ChartJS modules
ChartJS.register(
  CategoryScale,
  LinearScale,
  PointElement,
  LineElement,
  Title,
  Tooltip,
  Legend,
  Filler
);

const DashboardHome = () => {
  // Chart Data
  const chartData = {
    labels: ['Jan', 'Feb', 'Mar', 'Apr', 'May', 'Jun', 'Jul'],
    datasets: [
      {
        fill: true,
        label: 'Market Price (Wheat) - ₹/Quintal',
        data: [2100, 2150, 2180, 2120, 2200, 2250, 2300],
        borderColor: '#10b981',
        backgroundColor: 'rgba(16, 185, 129, 0.1)',
        tension: 0.4,
      },
    ],
  };

  const chartOptions = {
    responsive: true,
    maintainAspectRatio: false,
    plugins: {
      legend: {
        display: false,
      },
      tooltip: {
        mode: 'index',
        intersect: false,
      },
    },
    scales: {
      y: {
        grid: {
          color: 'rgba(156, 163, 175, 0.1)',
        },
      },
      x: {
        grid: {
          display: false,
        },
      },
    },
  };

  const stats = [
    { title: 'Total Predictions', value: '142', icon: <Sprout className="text-green-500" />, trend: '+12%', positive: true },
    { title: 'Diseases Detected', value: '18', icon: <Activity className="text-red-500" />, trend: '-2%', positive: true },
    { title: 'Market Alerts', value: '5', icon: <TrendingUp className="text-blue-500" />, trend: 'New', positive: true },
    { title: 'Rainfall (Week)', value: '45mm', icon: <CloudRain className="text-cyan-500" />, trend: '+5mm', positive: true },
  ];

  const recentActivity = [
    { type: 'crop', title: 'Crop Recommended', desc: 'Wheat for Field A', time: '2 hours ago', icon: <Sprout size={16} className="text-green-500" /> },
    { type: 'disease', title: 'Disease Detected', desc: 'Leaf Rust identified on Tomato', time: 'Yesterday', icon: <Activity size={16} className="text-red-500" /> },
    { type: 'market', title: 'Price Alert', desc: 'Cotton prices are up by 5%', time: '2 days ago', icon: <TrendingUp size={16} className="text-blue-500" /> },
  ];

  return (
    <div className="space-y-6">
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <h1 className="text-2xl font-bold text-gray-900 dark:text-white">Dashboard Overview</h1>
          <p className="text-gray-500 dark:text-gray-400 text-sm mt-1">Welcome back! Here's what's happening on your farm.</p>
        </div>
        <div className="flex items-center gap-2 text-sm text-gray-600 dark:text-gray-300 bg-white dark:bg-gray-900 px-4 py-2 rounded-lg border border-gray-200 dark:border-gray-800 shadow-sm">
          <MapPin size={16} className="text-primary-500" />
          <span>Gujarat, India</span>
        </div>
      </div>

      {/* Stats Grid */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4 md:gap-6">
        {stats.map((stat, index) => (
          <motion.div
            key={index}
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.3, delay: index * 0.1 }}
          >
            <Card className="p-5 flex flex-col justify-between h-full">
              <div className="flex justify-between items-start mb-4">
                <div className="p-3 bg-gray-50 dark:bg-gray-800 rounded-xl">
                  {stat.icon}
                </div>
                <span className={`flex items-center text-xs font-semibold px-2 py-1 rounded-full ${
                  stat.positive 
                    ? 'text-green-700 bg-green-100 dark:text-green-400 dark:bg-green-900/30' 
                    : 'text-red-700 bg-red-100 dark:text-red-400 dark:bg-red-900/30'
                }`}>
                  {stat.positive ? <ArrowUpRight size={14} className="mr-1" /> : <ArrowDownRight size={14} className="mr-1" />}
                  {stat.trend}
                </span>
              </div>
              <div>
                <h3 className="text-2xl font-bold text-gray-900 dark:text-white">{stat.value}</h3>
                <p className="text-sm text-gray-500 dark:text-gray-400 mt-1">{stat.title}</p>
              </div>
            </Card>
          </motion.div>
        ))}
      </div>

      {/* Charts and Activity Grid */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* Chart Section */}
        <motion.div 
          className="lg:col-span-2"
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.4, delay: 0.4 }}
        >
          <Card className="p-5 h-full">
            <div className="flex justify-between items-center mb-6">
              <h2 className="text-lg font-bold text-gray-900 dark:text-white">Market Price Trends</h2>
              <select className="bg-gray-50 dark:bg-gray-800 border border-gray-200 dark:border-gray-700 text-sm rounded-lg focus:ring-primary-500 focus:border-primary-500 p-2">
                <option>Wheat</option>
                <option>Rice</option>
                <option>Cotton</option>
              </select>
            </div>
            <div className="h-72 w-full">
              <Line data={chartData} options={chartOptions} />
            </div>
          </Card>
        </motion.div>

        {/* Recent Activity Section */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.4, delay: 0.5 }}
        >
          <Card className="p-5 h-full flex flex-col">
            <div className="flex justify-between items-center mb-6">
              <h2 className="text-lg font-bold text-gray-900 dark:text-white">Recent Activity</h2>
              <button className="text-sm text-primary-600 dark:text-primary-400 hover:underline">View All</button>
            </div>
            
            <div className="flex-1 flex flex-col gap-4">
              {recentActivity.map((activity, index) => (
                <div key={index} className="flex items-start gap-4 p-3 rounded-xl hover:bg-gray-50 dark:hover:bg-gray-800/50 transition-colors">
                  <div className="p-2 bg-white dark:bg-gray-800 shadow-sm border border-gray-100 dark:border-gray-700 rounded-lg mt-1">
                    {activity.icon}
                  </div>
                  <div>
                    <h4 className="text-sm font-semibold text-gray-900 dark:text-gray-100">{activity.title}</h4>
                    <p className="text-sm text-gray-500 dark:text-gray-400 mt-0.5">{activity.desc}</p>
                    <span className="text-xs text-gray-400 dark:text-gray-500 mt-1 block">{activity.time}</span>
                  </div>
                </div>
              ))}
            </div>

            <div className="mt-6 pt-4 border-t border-gray-100 dark:border-gray-800">
              <Button variant="primary" fullWidth>
                New Prediction
              </Button>
            </div>
          </Card>
        </motion.div>
      </div>
    </div>
  );
};

export default DashboardHome;
