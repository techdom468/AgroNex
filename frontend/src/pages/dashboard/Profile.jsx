import React, { useState, useContext, useEffect } from 'react';
import { AuthContext } from '../../context/AuthContext';
import { motion } from 'framer-motion';
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
      className={`fixed top-4 right-4 z-50 flex items-center gap-3 px-5 py-3.5 rounded-xl shadow-lg border text-sm font-medium max-w-sm ${
        type === 'success'
          ? 'bg-green-50 text-green-800 border-green-200 dark:bg-green-900/40 dark:text-green-300 dark:border-green-700'
          : 'bg-red-50 text-red-800 border-red-200 dark:bg-red-900/40 dark:text-red-300 dark:border-red-700'
      }`}
    >
      {type === 'success' ? <CheckCircle className="w-5 h-5 shrink-0" /> : <AlertCircle className="w-5 h-5 shrink-0" />}
      <span>{message}</span>
      <button onClick={onClose} className="ml-2 opacity-60 hover:opacity-100">
        <X className="w-4 h-4" />
      </button>
    </motion.div>
  );
};

// ─── Read-Only Field ─────────────────────────────────────────────────────────

const ReadField = ({ label, value, icon: Icon, placeholder = '—' }) => (
  <div>
    <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">{label}</label>
    <div className="relative">
      {Icon && (
        <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
          <Icon className="h-5 w-5 text-gray-400" />
        </div>
      )}
      <div className={`${Icon ? 'pl-10' : 'px-4'} block w-full rounded-xl border border-gray-200 dark:border-gray-600 bg-gray-50 dark:bg-gray-800/60 text-gray-700 dark:text-gray-300 py-2.5 text-sm`}>
        {value || <span className="text-gray-400 dark:text-gray-500">{placeholder}</span>}
      </div>
    </div>
  </div>
);

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

  // ─── Input class helper
  const inputClass = (fieldName) => {
    const base = 'block w-full rounded-xl border shadow-sm py-2.5 transition-colors duration-200 text-sm';
    const editable = 'bg-white dark:bg-gray-700 text-gray-900 dark:text-white focus:ring-green-500 focus:border-green-500 focus:outline-none';
    const readonly = 'bg-gray-50 dark:bg-gray-800/60 text-gray-700 dark:text-gray-300 cursor-default';
    const errorBorder = 'border-red-400 dark:border-red-500';
    const normalBorder = 'border-gray-300 dark:border-gray-600';

    return `${base} ${isEditing ? editable : readonly} ${errors[fieldName] ? errorBorder : normalBorder}`;
  };

  return (
    <div className="max-w-4xl mx-auto py-8 px-4 sm:px-6 lg:px-8">
      {/* Toast */}
      {toast && (
        <Toast
          type={toast.type}
          message={toast.message}
          onClose={() => setToast(null)}
        />
      )}

      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.5 }}
      >
        {/* Header */}
        <div className="mb-8 flex flex-col sm:flex-row sm:items-end sm:justify-between gap-4">
          <div>
            <h1 className="text-3xl font-bold text-gray-900 dark:text-white">Your Profile</h1>
            <p className="mt-2 text-sm text-gray-600 dark:text-gray-400">
              Update your farming details to get personalized scheme recommendations and tailored crop AI advice.
            </p>
          </div>

        </div>

        <div className="bg-white dark:bg-gray-800 shadow-xl rounded-2xl overflow-hidden border border-gray-100 dark:border-gray-700">
          <div className="p-8">
            <form onSubmit={handleSave} className="space-y-8" noValidate>

              {/* ── Profile Avatar (initials only) ── */}
              <div className="flex flex-col items-center gap-3 pb-2">
                <div className="w-20 h-20 rounded-full bg-gradient-to-br from-green-400 to-emerald-600 flex items-center justify-center shadow-md">
                  <span className="text-2xl font-bold text-white">
                    {formData.full_name ? formData.full_name.charAt(0).toUpperCase() : (user?.email?.charAt(0).toUpperCase() || 'F')}
                  </span>
                </div>
                <div className="text-center">
                  <p className="text-base font-semibold text-gray-900 dark:text-white">
                    {formData.full_name || user?.email || 'Farmer'}
                  </p>
                  <p className="text-sm text-gray-500 dark:text-gray-400">{user?.email}</p>
                </div>
              </div>

              {/* ── Section 1: Personal Details ── */}
              <div className="space-y-4">
                <h3 className="text-lg font-semibold text-gray-900 dark:text-white border-b border-gray-200 dark:border-gray-700 pb-2">
                  Personal Details
                </h3>

                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                  {/* Full Name */}
                  <div>
                    <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">
                      Full Name <span className="text-red-500">*</span>
                    </label>
                    <div className="relative">
                      <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                        <User className="h-5 w-5 text-gray-400" />
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

                  {/* Email — always read-only */}
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
                        className="pl-10 block w-full rounded-xl border border-gray-200 dark:border-gray-600 bg-gray-50 dark:bg-gray-800 text-gray-500 dark:text-gray-400 shadow-sm py-2.5 cursor-not-allowed text-sm"
                      />
                    </div>
                    <p className="mt-1 text-xs text-gray-500">Email cannot be changed</p>
                  </div>

                  {/* Mobile */}
                  <div>
                    <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">
                      Mobile Number <span className="text-red-500">*</span>
                    </label>
                    <div className="relative">
                      <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                        <Phone className="h-5 w-5 text-gray-400" />
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

              {/* ── Section 2: Farm Details ── */}
              <div className="space-y-4">
                <h3 className="text-lg font-semibold text-gray-900 dark:text-white border-b border-gray-200 dark:border-gray-700 pb-2">
                  Farm Details
                </h3>

                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                  {/* State */}
                  <div>
                    <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">
                      State <span className="text-red-500">*</span>
                    </label>
                    <div className="relative">
                      <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                        <MapPin className="h-5 w-5 text-gray-400" />
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

                  {/* District */}
                  <div>
                    <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">
                      District <span className="text-red-500">*</span>
                    </label>
                    <div className="relative">
                      <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                        <Navigation className="h-5 w-5 text-gray-400" />
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

                  {/* Main Crop — Searchable Dropdown */}
                  <div className="relative">
                    <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">
                      Main Crop <span className="text-red-500">*</span>
                    </label>
                    <div className="relative">
                      <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none z-10">
                        <Sprout className="h-5 w-5 text-gray-400" />
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
                        onBlur={() => setTimeout(() => setShowCropDropdown(false), 150)}
                        readOnly={!isEditing}
                        className={`pl-10 ${inputClass('main_crop')}`}
                        placeholder="Search crop..."
                      />
                      {/* Dropdown */}
                      {isEditing && showCropDropdown && filteredCrops.length > 0 && (
                        <ul className="absolute z-30 left-0 right-0 mt-1 bg-white dark:bg-gray-800 border border-gray-200 dark:border-gray-600 rounded-xl shadow-lg max-h-48 overflow-y-auto">
                          {filteredCrops.map(crop => (
                            <li
                              key={crop}
                              onMouseDown={() => {
                                setCropSearch(crop);
                                setFormData(prev => ({ ...prev, main_crop: crop }));
                                setShowCropDropdown(false);
                              }}
                              className={`px-4 py-2.5 text-sm cursor-pointer hover:bg-green-50 dark:hover:bg-green-900/30 text-gray-700 dark:text-gray-200 transition-colors ${
                                formData.main_crop === crop ? 'bg-green-50 dark:bg-green-900/20 font-medium text-green-700 dark:text-green-400' : ''
                              }`}
                            >
                              {crop}
                            </li>
                          ))}
                        </ul>
                      )}
                    </div>
                    {errors.main_crop && (
                      <p className="mt-1 text-xs text-red-500 flex items-center gap-1">
                        <AlertCircle className="w-3.5 h-3.5" /> {errors.main_crop}
                      </p>
                    )}
                  </div>

                  {/* Soil Type — Dropdown */}
                  <div>
                    <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">
                      Soil Type
                    </label>
                    <div className="relative">
                      <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                        <Layers className="h-5 w-5 text-gray-400" />
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
                        <div className="pl-10 block w-full rounded-xl border border-gray-200 dark:border-gray-600 bg-gray-50 dark:bg-gray-800/60 text-gray-700 dark:text-gray-300 py-2.5 text-sm">
                          {formData.soil_type || <span className="text-gray-400 dark:text-gray-500">—</span>}
                        </div>
                      )}
                    </div>
                  </div>

                  {/* Farm Size */}
                  <div>
                    <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">
                      Farm Size (acres)
                    </label>
                    <div className="relative">
                      <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                        <Maximize className="h-5 w-5 text-gray-400" />
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

              {/* ── Action Buttons ── */}
              <div className="pt-2 flex flex-wrap justify-end gap-3">
                {isEditing ? (
                  <>
                    {/* Cancel — only shown if profile was already saved */}
                    {isProfileComplete && (
                      <button
                        type="button"
                        onClick={handleCancel}
                        className="inline-flex items-center gap-2 px-5 py-2.5 rounded-xl border border-gray-300 dark:border-gray-600 text-sm font-medium text-gray-700 dark:text-gray-300 bg-white dark:bg-gray-800 hover:bg-gray-50 dark:hover:bg-gray-700 shadow-sm transition-colors"
                      >
                        <X className="w-4 h-4" />
                        Cancel
                      </button>
                    )}

                    {/* Save / Save Changes */}
                    <button
                      type="submit"
                      disabled={isSaving}
                      className="inline-flex items-center gap-2 px-6 py-2.5 rounded-xl text-sm font-medium text-white bg-green-600 hover:bg-green-700 focus:outline-none focus:ring-2 focus:ring-green-500 focus:ring-offset-2 shadow-sm transition-colors disabled:opacity-70 disabled:cursor-not-allowed"
                    >
                      {isSaving ? (
                        <>
                          <Loader2 className="w-4 h-4 animate-spin" />
                          Saving...
                        </>
                      ) : (
                        <>
                          <Save className="w-4 h-4" />
                          {isProfileComplete ? 'Save Changes' : 'Save Profile'}
                        </>
                      )}
                    </button>
                  </>
                ) : (
                  /* Read-only mode → Edit Profile button in footer */
                  <button
                    type="button"
                    onClick={() => setIsEditing(true)}
                    className="inline-flex items-center gap-2 px-6 py-2.5 rounded-xl text-sm font-medium text-white bg-green-600 hover:bg-green-700 focus:outline-none focus:ring-2 focus:ring-green-500 focus:ring-offset-2 shadow-sm transition-colors"
                  >
                    <Edit3 className="w-4 h-4" />
                    Edit Profile
                  </button>
                )}
              </div>

            </form>
          </div>
        </div>
      </motion.div>
    </div>
  );
};

export default Profile;
