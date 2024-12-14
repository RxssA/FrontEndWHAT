import React from 'react';
import './Exercise.module.css';


const ExercisePage = ({ data }) => {
  return (
    <div className="centered-text">
      <h1>Track your workout</h1>
      <p>Choose an activity to start tracking.</p>

      {data ? (
        <>
          <div className="data-box">
            <button className="nav-btn">Start a run</button>
            <button className="nav-btn">Start a walk</button>
            <button className="nav-btn">Start a workout</button>
          </div>
        </>
      ) : (
        <p>Loading data...</p>
      )}
    </div>
  );
};

export default ExercisePage;
