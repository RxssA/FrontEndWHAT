import React, { useEffect, useState } from 'react';
import axios from 'axios';
import styles from './UserProfile.module.css';
import Navbar from '../Components/Navbar';
import '../App.css';



const UserProfile = () => {
    const [user, setUser] = useState(null);
    const [walkReports, setWalkReports] = useState([]);
    const [runReports, setRunReports] = useState([]);
    const [workoutReports, setWorkoutReport] = useState([]);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState(null);

    useEffect(() => {
        const token = localStorage.getItem('token');
        const username = localStorage.getItem('username');

        if (!token || !username) {
            setError('Please log in to view your profile');
            setLoading(false);
            return;
        }

        const fetchUserData = async () => {
            try {
                // Fetch user profile data
                const userResponse = await axios.get(`http://${process.env.REACT_APP_API_URL}/profile`, {
                    headers: { Authorization: `Bearer ${token}` },
                });
                setUser(userResponse.data.user);

                // Fetch workout history
                const workoutResponse = await axios.get(`http://${process.env.REACT_APP_API_URL}/workoutHistory`, {
                    headers: { Authorization: `Bearer ${token}` },
                });
                setWorkoutReport(workoutResponse.data.data || []);

                setLoading(false);
            } catch (error) {
                console.error('Error fetching user data:', error);
                setError('Failed to fetch profile data');
                setLoading(false);
            }
        };

        fetchUserData();
    }, []);

    const fetchAllWalkReports = async () => {
        const token = localStorage.getItem('token');
        if (!token) {
            setError('Please log in to view reports');
            return;
        }

        try {
            const response = await axios.get(`http://${process.env.REACT_APP_API_URL}/walkreports`, {
                headers: { Authorization: `Bearer ${token}` },
            });
            setWalkReports(response.data || []);
        } catch (error) {
            console.error('Error fetching walk reports:', error);
            setError('Failed to fetch walk reports');
        }
    };

    const fetchAllRunReports = async () => {
        const token = localStorage.getItem('token');
        if (!token) {
            setError('Please log in to view reports');
            return;
        }

        try {
            const response = await axios.get(`http://${process.env.REACT_APP_API_URL}/runreports`, {
                headers: { Authorization: `Bearer ${token}` },
            });
            setRunReports(response.data || []);
        } catch (error) {
            console.error('Error fetching run reports:', error);
            setError('Failed to fetch run reports');
        }
    };

    const fetchAllWorkoutReports = async () => {
        const token = localStorage.getItem('token');
        if (!token) {
            setError('Please log in to view reports');
            return;
        }

        try {
            const response = await axios.get(`http://${process.env.REACT_APP_API_URL}/workoutHistory`, {
                headers: { Authorization: `Bearer ${token}` },
            });
            setWorkoutReport(response.data.data || []);
        } catch (error) {
            console.error('Error fetching workout reports:', error);
            setError('Failed to fetch workout reports');
        }
    };

    const formatTime = (seconds) => {
        const hrs = Math.floor(seconds / 3600).toString().padStart(2, "0");
        const mins = Math.floor((seconds % 3600) / 60).toString().padStart(2, "0");
        const secs = (seconds % 60).toString().padStart(2, "0");
        return `${hrs}:${mins}:${secs}`;
    };

    const deleteWalkReport = async (reportId) => {
        const token = localStorage.getItem('token');
        if (!token) {
            setError('Please log in to delete reports');
            return;
        }

        try {
            await axios.delete(`http://${process.env.REACT_APP_API_URL}/walkreports/${reportId}`, {
                headers: { Authorization: `Bearer ${token}` },
            });
            setWalkReports(walkReports.filter(report => report._id !== reportId));
        } catch (error) {
            console.error('Error deleting walk report:', error);
            setError('Failed to delete walk report');
        }
    };

    const deleteRunReport = async (reportId) => {
        const token = localStorage.getItem('token');
        if (!token) {
            setError('Please log in to delete reports');
            return;
        }

        try {
            await axios.delete(`http://${process.env.REACT_APP_API_URL}/runreports/${reportId}`, {
                headers: { Authorization: `Bearer ${token}` },
            });
            setRunReports(runReports.filter(report => report._id !== reportId));
        } catch (error) {
            console.error('Error deleting run report:', error);
            setError('Failed to delete run report');
        }
    };

    const deleteWorkoutReport = async (reportId) => {
        const token = localStorage.getItem('token');
        if (!token) {
            setError('Please log in to delete reports');
            return;
        }

        try {
            await axios.delete(`http://${process.env.REACT_APP_API_URL}/workoutHistory/${reportId}`, {
                headers: { Authorization: `Bearer ${token}` },
            });
            setWorkoutReport(workoutReports.filter(report => report._id !== reportId));
        } catch (error) {
            console.error('Error deleting workout report:', error);
            setError('Failed to delete workout report');
        }
    };

    if (loading) {
        return (
            <div className="App">
                <Navbar />
                <div className="content">
                    <div className="profile-page">
                        <div className={styles["profile-container"]}>
                            <div className={styles.loading}>Loading profile data...</div>
                        </div>
                    </div>
                </div>
            </div>
        );
    }

    if (error) {
        return (
            <div className="App">
                <Navbar />
                <div className="content">
                    <div className="profile-page">
                        <div className={styles["profile-container"]}>
                            <div className={styles.error}>{error}</div>
                        </div>
                    </div>
                </div>
            </div>
        );
    }

    return (
        <div className="App">
            <Navbar />
            <div className="content">
                <div className="profile-page">
                    <div className={styles["profile-container"]}>
                        <h1>User Profile</h1>
                        <div className={styles["user-info"]}>
                            <h2>Personal Information</h2>
                            <p><strong>Name:</strong> {user.name}</p>
                            <p><strong>Age:</strong> {user.age}</p>
                            <p><strong>Weight:</strong> {user.weight} kg</p>
                            <p><strong>Height:</strong> {user.height} cm</p>
                            <p><strong>Gender:</strong> {user.gender}</p>
                        </div>

                        <div className={styles["report-buttons"]}>
                            <button onClick={fetchAllWalkReports} className={styles["report-button"]}>Retrieve All Walk Reports</button>
                            <button onClick={fetchAllRunReports} className={styles["report-button"]}>Retrieve All Run Reports</button>
                            <button onClick={fetchAllWorkoutReports} className={styles["report-button"]}>Retrieve All Workout Reports</button>
                        </div>

                        {walkReports.length > 0 && (
                            <div className={styles["report-section"]}>
                                <h2>Walk Reports</h2>
                                <div className={styles["report-grid"]}>
                                    {walkReports.map((report, index) => (
                                        <div key={index} className={styles["report-card"]}>
                                            <div className={styles["report-header"]}>
                                                <h3>Walk {index + 1}</h3>
                                                
                                            </div>
                                            <div className={styles["report-details"]}>
                                                <p><strong>Date:</strong> {new Date(report.startTime).toLocaleDateString()}</p>
                                                <p><strong>Duration:</strong> {formatTime(report.time)}</p>
                                                <p><strong>Distance:</strong> {(report.distance / 1000).toFixed(2)} km</p>
                                                <p><strong>Pace:</strong> {report.pace}</p>
                                                <p><strong>Calories Burned:</strong> {report.caloriesBurned} kcal</p>
                                                <p><strong>Start Time:</strong> {new Date(report.startTime).toLocaleTimeString()}</p>
                                                <p><strong>End Time:</strong> {new Date(report.endTime).toLocaleTimeString()}</p>
                                                <button 
                                                    onClick={() => deleteWalkReport(report._id)}
                                                    className={styles["delete-button"]}
                                                >
                                                    Delete
                                                </button>
                                            </div>
                                        </div>
                                    ))}
                                </div>
                            </div>
                        )}

                        {runReports.length > 0 && (
                            <div className={styles["report-section"]}>
                                <h2>Run Reports</h2>
                                <div className={styles["report-grid"]}>
                                    {runReports.map((report, index) => (
                                        <div key={index} className={styles["report-card"]}>
                                            <div className={styles["report-header"]}>
                                                <h3>Run {index + 1}</h3>
                                                
                                            </div>
                                            <div className={styles["report-details"]}>
                                                <p><strong>Date:</strong> {new Date(report.startTime).toLocaleDateString()}</p>
                                                <p><strong>Duration:</strong> {formatTime(report.time)}</p>
                                                <p><strong>Distance:</strong> {(report.distance / 1000).toFixed(2)} km</p>
                                                <p><strong>Pace:</strong> {report.pace}</p>
                                                <p><strong>Calories Burned:</strong> {report.caloriesBurned} kcal</p>
                                                <p><strong>Start Time:</strong> {new Date(report.startTime).toLocaleTimeString()}</p>
                                                <p><strong>End Time:</strong> {new Date(report.endTime).toLocaleTimeString()}</p>
                                                <button 
                                                    onClick={() => deleteRunReport(report._id)}
                                                    className={styles["delete-button"]}
                                                >
                                                    Delete
                                                </button>
                                            </div>
                                        </div>
                                    ))}
                                </div>
                            </div>
                        )}

                        {workoutReports.length > 0 && (
                            <div className={styles["report-section"]}>
                                <h2>Workout Reports</h2>
                                <div className={styles["report-grid"]}>
                                    {workoutReports.map((report, index) => (
                                        <div key={report._id || index} className={styles["report-card"]}>
                                            <div className={styles["report-header"]}>
                                                <h3>Workout {index + 1}</h3>
                                                
                                            </div>
                                            <div className={styles["report-details"]}>
                                                <p><strong>Date:</strong> {new Date(report.startTime).toLocaleDateString()}</p>
                                                <p><strong>Duration:</strong> {formatTime(report.time)}</p>
                                                <p><strong>Start Time:</strong> {new Date(report.startTime).toLocaleTimeString()}</p>
                                                <p><strong>End Time:</strong> {new Date(report.endTime).toLocaleTimeString()}</p>
                                                <button 
                                                    onClick={() => deleteWorkoutReport(report._id)}
                                                    className={styles["delete-button"]}
                                                >
                                                    Delete
                                                </button>
                                            </div>
                                            <div className={styles["exercises-list"]}>
                                                <h4>Exercises</h4>
                                                {report.exercises.map((exercise, exIndex) => (
                                                    <div key={exIndex} className={styles["exercise-item"]}>
                                                        <p><strong>{exercise.name}</strong></p>
                                                        <p>Weight: {exercise.weight} kg</p>
                                                        <p>Reps: {exercise.reps}</p>
                                                        <p>Sets: {exercise.sets}</p>
                                                    </div>
                                                ))}
                                            </div>
                                        </div>
                                    ))}
                                </div>
                            </div>
                        )}
                    </div>
                </div>
            </div>
        </div>
    );
};

export default UserProfile;