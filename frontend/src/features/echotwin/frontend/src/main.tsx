import React from 'react';
import ReactDOM from 'react-dom/client';
import App from './App'; // Ensure App is imported correctly
import './index.css';

ReactDOM.createRoot(document.getElementById('root')!).render(
  <React.StrictMode>
    <App /> {/* Render the App component */}
  </React.StrictMode>
);

