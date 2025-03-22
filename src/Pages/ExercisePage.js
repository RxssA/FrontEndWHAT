import React from 'react';
import { Link, useNavigate } from 'react-router-dom';
import styles from './Exercise.module.css';

const ExercisePage = ({ data }) => {
  const navigate = useNavigate();
  const isLoggedIn = localStorage.getItem('username');

  if (!isLoggedIn) {
    return (
      <div className={styles['centered-text']}>
        <div className={styles['data-box']}>
          <h1>Please Log In</h1>
          <p>You need to be logged in to access exercise features.</p>
          <Link to="/login">
            <button className={styles['nav-btn']}>Go to Login</button>
          </Link>
        </div>
      </div>
    );
  }

  return (
    <div className={styles['centered-text']}>
      <div className={styles['data-box']}>
        <h1>Track your workout</h1>
        <p>Choose an activity to start tracking.</p>
        {data ? (
          <>
            <Link to="/run">
              <button className={styles['nav-btn']}>Start a run</button>
            </Link>
            <Link to="/walk">
              <button className={styles['nav-btn']}>Start a walk</button>
            </Link>
            <Link to="/workout">
              <button className={styles['nav-btn']}>Start a workout</button>
            </Link>
          </>
        ) : (
          <p className={styles.loading}>Loading data...</p>
        )}
      </div>
    </div>
  );
};

export default ExercisePage;
