import { StrictMode } from 'react'
import { createRoot } from 'react-dom/client'
import './index.css'
import { Timer } from './components/Timer';
import { SpeedInsights } from "@vercel/speed-insights/react"
import { Analytics } from "@vercel/analytics/react"

createRoot(document.getElementById('root')!).render(
  <StrictMode>
    <SpeedInsights />
    <Analytics />
    <Timer />
  </StrictMode>,
)
