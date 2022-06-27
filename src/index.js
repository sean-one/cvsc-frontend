import React from 'react';
import ReactDOM from 'react-dom';
import { BrowserRouter } from 'react-router-dom';
import { GoogleOAuthProvider } from '@react-oauth/google';

import NotificationsProvider from './context/notifications/notifications.provider';
// import AxiosInstance from './helpers/axios';

// import './index.css';
import App from './App';

require('dotenv').config();

// AxiosInstance.interceptors.request.use((request) => {
//   console.log(request);
//   return request;
// })



ReactDOM.render(
  <React.StrictMode>
    <BrowserRouter>
      <GoogleOAuthProvider clientId={process.env.REACT_APP_GOOGLE_CLIENT_ID}>
        <NotificationsProvider>
          <App />
        </NotificationsProvider>
      </GoogleOAuthProvider>
    </BrowserRouter>
  </React.StrictMode>,
  document.getElementById('root')
);

