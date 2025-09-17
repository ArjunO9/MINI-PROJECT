import React from 'react';
import { Link } from 'react-router-dom';

const Navbar = () => {
  const handleLogout = () => {
    localStorage.removeItem('token');
    window.location = '/login';
  };

  const authLinks = (
    <ul>
      <li><Link to="/dashboard">Dashboard</Link></li>
      <li><a onClick={handleLogout} href="#!">Logout</a></li>
    </ul>
  );

  const guestLinks = (
    <ul>
      <li><Link to="/register">Register</Link></li>
      <li><Link to="/login">Login</Link></li>
    </ul>
  );

  return (
    <nav className="navbar">
      <h1><Link to="/">WaitWise</Link></h1>
      {localStorage.token ? authLinks : guestLinks}
    </nav>
  );
};

export default Navbar;