import { StrictMode } from 'react'
import { createRoot } from 'react-dom/client'
import './index.css'
import App from './App.tsx'

const redirect = sessionStorage.getItem('spa:redirect')
if (redirect) {
  sessionStorage.removeItem('spa:redirect')
  window.history.replaceState(null, '', redirect)
}

createRoot(document.getElementById('root')!).render(
  <StrictMode>
    <App />
  </StrictMode>,
)
