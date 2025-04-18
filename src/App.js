import React from 'react';
import { BrowserRouter as Router, Routes, Route, Navigate } from 'react-router-dom';
import { DataProvider } from './context/DataContext';
import AuthPage from './Pages/AuthPage';
import HomePage from './Pages/HomePage';
import HeartRatePage from './Pages/HeartRatePage';
import TempPage from './Pages/TempPage';
import MapPage from './Pages/MapPage';
import ExercisePage from './Pages/ExercisePage';
import WalkPage from './Pages/WalkPage';
import RunPage from './Pages/RunPage';
import WalkReport from './Pages/WalkReport';
import RunReport from './Pages/RunReport';
import Workout from './Pages/Workout';
import WorkoutReport from './Pages/WorkoutReport';
import UserProfilePage from './Pages/UserProfile';
import Footer from './Pages/Footer';
import './App.css';

// Protected Route component
const ProtectedRoute = ({ children }) => {
  const isLoggedIn = localStorage.getItem('username') && localStorage.getItem('token');
  return isLoggedIn ? children : <Navigate to="/auth" replace />;
};

function App() {
  return (
    <DataProvider>
      <Router>
        <Routes>
          <Route path="/auth" element={<AuthPage />} />
          <Route
            path="/"
            element={
              <ProtectedRoute>
                <HomePage />
              </ProtectedRoute>
            }
          />
          <Route
            path="/heart-rate"
            element={
              <ProtectedRoute>
                <HeartRatePage />
              </ProtectedRoute>
            }
          />
          <Route
            path="/temp"
            element={
              <ProtectedRoute>
                <TempPage />
              </ProtectedRoute>
            }
          />
          <Route
            path="/map"
            element={
              <ProtectedRoute>
                <MapPage />
              </ProtectedRoute>
            }
          />
          <Route
            path="/exercise"
            element={
              <ProtectedRoute>
                <ExercisePage />
              </ProtectedRoute>
            }
          />
          <Route
            path="/walk"
            element={
              <ProtectedRoute>
                <WalkPage />
              </ProtectedRoute>
            }
          />
          <Route
            path="/run"
            element={
              <ProtectedRoute>
                <RunPage />
              </ProtectedRoute>
            }
          />
          <Route
            path="/workout"
            element={
              <ProtectedRoute>
                <Workout />
              </ProtectedRoute>
            }
          />
          <Route
            path="/walkreport"
            element={
              <ProtectedRoute>
                <WalkReport />
              </ProtectedRoute>
            }
          />
          <Route
            path="/RunReport"
            element={
              <ProtectedRoute>
                <RunReport />
              </ProtectedRoute>
            }
          />
          <Route
            path="/WorkoutReport"
            element={
              <ProtectedRoute>
                <WorkoutReport />
              </ProtectedRoute>
            }
          />
          <Route
            path="/profile"
            element={
              <ProtectedRoute>
                <UserProfilePage />
              </ProtectedRoute>
            }
          />
          <Route path="*" element={<Navigate to="/auth" replace />} />
        </Routes>
        <Footer />
      </Router>
    </DataProvider>
  );
}

export default App;
