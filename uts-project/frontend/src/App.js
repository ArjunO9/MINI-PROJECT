// App.js
import React from 'react';
import { BrowserRouter as Router, Routes, Route, Navigate } from 'react-router-dom';
import LoginPage from './Pages/LoginPage';
import BusinessSelection from './Pages/BusinessSelection';
import AdminDashboard from './Pages/AdminDashboard';
import TokenPage from './Pages/TokenPage';

const App = () => {
  return (
    <Router>
      <div style={styles.app}>
        <Routes>
          <Route path="/" element={<LoginPage />} />
          <Route path="/businesses" element={<BusinessSelection />} />
          <Route path="/admin/:businessId" element={<AdminDashboard />} />
          <Route path="/token/:businessId" element={<TokenPage />} />
          <Route path="*" element={<Navigate to="/" replace />} />
        </Routes>
      </div>
    </Router>
  );
};

const styles = {
  app: {
    fontFamily: "'Segoe UI', Tahoma, Geneva, Verdana, sans-serif",
    color: '#333',
    minHeight: '100vh',
    backgroundColor: '#f5f5f5'
  }
};

export default App;