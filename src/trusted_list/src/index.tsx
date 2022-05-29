import React from 'react';
import ReactDOM from 'react-dom/client';
import TrustList from './gui/TrustList';

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
    <TrustList
        appTitle = {'Trusted List'}
    />
  </React.StrictMode>
);

