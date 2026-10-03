import React, { useEffect, useState } from 'react';
import { IndiaPLLogo } from '../common/IndiaPLLogo';
import { X, Smartphone, ShieldCheck, Star, MapPin, ExternalLink } from 'lucide-react';

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
  const [downloadNotice, setDownloadNotice] = useState(false);
  const playStoreUrl = import.meta.env.VITE_PLAY_STORE_URL || '';

  // Close on ESC key & reset state
  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      if (e.key === 'Escape') onClose();
    };
    if (isOpen) {
      document.body.style.overflow = 'hidden';
      setDownloadNotice(false);
      window.addEventListener('keydown', handleKeyDown);
    }
    return () => {
      document.body.style.overflow = '';
      window.removeEventListener('keydown', handleKeyDown);
    };
  }, [isOpen, onClose]);

  if (!isOpen) return null;

  const handleDownloadClick = () => {
    // If a specific INDIA P.L. package URL is provided, open it
    if (playStoreUrl && playStoreUrl !== '#' && playStoreUrl.includes('details?id=')) {
      window.open(playStoreUrl, '_blank', 'noopener,noreferrer');
    } else {
      setDownloadNotice(true);
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
        <div className="bg-gradient-to-r from-[#008A8E] to-[#007377] p-6 text-white relative">
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
              <h3 className="text-xl font-extrabold text-white">INDIA P.L. Customer App</h3>
            </div>
          </div>

          {serviceName && (
            <div className="mt-3.5 inline-flex items-center gap-2 px-3 py-1 rounded-full bg-white/15 text-xs text-white backdrop-blur-xs border border-white/20">
              <span>Selected for booking: <strong>{serviceName}</strong></span>
            </div>
          )}
        </div>

        {/* Body content */}
        <div className="p-6 space-y-6">
          <p className="text-sm text-[#0B2038] font-medium leading-relaxed">
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
                    <Icon className="w-4 h-4 text-[#008A8E]" />
                    <h4 className="text-xs font-bold text-[#0B2038]">{f.title}</h4>
                  </div>
                  <p className="text-[11.5px] text-[#0B2038] font-medium leading-tight">{f.desc}</p>
                </div>
              );
            })}
          </div>

          {/* In-app notice when build is in progress */}
          {downloadNotice && (
            <div className="p-4 rounded-2xl bg-teal-50 border border-teal-300 text-teal-950 text-xs font-semibold space-y-1 animate-in fade-in">
              <p className="font-bold text-[#008A8E] flex items-center gap-1.5">
                <span>🚀</span> App Release in Progress
              </p>
              <p className="text-[#0B2038] font-medium">
                The INDIA P.L. Customer App is in final staging. The official Google Play Store download link will activate automatically once the production release is finalized.
              </p>
            </div>
          )}

          {/* CTA Buttons */}
          <div className="pt-2 flex flex-col sm:flex-row items-center gap-3">
            <button
              onClick={handleDownloadClick}
              className="w-full sm:flex-1 py-3.5 px-6 rounded-full bg-[#008A8E] hover:bg-[#007377] text-white font-bold text-sm shadow-md hover:shadow-lg transition-all flex items-center justify-center gap-2.5 active:scale-98"
            >
              <Smartphone className="w-5 h-5" />
              <span>Download on Google Play</span>
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
            <p className="text-xs text-[#0B2038] font-bold">
              Currently serving Bhubaneswar, Cuttack &amp; expanding across Odisha.
            </p>
          </div>
        </div>
      </div>
    </div>
  );
};
