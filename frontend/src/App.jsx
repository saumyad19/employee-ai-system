import React from 'react';
import { BrowserRouter, Routes, Route, Navigate } from 'react-router-dom';
import { Toaster } from 'react-hot-toast';
import { AuthProvider, useAuth } from './context/AuthContext';

import Navbar from './components/Navbar';
import Login from './pages/Login';
import Signup from './pages/Signup';
import Dashboard from './pages/Dashboard';
import Employees from './pages/Employees';
import AddEmployee from './pages/AddEmployee';
import AIAnalytics from './pages/AIAnalytics';

// Protected Route wrapper
const ProtectedRoute = ({ children }) => {
  const { user, loading } = useAuth();
  if (loading) return <div className="loading"><div className="spinner"></div></div>;
  return user ? children : <Navigate to="/login" />;
};

// Layout with Navbar
const Layout = ({ children }) => (
  <>
    <Navbar />
    <main>{children}</main>
  </>
);

function AppRoutes() {
  const { user } = useAuth();
  return (
    <Routes>
      <Route path="/login" element={user ? <Navigate to="/dashboard" /> : <Login />} />
      <Route path="/signup" element={user ? <Navigate to="/dashboard" /> : <Signup />} />
      <Route path="/dashboard" element={
        <ProtectedRoute>
          <Layout><Dashboard /></Layout>
        </ProtectedRoute>
      } />
      <Route path="/employees" element={
        <ProtectedRoute>
          <Layout><Employees /></Layout>
        </ProtectedRoute>
      } />
      <Route path="/add-employee" element={
        <ProtectedRoute>
          <Layout><AddEmployee /></Layout>
        </ProtectedRoute>
      } />
      <Route path="/ai-analytics" element={
        <ProtectedRoute>
          <Layout><AIAnalytics /></Layout>
        </ProtectedRoute>
      } />
      <Route path="*" element={<Navigate to="/dashboard" />} />
    </Routes>
  );
}

function App() {
  return (
    <AuthProvider>
      <BrowserRouter>
        <AppRoutes />
        <Toaster
          position="top-right"
          toastOptions={{
            style: {
              background: '#1a2235',
              color: '#f1f5f9',
              border: '1px solid #2d3748',
              fontFamily: 'Space Grotesk, sans-serif',
              fontSize: '14px',
            },
            success: { iconTheme: { primary: '#10b981', secondary: '#fff' } },
            error: { iconTheme: { primary: '#ef4444', secondary: '#fff' } },
          }}
        />
      </BrowserRouter>
    </AuthProvider>
  );
}

export default App;
