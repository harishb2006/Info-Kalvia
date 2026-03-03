import React from 'react'
import { BrowserRouter, Routes, Route, Navigate } from 'react-router-dom'
import Dash from './pages/DashBoard'
import Login from './pages/Login'
import Signup from './pages/Signup'
import ProtectedRoute from './Components/ProtectedRoute'
import PublicRoute from './Components/PublicRoute'
import { useAuth } from './hooks/useAuth'

const RootRedirect = () => {
  const { isAuthenticated, loading, error } = useAuth();

  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-slate-50">
        <div className="text-center">
          <div className="w-16 h-16 border-4 border-purple-500 border-t-transparent rounded-full animate-spin mx-auto mb-4"></div>
          <p className="text-slate-600">Loading...</p>
          {error && (
            <div className="mt-4">
              <p className="text-amber-600 text-sm mb-2">{error}</p>
              <button 
                onClick={() => window.location.reload()} 
                className="px-4 py-2 bg-purple-500 text-white rounded hover:bg-purple-600"
              >
                Refresh Page
              </button>
            </div>
          )}
        </div>
      </div>
    );
  }

  return <Navigate to={isAuthenticated ? "/dash" : "/login"} replace />;
};

const App = () => {
  return (
    <BrowserRouter>
      <Routes>
        <Route path="/" element={<RootRedirect />} />
        <Route path="/login" element={<PublicRoute><Login /></PublicRoute>} />
        <Route path="/signup" element={<PublicRoute><Signup /></PublicRoute>} />
        <Route path="/dash" element={<ProtectedRoute><Dash /></ProtectedRoute>} />
      </Routes>
    </BrowserRouter>
  )
}

export default App
