import React, { useState, useEffect } from 'react';
import { Calendar, Clock, MapPin, CheckCircle, ChevronRight } from 'lucide-react';
import './CalendarWidget.css';

const CalendarWidget = ({ calendarData }) => {
  const [countdown, setCountdown] = useState({ days: 1, hours: 21, minutes: 54, seconds: 40 });

  const races = calendarData || [];

  // Countdown ticker
  useEffect(() => {
    const timer = setInterval(() => {
      setCountdown(prev => {
        if (prev.seconds > 0) return { ...prev, seconds: prev.seconds - 1 };
        if (prev.minutes > 0) return { ...prev, minutes: 59, seconds: 59 };
        if (prev.hours > 0) return { ...prev, hours: prev.hours - 1, minutes: 59, seconds: 59 };
        if (prev.days > 0) return { ...prev, days: prev.days - 1, hours: 23, minutes: 59, seconds: 59 };
        return prev;
      });
    }, 1000);

    return () => clearInterval(timer);
  }, []);

  return (
    <div className="calendar-card">
      <div className="calendar-card-header">
        <div className="cal-title-left">
          <Calendar size={18} color="#e10600" />
          <h2>FIA FORMULA 1 CALENDAR & COUNTDOWN</h2>
        </div>
      </div>

      {/* Hero Next Session Countdown */}
      <div className="next-session-hero">
        <div className="hero-left">
          <div className="hero-badge">NEXT SESSION COUNTDOWN</div>
          <h3 className="hero-gp-name">🇳🇱 DUTCH GRAND PRIX — RACE</h3>
          <p className="hero-gp-circuit"><MapPin size={13} /> Circuit Zandvoort, Netherlands</p>
        </div>

        <div className="countdown-rack">
          <div className="countdown-box">
            <span className="cd-num">{String(countdown.days).padStart(2, '0')}</span>
            <span className="cd-label">DAYS</span>
          </div>
          <span className="cd-sep">:</span>
          <div className="countdown-box">
            <span className="cd-num">{String(countdown.hours).padStart(2, '0')}</span>
            <span className="cd-label">HOURS</span>
          </div>
          <span className="cd-sep">:</span>
          <div className="countdown-box">
            <span className="cd-num">{String(countdown.minutes).padStart(2, '0')}</span>
            <span className="cd-label">MINUTES</span>
          </div>
          <span className="cd-sep">:</span>
          <div className="countdown-box">
            <span className="cd-num">{String(countdown.seconds).padStart(2, '0')}</span>
            <span className="cd-label">SECONDS</span>
          </div>
        </div>
      </div>

      {/* Season Races Grid */}
      <div className="races-schedule-list">
        {races.map((r, index) => {
          const isActive = r.status === 'ACTIVE';
          return (
            <div key={r.round || index} className={`race-schedule-card ${isActive ? 'active' : ''}`}>
              <div className="race-card-left">
                <div className="round-pill">R{r.round}</div>
                <div className="race-main-info">
                  <div className="gp-name-flag">
                    <span className="flag-icon">{r.flag}</span>
                    <span className="gp-title">{r.name}</span>
                  </div>
                  <span className="gp-circuit-name">{r.circuit}</span>
                </div>
              </div>

              <div className="race-card-right">
                <div className="race-date-pill">
                  <Clock size={13} /> {r.date}
                </div>
                {isActive ? (
                  <span className="status-badge live">LIVE THIS WEEK</span>
                ) : (
                  <span className="status-badge upcoming">UPCOMING</span>
                )}
              </div>
            </div>
          );
        })}
      </div>
    </div>
  );
};

export default CalendarWidget;
