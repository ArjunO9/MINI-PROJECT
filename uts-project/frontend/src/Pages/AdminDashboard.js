import React, { useState, useEffect } from 'react';
import { useParams } from 'react-router-dom';
import { BrowserRouter as Router, Routes, Route, Link, Navigate } from 'react-router-dom';


const AdminDashboard = () => {
  const { businessId } = useParams();
  const [queue, setQueue] = useState([]);
  const [currentToken, setCurrentToken] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [stats, setStats] = useState({
    servedToday: 12,
    avgWaitTime: 8,
    queueLength: 0
  });
  const [audioEnabled, setAudioEnabled] = useState(true);
  const [announcementsEnabled, setAnnouncementsEnabled] = useState(true);

  useEffect(() => {
    fetchQueue();
    fetchStats();
    
    // Set up auto-refresh every 10 seconds
    const intervalId = setInterval(() => {
      fetchQueue();
    }, 10000);

    return () => clearInterval(intervalId);
  }, [businessId]);

  const fetchQueue = async () => {
    try {
      // In a real app, this would be an actual API call
      // const response = await axios.get(`/api/token/queue/${businessId}`);
      
      // Mock response for demonstration - ensure it's always an array
      const mockResponse = {
        data: [
          { _id: 'token_1', tokenNumber: 25, status: 'serving', createdAt: new Date() },
          { _id: 'token_2', tokenNumber: 26, status: 'waiting', createdAt: new Date(Date.now() - 5*60000) },
          { _id: 'token_3', tokenNumber: 27, status: 'waiting', createdAt: new Date(Date.now() - 10*60000) },
          { _id: 'token_4', tokenNumber: 28, status: 'waiting', createdAt: new Date(Date.now() - 15*60000) },
        ]
      };
      
      // Ensure we always set an array, even if the API returns something else
      setQueue(Array.isArray(mockResponse.data) ? mockResponse.data : []);
      
      // Find the currently serving token
      const servingToken = mockResponse.data.find(token => token.status === 'serving');
      setCurrentToken(servingToken || null);
      setLoading(false);
    } catch (error) {
      console.error('Error fetching queue:', error);
      setError('Failed to fetch queue data');
      setQueue([]); // Ensure queue is always an array even on error
      setLoading(false);
    }
  };

  const fetchStats = async () => {
    try {
      // In a real app, this would be an actual API call
      // const response = await axios.get(`/api/stats/${businessId}`);
      
      // Mock response for demonstration
      const waitingCount = queue.filter(token => token.status === 'waiting').length;
      setStats({
        servedToday: 12,
        avgWaitTime: 8,
        queueLength: waitingCount
      });
    } catch (error) {
      console.error('Error fetching stats:', error);
    }
  };

  const callNextToken = async () => {
    try {
      // In a real app, this would be an actual API call
      // await axios.patch(`/api/token/next/${businessId}`);
      
      // Mock implementation
      const waitingTokens = queue.filter(token => token.status === 'waiting');
      if (waitingTokens.length > 0) {
        // Update current token to serving
        const updatedQueue = queue.map(token => {
          if (token._id === waitingTokens[0]._id) {
            return {...token, status: 'serving'};
          } else if (token.status === 'serving') {
            return {...token, status: 'completed'};
          }
          return token;
        });
        
        setQueue(updatedQueue);
        
        // Find the new serving token
        const servingToken = updatedQueue.find(token => token.status === 'serving');
        setCurrentToken(servingToken || null);
        
        // Update stats
        setStats(prev => ({
          ...prev,
          servedToday: prev.servedToday + 1,
          queueLength: waitingTokens.length - 1
        }));
        
        // Play sound when calling next token
        if (audioEnabled) {
          playNotificationSound();
        }
        
        // Announce the token
        if (announcementsEnabled && servingToken) {
          announceToken(servingToken.tokenNumber);
        }
      }
    } catch (error) {
      console.error('Error calling next token:', error);
      setError('Failed to call next token');
    }
  };

  const playNotificationSound = () => {
    // Simulate sound with a beep
    try {
      const audioContext = new (window.AudioContext || window.webkitAudioContext)();
      const oscillator = audioContext.createOscillator();
      oscillator.type = 'sine';
      oscillator.frequency.setValueAtTime(800, audioContext.currentTime);
      oscillator.connect(audioContext.destination);
      oscillator.start();
      oscillator.stop(audioContext.currentTime + 0.1);
    } catch (e) {
      console.log('Audio not supported');
    }
  };

  const announceToken = (tokenNumber) => {
    if ('speechSynthesis' in window && announcementsEnabled) {
      const speech = new SpeechSynthesisUtterance(
        `Token number ${tokenNumber}, please proceed to counter.`
      );
      window.speechSynthesis.speak(speech);
    }
  };

  const markAsCompleted = async (tokenId) => {
    try {
      // In a real app, this would be an actual API call
      // await axios.patch(`/api/token/complete/${tokenId}`);
      
      // Mock implementation
      const updatedQueue = queue.map(token => 
        token._id === tokenId ? {...token, status: 'completed'} : token
      );
      
      setQueue(updatedQueue);
      
      // Update stats
      setStats(prev => ({
        ...prev,
        servedToday: prev.servedToday + 1
      }));
    } catch (error) {
      console.error('Error completing token:', error);
      setError('Failed to mark token as completed');
    }
  };

  const recallToken = (tokenNumber) => {
    if (announcementsEnabled) {
      announceToken(tokenNumber);
    }
  };

  const skipToken = async () => {
    try {
      // In a real app, this would be an actual API call
      // await axios.patch(`/api/token/skip/${businessId}`);
      
      // Mock implementation
      if (currentToken) {
        const updatedQueue = queue.map(token => 
          token._id === currentToken._id ? {...token, status: 'waiting'} : token
        );
        
        setQueue(updatedQueue);
        setCurrentToken(null);
        callNextToken(); // Call the next token
      }
    } catch (error) {
      console.error('Error skipping token:', error);
      setError('Failed to skip token');
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
          borderTop: '4px solid #1890ff',
          borderRadius: '50%',
          animation: 'spin 1s linear infinite',
          marginBottom: '16px'
        }}></div>
        <p>Loading dashboard...</p>
        <style>{`
          @keyframes spin {
            0% { transform: rotate(0deg); }
            100% { transform: rotate(360deg); }
          }
        `}</style>
      </div>
    );
  }

  const waitingCount = queue.filter(token => token.status === 'waiting').length;

  return (
    <div style={{
      padding: '20px',
      maxWidth: '1200px',
      margin: '0 auto',
      fontFamily: 'Segoe UI, Tahoma, Geneva, Verdana, sans-serif',
      color: '#333'
    }}>
      <header style={{
        display: 'flex',
        justifyContent: 'space-between',
        alignItems: 'center',
        marginBottom: '24px',
        paddingBottom: '16px',
        borderBottom: '1px solid #eaeaea'
      }}>
        <h1 style={{ margin: 0, color: '#2c3e50' }}>Admin Dashboard</h1>
        <div style={{ display: 'flex', gap: '8px' }}>
          <button 
            style={{
              background: 'none',
              border: '1px solid #ddd',
              borderRadius: '6px',
              width: '40px',
              height: '40px',
              cursor: 'pointer',
              fontSize: '16px',
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center',
              transition: 'all 0.2s ease',
              backgroundColor: audioEnabled ? '#e6f7ff' : 'transparent',
              borderColor: audioEnabled ? '#1890ff' : '#ddd'
            }}
            onClick={() => setAudioEnabled(!audioEnabled)}
            title="Toggle sound"
          >
            🔊
          </button>
          <button 
            style={{
              background: 'none',
              border: '1px solid #ddd',
              borderRadius: '6px',
              width: '40px',
              height: '40px',
              cursor: 'pointer',
              fontSize: '16px',
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center',
              transition: 'all 0.2s ease',
              backgroundColor: announcementsEnabled ? '#e6f7ff' : 'transparent',
              borderColor: announcementsEnabled ? '#1890ff' : '#ddd'
            }}
            onClick={() => setAnnouncementsEnabled(!announcementsEnabled)}
            title="Toggle announcements"
          >
            📢
          </button>
          <button 
            style={{
              background: 'none',
              border: '1px solid #ddd',
              borderRadius: '6px',
              width: '40px',
              height: '40px',
              cursor: 'pointer',
              fontSize: '16px',
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center',
              transition: 'all 0.2s ease'
            }}
            onClick={fetchQueue}
            title="Refresh"
          >
            🔄
          </button>
        </div>
      </header>

      {error && (
        <div style={{
          backgroundColor: '#fff2f0',
          border: '1px solid #ffccc7',
          padding: '12px 16px',
          borderRadius: '6px',
          marginBottom: '20px',
          display: 'flex',
          justifyContent: 'space-between',
          alignItems: 'center'
        }}>
          <span>{error}</span>
          <button 
            onClick={() => setError(null)}
            style={{
              background: 'none',
              border: 'none',
              fontSize: '18px',
              cursor: 'pointer',
              color: '#999'
            }}
          >
            ×
          </button>
        </div>
      )}

      <div>
        <div style={{
          display: 'grid',
          gridTemplateColumns: 'repeat(auto-fit, minmax(200px, 1fr))',
          gap: '16px',
          marginBottom: '24px'
        }}>
          <div style={{
            background: 'white',
            borderRadius: '8px',
            padding: '20px',
            boxShadow: '0 2px 8px rgba(0, 0, 0, 0.1)',
            textAlign: 'center'
          }}>
            <h3 style={{
              margin: '0 0 12px 0',
              fontSize: '14px',
              color: '#666',
              textTransform: 'uppercase',
              letterSpacing: '0.5px'
            }}>Currently Serving</h3>
            <div style={{
              fontSize: '28px',
              fontWeight: 'bold',
              color: '#2c3e50',
              marginBottom: '8px'
            }}>
              {currentToken ? `Token #${currentToken.tokenNumber}` : 'None'}
            </div>
            {currentToken && (
              <button 
                style={{
                  backgroundColor: '#f0f7ff',
                  color: '#1890ff',
                  border: '1px solid #91d5ff',
                  borderRadius: '4px',
                  padding: '6px 12px',
                  fontSize: '12px',
                  cursor: 'pointer',
                  transition: 'all 0.2s'
                }}
                onClick={() => recallToken(currentToken.tokenNumber)}
              >
                Announce Again
              </button>
            )}
          </div>

          <div style={{
            background: 'white',
            borderRadius: '8px',
            padding: '20px',
            boxShadow: '0 2px 8px rgba(0, 0, 0, 0.1)',
            textAlign: 'center'
          }}>
            <h3 style={{
              margin: '0 0 12px 0',
              fontSize: '14px',
              color: '#666',
              textTransform: 'uppercase',
              letterSpacing: '0.5px'
            }}>Served Today</h3>
            <div style={{
              fontSize: '28px',
              fontWeight: 'bold',
              color: '#2c3e50',
              marginBottom: '8px'
            }}>{stats.servedToday}</div>
          </div>

          <div style={{
            background: 'white',
            borderRadius: '8px',
            padding: '20px',
            boxShadow: '0 2px 8px rgba(0, 0, 0, 0.1)',
            textAlign: 'center'
          }}>
            <h3 style={{
              margin: '0 0 12px 0',
              fontSize: '14px',
              color: '#666',
              textTransform: 'uppercase',
              letterSpacing: '0.5px'
            }}>Avg. Wait Time</h3>
            <div style={{
              fontSize: '28px',
              fontWeight: 'bold',
              color: '#2c3e50',
              marginBottom: '8px'
            }}>{stats.avgWaitTime} min</div>
          </div>

          <div style={{
            background: 'white',
            borderRadius: '8px',
            padding: '20px',
            boxShadow: '0 2px 8px rgba(0, 0, 0, 0.1)',
            textAlign: 'center'
          }}>
            <h3 style={{
              margin: '0 0 12px 0',
              fontSize: '14px',
              color: '#666',
              textTransform: 'uppercase',
              letterSpacing: '0.5px'
            }}>In Queue</h3>
            <div style={{
              fontSize: '28px',
              fontWeight: 'bold',
              color: '#2c3e50',
              marginBottom: '8px'
            }}>
              {waitingCount}
            </div>
          </div>
        </div>

        <div style={{
          display: 'flex',
          gap: '12px',
          marginBottom: '24px'
        }}>
          <button 
            onClick={callNextToken} 
            style={{
              padding: '12px 24px',
              borderRadius: '6px',
              fontSize: '16px',
              fontWeight: '500',
              cursor: waitingCount === 0 ? 'not-allowed' : 'pointer',
              transition: 'all 0.2s',
              border: 'none',
              backgroundColor: waitingCount === 0 ? '#ccc' : '#1890ff',
              color: 'white',
              opacity: waitingCount === 0 ? 0.6 : 1
            }}
            disabled={waitingCount === 0}
          >
            Call Next Token
          </button>
          <button 
            onClick={skipToken} 
            style={{
              padding: '12px 24px',
              borderRadius: '6px',
              fontSize: '16px',
              fontWeight: '500',
              cursor: !currentToken ? 'not-allowed' : 'pointer',
              transition: 'all 0.2s',
              border: 'none',
              backgroundColor: !currentToken ? '#ccc' : '#f0f0f0',
              color: '#333',
              opacity: !currentToken ? 0.6 : 1
            }}
            disabled={!currentToken}
          >
            Skip Current Token
          </button>
        </div>

        <div style={{
          background: 'white',
          borderRadius: '8px',
          padding: '24px',
          boxShadow: '0 2px 8px rgba(0, 0, 0, 0.1)'
        }}>
          <div style={{
            display: 'flex',
            justifyContent: 'space-between',
            alignItems: 'center',
            marginBottom: '20px'
          }}>
            <h2 style={{ margin: 0, color: '#2c3e50' }}>Token Queue</h2>
            <span style={{
              backgroundColor: '#f0f0f0',
              color: '#666',
              padding: '4px 12px',
              borderRadius: '12px',
              fontSize: '14px'
            }}>{queue.length} tokens</span>
          </div>

          <div style={{
            display: 'flex',
            borderBottom: '1px solid #eaeaea',
            marginBottom: '20px'
          }}>
            <button style={{
              background: 'none',
              border: 'none',
              padding: '10px 16px',
              cursor: 'pointer',
              color: '#1890ff',
              fontSize: '14px',
              borderBottom: '2px solid #1890ff'
            }}>
              All Tokens
            </button>
          </div>

          <div style={{
            maxHeight: '400px',
            overflowY: 'auto'
          }}>
            {queue.length === 0 ? (
              <div style={{
                textAlign: 'center',
                padding: '40px',
                color: '#999'
              }}>
                <p>No tokens in the queue</p>
              </div>
            ) : (
              queue.map((token) => (
                <div 
                  key={token._id} 
                  style={{
                    display: 'flex',
                    justifyContent: 'space-between',
                    alignItems: 'center',
                    padding: '16px',
                    borderBottom: '1px solid #f0f0f0',
                    transition: 'background-color 0.2s',
                    backgroundColor: token === currentToken ? '#e6f7ff' : 'white',
                    borderLeft: `4px solid ${
                      token.status === 'serving' ? '#1890ff' : 
                      token.status === 'waiting' ? '#faad14' : '#52c41a'
                    }`
                  }}
                >
                  <div style={{
                    display: 'flex',
                    alignItems: 'center',
                    gap: '16px'
                  }}>
                    <span style={{
                      fontSize: '18px',
                      fontWeight: 'bold',
                      color: '#2c3e50',
                      minWidth: '80px'
                    }}>#{token.tokenNumber}</span>
                    <span style={{
                      padding: '4px 8px',
                      borderRadius: '4px',
                      fontSize: '12px',
                      textTransform: 'uppercase',
                      fontWeight: '500',
                      backgroundColor: token.status === 'serving' ? '#e6f7ff' : 
                                      token.status === 'waiting' ? '#fffbe6' : '#f6ffed',
                      color: token.status === 'serving' ? '#1890ff' : 
                            token.status === 'waiting' ? '#faad14' : '#52c41a'
                    }}>
                      {token.status}
                    </span>
                    <span style={{
                      color: '#999',
                      fontSize: '14px'
                    }}>
                      {token.createdAt ? new Date(token.createdAt).toLocaleTimeString() : ''}
                    </span>
                  </div>
                  
                  <div style={{
                    display: 'flex',
                    gap: '8px'
                  }}>
                    {token.status === 'serving' && (
                      <button 
                        style={{
                          background: 'none',
                          border: '1px solid #ddd',
                          borderRadius: '4px',
                          width: '32px',
                          height: '32px',
                          cursor: 'pointer',
                          display: 'flex',
                          alignItems: 'center',
                          justifyContent: 'center',
                          transition: 'all 0.2s'
                        }}
                        onClick={() => markAsCompleted(token._id)}
                        title="Mark as completed"
                      >
                        ✓
                      </button>
                    )}
                    {token.status === 'waiting' && (
                      <button 
                        style={{
                          background: 'none',
                          border: '1px solid #ddd',
                          borderRadius: '4px',
                          width: '32px',
                          height: '32px',
                          cursor: 'pointer',
                          display: 'flex',
                          alignItems: 'center',
                          justifyContent: 'center',
                          transition: 'all 0.2s'
                        }}
                        onClick={() => recallToken(token.tokenNumber)}
                        title="Announce token"
                      >
                        📢
                      </button>
                    )}
                  </div>
                </div>
              ))
            )}
          </div>
        </div>
      </div>
    </div>
  );
};

export default AdminDashboard;