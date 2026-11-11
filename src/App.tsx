import React, { useState, useEffect, useRef, useCallback } from 'react';
import {
  Lock,
  Unlock,
  Play,
  Film,
  Smartphone,
  Shield,
  Settings,
  Clock,
  Sparkles,
  Volume2,
  VolumeX,
  Eye,
  Sliders,
  CheckCircle,
  HelpCircle,
  ExternalLink,
} from 'lucide-react';
import { CartoonVideo, ChildLockSettings, UnlockMethod } from './types';
import { INITIAL_CARTOONS } from './data/cartoons';
import { useChildLock } from './hooks/useChildLock';
import { VideoPlayer } from './components/VideoPlayer';
import { ChildLockOverlay } from './components/ChildLockOverlay';
import { UnlockModal } from './components/UnlockModal';
import { CartoonLibrary } from './components/CartoonLibrary';
import { AndroidSetupGuide } from './components/AndroidSetupGuide';
import { DeviceSimulator } from './components/DeviceSimulator';
import { ParentSettingsModal } from './components/ParentSettingsModal';
import { BedtimeScreen } from './components/BedtimeScreen';

export default function App() {
  const [cartoons, setCartoons] = useState<CartoonVideo[]>(INITIAL_CARTOONS);
  const [currentVideo, setCurrentVideo] = useState<CartoonVideo>(INITIAL_CARTOONS[0]);
  const [activeTab, setActiveTab] = useState<'player' | 'cartoons' | 'guide' | 'simulator'>('player');
  const [isLocked, setIsLocked] = useState<boolean>(false);
  const [deviceSimulatorType, setDeviceSimulatorType] = useState<'phone' | 'tablet'>('phone');

  // Child Lock Configurations
  const [settings, setSettings] = useState<ChildLockSettings>({
    pin: '1234',
    unlockMethod: 'pin',
    lockedVolume: 50,
    maxVolumeCap: 75,
    blockTopPullDown: true,
    blockBottomNav: true,
    blockVolumeKeys: true,
    touchEffect: 'stars',
    enableEyeComfort: false,
    autoLockDelaySeconds: 0,
    allowLooping: true,
    allowAutoNext: true,
  });

  // Session Screen Time Timer
  const [sessionMinutes, setSessionMinutes] = useState<number>(30); // 30 min default
  const [remainingSeconds, setRemainingSeconds] = useState<number>(30 * 60);
  const [isTimerExpired, setIsTimerExpired] = useState<boolean>(false);

  // Modals & Feedback Toasts
  const [showUnlockModal, setShowUnlockModal] = useState<boolean>(false);
  const [showSettingsModal, setShowSettingsModal] = useState<boolean>(false);
  const [volumeToastMessage, setVolumeToastMessage] = useState<string | null>(null);
  const [edgeToastMessage, setEdgeToastMessage] = useState<string | null>(null);

  const volumeTimeoutRef = useRef<any>(null);
  const edgeTimeoutRef = useRef<any>(null);

  // Notification for Volume Key Tampering Attempt
  const handleVolumeAttempt = useCallback((type: 'up' | 'down') => {
    setVolumeToastMessage(`Volume ${type === 'up' ? '+' : '-'} blocked · Locked at ${settings.lockedVolume}%`);
    if (volumeTimeoutRef.current) clearTimeout(volumeTimeoutRef.current);
    volumeTimeoutRef.current = setTimeout(() => {
      setVolumeToastMessage(null);
    }, 2400);
  }, [settings.lockedVolume]);

  // Notification for Drop-Down Menu Pull Attempt
  const handleEdgePullAttempt = useCallback((edge: 'top' | 'bottom') => {
    setEdgeToastMessage(
      edge === 'top'
        ? 'Notification pull-down blocked · Screen locked to video'
        : 'Navigation gesture blocked · Return to video locked'
    );
    if (edgeTimeoutRef.current) clearTimeout(edgeTimeoutRef.current);
    edgeTimeoutRef.current = setTimeout(() => {
      setEdgeToastMessage(null);
    }, 2400);
  }, []);

  // Child Lock System Hook
  const { enterFullscreen, exitFullscreen } = useChildLock({
    isLocked,
    settings,
    onVolumeAttempt: handleVolumeAttempt,
    onEdgePullAttempt: handleEdgePullAttempt,
  });

  // Countdown timer for session limits
  useEffect(() => {
    if (!isLocked || sessionMinutes === 0 || isTimerExpired) return;

    const timer = setInterval(() => {
      setRemainingSeconds((prev) => {
        if (prev <= 1) {
          clearInterval(timer);
          setIsTimerExpired(true);
          return 0;
        }
        return prev - 1;
      });
    }, 1000);

    return () => clearInterval(timer);
  }, [isLocked, sessionMinutes, isTimerExpired]);

  // Lock Actions
  const handleActivateLock = () => {
    setIsLocked(true);
    setIsTimerExpired(false);
    if (sessionMinutes > 0 && remainingSeconds <= 0) {
      setRemainingSeconds(sessionMinutes * 60);
    }
    enterFullscreen();
  };

  const handleUnlockSuccess = () => {
    setIsLocked(false);
    setShowUnlockModal(false);
    setIsTimerExpired(false);
    exitFullscreen();
  };

  // Video Navigation
  const handleNextVideo = () => {
    const currentIndex = cartoons.findIndex((v) => v.id === currentVideo.id);
    const nextIndex = (currentIndex + 1) % cartoons.length;
    setCurrentVideo(cartoons[nextIndex]);
  };

  const handlePrevVideo = () => {
    const currentIndex = cartoons.findIndex((v) => v.id === currentVideo.id);
    const prevIndex = (currentIndex - 1 + cartoons.length) % cartoons.length;
    setCurrentVideo(cartoons[prevIndex]);
  };

  const handleAddCustomVideo = (newVideo: CartoonVideo) => {
    setCartoons((prev) => [newVideo, ...prev]);
  };

  return (
    <div className="min-h-screen bg-slate-950 text-slate-100 flex flex-col font-sans">
      {/* FULLSCREEN LOCK MODE CONTAINER */}
      {isLocked ? (
        <div className="fixed inset-0 z-50 bg-black flex items-center justify-center overflow-hidden">
          {/* Active Video Player */}
          <VideoPlayer
            currentVideo={currentVideo}
            isLocked={true}
            settings={settings}
            onLockClick={() => {}}
            onNextVideo={handleNextVideo}
            onPrevVideo={handlePrevVideo}
          />

          {/* Touch Blocker & Gesture Shield */}
          <ChildLockOverlay
            isLocked={true}
            settings={settings}
            sessionRemainingSeconds={sessionMinutes > 0 ? remainingSeconds : undefined}
            volumeToastMessage={volumeToastMessage}
            edgeToastMessage={edgeToastMessage}
            onRequestUnlock={() => setShowUnlockModal(true)}
            onHoldUnlockComplete={handleUnlockSuccess}
            onCornerTapSuccess={handleUnlockSuccess}
          />

          {/* Bedtime Screen when timer runs out */}
          {isTimerExpired && (
            <BedtimeScreen
              onParentUnlock={() => setShowUnlockModal(true)}
              onExtendTenMinutes={() => {
                setRemainingSeconds(600);
                setIsTimerExpired(false);
              }}
            />
          )}

          {/* Parental Unlock Modal */}
          <UnlockModal
            isOpen={showUnlockModal}
            settings={settings}
            onSuccess={handleUnlockSuccess}
            onClose={() => setShowUnlockModal(false)}
          />
        </div>
      ) : (
        /* UNLOCKED PARENT DASHBOARD & CONTROLS */
        <div className="flex flex-col min-h-screen">
          {/* Top Bar (adheres to Top Bar Contract: Brand — 4-5 single-line links — 1 CTA) */}
          <header className="sticky top-0 z-40 bg-slate-950/90 backdrop-blur-md border-b border-slate-800/80">
            <div className="max-w-7xl mx-auto px-4 sm:px-6 h-16 flex items-center justify-between gap-8">
              {/* Zone 1: Single text wordmark */}
              <div className="flex items-center gap-2.5 whitespace-nowrap shrink-0">
                <div className="w-8 h-8 rounded-xl bg-amber-400 text-slate-950 flex items-center justify-center font-bold text-sm shadow-md shadow-amber-400/20">
                  <Play className="w-4 h-4 fill-current ml-0.5" />
                </div>
                <span className="text-lg font-bold font-display tracking-tight text-white">
                  Play Time
                </span>
              </div>

              {/* Zone 2: 4 single-line navigation links */}
              <nav className="hidden md:flex items-center gap-6 text-sm font-medium text-slate-300">
                <button
                  onClick={() => setActiveTab('player')}
                  className={`transition-colors whitespace-nowrap shrink-0 ${
                    activeTab === 'player'
                      ? 'text-amber-400 font-semibold'
                      : 'hover:text-white'
                  }`}
                >
                  Media Player
                </button>
                <button
                  onClick={() => setActiveTab('cartoons')}
                  className={`transition-colors whitespace-nowrap shrink-0 ${
                    activeTab === 'cartoons'
                      ? 'text-amber-400 font-semibold'
                      : 'hover:text-white'
                  }`}
                >
                  Cartoon Library
                </button>
                <button
                  onClick={() => setActiveTab('simulator')}
                  className={`transition-colors whitespace-nowrap shrink-0 ${
                    activeTab === 'simulator'
                      ? 'text-amber-400 font-semibold'
                      : 'hover:text-white'
                  }`}
                >
                  Device Simulator
                </button>
                <button
                  onClick={() => setActiveTab('guide')}
                  className={`transition-colors whitespace-nowrap shrink-0 ${
                    activeTab === 'guide'
                      ? 'text-amber-400 font-semibold'
                      : 'hover:text-white'
                  }`}
                >
                  Android Setup Guide
                </button>
              </nav>

              {/* Zone 3: 1 Primary CTA */}
              <div className="flex items-center gap-3 shrink-0">
                <button
                  onClick={() => setShowSettingsModal(true)}
                  className="p-2 text-slate-400 hover:text-white rounded-xl hover:bg-slate-900 border border-transparent hover:border-slate-800 transition-colors"
                  title="Parent Safety Settings"
                  aria-label="Settings"
                >
                  <Settings className="w-4 h-4" />
                </button>

                <button
                  onClick={handleActivateLock}
                  className="flex items-center gap-2 px-4 py-2 text-xs font-bold text-slate-950 bg-amber-400 hover:bg-amber-300 rounded-xl shadow-md shadow-amber-400/20 transition-all active:scale-95 whitespace-nowrap shrink-0 cursor-pointer"
                >
                  <Lock className="w-3.5 h-3.5" />
                  <span>Lock for Child</span>
                </button>
              </div>
            </div>
          </header>

          {/* Quick Parent Status Banner */}
          <div className="bg-slate-900/60 border-b border-slate-800/60 px-4 py-2.5 text-xs text-slate-300">
            <div className="max-w-7xl mx-auto flex flex-wrap items-center justify-between gap-3">
              <div className="flex items-center gap-4 text-[11px] text-slate-400">
                <span className="flex items-center gap-1.5 text-amber-400 font-medium">
                  <Shield className="w-3.5 h-3.5" />
                  <span>Ready to Child-Proof</span>
                </span>
                <span className="hidden sm:inline" aria-hidden="true">·</span>
                <span className="hidden sm:inline">Volume locked: {settings.lockedVolume}%</span>
                <span className="hidden sm:inline" aria-hidden="true">·</span>
                <span className="hidden sm:inline">Unlock mode: {settings.unlockMethod.toUpperCase()}</span>
                {sessionMinutes > 0 && (
                  <>
                    <span className="hidden sm:inline" aria-hidden="true">·</span>
                    <span className="hidden sm:inline">Session limit: {sessionMinutes} min</span>
                  </>
                )}
              </div>

              {/* Mobile Tab Pill Switcher (for small touch screens) */}
              <div className="flex md:hidden items-center gap-1 p-0.5 rounded-lg bg-slate-800/80">
                <button
                  onClick={() => setActiveTab('player')}
                  className={`px-2.5 py-1 text-[11px] rounded-md transition-colors ${
                    activeTab === 'player' ? 'bg-amber-400 text-slate-950 font-bold' : 'text-slate-400'
                  }`}
                >
                  Player
                </button>
                <button
                  onClick={() => setActiveTab('cartoons')}
                  className={`px-2.5 py-1 text-[11px] rounded-md transition-colors ${
                    activeTab === 'cartoons' ? 'bg-amber-400 text-slate-950 font-bold' : 'text-slate-400'
                  }`}
                >
                  Cartoons
                </button>
                <button
                  onClick={() => setActiveTab('simulator')}
                  className={`px-2.5 py-1 text-[11px] rounded-md transition-colors ${
                    activeTab === 'simulator' ? 'bg-amber-400 text-slate-950 font-bold' : 'text-slate-400'
                  }`}
                >
                  Simulator
                </button>
                <button
                  onClick={() => setActiveTab('guide')}
                  className={`px-2.5 py-1 text-[11px] rounded-md transition-colors ${
                    activeTab === 'guide' ? 'bg-amber-400 text-slate-950 font-bold' : 'text-slate-400'
                  }`}
                >
                  Guide
                </button>
              </div>
            </div>
          </div>

          {/* Main Content Area */}
          <main className="flex-1 max-w-7xl w-full mx-auto p-4 sm:p-6 lg:p-8">
            {/* TAB 1: PLAYER VIEW */}
            {activeTab === 'player' && (
              <div className="space-y-6">
                {/* Hero Player Container */}
                <div className="relative w-full aspect-video md:aspect-[21/9] max-h-[580px] rounded-3xl overflow-hidden border border-slate-800 bg-black shadow-2xl">
                  <VideoPlayer
                    currentVideo={currentVideo}
                    isLocked={false}
                    settings={settings}
                    onLockClick={handleActivateLock}
                    onNextVideo={handleNextVideo}
                    onPrevVideo={handlePrevVideo}
                  />
                </div>

                {/* Parent Pre-Lock Action Bar */}
                <div className="grid grid-cols-1 md:grid-cols-4 gap-4 p-5 rounded-3xl bg-slate-900 border border-slate-800">
                  <div className="space-y-1">
                    <span className="text-[11px] font-semibold uppercase tracking-wider text-slate-400">
                      Child Safety Lock
                    </span>
                    <h4 className="text-sm font-bold text-white">Full Screen & Touch Guard</h4>
                    <p className="text-xs text-slate-400">
                      Disables all taps, edge swipes, and hardware volume changes.
                    </p>
                  </div>

                  <div className="space-y-1">
                    <span className="text-[11px] font-semibold uppercase tracking-wider text-slate-400">
                      Volume Control
                    </span>
                    <div className="flex items-center gap-2">
                      <Volume2 className="w-4 h-4 text-amber-400" />
                      <span className="text-sm font-bold text-white">{settings.lockedVolume}% Sound</span>
                    </div>
                    <p className="text-xs text-slate-400">
                      Max decibel safety cap: {settings.maxVolumeCap}%
                    </p>
                  </div>

                  <div className="space-y-1">
                    <span className="text-[11px] font-semibold uppercase tracking-wider text-slate-400">
                      Screen Time Timer
                    </span>
                    <div className="flex items-center gap-2">
                      <Clock className="w-4 h-4 text-sky-400" />
                      <span className="text-sm font-bold text-white">
                        {sessionMinutes === 0 ? 'No Limit' : `${sessionMinutes} Minutes`}
                      </span>
                    </div>
                    <p className="text-xs text-slate-400">
                      Shows gentle bedtime screen when done.
                    </p>
                  </div>

                  <div className="flex items-center justify-end">
                    <button
                      onClick={handleActivateLock}
                      className="w-full md:w-auto px-6 py-3 rounded-2xl bg-amber-400 hover:bg-amber-300 text-slate-950 font-bold text-xs flex items-center justify-center gap-2 shadow-xl shadow-amber-400/20 active:scale-95 transition-all cursor-pointer"
                    >
                      <Lock className="w-4 h-4" />
                      <span>Start Child Lock</span>
                    </button>
                  </div>
                </div>

                {/* Up Next / Recommended Cartoons Strip */}
                <div className="space-y-3">
                  <div className="flex items-center justify-between">
                    <h4 className="text-base font-bold text-white font-display">
                      More Safe Cartoons & Stories
                    </h4>
                    <button
                      onClick={() => setActiveTab('cartoons')}
                      className="text-xs text-amber-400 hover:text-amber-300 font-semibold cursor-pointer"
                    >
                      View All in Library →
                    </button>
                  </div>

                  <div className="grid grid-cols-2 sm:grid-cols-4 gap-3">
                    {cartoons.slice(0, 4).map((item) => (
                      <div
                        key={item.id}
                        onClick={() => setCurrentVideo(item)}
                        className={`p-3 rounded-2xl border transition-all cursor-pointer ${
                          item.id === currentVideo.id
                            ? 'bg-slate-850 border-amber-400/80 shadow-md'
                            : 'bg-slate-900 border-slate-800 hover:border-slate-700'
                        }`}
                      >
                        <div className="flex items-center justify-between text-[10px] text-amber-400 font-medium mb-1">
                          <span>{item.category}</span>
                          <span>{item.duration}</span>
                        </div>
                        <h5 className="text-xs font-bold text-white truncate">{item.title}</h5>
                        <p className="text-[11px] text-slate-400 line-clamp-1 mt-0.5">
                          {item.description}
                        </p>
                      </div>
                    ))}
                  </div>
                </div>
              </div>
            )}

            {/* TAB 2: CARTOON & VIDEO LIBRARY */}
            {activeTab === 'cartoons' && (
              <CartoonLibrary
                cartoons={cartoons}
                selectedVideoId={currentVideo.id}
                onSelectVideo={(video) => {
                  setCurrentVideo(video);
                  setActiveTab('player');
                }}
                onAddCustomVideo={handleAddCustomVideo}
              />
            )}

            {/* TAB 3: DEVICE SIMULATOR (TEST HARDWARE & NOTIFICATION SHADE LOCK) */}
            {activeTab === 'simulator' && (
              <div className="space-y-6">
                <div className="text-center max-w-xl mx-auto space-y-1">
                  <h3 className="text-xl font-bold font-display text-white">
                    Interactive Device & Hardware Tamper Sandbox
                  </h3>
                  <p className="text-xs text-slate-400">
                    Test how Play Time defends against toddlers on phone or tablet: click the top notification bar to pull down, click hardware volume keys, or lock the screen to test touch stars!
                  </p>
                </div>

                <DeviceSimulator
                  deviceType={deviceSimulatorType}
                  onDeviceTypeChange={setDeviceSimulatorType}
                  isLocked={isLocked}
                  onSimulateVolume={handleVolumeAttempt}
                  onSimulateDropDownAttempt={() => handleEdgePullAttempt('top')}
                >
                  <VideoPlayer
                    currentVideo={currentVideo}
                    isLocked={isLocked}
                    settings={settings}
                    onLockClick={handleActivateLock}
                    onNextVideo={handleNextVideo}
                    onPrevVideo={handlePrevVideo}
                  />

                  {isLocked && (
                    <ChildLockOverlay
                      isLocked={true}
                      settings={settings}
                      sessionRemainingSeconds={sessionMinutes > 0 ? remainingSeconds : undefined}
                      volumeToastMessage={volumeToastMessage}
                      edgeToastMessage={edgeToastMessage}
                      onRequestUnlock={() => setShowUnlockModal(true)}
                      onHoldUnlockComplete={handleUnlockSuccess}
                      onCornerTapSuccess={handleUnlockSuccess}
                    />
                  )}
                </DeviceSimulator>
              </div>
            )}

            {/* TAB 4: ANDROID SYSTEM SETUP GUIDE */}
            {activeTab === 'guide' && <AndroidSetupGuide />}
          </main>

          {/* Footer */}
          <footer className="mt-auto border-t border-slate-900 bg-slate-950/80 py-6 px-4 text-center text-xs text-slate-500">
            <div className="max-w-7xl mx-auto flex flex-col sm:flex-row items-center justify-between gap-3">
              <p>Play Time · Child Proof Video Player & Screen Lock for Android</p>
              <div className="flex items-center gap-4 text-slate-400">
                <button
                  onClick={() => setShowSettingsModal(true)}
                  className="hover:text-amber-400 transition-colors cursor-pointer"
                >
                  Parent Controls
                </button>
                <button
                  onClick={() => setActiveTab('guide')}
                  className="hover:text-amber-400 transition-colors cursor-pointer"
                >
                  App Pinning Guide
                </button>
              </div>
            </div>
          </footer>

          {/* Settings Modal */}
          <ParentSettingsModal
            isOpen={showSettingsModal}
            settings={settings}
            sessionMinutes={sessionMinutes}
            onSaveSettings={(newSettings, newMinutes) => {
              setSettings(newSettings);
              setSessionMinutes(newMinutes);
              setRemainingSeconds(newMinutes * 60);
            }}
            onClose={() => setShowSettingsModal(false)}
          />

          {/* Unlock Modal (when opened from simulator or parent check) */}
          <UnlockModal
            isOpen={showUnlockModal}
            settings={settings}
            onSuccess={handleUnlockSuccess}
            onClose={() => setShowUnlockModal(false)}
          />
        </div>
      )}
    </div>
  );
}
