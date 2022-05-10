import { StrictMode } from 'react';
import ReactDOM from 'react-dom';
import { BrowserRouter } from 'react-router-dom';

// scroll bar
import 'simplebar/src/simplebar.css';

// third-party
import { Provider as ReduxProvider } from 'react-redux';
import { configureStore } from '@reduxjs/toolkit';

// apex-chart
import 'assets/third-party/apex-chart.css';

// project import
import App from './App';
import { store } from 'store';
import reportWebVitals from './reportWebVitals';

// ==============================|| MAIN - REACT DOM RENDER  ||============================== //

import userReducer from './store/store';
import authReducer from './store/authStore';

const customStore = configureStore({
  reducer: {
    user: userReducer,
    auth: authReducer,
  },
});

ReactDOM.render(
  // <StrictMode>
  <ReduxProvider store={store}>
    {/* <ReduxProvider store={customStore}> */}
      <BrowserRouter>
        <App />
      </BrowserRouter>
    {/* </ReduxProvider> */}
  </ReduxProvider>,
  // </StrictMode>,
  document.getElementById('root')
);

// If you want to start measuring performance in your app, pass a function
// to log results (for example: reportWebVitals(console.log))
// or send to an analytics endpoint. Learn more: https://bit.ly/CRA-vitals
reportWebVitals();
