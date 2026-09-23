import React from 'react';
import { BrowserRouter, Routes, Route, Navigate } from 'react-router-dom';
import { AuthProvider, useAuth } from './context/AuthContext';
import LandingPage from './pages/LandingPage';
import Login from './pages/Login';
import Register from './pages/Register';
import ForgotPassword from './pages/ForgotPassword';
import ResetPassword from './pages/ResetPassword';
import OTPVerify from './pages/OTPVerify';
import Wizard from './pages/Wizard';
import DeviceManagement from './pages/DeviceManagement';
import SimulationEngine from './pages/SimulationEngine';
import Analytics from './pages/Analytics';

const ProtectedRoute: React.FC<{ children: React.ReactNode; allowedRoles?: UserRole[] }> = ({ children, allowedRoles }) => {
  const { isAuthenticated, user, hasRole } = useAuth();
  
  if (!isAuthenticated) {
    return <Navigate to="/login" replace />;
  }

  if (allowedRoles && !hasRole(allowedRoles)) {
    return (
      <div style={{ padding: '40px', textAlign: 'center', color: '#e74c3c' }}>
        <h2>403 - Access Denied</h2>
        <p>Your role ({user?.role}) does not have permission to access this resource.</p>
        <button onClick={() => window.history.back()} style={{ marginTop: '16px', padding: '10px 20px', background: '#2ecc71', border: 'none', borderRadius: '8px', cursor: 'pointer' }}>
          Go Back
        </button>
      </div>
    );
  }

  return <>{children}</>;
};

export default function App() {
  return (
    <AuthProvider>
      <BrowserRouter>
        <Routes>
          <Route path="/" element={<LandingPage />} />
          <Route path="/login" element={<Login />} />
          <Route path="/register" element={<Register />} />
          <Route path="/forgot-password" element={<ForgotPassword />} />
          <Route path="/reset-password" element={<ResetPassword />} />
          <Route path="/otp-verify" element={<OTPVerify />} />
          
          <Route 
            path="/wizard" 
            element={
              <ProtectedRoute>
                <Wizard />
              </ProtectedRoute>
            } 
          />

          <Route 
            path="/devices" 
            element={
              <ProtectedRoute>
                <DeviceManagement />
              </ProtectedRoute>
            } 
          />

          <Route 
            path="/simulation" 
            element={
              <ProtectedRoute>
                <SimulationEngine />
              </ProtectedRoute>
            } 
          />

          <Route 
            path="/analytics" 
            element={
              <ProtectedRoute>
                <Analytics />
              </ProtectedRoute>
            } 
          />
          
          <Route 
            path="/dashboard" 
            element={
              <ProtectedRoute>
                <MainDashboard />
              </ProtectedRoute>
            } 
          />



          <Route path="*" element={<Navigate to="/" replace />} />
        </Routes>
      </BrowserRouter>
    </AuthProvider>
  );
}
