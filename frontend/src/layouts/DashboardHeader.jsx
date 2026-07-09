import React from 'react';
import { Menu } from 'lucide-react';
import { Link } from 'react-router-dom';
import { useAuth } from '../hooks/useAuth';
import LanguageSelector from '../components/ui/LanguageSelector';

const DashboardHeader = ({ setIsSidebarOpen }) => {
  const { user } = useAuth();

  return (
    <header className="h-16 bg-white dark:bg-gray-900 border-b border-gray-200 dark:border-gray-800 flex items-center justify-between px-4 lg:px-8 sticky top-0 z-30">
      <div className="flex items-center gap-4">
        {/* Mobile Menu Toggle */}
        <button 
          onClick={() => setIsSidebarOpen(true)}
          className="lg:hidden p-2 -ml-2 text-gray-500 hover:text-gray-900 dark:text-gray-400 dark:hover:text-white rounded-lg hover:bg-gray-100 dark:hover:bg-gray-800 transition-colors"
        >
          <Menu size={24} />
        </button>

      </div>

      <div className="flex items-center gap-3 sm:gap-5">
        
        <LanguageSelector variant="navbar" />

        {/* User Avatar */}
        <Link to="/dashboard/profile" className="flex items-center gap-3 pl-2 sm:pl-4 border-l border-gray-200 dark:border-gray-800 hover:opacity-80 transition-opacity">
          <div className="w-8 h-8 rounded-full bg-primary-100 dark:bg-primary-900/30 flex items-center justify-center text-primary-600 dark:text-primary-400 font-bold text-sm">
            {user?.full_name ? user.full_name.charAt(0).toUpperCase() : 'U'}
          </div>
          <div className="hidden md:block text-sm text-left">
            <p className="font-medium text-gray-900 dark:text-white">{user?.full_name || 'Farmer'}</p>
            <p className="text-xs text-gray-500 dark:text-gray-400 capitalize">{user?.role || 'Farmer'}</p>
          </div>
        </Link>
      </div>
    </header>
  );
};

export default DashboardHeader;
