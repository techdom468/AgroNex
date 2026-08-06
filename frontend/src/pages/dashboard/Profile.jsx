import React, { useState, useContext, useEffect } from 'react';
import { AuthContext } from '../../context/AuthContext';
import { motion, AnimatePresence } from 'framer-motion';
import {
  User, Mail, Phone, MapPin, Navigation, Sprout, Layers,
  Maximize, Save, AlertCircle, CheckCircle, Edit3, X, Loader2
} from 'lucide-react';

// ─── Constants ──────────────────────────────────────────────────────────────

const SOIL_TYPES = [
  'Black Soil',
  'Red Soil',
  'Clay Soil',
  'Loamy Soil',
  'Sandy Soil',
];

const CROPS = [
  'Cotton', 'Wheat', 'Rice', 'Groundnut', 'Tomato',
  'Potato', 'Maize', 'Sugarcane', 'Onion', 'Soybean',
  'Bajra', 'Jowar', 'Pulses', 'Mustard', 'Sunflower', 'Other',
];




// ─── Toast Component ─────────────────────────────────────────────────────────

const Toast = ({ type, message, onClose }) => {
  useEffect(() => {
    const t = setTimeout(onClose, 4000);
    return () => clearTimeout(t);
  }, [onClose]);

  return (
    <motion.div
      initial={{ opacity: 0, y: -16 }}
      animate={{ opacity: 1, y: 0 }}
      exit={{ opacity: 0, y: -16 }}
      className={`fixed top-4 right-4 z-50 flex items-center gap-3 px-5 py-3.5 rounded-xl shadow-lg border text-sm font-medium max-w-sm ${type === 'success'
          ? 'bg-green-50 text-green-800 border-green-200 dark:bg-green-900/40 dark:text-green-300 dark:border-green-700'
          : 'bg-red-50 text-red-800 border-red-200 dark:bg-red-900/40 dark:text-red-300 dark:border-red-700'
        }`}
    >
      {type === 'success' ? <CheckCircle className="w-5 h-5 shrink-0" /> : <AlertCircle className="w-5 h-5 shrink-0" />}
      <span>{message}</span>
      <button type="button" onClick={onClose} className="ml-2 opacity-60 hover:opacity-100">
        <X className="w-4 h-4" />
      </button>
    </motion.div>
  );
};


// ─── Main Profile Component ──────────────────────────────────────────────────

