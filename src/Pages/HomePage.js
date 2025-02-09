import React, { Component } from 'react';
import { BrowserRouter as Router, Route, Routes, Link } from 'react-router-dom';
import Map from '../Map';
import '../App.css';
import './HomePageMap.css';
import HeartRatePage from './HeartRatePage';
import TempPage from './TempPage';
import MapPage from './MapPage';
import ExercisePage from './ExercisePage';
import WalkPage from './WalkPage';
import RunPage from './RunPage';
import WalkReport from './WalkReport';
import RunReport from './RunReport';
import Workout from './Workout';



// https://api.open-meteo.com/v1/forecast?latitude=53.270962&longitude=-9.062691&current=temperature_2m,relative_humidity_2m,apparent_temperature,is_day,rain,showers,snowfall,wind_direction_10m&hourly=temperature_2m,relative_humidity_2m,rain,showers,weather_code,visibility,wind_speed_10m,wind_speed_80m,wind_speed_120m&daily=sunrise,sunset,uv_index_max,uv_index_clear_sky_max
class HomePage extends Component {
  constructor(props) {
    super(props);
    this.state = {
      data: null,
    };
  }

  componentDidMount() {
    this.ws = new WebSocket("http://192.168.0.23:4000");

    this.ws.onmessage = (event) => {
      const receivedData = JSON.parse(event.data);
      this.setState({ data: receivedData });
    };
  }

  componentWillUnmount() {
    if (this.ws) {
      this.ws.close();
    }
  }

  render() {
    const { data } = this.state;

    return (
      <Router>
        <div className="App">
          <nav className="navbar">
            <div className="navbar-content">
              <h1>Wearable Health and Activity Tracker</h1>
              <div className="nav-buttons">
                <Link to="/">
                  <button className="nav-btn">Home</button>
                </Link>
                <Link to="/heart-rate">
                  <button className="nav-btn">Heart Rate</button>
                </Link>
                <Link to="/temp">
                  <button className="nav-btn">Skin Temperature</button>
                </Link>
                <Link to="/map">
                  <button className="nav-btn">Location</button>
                </Link>
                <Link to="/exercise">
                  <button className="nav-btn">Exercise</button>
                </Link>
              </div>
            </div>
          </nav>

          <Routes>
            <Route
              path="/"
              element={
                <div className="home-page-content">
                  <div className="welcome-section">
                    <h2>Welcome to Your Health Tracker</h2>
                    <p>
                      Track your health and fitness data in real-time with the Wearable Health and Activity Tracker (WHAT).
                    </p>
                  </div>

                  <div className="data-section">
                    <div className="data-card weather-card">
                      <h3>Weather API</h3>
                      <p>Weather data will be displayed here.</p>
                    </div>

                  
                    {data ? (
                      <div className="data-card">
                        <h3>Current Health Data</h3>
                        <div className="data-item">
                          <span>Heart Rate:</span>
                          <span>{data.heartRate} BPM</span>
                        </div>
                        <div className="data-item">
                          <span>Temperature:</span>
                          <span>{data.temperature} °C</span>
                        </div>
                        <div className="data-item">
                          <span>Last Updated:</span>
                          <span>{new Date(data.timestamp).toLocaleString()}</span>
                        </div>
                        <div className="map-container">
                          <Map latitude={data.location?.lat} longitude={data.location?.lng} />
                        </div>
                      </div>
                    ) : (
                      <p>Loading health data...</p>
                    )}
                  </div>
                </div>
              }
            />
            <Route path="/heart-rate" element={<HeartRatePage data={data} />} />
            <Route path="/temp" element={<TempPage data={data} />} />
            <Route path="/map" element={<MapPage data={data} />} />
            <Route path="/exercise" element={<ExercisePage data={data} />} />
            <Route path="/walk" element={<WalkPage data={data} />} />
            <Route path="/run" element={<RunPage data={data} />} />
            <Route path="/workout" element={<Workout data={data} />} />
            <Route path="/walkreport" element={<WalkReport data={data} />} />
            <Route path="/RunReport" element={<RunReport data={data} />} />
          </Routes>
        </div>
      </Router>
    );
  }
}

export default HomePage;