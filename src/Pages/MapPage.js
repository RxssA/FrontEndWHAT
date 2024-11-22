import React from 'react';
import Map from '../Map';

const TempPage = ({ data }) => {
  return (
    <div className="centered-text">
      <h1>Map</h1>
      <p></p>

      {data ? (
        <>
          <div className="data-box">
            <p><Map latitude={data.location?.lat} longitude={data.location?.lng} /></p>
          </div>
        </>
      ) : (
        <p>Loading data...</p>
      )}
    </div>
  );
};

export default TempPage;
