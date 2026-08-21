import React, { useState, useEffect, useRef } from 'react';
import Hls from 'hls.js';
import { 
  Tv, 
  Maximize2, 
  Minimize2, 
  Volume2, 
  VolumeX, 
  Radio, 
  Layers, 
  ExternalLink, 
  RefreshCw, 
  Sliders, 
  Video, 
  Camera, 
  Settings,
  CheckCircle2
} from 'lucide-react';
import './LiveStreamPlayer.css';

const DEFAULT_CHANNELS = [
  {
    id: 'f1tv_live',
    name: 'F1 Live Broadcast',
    category: 'MAIN FEED',
    type: 'iframe',
    src: './stream_files/router.html',
    fallbackSrc: 'https://embedindia.st/embed/f1/2026/netherlands/fp1/f1tv',
    description: 'International Main Broadcast Feed with English Commentary & Timing Graphics'
  },
  {
    id: 'onboard_ver',
    name: 'Onboard: Max Verstappen #1',
    category: 'DRIVER CAM',
    type: 'hls_or_video',
    src: 'https://commondatastorage.googleapis.com/gtv-videos-bucket/sample/ForBiggerBlazes.mp4',
    description: 'Cockpit Halo Camera with Live Telemetry Overlay & Team Radio Feed'
  },
  {
    id: 'onboard_ham',
    name: 'Onboard: Lewis Hamilton #44',
    category: 'DRIVER CAM',
    type: 'hls_or_video',
    src: 'https://commondatastorage.googleapis.com/gtv-videos-bucket/sample/ForBiggerEscapes.mp4',
    description: 'Ferrari SF-26 Onboard Nosecone Camera & Steering Angle Telemetry'
  },
  {
    id: 'pitlane_feed',
    name: 'Pit Lane & Strategy Channel',
    category: 'DATA & PIT',
    type: 'hls_or_video',
    src: 'https://commondatastorage.googleapis.com/gtv-videos-bucket/sample/BigBuckBunny.mp4',
    description: 'Pit Lane Gantry Cameras, Undercut Delta Predictor & Tire Strategy'
  }
];

