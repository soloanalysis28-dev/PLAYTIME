import React, { useState, useEffect } from 'react';
import { Lock, Delete, X, ShieldCheck, AlertCircle } from 'lucide-react';
import { ChildLockSettings } from '../types';

interface UnlockModalProps {
  isOpen: boolean;
  settings: ChildLockSettings;
  onSuccess: () => void;
  onClose: () => void;
}

export const UnlockModal: React.FC<UnlockModalProps> = ({
  isOpen,
  settings,
  onSuccess,
  onClose,
}) => {
  const [pinInput, setPinInput] = useState<string>('');
  const [errorMessage, setErrorMessage] = useState<string>('');
  const [isShaking, setIsShaking] = useState<boolean>(false);

  // For Math challenge
  const [mathQuestion, setMathQuestion] = useState<{ num1: number; num2: number; answer: number }>({
    num1: 7,
    num2: 6,
    answer: 13,
  });

  useEffect(() => {
    if (isOpen) {
      setPinInput('');
      setErrorMessage('');
      setIsShaking(false);

      if (settings.unlockMethod === 'math') {
        const n1 = Math.floor(Math.random() * 12) + 6;
        const n2 = Math.floor(Math.random() * 9) + 4;
        setMathQuestion({ num1: n1, num2: n2, answer: n1 + n2 });
      }
    }
  }, [isOpen, settings.unlockMethod]);

  if (!isOpen) return null;

  const handleKeyPress = (num: string) => {
    if (pinInput.length >= 4) return;
    const nextPin = pinInput + num;
    setPinInput(nextPin);
    setErrorMessage('');

    // Check PIN if reached length
    if (settings.unlockMethod === 'pin') {
      if (nextPin.length === 4) {
        verifyPin(nextPin);
      }
    }
  };

  const handleDelete = () => {
    setPinInput((prev) => prev.slice(0, -1));
    setErrorMessage('');
  };

  const verifyPin = (enteredPin: string) => {
    if (enteredPin === settings.pin) {
      if (navigator.vibrate) navigator.vibrate(60);
      onSuccess();
    } else {
      if (navigator.vibrate) navigator.vibrate([60, 40, 60]);
      setIsShaking(true);
      setErrorMessage('Incorrect PIN. Try again.');
      setTimeout(() => {
        setPinInput('');
        setIsShaking(false);
      }, 500);
    }
  };

  const verifyMath = () => {
    const val = parseInt(pinInput, 10);
    if (val === mathQuestion.answer) {
      if (navigator.vibrate) navigator.vibrate(60);
      onSuccess();
    } else {
      if (navigator.vibrate) navigator.vibrate([60, 40, 60]);
      setIsShaking(true);
      setErrorMessage('Incorrect answer. Try again.');
      setTimeout(() => {
        setPinInput('');
        setIsShaking(false);
      }, 500);
    }
  };

  return (
    <div
      className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-950/85 backdrop-blur-md animate-in fade-in duration-200"
      onPointerDown={(e) => e.stopPropagation()}
    >
      <div
        className={`w-full max-w-sm rounded-3xl bg-slate-900 border border-slate-800 p-6 shadow-2xl text-slate-100 flex flex-col items-center relative ${
          isShaking ? 'animate-bounce' : ''
        }`}
      >
        <button
          onClick={onClose}
          className="absolute top-4 right-4 p-2 text-slate-400 hover:text-white rounded-full hover:bg-slate-800 transition-colors"
          aria-label="Cancel unlock"
        >
          <X className="w-5 h-5" />
        </button>

        <div className="w-12 h-12 rounded-2xl bg-amber-500/20 text-amber-400 flex items-center justify-center mb-4 border border-amber-500/30">
          <ShieldCheck className="w-6 h-6" />
        </div>

        <h3 className="text-xl font-bold font-display text-white text-center">
          Parent Verification
        </h3>
        <p className="text-xs text-slate-400 mt-1 mb-6 text-center">
          {settings.unlockMethod === 'math'
            ? `Solve parent check: What is ${mathQuestion.num1} + ${mathQuestion.num2}?`
            : 'Enter your 4-digit PIN to release Child Lock'}
        </p>

        {/* PIN Dots indicator or Math Input Display */}
        {settings.unlockMethod === 'pin' ? (
          <div className="flex gap-4 mb-6">
            {[0, 1, 2, 3].map((index) => {
              const isFilled = index < pinInput.length;
              return (
                <div
                  key={index}
                  className={`w-4 h-4 rounded-full transition-all duration-200 ${
                    isFilled
                      ? 'bg-amber-400 scale-110 shadow-md shadow-amber-400/50'
                      : 'border-2 border-slate-700 bg-slate-800/50'
                  }`}
                />
              );
            })}
          </div>
        ) : (
          <div className="w-32 h-12 rounded-xl bg-slate-800 border border-slate-700 flex items-center justify-center text-2xl font-mono font-bold text-amber-400 mb-6">
            {pinInput || '_'}
          </div>
        )}

        {errorMessage && (
          <div className="flex items-center gap-1.5 text-xs text-rose-400 mb-4 animate-in fade-in">
            <AlertCircle className="w-3.5 h-3.5" />
            <span>{errorMessage}</span>
          </div>
        )}

        {/* Keypad */}
        <div className="grid grid-cols-3 gap-3 w-full max-w-[260px] mb-4">
          {[1, 2, 3, 4, 5, 6, 7, 8, 9].map((num) => (
            <button
              key={num}
              type="button"
              onClick={() => handleKeyPress(String(num))}
              className="h-14 rounded-2xl bg-slate-800/80 hover:bg-slate-700 text-xl font-semibold text-white border border-slate-700/60 transition-all active:scale-95 flex items-center justify-center cursor-pointer"
            >
              {num}
            </button>
          ))}
          <button
            type="button"
            onClick={handleDelete}
            className="h-14 rounded-2xl bg-slate-800/40 hover:bg-slate-800 text-slate-400 hover:text-white transition-all active:scale-95 flex items-center justify-center cursor-pointer"
            aria-label="Delete last digit"
          >
            <Delete className="w-5 h-5" />
          </button>
          <button
            type="button"
            onClick={() => handleKeyPress('0')}
            className="h-14 rounded-2xl bg-slate-800/80 hover:bg-slate-700 text-xl font-semibold text-white border border-slate-700/60 transition-all active:scale-95 flex items-center justify-center cursor-pointer"
          >
            0
          </button>
          {settings.unlockMethod === 'math' ? (
            <button
              type="button"
              onClick={verifyMath}
              className="h-14 rounded-2xl bg-amber-500 hover:bg-amber-400 text-slate-950 font-bold text-sm transition-all active:scale-95 flex items-center justify-center cursor-pointer"
            >
              OK
            </button>
          ) : (
            <div className="h-14 flex items-center justify-center">
              <span className="text-[10px] text-slate-500 font-medium">Default: 1234</span>
            </div>
          )}
        </div>

        <button
          onClick={onClose}
          className="text-xs text-slate-400 hover:text-slate-300 font-medium py-1"
        >
          Cancel & Keep Screen Locked
        </button>
      </div>
    </div>
  );
};
