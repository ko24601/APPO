import React, { useState, useEffect } from 'react';
import { audioService } from '../services/audioService';
import { Play, Volume2, VolumeX, Shield, Radio, Cpu, Activity, FastForward } from 'lucide-react';
import './SplashScreen.css';

const BOOT_LOGS = [
  'INITIALIZING FIA TELEMETRY LINK...',
  'CONNECTING TO PIT WALL ENCRYPTED RELAY...',
  'CALIBRATING HYBRID MGU-K & MGU-H POWER MODES...',
  'SYNCING REAL-TIME SATELLITE GPS DRIVER SENSORS...',
  'STARTING F1 BROADCAST STREAM DECODER (HLS/LIVE)...',
  'DRS DETECTION LOOPS ARMED: ZONES 1 & 2 READY',
  'WEATHER RADAR SYNCHRONIZED: 32.4°C TRACK TEMP',
  'ALL SYSTEMS NOMINAL. PREPARING STARTING GRID...'
];

const SplashScreen = ({ onFinish }) => {
  const [lightsCount, setLightsCount] = useState(0);
  const [isLightsOut, setIsLightsOut] = useState(false);
  const [currentLogIndex, setCurrentLogIndex] = useState(0);
  const [rpmValue, setRpmValue] = useState(2500);
  const [isMuted, setIsMuted] = useState(false);

  // Toggle Sound
  const handleToggleSound = () => {
    const muted = audioService.toggleMute();
    setIsMuted(muted);
  };

  // 5 Red Lights Sequence
  useEffect(() => {
    const timeouts = [];

    // Light 1
    timeouts.push(setTimeout(() => {
      setLightsCount(1);
      audioService.playLightBeep(440);
      setRpmValue(5500);
    }, 600));

    // Light 2
    timeouts.push(setTimeout(() => {
      setLightsCount(2);
      audioService.playLightBeep(480);
      setRpmValue(8200);
    }, 1200));

    // Light 3
    timeouts.push(setTimeout(() => {
      setLightsCount(3);
      audioService.playLightBeep(520);
      setRpmValue(10500);
    }, 1800));

    // Light 4
    timeouts.push(setTimeout(() => {
      setLightsCount(4);
      audioService.playLightBeep(560);
      setRpmValue(12800);
    }, 2400));

    // Light 5
    timeouts.push(setTimeout(() => {
      setLightsCount(5);
      audioService.playLightBeep(600);
      setRpmValue(14800);
      audioService.playEngineRev();
    }, 3000));

    // Pause then LIGHTS OUT!
    timeouts.push(setTimeout(() => {
      setIsLightsOut(true);
      audioService.playLightsOutSwoosh();
      setRpmValue(15000);
    }, 3800));

    // Finish Splash
    timeouts.push(setTimeout(() => {
      if (onFinish) onFinish();
    }, 4600));

    return () => timeouts.forEach(clearTimeout);
  }, [onFinish]);

  // Telemetry Terminal Log ticker
  useEffect(() => {
    const logInterval = setInterval(() => {
      setCurrentLogIndex(prev => {
        if (prev < BOOT_LOGS.length - 1) return prev + 1;
        return prev;
      });
    }, 450);

    return () => clearInterval(logInterval);
  }, []);

  return (
    <div className={`splash-screen ${isLightsOut ? 'launching' : ''}`}>
      {/* Background Grid & Particles */}
      <div className="splash-bg-glow" />
      <div className="splash-grid-overlay" />

      {/* Top Header Controls */}
      <div className="splash-top-bar">
        <div className="splash-badge">
          <Shield size={14} className="icon-pulse" />
          <span>FIA HOMOLOGATED PIT WALL v1.1.0</span>
        </div>
        <div className="splash-actions">
          <button 
            type="button" 
            className="splash-btn icon-btn" 
            onClick={handleToggleSound}
            title={isMuted ? 'Unmute Audio' : 'Mute Audio'}
          >
            {isMuted ? <VolumeX size={16} /> : <Volume2 size={16} />}
          </button>
          <button 
            type="button" 
            className="splash-btn skip-btn" 
            onClick={onFinish}
          >
            <FastForward size={14} /> SKIP
          </button>
        </div>
      </div>

      <div className="splash-content">
        {/* F1 Branding */}
        <div className="splash-logo-container">
          <div className="f1-speed-logo">
            <span className="logo-f">F</span>
            <span className="logo-1">1</span>
          </div>
          <div className="logo-text-group">
            <h1 className="splash-title">PIT WALL COMMAND</h1>
            <p className="splash-subtitle">LIVE TELEMETRY & BROADCAST RELAY</p>
          </div>
        </div>

        {/* 5 RED LIGHTS START GANTRY */}
        <div className="f1-gantry">
          <div className="gantry-header">START SEQUENCE</div>
          <div className="gantry-lights-rack">
            {[1, 2, 3, 4, 5].map((lightIdx) => {
              const isLit = !isLightsOut && lightsCount >= lightIdx;
              return (
                <div key={lightIdx} className="gantry-light-unit">
                  <div className="light-housing">
                    <div className={`red-light ${isLit ? 'lit' : ''}`} />
                    <div className={`red-light ${isLit ? 'lit' : ''}`} />
                  </div>
                  <span className="light-number">0{lightIdx}</span>
                </div>
              );
            })}
          </div>
          <div className="gantry-status-message">
            {isLightsOut ? (
              <span className="lights-out-banner">🏁 LIGHTS OUT AND AWAY WE GO! 🏁</span>
            ) : (
              <span className="standby-banner">FORMING GRID — REVS BUILDING...</span>
            )}
          </div>
        </div>

        {/* Tachometer RPM Display */}
        <div className="splash-tachometer">
          <div className="tacho-header">
            <div className="tacho-label"><Activity size={14} /> POWER UNIT RPM</div>
            <div className="tacho-digital">{rpmValue.toLocaleString()} <small>RPM</small></div>
          </div>
          <div className="tacho-bar-track">
            <div 
              className="tacho-bar-fill"
              style={{ width: `${(rpmValue / 15000) * 100}%` }}
            />
            <div className="tacho-shift-lights">
              <span className={`sl-dot ${rpmValue > 6000 ? 'on green' : ''}`} />
              <span className={`sl-dot ${rpmValue > 8500 ? 'on green' : ''}`} />
              <span className={`sl-dot ${rpmValue > 11000 ? 'on red' : ''}`} />
              <span className={`sl-dot ${rpmValue > 13000 ? 'on red' : ''}`} />
              <span className={`sl-dot ${rpmValue > 14500 ? 'on blue' : ''}`} />
            </div>
          </div>
        </div>

        {/* Holographic Boot Terminal */}
        <div className="splash-terminal">
          <div className="terminal-bar">
            <Cpu size={14} />
            <span>SYSTEM INITIALIZATION LOGS</span>
            <div className="terminal-dots">
              <span /><span /><span />
            </div>
          </div>
          <div className="terminal-body">
            {BOOT_LOGS.slice(0, currentLogIndex + 1).map((log, i) => (
              <div key={i} className="terminal-line">
                <span className="prompt">&gt;</span> {log}
              </div>
            ))}
            <div className="terminal-cursor">_</div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default SplashScreen;