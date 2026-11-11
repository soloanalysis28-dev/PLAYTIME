import React, { useState } from 'react';
import {
  X,
  Shield,
  Volume2,
  Lock,
  Sparkles,
  Clock,
  Eye,
  Sliders,
  Check,
  Smartphone,
} from 'lucide-react';
import { ChildLockSettings, UnlockMethod, TouchEffectType } from '../types';

interface ParentSettingsModalProps {
  isOpen: boolean;
  settings: ChildLockSettings;
  sessionMinutes: number;
  onSaveSettings: (newSettings: ChildLockSettings, newSessionMinutes: number) => void;
  onClose: () => void;
}

export const ParentSettingsModal: React.FC<ParentSettingsModalProps> = ({
  isOpen,
  settings,
  sessionMinutes,
  onSaveSettings,
  onClose,
}) => {
  const [localSettings, setLocalSettings] = useState<ChildLockSettings>({ ...settings });
  const [localSessionMins, setLocalSessionMins] = useState<number>(sessionMinutes);
  const [pinChangeInput, setPinChangeInput] = useState<string>(settings.pin);
  const [showSavedToast, setShowSavedToast] = useState<boolean>(false);

  if (!isOpen) return null;

  const handleSave = () => {
    const updated = {
      ...localSettings,
      pin: pinChangeInput.length === 4 ? pinChangeInput : localSettings.pin,
    };
    onSaveSettings(updated, localSessionMins);
    setShowSavedToast(true);
    setTimeout(() => {
      setShowSavedToast(false);
      onClose();
    }, 400);
  };

  const timerOptions = [
    { label: 'Off (Unlimited)', value: 0 },
    { label: '10 Mins', value: 10 },
    { label: '20 Mins', value: 20 },
    { label: '30 Mins', value: 30 },
    { label: '45 Mins', value: 45 },
    { label: '60 Mins', value: 60 },
  ];

  return (
    <div
      className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/85 backdrop-blur-md animate-in fade-in"
      onPointerDown={(e) => e.stopPropagation()}
    >
      <div className="w-full max-w-lg rounded-3xl bg-slate-900 border border-slate-800 p-6 text-slate-100 shadow-2xl relative max-h-[90vh] overflow-y-auto scrollbar-none">
        {/* Header */}
        <div className="flex items-center justify-between pb-4 border-b border-slate-800 mb-6">
          <div className="flex items-center gap-2.5">
            <div className="w-8 h-8 rounded-xl bg-amber-400/20 text-amber-400 flex items-center justify-center">
              <Shield className="w-4 h-4" />
            </div>
            <div>
              <h3 className="text-lg font-bold font-display text-white">Parent Lock Controls</h3>
              <p className="text-xs text-slate-400">Configure child restrictions and safety limits</p>
            </div>
          </div>
          <button
            onClick={onClose}
            className="p-2 text-slate-400 hover:text-white rounded-full hover:bg-slate-800 transition-colors"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        <div className="space-y-6">
          {/* Section 1: Secret Unlock Mode */}
          <div>
            <label className="block text-xs font-bold text-slate-300 uppercase tracking-wider mb-2.5">
              Parent Unlock Verification Method
            </label>
            <div className="grid grid-cols-2 gap-2.5">
              {[
                { id: 'pin', title: '4-Digit PIN', desc: 'Secure numeric passcode' },
                { id: 'hold', title: '3-Sec Hold', desc: 'Continuous touch ring' },
                { id: 'math', title: 'Math Puzzle', desc: 'Simple parent check' },
                { id: 'corners', title: '4 Corner Taps', desc: 'Secret stealth tap' },
              ].map((opt) => {
                const isSelected = localSettings.unlockMethod === opt.id;
                return (
                  <button
                    key={opt.id}
                    type="button"
                    onClick={() =>
                      setLocalSettings({ ...localSettings, unlockMethod: opt.id as UnlockMethod })
                    }
                    className={`p-3 rounded-2xl border text-left transition-all cursor-pointer ${
                      isSelected
                        ? 'border-amber-400 bg-amber-400/10 text-white shadow-sm'
                        : 'border-slate-800 bg-slate-850 text-slate-300 hover:border-slate-700'
                    }`}
                  >
                    <div className="flex items-center justify-between mb-1">
                      <span className="text-xs font-bold">{opt.title}</span>
                      {isSelected && <Check className="w-3.5 h-3.5 text-amber-400" />}
                    </div>
                    <span className="text-[11px] text-slate-400 leading-tight block">
                      {opt.desc}
                    </span>
                  </button>
                );
              })}
            </div>

            {/* If PIN mode selected, allow setting custom PIN */}
            {localSettings.unlockMethod === 'pin' && (
              <div className="mt-3 p-3 rounded-xl bg-slate-800/60 border border-slate-700/60 flex items-center justify-between">
                <div>
                  <span className="text-xs font-semibold text-slate-200">Set Parent PIN:</span>
                  <p className="text-[11px] text-slate-400">Default is 1234</p>
                </div>
                <input
                  type="password"
                  maxLength={4}
                  value={pinChangeInput}
                  onChange={(e) => setPinChangeInput(e.target.value.replace(/\D/g, ''))}
                  className="w-20 px-3 py-1.5 rounded-lg bg-slate-900 border border-slate-700 font-mono text-center text-sm font-bold tracking-widest text-amber-400 focus:outline-none focus:border-amber-400"
                />
              </div>
            )}
          </div>

          {/* Section 2: Audio & Volume Lockdown */}
          <div>
            <label className="block text-xs font-bold text-slate-300 uppercase tracking-wider mb-2.5">
              Audio & Hardware Volume Lockdown
            </label>
            <div className="p-4 rounded-2xl bg-slate-850 border border-slate-800 space-y-4">
              {/* Locked Volume Slider */}
              <div>
                <div className="flex justify-between items-center text-xs mb-1.5">
                  <span className="text-slate-300 font-medium">Locked Playback Volume:</span>
                  <span className="font-mono font-bold text-amber-400">{localSettings.lockedVolume}%</span>
                </div>
                <input
                  type="range"
                  min="5"
                  max="100"
                  value={localSettings.lockedVolume}
                  onChange={(e) =>
                    setLocalSettings({ ...localSettings, lockedVolume: parseInt(e.target.value, 10) })
                  }
                  className="w-full h-1.5 bg-slate-700 rounded-lg appearance-none cursor-pointer accent-amber-400"
                />
              </div>

              {/* Volume Cap for Ear Protection */}
              <div className="pt-2 border-t border-slate-800 flex items-center justify-between">
                <div>
                  <span className="text-xs font-medium text-slate-200">Ear Safety Cap:</span>
                  <p className="text-[11px] text-slate-400">Limit max sound to prevent hearing damage</p>
                </div>
                <span className="text-xs font-mono font-semibold text-slate-300 px-2 py-1 rounded bg-slate-800">
                  {localSettings.maxVolumeCap}% Max
                </span>
              </div>

              {/* Hardware Volume Keys Blocker Toggle */}
              <div className="flex items-center justify-between pt-2 border-t border-slate-800">
                <div>
                  <span className="text-xs font-medium text-slate-200">Block Hardware Volume Buttons</span>
                  <p className="text-[11px] text-slate-400">Neutralize physical Vol + / Vol - button clicks</p>
                </div>
                <input
                  type="checkbox"
                  checked={localSettings.blockVolumeKeys}
                  onChange={(e) =>
                    setLocalSettings({ ...localSettings, blockVolumeKeys: e.target.checked })
                  }
                  className="w-4 h-4 rounded text-amber-400 accent-amber-400 cursor-pointer"
                />
              </div>
            </div>
          </div>

          {/* Section 3: Android Menu & Gesture Shields */}
          <div>
            <label className="block text-xs font-bold text-slate-300 uppercase tracking-wider mb-2.5">
              Android Drop-Down & Gesture Guards
            </label>
            <div className="p-4 rounded-2xl bg-slate-850 border border-slate-800 space-y-3">
              <div className="flex items-center justify-between">
                <div>
                  <span className="text-xs font-medium text-slate-200">Block Top Swipe (Notification Menu)</span>
                  <p className="text-[11px] text-slate-400">Prevents pulling down Android quick settings</p>
                </div>
                <input
                  type="checkbox"
                  checked={localSettings.blockTopPullDown}
                  onChange={(e) =>
                    setLocalSettings({ ...localSettings, blockTopPullDown: e.target.checked })
                  }
                  className="w-4 h-4 rounded text-amber-400 accent-amber-400 cursor-pointer"
                />
              </div>

              <div className="flex items-center justify-between pt-2 border-t border-slate-800">
                <div>
                  <span className="text-xs font-medium text-slate-200">Block Bottom Navigation Bar</span>
                  <p className="text-[11px] text-slate-400">Stops child from swiping home or app switcher</p>
                </div>
                <input
                  type="checkbox"
                  checked={localSettings.blockBottomNav}
                  onChange={(e) =>
                    setLocalSettings({ ...localSettings, blockBottomNav: e.target.checked })
                  }
                  className="w-4 h-4 rounded text-amber-400 accent-amber-400 cursor-pointer"
                />
              </div>
            </div>
          </div>

          {/* Section 4: Toddler Touch Effect */}
          <div>
            <label className="block text-xs font-bold text-slate-300 uppercase tracking-wider mb-2.5">
              Toddler Sensory Touch Sparkles
            </label>
            <div className="grid grid-cols-4 gap-2">
              {[
                { id: 'stars', label: 'Stars ✨' },
                { id: 'bubbles', label: 'Bubbles 🫧' },
                { id: 'hearts', label: 'Hearts 💖' },
                { id: 'none', label: 'Invisible' },
              ].map((eff) => (
                <button
                  key={eff.id}
                  type="button"
                  onClick={() =>
                    setLocalSettings({ ...localSettings, touchEffect: eff.id as TouchEffectType })
                  }
                  className={`py-2 px-1 text-center rounded-xl text-xs font-medium border transition-colors cursor-pointer ${
                    localSettings.touchEffect === eff.id
                      ? 'border-amber-400 bg-amber-400/20 text-white font-bold'
                      : 'border-slate-800 bg-slate-850 text-slate-400 hover:text-white'
                  }`}
                >
                  {eff.label}
                </button>
              ))}
            </div>
          </div>

          {/* Section 5: Session Sleep Timer */}
          <div>
            <label className="block text-xs font-bold text-slate-300 uppercase tracking-wider mb-2.5">
              Screen Time Session Limit
            </label>
            <div className="grid grid-cols-3 gap-2">
              {timerOptions.map((opt) => (
                <button
                  key={opt.value}
                  type="button"
                  onClick={() => setLocalSessionMins(opt.value)}
                  className={`py-2 px-2 text-center rounded-xl text-xs font-medium border transition-colors cursor-pointer ${
                    localSessionMins === opt.value
                      ? 'border-sky-400 bg-sky-400/20 text-sky-200 font-bold'
                      : 'border-slate-800 bg-slate-850 text-slate-400 hover:text-white'
                  }`}
                >
                  {opt.label}
                </button>
              ))}
            </div>
          </div>

          {/* Section 6: Eye Comfort Night Filter */}
          <div className="p-3.5 rounded-2xl bg-slate-850 border border-slate-800 flex items-center justify-between">
            <div className="flex items-center gap-3">
              <Eye className="w-5 h-5 text-amber-400" />
              <div>
                <span className="text-xs font-medium text-slate-200">Warm Amber Eye Comfort Filter</span>
                <p className="text-[11px] text-slate-400">Soft warm tint to reduce blue light for bedtime</p>
              </div>
            </div>
            <input
              type="checkbox"
              checked={localSettings.enableEyeComfort}
              onChange={(e) =>
                setLocalSettings({ ...localSettings, enableEyeComfort: e.target.checked })
              }
              className="w-4 h-4 rounded text-amber-400 accent-amber-400 cursor-pointer"
            />
          </div>
        </div>

        {/* Footer actions */}
        <div className="mt-8 pt-4 border-t border-slate-800 flex items-center justify-end gap-3">
          <button
            onClick={onClose}
            className="px-4 py-2.5 rounded-xl text-xs font-semibold text-slate-400 hover:text-white"
          >
            Cancel
          </button>
          <button
            onClick={handleSave}
            className="px-6 py-2.5 rounded-xl bg-amber-400 hover:bg-amber-300 text-slate-950 font-bold text-xs transition-colors cursor-pointer shadow-lg shadow-amber-400/20"
          >
            Save Lock Settings
          </button>
        </div>
      </div>
    </div>
  );
};
