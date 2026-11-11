import React, { useRef, useEffect, useState, useCallback } from 'react';
import {
  Play,
  Pause,
  RotateCcw,
  SkipForward,
  Volume2,
  VolumeX,
  Maximize2,
  Minimize2,
  Lock,
  SunMedium,
  Check,
  AlertTriangle,
} from 'lucide-react';
import { CartoonVideo, ChildLockSettings } from '../types';

interface VideoPlayerProps {
  currentVideo: CartoonVideo;
  isLocked: boolean;
  settings: ChildLockSettings;
  onLockClick: () => void;
  onNextVideo: () => void;
  onPrevVideo: () => void;
  onVideoEnded?: () => void;
}

export const VideoPlayer: React.FC<VideoPlayerProps> = ({
  currentVideo,
  isLocked,
  settings,
  onLockClick,
  onNextVideo,
  onPrevVideo,
  onVideoEnded,
}) => {
  const videoRef = useRef<HTMLVideoElement>(null);
  const [isPlaying, setIsPlaying] = useState<boolean>(true);
  const [currentTime, setCurrentTime] = useState<number>(0);
  const [duration, setDuration] = useState<number>(0);
  const [objectFit, setObjectFit] = useState<'contain' | 'cover'>('contain');
  const [hasError, setHasError] = useState<boolean>(false);
  const [showParentControls, setShowParentControls] = useState<boolean>(true);
  const controlsTimeoutRef = useRef<any>(null);

  // Sync locked volume to the HTML5 video element
  useEffect(() => {
    if (videoRef.current) {
      const targetVol = Math.min(settings.lockedVolume, settings.maxVolumeCap) / 100;
      videoRef.current.volume = targetVol;
    }
  }, [settings.lockedVolume, settings.maxVolumeCap]);

  // Autoplay and reset on video change
  useEffect(() => {
    setHasError(false);
    if (videoRef.current) {
      videoRef.current.currentTime = 0;
      const playPromise = videoRef.current.play();
      if (playPromise !== undefined) {
        playPromise
          .then(() => setIsPlaying(true))
          .catch((err) => {
            console.warn('Auto-play prevented or user gesture required:', err);
            setIsPlaying(false);
          });
      }
    }
  }, [currentVideo]);

  // Handle controls fade in parent mode
  const triggerParentControlsActivity = useCallback(() => {
    if (isLocked) return;
    setShowParentControls(true);
    if (controlsTimeoutRef.current) clearTimeout(controlsTimeoutRef.current);
    controlsTimeoutRef.current = setTimeout(() => {
      if (isPlaying) {
        setShowParentControls(false);
      }
    }, 4500);
  }, [isLocked, isPlaying]);

  useEffect(() => {
    return () => {
      if (controlsTimeoutRef.current) clearTimeout(controlsTimeoutRef.current);
    };
  }, []);

  const togglePlay = () => {
    if (!videoRef.current) return;
    if (isPlaying) {
      videoRef.current.pause();
      setIsPlaying(false);
      setShowParentControls(true);
    } else {
      videoRef.current.play().then(() => setIsPlaying(true));
      triggerParentControlsActivity();
    }
  };

  const handleSeek = (e: React.ChangeEvent<HTMLInputElement>) => {
    const time = parseFloat(e.target.value);
    if (videoRef.current) {
      videoRef.current.currentTime = time;
      setCurrentTime(time);
    }
  };

  const formatTime = (seconds: number) => {
    if (isNaN(seconds)) return '0:00';
    const m = Math.floor(seconds / 60);
    const s = Math.floor(seconds % 60);
    return `${m}:${s < 10 ? '0' : ''}${s}`;
  };

  return (
    <div
      className="relative w-full h-full bg-black select-none overflow-hidden flex items-center justify-center"
      onMouseMove={triggerParentControlsActivity}
      onTouchStart={triggerParentControlsActivity}
    >
      {/* HTML5 Video Element */}
      <video
        ref={videoRef}
        src={currentVideo.videoUrl}
        className={`w-full h-full transition-all duration-300 ${
          objectFit === 'cover' ? 'object-cover' : 'object-contain'
        }`}
        playsInline
        autoPlay
        loop={settings.allowLooping}
        onTimeUpdate={() => {
          if (videoRef.current) {
            setCurrentTime(videoRef.current.currentTime);
          }
        }}
        onLoadedMetadata={() => {
          if (videoRef.current) {
            setDuration(videoRef.current.duration);
          }
        }}
        onEnded={() => {
          if (settings.allowAutoNext) {
            onNextVideo();
          } else {
            onVideoEnded?.();
          }
        }}
        onError={() => {
          setHasError(true);
        }}
      />

      {/* Eye Comfort Warm Filter (Blue Light reducer for kids) */}
      {settings.enableEyeComfort && (
        <div className="absolute inset-0 pointer-events-none bg-amber-500/10 mix-blend-color z-10" />
      )}

      {/* Network or Video Format Fallback */}
      {hasError && (
        <div className="absolute inset-0 flex flex-col items-center justify-center bg-slate-950/90 text-white p-6 z-20 text-center">
          <AlertTriangle className="w-12 h-12 text-amber-400 mb-3" />
          <h4 className="text-lg font-bold">Could not load this video</h4>
          <p className="text-xs text-slate-400 max-w-md mt-1 mb-4">
            The media stream could not be reached or format is unsupported on this browser. Choose another safe cartoon from the library or pick a local video file.
          </p>
          <div className="flex gap-3">
            <button
              onClick={onNextVideo}
              className="px-4 py-2 rounded-xl bg-amber-500 text-slate-950 font-semibold text-xs hover:bg-amber-400 cursor-pointer"
            >
              Play Next Cartoon
            </button>
          </div>
        </div>
      )}

      {/* Parent Overlay Controls (Visible only when UNLOCKED) */}
      {!isLocked && (
        <div
          className={`absolute inset-0 z-30 flex flex-col justify-between p-4 bg-gradient-to-t from-black/80 via-transparent to-black/70 transition-opacity duration-300 ${
            showParentControls ? 'opacity-100' : 'opacity-0 pointer-events-none'
          }`}
        >
          {/* Top Bar: Title & Lock Action */}
          <div className="flex items-center justify-between gap-4">
            <div className="flex items-center gap-3">
              <span className="text-xs font-semibold px-2.5 py-1 rounded-md bg-amber-500/20 text-amber-300 border border-amber-500/30">
                {currentVideo.ageRating}
              </span>
              <div>
                <h3 className="text-sm md:text-base font-bold text-white tracking-tight truncate max-w-[240px] md:max-w-md">
                  {currentVideo.title}
                </h3>
                <span className="text-xs text-slate-300">
                  {currentVideo.category} · {formatTime(currentTime)} / {formatTime(duration)}
                </span>
              </div>
            </div>

            {/* BIG LOCK BUTTON - Primary Action */}
            <button
              onClick={onLockClick}
              className="flex items-center gap-2 px-5 py-2.5 rounded-2xl bg-amber-400 hover:bg-amber-300 text-slate-950 font-bold text-sm shadow-xl shadow-amber-400/20 active:scale-95 transition-all cursor-pointer shrink-0"
              title="Lock screen and give phone to child"
            >
              <Lock className="w-4 h-4" />
              <span>Lock for Child</span>
            </button>
          </div>

          {/* Bottom Scrubbing and Media Bar */}
          <div className="space-y-3">
            {/* Seek bar */}
            <div className="flex items-center gap-3 text-xs text-slate-300">
              <span className="w-10 text-right font-mono">{formatTime(currentTime)}</span>
              <input
                type="range"
                min="0"
                max={duration || 100}
                step="0.5"
                value={currentTime}
                onChange={handleSeek}
                className="w-full h-1.5 bg-white/20 rounded-lg appearance-none cursor-pointer accent-amber-400"
              />
              <span className="w-10 font-mono">{formatTime(duration)}</span>
            </div>

            {/* Playback action buttons */}
            <div className="flex items-center justify-between">
              <div className="flex items-center gap-2">
                <button
                  onClick={() => {
                    if (videoRef.current) videoRef.current.currentTime = 0;
                  }}
                  className="p-2 text-white/80 hover:text-white rounded-lg hover:bg-white/10"
                  title="Restart video"
                >
                  <RotateCcw className="w-4 h-4" />
                </button>

                <button
                  onClick={togglePlay}
                  className="p-3 bg-white text-slate-950 rounded-full hover:bg-amber-400 transition-colors shadow-lg"
                  aria-label={isPlaying ? 'Pause' : 'Play'}
                >
                  {isPlaying ? <Pause className="w-5 h-5 fill-current" /> : <Play className="w-5 h-5 fill-current ml-0.5" />}
                </button>

                <button
                  onClick={onNextVideo}
                  className="p-2 text-white/80 hover:text-white rounded-lg hover:bg-white/10"
                  title="Next video"
                >
                  <SkipForward className="w-4 h-4" />
                </button>

                <div className="h-4 w-px bg-white/20 mx-1" />

                {/* Fit / Fill toggle */}
                <button
                  onClick={() => setObjectFit(objectFit === 'contain' ? 'cover' : 'contain')}
                  className="px-2.5 py-1 text-xs font-medium text-white/80 hover:text-white rounded-lg hover:bg-white/10 flex items-center gap-1.5"
                  title={objectFit === 'contain' ? 'Fill screen' : 'Fit video'}
                >
                  {objectFit === 'contain' ? <Maximize2 className="w-3.5 h-3.5" /> : <Minimize2 className="w-3.5 h-3.5" />}
                  <span>{objectFit === 'contain' ? 'Fit' : 'Fill'}</span>
                </button>
              </div>

              {/* Volume Status */}
              <div className="flex items-center gap-2 text-xs text-slate-300">
                <Volume2 className="w-4 h-4 text-amber-400" />
                <span>Locked Vol: {settings.lockedVolume}%</span>
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};
