import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import styles from './Workout.module.css';

const WorkoutPage = ({ data }) => {
  const [time, setTime] = useState(0);
  const [isWorking, setIsWorking] = useState(false);

  const navigate = useNavigate();

  useEffect(() => {
    let intervalId;

    if (isWorking) {
      intervalId = setInterval(() => {
        setTime((prevTime) => prevTime + 1);
      }, 1000);
    }

    return () => {
      clearInterval(intervalId);
    };
  }, [isWorking]);

  const handleStartWorkout = () => {
    setIsWorking(true);
    setTime(0); // Reset timer
  };

  const handleEndWorkout = () => {
    setIsWorking(false);
    navigate('/WorkoutReport', { state: { time} });
  };

  const formatTime = (seconds) => {
    const hrs = Math.floor(seconds / 3600).toString().padStart(2, '0');
    const mins = Math.floor((seconds % 3600) / 60).toString().padStart(2, '0');
    const secs = (seconds % 60).toString().padStart(2, '0');
    return `${hrs}:${mins}:${secs}`;
  };


  return (
    <div className={styles['map-page-container']}>
      <h1>Workout</h1>
      <div>
        <p>Elapsed Time: {formatTime(time)}</p>
        <span>Heart Rate:</span>
        <span>{data.heartRate} BPM</span>
      </div>

      <button onClick={handleStartWorkout} className={styles['start-workout-button']}>Start Workout</button>
      <button onClick={handleEndWorkout} className={styles['end-workout-button']}>End workout</button>
    </div>
  );
};

export default WorkoutPage;
