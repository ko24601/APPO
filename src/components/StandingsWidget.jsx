import React, { useState } from 'react';
import { Trophy, Users, Award, Shield } from 'lucide-react';
import './StandingsWidget.css';

const StandingsWidget = ({ standings }) => {
  const [activeTab, setActiveTab] = useState('drivers'); // 'drivers' | 'constructors'

  const data = standings || {
    drivers: [],
    constructors: []
  };

  return (
    <div className="standings-card">
      <div className="standings-card-header">
        <div className="standings-title-left">
          <Trophy size={18} color="#ffd700" />
          <h2>WORLD CHAMPIONSHIP STANDINGS</h2>
        </div>
        <div className="standings-tab-switch">
          <button 
            type="button" 
            className={`tab-btn ${activeTab === 'drivers' ? 'active' : ''}`}
            onClick={() => setActiveTab('drivers')}
          >
            DRIVERS
          </button>
          <button 
            type="button" 
            className={`tab-btn ${activeTab === 'constructors' ? 'active' : ''}`}
            onClick={() => setActiveTab('constructors')}
          >
            CONSTRUCTORS
          </button>
        </div>
      </div>

      <div className="standings-table-container">
        {activeTab === 'drivers' ? (
          <div className="standings-table">
            <div className="st-head">
              <div className="st-col-pos">POS</div>
              <div className="st-col-name">DRIVER</div>
              <div className="st-col-team">TEAM</div>
              <div className="st-col-wins">WINS</div>
              <div className="st-col-podiums">PODIUMS</div>
              <div className="st-col-pts">POINTS</div>
            </div>
            <div className="st-body">
              {data.drivers.map((d, index) => (
                <div key={d.driver || index} className={`st-row ${index < 3 ? `p${index + 1}` : ''}`}>
                  <div className="st-team-bar" style={{ backgroundColor: d.teamColor || '#e10600' }} />
                  <div className="st-col-pos">{d.position}</div>
                  <div className="st-col-name">
                    <span className="driver-bold-name">{d.driver}</span>
                    <span className="driver-code">{d.code}</span>
                  </div>
                  <div className="st-col-team">{d.team}</div>
                  <div className="st-col-wins">{d.wins}</div>
                  <div className="st-col-podiums">{d.podiums}</div>
                  <div className="st-col-pts">{d.points} <small>PTS</small></div>
                </div>
              ))}
            </div>
          </div>
        ) : (
          <div className="standings-table">
            <div className="st-head constructors">
              <div className="st-col-pos">POS</div>
              <div className="st-col-name">CONSTRUCTOR / TEAM</div>
              <div className="st-col-wins">WINS</div>
              <div className="st-col-podiums">PODIUMS</div>
              <div className="st-col-pts">POINTS</div>
            </div>
            <div className="st-body">
              {data.constructors.map((c, index) => (
                <div key={c.team || index} className={`st-row constructors ${index < 3 ? `p${index + 1}` : ''}`}>
                  <div className="st-team-bar" style={{ backgroundColor: c.teamColor || '#e10600' }} />
                  <div className="st-col-pos">{c.position}</div>
                  <div className="st-col-name">
                    <span className="team-bold-name">{c.team}</span>
                  </div>
                  <div className="st-col-wins">{c.wins}</div>
                  <div className="st-col-podiums">{c.podiums}</div>
                  <div className="st-col-pts">{c.points} <small>PTS</small></div>
                </div>
              ))}
            </div>
          </div>
        )}
      </div>
    </div>
  );
};

export default StandingsWidget;
