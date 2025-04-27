import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import './Signup.module.css';

const SignupPage = ({ onSignupSuccess }) => {
  const [formData, setFormData] = useState({
    name: '',
    password: '',
    age: '',
    weight: '',
    height: '',
    gender: '',
    consent: false
  });

  const [message, setMessage] = useState('');
  const navigate = useNavigate();

  const handleChange = (e) => {
    const value = e.target.type === 'checkbox' ? e.target.checked : e.target.value;
    setFormData({ ...formData, [e.target.name]: value });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    
    if (!formData.consent) {
      setMessage('You must agree to the biometric data collection to create an account');
      return;
    }
    
    const response = await fetch(`http://${process.env.REACT_APP_API_URL}/signup`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(formData),
    });
  
    const result = await response.json();
    setMessage(result.message);
  
    if (result.status === 'success') {
      localStorage.setItem('username', formData.name);
      localStorage.setItem('token', result.token);
      onSignupSuccess(formData.name);
      setTimeout(() => navigate('/'), 1000);
    }
  };

  return (
    <div className="signup-container">
      <h2>Sign Up</h2>
      <form onSubmit={handleSubmit}>
        <input type="text" name="name" placeholder="Name" onChange={handleChange} required />
        <input type="password" name="password" placeholder="Password" onChange={handleChange} required />
        <input type="number" name="age" placeholder="Age" onChange={handleChange} required />
        <input type="number" name="weight" placeholder="Weight (kg)" onChange={handleChange} required />
        <input type="number" name="height" placeholder="Height (cm)" onChange={handleChange} required />
        <select name="gender" onChange={handleChange} required>
          <option value="">Select Gender</option>
          <option value="male">Male</option>
          <option value="female">Female</option>
          <option value="other">Other</option>
        </select>
        
        <div className="consent-section">
          <label className="consent-label">
            <input 
              type="checkbox" 
              name="consent" 
              checked={formData.consent}
              onChange={handleChange}
              required
            />
            <span className="consent-text">
              I agree to have my biometric data (heart rate, temperature, and location) recorded and stored for health monitoring purposes.
            </span>
          </label>
        </div>

        <button type="submit">Sign Up</button>
      </form>
      <p className="message">{message}</p>
    </div>
  );
};

export default SignupPage;
