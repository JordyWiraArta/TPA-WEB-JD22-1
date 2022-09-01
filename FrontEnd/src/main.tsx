import React from 'react'
import ReactDOM from 'react-dom/client'
import App from './App'
import './stylings/main.scss'
import './stylings/basic.scss'
import { GoogleOAuthProvider } from '@react-oauth/google';

ReactDOM.createRoot(document.getElementById('root') as HTMLElement).render(
  <React.StrictMode>
    <GoogleOAuthProvider clientId="632641386729-n48bsd26gp5kpboabmc6141d88478gge.apps.googleusercontent.com">
    <App />
    </GoogleOAuthProvider>
  </React.StrictMode>
)
