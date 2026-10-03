import React, { useEffect } from 'react';
import { IndiaPLLogo } from '../common/IndiaPLLogo';
import { X, Smartphone, ShieldCheck, Star, MapPin, QrCode, ExternalLink } from 'lucide-react';

interface AppDownloadModalProps {
  isOpen: boolean;
  onClose: () => void;
  serviceName?: string;
}

export const AppDownloadModal: React.FC<AppDownloadModalProps> = ({
  isOpen,
  onClose,
  serviceName,
}) => {
  const playStoreUrl = import.meta.env.VITE_PLAY_STORE_URL || '';

  // Close on ESC key
  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      if (e.key === 'Escape') onClose();
    };
    if (isOpen) {
      document.body.style.overflow = 'hidden';
      window.addEventListener('keydown', handleKeyDown);
    }
    return () => {
      document.body.style.overflow = '';
      window.removeEventListener('keydown', handleKeyDown);
    };
  }, [isOpen, onClose]);

  if (!isOpen) return null;

  const handleDownloadClick = () => {
    if (playStoreUrl) {
      window.open(playStoreUrl, '_blank', 'noopener,noreferrer');
    } else {
      alert('The INDIA P.L. Customer Android App is coming soon to the Google Play Store! Stay tuned.');
    }
  };

  return (
    <div
      className="fixed inset-0 z-50 flex items-center justify-center p-4 sm:p-6 bg-slate-950/70 backdrop-blur-xs animate-in fade-in duration-200"
      onClick={onClose}
    >
      <div
        className="relative w-full max-w-lg bg-white rounded-3xl shadow-2xl border border-teal-100 overflow-hidden transform transition-all animate-in zoom-in-95 duration-200"
        onClick={(e) => e.stopPropagation()}
      >
        {/* Header decoration */}
        <div className="bg-gradient-to-r from-[#009E9B] to-[#00827F] p-6 text-white relative">
          <button
            onClick={onClose}
            className="absolute top-4 right-4 w-8 h-8 rounded-full bg-white/20 hover:bg-white/30 text-white flex items-center justify-center transition-colors"
            aria-label="Close modal"
          >
            <X className="w-5 h-5" />
          </button>

          <div className="flex items-center gap-3">
            <div className="w-12 h-12 rounded-2xl bg-white p-1.5 shadow-md flex items-center justify-center">
              <IndiaPLLogo variant="icon-only" size="sm" />
            </div>
            <div>
              <span className="text-xs font-bold uppercase tracking-wider text-teal-200">
                Customer Mobile Experience
              </span>
              <h3 className="text-xl font-extrabold text-white">Download the INDIA P.L. App</h3>
            </div>
          </div>

          {serviceName && (
            <div className="mt-3.5 inline-flex items-center gap-2 px-3 py-1 rounded-full bg-white/15 text-xs text-white backdrop-blur-xs border border-white/20">
              <span>Ready to book: <strong>{serviceName}</strong></span>
            </div>
          )}
        </div>

        {/* Body content */}
        <div className="p-6 space-y-6">
          <p className="text-sm text-[#3E556E] leading-relaxed">
            Experience lightning-fast doorstep service bookings with real-time GPS technician dispatch, 
            instant booking confirmations, and transparent per-session pricing directly on your smartphone.
          </p>

          {/* Highlights */}
          <div className="grid grid-cols-2 gap-3">
            {[
              { title: 'Live GPS Matching', desc: 'Find nearest verified pro in 2 mins', icon: MapPin },
              { title: '100% Background Check', desc: 'Aadhaar & Police verified', icon: ShieldCheck },
              { title: 'Standardized Rates', desc: 'No bargaining or hidden fees', icon: Star },
              { title: 'Cash or UPI Payments', desc: 'Safe doorstep checkout', icon: Smartphone },
            ].map((f, i) => {
              const Icon = f.icon;
              return (
                <div key={i} className="p-3 rounded-2xl bg-[#F4FBFB] border border-[#DCEEEB]">
                  <div className="flex items-center gap-2 mb-1">
                    <Icon className="w-4 h-4 text-[#009E9B]" />
                    <h4 className="text-xs font-bold text-[#0B2038]">{f.title}</h4>
                  </div>
                  <p className="text-[11px] text-[#5B738B] leading-tight">{f.desc}</p>
                </div>
              );
            })}
          </div>

          {/* CTA Buttons */}
          <div className="pt-2 flex flex-col sm:flex-row items-center gap-3">
            <button
              onClick={handleDownloadClick}
              className="w-full sm:flex-1 py-3.5 px-6 rounded-full bg-[#009E9B] hover:bg-[#008784] text-white font-bold text-sm shadow-md hover:shadow-lg transition-all flex items-center justify-center gap-2.5 active:scale-98"
            >
              <Smartphone className="w-5 h-5" />
              <span>Get on Google Play</span>
              <ExternalLink className="w-4 h-4 opacity-75" />
            </button>
            <button
              onClick={onClose}
              className="w-full sm:w-auto py-3.5 px-6 rounded-full bg-slate-100 hover:bg-slate-200 text-[#0B2038] font-bold text-sm transition-all"
            >
              Close
            </button>
          </div>

          <div className="text-center">
            <p className="text-[11px] text-[#71879D]">
              Currently serving Bhubaneswar, Cuttack & expanding across Odisha.
            </p>
          </div>
        </div>
      </div>
    </div>
  );
};
