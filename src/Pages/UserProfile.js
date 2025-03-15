import React, { useEffect, useState } from 'react';
import axios from 'axios';
import './UserProfile.module.css';


const UserProfile = () => {
    const [user, setUser] = useState(null);
    const [walkReports, setWalkReports] = useState([]); // Store all users' walk reports
    const [runReports, setRunReports] = useState([]); // Store all users' walk reports
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState(null);

    useEffect(() => {
        const token = localStorage.getItem('token');

        if (!token) {
            setError('No token found. Please log in.');
            setLoading(false);
            return;
        }

        // Fetch user profile data
        axios.get('http://192.168.0.23:4000/profile', {
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

    // Fetch all users' walk reports
    const fetchAllWalkReports = async () => {
        const token = localStorage.getItem('token');
        if (!token) {
            alert('No token found. Please log in.');
            return;
        }

        try {
            const response = await axios.get('http://192.168.0.23:4000/walkreports', {
                headers: { Authorization: `Bearer ${token}` },
            });
            setWalkReports(response.data); // Store the reports in state
        } catch (error) {
            console.error('Error fetching walk reports:', error);
            alert('Failed to fetch walk reports.');
        }
    };

    const fetchAllRunReports = async () => {
        const token = localStorage.getItem('token');
        if (!token) {
            alert('No token found. Please log in.');
            return;
        }

        try {
            const response = await axios.get('http://192.168.0.23:4000/runreports', {
                headers: { Authorization: `Bearer ${token}` },
            });
            setRunReports(response.data); // Store the reports in state
        } catch (error) {
            console.error('Error fetching walk reports:', error);
            alert('Failed to fetch walk reports.');
        }
    };

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
            <button onClick={fetchAllWalkReports}>Retrieve All Walk Reports</button>
            <button onClick={fetchAllRunReports}>Retrieve All Run Reports</button>
            {walkReports.length > 0 ? (
                <div>
                    <h2>All Walk Reports</h2>
                    <ul>
                        {walkReports.map((report, index) => (
                            <li key={index}>
                                <p><strong>Time:</strong> {report.time} seconds</p>
                                <p><strong>Distance:</strong> {report.distance} meters</p>
                                <p><strong>Calories Burned:</strong> {report.caloriesBurned} kcal</p>
                                <p><strong>Pace:</strong> {report.pace}</p>
                                <hr />
                            </li>
                        ))}
                    </ul>
                </div>
            ) : (
                <p>No walk reports available.</p>
            )}

            {runReports.length > 0 ? (
                <div>
                    <h2>All Run Reports</h2>
                    <ul>
                        {runReports.map((report, index) => (
                            <li key={index}>
                                <p><strong>Time:</strong> {report.time} seconds</p>
                                <p><strong>Distance:</strong> {report.distance} meters</p>
                                <p><strong>Calories Burned:</strong> {report.caloriesBurned} kcal</p>
                                <p><strong>Pace:</strong> {report.pace}</p>
                                <hr />
                            </li>
                        ))}
                    </ul>
                </div>
            ) : (
                <p>No run reports available.</p>
            )}
        </div>
    );
};

export default UserProfile;
