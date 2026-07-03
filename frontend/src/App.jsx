import React from 'react';
import { BrowserRouter as Router, Routes, Route, Navigate } from 'react-router-dom';
import { AuthProvider, AuthContext } from './context/AuthContext';
import Navbar from './layouts/Navbar';
import Footer from './layouts/Footer';
import DashboardLayout from './layouts/DashboardLayout';

// Pages
import Home from './pages/Home';
import Login from './pages/Login';
import Register from './pages/Register';
import DashboardHome from './pages/dashboard/DashboardHome';
import CropRecommendation from './pages/dashboard/CropRecommendation';
import DiseaseDetection from './pages/dashboard/DiseaseDetection';
import PredictionHistory from './pages/dashboard/PredictionHistory';

import WeatherDashboard from './pages/dashboard/WeatherDashboard';
import MarketIntelligence from './pages/dashboard/MarketIntelligence';
import GovernmentSchemes from './pages/dashboard/GovernmentSchemes';

// Protected Route Component
const ProtectedRoute = ({ children }) => {
  return (
    <AuthContext.Consumer>
      {({ user, loading }) => {
        if (loading) return <div className="min-h-screen flex items-center justify-center">Loading...</div>;
        if (!user) return <Navigate to="/login" replace />;
        return children;
      }}
    </AuthContext.Consumer>
  );
};

// Removed Temp Dashboard Placeholder

function App() {
  return (
    <AuthProvider>
      <Router>
        <div className="flex flex-col min-h-screen">
          <Routes>
            <Route path="/" element={<Navbar />} />
            <Route path="/login" element={<Navbar />} />
            <Route path="/register" element={<Navbar />} />
          </Routes>

          <main className="flex-grow">
            <Routes>
              <Route path="/" element={<Home />} />
              <Route path="/login" element={<Login />} />
              <Route path="/register" element={<Register />} />

              {/* Protected Dashboard Routes */}
              <Route
                path="/dashboard"
                element={
                  <ProtectedRoute>
                    <DashboardLayout />
                  </ProtectedRoute>
                }
              >
                <Route index element={<DashboardHome />} />
                <Route path="crop-recommendation" element={<CropRecommendation />} />
                <Route path="disease-ai" element={<DiseaseDetection />} />
                <Route path="disease-history" element={<PredictionHistory />} />
                <Route path="weather" element={<WeatherDashboard />} />
                <Route path="market" element={<MarketIntelligence />} />
                <Route path="schemes" element={<GovernmentSchemes />} />
                <Route path="profile" element={<div className="p-8"><h1 className="text-2xl font-bold dark:text-white">Profile Page (Coming Soon)</h1></div>} />
                <Route path="*" element={<div className="p-8"><h1 className="text-2xl font-bold dark:text-white">Page under construction</h1></div>} />
              </Route>
            </Routes>
          </main>

          <Routes>
            <Route path="/" element={<Footer />} />
            <Route path="/login" element={<Footer />} />
            <Route path="/register" element={<Footer />} />
          </Routes>
        </div>
      </Router>
    </AuthProvider>
  );
}

export default App;
