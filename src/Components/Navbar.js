import React, { useState } from 'react';
import { Link } from 'react-router-dom';
import '../App.css';

const Navbar = () => {
  const [showDropdown, setShowDropdown] = useState(false);
  const username = localStorage.getItem('username') || '';

  const handleLogout = () => {
    localStorage.removeItem("username");
    localStorage.removeItem("token");
    window.location.href = '/auth';
  };

  return (
    <nav className="navbar">
      <div className="navbar-content">
        <h1>Wearable Health and Activity Tracker</h1>
        <div className="nav-buttons">
          <Link to="/"><button className="nav-btn">Home</button></Link>
          <Link to="/heart-rate"><button className="nav-btn">Heart Rate</button></Link>
          <Link to="/temp"><button className="nav-btn">Skin Temperature</button></Link>
          <Link to="/map"><button className="nav-btn">Location</button></Link>
          <Link to="/exercise"><button className="nav-btn">Exercise</button></Link>
          <div className="user-menu-container">
            <button
              className="user-greeting-btn"
              onClick={() => setShowDropdown(!showDropdown)}
            >
              <div
                className="user-avatar"
                style={{ backgroundColor: '#007bff' }}
              >
                {username.charAt(0).toUpperCase()}
              </div>
              {username}
            </button>
            {showDropdown && (
              <div className="dropdown-menu">
                <Link to="/profile"><button className="profile-btn">Profile</button></Link>
                <button
                  className="logout-btn"
                  onClick={handleLogout}
                >
                  Logout
                </button>
              </div>
            )}
          </div>
        </div>
      </div>
    </nav>
  );
};

export default Navbar; 