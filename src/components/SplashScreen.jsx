import React, { useState, useEffect } from 'react';
import './SplashScreen.css';

const SplashScreen = ({ onFinish }) => {
  const [progress, setProgress] = useState(15);
  const [isFading, setIsFading] = useState(false);

  useEffect(() => {
    // Smooth progress increment
    const interval = setInterval(() => {
      setProgress(prev => {
        if (prev >= 100) {
          clearInterval(interval);
          return 100;
        }
        return prev + 15;
      });
    }, 150);

    // Fade out and finish after 1.6s
    const fadeTimer = setTimeout(() => {
      setIsFading(true);
    }, 1500);

    const finishTimer = setTimeout(() => {
      if (onFinish) onFinish();
    }, 1800);

    return () => {
      clearInterval(interval);
      clearTimeout(fadeTimer);
      clearTimeout(finishTimer);
    };
  }, [onFinish]);

  const handleQuickSkip = () => {
    setIsFading(true);
    setTimeout(() => {
      if (onFinish) onFinish();
    }, 150);
  };

  return (
    <div 
      className={`splash-screen ${isFading ? 'fading-out' : ''}`}
      onClick={handleQuickSkip}
      title="Click anywhere to enter"
    >
      <div className="splash-glow-bg" />

      <div className="splash-content">
        {/* F1 Speed Logo */}
        <div className="f1-badge-logo">
          <span className="logo-f">F</span>
          <span className="logo-1">1</span>
        </div>

        {/* Realistic Spinning F1 Wheel / Tire */}
        <div className="wheel-stage">
          <div className="wheel-shadow" />
          <div className="spinning-wheel">
            {/* Outer Tire & Sidewall */}
            <div className="tire-rubber">
              <div className="tire-compound-stripe" />
              <div className="tire-text top">P ZERO</div>
              <div className="tire-text bottom">FORMULA 1</div>
              <div className="tire-text left">PIRELLI</div>
              <div className="tire-text right">18 INCH</div>
            </div>

            {/* Inner Wheel Rim & Spokes */}
            <div className="wheel-rim">
              <div className="rim-outer-ring" />
              {[0, 36, 72, 108, 144, 180, 216, 252, 288, 324].map((deg) => (
                <div 
                  key={deg} 
                  className="spoke-pair" 
                  style={{ transform: `translate(-50%, -50%) rotate(${deg}deg)` }}
                >
                  <div className="spoke-blade" />
                </div>
              ))}
              {/* Center Wheel Nut */}
              <div className="wheel-center-nut">
                <div className="nut-core" />
              </div>
            </div>
          </div>
        </div>

        {/* Title & Status */}
        <div className="splash-text-container">
          <h1 className="splash-title">PIT WALL COMMAND</h1>
          <p className="splash-subtitle">INITIALIZING REAL-TIME TELEMETRY...</p>
        </div>

        {/* Minimal High-Speed Progress Bar */}
        <div className="loading-progress-bar">
          <div className="progress-fill" style={{ width: `${progress}%` }} />
        </div>

        <div className="skip-hint">CLICK ANYWHERE TO SKIP</div>
      </div>
    </div>
  );
};

export default SplashScreen;