import React, { useState, useEffect, useCallback } from 'react';
import { useParams, Link } from 'react-router-dom';

const TokenPage = () => {
  const { businessId } = useParams();
  const [tokenInfo, setTokenInfo] = useState(null);
  const [queue, setQueue] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [refreshing, setRefreshing] = useState(false);
  const [notificationsEnabled, setNotificationsEnabled] = useState(false);

  // Mock API functions - replace with actual API calls
  const generateToken = useCallback(async () => {
    try {
      setError(null);
      // In a real app, this would be an actual API call
      // const response = await axios.post(`/api/token/${businessId}`);
      
      // Mock response for demonstration
      const mockResponse = {
        data: {
          _id: 'token_' + Math.floor(Math.random() * 1000),
          tokenNumber: Math.floor(Math.random() * 100),
          waitingTokensCount: Math.floor(Math.random() * 10),
          estimatedWaitTime: Math.floor(Math.random() * 30),
          status: 'waiting'
        }
      };
      
      setTokenInfo(mockResponse.data);
      return mockResponse.data;
    } catch (error) {
      console.error('Error generating token:', error);
      setError('Failed to generate token. Please try again.');
      throw error;
    }
  }, [businessId]);

  const fetchQueue = useCallback(async () => {
    try {
      // In a real app, this would be an actual API call
      // const response = await axios.get(`/api/token/queue/${businessId}`);
      
      // Mock response for demonstration - ensure it's always an array
      const mockResponse = {
        data: [
          { _id: 'token_1', tokenNumber: 25, status: 'serving' },
          { _id: 'token_2', tokenNumber: 26, status: 'waiting' },
          { _id: 'token_3', tokenNumber: 27, status: 'waiting' },
          { _id: 'token_4', tokenNumber: 28, status: 'waiting' },
        ]
      };
      
      // Ensure we always set an array, even if the API returns something else
      if (tokenInfo) {
        // Add the current user's token to the queue if it's not already there
        const userTokenInQueue = mockResponse.data.some(token => token._id === tokenInfo._id);
        if (!userTokenInQueue) {
          mockResponse.data.push({...tokenInfo});
        }
      }
      
      setQueue(Array.isArray(mockResponse.data) ? mockResponse.data : []);
      return mockResponse.data;
    } catch (error) {
      console.error('Error fetching queue:', error);
      setError('Failed to fetch queue information.');
      setQueue([]); // Ensure queue is always an array even on error
      throw error;
    } finally {
      setLoading(false);
      setRefreshing(false);
    }
  }, [businessId, tokenInfo]);

  // Initial data loading
  useEffect(() => {
    const initializeData = async () => {
      try {
        setLoading(true);
        const token = await generateToken();
        // After generating token, fetch the queue
        if (token) {
          await fetchQueue();
        }
      } catch (err) {
        setLoading(false);
      }
    };
    
    initializeData();
  }, [generateToken, fetchQueue]);

  // Set up auto-refresh every 30 seconds
  useEffect(() => {
    const intervalId = setInterval(() => {
      setRefreshing(true);
      fetchQueue();
    }, 30000);

    return () => clearInterval(intervalId);
  }, [fetchQueue]);

  const handleRefresh = () => {
    setRefreshing(true);
    fetchQueue();
  };

  const handleNotificationToggle = () => {
    if (!notificationsEnabled && Notification.permission !== 'granted') {
      Notification.requestPermission().then(permission => {
        if (permission === 'granted') {
          setNotificationsEnabled(true);
        }
      });
    } else {
      setNotificationsEnabled(!notificationsEnabled);
    }
  };

  if (loading) {
    return (
      <div style={{ 
        display: 'flex', 
        flexDirection: 'column', 
        alignItems: 'center', 
        justifyContent: 'center', 
        minHeight: '50vh',
        fontFamily: 'Segoe UI, Tahoma, Geneva, Verdana, sans-serif'
      }}>
        <div style={{
          width: '40px',
          height: '40px',
          border: '4px solid #f3f3f3',
          borderTop: '4px solid #0066cc',
          borderRadius: '50%',
          animation: 'spin 1s linear infinite',
          marginBottom: '20px'
        }}></div>
        <p>Generating your token...</p>
        <style>{`
          @keyframes spin {
            from { transform: rotate(0deg); }
            to { transform: rotate(360deg); }
          }
        `}</style>
      </div>
    );
  }

  if (error && !tokenInfo) {
    return (
      <div style={{
        textAlign: 'center',
        padding: '40px 20px',
        fontFamily: 'Segoe UI, Tahoma, Geneva, Verdana, sans-serif'
      }}>
        <h2>Something went wrong</h2>
        <p>{error}</p>
        <button onClick={() => window.location.reload()} style={{
          backgroundColor: '#0066cc',
          color: 'white',
          border: 'none',
          padding: '10px 20px',
          borderRadius: '4px',
          cursor: 'pointer',
          fontSize: '16px',
          margin: '15px 0'
        }}>
          Try Again
        </button>
        <br />
        <Link to="/" style={{ color: '#666', marginTop: '10px', display: 'block' }}>
          Return to Home
        </Link>
      </div>
    );
  }

  return (
    <div style={{
      maxWidth: '800px',
      margin: '0 auto',
      padding: '20px',
      fontFamily: 'Segoe UI, Tahoma, Geneva, Verdana, sans-serif',
      color: '#333'
    }}>
      <header style={{
        display: 'flex',
        justifyContent: 'space-between',
        alignItems: 'center',
        marginBottom: '30px',
        paddingBottom: '15px',
        borderBottom: '1px solid #eee'
      }}>
        <Link to="/" style={{ color: '#0066cc', textDecoration: 'none', fontWeight: '500' }}>
          ← Back to Businesses
        </Link>
        <h1>Queue Management</h1>
        <div style={{ display: 'flex', gap: '10px' }}>
          <button 
            style={{
              background: 'none',
              border: '1px solid #ddd',
              borderRadius: '50%',
              width: '40px',
              height: '40px',
              cursor: 'pointer',
              fontSize: '16px',
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center',
              transition: 'all 0.2s ease',
              backgroundColor: notificationsEnabled ? '#e6f7ff' : 'transparent',
              borderColor: notificationsEnabled ? '#0066cc' : '#ddd'
            }}
            onClick={handleNotificationToggle}
            title="Toggle notifications"
            aria-label="Toggle notifications"
          >
            🔔
          </button>
          <button 
            style={{
              background: 'none',
              border: '1px solid #ddd',
              borderRadius: '50%',
              width: '40px',
              height: '40px',
              cursor: 'pointer',
              fontSize: '16px',
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center',
              transition: 'all 0.2s ease'
            }}
            onClick={handleRefresh}
            disabled={refreshing}
            title="Refresh queue"
            aria-label="Refresh queue"
          >
            🔄
          </button>
        </div>
      </header>

      <main>
        <section style={{
          textAlign: 'center',
          marginBottom: '30px',
          padding: '20px',
          background: 'linear-gradient(135deg, #f6f9fc 0%, #e9f2f8 100%)',
          borderRadius: '12px',
          boxShadow: '0 4px 12px rgba(0,0,0,0.05)'
        }}>
          <h2>Your Token Number</h2>
          <div style={{
            fontSize: '72px',
            fontWeight: 'bold',
            color: '#0066cc',
            margin: '15px 0',
            textShadow: '1px 1px 3px rgba(0,0,0,0.1)'
          }}>
            {tokenInfo.tokenNumber}
          </div>
          <div style={{ marginTop: '10px' }}>
            <span style={{
              padding: '6px 12px',
              borderRadius: '20px',
              fontSize: '14px',
              fontWeight: '500',
              textTransform: 'uppercase',
              backgroundColor: tokenInfo.status === 'serving' ? '#e6f7ff' : 
                              tokenInfo.status === 'completed' ? '#e6ffed' : '#fff4e6',
              color: tokenInfo.status === 'serving' ? '#0066cc' : 
                    tokenInfo.status === 'completed' ? '#00a854' : '#f2711c'
            }}>
              {tokenInfo.status}
            </span>
          </div>
        </section>

        <section style={{
          display: 'flex',
          justifyContent: 'space-around',
          marginBottom: '30px',
          textAlign: 'center'
        }}>
          <div style={{
            padding: '15px',
            backgroundColor: '#f9f9f9',
            borderRadius: '8px',
            minWidth: '150px'
          }}>
            <span style={{
              display: 'block',
              fontSize: '32px',
              fontWeight: 'bold',
              color: '#0066cc'
            }}>
              {tokenInfo.waitingTokensCount}
            </span>
            <span style={{
              display: 'block',
              fontSize: '14px',
              color: '#666',
              marginTop: '5px'
            }}>
              People ahead of you
            </span>
          </div>
          <div style={{
            padding: '15px',
            backgroundColor: '#f9f9f9',
            borderRadius: '8px',
            minWidth: '150px'
          }}>
            <span style={{
              display: 'block',
              fontSize: '32px',
              fontWeight: 'bold',
              color: '#0066cc'
            }}>
              {tokenInfo.estimatedWaitTime}
            </span>
            <span style={{
              display: 'block',
              fontSize: '14px',
              color: '#666',
              marginTop: '5px'
            }}>
              Estimated minutes
            </span>
          </div>
        </section>

        <section style={{ marginBottom: '30px' }}>
          <div style={{
            display: 'flex',
            justifyContent: 'space-between',
            alignItems: 'center',
            marginBottom: '15px'
          }}>
            <h3>Current Queue</h3>
            <span style={{
              fontSize: '14px',
              color: '#666',
              backgroundColor: '#f0f0f0',
              padding: '4px 10px',
              borderRadius: '12px'
            }}>
              {queue.length} tokens
            </span>
          </div>
          
          {refreshing && <div style={{
            textAlign: 'center',
            padding: '10px',
            color: '#0066cc',
            fontStyle: 'italic'
          }}>Updating...</div>}
          
          {error && <div style={{
            backgroundColor: '#fff2f0',
            border: '1px solid #ffccc7',
            padding: '10px',
            borderRadius: '4px',
            color: '#f5222d',
            marginBottom: '15px'
          }}>{error}</div>}
          
          <div style={{
            border: '1px solid #eee',
            borderRadius: '8px',
            overflow: 'hidden'
          }}>
            {queue.length === 0 ? (
              <p style={{
                textAlign: 'center',
                padding: '30px',
                color: '#999',
                fontStyle: 'italic'
              }}>No tokens in the queue</p>
            ) : (
              queue.map((token) => (
                <div 
                  key={token._id} 
                  style={{
                    display: 'flex',
                    alignItems: 'center',
                    padding: '12px 15px',
                    borderBottom: '1px solid #eee',
                    backgroundColor: token._id === tokenInfo._id ? '#e6f7ff' : '#fff',
                    fontWeight: token._id === tokenInfo._id ? '500' : 'normal',
                    transition: 'background-color 0.2s'
                  }}
                >
                  <span style={{
                    fontWeight: 'bold',
                    marginRight: '10px',
                    minWidth: '80px'
                  }}>
                    #{token.tokenNumber}
                  </span>
                  <span style={{
                    padding: '4px 8px',
                    borderRadius: '4px',
                    fontSize: '12px',
                    textTransform: 'uppercase',
                    marginRight: '10px',
                    backgroundColor: token.status === 'serving' ? '#e6f7ff' : 
                                    token.status === 'completed' ? '#e6ffed' : '#fff4e6',
                    color: token.status === 'serving' ? '#0066cc' : 
                          token.status === 'completed' ? '#00a854' : '#f2711c'
                  }}>
                    {token.status}
                  </span>
                  {token._id === tokenInfo._id && (
                    <span style={{
                      marginLeft: 'auto',
                      color: '#0066cc',
                      fontSize: '12px',
                      fontWeight: '500'
                    }}>
                      (You)
                    </span>
                  )}
                </div>
              ))
            )}
          </div>
        </section>
      </main>

      <footer style={{
        textAlign: 'center',
        paddingTop: '20px',
        borderTop: '1px solid #eee',
        color: '#999',
        fontSize: '14px'
      }}>
        <p>Need help? Contact support</p>
        <p>Your position will update automatically</p>
      </footer>
    </div>
  );
};

export default TokenPage;