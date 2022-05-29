import React from 'react';
import ReactDOM from 'react-dom/client';
import TrustListViewer from './gui/TrustListViewer';

import './gui/index.css';
import "allotment/dist/style.css";
import 'react-toastify/dist/ReactToastify.css';

console.log = console.warn = console.error = () => {};

const root = ReactDOM.createRoot(
  document.getElementById('root') as HTMLElement
);

root.render(
  <React.StrictMode>
    {/*<App />*/}
    <TrustListViewer
        appTitle = {'TrustListViewer'}
    />
  </React.StrictMode>
);

