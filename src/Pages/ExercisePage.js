import React from 'react';
import { Link } from 'react-router-dom';
import styles from './Exercise.module.css';
import Navbar from '../Components/Navbar';
import '../App.css';

const ExercisePage = () => {
  return (
    <div className="App">
      <Navbar />
      <div className="content">
        <div className="exercise-page">
          <div className={styles['centered-text']}>
            <div className={styles['data-box']}>
              <h1>Track your workout</h1>
              <p>Choose an activity to start tracking.</p>
              <Link to="/run">
                <button className={styles['nav-btn']}>Start a run</button>
              </Link>
              <Link to="/walk">
                <button className={styles['nav-btn']}>Start a walk</button>
              </Link>
              <Link to="/workout">
                <button className={styles['nav-btn']}>Start a workout</button>
              </Link>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default ExercisePage;
