import React from 'react';
import { Flag, AlertTriangle, ShieldCheck, Siren, Info, CheckCircle2 } from 'lucide-react';
import './RaceControlFeed.css';

const RaceControlFeed = ({ messages, currentFlag = 'GREEN' }) => {
  const flagsList = [
    { code: 'GREEN', label: 'TRACK CLEAR', color: '#00ff66', desc: 'Normal racing conditions' },
    { code: 'YELLOW', label: 'YELLOW SECTOR', color: '#ffd700', desc: 'Hazard on track, no overtaking' },
    { code: 'SC', label: 'SAFETY CAR', color: '#ff9900', desc: 'Full Safety Car deployed' },
    { code: 'VSC', label: 'VIRTUAL SC', color: '#ffbb00', desc: 'Delta time limit enforced' },
    { code: 'RED', label: 'SESSION SUSPENDED', color: '#ff3333', desc: 'Return to pit lane immediately' }
  ];

  return (
    <div className="race-control-card">
      <div className="race-control-header">
        <div className="rc-title-left">
          <Flag size={18} color="#e10600" />
          <h2>RACE CONTROL COMMAND FEED</h2>
        </div>
        <div className="current-flag-indicator">
          <span className="pulse-indicator" style={{ backgroundColor: currentFlag === 'GREEN' ? '#00ff66' : '#ffd700' }} />
          <span>STATUS: {currentFlag}</span>
        </div>
      </div>

      {/* Flag System Status Bar */}
      <div className="flag-status-bar">
        {flagsList.map(f => {
          const isActive = f.code === currentFlag;
          return (
            <div key={f.code} className={`flag-status-item ${isActive ? 'active' : ''}`}>
              <span className="flag-dot" style={{ backgroundColor: f.color }} />
              <span className="flag-name">{f.label}</span>
            </div>
          );
        })}
      </div>

      {/* Live Stream of Steward Messages */}
      <div className="messages-stream-container">
        <div className="stream-sub-header">
          <Info size={13} /> OFFICIAL FIA RACE CONTROL NOTICES
        </div>
        <div className="messages-list">
          {messages.map((m, idx) => (
            <div key={m.id || idx} className="rc-message-item">
              <div className="rc-msg-time">{m.time}</div>
              <div className="rc-msg-badge-wrapper">
                <span className={`rc-category-badge ${m.flag?.toLowerCase()}`}>
                  {m.flag || 'NOTICE'}
                </span>
              </div>
              <div className="rc-msg-content">{m.message}</div>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
};

export default RaceControlFeed;
