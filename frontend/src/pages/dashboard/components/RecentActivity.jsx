import React from 'react';
import { Link } from 'react-router-dom';
import Card from '../../../components/ui/Card';
import { Sprout, Activity, History } from 'lucide-react';

const RecentActivity = ({ activityData }) => {
  if (!activityData) {
    return (
      <Card className="p-6 h-full flex items-center justify-center bg-white/50 dark:bg-gray-900/50">
        <div className="animate-pulse space-y-4 w-full">
          {[1, 2, 3].map(i => (
             <div key={i} className="flex items-start gap-4 p-3 border border-gray-100 dark:border-gray-800 rounded-xl">
               <div className="w-10 h-10 bg-gray-200 dark:bg-gray-700 rounded-lg"></div>
               <div className="flex-1">
                 <div className="h-4 bg-gray-200 dark:bg-gray-700 rounded w-1/2 mb-2"></div>
                 <div className="h-3 bg-gray-200 dark:bg-gray-700 rounded w-3/4"></div>
               </div>
             </div>
          ))}
        </div>
      </Card>
    );
  }

  const activities = activityData || [];

  return (
    <Card className="p-6 h-full flex flex-col">
      <div className="flex justify-between items-center mb-6">
        <div className="flex items-center gap-2">
           <History className="text-gray-500" size={20} />
           <h2 className="text-lg font-bold text-gray-900 dark:text-white">Recent Activity</h2>
        </div>
        <Link to="/dashboard/history" className="text-sm font-semibold text-primary-600 dark:text-primary-400 hover:underline">
          View All
        </Link>
      </div>
      
      <div className="flex-1 flex flex-col gap-3">
        {activities.length > 0 ? (
          activities.map((activity, index) => {
            const isDisease = activity.type === 'disease';
            const Icon = isDisease ? Activity : Sprout;
            const iconColor = isDisease ? 'text-red-500' : 'text-green-500';
            const bgColor = isDisease ? 'bg-red-50 dark:bg-red-900/20' : 'bg-green-50 dark:bg-green-900/20';
            
            // Format timestamp nicely
            let formattedTime = 'Recently';
            if (activity.time) {
                const date = new Date(activity.time);
                if (!isNaN(date.getTime())) {
                    formattedTime = date.toLocaleDateString('en-US', { month: 'short', day: 'numeric' });
                }
            }

            return (
              <div key={index} className="flex items-start gap-4 p-3 rounded-xl hover:bg-gray-50 dark:hover:bg-gray-800/50 transition-colors border border-transparent hover:border-gray-100 dark:hover:border-gray-800 group">
                <div className={`p-2 rounded-lg ${bgColor} shrink-0 mt-1 transition-transform group-hover:scale-110`}>
                  <Icon size={18} className={iconColor} />
                </div>
                <div className="flex-1 min-w-0">
                  <h4 className="text-sm font-semibold text-gray-900 dark:text-gray-100 truncate">{activity.title}</h4>
                  <p className="text-xs text-gray-500 dark:text-gray-400 mt-0.5 line-clamp-1">{activity.desc}</p>
                </div>
                <div className="text-xs text-gray-400 dark:text-gray-500 shrink-0 mt-1 whitespace-nowrap">
                  {formattedTime}
                </div>
              </div>
            );
          })
        ) : (
          <div className="flex-1 flex flex-col items-center justify-center py-8 text-center border-2 border-dashed border-gray-100 dark:border-gray-800 rounded-xl bg-gray-50/50 dark:bg-gray-900/50">
             <Activity className="text-gray-300 dark:text-gray-600 mb-3" size={24} />
             <p className="text-gray-500 dark:text-gray-400 text-sm">No recent activity found.</p>
             <p className="text-gray-400 dark:text-gray-500 text-xs mt-1">Try scanning a crop disease!</p>
          </div>
        )}
      </div>
    </Card>
  );
};

export default RecentActivity;
