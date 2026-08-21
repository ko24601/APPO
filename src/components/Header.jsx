import React, { useState, useEffect } from 'react';
import { 
  Radio, 
  Tv, 
  Map, 
  Flag, 
  Trophy, 
  Calendar, 
  Activity, 
  Volume2, 
  VolumeX, 
  RotateCcw,
  Sparkles,
  Layers,
  BarChart3
} from 'lucide-react';
import UpdateNotification from './UpdateNotification';
import { audioService } from '../services/audioService';
import './Header.css';

const Header = ({ 
  activeTab, 
  setActiveTab, 
  isLiveMode, 
  setIsLiveMode, 
  selectedCircuit, 
  onCircuitChange, 
  circuitsList,
  onResetSim
}) => {
  const [timeStr, setTimeStr] = useState(new Date().toLocaleTimeString());
  const [isMuted, setIsMuted] = useState(false);

  useEffect(() => {
    const timer = setInterval(() => setTimeStr(new Date().toLocaleTimeString()), 1000);
    return () => clearInterval(timer);
  }, []);

  const handleToggleSound = () => {
    const muted = audioService.toggleMute();
    setIsMuted(muted);
  };

  return (
    <header className="app-header">
      {/* Left Branding & Live Session Pill */}
      <div className="header-left">
        <div className="header-logo-badge">
          <span className="logo-f">F</span>
          <span className="logo-1">1</span>
        </div>
        <div className="header-title-box">
          <div className="app-main-title">PIT WALL COMMAND</div>
          <div className="circuit-selector-group">
            <span className="active-gp-label">GRAND PRIX:</span>
            <select 
              className="circuit-select" 
              value={selectedCircuit} 
              onChange={e => onCircuitChange(e.target.value)}
            >
              {Object.values(circuitsList).map(c => (
                <option key={c.id} value={c.id}>
                  {c.flag} {c.name}
                </option>
              ))}
            </select>
          </div>
        </div>
      </div>

      {/* Center Navigation Tabs */}
      <nav className="header-nav-tabs">
        <button 
          type="button" 
          className={`nav-tab ${activeTab === 'timing' ? 'active' : ''}`}
          onClick={() => setActiveTab('timing')}
        >
          <Activity size={15} /> TIMING TOWER
        </button>
        <button 
          type="button" 
          className={`nav-tab ${activeTab === 'stream' ? 'active' : ''}`}
          onClick={() => setActiveTab('stream')}
        >
          <Tv size={15} /> LIVE STREAM
        </button>
        <button 
          type="button" 
          className={`nav-tab ${activeTab === 'track' ? 'active' : ''}`}
          onClick={() => setActiveTab('track')}
        >
          <Map size={15} /> TRACK GPS
        </button>
        <button 
          type="button" 
          className={`nav-tab ${activeTab === 'telemetry' ? 'active' : ''}`}
          onClick={() => setActiveTab('telemetry')}
        >
          <BarChart3 size={15} /> TELEMETRY
        </button>
        <button 
          type="button" 
          className={`nav-tab ${activeTab === 'racecontrol' ? 'active' : ''}`}
          onClick={() => setActiveTab('racecontrol')}
        >
          <Flag size={15} /> RACE CONTROL
        </button>
        <button 
          type="button" 
          className={`nav-tab ${activeTab === 'standings' ? 'active' : ''}`}
          onClick={() => setActiveTab('standings')}
        >
          <Trophy size={15} /> STANDINGS
        </button>
        <button 
          type="button" 
          className={`nav-tab ${activeTab === 'calendar' ? 'active' : ''}`}
          onClick={() => setActiveTab('calendar')}
        >
          <Calendar size={15} /> CALENDAR
        </button>
      </nav>

      {/* Right Controls & Update Notification */}
      <div className="header-right">
        {/* Mode Toggle (Live API vs Sim Replay) */}
        <div className="mode-toggle-group">
          <button 
            type="button" 
            className={`mode-btn ${isLiveMode ? 'active' : ''}`} 
            onClick={() => setIsLiveMode(true)}
            title="Real-Time OpenF1 Live Feed"
          >
            <span className="live-pulse-dot" /> LIVE API
          </button>
          <button 
            type="button" 
            className={`mode-btn ${!isLiveMode ? 'active sim' : ''}`} 
            onClick={() => setIsLiveMode(false)}
            title="Simulated Real-Time 60fps Race"
          >
            SIM 60FPS
          </button>
        </div>

        {/* Audio Toggle */}
        <button 
          type="button" 
          className="header-icon-btn" 
          onClick={handleToggleSound}
          title={isMuted ? 'Unmute Audio' : 'Mute Audio'}
        >
          {isMuted ? <VolumeX size={16} /> : <Volume2 size={16} />}
        </button>

        {/* In-App Auto-Update Pill */}
        <UpdateNotification />

        {/* Clock */}
        <div className="header-clock">
          <span className="time-val">{timeStr}</span>
          <span className="utc-tag">LOCAL</span>
        </div>
      </div>
    </header>
  );
};

export default Header;