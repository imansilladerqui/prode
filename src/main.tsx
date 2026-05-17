import { StrictMode } from 'react'
import { createRoot } from 'react-dom/client'
import { getStoredLocale } from './i18n/locale'
import './index.css'
import App from './App.tsx'

document.documentElement.lang = getStoredLocale()

createRoot(document.getElementById('root')!).render(
  <StrictMode>
    <App />
  </StrictMode>,
)
