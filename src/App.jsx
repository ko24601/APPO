import React, { useState, useEffect, useRef } from 'react';
import './App.css';
import Header from './components/Header';
import SplashScreen from './components/SplashScreen';
import DriverTracker from './components/DriverTracker';
import TrackDataWidget from './components/TrackDataWidget';
import WeatherWidget from './components/WeatherWidget';
import LiveStreamPlayer from './components/LiveStreamPlayer';
import RaceControlFeed from './components/RaceControlFeed';
import StandingsWidget from './components/StandingsWidget';
import CalendarWidget from './components/CalendarWidget';
import TelemetryComparison from './components/TelemetryComparison';

import { 
  fetchLatestLiveSession, 
  fetchDriversForSession, 
  fetchLiveWeather, 
  fetchRaceControlMessages,
  FALLBACK_DRIVERS,
  FALLBACK_TRACK,
  FALLBACK_WEATHER,
  FALLBACK_RACE_CONTROL,
  FALLBACK_STANDINGS,
  FALLBACK_CALENDAR
} from './services/f1DataService';

import { RaceSimulator, CIRCUITS_MAP } from './services/raceSimulator';

function App() {
  const [isLoading, setIsLoading] = useState(true);
  const [activeTab, setActiveTab] = useState('timing'); // 'timing' | 'stream' | 'track' | 'telemetry' | 'racecontrol' | 'standings' | 'calendar'
  const [isLiveMode, setIsLiveMode] = useState(true);
  const [selectedCircuit, setSelectedCircuit] = useState('zandvoort');
  const [isTheaterMode, setIsTheaterMode] = useState(false);

  // Live Data State
  const [drivers, setDrivers] = useState(FALLBACK_DRIVERS);
  const [weather, setWeather] = useState(FALLBACK_WEATHER);
  const [trackData, setTrackData] = useState(FALLBACK_TRACK);
  const [raceControlMessages, setRaceControlMessages] = useState(FALLBACK_RACE_CONTROL);
  const [standings, setStandings] = useState(FALLBACK_STANDINGS);
  const [calendar, setCalendar] = useState(FALLBACK_CALENDAR);
  const [currentFlag, setCurrentFlag] = useState('GREEN');

  const simulatorRef = useRef(null);

  // Failsafe timer: guarantees the loading screen closes
  useEffect(() => {
    const safeTimer = setTimeout(() => {
      setIsLoading(false);
    }, 2000);
    return () => clearTimeout(safeTimer);
  }, []);

  // Initialize Simulation Engine
  useEffect(() => {
    simulatorRef.current = new RaceSimulator(FALLBACK_DRIVERS, selectedCircuit);
  }, []);

  // Update simulator when circuit changes
  useEffect(() => {
    if (simulatorRef.current) {
      simulatorRef.current.setCircuit(selectedCircuit);
    }
  }, [selectedCircuit]);

  // Real-Time Polling & Simulation Loop
  useEffect(() => {
    let intervalId;

    if (isLiveMode) {
      // Fetch real live data from OpenF1 API
      const loadLiveData = async () => {
        try {
          const session = await fetchLatestLiveSession();
          const sessionKey = session?.session_key || 'latest';

          const [driverData, weatherData, rcData] = await Promise.all([
            fetchDriversForSession(sessionKey),
            fetchLiveWeather(sessionKey),
            fetchRaceControlMessages(sessionKey)
          ]);

          if (driverData && driverData.length > 0) setDrivers(driverData);
          if (weatherData) setWeather(weatherData);
          if (rcData && rcData.length > 0) {
            setRaceControlMessages(rcData);
            setCurrentFlag(rcData[0]?.flag || 'GREEN');
          }
        } catch (e) {
          console.warn('Live API poll error:', e);
        }
      };

      loadLiveData();
      intervalId = setInterval(loadLiveData, 4000);
    } else {
      // High Precision Real-Time Simulation (10 ticks per second)
      intervalId = setInterval(() => {
        if (simulatorRef.current) {
          const simState = simulatorRef.current.tick(0.1);
          setDrivers([...simState.drivers]);
          setWeather({ ...FALLBACK_WEATHER, ...simState.weather });
        }
      }, 100);
    }

    return () => clearInterval(intervalId);
  }, [isLiveMode, selectedCircuit]);

  const activeCircuitData = CIRCUITS_MAP[selectedCircuit] || CIRCUITS_MAP.zandvoort;

  return isLoading ? (
    <SplashScreen onFinish={() => setIsLoading(false)} />
  ) : (
    <div className="app">
      {/* Header with GP selector, Navigation Tabs, and Update notification */}
      <Header
        activeTab={activeTab}
        setActiveTab={setActiveTab}
        isLiveMode={isLiveMode}
        setIsLiveMode={setIsLiveMode}
        selectedCircuit={selectedCircuit}
        onCircuitChange={setSelectedCircuit}
        circuitsList={CIRCUITS_MAP}
      />

      {/* Main Command Center Dashboard */}
      <main className="dashboard-content">
        {/* VIEW 1: TIMING TOWER (Command Center Split View) */}
        {activeTab === 'timing' && (
          <div className="tab-view timing-layout-grid">
            <div className="layout-col-left">
              <DriverTracker drivers={drivers} />
            </div>
            <div className="layout-col-right">
              <LiveStreamPlayer 
                isTheaterMode={isTheaterMode} 
                onToggleTheater={() => setIsTheaterMode(prev => !prev)} 
              />
              <div className="right-widgets-row">
                <WeatherWidget weather={weather} />
                <TrackDataWidget 
                  trackData={trackData} 
                  circuit={activeCircuitData} 
                  drivers={drivers} 
                />
              </div>
            </div>
          </div>
        )}

        {/* VIEW 2: LIVE STREAM MULTI-CAM */}
        {activeTab === 'stream' && (
          <div className="tab-view stream-layout-grid">
            <div className="stream-main-col">
              <LiveStreamPlayer 
                isTheaterMode={isTheaterMode} 
                onToggleTheater={() => setIsTheaterMode(prev => !prev)} 
              />
            </div>
            <div className="stream-side-col">
              <DriverTracker drivers={drivers.slice(0, 10)} />
              <RaceControlFeed messages={raceControlMessages} currentFlag={currentFlag} />
            </div>
          </div>
        )}

        {/* VIEW 3: TRACK GPS MAP */}
        {activeTab === 'track' && (
          <div className="tab-view track-layout-grid">
            <div className="track-left-col">
              <TrackDataWidget 
                trackData={trackData} 
                circuit={activeCircuitData} 
                drivers={drivers} 
              />
            </div>
            <div className="track-right-col">
              <WeatherWidget weather={weather} />
              <DriverTracker drivers={drivers.slice(0, 8)} />
            </div>
          </div>
        )}

        {/* VIEW 4: TELEMETRY COMPARATOR */}
        {activeTab === 'telemetry' && (
          <div className="tab-view telemetry-layout-grid">
            <div className="tel-left-col">
              <TelemetryComparison drivers={drivers} />
            </div>
            <div className="tel-right-col">
              <DriverTracker drivers={drivers} />
            </div>
          </div>
        )}

        {/* VIEW 5: RACE CONTROL FEED */}
        {activeTab === 'racecontrol' && (
          <div className="tab-view racecontrol-layout-grid">
            <div className="rc-left-col">
              <RaceControlFeed messages={raceControlMessages} currentFlag={currentFlag} />
            </div>
            <div className="rc-right-col">
              <WeatherWidget weather={weather} />
              <TrackDataWidget 
                trackData={trackData} 
                circuit={activeCircuitData} 
                drivers={drivers} 
              />
            </div>
          </div>
        )}

        {/* VIEW 6: WORLD CHAMPIONSHIP STANDINGS */}
        {activeTab === 'standings' && (
          <div className="tab-view full-width-view">
            <StandingsWidget standings={standings} />
          </div>
        )}

        {/* VIEW 7: SEASON CALENDAR & COUNTDOWN */}
        {activeTab === 'calendar' && (
          <div className="tab-view full-width-view">
            <CalendarWidget calendarData={calendar} />
          </div>
        )}
      </main>

      {/* Pit Wall Footer Ticker */}
      <footer className="app-footer-ticker">
        <div className="footer-ticker-label">FIA TELEMETRY RELAY</div>
        <div className="footer-ticker-content">
          <span>🟢 OPENF1 ENCRYPTED LINK: 11,343 MS</span>
          <span>⚡ DRS ZONES: 1 & 2 ACTIVE</span>
          <span>🌡️ TRACK: {weather.trackTemperature}°C (OPTIMAL)</span>
          <span>🏎️ LEADER: P1 {drivers[0]?.name || 'MAX VERSTAPPEN'} ({drivers[0]?.gap || 'LEADER'})</span>
          <span>🏁 RACE CONTROL: {raceControlMessages[0]?.message || 'ALL SECTORS CLEAR'}</span>
        </div>
      </footer>
    </div>
  );
}

export default App;