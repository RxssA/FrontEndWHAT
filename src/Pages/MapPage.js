import React from 'react';
import Map from '../Map';
import './map.css';

const MapPage = ({ data }) => {
  return (
    <div className="centered-text">
      <h1>Map</h1>
      {data ? (
        <div className="data">
          <div className="data-boxMap">
            <Map latitude={data.location?.lat} longitude={data.location?.lng} />
          </div>
        </div>
      ) : (
        <p>Loading data...</p>
      )}
    </div>
  );
};

export default MapPage;

