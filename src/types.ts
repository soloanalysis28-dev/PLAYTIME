export interface CartoonVideo {
  id: string;
  title: string;
  category: 'Cartoons' | 'Animals & Nature' | 'Nursery Rhymes' | 'Adventures' | 'Custom';
  description: string;
  duration: string;
  thumbnail: string;
  videoUrl: string;
  ageRating: string;
  isCustom?: boolean;
}

export type UnlockMethod = 'pin' | 'hold' | 'math' | 'corners';

export type TouchEffectType = 'stars' | 'bubbles' | 'hearts' | 'none';

export interface ChildLockSettings {
  pin: string; // 4-digit PIN, default '1234'
  unlockMethod: UnlockMethod;
  lockedVolume: number; // 0 - 100 percentage
  maxVolumeCap: number; // e.g. 70% to protect child ears
  blockTopPullDown: boolean;
  blockBottomNav: boolean;
  blockVolumeKeys: boolean;
  touchEffect: TouchEffectType;
  enableEyeComfort: boolean; // blue light filter
  autoLockDelaySeconds: number; // 0 = manual, 5, 10, etc.
  allowLooping: boolean;
  allowAutoNext: boolean;
}

export interface SessionTimerState {
  enabled: boolean;
  totalMinutes: number;
  remainingSeconds: number;
  isExpired: boolean;
}

export interface TouchSparkle {
  id: number;
  x: number;
  y: number;
  type: TouchEffectType;
  color: string;
  size: number;
}
