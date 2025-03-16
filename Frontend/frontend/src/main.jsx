import { StrictMode } from 'react'
import { createRoot } from 'react-dom/client'
// import { Auth0Provider } from '@auth0/auth0-react';
import './index.css'
import App from './App.jsx'

createRoot(document.getElementById('root')).render(
  <StrictMode>
    {/* <Auth0Provider
    domain="dev-tye2gwc6gzgtkl5j.us.auth0.com"
    clientId="nRv5r7F6CHmIU4JwchPO32ECLba1EUkm"
    authorizationParams={{
      redirect_uri: window.location.origin
    }}
  > */}
    <App />
  {/* </Auth0Provider>, */}
  </StrictMode>,
)
