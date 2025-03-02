import React, { useState } from 'react';
import './Login.module.css';

const LoginPage = ({ onLoginSuccess }) => {
  const [credentials, setCredentials] = useState({ name: '', password: '' });
  const [message, setMessage] = useState('');

  const handleChange = (e) => {
    setCredentials({ ...credentials, [e.target.name]: e.target.value });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    
    const response = await fetch('http://192.168.178.200:4000/login', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(credentials),
    });
    
    const result = await response.json();
  
    if (result.status === 'success') {
      localStorage.setItem('token', result.token);
      localStorage.setItem('username', credentials.name); // Store username
      setMessage('Login successful! Redirecting...');
      onLoginSuccess(credentials.name); // Trigger parent state update
      setTimeout(() => window.location.href = '/', 1000);
    } else {
      setMessage(result.message || 'Login failed');
    }
  };

  return (
    <div>
      <h2>Login</h2>
      <form onSubmit={handleSubmit}>
        <input type="text" name="name" placeholder="Name" onChange={handleChange} required />
        <input type="password" name="password" placeholder="Password" onChange={handleChange} required />
        <button type="submit">Login</button>
      </form>
      <p>{message}</p>
    </div>
  );
};

export default LoginPage;
