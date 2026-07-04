import React, { useState, useEffect, useContext, useRef } from 'react';
import { AuthContext } from '../../context/AuthContext';
import schemesService from '../../services/schemesService';
import SchemeCard from '../../components/Schemes/SchemeCard';
import { motion, AnimatePresence } from 'framer-motion';
import { Search, Filter, RefreshCw, AlertCircle, Loader2 } from 'lucide-react';
import { Link, useSearchParams } from 'react-router-dom';

const GovernmentSchemes = () => {
  const { user } = useContext(AuthContext);
  
  const [recommendedSchemes, setRecommendedSchemes] = useState([]);
  const [allSchemes, setAllSchemes] = useState([]);
  const [loadingRecommended, setLoadingRecommended] = useState(true);
  const [loadingAll, setLoadingAll] = useState(true);
  const [error, setError] = useState(null);
  
  const [search, setSearch] = useState('');
  const [category, setCategory] = useState('');
  const [stateFilter, setStateFilter] = useState('');
  const [ministryFilter, setMinistryFilter] = useState('');
  
  const [sortOption, setSortOption] = useState('alphabetical'); // newest, oldest, alphabetical
  
  const [refreshing, setRefreshing] = useState(false);
  const [systemStatus, setSystemStatus] = useState(null);

  const [page, setPage] = useState(1);
  const [totalPages, setTotalPages] = useState(1);

  // Read ?open=schemeId from URL (from dashboard "Read More" button)
  const [searchParams] = useSearchParams();
  const openSchemeId = searchParams.get('open');
  const schemeRefs = useRef({});

  const categories = [
    'Financial Assistance',
    'Insurance & Risk Management',
    'Energy & Irrigation',
    'Soil Testing & Health',
    'Market Access & Trade',
    'Infrastructure & Logistics',
    'Food Security & Production'
  ];

  const fetchRecommended = async () => {
    if (!user) {
      setLoadingRecommended(false);
      return;
    }
    setLoadingRecommended(true);
    try {
      const res = await schemesService.getRecommendedSchemes();
      if (res.success) {
        setRecommendedSchemes(res.data.schemes || []);
      }
    } catch (err) {
      console.error("Failed to fetch recommended schemes", err);
    } finally {
      setLoadingRecommended(false);
    }
  };

  const fetchAllSchemes = async () => {
    setLoadingAll(true);
    try {
      let sortBy = 'schemeName';
      let sortOrder = 'asc';
      
      if (sortOption === 'newest') {
        sortBy = 'updatedAt';
        sortOrder = 'desc';
      } else if (sortOption === 'oldest') {
        sortBy = 'updatedAt';
        sortOrder = 'asc';
      }

      const params = { 
        page, 
        page_size: 10,
        sort_by: sortBy,
        sort_order: sortOrder
      };
      
      if (search) params.search = search;
      if (category) params.category = category;
      if (stateFilter) params.state = stateFilter;
      if (ministryFilter) params.ministry = ministryFilter;
      
      const res = await schemesService.getSchemes(params);
      if (res.success) {
        setAllSchemes(res.data.schemes || []);
        setTotalPages(res.data.pagination.total_pages || 1);
      }
    } catch (err) {
      console.error("Failed to fetch all schemes", err);
      setError("Failed to load schemes.");
    } finally {
      setLoadingAll(false);
    }
  };

  const fetchSystemStatus = async () => {
    try {
      const res = await schemesService.getSystemStatus();
      if (res.success) {
        setSystemStatus(res.data);
      }
    } catch (err) {
      console.error("Status fetch failed", err);
    }
  };

  useEffect(() => {
    fetchRecommended();
    fetchSystemStatus();
  }, [user]);

  useEffect(() => {
    // Debounce search and filter changes
    const delay = setTimeout(() => {
      setPage(1); // Reset page on new search/filter
      fetchAllSchemes();
    }, 500);
    return () => clearTimeout(delay);
  }, [search, category, stateFilter, ministryFilter, sortOption]);

  useEffect(() => {
    fetchAllSchemes();
  }, [page]);

  // Auto-scroll to the highlighted scheme when data is ready
  useEffect(() => {
    if (openSchemeId && !loadingRecommended && !loadingAll) {
      // Small delay to let the DOM render
      setTimeout(() => {
        const el = schemeRefs.current[openSchemeId];
        if (el) {
          el.scrollIntoView({ behavior: 'smooth', block: 'center' });
        }
      }, 400);
    }
  }, [openSchemeId, loadingRecommended, loadingAll]);

  const handleRefresh = async () => {
    if (user?.role !== 'admin') return;
    setRefreshing(true);
    try {
      const res = await schemesService.refreshSchemes();
      if (res.success) {
        fetchRecommended();
        fetchAllSchemes();
        fetchSystemStatus();
      }
    } catch (err) {
      alert("Refresh failed: " + (err.message || 'Unknown error'));
    } finally {
      setRefreshing(false);
    }
  };

  const hasCompleteProfile = user && user.state && user.main_crop;

  return (
    <div className="max-w-7xl mx-auto py-8 px-4 sm:px-6 lg:px-8 space-y-12">
      
      {/* Header */}
      <div className="flex flex-col md:flex-row md:items-end justify-between gap-4">
        <motion.div initial={{ opacity: 0, x: -20 }} animate={{ opacity: 1, x: 0 }}>
          <h1 className="text-3xl font-bold text-gray-900 dark:text-white">Government Schemes</h1>
          <p className="mt-2 text-gray-600 dark:text-gray-400 max-w-2xl">
            Discover and apply for official agricultural schemes. Our service automatically aggregates and recommends the best opportunities for your farm.
          </p>
        </motion.div>
        
        {user?.role === 'admin' && (
          <motion.div initial={{ opacity: 0, x: 20 }} animate={{ opacity: 1, x: 0 }}>
            <button 
              onClick={handleRefresh}
              disabled={refreshing}
              className="inline-flex items-center gap-2 px-4 py-2 bg-white dark:bg-gray-800 border border-gray-300 dark:border-gray-600 rounded-lg text-sm font-medium text-gray-700 dark:text-gray-300 hover:bg-gray-50 dark:hover:bg-gray-700 shadow-sm"
            >
              <RefreshCw className={`w-4 h-4 ${refreshing ? 'animate-spin text-green-500' : ''}`} />
              {refreshing ? 'Syncing...' : 'Force Sync Data'}
            </button>
            {systemStatus && (
              <p className="text-xs text-gray-500 mt-2 text-right">
                Last sync: {systemStatus.last_refresh ? new Date(systemStatus.last_refresh).toLocaleDateString() : 'Never'}
              </p>
            )}
          </motion.div>
        )}
      </div>

      {/* Recommended Schemes Section */}
      <section>
        <div className="flex items-center gap-3 mb-6">
          <h2 className="text-2xl font-bold text-gray-900 dark:text-white">Recommended For You</h2>
          <div className="h-px bg-gray-200 dark:bg-gray-700 flex-grow ml-4"></div>
        </div>

        {!hasCompleteProfile ? (
          <div className="bg-gradient-to-r from-blue-50 to-indigo-50 dark:from-blue-900/20 dark:to-indigo-900/20 border border-blue-100 dark:border-blue-800 rounded-2xl p-6 sm:p-8 flex flex-col sm:flex-row items-center justify-between gap-6 shadow-sm">
            <div>
              <h3 className="text-lg font-semibold text-blue-900 dark:text-blue-100 mb-2">Complete Your Profile</h3>
              <p className="text-blue-700 dark:text-blue-300">
                Update your state, district, and main crop in your profile to get highly accurate, personalized scheme recommendations.
              </p>
            </div>
            <Link 
              to="/dashboard/profile"
              className="whitespace-nowrap px-6 py-3 bg-blue-600 hover:bg-blue-700 text-white rounded-xl font-medium transition-colors shadow-sm"
            >
              Update Profile
            </Link>
          </div>
        ) : loadingRecommended ? (
          <div className="flex justify-center py-12">
            <Loader2 className="w-8 h-8 animate-spin text-green-500" />
          </div>
        ) : recommendedSchemes.length > 0 ? (
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
            {recommendedSchemes.map(scheme => (
              <div key={`rec-${scheme.schemeId}`} ref={el => schemeRefs.current[scheme.schemeId] = el}>
                <SchemeCard
                  scheme={scheme}
                  recommended={true}
                  defaultExpanded={openSchemeId === scheme.schemeId}
                />
              </div>
            ))}
          </div>
        ) : (
          <div className="text-center py-12 bg-gray-50 dark:bg-gray-800/50 rounded-2xl border border-gray-100 dark:border-gray-700">
            <AlertCircle className="w-10 h-10 text-gray-400 mx-auto mb-3" />
            <p className="text-gray-600 dark:text-gray-400 font-medium">No highly matched schemes found for your exact profile.</p>
            <p className="text-sm text-gray-500 mt-1">Browse all available schemes below.</p>
          </div>
        )}
      </section>

      {/* All Schemes Section */}
      <section>
        <div className="flex flex-col mb-6 gap-4">
          <div className="flex items-center gap-3">
            <h2 className="text-2xl font-bold text-gray-900 dark:text-white">All Government Schemes</h2>
            {systemStatus && (
              <span className="bg-gray-100 dark:bg-gray-800 text-gray-600 dark:text-gray-300 text-xs px-2.5 py-1 rounded-full font-medium border border-gray-200 dark:border-gray-700">
                {systemStatus.total_schemes} Available
              </span>
            )}
          </div>
          
          <div className="bg-white dark:bg-gray-800 p-4 rounded-xl shadow-sm border border-gray-200 dark:border-gray-700 flex flex-wrap gap-4 items-end">
            <div className="flex-grow min-w-[200px]">
              <label className="block text-xs font-medium text-gray-500 dark:text-gray-400 mb-1">Search</label>
              <div className="relative">
                <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                  <Search className="h-4 w-4 text-gray-400" />
                </div>
                <input
                  type="text"
                  value={search}
                  onChange={(e) => setSearch(e.target.value)}
                  placeholder="Search schemes..."
                  className="pl-9 w-full rounded-lg border border-gray-300 dark:border-gray-600 bg-white dark:bg-gray-700 text-gray-900 dark:text-white py-2 focus:ring-green-500 focus:border-green-500"
                />
              </div>
            </div>
            
            <div className="w-full sm:w-auto min-w-[150px]">
              <label className="block text-xs font-medium text-gray-500 dark:text-gray-400 mb-1">Category</label>
              <div className="relative">
                <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                  <Filter className="h-4 w-4 text-gray-400" />
                </div>
                <select
                  value={category}
                  onChange={(e) => setCategory(e.target.value)}
                  className="pl-9 w-full rounded-lg border border-gray-300 dark:border-gray-600 bg-white dark:bg-gray-700 text-gray-900 dark:text-white py-2 focus:ring-green-500 focus:border-green-500 appearance-none"
                >
                  <option value="">All Categories</option>
                  {categories.map(cat => (
                    <option key={cat} value={cat}>{cat}</option>
                  ))}
                </select>
              </div>
            </div>

            <div className="w-full sm:w-auto min-w-[150px]">
              <label className="block text-xs font-medium text-gray-500 dark:text-gray-400 mb-1">State</label>
              <input
                type="text"
                value={stateFilter}
                onChange={(e) => setStateFilter(e.target.value)}
                placeholder="e.g. Central, Maharashtra"
                className="w-full rounded-lg border border-gray-300 dark:border-gray-600 bg-white dark:bg-gray-700 text-gray-900 dark:text-white py-2 px-3 focus:ring-green-500 focus:border-green-500"
              />
            </div>

            <div className="w-full sm:w-auto min-w-[150px]">
              <label className="block text-xs font-medium text-gray-500 dark:text-gray-400 mb-1">Ministry</label>
              <input
                type="text"
                value={ministryFilter}
                onChange={(e) => setMinistryFilter(e.target.value)}
                placeholder="e.g. Agriculture"
                className="w-full rounded-lg border border-gray-300 dark:border-gray-600 bg-white dark:bg-gray-700 text-gray-900 dark:text-white py-2 px-3 focus:ring-green-500 focus:border-green-500"
              />
            </div>

            <div className="w-full sm:w-auto min-w-[150px]">
              <label className="block text-xs font-medium text-gray-500 dark:text-gray-400 mb-1">Sort By</label>
              <select
                value={sortOption}
                onChange={(e) => setSortOption(e.target.value)}
                className="w-full rounded-lg border border-gray-300 dark:border-gray-600 bg-white dark:bg-gray-700 text-gray-900 dark:text-white py-2 px-3 focus:ring-green-500 focus:border-green-500 appearance-none"
              >
                <option value="newest">Newest</option>
                <option value="oldest">Oldest</option>
                <option value="alphabetical">Alphabetical</option>
              </select>
            </div>
            
            {(search || category || stateFilter || ministryFilter) && (
              <button 
                onClick={() => { setSearch(''); setCategory(''); setStateFilter(''); setMinistryFilter(''); }}
                className="text-sm text-green-600 hover:text-green-700 font-medium px-2 py-2"
              >
                Clear
              </button>
            )}
          </div>
        </div>

        {error && (
          <div className="bg-red-50 text-red-600 p-4 rounded-xl mb-6 flex items-center gap-2">
            <AlertCircle className="w-5 h-5" /> {error}
          </div>
        )}

        {loadingAll ? (
          <div className="flex justify-center py-20">
            <Loader2 className="w-8 h-8 animate-spin text-green-500" />
          </div>
        ) : allSchemes.length > 0 ? (
          <div className="space-y-6">
            <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
              {allSchemes.map(scheme => (
                <div key={`all-${scheme.schemeId}`} ref={el => schemeRefs.current[scheme.schemeId] = el}>
                  <SchemeCard
                    scheme={scheme}
                    recommended={false}
                    defaultExpanded={openSchemeId === scheme.schemeId}
                  />
                </div>
              ))}
            </div>

            {/* Pagination Controls */}
            {totalPages > 1 && (
              <div className="flex justify-center items-center gap-4 pt-8">
                <button 
                  disabled={page === 1}
                  onClick={() => setPage(p => p - 1)}
                  className="px-4 py-2 border border-gray-300 dark:border-gray-600 rounded-lg disabled:opacity-50 text-sm font-medium text-gray-700 dark:text-gray-300 hover:bg-gray-50 dark:hover:bg-gray-800 transition-colors"
                >
                  Previous
                </button>
                <span className="text-sm font-medium text-gray-600 dark:text-gray-400">
                  Page {page} of {totalPages}
                </span>
                <button 
                  disabled={page === totalPages}
                  onClick={() => setPage(p => p + 1)}
                  className="px-4 py-2 border border-gray-300 dark:border-gray-600 rounded-lg disabled:opacity-50 text-sm font-medium text-gray-700 dark:text-gray-300 hover:bg-gray-50 dark:hover:bg-gray-800 transition-colors"
                >
                  Next
                </button>
              </div>
            )}
          </div>
        ) : (
          <div className="text-center py-20 bg-gray-50 dark:bg-gray-800/50 rounded-2xl border border-gray-100 dark:border-gray-700">
            <Search className="w-12 h-12 text-gray-300 mx-auto mb-4" />
            <h3 className="text-lg font-medium text-gray-900 dark:text-white mb-1">No schemes found</h3>
            <p className="text-gray-500 dark:text-gray-400">Try adjusting your search or filters.</p>
          </div>
        )}
      </section>

    </div>
  );
};

export default GovernmentSchemes;
