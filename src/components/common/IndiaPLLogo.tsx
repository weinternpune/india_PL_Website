import React from 'react';
import officialLogoSymbol from '../../assets/india_pl_symbol.png';

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

  const iconSizes = {
    sm: 'h-6 sm:h-7 w-auto max-h-7 max-w-[28px]',
    md: 'h-7 sm:h-8 w-auto max-h-8 max-w-[32px]',
    lg: 'h-10 sm:h-11 w-auto max-h-11 max-w-[44px]',
  };

  const textSizes = {
    sm: 'text-sm sm:text-base',
    md: 'text-base sm:text-lg',
    lg: 'text-xl sm:text-2xl',
  };

  const subtitleSizes = {
    sm: 'text-[8.5px]',
    md: 'text-[9.5px]',
    lg: 'text-[11px]',
  };

  return (
    <div className={`inline-flex items-center gap-2 select-none shrink-0 ${className}`}>
      {/* Official Symbol from the INDIA P.L. PDF - strictly sized without distortion */}
      <div className="relative shrink-0 flex items-center justify-center">
        <img
          src={officialLogoSymbol}
          alt="INDIA P.L."
          className={`${iconSizes[size]} object-contain drop-shadow-2xs`}
          loading="eager"
        />
      </div>

      {variant !== 'icon-only' && (
        <div className="flex flex-col leading-none shrink-0">
          <div className="flex items-center">
            <span className={`font-extrabold tracking-tight ${textSizes[size]}`}>
              <span className="text-[#FF751F]">I</span>
              <span className={isWhite ? 'text-white' : 'text-[#008A8E]'}>NDIA P.L.</span>
            </span>
          </div>
          <span
            className={`font-bold tracking-tight mt-0.5 ${
              isWhite ? 'text-teal-200/90' : 'text-[#0B2038]'
            } ${subtitleSizes[size]}`}
          >
            Trusted Services. Better Tomorrow.
          </span>
        </div>
      )}
    </div>
  );
};