const LiveStreamPlayer = ({ isTheaterMode, onToggleTheater }) => {
  const [channels, setChannels] = useState(() => {
    const saved = localStorage.getItem('f1_custom_stream_url');
    if (saved) {
      return [
        ...DEFAULT_CHANNELS,
        {
          id: 'custom_user',
          name: 'Custom Stream Feed',
          category: 'USER STREAM',
          type: saved.includes('.m3u8') ? 'hls' : saved.includes('youtube') || saved.includes('embed') ? 'iframe' : 'hls_or_video',
          src: saved,
          description: 'User specified HLS / RTMP / Embed Video Feed'
        }
      ];
    }
    return DEFAULT_CHANNELS;
  });

  const [activeChannelId, setActiveChannelId] = useState('f1tv_live');
  const [customUrlInput, setCustomUrlInput] = useState('');
  const [showCustomModal, setShowCustomModal] = useState(false);
  const [isMuted, setIsMuted] = useState(false);
  const [volume, setVolume] = useState(0.85);
  const [isPlayerFullscreen, setIsPlayerFullscreen] = useState(false);
  const [streamError, setStreamError] = useState(null);
  const [isLoading, setIsLoading] = useState(false);

  const videoRef = useRef(null);
  const playerContainerRef = useRef(null);
  const hlsInstanceRef = useRef(null);

  const currentChannel = channels.find(c => c.id === activeChannelId) || channels[0];

  // Initialize HLS / Video playback when active channel changes
  useEffect(() => {
    setStreamError(null);
    setIsLoading(true);

    if (currentChannel.type === 'iframe') {
      setIsLoading(false);
      return;
    }

    const video = videoRef.current;
    if (!video) return;

    if (hlsInstanceRef.current) {
      hlsInstanceRef.current.destroy();
      hlsInstanceRef.current = null;
    }

    const isHls = currentChannel.src.endsWith('.m3u8') || currentChannel.type === 'hls';

    if (isHls && Hls.isSupported()) {
      const hls = new Hls({
        enableWorker: true,
        lowLatencyMode: true,
        backBufferLength: 30
      });
      hls.loadSource(currentChannel.src);
      hls.attachMedia(video);
      hls.on(Hls.Events.MANIFEST_PARSED, () => {
        setIsLoading(false);
        video.play().catch(e => console.log('Autoplay handled:', e));
      });
      hls.on(Hls.Events.ERROR, (event, data) => {
        if (data.fatal) {
          console.warn('Fatal HLS stream error:', data);
          setStreamError('Live stream feed currently unavailable or reconnecting.');
          setIsLoading(false);
        }
      });
      hlsInstanceRef.current = hls;
    } else {
      video.src = currentChannel.src;
      video.load();
      video.play()
        .then(() => setIsLoading(false))
        .catch(err => {
          console.log('Video play catch:', err.message);
          setIsLoading(false);
        });
    }

    return () => {
      if (hlsInstanceRef.current) {
        hlsInstanceRef.current.destroy();
        hlsInstanceRef.current = null;
      }
    };
  }, [activeChannelId, currentChannel]);

  // Fullscreen Handler
  const handleToggleFullscreen = () => {
    if (!playerContainerRef.current) return;
    if (!document.fullscreenElement) {
      playerContainerRef.current.requestFullscreen().then(() => {
        setIsPlayerFullscreen(true);
      }).catch(err => console.error(err));
    } else {
      document.exitFullscreen().then(() => {
        setIsPlayerFullscreen(false);
      }).catch(err => console.error(err));
    }
  };

  // Add Custom Stream URL
  const handleAddCustomStream = (e) => {
    e.preventDefault();
    if (!customUrlInput.trim()) return;

    const newUrl = customUrlInput.trim();
    localStorage.setItem('f1_custom_stream_url', newUrl);

    const customChannel = {
      id: 'custom_user',
      name: 'Custom Stream Feed',
      category: 'USER STREAM',
      type: newUrl.includes('.m3u8') ? 'hls' : (newUrl.includes('embed') || newUrl.includes('html') || newUrl.includes('youtube')) ? 'iframe' : 'hls_or_video',
      src: newUrl,
      description: 'User specified Live Stream Feed'
    };

    setChannels(prev => {
      const filtered = prev.filter(c => c.id !== 'custom_user');
      return [...filtered, customChannel];
    });

    setActiveChannelId('custom_user');
    setShowCustomModal(false);
  };

  return (
    <div className={`live-stream-container ${isTheaterMode ? 'theater' : ''}`} ref={playerContainerRef}>
      {/* Stream Header & Channel Bar */}
      <div className="stream-header-bar">
        <div className="stream-branding">
          <div className="live-rec-pill">
            <span className="rec-dot" /> LIVE STREAM
          </div>
          <div className="stream-title-text">
            <h3>{currentChannel.name}</h3>
            <p>{currentChannel.description}</p>
          </div>
        </div>

        <div className="stream-top-tools">
          <button 
            type="button" 
            className="tool-btn" 
            onClick={() => setShowCustomModal(true)}
            title="Configure Custom Stream URL"
          >
            <Sliders size={15} /> Custom Feed
          </button>
          {onToggleTheater && (
            <button 
              type="button" 
              className={`tool-btn ${isTheaterMode ? 'active' : ''}`} 
              onClick={onToggleTheater}
              title="Toggle Theater Mode"
            >
              <Layers size={15} /> {isTheaterMode ? 'Standard' : 'Theater'}
            </button>
          )}
          <button 
            type="button" 
            className="tool-btn" 
            onClick={handleToggleFullscreen}
            title="Toggle Fullscreen"
          >
            {isPlayerFullscreen ? <Minimize2 size={15} /> : <Maximize2 size={15} />}
          </button>
        </div>
      </div>

      {/* Main Video Viewport */}
      <div className="video-viewport">
        {currentChannel.type === 'iframe' ? (
          <div className="iframe-stream-wrapper">
            <iframe
              title={currentChannel.name}
              src={currentChannel.src}
              allow="autoplay; fullscreen; encrypted-media; picture-in-picture"
              allowFullScreen
              className="stream-iframe"
            />
          </div>
        ) : (
          <div className="native-video-wrapper">
            <video
              ref={videoRef}
              className="stream-video"
              muted={isMuted}
              controls
              playsInline
              autoPlay
            />
          </div>
        )}

        {isLoading && (
          <div className="stream-loading-overlay">
            <div className="f1-spinner" />
            <span>CONNECTING TO PIT WALL BROADCAST FEED...</span>
          </div>
        )}

        {streamError && (
          <div className="stream-error-overlay">
            <p>{streamError}</p>
            <button 
              type="button" 
              className="f1-primary-btn" 
              onClick={() => setActiveChannelId(currentChannel.id)}
            >
              <RefreshCw size={14} /> Retry Stream
            </button>
          </div>
        )}
      </div>

      {/* Multi-Channel Selector Strip */}
      <div className="channel-selector-strip">
        <div className="channel-strip-label">
          <Camera size={14} /> MULTI-VIEW CAMERAS
        </div>
        <div className="channels-scroll-row">
          {channels.map((ch) => {
            const isActive = ch.id === activeChannelId;
            return (
              <button
                key={ch.id}
                type="button"
                className={`channel-card-btn ${isActive ? 'active' : ''}`}
                onClick={() => setActiveChannelId(ch.id)}
              >
                <div className="ch-badge">{ch.category}</div>
                <div className="ch-name">{ch.name}</div>
                {isActive && <div className="ch-active-glow" />}
              </button>
            );
          })}
        </div>
      </div>

      {/* Custom Stream URL Modal */}
      {showCustomModal && (
        <div className="custom-stream-modal-backdrop" onClick={() => setShowCustomModal(false)}>
          <div className="custom-stream-modal" onClick={e => e.stopPropagation()}>
            <div className="modal-header">
              <div className="modal-title">
                <Video size={18} color="#00f0ff" />
                <h4>Connect Custom Stream Feed</h4>
              </div>
              <button type="button" className="close-btn" onClick={() => setShowCustomModal(false)}>✕</button>
            </div>
            <form onSubmit={handleAddCustomStream} className="modal-form">
              <p className="modal-desc">
                Paste any live HLS (.m3u8), direct MP4, YouTube live URL, or embed link to watch your preferred stream inside the dashboard.
              </p>
              <div className="input-group">
                <label>Stream URL (HLS / Embed / Direct):</label>
                <input
                  type="text"
                  placeholder="https://example.com/stream.m3u8 or ./stream_files/f1tv.html"
                  value={customUrlInput}
                  onChange={e => setCustomUrlInput(e.target.value)}
                  autoFocus
                />
              </div>
              <div className="modal-actions">
                <button type="button" className="btn-secondary" onClick={() => setShowCustomModal(false)}>Cancel</button>
                <button type="submit" className="f1-primary-btn">
                  <CheckCircle2 size={16} /> Load Stream Feed
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
};

export default LiveStreamPlayer;
