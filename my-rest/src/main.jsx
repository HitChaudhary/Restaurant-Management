import { StrictMode } from 'react'
import { createRoot } from 'react-dom/client'
import { BrowserRouter } from 'react-router-dom'
import './index.css'
import App from './App.jsx'
import {Provider} from './Context/HotelContext.jsx'
import Toaster from 'react-hot-toast'

createRoot(document.getElementById('root')).render(
  <StrictMode>
    <Toaster/>
    <BrowserRouter>
      <Provider>
        <App />
      </Provider>
    </BrowserRouter>
    
  </StrictMode>
)
