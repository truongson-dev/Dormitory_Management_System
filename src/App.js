import React from 'react';
import { BrowserRouter as Router } from 'react-router-dom';
import { Provider } from 'react-redux';
import store from './Redux/store';
import AppRoutes from './routes/AppRoutes';

import './App.css';

function App() {
  return (
    // Bọc toàn bộ ứng dụng trong Redux Provider
    <Provider store={store}>
      <Router>
        <AppRoutes />
      </Router>
    </Provider>
  );
}

export default App;
