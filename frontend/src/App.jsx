import React from 'react';
import { BrowserRouter as Router, Routes, Route, Navigate } from 'react-router-dom';
import { AuthProvider, AuthContext } from './context/AuthContext';
import Navbar from './layouts/Navbar';
import Footer from './layouts/Footer';
import DashboardLayout from './layouts/DashboardLayout';

// Pages
import Home from './pages/Home';
import About from './pages/About';
import Contact from './pages/Contact';
import Login from './pages/Login';
import Register from './pages/Register';
import ForgotPassword from './pages/ForgotPassword';
import ResetPassword from './pages/ResetPassword';
import ChatPage from './pages/ChatPage';
import DashboardHome from './pages/dashboard/DashboardHome';
import CropRecommendation from './pages/dashboard/CropRecommendation';
import DiseaseDetection from './pages/dashboard/DiseaseDetection';
import PredictionHistory from './pages/dashboard/PredictionHistory';

import WeatherDashboard from './pages/dashboard/WeatherDashboard';
import GovernmentSchemes from './pages/dashboard/GovernmentSchemes';
import Profile from './pages/dashboard/Profile';

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
            <Route path="/about" element={<Navbar />} />
            <Route path="/contact" element={<Navbar />} />
            <Route path="/login" element={<Navbar />} />
            <Route path="/register" element={<Navbar />} />
            <Route path="/forgot-password" element={<Navbar />} />
            <Route path="/reset-password" element={<Navbar />} />
          </Routes>

          <main className="flex-grow">
            <Routes>
              <Route path="/" element={<Home />} />
              <Route path="/about" element={<About />} />
              <Route path="/contact" element={<Contact />} />
              <Route path="/login" element={<Login />} />
              <Route path="/register" element={<Register />} />
              <Route path="/forgot-password" element={<ForgotPassword />} />
              <Route path="/reset-password" element={<ResetPassword />} />
              
              {/* AI Chat Route */}
              <Route path="/chat" element={
                <ProtectedRoute>
                  <ChatPage />
                </ProtectedRoute>
              } />

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
                <Route path="schemes" element={<GovernmentSchemes />} />
                <Route path="profile" element={<Profile />} />
                <Route path="chat" element={<ChatPage />} />
                <Route path="chatbot" element={<ChatPage />} />
                <Route path="*" element={<div className="p-8"><h1 className="text-2xl font-bold dark:text-white">Page under construction</h1></div>} />
              </Route>
            </Routes>
          </main>

          <Routes>
            <Route path="/" element={<Footer />} />
            <Route path="/about" element={<Footer />} />
            <Route path="/contact" element={<Footer />} />
            <Route path="/login" element={<Footer />} />
            <Route path="/register" element={<Footer />} />
            <Route path="/forgot-password" element={<Footer />} />
            <Route path="/reset-password" element={<Footer />} />
          </Routes>
        </div>
      </Router>
    </AuthProvider>
  );
}

export default App;
