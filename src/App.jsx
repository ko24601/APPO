import React, { useState, useEffect } from 'react';
import './App.css';
import DriverTracker from './components/DriverTracker';
import WeatherWidget from './components/WeatherWidget';
import TrackDataWidget from './components/TrackDataWidget';
import Header from './components/Header';
import SplashScreen from './components/SplashScreen';

function App() {
  const [drivers, setDrivers] = useState([]);
  const [weather, setWeather] = useState(null);
  const [trackData, setTrackData] = useState(null);
  const [isLoading, setIsLoading] = useState(true);

  // Simulate fetching data - in a real app, you'd use actual APIs
  useEffect(() => {
    // Mock F1 driver data
    setDrivers([
      { position: 1, name: 'Max Verstappen', team: 'Red Bull Racing', laps: 58, time: '1:30.729', points: 25 },
      { position: 2, name: 'Sergio Pérez', team: 'Red Bull Racing', laps: 58, time: '+7.345', points: 18 },
      { position: 3, name: 'Charles Leclerc', team: 'Ferrari', laps: 58, time: '+12.891', points: 15 },
      { position: 4, name: 'Lando Norris', team: 'McLaren', laps: 58, time: '+18.456', points: 12 },
      { position: 5, name: 'Carlos Sainz', team: 'Ferrari', laps: 58, time: '+22.103', points: 10 },
      { position: 6, name: 'George Russell', team: 'Mercedes', laps: 57, time: '+1 lap', points: 8 },
      { position: 7, name: 'Lewis Hamilton', team: 'Mercedes', laps: 57, time: '+1 lap', points: 6 },
      { position: 8, name: 'Fernando Alonso', team: 'Aston Martin', laps: 57, time: '+1 lap', points: 4 },
      { position: 9, name: 'Esteban Ocon', team: 'Alpine', laps: 56, time: '+2 laps', points: 2 },
      { position: 10, name: 'Pierre Gasly', team: 'Alpine', laps: 56, time: '+2 laps', points: 1 }
    ]);

    // Mock weather data
    setWeather({
      temperature: 22,
      humidity: 65,
      windSpeed: 12,
      condition: 'Partly Cloudy',
      trackTemp: 28
    });

    // Mock track data
    setTrackData({
      circuit: 'Circuit Zandvoort',
      lapRecord: '1:11.097',
      lapRecordHolder: 'Max Verstappen (2023)',
      totalLaps: 72,
      lapDistance: 4.259,
      raceDistance: 306.588,
      turns: 14,
      drsZones: 3
    });
  }, []);

  // Timeout to stop loading after 3 seconds
  useEffect(() => {
    const timer = setTimeout(() => setIsLoading(false), 3000);
    return () => clearTimeout(timer);
  }, []);

  return isLoading ? (
    <SplashScreen />
  ) : (
    <div className="app">
      <Header title="F1 Grand Prix Dashboard" />
      <div className="dashboard-content">
        <div className="left-panel">
          <DriverTracker drivers={drivers} />
          <WeatherWidget weather={weather} />
        </div>
        <div className="right-panel">
          <TrackDataWidget trackData={trackData} />
        </div>
      </div>
    </div>
  );
}

export default App;