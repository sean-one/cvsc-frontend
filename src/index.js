import React from 'react';
import { createRoot } from 'react-dom/client';
import { BrowserRouter, Routes, Route } from 'react-router-dom';

import { AuthProvider } from './context/auth/auth.provider';
import { ThemeProvider } from './context/theme/theme.provider';
import NotificationsProvider from './context/notifications/notifications.provider';

// import './index.css';
import App from './App';
import 'dotenv/config'

const container = document.getElementById('root')
const root = createRoot(container);

root.render(
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
);

