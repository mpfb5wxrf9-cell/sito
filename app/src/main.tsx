import { StrictMode } from 'react'
import { createRoot } from 'react-dom/client'
import './index.css'
import App from './App.tsx'
import OrderPage from './pages/OrderPage.tsx'

// Routing minimale via hash (nessuna libreria): #/ordina è la pagina
// pubblica per i clienti, tutto il resto è l'app staff con login. L'hash
// non viene mai inviato al server, quindi funziona su GitHub Pages senza
// bisogno di configurare redirect per una SPA multi-pagina.
const isPublicOrderPage = window.location.hash.startsWith('#/ordina')

createRoot(document.getElementById('root')!).render(
  <StrictMode>{isPublicOrderPage ? <OrderPage /> : <App />}</StrictMode>,
)
