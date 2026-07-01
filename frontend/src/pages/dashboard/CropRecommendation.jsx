import React, { useState } from 'react';
import { motion } from 'framer-motion';
import { Sprout, Droplets, Thermometer, FlaskConical, Wind, CloudRain, AlertCircle, RefreshCw } from 'lucide-react';
import Card from '../../components/ui/Card';
import Input from '../../components/ui/Input';
import Button from '../../components/ui/Button';
import api from '../../services/api';

const CropRecommendation = () => {
  const [formData, setFormData] = useState({
    nitrogen: '',
    phosphorus: '',
    potassium: '',
    temperature: '',
    humidity: '',
    ph: '',
    rainfall: ''
  });

  const [loading, setLoading] = useState(false);
  const [result, setResult] = useState(null);
  const [error, setError] = useState(null);

  const handleChange = (e) => {
    setFormData({ ...formData, [e.target.id]: e.target.value });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);
    setError(null);
    setResult(null);

    try {
      // Validate all fields are filled
      for (const key in formData) {
        if (!formData[key]) {
          throw new Error('Please fill all parameters');
        }
      }

      const response = await api.post('/crop-ai/predict/', formData);
      setResult(response.data.data); // Based on standardized format { status, message, data }
    } catch (err) {
      console.error(err);
      setError(err.response?.data?.message || err.message || "Failed to predict crop. Please try again.");
    } finally {
      setLoading(false);
    }
  };

  const resetForm = () => {
    setFormData({
      nitrogen: '', phosphorus: '', potassium: '', temperature: '', humidity: '', ph: '', rainfall: ''
    });
    setResult(null);
    setError(null);
  };

  return (
    <div className="space-y-6 max-w-5xl mx-auto">
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <h1 className="text-2xl font-bold text-gray-900 dark:text-white flex items-center gap-2">
            <Sprout className="text-primary-500" /> AI Crop Recommendation
          </h1>
          <p className="text-gray-500 dark:text-gray-400 text-sm mt-1">Enter soil and environmental parameters to get the best crop suggestion.</p>
        </div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        <motion.div 
          className="lg:col-span-2"
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.4 }}
        >
          <Card className="p-6 h-full">
            <form onSubmit={handleSubmit} className="space-y-6">
              
              {/* NPK Values */}
              <div>
                <h3 className="text-sm font-semibold text-gray-900 dark:text-white uppercase tracking-wider mb-4 border-b border-gray-200 dark:border-gray-800 pb-2">Soil Nutrients (NPK)</h3>
                <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                  <Input
                    id="nitrogen" type="number" label="Nitrogen (N)" placeholder="e.g. 90"
                    icon={FlaskConical} value={formData.nitrogen} onChange={handleChange}
                  />
                  <Input
                    id="phosphorus" type="number" label="Phosphorus (P)" placeholder="e.g. 42"
                    icon={FlaskConical} value={formData.phosphorus} onChange={handleChange}
                  />
                  <Input
                    id="potassium" type="number" label="Potassium (K)" placeholder="e.g. 43"
                    icon={FlaskConical} value={formData.potassium} onChange={handleChange}
                  />
                </div>
              </div>

              {/* Environmental Factors */}
              <div>
                <h3 className="text-sm font-semibold text-gray-900 dark:text-white uppercase tracking-wider mb-4 border-b border-gray-200 dark:border-gray-800 pb-2">Environmental Factors</h3>
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <Input
                    id="temperature" type="number" step="0.1" label="Temperature (°C)" placeholder="e.g. 20.8"
                    icon={Thermometer} value={formData.temperature} onChange={handleChange}
                  />
                  <Input
                    id="humidity" type="number" step="0.1" label="Humidity (%)" placeholder="e.g. 82.0"
                    icon={Droplets} value={formData.humidity} onChange={handleChange}
                  />
                  <Input
                    id="ph" type="number" step="0.1" label="Soil pH Value" placeholder="e.g. 6.5"
                    icon={Wind} value={formData.ph} onChange={handleChange}
                  />
                  <Input
                    id="rainfall" type="number" step="0.1" label="Rainfall (mm)" placeholder="e.g. 202.9"
                    icon={CloudRain} value={formData.rainfall} onChange={handleChange}
                  />
                </div>
              </div>

              {error && (
                <div className="p-4 rounded-lg bg-red-50 dark:bg-red-900/30 flex items-start gap-3 border border-red-100 dark:border-red-800">
                  <AlertCircle className="h-5 w-5 text-red-600 dark:text-red-400 shrink-0 mt-0.5" />
                  <p className="text-sm text-red-600 dark:text-red-400">{error}</p>
                </div>
              )}

              <div className="flex gap-4 pt-4">
                <Button type="submit" variant="primary" fullWidth isLoading={loading}>
                  {loading ? 'Analyzing Data...' : 'Predict Best Crop'}
                </Button>
                <Button type="button" variant="outline" onClick={resetForm} className="px-4">
                  <RefreshCw size={20} className="text-gray-500" />
                </Button>
              </div>
            </form>
          </Card>
        </motion.div>

        {/* Results Panel */}
        <motion.div
          initial={{ opacity: 0, x: 20 }}
          animate={{ opacity: 1, x: 0 }}
          transition={{ duration: 0.4, delay: 0.2 }}
          className="h-full"
        >
          {result ? (
            <Card className="p-0 overflow-hidden h-full border-2 border-primary-500 dark:border-primary-500/50 shadow-primary-500/20 relative">
              <div className="absolute top-0 right-0 w-32 h-32 bg-primary-500/20 rounded-bl-full z-0" />
              <div className="p-8 flex flex-col items-center justify-center h-full text-center relative z-10">
                <div className="w-24 h-24 bg-green-100 dark:bg-green-900/30 rounded-full flex items-center justify-center mb-6 shadow-lg shadow-green-500/20">
                  <Sprout size={48} className="text-green-600 dark:text-green-400" />
                </div>
                
                <h3 className="text-sm font-semibold text-gray-500 dark:text-gray-400 uppercase tracking-widest mb-2">Recommended Crop</h3>
                <h2 className="text-4xl font-black text-gray-900 dark:text-white capitalize mb-4 bg-clip-text text-transparent bg-gradient-to-r from-primary-600 to-green-400">
                  {result.name}
                </h2>
                
                <p className="text-gray-600 dark:text-gray-300 text-sm mb-6 leading-relaxed">
                  {result.description}
                </p>
                
                <div className="w-full bg-gray-50 dark:bg-gray-800/50 rounded-xl p-4 border border-gray-100 dark:border-gray-800">
                  <div className="flex justify-between items-center text-sm mb-2">
                    <span className="text-gray-500 dark:text-gray-400">AI Confidence</span>
                    <span className="font-bold text-primary-600 dark:text-primary-400">{result.confidence}%</span>
                  </div>
                  <div className="w-full bg-gray-200 dark:bg-gray-700 rounded-full h-2">
                    <div className="bg-primary-500 h-2 rounded-full" style={{ width: `${result.confidence}%` }}></div>
                  </div>
                </div>
              </div>
            </Card>
          ) : (
            <Card className="p-8 h-full flex flex-col items-center justify-center text-center border-dashed border-2 border-gray-200 dark:border-gray-800 bg-gray-50/50 dark:bg-gray-900/50">
              <div className="w-20 h-20 bg-gray-100 dark:bg-gray-800 rounded-full flex items-center justify-center mb-4 opacity-50">
                <FlaskConical size={32} className="text-gray-400" />
              </div>
              <h3 className="text-lg font-bold text-gray-700 dark:text-gray-300 mb-2">No Prediction Yet</h3>
              <p className="text-gray-500 dark:text-gray-400 text-sm">
                Fill in the soil and environmental parameters on the left and hit predict to see the AI recommendation here.
              </p>
            </Card>
          )}
        </motion.div>
      </div>
    </div>
  );
};

export default CropRecommendation;
