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
  const isAdmin = variant === 'admin';

  const iconSizes = {
    sm: 'h-8 w-auto min-w-[28px]',
    md: 'h-10 w-auto min-w-[34px]',
    lg: 'h-13 w-auto min-w-[44px]',
  };

  const textSizes = {
    sm: 'text-base',
    md: 'text-lg sm:text-xl',
    lg: 'text-2xl sm:text-3xl',
  };

  const subtitleSizes = {
    sm: 'text-[9.5px]',
    md: 'text-[11px]',
    lg: 'text-xs',
  };

  return (
    <div className={`inline-flex items-center gap-2.5 select-none ${className}`}>
      {/* Official Symbol from the INDIA P.L. PDF */}
      <div className="relative shrink-0 flex items-center justify-center">
        <img
          src={officialLogoSymbol}
          alt="INDIA P.L. Official Logo"
          className={`${iconSizes[size]} object-contain drop-shadow-xs transition-transform duration-200`}
          loading="eager"
        />
      </div>

      {variant !== 'icon-only' && (
        <div className="flex flex-col leading-none">
          <div className="flex items-center gap-1.5">
            <span className={`font-extrabold tracking-tight ${textSizes[size]}`}>
              <span className="text-[#FF751F]">I</span>
              <span className={isWhite ? 'text-white' : 'text-[#008A8E]'}>NDIA P.L.</span>
            </span>
            {isAdmin && (
              <span className="px-1.5 py-0.5 text-[9px] sm:text-[10px] font-bold uppercase tracking-wider bg-teal-100/90 text-[#00827F] rounded border border-teal-300">
                ADMIN
              </span>
            )}
          </div>
          <span
            className={`font-bold tracking-tight mt-1 ${
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
