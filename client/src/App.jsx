import React from 'react'
import { BrowserRouter, Routes, Route, Navigate } from 'react-router-dom'
import Dash from './pages/DashBoard'
import Login from './pages/Login'
import Signup from './pages/Signup'

const App = () => {
  return (
    <BrowserRouter>
      <Routes>
        <Route path="/" element={<Navigate to="/login" replace />} />
        <Route path="/login" element={<Login />} />
        <Route path="/signup" element={<Signup />} />
        <Route path="/dash" element={<Dash />} />
      </Routes>
    </BrowserRouter>
  )
}

export default App
