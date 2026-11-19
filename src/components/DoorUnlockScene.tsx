import React, {useEffect, useState} from 'react';
import {playDoorOpenChime, playKeyInsertClick} from '../utils/audioEngine';

interface DoorUnlockSceneProps {
  onComplete: () => void;
}

type DoorStep =
  | 'door-appear'
  | 'key-fly'
  | 'key-insert'
  | 'key-turn'
  | 'door-open'
  | 'done';

export const DoorUnlockScene: React.FC<DoorUnlockSceneProps> = ({
  onComplete,
}) => {
  const [step, setStep] = useState<DoorStep>('door-appear');

  useEffect(() => {
    const prefersReducedMotion = window.matchMedia(
      '(prefers-reduced-motion: reduce)',
    ).matches;

    if (prefersReducedMotion) {
      setStep('door-open');
      playDoorOpenChime();
      const t = window.setTimeout(() => onComplete(), 1100);
      return () => window.clearTimeout(t);
    }

    const timers: number[] = [];
    timers.push(window.setTimeout(() => setStep('key-fly'), 500));
    timers.push(
      window.setTimeout(() => {
        setStep('key-insert');
        playKeyInsertClick();
      }, 1350),
    );
    timers.push(window.setTimeout(() => setStep('key-turn'), 1850));
    timers.push(
      window.setTimeout(() => {
        setStep('door-open');
        playDoorOpenChime();
      }, 2350),
    );
    timers.push(window.setTimeout(() => setStep('done'), 3400));
    timers.push(window.setTimeout(() => onComplete(), 3750));

    return () => timers.forEach((t) => window.clearTimeout(t));
  }, [onComplete]);

  const isUnlocked =
    step === 'key-turn' || step === 'door-open' || step === 'done';
  const isDoorOpen = step === 'door-open' || step === 'done';
  const isFadingOut = step === 'done';

  const getKeyStyle = (): React.CSSProperties => {
    switch (step) {
      case 'door-appear':
        return {
          transform: 'translate(-50%, 190px) rotate(-28deg) scale(0.95)',
          opacity: 0,
        };
      case 'key-fly':
        return {
          transform: 'translate(-50%, 34px) rotate(0deg) scale(1.06)',
          opacity: 1,
        };
      case 'key-insert':
        return {
          transform: 'translate(-50%, 0px) rotate(0deg) scale(1)',
          opacity: 1,
        };
      case 'key-turn':
        return {
          transform: 'translate(-50%, -2px) rotate(90deg) scale(0.95)',
          opacity: 1,
        };
      case 'door-open':
      case 'done':
        return {
          transform: 'translate(-50%, -8px) rotate(90deg) scale(0.82)',
          opacity: 0,
        };
    }
  };

  return (
    <main
      className={`min-h-dvh w-full flex flex-col items-center justify-center px-4 pb-24 relative z-10 transition-opacity duration-400 ${
        isFadingOut ? 'opacity-0 scale-105' : 'opacity-100 scale-100'
      }`}
      aria-live="polite"
    >
      <p className="text-xs sm:text-sm font-bold text-[#4A3525] bg-[#FFFDF9] border-[2.5px] border-[#4A3525] shadow-[4px_4px_0px_#4A3525] px-4 py-1.5 rounded-[24px] mb-6 animate-gentle-appear">
        {isDoorOpen
          ? 'Cánh cửa đôi đã mở toang rồi!'
          : 'Đáp án đúng rồi · Đang mở khoá cửa...'}
      </p>

      {/* Chibi Arched Double Door Frame Container (exact size & 3D perspective preserved) */}
      <div
        className="relative w-[290px] h-[390px] sm:w-[360px] sm:h-[470px] rounded-t-[180px] p-3.5 bg-[#FFD1DC] shadow-[4px_4px_0px_#4A3525] border-[2.5px] border-[#4A3525]"
        style={{perspective: '1300px'}}
      >
        {/* Bright Interior Beyond the Double Door */}
        <div className="w-full h-full rounded-t-[166px] bg-gradient-to-b from-[#FFF9F5] via-[#FFFDF9] to-[#C8F7DC] border-[2.5px] border-[#4A3525] flex flex-col items-center justify-center relative overflow-hidden">
          <div
            className={`text-center px-4 transition-all duration-700 ${
              isDoorOpen ? 'opacity-100 scale-100' : 'opacity-0 scale-90'
            }`}
          >
            <p className="font-mono text-xs font-bold tracking-[0.25em] text-[#E15B78] mb-1">
              19 · 11
            </p>
            <p className="text-2xl sm:text-3xl font-extrabold text-[#4A3525]">
              Những kỉ niệm
            </p>
          </div>
        </div>

        {/* Double Door Leaves Container */}
        <div
          className="absolute inset-3.5 rounded-t-[166px] flex overflow-visible"
          style={{transformStyle: 'preserve-3d'}}
        >
          {/* LEFT CHUBBY CHIBI SVG ARCHED LEAF */}
          <div
            className="w-1/2 h-full rounded-tl-[166px] transition-transform duration-1000 ease-[cubic-bezier(0.16,1,0.3,1)] relative"
            style={{
              transformOrigin: 'left center',
              transform: isDoorOpen ? 'rotateY(-112deg)' : 'rotateY(0deg)',
              backfaceVisibility: 'hidden',
            }}
          >
            <svg
              viewBox="0 0 165 440"
              preserveAspectRatio="none"
              className="w-full h-full overflow-visible"
            >
              {/* Chubby Door Leaf Body */}
              <path
                d="M165,4 C74,4 4,76 4,168 L4,436 L165,436 Z"
                fill="#FFE4EC"
                stroke="#4A3525"
                strokeWidth="4"
                strokeLinejoin="round"
              />
              {/* Soft Cream Inner Highlight */}
              <path
                d="M150,24 C80,24 20,86 20,166 L20,188 L150,188 Z"
                fill="#FFFDF9"
                stroke="#4A3525"
                strokeWidth="3.2"
                strokeLinejoin="round"
              />
              {/* Cute Star Window Accent */}
              <path
                d="M90,82 L96,97 L112,99 L100,109 L103,125 L90,117 L77,125 L80,109 L68,99 L84,97 Z"
                fill="#FFE58F"
                stroke="#4A3525"
                strokeWidth="2.5"
                strokeLinejoin="round"
              />
              {/* Lower Chubby Panel */}
              <rect
                x="20"
                y="265"
                width="130"
                height="148"
                rx="18"
                fill="#FFFDF9"
                stroke="#4A3525"
                strokeWidth="3.2"
              />
              {/* Chubby Brass Left Handle */}
              <rect
                x="136"
                y="204"
                width="18"
                height="48"
                rx="9"
                fill="#FFE074"
                stroke="#4A3525"
                strokeWidth="3"
              />
              <circle cx="145" cy="216" r="3" fill="#FFFDF9" />
            </svg>
          </div>

          {/* RIGHT CHUBBY CHIBI SVG ARCHED LEAF */}
          <div
            className="w-1/2 h-full rounded-tr-[166px] transition-transform duration-1000 ease-[cubic-bezier(0.16,1,0.3,1)] relative"
            style={{
              transformOrigin: 'right center',
              transform: isDoorOpen ? 'rotateY(112deg)' : 'rotateY(0deg)',
              backfaceVisibility: 'hidden',
            }}
          >
            <svg
              viewBox="0 0 165 440"
              preserveAspectRatio="none"
              className="w-full h-full overflow-visible"
            >
              {/* Chubby Door Leaf Body */}
              <path
                d="M0,4 C91,4 161,76 161,168 L161,436 L0,436 Z"
                fill="#FFE4EC"
                stroke="#4A3525"
                strokeWidth="4"
                strokeLinejoin="round"
              />
              {/* Soft Cream Inner Highlight */}
              <path
                d="M15,24 C85,24 145,86 145,166 L145,188 L15,188 Z"
                fill="#FFFDF9"
                stroke="#4A3525"
                strokeWidth="3.2"
                strokeLinejoin="round"
              />
              {/* Cute Heart Window Accent */}
              <path
                d="M78,125 C78,125 56,111 56,95 C56,87 62,82 69,82 C73,82 76,84 78,87 C80,84 83,82 87,82 C94,82 100,87 100,95 C100,111 78,125 78,125 Z"
                fill="#FFD1DC"
                stroke="#4A3525"
                strokeWidth="2.5"
                strokeLinejoin="round"
              />
              {/* Lower Chubby Panel */}
              <rect
                x="15"
                y="265"
                width="130"
                height="148"
                rx="18"
                fill="#FFFDF9"
                stroke="#4A3525"
                strokeWidth="3.2"
              />
              {/* Chubby Brass Right Handle */}
              <rect
                x="11"
                y="204"
                width="18"
                height="48"
                rx="9"
                fill="#FFE074"
                stroke="#4A3525"
                strokeWidth="3"
              />
              <circle cx="20" cy="216" r="3" fill="#FFFDF9" />
            </svg>
          </div>

          {/* CENTER CHIBI PADLOCK MECHANISM clamping both door handles */}
          <div
            className={`absolute left-1/2 top-[53%] -translate-x-1/2 -translate-y-1/2 z-30 transition-all duration-500 ${
              isDoorOpen
                ? 'opacity-0 scale-75 pointer-events-none'
                : 'opacity-100 scale-100'
            }`}
          >
            {/* Clasp bar across both handles */}
            <div
              className={`w-24 sm:w-28 h-4 rounded-full bg-[#FFE074] border-[2.5px] border-[#4A3525] transition-transform duration-300 ${
                isUnlocked ? 'scale-x-75 opacity-60' : 'scale-x-100'
              }`}
            />

            {/* Chubby SVG Padlock */}
            <div className="absolute left-1/2 top-1/2 -translate-x-1/2 -translate-y-1/2 w-16 h-20 flex items-center justify-center">
              <svg
                viewBox="0 0 68 82"
                className="w-full h-full overflow-visible drop-shadow-[3px_3px_0px_#4A3525]"
              >
                {/* Lock Shackle */}
                <path
                  d="M20,34 L20,21 C20,12 26,6 34,6 C42,6 48,12 48,21 L48,34"
                  fill="none"
                  stroke="#4A3525"
                  strokeWidth="8.5"
                  strokeLinecap="round"
                  className={`transition-transform duration-300 ${
                    isUnlocked ? '-translate-y-2.5' : 'translate-y-0'
                  }`}
                />
                <path
                  d="M20,34 L20,21 C20,12 26,6 34,6 C42,6 48,12 48,21 L48,34"
                  fill="none"
                  stroke="#FFE074"
                  strokeWidth="3.5"
                  strokeLinecap="round"
                  className={`transition-transform duration-300 ${
                    isUnlocked ? '-translate-y-2.5' : 'translate-y-0'
                  }`}
                />
                {/* Chubby Rounded Padlock Body */}
                <rect
                  x="8"
                  y="30"
                  width="52"
                  height="46"
                  rx="16"
                  fill="#FFE074"
                  stroke="#4A3525"
                  strokeWidth="3.5"
                />
                {/* Cute Cheek Highlights on Lock */}
                <circle cx="19" cy="54" r="3.5" fill="#FFB5C5" opacity="0.85" />
                <circle cx="49" cy="54" r="3.5" fill="#FFB5C5" opacity="0.85" />
                {/* Keyhole */}
                <circle cx="34" cy="49" r="5.5" fill="#4A3525" />
                <rect x="31" y="51" width="6" height="12" rx="3" fill="#4A3525" />
              </svg>

              {/* Flying Chubby Chibi Key aligned right into the keyhole */}
              <div
                className="absolute left-1/2 top-[48px] z-40 pointer-events-none transition-all duration-700 ease-[cubic-bezier(0.22,1,0.36,1)]"
                style={getKeyStyle()}
              >
                <svg
                  width="48"
                  height="98"
                  viewBox="0 0 48 98"
                  fill="none"
                  xmlns="http://www.w3.org/2000/svg"
                >
                  {/* Chubby Key Shaft */}
                  <rect
                    x="19"
                    y="5"
                    width="10"
                    height="46"
                    rx="5"
                    fill="#FFE074"
                    stroke="#4A3525"
                    strokeWidth="3"
                  />
                  {/* Chubby Rounded Key Teeth */}
                  <rect
                    x="27"
                    y="10"
                    width="11"
                    height="7"
                    rx="3.5"
                    fill="#FFE074"
                    stroke="#4A3525"
                    strokeWidth="2.6"
                  />
                  <rect
                    x="27"
                    y="21"
                    width="8"
                    height="6"
                    rx="3"
                    fill="#FFE074"
                    stroke="#4A3525"
                    strokeWidth="2.6"
                  />
                  {/* Chubby Cute Bow Handle */}
                  <circle
                    cx="24"
                    cy="69"
                    r="18"
                    fill="#FFE074"
                    stroke="#4A3525"
                    strokeWidth="3"
                  />
                  {/* Heart Center Cutout */}
                  <path
                    d="M24 76 C24 76 16 71 16 66 C16 63.3 18.2 61.5 20.6 61.5 C22 61.5 23.2 62.3 24 63.4 C24.8 62.3 26 61.5 27.4 61.5 C29.8 61.5 32 63.3 32 66 C32 71 24 76 24 76 Z"
                    fill="#FFD1DC"
                    stroke="#4A3525"
                    strokeWidth="2.2"
                    strokeLinejoin="round"
                  />
                </svg>
              </div>
            </div>
          </div>
        </div>
      </div>
    </main>
  );
};
