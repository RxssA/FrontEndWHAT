import React from 'react';
import '../App.css';

const Footer = () => {
  return (
    <footer className="footer">
      <p>&copy; {new Date().getFullYear()} Wearable Health and Activity Tracker</p>
      <p>Contact us at: support@WHAT.com</p>
    </footer>
  );
};

export default Footer;
