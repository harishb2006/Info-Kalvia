import { StrictMode } from 'react'
import { createRoot } from 'react-dom/client'
import './index.css'
import App from './App.jsx'

// Remove StrictMode in production to prevent double API calls
createRoot(document.getElementById('root')).render(
  <App />
)
