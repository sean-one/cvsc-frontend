import React from 'react';
import ReactDOM from 'react-dom';
import { BrowserRouter, Routes, Route } from 'react-router-dom';

import { AuthProvider } from './context/auth/auth.provider';
import { ThemeProvider } from './context/theme/theme.provider';
import NotificationsProvider from './context/notifications/notifications.provider';

// import './index.css';
import App from './App';

require('dotenv').config();


ReactDOM.render(
  <React.StrictMode>
    <BrowserRouter>
      <ThemeProvider>
        <AuthProvider>
          <NotificationsProvider>
            <Routes>
              <Route path="/*" element={<App />} />
            </Routes>
          </NotificationsProvider>
        </AuthProvider>
      </ThemeProvider>
    </BrowserRouter>
  </React.StrictMode>,
  document.getElementById('root')
);

