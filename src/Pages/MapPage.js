import React from 'react';
import Map from '../Map';
import styles from './map.module.css';

const MapPage = ({ data }) => {
  return (
    <div className={styles['map-page-container']}>
      {data ? (
        <div className={styles["data-box"]}>
          <Map latitude={data.location?.lat} longitude={data.location?.lng} />
        </div>
      ) : (
        <p>Loading data...</p>
      )}
    </div>
  );
};

export default MapPage;
