import React, { useState } from 'react';
import axios from 'axios';
import { useNavigate } from 'react-router-dom'; // Import useNavigate
import setAuthToken from '../../services/setAuthToken';

const Register = () => {
  const navigate = useNavigate(); // Initialize navigate
  const [formData, setFormData] = useState({
    name: '',
    email: '',
    password: '',
    businessName: '',
    tier: 'Basic'
  });

  const { name, email, password, businessName, tier } = formData;

  const onChange = e => setFormData({ ...formData, [e.target.name]: e.target.value });

  const onSubmit = async e => {
    e.preventDefault();
    try {
      const res = await axios.post('/api/auth/register', formData);
      localStorage.setItem('token', res.data.token);
      setAuthToken(res.data.token);
      navigate('/dashboard'); // Use navigate to redirect
    } catch (err) {
      console.error(err.response.data);
      alert('Registration failed. User may already exist.'); // Give user feedback
    }
  };

  return (
    <div className="form-container">
      <h1>Register</h1>
      <form onSubmit={onSubmit}>
        <div className="form-group">
          <label>Name</label>
          <input type="text" name="name" value={name} onChange={onChange} required />
        </div>
        <div className="form-group">
          <label>Email</label>
          <input type="email" name="email" value={email} onChange={onChange} required />
        </div>
        <div className="form-group">
          <label>Password</label>
          <input type="password" name="password" value={password} onChange={onChange} required minLength="6" />
        </div>
        <div className="form-group">
          <label>Business Name</label>
          <input type="text" name="businessName" value={businessName} onChange={onChange} required />
        </div>
        <div className="form-group">
          <label>Subscription Tier</label>
          <select name="tier" value={tier} onChange={onChange}>
            <option value="Basic">Basic</option>
            <option value="Data Collection">Data Collection</option>
            <option value="Prepaid">Prepaid</option>
          </select>
        </div>
        <input type="submit" value="Register" className="btn btn-primary" />
      </form>
    </div>
  );
};

export default Register;