import React, { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { ExternalLink, ChevronDown, CheckCircle, Landmark, Tag, CheckSquare, PlusCircle } from 'lucide-react';

const SchemeCard = ({ scheme, recommended, defaultExpanded = false }) => {
  const [isExpanded, setIsExpanded] = useState(defaultExpanded);

  const getCategoryColor = (category) => {
    const colors = {
      'Financial Assistance': 'bg-blue-100 text-blue-800 dark:bg-blue-900 dark:text-blue-200',
      'Insurance & Risk Management': 'bg-purple-100 text-purple-800 dark:bg-purple-900 dark:text-purple-200',
      'Energy & Irrigation': 'bg-yellow-100 text-yellow-800 dark:bg-yellow-900 dark:text-yellow-200',
      'Soil Testing & Health': 'bg-green-100 text-green-800 dark:bg-green-900 dark:text-green-200',
      'Market Access & Trade': 'bg-indigo-100 text-indigo-800 dark:bg-indigo-900 dark:text-indigo-200',
      'Infrastructure & Logistics': 'bg-orange-100 text-orange-800 dark:bg-orange-900 dark:text-orange-200',
      'Food Security & Production': 'bg-teal-100 text-teal-800 dark:bg-teal-900 dark:text-teal-200',
    };
    return colors[category] || 'bg-gray-100 text-gray-800 dark:bg-gray-800 dark:text-gray-200';
  };

  return (
    <motion.div 
      initial={{ opacity: 0, y: 10 }}
      animate={{ opacity: 1, y: 0 }}
      layout
      className={`bg-white dark:bg-gray-800 rounded-2xl overflow-hidden border ${
        defaultExpanded
          ? 'border-green-500 dark:border-green-400 ring-2 ring-green-400/40 shadow-lg shadow-green-100 dark:shadow-none'
          : recommended 
            ? 'border-green-400 dark:border-green-500 shadow-md shadow-green-100 dark:shadow-none' 
            : 'border-gray-200 dark:border-gray-700 shadow-sm'
      } flex flex-col`}
    >
      {recommended && (
        <div className="bg-green-500 text-white text-xs font-bold px-4 py-1.5 flex items-center gap-1.5 uppercase tracking-wide">
          <CheckCircle className="w-3.5 h-3.5" />
          Highly Recommended for You
        </div>
      )}
      
      <div className="p-6 flex flex-col flex-grow">
        <div className="mb-4">
          <span className={`inline-flex items-center gap-1.5 px-3 py-1 rounded-full text-xs font-medium ${getCategoryColor(scheme.category)} mb-3`}>
            <Tag className="w-3.5 h-3.5" />
            {scheme.category || 'General'}
          </span>
          <h3 className="text-xl font-bold text-gray-900 dark:text-white leading-tight">
            {scheme.schemeName}
          </h3>
        </div>

        {/* Benefits Preview */}
        {scheme.benefits && (
          <div className="mb-4">
            <h4 className="text-sm font-bold text-gray-900 dark:text-gray-100 mb-1 flex items-center gap-1.5">
              <PlusCircle className="w-4 h-4 text-green-500" /> Benefits
            </h4>
            <p className="text-sm text-gray-600 dark:text-gray-300 line-clamp-2">
              {scheme.benefits}
            </p>
          </div>
        )}

        {/* Eligibility Preview */}
        {scheme.eligibility && (
          <div className="mb-4">
            <h4 className="text-sm font-bold text-gray-900 dark:text-gray-100 mb-1 flex items-center gap-1.5">
              <CheckSquare className="w-4 h-4 text-blue-500" /> Eligibility
            </h4>
            <p className="text-sm text-gray-600 dark:text-gray-300 line-clamp-2">
              {scheme.eligibility}
            </p>
          </div>
        )}

        {/* Official Source */}
        <div className="mb-6 flex items-center gap-2">
          <Landmark className="w-4 h-4 text-gray-400" />
          <span className="text-sm text-gray-500 dark:text-gray-400 font-medium">Source:</span>
          <a 
            href={scheme.officialWebsite} 
            target="_blank" 
            rel="noopener noreferrer"
            className="text-sm font-medium text-green-600 hover:text-green-700 dark:text-green-400 dark:hover:text-green-300 truncate inline-block max-w-[200px]"
          >
            {scheme.source || 'Official Portal'}
          </a>
        </div>

        {/* Action Buttons */}
        <div className="mt-auto pt-4 flex items-center gap-3 border-t border-gray-100 dark:border-gray-700">
          <button 
            onClick={() => setIsExpanded(!isExpanded)}
            className="flex-1 py-2 px-4 rounded-xl border border-gray-200 dark:border-gray-600 text-sm font-medium text-gray-700 dark:text-gray-300 hover:bg-gray-50 dark:hover:bg-gray-700 transition-colors flex items-center justify-center gap-2"
          >
            Read More
            <ChevronDown className={`w-4 h-4 transition-transform ${isExpanded ? 'rotate-180' : ''}`} />
          </button>
          
          <a 
            href={scheme.officialWebsite} 
            target="_blank" 
            rel="noopener noreferrer"
            className="flex-1 py-2 px-4 rounded-xl bg-green-600 hover:bg-green-700 text-white text-sm font-medium transition-colors flex items-center justify-center gap-2 shadow-sm shadow-green-200 dark:shadow-none"
          >
            Apply Now
            <ExternalLink className="w-4 h-4" />
          </a>
        </div>

        {/* Expanded Details */}
        <AnimatePresence>
          {isExpanded && (
            <motion.div
              initial={{ height: 0, opacity: 0 }}
              animate={{ height: 'auto', opacity: 1 }}
              exit={{ height: 0, opacity: 0 }}
              transition={{ duration: 0.3 }}
              className="overflow-hidden"
            >
              <div className="pt-6 space-y-5">
                
                {/* Full Description */}
                <div>
                  <h4 className="text-sm font-bold text-gray-900 dark:text-white mb-2">Description</h4>
                  <p className="text-sm text-gray-600 dark:text-gray-300 leading-relaxed">
                    {scheme.description}
                  </p>
                </div>

                {/* Full Benefits */}
                {scheme.benefits && (
                  <div>
                    <h4 className="text-sm font-bold text-gray-900 dark:text-white mb-2">Full Benefits</h4>
                    <p className="text-sm text-gray-600 dark:text-gray-300 leading-relaxed">
                      {scheme.benefits}
                    </p>
                  </div>
                )}

                {/* Full Eligibility */}
                {scheme.eligibility && (
                  <div>
                    <h4 className="text-sm font-bold text-gray-900 dark:text-white mb-2">Full Eligibility</h4>
                    <p className="text-sm text-gray-600 dark:text-gray-300 leading-relaxed">
                      {scheme.eligibility}
                    </p>
                  </div>
                )}

                {scheme.requiredDocuments && scheme.requiredDocuments.length > 0 && (
                  <div>
                    <h4 className="text-sm font-bold text-gray-900 dark:text-white mb-2">Required Documents</h4>
                    <ul className="grid grid-cols-1 sm:grid-cols-2 gap-2">
                      {scheme.requiredDocuments.map((doc, idx) => (
                        <li key={idx} className="flex items-start gap-2 text-sm text-gray-600 dark:text-gray-400">
                          <span className="text-green-500 mt-0.5">•</span> {doc}
                        </li>
                      ))}
                    </ul>
                  </div>
                )}

                {scheme.applicationProcess && (
                  <div>
                    <h4 className="text-sm font-bold text-gray-900 dark:text-white mb-2">Application Process</h4>
                    <p className="text-sm text-gray-600 dark:text-gray-400 leading-relaxed">
                      {scheme.applicationProcess}
                    </p>
                  </div>
                )}
              </div>
            </motion.div>
          )}
        </AnimatePresence>
      </div>
    </motion.div>
  );
};

export default SchemeCard;
