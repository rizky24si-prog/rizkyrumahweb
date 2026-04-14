import React from 'react';
import ReactDOM from 'react-dom/client';
import './tailwind.css';
import Admin from './Admin';

const isAdmin = window.location.pathname.includes('/admin');

ReactDOM.createRoot(document.getElementById('root')).render(
  <React.StrictMode>
    <Admin />
  </React.StrictMode>
);