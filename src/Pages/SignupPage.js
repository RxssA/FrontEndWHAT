import React, { useState } from 'react';
import './Signup.module.css';

const SignupPage = ({ onSignupSuccess }) => {
  const [formData, setFormData] = useState({
    name: '',
    password: '',
    age: '',
    weight: '',
    gender: ''
  });

  const [message, setMessage] = useState('');

  const handleChange = (e) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    
    const response = await fetch('http://172.20.10.12:4000/signup', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(formData),
    });

    const result = await response.json();
    setMessage(result.message);

    if (response.ok && result.success) {
    localStorage.setItem("username", result.username);
    onSignupSuccess(result.username);
  }

  };

  return (
    <div>
      <h2>Sign Up</h2>
      <form onSubmit={handleSubmit}>
        <input type="text" name="name" placeholder="Name" onChange={handleChange} required />
        <input type="password" name="password" placeholder="Password" onChange={handleChange} required />
        <input type="number" name="age" placeholder="Age" onChange={handleChange} required />
        <input type="number" name="weight" placeholder="Weight (kg)" onChange={handleChange} required />
        <select name="gender" onChange={handleChange} required>
          <option value="">Select Gender</option>
          <option value="male">Male</option>
          <option value="female">Female</option>
          <option value="other">Other</option>
        </select>
        <button type="submit">Sign Up</button>
      </form>
      <p>{message}</p>
    </div>
  );
};

export default SignupPage;
