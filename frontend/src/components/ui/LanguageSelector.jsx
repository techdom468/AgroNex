import React, { useState, useEffect, useRef } from 'react';
import { Globe, ChevronDown } from 'lucide-react';
import { motion, AnimatePresence } from 'framer-motion';

const languages = [
  { code: 'en', name: 'English', label: 'English - EN' },
  { code: 'hi', name: 'Hindi', label: 'हिन्दी - HI' },
  { code: 'gu', name: 'Gujarati', label: 'ગુજરાતી - GU' },
];

const LanguageSelector = ({ variant = 'navbar' }) => {
  const [isOpen, setIsOpen] = useState(false);
  const [currentLang, setCurrentLang] = useState('en');
  const dropdownRef = useRef(null);

  // Close dropdown when clicking outside
  useEffect(() => {
    const handleClickOutside = (event) => {
      if (dropdownRef.current && !dropdownRef.current.contains(event.target)) {
        setIsOpen(false);
      }
    };
    document.addEventListener('mousedown', handleClickOutside);
    return () => document.removeEventListener('mousedown', handleClickOutside);
  }, []);

  // Sync with Google Translate cookie on mount
  useEffect(() => {
    const match = document.cookie.match(/(?:^|;)\s*googtrans=([^;]*)/);
    if (match) {
      const parts = match[1].split('/');
      if (parts.length > 2) {
        const langCode = parts[2];
        if (languages.some(l => l.code === langCode)) {
          setCurrentLang(langCode);
        }
      }
    }
  }, []);

  const changeLanguage = (langCode) => {
    setCurrentLang(langCode);
    setIsOpen(false);

    // Set Google Translate cookie (translates from English 'en' to selected lang)
    document.cookie = `googtrans=/en/${langCode}; path=/`;

    // Also set for domain to be safe
    const domain = window.location.hostname;
    document.cookie = `googtrans=/en/${langCode}; path=/; domain=${domain}`;

    // Reload to apply translation reliably in React SPA
    window.location.reload();
  };

  const selectedLang = languages.find(l => l.code === currentLang) || languages[0];

  return (
    <div className="relative" ref={dropdownRef}>
      <button
        onClick={() => setIsOpen(!isOpen)}
        className={`flex items-center gap-2 px-4 py-2.5 rounded-xl transition-all duration-300 font-medium text-sm border-2
          ${variant === 'navbar'
            ? 'bg-gray-900 text-white border-transparent hover:bg-gray-800 dark:bg-gray-800 dark:hover:bg-gray-700'
            : 'w-full bg-primary-50 text-primary-700 border-primary-200 hover:bg-primary-100 hover:border-primary-300 dark:bg-primary-900/30 dark:text-primary-400 dark:border-primary-800/50 dark:hover:bg-primary-900/50 justify-between shadow-sm'
          }`}
      >
        <div className="flex items-center gap-2">
          <Globe size={18} className={variant === 'navbar' ? 'text-gray-300' : 'text-primary-500'} />
          <span>{selectedLang.name}</span>
        </div>
        {variant === 'sidebar' && <ChevronDown size={16} className={`transition-transform ${isOpen ? 'rotate-180' : 'text-primary-500/70'}`} />}
      </button>

      <AnimatePresence>
        {isOpen && (
          <motion.div
            initial={{ opacity: 0, y: 10, scale: 0.95 }}
            animate={{ opacity: 1, y: 0, scale: 1 }}
            exit={{ opacity: 0, y: 10, scale: 0.95 }}
            transition={{ duration: 0.2 }}
            className={`absolute z-50 mt-2 w-56 bg-white dark:bg-gray-800 rounded-xl shadow-xl border border-gray-100 dark:border-gray-700 py-2 ${variant === 'navbar' ? 'right-0' : 'left-0 bottom-12'
              }`}
          >
            <div className="px-4 py-2 text-xs font-semibold text-gray-400 dark:text-gray-500 uppercase tracking-wider">
              Change Language
            </div>
            <div className="mt-1 max-h-64 overflow-y-auto">
              {languages.map((lang) => (
                <button
                  key={lang.code}
                  onClick={() => changeLanguage(lang.code)}
                  className="w-full text-left px-4 py-2.5 text-sm hover:bg-primary-50 dark:hover:bg-primary-900/20 hover:text-primary-600 dark:hover:text-primary-400 flex items-center gap-3 transition-colors group"
                >
                  <div className={`w-4 h-4 rounded-full border-2 flex items-center justify-center ${currentLang === lang.code
                      ? 'border-primary-500'
                      : 'border-gray-300 dark:border-gray-600 group-hover:border-primary-400'
                    }`}>
                    {currentLang === lang.code && (
                      <div className="w-2 h-2 bg-primary-500 rounded-full" />
                    )}
                  </div>
                  <span className={currentLang === lang.code ? 'text-gray-900 dark:text-white font-medium' : 'text-gray-600 dark:text-gray-400'}>
                    {lang.label}
                  </span>
                </button>
              ))}
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
};

export default LanguageSelector;
