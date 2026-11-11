import React, { useState } from 'react';
import {
  Smartphone,
  Shield,
  Volume2,
  Lock,
  CheckCircle,
  HelpCircle,
  ArrowRight,
  Sliders,
  ChevronDown,
  ChevronUp,
} from 'lucide-react';

export const AndroidSetupGuide: React.FC = () => {
  const [selectedBrand, setSelectedBrand] = useState<'pixel' | 'samsung' | 'xiaomi' | 'general'>('general');
  const [expandedFaq, setExpandedFaq] = useState<number | null>(null);

  const toggleFaq = (index: number) => {
    setExpandedFaq(expandedFaq === index ? null : index);
  };

  return (
    <div className="rounded-3xl bg-slate-900 border border-slate-800 p-6 md:p-8 space-y-8">
      {/* Header */}
      <div>
        <div className="flex items-center gap-2.5 mb-2">
          <div className="w-8 h-8 rounded-xl bg-amber-400/20 text-amber-400 flex items-center justify-center">
            <Shield className="w-4 h-4" />
          </div>
          <h3 className="text-xl font-bold font-display text-white">
            Android Child-Proofing & Lockdown Guide
          </h3>
        </div>
        <p className="text-xs md:text-sm text-slate-400 max-w-2xl leading-relaxed">
          Play Time provides multi-layer protection: in-app touch interception plus Android system-level features to completely disable the drop-down notification menu and hardware volume keys.
        </p>
      </div>

      {/* 3 Pillars of Protection Grid */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
        <div className="p-4 rounded-2xl bg-slate-850 border border-slate-800/80 space-y-2">
          <div className="w-7 h-7 rounded-lg bg-emerald-500/20 text-emerald-400 flex items-center justify-center font-bold text-xs">
            1
          </div>
          <h4 className="text-sm font-bold text-white">Full Touch Blocker</h4>
          <p className="text-xs text-slate-400 leading-relaxed">
            When locked, Play Time creates an invisible shield that blocks 100% of taps, swipes, and pinches. Baby taps only pop harmless stars without pausing or quitting.
          </p>
        </div>

        <div className="p-4 rounded-2xl bg-slate-850 border border-slate-800/80 space-y-2">
          <div className="w-7 h-7 rounded-lg bg-sky-500/20 text-sky-400 flex items-center justify-center font-bold text-xs">
            2
          </div>
          <h4 className="text-sm font-bold text-white">Drop-Down Menu Guard</h4>
          <p className="text-xs text-slate-400 leading-relaxed">
            Top and bottom swipe interceptors catch pull-down gestures before the Android notification shade can appear. Combined with App Pinning, status bar access is fully prohibited.
          </p>
        </div>

        <div className="p-4 rounded-2xl bg-slate-850 border border-slate-800/80 space-y-2">
          <div className="w-7 h-7 rounded-lg bg-amber-500/20 text-amber-400 flex items-center justify-center font-bold text-xs">
            3
          </div>
          <h4 className="text-sm font-bold text-white">Volume Key Lock</h4>
          <p className="text-xs text-slate-400 leading-relaxed">
            Locks the media volume to parent's preferred percentage and caps max decibels so young ears are never hurt by accidental button clicks.
          </p>
        </div>
      </div>

      {/* Step-by-Step Android "App Pinning" Walkthrough */}
      <div className="space-y-4">
        <div className="flex items-center justify-between">
          <h4 className="text-sm font-bold text-white flex items-center gap-2">
            <Smartphone className="w-4 h-4 text-amber-400" />
            <span>Enable Android App Pinning (Screen Pinning)</span>
          </h4>

          {/* Brand Selector */}
          <div className="flex gap-1.5 p-1 rounded-xl bg-slate-800 border border-slate-700/60">
            {(['general', 'samsung', 'pixel', 'xiaomi'] as const).map((brand) => (
              <button
                key={brand}
                onClick={() => setSelectedBrand(brand)}
                className={`px-2.5 py-1 text-[11px] font-medium rounded-lg capitalize transition-colors cursor-pointer ${
                  selectedBrand === brand
                    ? 'bg-amber-400 text-slate-950 font-bold'
                    : 'text-slate-400 hover:text-white'
                }`}
              >
                {brand === 'general' ? 'All Android' : brand}
              </button>
            ))}
          </div>
        </div>

        {/* Brand Specific Instructions */}
        <div className="p-5 rounded-2xl bg-slate-950/60 border border-slate-800/80 space-y-4 text-xs md:text-sm text-slate-300">
          {selectedBrand === 'general' && (
            <div className="space-y-3">
              <div className="flex items-start gap-3">
                <span className="w-5 h-5 rounded-full bg-slate-800 text-amber-400 flex items-center justify-center font-mono text-xs shrink-0 mt-0.5">
                  1
                </span>
                <p>
                  Open Android <strong>Settings</strong> &gt; <strong>Security & Privacy</strong> (or Passwords & Security) &gt; <strong>More Security Settings</strong>.
                </p>
              </div>
              <div className="flex items-start gap-3">
                <span className="w-5 h-5 rounded-full bg-slate-800 text-amber-400 flex items-center justify-center font-mono text-xs shrink-0 mt-0.5">
                  2
                </span>
                <p>
                  Find <strong>App Pinning</strong> (or <strong>Screen Pinning</strong>) and switch it to <strong>ON</strong>. Ensure "Ask for PIN before unpinning" is checked.
                </p>
              </div>
              <div className="flex items-start gap-3">
                <span className="w-5 h-5 rounded-full bg-slate-800 text-amber-400 flex items-center justify-center font-mono text-xs shrink-0 mt-0.5">
                  3
                </span>
                <p>
                  Open <strong>Play Time</strong>, swipe up halfway to see Recent Apps, tap the app icon above the window, and tap <strong>Pin</strong>.
                </p>
              </div>
              <div className="flex items-start gap-3">
                <span className="w-5 h-5 rounded-full bg-emerald-500/20 text-emerald-400 flex items-center justify-center font-mono text-xs shrink-0 mt-0.5">
                  ✓
                </span>
                <p className="text-emerald-300">
                  The phone is now 100% locked! Android completely blocks the drop-down notification menu, Home button, and app switching until you hold Back + Home.
                </p>
              </div>
            </div>
          )}

          {selectedBrand === 'samsung' && (
            <div className="space-y-3">
              <div className="flex items-start gap-3">
                <span className="w-5 h-5 rounded-full bg-slate-800 text-amber-400 flex items-center justify-center font-mono text-xs shrink-0 mt-0.5">
                  1
                </span>
                <p>
                  On Samsung Galaxy: Open <strong>Settings</strong> &gt; <strong>Security and Privacy</strong> &gt; <strong>Other security settings</strong> &gt; <strong>Pin app</strong>.
                </p>
              </div>
              <div className="flex items-start gap-3">
                <span className="w-5 h-5 rounded-full bg-slate-800 text-amber-400 flex items-center justify-center font-mono text-xs shrink-0 mt-0.5">
                  2
                </span>
                <p>
                  Toggle <strong>Pin app</strong> to ON. Also enable "Require PIN before unpinning".
                </p>
              </div>
              <div className="flex items-start gap-3">
                <span className="w-5 h-5 rounded-full bg-slate-800 text-amber-400 flex items-center justify-center font-mono text-xs shrink-0 mt-0.5">
                  3
                </span>
                <p>
                  To cap sound: Go to <strong>Settings &gt; Sounds and vibration &gt; Volume</strong> &gt; tap three dots &gt; <strong>Media volume limit</strong> to lock maximum child volume.
                </p>
              </div>
            </div>
          )}

          {selectedBrand === 'pixel' && (
            <div className="space-y-3">
              <div className="flex items-start gap-3">
                <span className="w-5 h-5 rounded-full bg-slate-800 text-amber-400 flex items-center justify-center font-mono text-xs shrink-0 mt-0.5">
                  1
                </span>
                <p>
                  Google Pixel (Android 13/14/15): Open <strong>Settings &gt; Security & Privacy &gt; More security settings &gt; App pinning</strong>.
                </p>
              </div>
              <div className="flex items-start gap-3">
                <span className="w-5 h-5 rounded-full bg-slate-800 text-amber-400 flex items-center justify-center font-mono text-xs shrink-0 mt-0.5">
                  2
                </span>
                <p>
                  Switch toggle ON. Open Play Time, swipe up from bottom and hold to view Overview, tap the Play Time icon, and tap <strong>Pin</strong>.
                </p>
              </div>
            </div>
          )}

          {selectedBrand === 'xiaomi' && (
            <div className="space-y-3">
              <div className="flex items-start gap-3">
                <span className="w-5 h-5 rounded-full bg-slate-800 text-amber-400 flex items-center justify-center font-mono text-xs shrink-0 mt-0.5">
                  1
                </span>
                <p>
                  Xiaomi MIUI / HyperOS: Open <strong>Settings &gt; Passwords & Security &gt; Privacy &gt; Screen Pinning</strong> and enable.
                </p>
              </div>
              <div className="flex items-start gap-3">
                <span className="w-5 h-5 rounded-full bg-slate-800 text-amber-400 flex items-center justify-center font-mono text-xs shrink-0 mt-0.5">
                  2
                </span>
                <p>
                  In Security App &gt; <strong>Second Space</strong> or <strong>Kid Space</strong> can also be used as a dedicated playground for toddlers.
                </p>
              </div>
            </div>
          )}
        </div>
      </div>

      {/* Frequently Asked Questions */}
      <div className="space-y-2">
        <h4 className="text-sm font-bold text-white mb-3">Frequently Asked Questions</h4>
        {[
          {
            q: 'Can a toddler pull down the top notification menu or quick settings?',
            a: 'No. When Play Time enters Lock Mode, it activates fullscreen immersion and an active top edge touch barrier. Even if a child frantically swipes down from the top edge, the touches are neutralized. Pairing with Android App Pinning further locks the OS status bar completely.',
          },
          {
            q: 'How does volume protection work when the child presses volume buttons?',
            a: 'Play Time intercepts physical Volume Up and Volume Down events. In parent settings, you can lock the volume at any level (e.g. 45%). If a button is pressed, Play Time displays a parent lock HUD and keeps the audio safe and comfortable.',
          },
          {
            q: 'Can my child pause the video or skip to another cartoon?',
            a: 'Not while screen lock is active. The player controls are completely hidden behind an impenetrable transparent touch interceptor. Only the parent can reveal controls using the secret 4-digit PIN, 3-second hold, or arithmetic challenge.',
          },
          {
            q: 'Can I add downloaded videos or local cartoons from my tablet?',
            a: 'Yes! Click "Add Custom Video / File" in the library to select any MP4 or WebM video stored on your device. It plays instantly without internet, fully protected by the child lock.',
          },
        ].map((faq, i) => (
          <div
            key={i}
            className="rounded-xl border border-slate-800 bg-slate-850/60 overflow-hidden"
          >
            <button
              onClick={() => toggleFaq(i)}
              className="w-full px-4 py-3 text-left flex items-center justify-between text-xs md:text-sm font-semibold text-slate-200 hover:text-white"
            >
              <span>{faq.q}</span>
              {expandedFaq === i ? (
                <ChevronUp className="w-4 h-4 text-slate-400 shrink-0" />
              ) : (
                <ChevronDown className="w-4 h-4 text-slate-400 shrink-0" />
              )}
            </button>
            {expandedFaq === i && (
              <div className="px-4 pb-3 pt-1 text-xs text-slate-400 leading-relaxed border-t border-slate-850">
                {faq.a}
              </div>
            )}
          </div>
        ))}
      </div>
    </div>
  );
};
