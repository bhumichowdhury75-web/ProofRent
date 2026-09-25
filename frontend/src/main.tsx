import React from 'react';
import ReactDOM from 'react-dom/client';
import { BrowserRouter } from 'react-router-dom';
import { WalletProvider } from './contexts/WalletContext';
import { RentalDataProvider } from './contexts/RentalDataContext';
import App from './App';
import './index.css';

ReactDOM.createRoot(document.getElementById('root')!).render(
  <React.StrictMode>
    <BrowserRouter>
      <WalletProvider>
        <RentalDataProvider>
          <App />
        </RentalDataProvider>
      </WalletProvider>
    </BrowserRouter>
  </React.StrictMode>,
);
