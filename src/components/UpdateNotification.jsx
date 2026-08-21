import React, { useState, useEffect } from 'react';
import { DownloadCloud, CheckCircle, AlertCircle, RefreshCw, Sparkles, ArrowRight } from 'lucide-react';
import './UpdateNotification.css';

const UpdateNotification = () => {
  const [updateState, setUpdateState] = useState({
    status: 'idle', // 'idle' | 'checking' | 'available' | 'not-available' | 'downloading' | 'downloaded' | 'error'
    info: null,
    progress: null,
    error: null
  });
  const [showModal, setShowModal] = useState(false);
  const [appVersion, setAppVersion] = useState('1.1.0');

  useEffect(() => {
    // Check if running in Electron
    if (window.electronAPI) {
      if (window.electronAPI.appVersion) {
        setAppVersion(window.electronAPI.appVersion);
      }

      // Initial status
      window.electronAPI.getUpdateStatus().then(status => {
        if (status) setUpdateState(status);
      }).catch(err => console.log('Initial update status fetch:', err));

      // Subscribe to updater events
      const unsubscribe = window.electronAPI.onUpdateStatusChanged((status) => {
        setUpdateState(status);
        if (status.status === 'available' || status.status === 'downloaded') {
          setShowModal(true);
        }
      });

      return () => {
        if (unsubscribe) unsubscribe();
      };
    }
  }, []);

  const handleCheckForUpdates = () => {
    if (window.electronAPI) {
      setUpdateState(prev => ({ ...prev, status: 'checking', error: null }));
      window.electronAPI.checkForUpdates();
    } else {
      // Web simulator test
      setUpdateState({ status: 'checking', info: null, progress: null, error: null });
      setTimeout(() => {
        setUpdateState({
          status: 'downloaded',
          info: { version: '1.1.0', releaseNotes: 'Revamped Pit Wall UI, live data feeds, integrated multi-cam streams, and 5 red lights loading sequence.' },
          progress: { percent: 100 }
        });
        setShowModal(true);
      }, 1200);
    }
  };

  const handleQuitAndInstall = () => {
    if (window.electronAPI) {
      window.electronAPI.quitAndInstall();
    } else {
      alert('In desktop Electron, this will restart the app and install the latest update automatically.');
      setShowModal(false);
    }
  };

  // Render Pill in Header
  const renderStatusPill = () => {
    switch (updateState.status) {
      case 'checking':
        return (
          <button type="button" className="update-pill checking" onClick={() => setShowModal(true)}>
            <RefreshCw size={13} className="spin-icon" /> Checking v{appVersion}...
          </button>
        );
      case 'downloading':
        return (
          <button type="button" className="update-pill downloading" onClick={() => setShowModal(true)}>
            <DownloadCloud size={13} className="bounce-icon" /> Downloading {updateState.progress?.percent || 0}%
          </button>
        );
      case 'downloaded':
        return (
          <button type="button" className="update-pill downloaded" onClick={() => setShowModal(true)}>
            <Sparkles size={13} /> Update Ready: Restart App
          </button>
        );
      case 'available':
        return (
          <button type="button" className="update-pill available" onClick={() => setShowModal(true)}>
            <DownloadCloud size={13} /> New v{updateState.info?.version || '1.1.0'} Found
          </button>
        );
      case 'error':
        return (
          <button type="button" className="update-pill error" onClick={() => setShowModal(true)}>
            <AlertCircle size={13} /> Update Error
          </button>
        );
      default:
        return (
          <button type="button" className="update-pill idle" onClick={handleCheckForUpdates} title="Check for Application Updates">
            <RefreshCw size={12} /> v{appVersion}
          </button>
        );
    }
  };

  return (
    <>
      {renderStatusPill()}

      {/* Update Info Modal */}
      {showModal && (
        <div className="update-modal-backdrop" onClick={() => setShowModal(false)}>
          <div className="update-modal" onClick={e => e.stopPropagation()}>
            <div className="update-modal-header">
              <div className="modal-title">
                <Sparkles size={20} color="#00f0ff" />
                <h4>F1 Pit Wall Command Updater</h4>
              </div>
              <button type="button" className="close-btn" onClick={() => setShowModal(false)}>✕</button>
            </div>

            <div className="update-modal-body">
              <div className="version-diff-card">
                <div className="ver-badge current">Current: v{appVersion}</div>
                <ArrowRight size={16} color="#8c9ba8" />
                <div className="ver-badge new">Latest: v{updateState.info?.version || '1.1.0'}</div>
              </div>

              {updateState.status === 'downloading' && (
                <div className="download-progress-section">
                  <div className="progress-label">
                    <span>Downloading update package...</span>
                    <span>{updateState.progress?.percent || 0}%</span>
                  </div>
                  <div className="progress-track">
                    <div 
                      className="progress-fill" 
                      style={{ width: `${updateState.progress?.percent || 0}%` }} 
                    />
                  </div>
                </div>
              )}

              {updateState.status === 'downloaded' && (
                <div className="update-ready-box">
                  <CheckCircle size={22} color="#00ff66" />
                  <div>
                    <h5>Update Downloaded & Verified</h5>
                    <p>The application is ready to restart and install the latest release immediately.</p>
                  </div>
                </div>
              )}

              {updateState.status === 'not-available' && (
                <p className="update-info-text">
                  You are already running the latest version of F1 Pit Wall Command Center (v{appVersion}).
                </p>
              )}

              {updateState.status === 'error' && (
                <p className="update-error-text">
                  Update check error: {updateState.error || 'Could not connect to GitHub releases.'}
                </p>
              )}

              <div className="changelog-box">
                <h6>✨ Release Highlights:</h6>
                <ul>
                  <li>🏎️ Complete UI overhaul with broadcast Pit Wall telemetry tower.</li>
                  <li>📡 Live OpenF1 & Jolpica API telemetry data integration.</li>
                  <li>📺 Integrated multi-channel Live Stream Player (HLS / User Feed).</li>
                  <li>🚦 5 Red Lights "Lights Out" launch screen with Web Audio synthesizer.</li>
                  <li>⚡ Automatic background updates via GitHub Actions CI/CD.</li>
                </ul>
              </div>
            </div>

            <div className="update-modal-footer">
              {updateState.status === 'downloaded' ? (
                <button type="button" className="f1-primary-btn restart-btn" onClick={handleQuitAndInstall}>
                  <Sparkles size={16} /> Restart & Install Update Now
                </button>
              ) : (
                <button type="button" className="f1-primary-btn" onClick={handleCheckForUpdates}>
                  <RefreshCw size={15} /> Check for Updates
                </button>
              )}
            </div>
          </div>
        </div>
      )}
    </>
  );
};

export default UpdateNotification;
