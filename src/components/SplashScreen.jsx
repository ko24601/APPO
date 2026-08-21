import React from 'react';
import './SplashScreen.css';

const SplashScreen = () => {
  return (
    <div className="splash-screen">
      <div className="splash-content">
        <div className="logo">
          <div className="logo-circle">
            <span className="logo-text">F1</span>
          </div>
        </div>
        <div className="f1-wheel">
          <div className="wheel-rim">
            {/* Wheel spokes */}
            <div className="wheel-spoke"></div>
            <div className="wheel-spoke"></div>
            <div className="wheel-spoke"></div>
            <div className="wheel-spoke"></div>
            <div className="wheel-spoke"></div>
            <div className="wheel-spoke"></div>
            <div className="wheel-spoke"></div>
            <div className="wheel-spoke"></div>
            <div className="wheel-spoke"></div>
            <div className="wheel-spoke"></div>
            <div className="wheel-spoke"></div>
            <div className="wheel-spoke"></div>
            {/* Wheel hub */}
            <div className="wheel-hub"></div>
          </div>
        </div>
        <div className="pit-stop">
          <div className="wrench"></div>
          <span>PIT STOP</span>
        </div>
      </div>
    </div>
  );
};

export default SplashScreen;