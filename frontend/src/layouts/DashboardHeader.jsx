import React from 'react';
import { Menu, Bell, Search } from 'lucide-react';
import { useAuth } from '../hooks/useAuth';

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

        {/* Search Bar (Hidden on very small screens) */}
        <div className="hidden sm:flex items-center relative">
          <Search className="absolute left-3 text-gray-400" size={18} />
          <input 
            type="text" 
            placeholder="Search..." 
            className="pl-10 pr-4 py-2 w-64 rounded-lg bg-gray-100 dark:bg-gray-800 border-none text-sm text-gray-900 dark:text-gray-100 focus:ring-2 focus:ring-primary-500 transition-shadow"
          />
        </div>
      </div>

      <div className="flex items-center gap-3 sm:gap-5">
{/* Notifications */}
        <button className="p-2 text-gray-500 hover:text-gray-900 dark:text-gray-400 dark:hover:text-white rounded-full hover:bg-gray-100 dark:hover:bg-gray-800 transition-colors relative">
          <Bell size={20} />
          <span className="absolute top-1.5 right-1.5 w-2 h-2 bg-red-500 rounded-full border-2 border-white dark:border-gray-900"></span>
        </button>

        {/* User Avatar */}
        <div className="flex items-center gap-3 pl-2 sm:pl-4 border-l border-gray-200 dark:border-gray-800">
          <div className="w-8 h-8 rounded-full bg-primary-100 dark:bg-primary-900/30 flex items-center justify-center text-primary-600 dark:text-primary-400 font-bold text-sm">
            {user?.full_name ? user.full_name.charAt(0).toUpperCase() : 'U'}
          </div>
          <div className="hidden md:block text-sm">
            <p className="font-medium text-gray-900 dark:text-white">{user?.full_name || 'Farmer'}</p>
            <p className="text-xs text-gray-500 dark:text-gray-400 capitalize">{user?.role || 'Farmer'}</p>
          </div>
        </div>
      </div>
    </header>
  );
};

export default DashboardHeader;
