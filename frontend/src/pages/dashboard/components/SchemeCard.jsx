import React from 'react';
import Card from '../../../components/ui/Card';
import Button from '../../../components/ui/Button';
import { Landmark, ArrowRight } from 'lucide-react';
import { Link } from 'react-router-dom';

const SchemeCard = ({ schemeData, user }) => {
  const isProfileIncomplete = user && (!user.state || !user.district || !user.main_crop);

  if (isProfileIncomplete) {
    return (
      <Card className="p-6 h-full border-l-4 border-l-purple-500 flex flex-col justify-center items-center text-center">
        <Landmark className="text-gray-300 dark:text-gray-600 mb-3" size={32} />
        <h3 className="text-gray-900 dark:text-white font-semibold mb-1">Profile Incomplete</h3>
        <p className="text-xs text-gray-500 dark:text-gray-400 mb-4">Complete your profile to get personalized scheme recommendations.</p>
        <Link to="/dashboard/profile">
          <Button variant="outline" className="text-xs py-1.5 px-4 h-auto">Go to Profile</Button>
        </Link>
      </Card>
    );
  }

  if (!schemeData) return (
    <Card className="p-6 h-full flex items-center justify-center bg-white/50 dark:bg-gray-900/50">
       <div className="animate-pulse flex items-center gap-4">
         <div className="w-12 h-12 bg-gray-200 dark:bg-gray-700 rounded-full"></div>
         <div className="flex flex-col gap-2">
            <div className="h-4 bg-gray-200 dark:bg-gray-700 rounded w-32"></div>
            <div className="h-3 bg-gray-200 dark:bg-gray-700 rounded w-24"></div>
         </div>
       </div>
    </Card>
  );

  const scheme = schemeData.length > 0 ? schemeData[0] : null;

  if (!scheme) {
    return (
      <Card className="p-6 h-full border-l-4 border-l-purple-500 flex flex-col justify-center items-center text-center">
        <Landmark className="text-gray-300 dark:text-gray-600 mb-3" size={32} />
        <h3 className="text-gray-900 dark:text-white font-semibold mb-1">No Schemes Found</h3>
        <p className="text-xs text-gray-500 dark:text-gray-400">Update your profile to get personalized scheme recommendations.</p>
      </Card>
    );
  }

  return (
    <Card className="p-6 h-full border-l-4 border-l-purple-500 relative overflow-hidden flex flex-col justify-between group">
      <div className="relative z-10 mb-4">
        <div className="flex items-center gap-2 mb-3">
          <div className="bg-purple-100 dark:bg-purple-900/40 p-2 rounded-lg text-purple-600 dark:text-purple-400">
            <Landmark size={20} />
          </div>
          <span className="text-xs font-bold text-purple-600 dark:text-purple-400 uppercase tracking-wider">Recommended Scheme</span>
        </div>
        
        <h3 className="text-lg font-bold text-gray-900 dark:text-white mb-2 line-clamp-2 group-hover:text-purple-600 dark:group-hover:text-purple-400 transition-colors">
          {scheme.schemeName || scheme.scheme_name || scheme.title || 'Government Scheme'}
        </h3>
        
        <p className="text-sm text-gray-600 dark:text-gray-400 line-clamp-3 mb-4">
          {scheme.description || scheme.benefits || 'Explore this scheme to see how it can benefit your farming operations and reduce costs.'}
        </p>

        {(scheme.eligibility || scheme.targetBeneficiaries) && (
           <div className="bg-gray-50 dark:bg-gray-800/50 rounded-lg p-3 border border-gray-100 dark:border-gray-700 mb-4">
             <span className="text-xs font-semibold text-gray-900 dark:text-gray-100 block mb-1">Eligibility:</span>
             <p className="text-xs text-gray-600 dark:text-gray-400 line-clamp-2">{scheme.eligibility || scheme.targetBeneficiaries}</p>
           </div>
        )}
      </div>

      <Link to={`/dashboard/schemes?open=${scheme.schemeId || ''}`} className="relative z-10 block">
        <Button variant="outline" className="w-full flex items-center justify-center gap-2">
          Read More <ArrowRight size={16} />
        </Button>
      </Link>
    </Card>
  );
};

export default SchemeCard;
