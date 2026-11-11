import { useEffect, useRef, useState, useCallback } from 'react';
import { ChildLockSettings } from '../types';

interface UseChildLockProps {
  isLocked: boolean;
  settings: ChildLockSettings;
  onVolumeAttempt?: (attemptType: 'up' | 'down') => void;
  onEdgePullAttempt?: (edge: 'top' | 'bottom') => void;
}

export function useChildLock({
  isLocked,
  settings,
  onVolumeAttempt,
  onEdgePullAttempt,
}: UseChildLockProps) {
  const [isFullscreen, setIsFullscreen] = useState<boolean>(false);
  const wakeLockRef = useRef<any>(null);

  // Request & manage screen Wake Lock so display never sleeps
  const requestWakeLock = useCallback(async () => {
    try {
      if ('wakeLock' in navigator) {
        wakeLockRef.current = await (navigator as any).wakeLock.request('screen');
      }
    } catch (err) {
      // Wake lock can fail if low battery or tab in background
      console.warn('Wake Lock request skipped or unavailable:', err);
    }
  }, []);

  const releaseWakeLock = useCallback(async () => {
    if (wakeLockRef.current) {
      try {
        await wakeLockRef.current.release();
        wakeLockRef.current = null;
      } catch (err) {
        console.warn('Error releasing wake lock:', err);
      }
    }
  }, []);

  // Request Fullscreen on lock
  const enterFullscreen = useCallback(async () => {
    try {
      const docEl = document.documentElement as any;
      if (!document.fullscreenElement && !docEl.webkitFullscreenElement) {
        if (docEl.requestFullscreen) {
          await docEl.requestFullscreen();
        } else if (docEl.webkitRequestFullscreen) {
          await docEl.webkitRequestFullscreen();
        }
      }
      setIsFullscreen(true);

      // Attempt screen orientation lock to landscape if available
      try {
        if (screen.orientation && (screen.orientation as any).lock) {
          await (screen.orientation as any).lock('landscape').catch(() => {
            // Orientation lock may require user gesture or installed PWA
          });
        }
      } catch {
        // Safe ignore
      }

      // Attempt Keyboard Lock for Android navigation & hardware keys
      try {
        if ((navigator as any).keyboard && (navigator as any).keyboard.lock) {
          await (navigator as any).keyboard.lock([
            'VolumeUp',
            'VolumeDown',
            'AudioVolumeUp',
            'AudioVolumeDown',
            'Escape',
            'ContextMenu',
          ]);
        }
      } catch {
        // Keyboard lock not supported in all contexts
      }
    } catch (err) {
      console.warn('Fullscreen request rejected:', err);
    }
  }, []);

  const exitFullscreen = useCallback(async () => {
    try {
      const doc = document as any;
      if (document.fullscreenElement || doc.webkitFullscreenElement) {
        if (document.exitFullscreen) {
          await document.exitFullscreen();
        } else if (doc.webkitExitFullscreen) {
          await doc.webkitExitFullscreen();
        }
      }
      setIsFullscreen(false);

      // Release keyboard lock if present
      try {
        if ((navigator as any).keyboard && (navigator as any).keyboard.unlock) {
          (navigator as any).keyboard.unlock();
        }
      } catch {
        // Safe ignore
      }
    } catch (err) {
      console.warn('Error exiting fullscreen:', err);
    }
  }, []);

  // Monitor fullscreen state changes
  useEffect(() => {
    const handleFullscreenChange = () => {
      const isFull = !!(document.fullscreenElement || (document as any).webkitFullscreenElement);
      setIsFullscreen(isFull);
    };

    document.addEventListener('fullscreenchange', handleFullscreenChange);
    document.addEventListener('webkitfullscreenchange', handleFullscreenChange);

    return () => {
      document.removeEventListener('fullscreenchange', handleFullscreenChange);
      document.removeEventListener('webkitfullscreenchange', handleFullscreenChange);
    };
  }, []);

  // Active lock effects
  useEffect(() => {
    if (isLocked) {
      requestWakeLock();
      enterFullscreen();

      // Intercept Hardware Volume Keys and navigation keys
      const handleKeyDown = (e: KeyboardEvent) => {
        const volumeKeys = ['VolumeUp', 'VolumeDown', 'AudioVolumeUp', 'AudioVolumeDown'];
        const navKeys = ['Escape', 'BrowserBack', 'Backspace', 'F11'];

        if (settings.blockVolumeKeys && volumeKeys.includes(e.code || e.key)) {
          e.preventDefault();
          e.stopPropagation();
          e.stopImmediatePropagation();
          const isUp = (e.code || e.key).toLowerCase().includes('up');
          onVolumeAttempt?.(isUp ? 'up' : 'down');
          return false;
        }

        if (navKeys.includes(e.code || e.key)) {
          e.preventDefault();
          e.stopPropagation();
          return false;
        }
      };

      // Intercept context menu (right click / long tap)
      const handleContextMenu = (e: MouseEvent) => {
        e.preventDefault();
        return false;
      };

      window.addEventListener('keydown', handleKeyDown, { capture: true });
      window.addEventListener('keyup', handleKeyDown, { capture: true });
      window.addEventListener('contextmenu', handleContextMenu, { capture: true });

      return () => {
        window.removeEventListener('keydown', handleKeyDown, { capture: true });
        window.removeEventListener('keyup', handleKeyDown, { capture: true });
        window.removeEventListener('contextmenu', handleContextMenu, { capture: true });
        releaseWakeLock();
      };
    } else {
      releaseWakeLock();
    }
  }, [isLocked, settings.blockVolumeKeys, requestWakeLock, releaseWakeLock, enterFullscreen, onVolumeAttempt]);

  return {
    isFullscreen,
    enterFullscreen,
    exitFullscreen,
  };
}
