import React, { useState, useRef, useEffect } from "react";
import { Volume2, VolumeX, Maximize } from "lucide-react";
import "./VideoPlayer.css";
import withBase from "../../utils/assetPath";

const VideoPlayer = () => {
  const [isPlaying, setIsPlaying] = useState(true);
  const [isMuted, setIsMuted] = useState(true);
  const [currentTime, setCurrentTime] = useState(0);
  const [duration, setDuration] = useState(0);
  const [showControls, setShowControls] = useState(false);
  const [firstClick, setFirstClick] = useState(true);
  const videoRef = useRef(null);

  useEffect(() => {
    if (videoRef.current) {
      videoRef.current.muted = true;
      videoRef.current.play();
      setDuration(videoRef.current.duration);
    }
  }, [videoRef.current]);

  const handleVideoClick = () => {
    if (firstClick) {
      videoRef.current.muted = false;
      setIsMuted(false);
      setShowControls(true);
      setFirstClick(false);
    } else {
      if (videoRef.current.paused) {
        videoRef.current.play();
        setIsPlaying(true);
      } else {
        videoRef.current.pause();
        setIsPlaying(false);
      }
    }
  };

  const toggleMute = (e) => {
    e.stopPropagation();
    videoRef.current.muted = !videoRef.current.muted;
    setIsMuted(!isMuted);
  };

  const handleTimeUpdate = () => {
    setCurrentTime(videoRef.current.currentTime);
  };

  const toggleFullScreen = (e) => {
    e.stopPropagation();
    if (videoRef.current) {
      if (document.fullscreenElement) {
        document.exitFullscreen();
      } else {
        videoRef.current.requestFullscreen();
      }
    }
  };

  const formatTime = (time) => {
    const minutes = Math.floor(time / 60);
    const seconds = Math.floor(time % 60);
    return `${minutes}:${seconds.toString().padStart(2, "0")}`;
  };

  return (
    <div className="video-container" onClick={handleVideoClick}>
      <video
        ref={videoRef}
        className="video-player"
        onTimeUpdate={handleTimeUpdate}
        onLoadedMetadata={() => setDuration(videoRef.current.duration)}
  src={withBase("video/showreel.mov")}
        autoPlay
        loop
        playsInline
      >
        Your browser does not support the video tag.
      </video>

      {showControls && (
        <div className="video-controls">
          <div className="controls-wrapper">
            <span className="time-display">
              {formatTime(currentTime)} / {formatTime(duration)}
            </span>

            <div className="control-buttons">
              <button onClick={toggleMute} className="control-button">
                {isMuted ? (
                  <VolumeX className="icon" />
                ) : (
                  <Volume2 className="icon" />
                )}
              </button>

              <button onClick={toggleFullScreen} className="control-button">
                <Maximize className="icon" />
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default VideoPlayer;
