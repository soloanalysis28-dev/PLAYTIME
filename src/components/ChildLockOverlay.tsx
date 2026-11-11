import React, { useState, useEffect, useRef, useCallback } from 'react';
import { Lock, VolumeX, ShieldAlert, Sparkles, Clock } from 'lucide-react';
import { ChildLockSettings, TouchEffectType, TouchSparkle } from '../types';

interface ChildLockOverlayProps {
  isLocked: boolean;
  settings: ChildLockSettings;
  sessionRemainingSeconds?: number;
  volumeToastMessage: string | null;
  edgeToastMessage: string | null;
  onRequestUnlock: () => void;
  onHoldUnlockComplete: () => void;
  onCornerTapSuccess?: () => void;
}

const SPARKLE_COLORS = ['#38bdf8', '#fbbf24', '#f472b6', '#4ade80', '#c084fc', '#f87171'];

export const ChildLockOverlay: React.FC<ChildLockOverlayProps> = ({
  isLocked,
  settings,
  sessionRemainingSeconds,
  volumeToastMessage,
  edgeToastMessage,
  onRequestUnlock,
  onHoldUnlockComplete,
  onCornerTapSuccess,
}) => {
  const [sparkles, setSparkles] = useState<TouchSparkle[]>([]);
  const [holdProgress, setHoldProgress] = useState<number>(0);
  const [isHolding, setIsHolding] = useState<boolean>(false);
  const [cornerTapCount, setCornerTapCount] = useState<number>(0);
  const [showUnlockAffordance, setShowUnlockAffordance] = useState<boolean>(false);

  const holdIntervalRef = useRef<any>(null);
  const cornerTapTimeoutRef = useRef<any>(null);
  const fadeAffordanceTimeoutRef = useRef<any>(null);

  // Briefly illuminate unlock handle when touched anywhere or idle
  const flashUnlockAffordance = useCallback(() => {
    setShowUnlockAffordance(true);
    if (fadeAffordanceTimeoutRef.current) {
      clearTimeout(fadeAffordanceTimeoutRef.current);
    }
    fadeAffordanceTimeoutRef.current = setTimeout(() => {
      setShowUnlockAffordance(false);
    }, 4000);
  }, []);

  // Spawn visual sparkles when child touches the screen
  const addSparkle = (clientX: number, clientY: number) => {
    if (settings.touchEffect === 'none') return;

    const newSparkle: TouchSparkle = {
      id: Date.now() + Math.random(),
      x: clientX,
      y: clientY,
      type: settings.touchEffect,
      color: SPARKLE_COLORS[Math.floor(Math.random() * SPARKLE_COLORS.length)],
      size: Math.floor(Math.random() * 20) + 24,
    };

    setSparkles((prev) => [...prev.slice(-12), newSparkle]);

    setTimeout(() => {
      setSparkles((prev) => prev.filter((s) => s.id !== newSparkle.id));
    }, 900);
  };

  // Intercept all touches on the main shield
  const handlePointerDown = (e: React.PointerEvent<HTMLDivElement>) => {
    e.preventDefault();
    e.stopPropagation();

    flashUnlockAffordance();
    addSparkle(e.clientX, e.clientY);

    // Check if child is swiping down near top edge (notification bar pull attempt)
    if (e.clientY < 50 && settings.blockTopPullDown) {
      // Caught by top edge barrier
    }
  };

  const handlePointerMove = (e: React.PointerEvent<HTMLDivElement>) => {
    e.preventDefault();
    e.stopPropagation();
    if (e.buttons > 0 && Math.random() > 0.6) {
      addSparkle(e.clientX, e.clientY);
    }
  };

  // Handle secret 4-tap corner unlock
  const handleCornerTap = (e: React.PointerEvent) => {
    e.preventDefault();
    e.stopPropagation();
    if (settings.unlockMethod !== 'corners') return;

    const nextCount = cornerTapCount + 1;
    setCornerTapCount(nextCount);

    if (cornerTapTimeoutRef.current) {
      clearTimeout(cornerTapTimeoutRef.current);
    }

    if (nextCount >= 4) {
      setCornerTapCount(0);
      onCornerTapSuccess?.();
    } else {
      cornerTapTimeoutRef.current = setTimeout(() => {
        setCornerTapCount(0);
      }, 1500);
    }
  };

  // Handle 3-second hold unlock button
  const startHold = (e: React.PointerEvent) => {
    e.preventDefault();
    e.stopPropagation();
    if (settings.unlockMethod !== 'hold') {
      onRequestUnlock();
      return;
    }

    setIsHolding(true);
    setHoldProgress(0);

    const startTime = Date.now();
    const duration = 2400; // 2.4s hold

    holdIntervalRef.current = setInterval(() => {
      const elapsed = Date.now() - startTime;
      const progress = Math.min(100, (elapsed / duration) * 100);
      setHoldProgress(progress);

      if (progress >= 100) {
        clearInterval(holdIntervalRef.current);
        setIsHolding(false);
        setHoldProgress(0);
        onHoldUnlockComplete();
      }
    }, 30);
  };

  const stopHold = (e: React.PointerEvent) => {
    e.preventDefault();
    e.stopPropagation();
    if (holdIntervalRef.current) {
      clearInterval(holdIntervalRef.current);
    }
    setIsHolding(false);
    setHoldProgress(0);
  };

  useEffect(() => {
    return () => {
      if (holdIntervalRef.current) clearInterval(holdIntervalRef.current);
      if (cornerTapTimeoutRef.current) clearTimeout(cornerTapTimeoutRef.current);
      if (fadeAffordanceTimeoutRef.current) clearTimeout(fadeAffordanceTimeoutRef.current);
    };
  }, []);

  if (!isLocked) return null;

  const formatTimer = (seconds: number) => {
    const mins = Math.floor(seconds / 60);
    const secs = seconds % 60;
    return `${mins}:${secs < 10 ? '0' : ''}${secs}`;
  };

  return (
    <div
      className="fixed inset-0 z-50 touch-locked select-none cursor-default overflow-hidden"
      onPointerDown={handlePointerDown}
      onPointerMove={handlePointerMove}
      onContextMenu={(e) => {
        e.preventDefault();
        e.stopPropagation();
      }}
      aria-label="Child Screen Lock Active"
    >
      {/* Top Edge Guard Barrier: Blocks notification bar / drop down menu swipes */}
      {settings.blockTopPullDown && (
        <div
          className="absolute top-0 left-0 right-0 h-12 z-30 pointer-events-auto bg-gradient-to-b from-black/40 to-transparent"
          onPointerDown={(e) => {
            e.preventDefault();
            e.stopPropagation();
            addSparkle(e.clientX, e.clientY);
          }}
        />
      )}

      {/* Bottom Edge Guard Barrier: Blocks home bar & app switcher gestures */}
      {settings.blockBottomNav && (
        <div
          className="absolute bottom-0 left-0 right-0 h-12 z-30 pointer-events-auto bg-gradient-to-t from-black/40 to-transparent"
          onPointerDown={(e) => {
            e.preventDefault();
            e.stopPropagation();
            addSparkle(e.clientX, e.clientY);
          }}
        />
      )}

      {/* Sparkles / Bubbles on child touch */}
      {sparkles.map((sparkle) => (
        <div
          key={sparkle.id}
          className="pointer-events-none absolute -translate-x-1/2 -translate-y-1/2 transition-transform duration-700 ease-out animate-in fade-in zoom-in"
          style={{
            left: sparkle.x,
            top: sparkle.y,
            color: sparkle.color,
          }}
        >
          {sparkle.type === 'bubbles' ? (
            <div
              className="rounded-full border-2 border-current shadow-lg shadow-current/30 animate-ping"
              style={{ width: sparkle.size, height: sparkle.size, opacity: 0.8 }}
            />
          ) : sparkle.type === 'hearts' ? (
            <span
              className="text-2xl animate-bounce"
              style={{ fontSize: sparkle.size }}
            >
              💖
            </span>
          ) : (
            <Sparkles
              className="animate-spin"
              style={{
                width: sparkle.size,
                height: sparkle.size,
                filter: `drop-shadow(0 0 8px ${sparkle.color})`,
              }}
            />
          )}
        </div>
      ))}

      {/* Top Status Indicators (Quiet, non-intrusive) */}
      <div className="absolute top-4 left-4 right-4 flex items-center justify-between pointer-events-none z-20">
        <div className="flex items-center gap-2 px-3 py-1.5 rounded-full bg-black/60 backdrop-blur-md border border-white/10 text-white/90 text-xs font-medium">
          <Lock className="w-3.5 h-3.5 text-amber-400" />
          <span>Play Time Locked</span>
          <span className="text-white/40">·</span>
          <span>Vol: {settings.lockedVolume}%</span>
        </div>

        {sessionRemainingSeconds !== undefined && sessionRemainingSeconds > 0 && (
          <div className="flex items-center gap-1.5 px-3 py-1.5 rounded-full bg-black/60 backdrop-blur-md border border-white/10 text-white/90 text-xs font-medium">
            <Clock className="w-3.5 h-3.5 text-sky-400" />
            <span>{formatTimer(sessionRemainingSeconds)} left</span>
          </div>
        )}
      </div>

      {/* Volume Tamper Toast */}
      {volumeToastMessage && (
        <div className="absolute top-16 left-1/2 -translate-x-1/2 z-40 px-4 py-2 rounded-2xl bg-slate-900/90 text-white border border-amber-500/40 shadow-2xl backdrop-blur-md flex items-center gap-2.5 animate-in fade-in slide-in-from-top-4 duration-200">
          <VolumeX className="w-4 h-4 text-amber-400 shrink-0" />
          <span className="text-xs font-medium">{volumeToastMessage}</span>
        </div>
      )}

      {/* Edge Tamper / Notification Bar Pull Blocked Toast */}
      {edgeToastMessage && (
        <div className="absolute top-16 left-1/2 -translate-x-1/2 z-40 px-4 py-2 rounded-2xl bg-rose-950/90 text-rose-100 border border-rose-500/40 shadow-2xl backdrop-blur-md flex items-center gap-2.5 animate-in fade-in slide-in-from-top-4 duration-200">
          <ShieldAlert className="w-4 h-4 text-rose-400 shrink-0" />
          <span className="text-xs font-medium">{edgeToastMessage}</span>
        </div>
      )}

      {/* Secret Corner Tap Area (if method is 'corners') */}
      {settings.unlockMethod === 'corners' && (
        <div
          className="absolute top-0 right-0 w-24 h-24 z-40 flex items-start justify-end p-3 pointer-events-auto cursor-pointer"
          onPointerDown={handleCornerTap}
        >
          {cornerTapCount > 0 && (
            <div className="w-7 h-7 rounded-full bg-amber-500/90 text-slate-950 font-bold text-xs flex items-center justify-center shadow-lg animate-pulse">
              {4 - cornerTapCount}
            </div>
          )}
        </div>
      )}

      {/* Parent Unlock Button (Floating at bottom-right or top-right) */}
      <div
        className={`absolute bottom-6 right-6 z-40 transition-all duration-300 pointer-events-auto ${
          showUnlockAffordance || isHolding
            ? 'opacity-90 scale-100'
            : 'opacity-25 hover:opacity-80 scale-95'
        }`}
      >
        {settings.unlockMethod === 'hold' ? (
          <div
            className="relative flex items-center justify-center cursor-pointer select-none"
            onPointerDown={startHold}
            onPointerUp={stopHold}
            onPointerCancel={stopHold}
            onPointerLeave={stopHold}
          >
            {/* Circular Hold Progress Ring */}
            <svg className="w-16 h-16 -rotate-90" viewBox="0 0 64 64">
              <circle
                cx="32"
                cy="32"
                r="28"
                className="stroke-slate-800/80 fill-slate-950/80"
                strokeWidth="4"
              />
              <circle
                cx="32"
                cy="32"
                r="28"
                className="stroke-amber-400 fill-transparent transition-all duration-75"
                strokeWidth="4"
                strokeDasharray={175.9}
                strokeDashoffset={175.9 - (175.9 * holdProgress) / 100}
                strokeLinecap="round"
              />
            </svg>
            <div className="absolute flex flex-col items-center justify-center">
              <Lock className={`w-5 h-5 ${isHolding ? 'text-amber-400' : 'text-slate-300'}`} />
              <span className="text-[9px] font-semibold tracking-tighter text-slate-200 mt-0.5">
                {isHolding ? `${Math.round(holdProgress)}%` : 'HOLD'}
              </span>
            </div>
          </div>
        ) : (
          <button
            type="button"
            onClick={(e) => {
              e.preventDefault();
              e.stopPropagation();
              onRequestUnlock();
            }}
            onPointerDown={(e) => {
              e.stopPropagation();
            }}
            className="flex items-center gap-2 px-3.5 py-2.5 rounded-2xl bg-slate-900/90 text-white border border-white/20 shadow-xl backdrop-blur-md hover:bg-slate-800 transition-all active:scale-95 cursor-pointer"
          >
            <Lock className="w-4 h-4 text-amber-400" />
            <span className="text-xs font-semibold">Unlock</span>
          </button>
        )}
      </div>

      {/* Discreet bottom guide hint for parent */}
      <div className="absolute bottom-2 left-1/2 -translate-x-1/2 pointer-events-none text-center">
        <p className="text-[10px] text-white/30 font-medium">
          Screen locked · Tap lock icon to exit Play Time
        </p>
      </div>
    </div>
  );
};
