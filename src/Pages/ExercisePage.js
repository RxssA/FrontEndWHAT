import React from 'react';
import { Link } from 'react-router-dom';
import './Exercise.module.css';

const ExercisePage = ({ data }) => {
  return (
    <div className="centered-text1">
      <h1>Track your workout</h1>
      <p>Choose an activity to start tracking.</p>
      {data ? (
        <>
          <div className="data-box1">
          <Link to="/run">
              <button className="nav-btn">Start a run</button>
            </Link>
            <Link to="/walk">
              <button className="nav-btn">Start a walk</button>
            </Link>
            <Link to="/workout">
              <button className="nav-btn">Start a workout</button>
            </Link>
          </div>
        </>
      ) : (
        <p>Loading data...</p>
      )}
    </div>
  );
};

export default ExercisePage;
