import React from 'react';

interface IndiaPLLogoProps {
  className?: string;
  variant?: 'default' | 'admin' | 'white' | 'icon-only';
  size?: 'sm' | 'md' | 'lg';
}

export const IndiaPLLogo: React.FC<IndiaPLLogoProps> = ({
  className = '',
  variant = 'default',
  size = 'md',
}) => {
  const isWhite = variant === 'white';
  const isAdmin = variant === 'admin';

  const iconSizes = {
    sm: 'w-7 h-7',
    md: 'w-9 h-9',
    lg: 'w-12 h-12',
  };

  const textSizes = {
    sm: 'text-base',
    md: 'text-lg',
    lg: 'text-2xl',
  };

  const subtitleSizes = {
    sm: 'text-[9px]',
    md: 'text-[11px]',
    lg: 'text-xs',
  };

  return (
    <div className={`inline-flex items-center gap-2.5 ${className}`}>
      {/* Official Circular Icon from PDF */}
      <div className={`relative flex items-center justify-center rounded-full bg-[#009E9B] shadow-sm ${iconSizes[size]}`}>
        {/* Stylized person with uplifted arms forming V-symbol */}
        <svg
          viewBox="0 0 40 40"
          className="w-3/4 h-3/4"
          fill="none"
          xmlns="http://www.w3.org/2000/svg"
        >
          {/* Head */}
          <circle cx="20" cy="12" r="4.2" fill="#FFFFFF" />
          {/* Uplifted V-wings / Body */}
          <path
            d="M9 19C13.5 24 16.5 26.5 20 32C23.5 26.5 26.5 24 31 19C28 20.8 24.5 21.8 20 21.8C15.5 21.8 12 20.8 9 19Z"
            fill="#FFFFFF"
          />
          <path
            d="M11 16.5C14.5 19.5 17 21 20 21C23 21 25.5 19.5 29 16.5C26.5 15.5 23.5 15 20 15C16.5 15 13.5 15.5 11 16.5Z"
            fill="#E0F7F5"
          />
        </svg>
        {/* Subtle cyan ring glow */}
        <div className="absolute inset-0 rounded-full border border-teal-200/50 pointer-events-none" />
      </div>

      {variant !== 'icon-only' && (
        <div className="flex flex-col leading-none">
          <div className="flex items-center gap-1.5">
            <span
              className={`font-extrabold tracking-tight ${
                isWhite ? 'text-white' : 'text-[#009E9B]'
              } ${textSizes[size]}`}
            >
              INDIA P.L.
            </span>
            {isAdmin && (
              <span className="px-1.5 py-0.5 text-[10px] font-bold uppercase tracking-wider bg-teal-100 text-[#00827F] rounded border border-teal-300">
                ADMIN
              </span>
            )}
          </div>
          <span
            className={`font-medium tracking-normal mt-0.5 ${
              isWhite ? 'text-teal-100' : 'text-[#5B738B]'
            } ${subtitleSizes[size]}`}
          >
            Trusted Services. Better Tomorrow.
          </span>
        </div>
      )}
    </div>
  );
};
