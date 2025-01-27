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
import WalkReport from './WalkReport'

class HomePage extends Component {
  constructor(props) {
    super(props);
    this.state = {
      data: null,
    };
  }

  componentDidMount() {
    this.ws = new WebSocket("http://192.168.0.23:4000");

    this.ws.onmessage = (event) => {           // handles incoming msgs
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
          </nav>

          <Routes>
            <Route path="/" element={
              <div className="home-page-content">
                <div className="left-section">
                  <h2>Welcome to Your Health Tracker</h2>
                  <p>Track your health and fitness data in real-time with the Wearable Health and Activity Tracker (WHAT).</p>
                </div>

                <div className="right-section">
                  {data ? (
                    <div className="data-box">
                      <p>Heart Rate: {data.heartRate} BPM</p>
                      <p>Temperature: {data.temperature} °C</p>
                      <p>Last Updated: {new Date(data.timestamp).toLocaleString()}</p>
                      <p>
                        <Map latitude={data.location?.lat} longitude={data.location?.lng} />
                      </p>
                    </div>
                  ) : (
                    <p>Loading health data...</p>
                  )}
                </div>
              </div>
            } />
            <Route path="/heart-rate" element={<HeartRatePage data={data} />} />
            <Route path="/temp" element={<TempPage data={data} />} />
            <Route path="/map" element={<MapPage data={data} />} />
            <Route path="/exercise" element={<ExercisePage data={data} />} />
            <Route path="/walk" element={<WalkPage data={data} />} />
            <Route path="/run" element={<RunPage data={data} />} />
            <Route path="/walkreport" element={<WalkReport data={data} />} />
            
          </Routes>
        </div>
      </Router>
    );
  }
}

export default HomePage; 
