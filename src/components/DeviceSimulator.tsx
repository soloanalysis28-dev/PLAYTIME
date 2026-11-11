import React, { useState } from 'react';
import {
  Smartphone,
  Tablet,
  Volume2,
  VolumeX,
  Wifi,
  Battery,
  Shield,
  ChevronDown,
  Info,
} from 'lucide-react';

interface DeviceSimulatorProps {
  deviceType: 'phone' | 'tablet';
  onDeviceTypeChange: (type: 'phone' | 'tablet') => void;
  isLocked: boolean;
  onSimulateVolume: (type: 'up' | 'down') => void;
  onSimulateDropDownAttempt: () => void;
  children: React.ReactNode;
}

export const DeviceSimulator: React.FC<DeviceSimulatorProps> = ({
  deviceType,
  onDeviceTypeChange,
  isLocked,
  onSimulateVolume,
  onSimulateDropDownAttempt,
  children,
}) => {
  const [showStatusPullIndicator, setShowStatusPullIndicator] = useState(false);

  const handlePullDownClick = () => {
    setShowStatusPullIndicator(true);
    onSimulateDropDownAttempt();
    setTimeout(() => {
      setShowStatusPullIndicator(false);
    }, 1200);
  };

  return (
    <div className="flex flex-col items-center w-full">
      {/* Device Toolbar: Switch Phone / Tablet & Simulated Hardware Controls */}
      <div className="w-full max-w-4xl flex flex-wrap items-center justify-between gap-3 p-3 mb-4 rounded-2xl bg-slate-900 border border-slate-800 text-xs">
        <div className="flex items-center gap-2">
          <span className="text-slate-400 font-semibold">Simulate Device:</span>
          <div className="flex gap-1 p-1 rounded-xl bg-slate-800 border border-slate-700/60">
            <button
              onClick={() => onDeviceTypeChange('phone')}
              className={`flex items-center gap-1.5 px-3 py-1 rounded-lg font-medium transition-colors cursor-pointer ${
                deviceType === 'phone'
                  ? 'bg-amber-400 text-slate-950 font-bold'
                  : 'text-slate-300 hover:text-white'
              }`}
            >
              <Smartphone className="w-3.5 h-3.5" />
              <span>Android Phone</span>
            </button>
            <button
              onClick={() => onDeviceTypeChange('tablet')}
              className={`flex items-center gap-1.5 px-3 py-1 rounded-lg font-medium transition-colors cursor-pointer ${
                deviceType === 'tablet'
                  ? 'bg-amber-400 text-slate-950 font-bold'
                  : 'text-slate-300 hover:text-white'
              }`}
            >
              <Tablet className="w-3.5 h-3.5" />
              <span>Android Tablet</span>
            </button>
          </div>
        </div>

        {/* Hardware Button Test Controls */}
        <div className="flex items-center gap-2">
          <span className="text-slate-400">Test Hardware Tampering:</span>
          <button
            onClick={() => onSimulateVolume('up')}
            className="px-2.5 py-1 rounded-lg bg-slate-800 hover:bg-slate-700 text-slate-200 border border-slate-700/60 font-mono text-[11px] active:scale-95 transition-all cursor-pointer"
            title="Simulate child pressing hardware Volume Up"
          >
            Vol +
          </button>
          <button
            onClick={() => onSimulateVolume('down')}
            className="px-2.5 py-1 rounded-lg bg-slate-800 hover:bg-slate-700 text-slate-200 border border-slate-700/60 font-mono text-[11px] active:scale-95 transition-all cursor-pointer"
            title="Simulate child pressing hardware Volume Down"
          >
            Vol -
          </button>
          <button
            onClick={handlePullDownClick}
            className="px-2.5 py-1 rounded-lg bg-slate-800 hover:bg-slate-700 text-amber-300 border border-slate-700/60 text-[11px] font-medium active:scale-95 transition-all cursor-pointer flex items-center gap-1"
            title="Simulate child trying to pull down the Android top status bar"
          >
            <ChevronDown className="w-3 h-3" />
            <span>Pull Dropdown</span>
          </button>
        </div>
      </div>

      {/* Frame Wrapper with hardware volume buttons on side */}
      <div className="relative flex items-center justify-center w-full">
        {/* Hardware Volume Rocker on Left Frame */}
        <div className="hidden sm:flex flex-col gap-2 absolute -left-3.5 top-28 z-20">
          <button
            onClick={() => onSimulateVolume('up')}
            className="w-2.5 h-12 rounded-l-md bg-slate-700 hover:bg-amber-400 transition-colors shadow-md cursor-pointer"
            title="Hardware Volume Up button"
            aria-label="Physical Volume Up"
          />
          <button
            onClick={() => onSimulateVolume('down')}
            className="w-2.5 h-12 rounded-l-md bg-slate-700 hover:bg-amber-400 transition-colors shadow-md cursor-pointer"
            title="Hardware Volume Down button"
            aria-label="Physical Volume Down"
          />
        </div>

        {/* Physical Power / Lock button on Right Frame */}
        <div className="hidden sm:flex flex-col gap-2 absolute -right-3.5 top-32 z-20">
          <div
            className="w-2.5 h-10 rounded-r-md bg-slate-700 shadow-md"
            title="Power / Lock Key"
          />
        </div>

        {/* The Device Bezel Container */}
        <div
          className={`relative transition-all duration-300 bg-slate-950 shadow-2xl overflow-hidden border-8 border-slate-800 rounded-[2.5rem] flex flex-col ${
            deviceType === 'tablet'
              ? 'w-full max-w-4xl aspect-[16/10] min-h-[460px]'
              : 'w-full max-w-[420px] aspect-[9/18.5] min-h-[580px]'
          }`}
        >
          {/* Simulated Android Status Bar */}
          <div
            onClick={handlePullDownClick}
            className="h-7 w-full px-5 flex items-center justify-between text-[11px] text-slate-300 bg-black/90 select-none z-30 cursor-pointer hover:bg-black/80 border-b border-white/5"
            title="Click to test child pulling down Android notification bar"
          >
            <div className="flex items-center gap-2">
              <span className="font-mono font-medium">9:41</span>
              {isLocked && (
                <span className="flex items-center gap-1 text-[10px] text-amber-400 font-semibold">
                  <Shield className="w-2.5 h-2.5" />
                  <span>Pinned</span>
                </span>
              )}
            </div>

            {/* Front Camera Notch / Camera Hole */}
            <div className="w-3.5 h-3.5 rounded-full bg-slate-900 border border-slate-700 flex items-center justify-center">
              <div className="w-1.5 h-1.5 rounded-full bg-slate-950" />
            </div>

            <div className="flex items-center gap-1.5">
              <Wifi className="w-3 h-3 text-slate-400" />
              <Battery className="w-3.5 h-3.5 text-slate-300" />
            </div>
          </div>

          {/* Warning Indicator if pull down simulated */}
          {showStatusPullIndicator && (
            <div className="absolute top-8 left-1/2 -translate-x-1/2 z-40 px-3.5 py-1.5 rounded-full bg-rose-900/90 text-rose-100 text-[11px] font-semibold border border-rose-500/50 shadow-xl backdrop-blur-md animate-in fade-in zoom-in">
              Top Pull Blocked: Notification Dropdown Disabled
            </div>
          )}

          {/* Inner Screen Content: The Video Player and Overlays */}
          <div className="relative flex-1 w-full h-full overflow-hidden bg-black flex items-center justify-center">
            {children}
          </div>

          {/* Simulated Android Bottom Navigation Bar */}
          <div className="h-6 w-full flex items-center justify-center bg-black/95 select-none z-30">
            <div className="w-28 h-1 rounded-full bg-slate-700" />
          </div>
        </div>
      </div>
    </div>
  );
};
