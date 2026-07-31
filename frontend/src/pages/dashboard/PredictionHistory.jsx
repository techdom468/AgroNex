import React, { useState, useEffect } from 'react';
import { motion } from 'framer-motion';
import { Search, Filter, Calendar, Sprout, ScanLine, ArrowLeft } from 'lucide-react';
import { Link } from 'react-router-dom';
import Card from '../../components/ui/Card';
import Button from '../../components/ui/Button';
import Input from '../../components/ui/Input';
import api from '../../services/api';

const PredictionHistory = () => {
  const [history, setHistory] = useState([]);
  const [loading, setLoading] = useState(true);
  const [searchTerm, setSearchTerm] = useState('');

  useEffect(() => {
    fetchHistory();
  }, []);

  const fetchHistory = async () => {
    try {
      setLoading(true);
      const res = await api.get('/disease/history/');
      setHistory(res.data.data);
    } catch (error) {
      console.error("Failed to fetch history:", error);
    } finally {
      setLoading(false);
    }
  };

  const filteredHistory = history.filter(item => 
    item.disease_name.toLowerCase().includes(searchTerm.toLowerCase())
  );

  return (
    <div className="space-y-6 max-w-6xl mx-auto">
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <h1 className="text-2xl font-bold text-gray-900 dark:text-white flex items-center gap-2">
            <ScanLine className="text-primary-500" /> Disease Prediction History
          </h1>
          <p className="text-gray-500 dark:text-gray-400 text-sm mt-1">Review your past plant analyses and treatments.</p>
        </div>
        <Link to="/dashboard/disease-ai">
          <Button variant="outline" className="flex items-center gap-2">
            <ArrowLeft size={16} /> Back to Scanner
          </Button>
        </Link>
      </div>

      <Card className="p-4 sm:p-6 mb-6">
        <div className="flex flex-col sm:flex-row gap-4">
          <div className="flex-1">
            <Input 
              icon={Search} 
              placeholder="Search by disease name..." 
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
            />
          </div>
          <Button variant="outline" className="flex items-center justify-center gap-2">
            <Filter size={16} /> Filter
          </Button>
        </div>
      </Card>

      {loading ? (
        <div className="flex justify-center items-center py-20">
          <div className="w-12 h-12 border-4 border-primary-500/30 border-t-primary-500 rounded-full animate-spin" />
        </div>
      ) : filteredHistory.length > 0 ? (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {filteredHistory.map((record, index) => (
            <motion.div
              key={record.id}
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.3, delay: index * 0.1 }}
            >
              <Card className="overflow-hidden hover:shadow-xl transition-shadow flex flex-col h-full">
                <div className="bg-primary-50 dark:bg-primary-900/20 p-4 border-b border-primary-100 dark:border-primary-800/50 flex justify-between items-start">
                  <div className="bg-white dark:bg-gray-800 p-2 rounded-lg shadow-sm">
                    <Sprout className="text-primary-500 h-6 w-6" />
                  </div>
                  <div className="bg-primary-100 text-primary-700 dark:bg-primary-900/50 dark:text-primary-400 px-3 py-1 rounded-full text-xs font-bold border border-primary-200 dark:border-primary-800">
                    {record.confidence}% Match
                  </div>
                </div>
                
                <div className="p-5 flex flex-col flex-1">
                  <h3 className="font-bold text-lg text-gray-900 dark:text-white mb-2 line-clamp-1">{record.disease_name}</h3>
                  
                  <div className="flex items-center gap-2 text-xs text-gray-500 dark:text-gray-400 mb-4">
                    <Calendar size={14} /> 
                    {new Date(record.prediction_date).toLocaleDateString('en-US', {
                      year: 'numeric', month: 'short', day: 'numeric'
                    })}
                  </div>
                  
                  <div className="mt-auto pt-4 border-t border-gray-100 dark:border-gray-800">
                    <p className="text-sm text-gray-600 dark:text-gray-300 line-clamp-2">
                      <span className="font-semibold">Treatment:</span> {record.medicine || 'Organic care recommended.'}
                    </p>
                  </div>
                </div>
              </Card>
            </motion.div>
          ))}
        </div>
      ) : (
        <Card className="p-12 flex flex-col items-center justify-center text-center border-dashed border-2 bg-gray-50/50 dark:bg-gray-900/50">
          <div className="w-20 h-20 bg-gray-100 dark:bg-gray-800 rounded-full flex items-center justify-center mb-4">
            <Sprout size={32} className="text-gray-400" />
          </div>
          <h3 className="text-lg font-bold text-gray-700 dark:text-gray-300 mb-2">No Records Found</h3>
          <p className="text-gray-500 dark:text-gray-400 text-sm max-w-sm mx-auto">
            {searchTerm ? 'No predictions match your search term.' : 'You haven\'t made any disease predictions yet.'}
          </p>
          {!searchTerm && (
            <Link to="/dashboard/disease-ai" className="mt-6">
              <Button variant="primary">Start Your First Scan</Button>
            </Link>
          )}
        </Card>
      )}
    </div>
  );
};

export default PredictionHistory;
