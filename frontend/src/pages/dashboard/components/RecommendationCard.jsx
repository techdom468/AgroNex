import React from 'react';
import Card from '../../../components/ui/Card';
import { Lightbulb, Sparkles, AlertTriangle, CheckCircle } from 'lucide-react';

const RecommendationCard = ({ recommendations = [] }) => {
  return (
    <Card className="p-6 h-full border-t-4 border-t-yellow-500 bg-white/80 dark:bg-gray-900/80 backdrop-blur-sm relative overflow-hidden">
      <div className="flex items-center gap-3 mb-6">
        <div className="bg-yellow-100 dark:bg-yellow-900/40 p-2.5 rounded-xl">
          <Lightbulb className="text-yellow-600 dark:text-yellow-500" size={24} />
        </div>
        <div>
          <h2 className="text-lg font-bold text-gray-900 dark:text-white">AI Smart Recommendations</h2>
          <p className="text-xs text-gray-500 dark:text-gray-400">Tailored advice for your farm today</p>
        </div>
      </div>

      <div className="space-y-4 relative z-10">
        {recommendations.length > 0 ? (
          recommendations.map((rec, index) => {
            // Determine icon and color based on content (simple mock logic)
            let Icon = Sparkles;
            let iconColor = "text-yellow-500";
            let bgColor = "bg-yellow-50 dark:bg-yellow-900/20";
            
            if (rec.toLowerCase().includes('risk') || rec.toLowerCase().includes('delay')) {
              Icon = AlertTriangle;
              iconColor = "text-red-500";
              bgColor = "bg-red-50 dark:bg-red-900/20";
            } else if (rec.toLowerCase().includes('suitable') || rec.toLowerCase().includes('low')) {
              Icon = CheckCircle;
              iconColor = "text-green-500";
              bgColor = "bg-green-50 dark:bg-green-900/20";
            } else if (rec.toLowerCase().includes('trend') || rec.toLowerCase().includes('price')) {
              Icon = Sparkles;
              iconColor = "text-blue-500";
              bgColor = "bg-blue-50 dark:bg-blue-900/20";
            }

            return (
              <div key={index} className={`flex items-start gap-3 p-4 rounded-xl ${bgColor} border border-transparent dark:border-gray-800`}>
                <Icon className={`${iconColor} shrink-0 mt-0.5`} size={18} />
                <p className="text-sm font-medium text-gray-800 dark:text-gray-200 leading-relaxed">
                  {rec}
                </p>
              </div>
            );
          })
        ) : (
           <div className="flex flex-col items-center justify-center py-8 text-center">
             <Lightbulb className="text-gray-300 dark:text-gray-600 mb-3" size={32} />
             <p className="text-gray-500 dark:text-gray-400 text-sm">Our AI is analyzing your data to generate smart recommendations...</p>
           </div>
        )}
      </div>
    </Card>
  );
};

export default RecommendationCard;
