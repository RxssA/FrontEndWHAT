import React, { useEffect, useState } from 'react';
import axios from 'axios';

const UserProfile = () => {
    const [user, setUser] = useState(null);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState(null);
    useEffect(() => {
        // Get the JWT token from local storage (or any other method you're using for auth)
        const token = localStorage.getItem('token');
    
        if (!token) {
          setError('No token found. Please log in.');
          setLoading(false);
          return;
        }
    
        // Fetch user profile data
        axios
          .get('http://192.168.0.23:4000/profile', {
            headers: { Authorization: `Bearer ${token}` },
          })
          .then((response) => {
            setUser(response.data.user);
            setLoading(false);
          })
          .catch((error) => {
            setError('Failed to fetch user data');
            setLoading(false);
            console.error(error);
          });
      }, []);
    
      if (loading) {
        return <div>Loading...</div>;
      }
    
      if (error) {
        return <div>{error}</div>;
      }
    
      return (
        <div>
          <h1>User Profile</h1>
          <div>
            <p><strong>Name:</strong> {user.name}</p>
            <p><strong>Age:</strong> {user.age}</p>
            <p><strong>Weight:</strong> {user.weight} kg</p>
            <p><strong>Gender:</strong> {user.gender}</p>
          </div>
        </div>
      );
    };
    
    export default UserProfile;