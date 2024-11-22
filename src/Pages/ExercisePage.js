import React from 'react';

const TempPage = ({ data }) => {
  return (
    <div className="centered-text">
      <h1>Track your workout</h1>
      <p>Choose an activity to start tracking.</p>

      {data ? (
        <>
          <div className="data-box">
            {/* Buttons that lead to nothing */}
            <button className="activity-btn">Start a run</button>
            <button className="activity-btn">Start a walk</button>
            <button className="activity-btn">Start a workout</button>
          </div>
        </>
      ) : (
        <p>Loading data...</p>
      )}
    </div>
  );
};

export default TempPage;
