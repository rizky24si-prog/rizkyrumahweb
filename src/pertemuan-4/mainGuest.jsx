import React from 'react';
import ReactDOM from 'react-dom/client';
import './tailwind.css';
import Guest from './Guest';

const isAdmin = window.location.pathname.includes('/admin');

ReactDOM.createRoot(document.getElementById('root')).render(
  <React.StrictMode>
    <Guest />
  </React.StrictMode>
);