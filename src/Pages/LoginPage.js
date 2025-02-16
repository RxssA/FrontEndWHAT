import React, { useState } from 'react';

const LoginPage = () => {
  const [credentials, setCredentials] = useState({ name: '', password: '' });
  const [message, setMessage] = useState('');

  const handleChange = (e) => {
    setCredentials({ ...credentials, [e.target.name]: e.target.value });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    
    const response = await fetch('http://192.168.0.23:4000/login', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(credentials),
    });

    const result = await response.json();

    if (result.status === 'success') {
      localStorage.setItem('token', result.token);
      setMessage('Login successful! Redirecting...');
      setTimeout(() => window.location.href = '/', 2000);
    } else {
      setMessage(result.message);
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
