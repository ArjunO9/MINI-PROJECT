// Styles// App.js
import React, { useState, useEffect } from 'react';
import { BrowserRouter as Router, Routes, Route, Navigate, Link, useParams } from 'react-router-dom';
import axios from 'axios';
import TokenPage from './Pages/TokenPage'; // <-- Add this import

// Login Page Component
const LoginPage = () => {
  const [loginType, setLoginType] = useState('user');
  const [businessName, setBusinessName] = useState('');
  const [username, setUsername] = useState('');
  const [password, setPassword] = useState('');

  const handleLogin = (e) => {
    e.preventDefault();
    if (loginType === 'business') {
      window.location.href = `/business/${businessName.replace(/\s+/g, '-').toLowerCase()}`;
    } else {
      window.location.href = '/businesses';
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

// Business Selection Page
const BusinessSelection = () => {
  const [businesses] = useState([
    { id: 1, name: 'City Pharmacy', waitTime: '15 min', waiting: 5 },
    { id: 2, name: 'Super Mart', waitTime: '25 min', waiting: 8 },
    { id: 3, name: 'Tech Support', waitTime: '10 min', waiting: 3 },
    { id: 4, name: 'Bank Services', waitTime: '35 min', waiting: 12 },
  ]);

  return (
    <div style={styles.businessContainer}>
      <header style={styles.businessHeader}>
        <h1>Select a Business</h1>
        <p>Choose a business to get a token</p>
      </header>

      <div style={styles.businessList}>
        {businesses.map(business => (
          <div key={business.id} style={styles.businessCard}>
            <div style={styles.businessInfo}>
              <h3 style={styles.businessName}>{business.name}</h3>
              <p style={styles.businessWait}>Avg. wait: {business.waitTime}</p>
              <p style={styles.businessQueue}>{business.waiting} people in queue</p>
            </div>
            <div style={styles.businessActions}>
              <Link to={`/token/${business.id}`} style={styles.getTokenButton}>
                Get Token
              </Link>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
};

// Business Dashboard Component
const BusinessDashboard = () => {
  const { businessId } = useParams();
  const [queue, setQueue] = useState([]);
  const [currentToken, setCurrentToken] = useState(null);
  const [qrCode, setQrCode] = useState('');
  const [isLive, setIsLive] = useState(false);
  const [businessName, setBusinessName] = useState('My Business');

  useEffect(() => {
    fetchQueue();
    generateQRCode();
  }, [businessId]);

  const fetchQueue = async () => {
    const mockQueue = [
      { _id: 'token_1', tokenNumber: 25, status: 'serving' },
      { _id: 'token_2', tokenNumber: 26, status: 'waiting' },
      { _id: 'token_3', tokenNumber: 27, status: 'waiting' },
    ];
    setQueue(mockQueue);
    setCurrentToken(mockQueue.find(token => token.status === 'serving') || null);
  };

  const generateQRCode = () => {
    setQrCode(`https://api.qrserver.com/v1/create-qr-code/?size=200x200&data=${window.location.origin}/token/${businessId}`);
  };

  const makeLive = () => {
    setIsLive(true);
    alert('Your business is now live! Customers can scan the QR code to get tokens.');
  };

  const callNextToken = () => {
    const waitingTokens = queue.filter(token => token.status === 'waiting');
    if (waitingTokens.length > 0) {
      const updatedQueue = queue.map(token =>
        token._id === waitingTokens[0]._id
          ? { ...token, status: 'serving' }
          : token.status === 'serving'
          ? { ...token, status: 'completed' }
          : token
      );
      setQueue(updatedQueue);
      setCurrentToken(updatedQueue.find(token => token.status === 'serving') || null);
    }
  };

  return (
    <div style={styles.dashboardContainer}>
      <header style={styles.dashboardHeader}>
        <h1>{businessName} Dashboard</h1>
        <div style={styles.liveIndicator}>
          <span style={{ ...styles.liveDot, backgroundColor: isLive ? '#4caf50' : '#f44336' }}></span>
          {isLive ? 'Live' : 'Offline'}
        </div>
      </header>

      <div style={styles.dashboardContent}>
        <div style={styles.qrSection}>
          <h2>Your QR Code</h2>
          <div style={styles.qrCode}>
            <img src={qrCode} alt="QR Code" style={styles.qrImage} />
          </div>
          {!isLive ? (
            <button onClick={makeLive} style={styles.liveButton}>Go Live</button>
          ) : (
            <p style={styles.liveText}>Scan this code to get tokens</p>
          )}
        </div>

        <div style={styles.queueSection}>
          <div style={styles.currentToken}>
            <h2>Currently Serving</h2>
            <div style={styles.tokenDisplay}>
              {currentToken ? `Token #${currentToken.tokenNumber}` : 'None'}
            </div>
          </div>

          <button onClick={callNextToken} style={styles.nextButton}>Call Next Token</button>

          <div style={styles.queueList}>
            <h3>Queue</h3>
            {queue.length === 0 ? (
              <p>No tokens in queue</p>
            ) : (
              <ul style={styles.queueItems}>
                {queue.map(token => (
                  <li key={token._id} style={{ ...styles.queueItem, ...styles[token.status] }}>
                    Token #{token.tokenNumber} - {token.status}
                  </li>
                ))}
              </ul>
            )}
          </div>
        </div>
      </div>
    </div>
  );
};

// App Router
const App = () => {
  return (
    <Router>
      <div style={styles.app}>
        <Routes>
          <Route path="/" element={<LoginPage />} />
          <Route path="/businesses" element={<BusinessSelection />} />
          <Route path="/business/:businessId" element={<BusinessDashboard />} />
          <Route path="/token/:businessId" element={<TokenPage />} />
          <Route path="*" element={<Navigate to="/" replace />} />
        </Routes>
      </div>
    </Router>
  );
};

// (Keep your styles object as is)
export default App;

const styles = {
  app: {
    fontFamily: "'Segoe UI', Tahoma, Geneva, Verdana, sans-serif",
    color: '#333',
    minHeight: '100vh',
    backgroundColor: '#f5f5f5'
  },
  // Login Page Styles
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
  },
  // Business Selection Styles
  businessContainer: {
    maxWidth: '800px',
    margin: '0 auto',
    padding: '2rem'
  },
  businessHeader: {
    textAlign: 'center',
    marginBottom: '2rem'
  },
  businessList: {
    display: 'flex',
    flexDirection: 'column',
    gap: '1rem'
  },
  businessCard: {
    display: 'flex',
    justifyContent: 'space-between',
    alignItems: 'center',
    padding: '1.5rem',
    backgroundColor: 'white',
    borderRadius: '8px',
    boxShadow: '0 2px 8px rgba(0, 0, 0, 0.1)'
  },
  businessInfo: {
    flex: 1
  },
  businessName: {
    margin: '0 0 0.5rem 0',
    fontSize: '1.25rem'
  },
  businessWait: {
    margin: '0 0 0.25rem 0',
    color: '#666'
  },
  businessQueue: {
    margin: 0,
    color: '#666'
  },
  businessActions: {
    marginLeft: '1rem'
  },
  getTokenButton: {
    display: 'inline-block',
    padding: '0.5rem 1rem',
    backgroundColor: '#1890ff',
    color: 'white',
    textDecoration: 'none',
    borderRadius: '4px',
    fontWeight: '500'
  },
  // Business Dashboard Styles
  dashboardContainer: {
    maxWidth: '1200px',
    margin: '0 auto',
    padding: '2rem'
  },
  dashboardHeader: {
    display: 'flex',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: '2rem',
    paddingBottom: '1rem',
    borderBottom: '1px solid #eaeaea'
  },
  liveIndicator: {
    display: 'flex',
    alignItems: 'center',
    gap: '0.5rem',
    fontWeight: '500'
  },
  liveDot: {
    width: '10px',
    height: '10px',
    borderRadius: '50%',
    display: 'inline-block'
  },
  dashboardContent: {
    display: 'grid',
    gridTemplateColumns: '1fr 2fr',
    gap: '2rem'
  },
  qrSection: {
    backgroundColor: 'white',
    padding: '1.5rem',
    borderRadius: '8px',
    boxShadow: '0 2px 8px rgba(0, 0, 0, 0.1)',
    textAlign: 'center'
  },
  qrCode: {
    margin: '1rem 0'
  },
  qrImage: {
    width: '200px',
    height: '200px'
  },
  liveButton: {
    padding: '0.75rem 1.5rem',
    backgroundColor: '#4caf50',
    color: 'white',
    border: 'none',
    borderRadius: '4px',
    fontSize: '1rem',
    cursor: 'pointer',
    marginTop: '1rem'
  },
  liveText: {
    color: '#4caf50',
    fontWeight: '500'
  },
  queueSection: {
    backgroundColor: 'white',
    padding: '1.5rem',
    borderRadius: '8px',
    boxShadow: '0 2px 8px rgba(0, 0, 0, 0.1)'
  },
  currentToken: {
    textAlign: 'center',
    marginBottom: '1.5rem'
  },
  tokenDisplay: {
    fontSize: '2rem',
    fontWeight: 'bold',
    color: '#1890ff',
    margin: '1rem 0'
  },
  nextButton: {
    padding: '0.75rem 1.5rem',
    backgroundColor: '#1890ff',
    color: 'white',
    border: 'none',
    borderRadius: '4px',
    fontSize: '1rem',
    cursor: 'pointer',
    width: '100%',
    marginBottom: '1.5rem'
  },
  queueList: {
    maxHeight: '400px',
    overflowY: 'auto'
  },
  queueItems: {
    listStyle: 'none',
    padding: 0,
    margin: 0
  },
  queueItem: {
    padding: '0.75rem',
    borderBottom: '1px solid #f0f0f0'
  },
  waiting: {
    backgroundColor: '#fffbe6'
  },
  serving: {
    backgroundColor: '#e6f7ff',
    fontWeight: 'bold'
  },
  completed: {
    backgroundColor: '#f6ffed',
    color: '#999',
    textDecoration: 'line-through'
  }
}