import React from 'react';
import { NavLink } from 'react-router-dom';
import { 
  LayoutDashboard, User, Sprout, CloudSun, 
  TrendingUp, Landmark, MessageSquare, 
  History, LogOut, X, Leaf, ScanLine
} from 'lucide-react';
import { useAuth } from '../hooks/useAuth';

const Sidebar = ({ isOpen, setIsOpen }) => {
  const { logout } = useAuth();

  const menuItems = [
    { title: 'Dashboard', path: '/dashboard', icon: <LayoutDashboard size={20} /> },
    { title: 'My Profile', path: '/dashboard/profile', icon: <User size={20} /> },
    { title: 'Crop Recommendation', path: '/dashboard/crop-recommendation', icon: <Sprout size={20} /> },
    { title: 'Disease Detection AI', path: '/dashboard/disease-ai', icon: <ScanLine size={20} /> },
    { title: 'Weather Forecast', path: '/dashboard/weather', icon: <CloudSun size={20} /> },
    { title: 'Market Prices', path: '/dashboard/market', icon: <TrendingUp size={20} /> },
    { title: 'Govt Schemes', path: '/dashboard/schemes', icon: <Landmark size={20} /> },
    { title: 'AI Chatbot', path: '/dashboard/chat', icon: <MessageSquare size={20} /> },
    { title: 'Prediction History', path: '/dashboard/disease-history', icon: <History size={20} /> },
  ];

  return (
    <>
      {/* Mobile Overlay */}
      {isOpen && (
        <div 
          className="fixed inset-0 bg-gray-900/50 backdrop-blur-sm z-40 lg:hidden"
          onClick={() => setIsOpen(false)}
        />
      )}

      {/* Sidebar Container */}
      <aside 
        className={`fixed top-0 left-0 h-screen w-64 bg-white dark:bg-gray-900 border-r border-gray-200 dark:border-gray-800 z-50 transition-transform duration-300 ease-in-out lg:translate-x-0 ${
          isOpen ? 'translate-x-0' : '-translate-x-full'
        }`}
      >
        {/* Header */}
        <div className="h-16 flex items-center justify-between px-6 border-b border-gray-200 dark:border-gray-800">
          <NavLink to="/" className="flex items-center gap-2">
            <div className="bg-primary-500 p-1.5 rounded-lg">
              <Leaf className="text-white" size={20} />
            </div>
            <span className="text-xl font-bold text-gray-900 dark:text-white">AgroNex</span>
          </NavLink>
          
          <button 
            className="lg:hidden text-gray-500 hover:text-gray-900 dark:text-gray-400 dark:hover:text-white"
            onClick={() => setIsOpen(false)}
          >
            <X size={24} />
          </button>
        </div>

        {/* Navigation Links */}
        <div className="h-[calc(100vh-4rem)] flex flex-col justify-between overflow-y-auto">
          <nav className="p-4 space-y-1">
            {menuItems.map((item, index) => (
              <NavLink
                key={index}
                to={item.path}
                end={item.path === '/dashboard'} // exact match for dashboard home
                className={({ isActive }) => 
                  `flex items-center gap-3 px-3 py-2.5 rounded-lg text-sm font-medium transition-colors ${
                    isActive 
                      ? 'bg-primary-50 dark:bg-primary-900/20 text-primary-600 dark:text-primary-400' 
                      : 'text-gray-600 dark:text-gray-400 hover:bg-gray-50 dark:hover:bg-gray-800 hover:text-gray-900 dark:hover:text-gray-200'
                  }`
                }
              >
                {item.icon}
                {item.title}
              </NavLink>
            ))}
          </nav>

          {/* Logout Button */}
          <div className="p-4 border-t border-gray-200 dark:border-gray-800">
            <button 
              onClick={logout}
              className="flex items-center gap-3 px-3 py-2.5 rounded-lg text-sm font-medium text-red-600 dark:text-red-400 hover:bg-red-50 dark:hover:bg-red-900/20 transition-colors w-full"
            >
              <LogOut size={20} />
              Logout
            </button>
          </div>
        </div>
      </aside>
    </>
  );
};

export default Sidebar;
