import '@fontsource-variable/archivo/wdth.css'
import '@fontsource-variable/geist/index.css'
import '@fontsource-variable/geist-mono/index.css'
import './index.css'
import { StrictMode } from 'react'
import { createRoot, hydrateRoot } from 'react-dom/client'
import { App } from './App'
import { normalPath } from './router'

const root = document.getElementById('root')!
const app = (
  <StrictMode>
    <App url={normalPath(location.pathname)} />
  </StrictMode>
)
// `npm run dev` serves the empty shell, every built page is prerendered.
if (root.firstElementChild) hydrateRoot(root, app)
else createRoot(root).render(app)
