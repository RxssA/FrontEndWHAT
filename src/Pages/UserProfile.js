import React, { useEffect, useState } from 'react';
import axios from 'axios';
import styles from './UserProfile.module.css';


const UserProfile = () => {
    const [user, setUser] = useState(null);
    const [walkReports, setWalkReports] = useState([]); // Store all users' walk reports
    const [runReports, setRunReports] = useState([]); // Store all users' walk reports
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState(null);
    const [workoutHistory, setWorkoutHistory] = useState([]);

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

        // Fetch workout history
        axios.get('http://192.168.0.23:4000/workoutreport', {
            headers: { Authorization: `Bearer ${token}` },
        })
            .then((workoutResponse) => {
                setWorkoutHistory(workoutResponse.data);
            })
            .catch((error) => {
                console.error('Error fetching workout history:', error);
                alert('Failed to fetch workout history.');
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

    const formatTime = (seconds) => {
        const hrs = Math.floor(seconds / 3600).toString().padStart(2, "0");
        const mins = Math.floor((seconds % 3600) / 60).toString().padStart(2, "0");
        const secs = (seconds % 60).toString().padStart(2, "0");
        return `${hrs}:${mins}:${secs}`;
    };

    if (loading) {
        return <div>Loading...</div>;
    }

    if (error) {
        return <div>{error}</div>;
    }

    return (
        <div className={styles["profile-container"]}>
            <h1>User Profile</h1>
            <div className={styles["user-info"]}>
                <h2>Personal Information</h2>
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

            <div className={styles["workout-history"]}>
                <h2>Workout History</h2>
                {workoutHistory.length > 0 ? (
                    <div className={styles["workout-grid"]}>
                        {workoutHistory.map((workout, index) => (
                            <div key={index} className={styles["workout-card"]}>
                                <h3>Workout {index + 1}</h3>
                                <div className={styles["workout-details"]}>
                                    <p><strong>Date:</strong> {new Date(workout.startTime).toLocaleDateString()}</p>
                                    <p><strong>Duration:</strong> {formatTime(workout.time)}</p>
                                    <p><strong>Start Time:</strong> {new Date(workout.startTime).toLocaleTimeString()}</p>
                                    <p><strong>End Time:</strong> {new Date(workout.endTime).toLocaleTimeString()}</p>
                                </div>
                                <div className={styles["exercises-list"]}>
                                    <h4>Exercises</h4>
                                    {workout.exercises.map((exercise, exIndex) => (
                                        <div key={exIndex} className={styles["exercise-item"]}>
                                            <p><strong>{exercise.name}</strong></p>
                                            <p>Weight: {exercise.weight} lbs</p>
                                            <p>Reps: {exercise.reps}</p>
                                            <p>Sets: {exercise.sets}</p>
                                        </div>
                                    ))}
                                </div>
                            </div>
                        ))}
                    </div>
                ) : (
                    <p>No workout history available.</p>
                )}
            </div>
        </div>
    );
};

export default UserProfile;
