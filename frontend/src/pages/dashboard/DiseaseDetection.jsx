import React, { useState, useCallback } from 'react';
import { useDropzone } from 'react-dropzone';
import { motion, AnimatePresence } from 'framer-motion';
import { UploadCloud, Image as ImageIcon, X, AlertCircle, ScanLine, Leaf, Syringe, Pill, History } from 'lucide-react';
import Card from '../../components/ui/Card';
import Button from '../../components/ui/Button';
import api from '../../services/api';
import { Link } from 'react-router-dom';

const DiseaseDetection = () => {
  const [file, setFile] = useState(null);
  const [preview, setPreview] = useState(null);
  const [loading, setLoading] = useState(false);
  const [result, setResult] = useState(null);
  const [error, setError] = useState(null);

  const onDrop = useCallback((acceptedFiles, rejectedFiles) => {
    if (rejectedFiles.length > 0) {
      const { errors } = rejectedFiles[0];
      setError(errors[0].message);
      return;
    }
    
    if (acceptedFiles.length > 0) {
      const selectedFile = acceptedFiles[0];
      setFile(selectedFile);
      setPreview(URL.createObjectURL(selectedFile));
      setError(null);
      setResult(null);
    }
  }, []);

  const { getRootProps, getInputProps, isDragActive } = useDropzone({
    onDrop,
    accept: {
      'image/jpeg': ['.jpg', '.jpeg'],
      'image/png': ['.png']
    },
    maxSize: 5 * 1024 * 1024, // 5MB
    maxFiles: 1
  });

  const removeFile = () => {
    setFile(null);
    setPreview(null);
    setResult(null);
    setError(null);
  };

  const handlePredict = async () => {
    if (!file) return;
    
    setLoading(true);
    setError(null);
    
    const formData = new FormData();
    formData.append('image', file);
    
    try {
      const res = await api.post('/disease/predict/', formData, {
        headers: {
          'Content-Type': 'multipart/form-data'
        }
      });
      setResult(res.data.data);
    } catch (err) {
      setError(err.response?.data?.message || 'Failed to analyze image. Please try again.');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="space-y-6 max-w-6xl mx-auto">
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <h1 className="text-2xl font-bold text-gray-900 dark:text-white flex items-center gap-2">
            <ScanLine className="text-primary-500" /> Plant Disease AI
          </h1>
          <p className="text-gray-500 dark:text-gray-400 text-sm mt-1">Upload a leaf photo and let YOLOv8 AI detect diseases.</p>
        </div>
        <Link to="/dashboard/disease-history">
          <Button variant="outline" className="flex items-center gap-2">
            <History size={16} /> View History
          </Button>
        </Link>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
        
        {/* Upload Section */}
        <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ duration: 0.4 }}>
          <Card className="p-6 h-full flex flex-col">
            <h3 className="text-lg font-semibold text-gray-900 dark:text-white mb-4">Upload Image</h3>
            
            {!preview ? (
              <div 
                {...getRootProps()} 
                className={`flex-1 border-2 border-dashed rounded-xl flex flex-col items-center justify-center p-8 transition-all cursor-pointer ${
                  isDragActive 
                    ? 'border-primary-500 bg-primary-50 dark:bg-primary-900/20' 
                    : 'border-gray-300 dark:border-gray-700 bg-gray-50 dark:bg-gray-800/50 hover:bg-gray-100 dark:hover:bg-gray-800'
                }`}
              >
                <input {...getInputProps()} />
                <div className="w-16 h-16 bg-primary-100 dark:bg-primary-900/30 rounded-full flex items-center justify-center mb-4">
                  <UploadCloud className="w-8 h-8 text-primary-600 dark:text-primary-400" />
                </div>
                <p className="text-gray-700 dark:text-gray-300 font-medium mb-1 text-center">
                  {isDragActive ? "Drop the leaf image here" : "Drag & drop leaf image"}
                </p>
                <p className="text-gray-500 dark:text-gray-400 text-sm text-center">or click to browse from your device</p>
                <div className="mt-6 flex items-center gap-2 text-xs text-gray-400">
                  <ImageIcon size={14} /> Supports JPG, JPEG, PNG (Max 5MB)
                </div>
              </div>
            ) : (
              <div className="flex-1 flex flex-col items-center">
                <div className="relative w-full rounded-xl overflow-hidden bg-gray-100 dark:bg-gray-900 shadow-inner group flex-1 flex items-center justify-center">
                  <img src={preview} alt="Preview" className="max-h-[300px] max-w-full object-contain" />
                  <button 
                    onClick={removeFile}
                    className="absolute top-2 right-2 p-1.5 bg-gray-900/50 hover:bg-red-500 text-white rounded-full transition-colors opacity-0 group-hover:opacity-100"
                  >
                    <X size={18} />
                  </button>
                  
                  {loading && (
                    <div className="absolute inset-0 bg-gray-900/60 backdrop-blur-sm flex flex-col items-center justify-center z-10">
                      <div className="w-16 h-16 border-4 border-primary-500/30 border-t-primary-500 rounded-full animate-spin mb-4" />
                      <p className="text-white font-medium animate-pulse">AI is analyzing...</p>
                    </div>
                  )}
                </div>
                
                <div className="w-full mt-4">
                  <Button 
                    variant="primary" 
                    fullWidth 
                    size="lg" 
                    onClick={handlePredict}
                    isLoading={loading}
                    disabled={loading}
                  >
                    <ScanLine size={18} className="mr-2" /> Detect Disease
                  </Button>
                </div>
              </div>
            )}

            {error && (
              <motion.div 
                initial={{ opacity: 0, height: 0 }} 
                animate={{ opacity: 1, height: 'auto' }} 
                className="mt-4 p-3 rounded-lg bg-red-50 dark:bg-red-900/30 border border-red-100 dark:border-red-800 flex items-start gap-2 text-sm text-red-600 dark:text-red-400"
              >
                <AlertCircle size={16} className="mt-0.5 shrink-0" />
                <p>{error}</p>
              </motion.div>
            )}
          </Card>
        </motion.div>

        {/* Results Section */}
        <motion.div initial={{ opacity: 0, x: 20 }} animate={{ opacity: 1, x: 0 }} transition={{ duration: 0.4, delay: 0.2 }}>
          {result ? (
            <div className="space-y-4 h-full flex flex-col">
              <Card className="p-6 border-l-4 border-primary-500">
                <div className="flex items-start justify-between">
                  <div>
                    <p className="text-sm text-gray-500 dark:text-gray-400 uppercase tracking-widest font-semibold mb-1">AI Diagnosis</p>
                    <h2 className="text-2xl font-bold text-gray-900 dark:text-white mb-2">{result.disease}</h2>
                  </div>
                  <div className="flex flex-col items-end">
                    <span className="text-3xl font-black text-primary-600 dark:text-primary-400">{result.confidence}%</span>
                    <span className="text-xs text-gray-500 dark:text-gray-400">Confidence</span>
                  </div>
                </div>
                
                <div className="w-full bg-gray-200 dark:bg-gray-700 rounded-full h-1.5 mt-2 mb-4">
                  <motion.div 
                    initial={{ width: 0 }}
                    animate={{ width: `${result.confidence}%` }}
                    transition={{ duration: 1, ease: "easeOut" }}
                    className={`h-1.5 rounded-full ${result.confidence > 80 ? 'bg-green-500' : result.confidence > 50 ? 'bg-yellow-500' : 'bg-red-500'}`} 
                  />
                </div>
              </Card>

              {result.info && result.disease !== 'Healthy' && (
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 flex-1">
                  <Card className="p-5 bg-gradient-to-br from-red-50 to-white dark:from-red-900/10 dark:to-gray-900 border-red-100 dark:border-red-900/30">
                    <div className="flex items-center gap-2 mb-3 text-red-600 dark:text-red-400 font-semibold">
                      <AlertCircle size={18} /> Symptoms & Causes
                    </div>
                    <p className="text-sm text-gray-700 dark:text-gray-300 mb-2"><span className="font-medium text-gray-900 dark:text-white">Symptoms:</span> {result.info.symptoms}</p>
                    <p className="text-sm text-gray-700 dark:text-gray-300"><span className="font-medium text-gray-900 dark:text-white">Causes:</span> {result.info.causes}</p>
                  </Card>
                  
                  <Card className="p-5 bg-gradient-to-br from-blue-50 to-white dark:from-blue-900/10 dark:to-gray-900 border-blue-100 dark:border-blue-900/30">
                    <div className="flex items-center gap-2 mb-3 text-blue-600 dark:text-blue-400 font-semibold">
                      <Syringe size={18} /> Medical Treatment
                    </div>
                    <p className="text-sm text-gray-700 dark:text-gray-300">{result.info.recommended_medicine}</p>
                  </Card>
                  
                  <Card className="p-5 bg-gradient-to-br from-green-50 to-white dark:from-green-900/10 dark:to-gray-900 border-green-100 dark:border-green-900/30 sm:col-span-2">
                    <div className="flex items-center gap-2 mb-3 text-green-600 dark:text-green-400 font-semibold">
                      <Leaf size={18} /> Organic/Preventive Care
                    </div>
                    <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                      <p className="text-sm text-gray-700 dark:text-gray-300"><span className="font-medium text-gray-900 dark:text-white block mb-1">Organic Treatment:</span> {result.info.organic_treatment}</p>
                      <p className="text-sm text-gray-700 dark:text-gray-300"><span className="font-medium text-gray-900 dark:text-white block mb-1">Prevention:</span> {result.info.prevention}</p>
                    </div>
                  </Card>
                </div>
              )}

              {result.disease === 'Healthy' && (
                <Card className="p-8 flex-1 flex flex-col items-center justify-center text-center bg-gradient-to-br from-green-50 to-white dark:from-green-900/20 dark:to-gray-900">
                  <div className="w-20 h-20 bg-green-100 dark:bg-green-900/50 text-green-600 dark:text-green-400 rounded-full flex items-center justify-center mb-4">
                    <Leaf size={40} />
                  </div>
                  <h3 className="text-xl font-bold text-gray-900 dark:text-white mb-2">Great News!</h3>
                  <p className="text-gray-600 dark:text-gray-300">Your plant appears to be perfectly healthy. Keep up the good work!</p>
                </Card>
              )}
            </div>
          ) : (
             <Card className="p-8 h-full flex flex-col items-center justify-center text-center border-dashed border-2 border-gray-200 dark:border-gray-800 bg-gray-50/50 dark:bg-gray-900/50">
              <div className="w-24 h-24 bg-gray-100 dark:bg-gray-800 rounded-full flex items-center justify-center mb-6 shadow-inner">
                <ScanLine size={40} className="text-gray-300 dark:text-gray-600" />
              </div>
              <h3 className="text-lg font-bold text-gray-700 dark:text-gray-300 mb-2">Awaiting Image</h3>
              <p className="text-gray-500 dark:text-gray-400 text-sm max-w-sm mx-auto">
                Upload a clear image of a plant leaf to get a detailed disease analysis and treatment recommendations.
              </p>
            </Card>
          )}
        </motion.div>
      </div>
    </div>
  );
};

export default DiseaseDetection;
