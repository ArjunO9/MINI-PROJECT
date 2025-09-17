import React, { useState, useEffect } from 'react';
import axios from 'axios';
import io from 'socket.io-client';

const AdminDashboard = () => {
    const [business, setBusiness] = useState(null);
    const [tokens, setTokens] = useState([]);
    const [socket, setSocket] = useState(null);

    useEffect(() => {
        const fetchBusinessData = async () => {
            try {
                const res = await axios.get('/api/business');
                setBusiness(res.data);
                
                const tokenRes = await axios.get(`/api/token/${res.data._id}`);
                setTokens(tokenRes.data);

                // Setup socket connection
                const newSocket = io('http://localhost:5000');
                newSocket.emit('join-room', res.data._id);

                newSocket.on('new-token', (newToken) => {
                    setTokens(prevTokens => [...prevTokens, newToken]);
                });

                newSocket.on('token-update', (updatedToken) => {
                    setTokens(prevTokens => prevTokens.map(t => t._id === updatedToken._id ? updatedToken : t));
                });
                
                setSocket(newSocket);
            } catch (err) {
                console.error(err);
            }
        };

        fetchBusinessData();

        return () => {
            if(socket) socket.disconnect();
        }
    }, []);

    const handleCallNext = async () => {
        const waitingTokens = tokens.filter(t => t.status === 'waiting');
        if (waitingTokens.length > 0) {
            const nextToken = waitingTokens[0];
            try {
                await axios.put(`/api/token/${nextToken._id}`, { status: 'serving' });
            } catch (err) {
                console.error('Error calling next token', err);
            }
        }
    };

    if (!business) return <div>Loading...</div>;

    const servingToken = tokens.find(t => t.status === 'serving');
    const waitingTokens = tokens.filter(t => t.status === 'waiting');

    return (
        <div>
            <h2>{business.name} - Dashboard</h2>
            <p>Tier: {business.tier}</p>
            {business.qrCode && <img src={business.qrCode} alt="QR Code" />}

            <div>
                <h3>Currently Serving: {servingToken ? servingToken.tokenNumber : 'None'}</h3>
                <button onClick={handleCallNext} disabled={waitingTokens.length === 0}>Call Next</button>
            </div>

            <h3>Waiting Queue</h3>
            <ul>
                {waitingTokens.map(token => <li key={token._id}>Token #{token.tokenNumber}</li>)}
            </ul>
        </div>
    );
};

export default AdminDashboard;