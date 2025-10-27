import { StrictMode } from 'react'
import { createRoot } from 'react-dom/client'
import './index.css'
import App from './App.tsx'
import { Toaster } from "react-hot-toast";

createRoot(document.getElementById('root')!).render(
  <StrictMode>
    <>
      <App />
      <Toaster 
        position='bottom-center'
        toastOptions={{
          style: {
            background: "#333",
            color: "#fff",
          },
          success: {
            style: { background: "#10b981" }, 
          },
          error: {
            style: { background: "#ef4444" },
          },
        }}

      />,
    </>
   </StrictMode>
)
