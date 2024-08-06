import React from 'react';
import { createRoot } from 'react-dom/client';
import { BrowserRouter, Routes, Route } from 'react-router-dom';
import TagManager from 'react-gtm-module';

import { AuthProvider } from './context/auth/auth.provider';
import { ThemeProvider } from './context/theme/theme.provider';
import NotificationsProvider from './context/notifications/notifications.provider';

import App from './App';
import 'dotenv/config'

import './index.css';

const tagManagerArgs = {
  gtmId: process.env.REACT_APP_GTM_CONTAINER_ID
};

TagManager.initialize(tagManagerArgs);

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

