import React, { createContext, useState, useContext, useEffect } from 'react';

const DataContext = createContext();

export const DataProvider = ({ children }) => {
  const [location, setLocation] = useState(null);
  const [heartRate, setHeartRate] = useState(null);

  useEffect(() => {
    const ws = new WebSocket("ws://192.168.0.23:4000");
    
    ws.onmessage = (event) => {
      const data = JSON.parse(event.data);
      if (data.location) {
        setLocation(data.location);
      }
      if (data.heartRate) {
        setHeartRate(data.heartRate);
      }
    };

    ws.onerror = (error) => {
      console.error('WebSocket error:', error);
    };

    return () => {
      ws.close();
    };
  }, []);

  return (
    <DataContext.Provider value={{ location, heartRate }}>
      {children}
    </DataContext.Provider>
  );
};

export const useData = () => {
  const context = useContext(DataContext);
  if (!context) {
    throw new Error('useData must be used within a DataProvider');
  }
  return context;
}; 