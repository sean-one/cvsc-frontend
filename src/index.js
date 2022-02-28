import React from 'react';
import ReactDOM from 'react-dom';
import { BrowserRouter } from 'react-router-dom';
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
      <App />
    </BrowserRouter>
  </React.StrictMode>,
  document.getElementById('root')
);

