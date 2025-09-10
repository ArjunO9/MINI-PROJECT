// LoginPage.js
import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';

const LoginPage = () => {
  const [loginType, setLoginType] = useState('user');
  const [businessName, setBusinessName] = useState('');
  const [username, setUsername] = useState('');
  const [password, setPassword] = useState('');
  const navigate = useNavigate();

  // In LoginPage.js, update the handleLogin function
const handleLogin = (e) => {
  e.preventDefault();
  if (loginType === 'business') {
    navigate(`/admin/${businessName.replace(/\s+/g, '-').toLowerCase()}`);
  } else {
    navigate('/businesses');
  }
  };

  return (
    <div style={styles.loginContainer}>
      <div style={styles.loginBox}>
        <h2 style={styles.loginTitle}>Queue Management System</h2>

        <div style={styles.toggleContainer}>
          <button
            style={{ ...styles.toggleBtn, ...(loginType === 'user' ? styles.activeToggle : {}) }}
            onClick={() => setLoginType('user')}
          >
            User Login
          </button>
          <button
            style={{ ...styles.toggleBtn, ...(loginType === 'business' ? styles.activeToggle : {}) }}
            onClick={() => setLoginType('business')}
          >
            Business Login
          </button>
        </div>

        <form onSubmit={handleLogin} style={styles.form}>
          {loginType === 'business' ? (
            <>
              <div style={styles.inputGroup}>
                <label style={styles.label}>Business Name</label>
                <input
                  type="text"
                  value={businessName}
                  onChange={(e) => setBusinessName(e.target.value)}
                  style={styles.input}
                  required
                />
              </div>
              <div style={styles.inputGroup}>
                <label style={styles.label}>Password</label>
                <input
                  type="password"
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  style={styles.input}
                  required
                />
              </div>
            </>
          ) : (
            <>
              <div style={styles.inputGroup}>
                <label style={styles.label}>Username</label>
                <input
                  type="text"
                  value={username}
                  onChange={(e) => setUsername(e.target.value)}
                  style={styles.input}
                  required
                />
              </div>
              <div style={styles.inputGroup}>
                <label style={styles.label}>Password</label>
                <input
                  type="password"
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  style={styles.input}
                  required
                />
              </div>
            </>
          )}

          <button type="submit" style={styles.loginButton}>
            {loginType === 'business' ? 'Business Login' : 'User Login'}
          </button>
        </form>

        <p style={styles.signupText}>
          Don't have an account? <a href="#" style={styles.signupLink}>Sign up</a>
        </p>
      </div>
    </div>
  );
};

const styles = {
  loginContainer: {
    display: 'flex',
    justifyContent: 'center',
    alignItems: 'center',
    minHeight: '100vh',
    backgroundColor: '#f0f2f5'
  },
  loginBox: {
    backgroundColor: 'white',
    padding: '2rem',
    borderRadius: '8px',
    boxShadow: '0 4px 12px rgba(0, 0, 0, 0.1)',
    width: '100%',
    maxWidth: '400px'
  },
  loginTitle: {
    textAlign: 'center',
    marginBottom: '1.5rem',
    color: '#1890ff'
  },
  toggleContainer: {
    display: 'flex',
    marginBottom: '1.5rem',
    border: '1px solid #d9d9d9',
    borderRadius: '6px',
    overflow: 'hidden'
  },
  toggleBtn: {
    flex: 1,
    padding: '0.5rem',
    border: 'none',
    backgroundColor: 'white',
    cursor: 'pointer',
    transition: 'all 0.3s'
  },
  activeToggle: {
    backgroundColor: '#1890ff',
    color: 'white'
  },
  form: {
    display: 'flex',
    flexDirection: 'column'
  },
  inputGroup: {
    marginBottom: '1rem'
  },
  label: {
    display: 'block',
    marginBottom: '0.5rem',
    fontWeight: '500'
  },
  input: {
    width: '100%',
    padding: '0.5rem',
    border: '1px solid #d9d9d9',
    borderRadius: '4px',
    fontSize: '1rem'
  },
  loginButton: {
    padding: '0.75rem',
    backgroundColor: '#1890ff',
    color: 'white',
    border: 'none',
    borderRadius: '4px',
    fontSize: '1rem',
    cursor: 'pointer',
    marginTop: '1rem'
  },
  signupText: {
    textAlign: 'center',
    marginTop: '1.5rem',
    color: '#666'
  },
  signupLink: {
    color: '#1890ff',
    textDecoration: 'none'
  }
};

export default LoginPage;