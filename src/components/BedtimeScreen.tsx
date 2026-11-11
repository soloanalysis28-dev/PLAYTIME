import React from 'react';
import { Moon, Star, Lock, Sparkles, Clock } from 'lucide-react';

interface BedtimeScreenProps {
  onParentUnlock: () => void;
  onExtendTenMinutes: () => void;
}

export const BedtimeScreen: React.FC<BedtimeScreenProps> = ({
  onParentUnlock,
  onExtendTenMinutes,
}) => {
  return (
    <div
      className="fixed inset-0 z-50 flex flex-col items-center justify-center p-6 bg-slate-950 text-slate-100 select-none animate-in fade-in zoom-in duration-300"
      onPointerDown={(e) => e.stopPropagation()}
    >
      {/* Decorative Moon and gentle stars */}
      <div className="relative mb-6">
        <div className="w-24 h-24 rounded-full bg-gradient-to-tr from-amber-200 to-amber-400 text-slate-900 flex items-center justify-center shadow-2xl shadow-amber-300/30 animate-pulse-subtle">
          <Moon className="w-12 h-12 text-slate-900 fill-slate-900" />
        </div>
        <div className="absolute -top-2 -right-2 text-2xl animate-bounce">⭐</div>
        <div className="absolute -bottom-1 -left-3 text-xl animate-pulse">✨</div>
      </div>

      <h2 className="text-2xl md:text-3xl font-bold font-display text-white text-center">
        Play Time is Over!
      </h2>
      <p className="text-sm md:text-base text-slate-400 text-center max-w-sm mt-2 mb-8 leading-relaxed">
        Time to rest little eyes, stretch, or get ready for sleep. Great watching today!
      </p>

      {/* Parental Actions */}
      <div className="flex flex-col sm:flex-row items-center gap-3 w-full max-w-xs">
        <button
          onClick={onParentUnlock}
          className="w-full py-3.5 px-4 rounded-2xl bg-amber-400 hover:bg-amber-300 text-slate-950 font-bold text-xs flex items-center justify-center gap-2 shadow-xl shadow-amber-400/20 active:scale-95 transition-all cursor-pointer"
        >
          <Lock className="w-4 h-4" />
          <span>Parent Unlock (Exit)</span>
        </button>

        <button
          onClick={onExtendTenMinutes}
          className="w-full py-3 px-4 rounded-2xl bg-slate-800 hover:bg-slate-700 text-slate-300 hover:text-white font-medium text-xs flex items-center justify-center gap-2 border border-slate-700 active:scale-95 transition-all cursor-pointer"
        >
          <Clock className="w-4 h-4 text-sky-400" />
          <span>Add 10 More Mins</span>
        </button>
      </div>

      <span className="text-[10px] text-slate-600 font-medium mt-6">
        Play Time Child Safety Engine · Screen Locked
      </span>
    </div>
  );
};
