import React from 'react';
import ReactDOM from 'react-dom/client';
import MyColorContext from './components/MyColorContext'
import { AdapterDayjs } from '@mui/x-date-pickers/AdapterDayjs'
import { LocalizationProvider } from '@mui/x-date-pickers/LocalizationProvider';

import App from './App.jsx';
import UserProvider from './context/UserProvider';

const root = ReactDOM.createRoot(document.getElementById('root'));
root.render(
  <MyColorContext>
    <LocalizationProvider dateAdapter={AdapterDayjs}>
      <UserProvider>
        <App sx={{ bgcolor: 'background.default' }} />
      </UserProvider>
    </LocalizationProvider>
  </MyColorContext>
);