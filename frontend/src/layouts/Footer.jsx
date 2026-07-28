import React from 'react';
import { Leaf, Globe, Mail, Phone, MessageCircle } from 'lucide-react';
import { Link } from 'react-router-dom';

const Footer = () => {
  const currentYear = new Date().getFullYear();

  return (
    <footer className="bg-white border-t border-gray-200 dark:bg-gray-900 dark:border-gray-800 pt-16 pb-8">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="grid grid-cols-1 md:grid-cols-4 gap-12 mb-12">
          {/* Brand */}
          <div className="col-span-1 md:col-span-1">
            <Link to="/" className="flex items-center gap-2 mb-4">
              <div className="bg-primary-500 p-1.5 rounded-lg">
                <Leaf className="h-6 w-6 text-white" />
              </div>
              <span className="text-xl font-heading font-bold text-gray-900 dark:text-white">
                Agro<span className="text-primary-500">Nex</span>
              </span>
            </Link>
            <p className="text-gray-500 dark:text-gray-400 text-sm mb-6 leading-relaxed">
              Smart farming solutions powered by AI. Empowering farmers with technology for a better yield and sustainable future.
            </p>
            <div className="flex space-x-4 text-gray-400">
              <a href="/#" className="hover:text-primary-500 transition-colors"><Globe size={20} /></a>
              <a href="/#" className="hover:text-primary-500 transition-colors"><MessageCircle size={20} /></a>
              <a href="/#" className="hover:text-primary-500 transition-colors"><Mail size={20} /></a>
              <a href="/#" className="hover:text-primary-500 transition-colors"><Phone size={20} /></a>
            </div>
          </div>

          {/* Quick Links */}
          <div>
            <h3 className="font-semibold text-gray-900 dark:text-white mb-4">Features</h3>
            <ul className="space-y-3">
              <li><a href="/#features" className="text-gray-500 hover:text-primary-500 dark:text-gray-400 dark:hover:text-primary-400 text-sm">Crop Recommendation</a></li>
              <li><a href="/#features" className="text-gray-500 hover:text-primary-500 dark:text-gray-400 dark:hover:text-primary-400 text-sm">Disease Detection</a></li>
              <li><a href="/#features" className="text-gray-500 hover:text-primary-500 dark:text-gray-400 dark:hover:text-primary-400 text-sm">Market Prices</a></li>
              <li><a href="/#features" className="text-gray-500 hover:text-primary-500 dark:text-gray-400 dark:hover:text-primary-400 text-sm">Weather Forecast</a></li>
            </ul>
          </div>

          <div>
            <h3 className="font-semibold text-gray-900 dark:text-white mb-4">Company</h3>
            <ul className="space-y-3">
              <li><Link to="/about" className="text-gray-500 hover:text-primary-500 dark:text-gray-400 dark:hover:text-primary-400 text-sm">About Us</Link></li>
              <li><Link to="/contact" className="text-gray-500 hover:text-primary-500 dark:text-gray-400 dark:hover:text-primary-400 text-sm">Contact</Link></li>
            </ul>
          </div>

          <div>
            <h3 className="font-semibold text-gray-900 dark:text-white mb-4">Legal</h3>
            <ul className="space-y-3">
              <li><a href="/#" className="text-gray-500 hover:text-primary-500 dark:text-gray-400 dark:hover:text-primary-400 text-sm">Privacy Policy</a></li>
              <li><a href="/#" className="text-gray-500 hover:text-primary-500 dark:text-gray-400 dark:hover:text-primary-400 text-sm">Terms of Service</a></li>
            </ul>
          </div>
        </div>

        <div className="border-t border-gray-200 dark:border-gray-800 pt-8 flex flex-col md:flex-row justify-between items-center">
          <p className="text-sm text-gray-500 dark:text-gray-400">
            &copy; {currentYear} AgroNex. All rights reserved.
          </p>
        </div>
      </div>
    </footer>
  );
};

export default Footer;
