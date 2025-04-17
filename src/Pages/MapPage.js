import React, { useState, useEffect } from 'react';
import Map from '../Map';
import Navbar from '../Components/Navbar';
import '../App.css';
import styles from './map.module.css';

const MapPage = () => {
  const [data, setData] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    const fetchData = async () => {
      try {
        const response = await fetch('http://192.168.0.23:4000/data/last10');
        if (!response.ok) {
          throw new Error('Failed to fetch data');
        }
        const result = await response.json();
        // Get the most recent data point
        const latestData = result[result.length - 1];
        setData(latestData);
      } catch (err) {
        setError(err.message);
      } finally {
        setLoading(false);
      }
    };

    fetchData();
  }, []);

  if (loading) {
    return (
      <div className="App">
        <Navbar />
        <div className="content">
          <div className="map-page">
            <div className={styles['map-page-container']}>
              <div className={styles["data-box"]}>
                <h1>Location Tracking</h1>
                <div className={styles.loading}>Loading location data...</div>
              </div>
            </div>
          </div>
        </div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="App">
        <Navbar />
        <div className="content">
          <div className="map-page">
            <div className={styles['map-page-container']}>
              <div className={styles["data-box"]}>
                <h1>Location Tracking</h1>
                <div className={styles.error}>Error: {error}</div>
              </div>
            </div>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="App">
      <Navbar />
      <div className="content">
        <div className="map-page">
          <div className={styles['map-page-container']}>
            <div className={styles["data-box"]}>
              <h1>Location Tracking</h1>
              <div className={styles["map-wrapper"]}>
                {data?.location ? (
                  <Map 
                    latitude={data.location.lat} 
                    longitude={data.location.lng} 
                    size="large"
                  />
                ) : (
                  <div className={styles.noData}>
                    No location data available
                  </div>
                )}
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default MapPage;
