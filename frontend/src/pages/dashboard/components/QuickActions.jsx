import React from 'react';
import { motion } from 'framer-motion';
import { Link } from 'react-router-dom';
import Card from '../../../components/ui/Card';
import { Sprout, ScanLine, CloudSun, TrendingUp, Landmark, MessageSquare } from 'lucide-react';

const QuickActions = () => {
  const actions = [
    {
      title: "Crop Recommendation",
      desc: "Get AI advice on what to plant",
      icon: <Sprout size={28} className="text-green-600 dark:text-green-500" />,
      bg: "bg-green-100 dark:bg-green-900/30",
      link: "/dashboard/crop-recommendation",
      delay: 0.1
    },
    {
      title: "Disease Detection",
      desc: "Scan and identify plant diseases",
      icon: <ScanLine size={28} className="text-red-600 dark:text-red-500" />,
      bg: "bg-red-100 dark:bg-red-900/30",
      link: "/dashboard/disease-ai",
      delay: 0.2
    },
    {
      title: "Weather Forecast",
      desc: "Real-time agri-weather updates",
      icon: <CloudSun size={28} className="text-blue-600 dark:text-blue-500" />,
      bg: "bg-blue-100 dark:bg-blue-900/30",
      link: "/dashboard/weather",
      delay: 0.3
    },
    {
      title: "Market Prices",
      desc: "Live APMC crop market rates",
      icon: <TrendingUp size={28} className="text-orange-600 dark:text-orange-500" />,
      bg: "bg-orange-100 dark:bg-orange-900/30",
      link: "/dashboard/market",
      delay: 0.4
    },
    {
      title: "Government Schemes",
      desc: "Find subsidies and schemes",
      icon: <Landmark size={28} className="text-purple-600 dark:text-purple-500" />,
      bg: "bg-purple-100 dark:bg-purple-900/30",
      link: "/dashboard/schemes",
      delay: 0.5
    },
    {
      title: "AI Chatbot",
      desc: "Ask your personal AI agronomist",
      icon: <MessageSquare size={28} className="text-teal-600 dark:text-teal-500" />,
      bg: "bg-teal-100 dark:bg-teal-900/30",
      link: "/dashboard/chatbot",
      delay: 0.6
    }
  ];

  return (
    <div className="grid grid-cols-2 md:grid-cols-3 gap-4 lg:gap-6">
      {actions.map((action, idx) => (
        <motion.div
          key={idx}
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.4, delay: action.delay }}
        >
          <Link to={action.link} className="block h-full">
            <Card hoverable className="h-full p-5 flex flex-col items-center justify-center text-center transition-all duration-300 hover:-translate-y-2 group border-transparent hover:border-primary-500/50">
              <div className={`p-4 rounded-full ${action.bg} mb-4 transition-transform duration-300 group-hover:scale-110`}>
                {action.icon}
              </div>
              <h3 className="font-bold text-gray-900 dark:text-white mb-1 group-hover:text-primary-600 dark:group-hover:text-primary-400 transition-colors">
                {action.title}
              </h3>
              <p className="text-xs text-gray-500 dark:text-gray-400">
                {action.desc}
              </p>
            </Card>
          </Link>
        </motion.div>
      ))}
    </div>
  );
};

export default QuickActions;
