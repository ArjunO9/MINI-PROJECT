import React, { useState, useEffect } from 'react';
import { useParams } from 'react-router-dom';
import axios from 'axios';
import io from 'socket.io-client';

const TokenPage = () => {
    const { businessId } = useParams();
    const [business, setBusiness] = useState(null);
    const [userToken, setUserToken] = useState(null);
    const [servingToken, setServingToken] = useState(null);
    const [socket, setSocket] = useState(null);
    
    useEffect(() => {
        // We need to get business details to know the tier and form schema
        const fetchBusiness = async () => {
            try {
                // This is a public route we need to create on the backend
                // to fetch business details without auth.
                // Let's assume it exists at /api/business/public/:id
                const res = await axios.get(`/api/business/public/${businessId}`);
                setBusiness(res.data);
            } catch (err) {
                console.error(err);
            }
        }
        fetchBusiness();
        
        // Setup socket
        const newSocket = io('http://localhost:5000');
        newSocket.emit('join-room', businessId);
        newSocket.on('token-update', (updatedToken) => {
            if (updatedToken.status === 'serving') {
                setServingToken(updatedToken);
            }
        });
        setSocket(newSocket);
        
        return () => newSocket.disconnect();

    }, [businessId]);

    const handleGetToken = async () => {
        try {
            const res = await axios.post('/api/token/generate', { businessId });
            setUserToken(res.data);
        } catch (err) {
            console.error(err);
        }
    };
    
    if (!business) return <div>Loading business details...</div>;

    if (userToken) {
        return (
            <div>
                <h1>Your Token for {business.name}</h1>
                <h2>Your Number: {userToken.tokenNumber}</h2>
                <h3>Currently Serving: {servingToken ? servingToken.tokenNumber : '...'}</h3>
            </div>
        )
    }

    return (
        <div>
            <h1>Welcome to {business.name}</h1>
            <button onClick={handleGetToken}>Get a Token</button>
        </div>
    );
};

export default TokenPage;