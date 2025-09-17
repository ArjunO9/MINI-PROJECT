import React from 'react';
import { BrowserRouter as Router, Route, Routes } from 'react-router-dom';

// Corrected Import Paths
import Navbar from './components/Layout/Navbar';
import Register from './components/auth/Register';
import Login from './components/auth/Login';
import AdminDashboard from './Pages/AdminDashboard';
import TokenPage from './Pages/TokenPage';
import PrivateRoute from './components/Routing/PrivateRoute';
import setAuthToken from './services/setAuthToken';
import './App.css';

if (localStorage.token) {
  setAuthToken(localStorage.token);
}

const App = () => {
  return (
    <Router>
      <Navbar />
      <div className="container">
        <Routes>
          <Route path="/register" element={<Register />} />
          <Route path="/login" element={<Login />} />
          <Route path="/token/:businessId" element={<TokenPage />} />
          <Route
            path="/dashboard"
            element={<PrivateRoute component={AdminDashboard} />}
          />
           {/* Add a default route for the root path */}
          <Route path="/" element={<Login />} />
        </Routes>
      </div>
    </Router>
  );
};

export default App;