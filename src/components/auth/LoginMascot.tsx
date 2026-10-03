import React, { useState, useEffect } from 'react';

export type MascotMode = 'idle' | 'email' | 'password';

interface LoginMascotProps {
  mode: MascotMode;
  isTyping?: boolean;
}

export const LoginMascot: React.FC<LoginMascotProps> = ({ mode, isTyping = false }) => {
  const [blink, setBlink] = useState(false);

  // Periodic natural eye blinking when in idle or email mode
  useEffect(() => {
    if (mode === 'password') return;
    const interval = setInterval(() => {
      setBlink(true);
      setTimeout(() => setBlink(false), 180);
    }, 3500);
    return () => clearInterval(interval);
  }, [mode]);

  return (
    <div className="relative flex flex-col items-center justify-center transition-all duration-300 ease-out select-none pointer-events-none">
      {/* Speech bubble indicator */}
      <div
        className={`mb-1.5 px-2.5 py-0.5 rounded-full text-[10px] font-black tracking-wide uppercase shadow-xs border transition-all duration-300 transform ${
          mode === 'password'
            ? 'bg-amber-50 text-amber-900 border-amber-300 scale-100 opacity-100 -translate-y-0.5'
            : mode === 'email'
            ? 'bg-cyan-50 text-teal-900 border-teal-300 scale-100 opacity-100 -translate-y-0.5'
            : 'bg-slate-100 text-slate-800 border-slate-200 scale-95 opacity-80'
        }`}
      >
        {mode === 'password' ? (
          <span className="flex items-center gap-1">🙈 Top Secret!</span>
        ) : mode === 'email' ? (
          <span className="flex items-center gap-1">👀 Looking sharp!</span>
        ) : (
          <span className="flex items-center gap-1">👋 Welcome, Admin</span>
        )}
      </div>

      {/* SVG Mascot Character */}
      <div
        className={`relative w-20 h-20 transition-transform duration-300 ${
          isTyping ? 'animate-bounce' : ''
        } ${mode === 'password' ? 'rotate-1' : mode === 'email' ? '-rotate-1' : ''}`}
        style={{ animationDuration: '400ms', animationIterationCount: isTyping ? 1 : 0 }}
      >
        <svg
          viewBox="0 0 100 100"
          className="w-full h-full drop-shadow-md"
          fill="none"
          xmlns="http://www.w3.org/2000/svg"
        >
          {/* Shadow */}
          <ellipse cx="50" cy="94" rx="28" ry="4" fill="#0B2038" fillOpacity="0.12" />

          {/* Ears */}
          <circle cx="28" cy="30" r="10" fill="#008A8E" />
          <circle cx="28" cy="30" r="6" fill="#D1F0EE" />
          <circle cx="72" cy="30" r="10" fill="#008A8E" />
          <circle cx="72" cy="30" r="6" fill="#D1F0EE" />

          {/* Head Body */}
          <rect
            x="20"
            y="24"
            width="60"
            height="56"
            rx="24"
            fill="#FFFFFF"
            stroke="#0B2038"
            strokeWidth="3"
          />

          {/* Teal Cap / Top Accent */}
          <path
            d="M 23 40 Q 50 20 77 40 L 77 34 Q 50 18 23 34 Z"
            fill="#00A896"
            stroke="#0B2038"
            strokeWidth="2.5"
          />
          {/* Little Top Antenna / Badge */}
          <circle cx="50" cy="18" r="4" fill="#00A896" stroke="#0B2038" strokeWidth="2" />
          <line x1="50" y1="22" x2="50" y2="25" stroke="#0B2038" strokeWidth="2" />

          {/* Blush Cheeks */}
          <circle cx="31" cy="58" r="4.5" fill="#FFB4B4" fillOpacity="0.8" />
          <circle cx="69" cy="58" r="4.5" fill="#FFB4B4" fillOpacity="0.8" />

          {/* EYES / FACE EXPRESSIONS */}
          {mode === 'password' ? (
            /* Eyes closed happy arc when hands cover them */
            <g className="transition-opacity duration-200">
              <path
                d="M 33 49 Q 39 44 45 49"
                stroke="#0B2038"
                strokeWidth="3"
                strokeLinecap="round"
                fill="none"
              />
              <path
                d="M 55 49 Q 61 44 67 49"
                stroke="#0B2038"
                strokeWidth="3"
                strokeLinecap="round"
                fill="none"
              />
            </g>
          ) : mode === 'email' ? (
            /* Curious Eyes Looking Downwards */
            <g className="transition-all duration-200">
              {blink ? (
                <>
                  <line x1="33" y1="50" x2="45" y2="50" stroke="#0B2038" strokeWidth="3" strokeLinecap="round" />
                  <line x1="55" y1="50" x2="67" y2="50" stroke="#0B2038" strokeWidth="3" strokeLinecap="round" />
                </>
              ) : (
                <>
                  {/* Left Eye */}
                  <circle cx="39" cy="49" r="6" fill="#0B2038" />
                  <circle cx="40" cy="51" r="2.2" fill="#FFFFFF" />
                  {/* Right Eye */}
                  <circle cx="61" cy="49" r="6" fill="#0B2038" />
                  <circle cx="62" cy="51" r="2.2" fill="#FFFFFF" />
                </>
              )}
            </g>
          ) : (
            /* Idle Eyes Looking Straight */
            <g className="transition-all duration-200">
              {blink ? (
                <>
                  <line x1="33" y1="48" x2="45" y2="48" stroke="#0B2038" strokeWidth="3" strokeLinecap="round" />
                  <line x1="55" y1="48" x2="67" y2="48" stroke="#0B2038" strokeWidth="3" strokeLinecap="round" />
                </>
              ) : (
                <>
                  <circle cx="39" cy="48" r="5.5" fill="#0B2038" />
                  <circle cx="37.5" cy="46" r="1.8" fill="#FFFFFF" />
                  <circle cx="61" cy="48" r="5.5" fill="#0B2038" />
                  <circle cx="59.5" cy="46" r="1.8" fill="#FFFFFF" />
                </>
              )}
            </g>
          )}

          {/* Mouth */}
          {mode === 'password' ? (
            /* Shy O-mouth or small smile */
            <ellipse cx="50" cy="62" rx="3" ry="2.5" fill="#0B2038" />
          ) : isTyping ? (
            /* Happy open 'D' mouth */
            <path d="M 46 60 Q 50 66 54 60 Z" fill="#008A8E" stroke="#0B2038" strokeWidth="1.5" />
          ) : (
            /* Cute little smile */
            <path
              d="M 46 60 Q 50 64 54 60"
              stroke="#0B2038"
              strokeWidth="2.5"
              strokeLinecap="round"
              fill="none"
            />
          )}

          {/* HANDS / PAWS */}
          {mode === 'password' ? (
            /* Hands covering eyes (Peekaboo / Privacy mode) */
            <g className="transition-all duration-300">
              {/* Left Paw covering left eye */}
              <circle
                cx="38"
                cy="48"
                r="7.5"
                fill="#FFFFFF"
                stroke="#0B2038"
                strokeWidth="2.5"
              />
              <circle cx="38" cy="48" r="4" fill="#D1F0EE" />

              {/* Right Paw covering right eye */}
              <circle
                cx="62"
                cy="48"
                r="7.5"
                fill="#FFFFFF"
                stroke="#0B2038"
                strokeWidth="2.5"
              />
              <circle cx="62" cy="48" r="4" fill="#D1F0EE" />
            </g>
          ) : mode === 'email' ? (
            /* Left Paw waving, Right Paw on chin/desk */
            <g className="transition-all duration-300">
              {/* Left hand waving */}
              <circle cx="21" cy="54" r="5.5" fill="#FFFFFF" stroke="#0B2038" strokeWidth="2.2" />
              <circle cx="21" cy="54" r="2.5" fill="#008A8E" />
              {/* Right hand pointing down */}
              <circle cx="79" cy="64" r="5.5" fill="#FFFFFF" stroke="#0B2038" strokeWidth="2.2" />
            </g>
          ) : (
            /* Hands resting calmly at bottom */
            <g className="transition-all duration-300">
              <circle cx="34" cy="74" r="5" fill="#FFFFFF" stroke="#0B2038" strokeWidth="2" />
              <circle cx="66" cy="74" r="5" fill="#FFFFFF" stroke="#0B2038" strokeWidth="2" />
            </g>
          )}
        </svg>
      </div>
    </div>
  );
};
