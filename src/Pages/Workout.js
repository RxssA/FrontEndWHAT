import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import styles from './Workout.module.css';
import { useData } from '../context/DataContext';
import Navbar from '../Components/Navbar';

const WorkoutPage = () => {
  const { heartRate } = useData();
  const [time, setTime] = useState(0);
  const [isWorking, setIsWorking] = useState(false);
  const [exercises, setExercises] = useState([]);
  const [startTime, setStartTime] = useState(null);
  const [endTime, setEndTime] = useState(null);

  const [newExercise, setNewExercise] = useState({
    name: '',
    weight: '',
    reps: '',
    sets: ''
  });

  const navigate = useNavigate();
  const isLoggedIn = localStorage.getItem('username');

  useEffect(() => {
    if (!isLoggedIn) {
      navigate('/auth');
      return;
    }
  }, [isLoggedIn, navigate]);

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
    setStartTime(new Date()); // Set start timestamp
    setEndTime(null); // Clear previous end time
  };

  const handleEndWorkout = () => {
    const end = new Date();
    setIsWorking(false);
    setEndTime(end);
    navigate('/WorkoutReport', {
      state: { time, exercises, startTime, endTime: end },
    });
  };

  const handleAddExercise = (e) => {
    e.preventDefault();
    if (newExercise.name && newExercise.weight && newExercise.reps && newExercise.sets) {
      setExercises([...exercises, { ...newExercise, id: Date.now() }]);
      setNewExercise({
        name: '',
        weight: '',
        reps: '',
        sets: ''
      });
    }
  };

  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setNewExercise(prev => ({
      ...prev,
      [name]: value
    }));
  };

  const formatTime = (seconds) => {
    const hrs = Math.floor(seconds / 3600).toString().padStart(2, '0');
    const mins = Math.floor((seconds % 3600) / 60).toString().padStart(2, '0');
    const secs = (seconds % 60).toString().padStart(2, '0');
    return `${hrs}:${mins}:${secs}`;
  };

  return (
    <div className="App">
      <Navbar />
      <div className="content">
        <div className={styles['map-page-container']}>
          <h1>Workout</h1>
          <div>
            <p>Elapsed Time: {formatTime(time)}</p>
            <span>Heart Rate:</span>
            <span>{heartRate} BPM</span>
          </div>

          {!isWorking ? (
            <button onClick={handleStartWorkout} className={styles['start-workout-button']}>Start Workout</button>
          ) : (
            <>
              <form onSubmit={handleAddExercise} className={styles['exercise-form']}>
                <input
                  type="text"
                  name="name"
                  placeholder="Exercise Name"
                  value={newExercise.name}
                  onChange={handleInputChange}
                  required
                />
                <input
                  type="number"
                  name="weight"
                  placeholder="Weight (Kg)"
                  value={newExercise.weight}
                  onChange={handleInputChange}
                  required
                />
                <input
                  type="number"
                  name="reps"
                  placeholder="Reps"
                  value={newExercise.reps}
                  onChange={handleInputChange}
                  required
                />
                <input
                  type="number"
                  name="sets"
                  placeholder="Sets"
                  value={newExercise.sets}
                  onChange={handleInputChange}
                  required
                />
                <button type="submit" className={styles['add-exercise-button']}>Add Exercise</button>
              </form>

              <div className={styles['exercises-list']}>
                <h2>Exercises</h2>
                {exercises.map(exercise => (
                  <div key={exercise.id} className={styles['exercise-item']}>
                    <h3>{exercise.name}</h3>
                    <p>Weight: {exercise.weight} Kg</p>
                    <p>Reps: {exercise.reps}</p>
                    <p>Sets: {exercise.sets}</p>
                  </div>
                ))}
              </div>

              <button onClick={handleEndWorkout} className={styles['end-workout-button']}>End Workout</button>
            </>
          )}
        </div>
      </div>
    </div>
  );
};

export default WorkoutPage;
