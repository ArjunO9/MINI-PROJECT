// BusinessSelection.js
import React, { useState } from 'react';
import { Link } from 'react-router-dom';

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

const styles = {
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
  }
};

export default BusinessSelection;