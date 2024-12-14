import React from 'react';
import Map from '../Map';
import './map.module.css';

const MapPage = ({ data }) => {
  return (
    <div className="map-page-container">
      <h1>Map</h1>
      {data ? (
        <div className="map-container">
          <Map latitude={data.location?.lat} longitude={data.location?.lng} />
        </div>
      ) : (
        <p>Loading data...</p>
      )}
    </div>
  );
};

export default MapPage;
