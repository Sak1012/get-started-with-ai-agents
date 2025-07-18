import React from 'react';
import ReactDOM from 'react-dom/client';
import App from './components/App';

import { PublicClientApplication } from '@azure/msal-browser';
import { MsalProvider } from '@azure/msal-react';
import { msalConfig } from './components/core/Login/authConfig'; // make sure this exists


const msalInstance = new PublicClientApplication(msalConfig);

const rootElement = document.getElementById("react-root");

if (rootElement) {
  ReactDOM.createRoot(rootElement).render(
    <React.StrictMode>
      <MsalProvider instance={msalInstance}>
        <App />
      </MsalProvider>
    </React.StrictMode>
  );
} else {
  console.error("Failed to find the react-root element");
}