const Profile = () => {
  const { user, updateProfile } = useContext(AuthContext);

  // ── Form state
  const [formData, setFormData] = useState({
    full_name: '',
    mobile: '',
    state: '',
    district: '',
    main_crop: '',
    soil_type: '',
    farm_size: '',

  });

  // ── Saved snapshot for cancel
  const [savedData, setSavedData] = useState(null);

  // ── Editing mode
  const [isEditing, setIsEditing] = useState(false);

  // ── Profile completeness (determines initial button label)
  const [isProfileComplete, setIsProfileComplete] = useState(false);

  // ── Loading states
  const [isSaving, setIsSaving] = useState(false);

  // ── Toast
  const [toast, setToast] = useState(null);

  // ── Validation errors
  const [errors, setErrors] = useState({});

  // ── Crop search state
  const [cropSearch, setCropSearch] = useState('');
  const [showCropDropdown, setShowCropDropdown] = useState(false);

  // ─── Init from context user
  useEffect(() => {
    if (user) {
      const data = {
        full_name: user.full_name || '',
        mobile: user.mobile || '',
        state: user.state || '',
        district: user.district || '',
        main_crop: user.main_crop || '',
        soil_type: user.soil_type || '',
        farm_size: user.farm_size || '',

      };
      setFormData(data);
      setSavedData(data);
      setCropSearch(user.main_crop || '');

      // Profile is complete if at least name + state + district + main crop filled
      const complete = !!(user.full_name && user.state && user.district && user.main_crop);
      setIsProfileComplete(complete);

      // New user → start in edit mode; returning user → read-only
      setIsEditing(!complete);
    }
  }, [user]);

  // ─── Validation
  const validate = () => {
    const e = {};
    if (!formData.full_name.trim()) e.full_name = 'Name is required.';
    if (!formData.mobile.trim()) e.mobile = 'Mobile number is required.';
    else if (!/^\d{10}$/.test(formData.mobile.trim())) e.mobile = 'Enter a valid 10-digit mobile number.';
    if (!formData.state.trim()) e.state = 'State is required.';
    if (!formData.district.trim()) e.district = 'District is required.';
    if (!formData.main_crop.trim()) e.main_crop = 'Main crop is required.';
    if (formData.farm_size && (isNaN(parseFloat(formData.farm_size)) || parseFloat(formData.farm_size) < 0)) {
      e.farm_size = 'Farm size must be a positive number.';
    }
    setErrors(e);
    return Object.keys(e).length === 0;
  };

  // ─── Input change
  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData(prev => ({ ...prev, [name]: value }));
    if (errors[name]) setErrors(prev => ({ ...prev, [name]: '' }));
  };


  const handleSave = async (e) => {
    e.preventDefault();
    if (!validate()) {
      showToast('error', 'Please fix the errors before saving.');
      return;
    }

    setIsSaving(true);
    const payload = {
      ...formData,
      farm_size: formData.farm_size ? parseFloat(formData.farm_size) : null,
    };

    const res = await updateProfile(payload);
    setIsSaving(false);

    if (res.success) {
      setSavedData(formData);
      setIsProfileComplete(true);
      setIsEditing(false);
      showToast('success', 'Profile saved successfully!');
    } else {
      showToast('error', res.error || 'Failed to save profile.');
    }
  };

  // ─── Cancel editing
  const handleCancel = () => {
    if (savedData) {
      setFormData(savedData);
      setCropSearch(savedData.main_crop || '');
    }
    setErrors({});
    setIsEditing(false);
  };

  // ─── Toast helper
  const showToast = (type, message) => setToast({ type, message });

  // ─── Filtered crops for searchable dropdown
  const filteredCrops = CROPS.filter(c =>
    c.toLowerCase().includes(cropSearch.toLowerCase())
  );

  const inputClass = (fieldName) => {
    const base = 'block w-full rounded-xl border shadow-sm py-2.5 transition-all duration-200 text-sm';
    const editable = 'bg-white dark:bg-gray-700 border-gray-300 dark:border-gray-600 focus:ring-2 focus:ring-primary-500/20 focus:border-primary-500 outline-none';
    const readonly = 'bg-gray-50/50 dark:bg-gray-800/30 border-gray-100 dark:border-gray-700 cursor-not-allowed text-gray-500';
    const errorBorder = 'border-red-400 dark:border-red-500';
    return `${base} ${isEditing ? editable : readonly} ${errors[fieldName] ? errorBorder : ''}`;
  };

  return (
    <div className="max-w-6xl mx-auto py-8 px-4 sm:px-6 lg:px-8 space-y-8 pb-20">
      <AnimatePresence>
        {toast && (
          <Toast
            type={toast.type}
            message={toast.message}
            onClose={() => setToast(null)}
          />
        )}
      </AnimatePresence>

      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.5 }}
        className="relative bg-white dark:bg-gray-800 rounded-3xl shadow-sm border border-gray-100 dark:border-gray-700 overflow-hidden"
      >
        <div className="h-20 md:h-28 bg-gradient-to-r from-primary-500 to-secondary-500 relative">
          <div className="absolute inset-0 bg-black/10"></div>
          <div className="absolute inset-0 bg-[url('https://www.transparenttextures.com/patterns/carbon-fibre.png')] opacity-20 mix-blend-overlay"></div>
        </div>
        <div className="px-6 sm:px-10 pb-8 flex flex-col sm:flex-row items-center sm:items-end gap-6 -mt-12 sm:-mt-16 relative z-10">
          <div className="w-24 h-24 sm:w-32 sm:h-32 rounded-full border-4 border-white dark:border-gray-800 bg-gradient-to-br from-green-400 to-emerald-600 flex items-center justify-center shadow-lg shrink-0">
            <span className="text-4xl sm:text-5xl font-bold text-white">
              {formData.full_name ? formData.full_name.charAt(0).toUpperCase() : (user?.email?.charAt(0).toUpperCase() || 'F')}
            </span>
          </div>
          <div className="text-center sm:text-left flex-1 mt-4 sm:mt-0">
            <h1 className="text-3xl sm:text-4xl font-bold text-gray-900 dark:text-white">
              {formData.full_name || 'Farmer Profile'}
            </h1>
            <p className="text-primary-600 dark:text-primary-400 font-medium mt-1">{user?.email}</p>
          </div>

          <div className="shrink-0 flex gap-3 mt-4 sm:mt-0">
            {!isEditing && (
              <button
                type="button"
                onClick={() => setIsEditing(true)}
                className="inline-flex items-center gap-2 px-6 py-3 rounded-xl text-sm font-semibold text-white bg-primary-600 hover:bg-primary-700 shadow-md transition-all hover:-translate-y-0.5 hover:shadow-lg"
              >
                <Edit3 className="w-4 h-4" />
                Edit Profile
              </button>
            )}
          </div>
        </div>
      </motion.div>

      <form onSubmit={handleSave} noValidate>
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">

          <motion.div
            initial={{ opacity: 0, x: -20 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ duration: 0.5, delay: 0.1 }}
            className="lg:col-span-1"
          >
            <div className="bg-white dark:bg-gray-800 rounded-3xl shadow-sm border border-gray-100 dark:border-gray-700 p-6 sm:p-8 sticky top-24">
              <h3 className="text-xl font-bold text-gray-900 dark:text-white mb-6 flex items-center gap-2 border-b border-gray-100 dark:border-gray-700 pb-4">
                <User className="text-primary-500" /> Personal Details
              </h3>

              <div className="space-y-6">
                <div>
                  <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">
                    Full Name <span className="text-red-500">*</span>
                  </label>
                  <div className="relative group">
                    <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none transition-colors group-focus-within:text-primary-500">
                      <User className={`h-5 w-5 ${isEditing ? 'text-gray-400 group-focus-within:text-primary-500' : 'text-gray-400'}`} />
                    </div>
                    <input
                      type="text"
                      name="full_name"
                      value={formData.full_name}
                      onChange={handleChange}
                      readOnly={!isEditing}
                      className={`pl-10 ${inputClass('full_name')}`}
                      placeholder="John Doe"
                    />
                  </div>
                  {errors.full_name && (
                    <p className="mt-1 text-xs text-red-500 flex items-center gap-1">
                      <AlertCircle className="w-3.5 h-3.5" /> {errors.full_name}
                    </p>
                  )}
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">
                    Email Address
                  </label>
                  <div className="relative">
                    <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                      <Mail className="h-5 w-5 text-gray-400" />
                    </div>
                    <input
                      type="email"
                      value={user?.email || ''}
                      disabled
                      className="pl-10 block w-full rounded-xl border border-gray-100 dark:border-gray-700 bg-gray-50/50 dark:bg-gray-800/30 text-gray-500 py-2.5 cursor-not-allowed text-sm"
                    />
                  </div>
                  <p className="mt-1 text-xs text-gray-400">Email cannot be changed.</p>
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">
                    Mobile Number <span className="text-red-500">*</span>
                  </label>
                  <div className="relative group">
                    <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none transition-colors group-focus-within:text-primary-500">
                      <Phone className={`h-5 w-5 ${isEditing ? 'text-gray-400 group-focus-within:text-primary-500' : 'text-gray-400'}`} />
                    </div>
                    <input
                      type="tel"
                      name="mobile"
                      value={formData.mobile}
                      onChange={handleChange}
                      readOnly={!isEditing}
                      className={`pl-10 ${inputClass('mobile')}`}
                      placeholder="9876543210"
                      maxLength={10}
                    />
                  </div>
                  {errors.mobile && (
                    <p className="mt-1 text-xs text-red-500 flex items-center gap-1">
                      <AlertCircle className="w-3.5 h-3.5" /> {errors.mobile}
                    </p>
                  )}
                </div>
              </div>
            </div>
          </motion.div>

          <motion.div
            initial={{ opacity: 0, x: 20 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ duration: 0.5, delay: 0.2 }}
            className="lg:col-span-2 space-y-6"
          >
            <div className="bg-white dark:bg-gray-800 rounded-3xl shadow-sm border border-gray-100 dark:border-gray-700 p-6 sm:p-8">
              <h3 className="text-xl font-bold text-gray-900 dark:text-white mb-6 flex items-center gap-2 border-b border-gray-100 dark:border-gray-700 pb-4">
                <Sprout className="text-secondary-500" /> Farm Details
              </h3>

              <div className="grid grid-cols-1 sm:grid-cols-2 gap-x-6 gap-y-6">
                <div>
                  <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">
                    State <span className="text-red-500">*</span>
                  </label>
                  <div className="relative group">
                    <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                      <MapPin className={`h-5 w-5 ${isEditing ? 'text-gray-400 group-focus-within:text-primary-500' : 'text-gray-400'}`} />
                    </div>
                    <input
                      type="text"
                      name="state"
                      value={formData.state}
                      onChange={handleChange}
                      readOnly={!isEditing}
                      className={`pl-10 ${inputClass('state')}`}
                      placeholder="e.g. Gujarat"
                    />
                  </div>
                  {errors.state && (
                    <p className="mt-1 text-xs text-red-500 flex items-center gap-1">
                      <AlertCircle className="w-3.5 h-3.5" /> {errors.state}
                    </p>
                  )}
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">
                    District <span className="text-red-500">*</span>
                  </label>
                  <div className="relative group">
                    <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                      <Navigation className={`h-5 w-5 ${isEditing ? 'text-gray-400 group-focus-within:text-primary-500' : 'text-gray-400'}`} />
                    </div>
                    <input
                      type="text"
                      name="district"
                      value={formData.district}
                      onChange={handleChange}
                      readOnly={!isEditing}
                      className={`pl-10 ${inputClass('district')}`}
                      placeholder="e.g. Rajkot"
                    />
                  </div>
                  {errors.district && (
                    <p className="mt-1 text-xs text-red-500 flex items-center gap-1">
                      <AlertCircle className="w-3.5 h-3.5" /> {errors.district}
                    </p>
                  )}
                </div>

                <div className="relative">
                  <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">
                    Main Crop <span className="text-red-500">*</span>
                  </label>
                  <div className="relative group">
                    <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none z-10">
                      <Sprout className={`h-5 w-5 ${isEditing ? 'text-gray-400 group-focus-within:text-primary-500' : 'text-gray-400'}`} />
                    </div>
                    <input
                      type="text"
                      value={cropSearch}
                      onChange={(e) => {
                        if (!isEditing) return;
                        setCropSearch(e.target.value);
                        setFormData(prev => ({ ...prev, main_crop: e.target.value }));
                        setShowCropDropdown(true);
                        if (errors.main_crop) setErrors(prev => ({ ...prev, main_crop: '' }));
                      }}
                      onFocus={() => isEditing && setShowCropDropdown(true)}
                      onBlur={() => setTimeout(() => setShowCropDropdown(false), 200)}
                      readOnly={!isEditing}
                      className={`pl-10 ${inputClass('main_crop')}`}
                      placeholder="Search crop..."
                    />
                    {isEditing && showCropDropdown && filteredCrops.length > 0 && (
                      <motion.ul
                        initial={{ opacity: 0, y: -10 }} animate={{ opacity: 1, y: 0 }}
                        className="absolute z-30 left-0 right-0 mt-2 bg-white dark:bg-gray-800 border border-gray-100 dark:border-gray-700 rounded-xl shadow-xl max-h-48 overflow-y-auto"
                      >
                        {filteredCrops.map(crop => (
                          <li
                            key={crop}
                            onMouseDown={() => {
                              setCropSearch(crop);
                              setFormData(prev => ({ ...prev, main_crop: crop }));
                              setShowCropDropdown(false);
                            }}
                            className={`px-4 py-2.5 text-sm cursor-pointer hover:bg-primary-50 dark:hover:bg-primary-900/30 text-gray-700 dark:text-gray-200 transition-colors ${formData.main_crop === crop ? 'bg-primary-50 dark:bg-primary-900/20 font-medium text-primary-700 dark:text-primary-400' : ''}`}
                          >
                            {crop}
                          </li>
                        ))}
                      </motion.ul>
                    )}
                  </div>
                  {errors.main_crop && (
                    <p className="mt-1 text-xs text-red-500 flex items-center gap-1">
                      <AlertCircle className="w-3.5 h-3.5" /> {errors.main_crop}
                    </p>
                  )}
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">
                    Soil Type
                  </label>
                  <div className="relative group">
                    <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                      <Layers className={`h-5 w-5 ${isEditing ? 'text-gray-400 group-focus-within:text-primary-500' : 'text-gray-400'}`} />
                    </div>
                    {isEditing ? (
                      <select
                        name="soil_type"
                        value={formData.soil_type}
                        onChange={handleChange}
                        className={`pl-10 appearance-none ${inputClass('soil_type')}`}
                      >
                        <option value="">Select soil type</option>
                        {SOIL_TYPES.map(s => (
                          <option key={s} value={s}>{s}</option>
                        ))}
                      </select>
                    ) : (
                      <div className="pl-10 block w-full rounded-xl border border-gray-100 dark:border-gray-700 bg-gray-50/50 dark:bg-gray-800/30 text-gray-700 dark:text-gray-300 py-2.5 text-sm">
                        {formData.soil_type || <span className="text-gray-400">—</span>}
                      </div>
                    )}
                  </div>
                </div>



                <div>
                  <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">
                    Farm Size (acres)
                  </label>
                  <div className="relative group">
                    <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                      <Maximize className={`h-5 w-5 ${isEditing ? 'text-gray-400 group-focus-within:text-primary-500' : 'text-gray-400'}`} />
                    </div>
                    <input
                      type="number"
                      step="0.1"
                      min="0"
                      name="farm_size"
                      value={formData.farm_size}
                      onChange={handleChange}
                      readOnly={!isEditing}
                      className={`pl-10 ${inputClass('farm_size')}`}
                      placeholder="e.g. 5.5"
                    />
                  </div>
                  {errors.farm_size && (
                    <p className="mt-1 text-xs text-red-500 flex items-center gap-1">
                      <AlertCircle className="w-3.5 h-3.5" /> {errors.farm_size}
                    </p>
                  )}
                </div>

              </div>
            </div>

            <AnimatePresence>
              {isEditing && (
                <motion.div
                  initial={{ opacity: 0, y: 20 }}
                  animate={{ opacity: 1, y: 0 }}
                  exit={{ opacity: 0, y: 20 }}
                  className="bg-white dark:bg-gray-800 rounded-2xl shadow-xl border border-primary-100 dark:border-primary-900/50 p-5 flex flex-wrap justify-end items-center gap-4"
                >
                  {isProfileComplete && (
                    <button
                      type="button"
                      onClick={handleCancel}
                      className="px-6 py-2.5 rounded-xl font-medium text-gray-600 dark:text-gray-300 hover:bg-gray-100 dark:hover:bg-gray-700 transition-colors"
                    >
                      Cancel
                    </button>
                  )}
                  <button
                    type="submit"
                    disabled={isSaving}
                    className="inline-flex items-center gap-2 px-8 py-2.5 rounded-xl text-sm font-semibold text-white bg-gradient-to-r from-primary-500 to-secondary-500 hover:from-primary-600 hover:to-secondary-600 shadow-md transition-all hover:shadow-lg disabled:opacity-70 hover:-translate-y-0.5"
                  >
                    {isSaving ? <Loader2 className="w-5 h-5 animate-spin" /> : <Save className="w-5 h-5" />}
                    {isProfileComplete ? 'Save Changes' : 'Save Profile'}
                  </button>
                </motion.div>
              )}
            </AnimatePresence>
          </motion.div>

        </div>
      </form>
    </div>
  );
};

export default Profile;
