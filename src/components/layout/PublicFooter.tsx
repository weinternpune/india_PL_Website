import React from 'react';
import { Link } from 'react-router-dom';
import { IndiaPLLogo } from '../common/IndiaPLLogo';
import { ShieldCheck, MapPin, Phone, Mail, Award, CheckCircle } from 'lucide-react';

export const PublicFooter: React.FC = () => {
  const currentYear = new Date().getFullYear();

  const handleNavClick = (e: React.MouseEvent<HTMLAnchorElement>, hash: string) => {
    if (window.location.pathname === '/') {
      e.preventDefault();
      const el = document.getElementById(hash);
      if (el) {
        el.scrollIntoView({ behavior: 'smooth' });
      }
    }
  };

  return (
    <footer className="bg-[#071524] text-slate-200 border-t border-[#132A44] mt-auto">
      {/* Trust Badges Strip */}
      <div className="border-b border-[#142B45] bg-[#0A1D32]/80 py-5">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="grid grid-cols-1 sm:grid-cols-3 gap-4 text-center sm:text-left">
            <div className="flex items-center justify-center sm:justify-start gap-3">
              <div className="w-9 h-9 rounded-xl bg-teal-500/15 border border-teal-500/30 flex items-center justify-center text-teal-400 shrink-0">
                <ShieldCheck className="w-5 h-5" />
              </div>
              <div>
                <h4 className="text-xs font-bold text-white tracking-wide">100% Background Verified</h4>
                <p className="text-[11px] text-slate-400">Aadhaar & Police verified professionals</p>
              </div>
            </div>

            <div className="flex items-center justify-center sm:justify-start gap-3">
              <div className="w-9 h-9 rounded-xl bg-teal-500/15 border border-teal-500/30 flex items-center justify-center text-teal-400 shrink-0">
                <Award className="w-5 h-5" />
              </div>
              <div>
                <h4 className="text-xs font-bold text-white tracking-wide">Standardized Quality</h4>
                <p className="text-[11px] text-slate-400">ISO-grade hygiene standards & equipment</p>
              </div>
            </div>

            <div className="flex items-center justify-center sm:justify-start gap-3">
              <div className="w-9 h-9 rounded-xl bg-teal-500/15 border border-teal-500/30 flex items-center justify-center text-teal-400 shrink-0">
                <CheckCircle className="w-5 h-5" />
              </div>
              <div>
                <h4 className="text-xs font-bold text-white tracking-wide">Safe Doorstep Guarantee</h4>
                <p className="text-[11px] text-slate-400">Transparent per-session billing</p>
              </div>
            </div>
          </div>
        </div>
      </div>

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 pt-12 pb-8">
        <div className="grid grid-cols-1 md:grid-cols-4 gap-10 mb-12">
          {/* Col 1: Branding & Intro */}
          <div className="space-y-4 md:col-span-1">
            <IndiaPLLogo variant="white" size="md" />
            <p className="text-xs sm:text-sm text-slate-300 leading-relaxed pt-1">
              Empowering thousands of trained Indian service professionals while delivering 
              safe, verified, and quality doorstep services to homes and enterprises across India.
            </p>
            <div className="pt-2">
              <div className="inline-flex items-center gap-2 text-xs font-bold text-teal-300 bg-teal-950/60 px-3.5 py-1.5 rounded-full border border-teal-500/30">
                <span className="w-2 h-2 rounded-full bg-teal-400 animate-pulse" />
                <span>Centralized Operations & Workforce Hub</span>
              </div>
            </div>
          </div>

          {/* Col 2: Navigation */}
          <div>
            <h3 className="text-xs font-extrabold text-white uppercase tracking-wider mb-4 pb-1 border-b border-slate-800">
              Platform
            </h3>
            <ul className="space-y-2.5 text-xs sm:text-sm text-slate-300 font-medium">
              <li>
                <Link to="/" className="hover:text-teal-400 transition-colors">
                  Home
                </Link>
              </li>
              <li>
                <a
                  href="/#about"
                  onClick={(e) => handleNavClick(e, 'about')}
                  className="hover:text-teal-400 transition-colors cursor-pointer"
                >
                  About Us
                </a>
              </li>
              <li>
                <a
                  href="/#services"
                  onClick={(e) => handleNavClick(e, 'services')}
                  className="hover:text-teal-400 transition-colors cursor-pointer"
                >
                  Services Catalog
                </a>
              </li>
              <li>
                <a
                  href="/#how-it-works"
                  onClick={(e) => handleNavClick(e, 'how-it-works')}
                  className="hover:text-teal-400 transition-colors cursor-pointer"
                >
                  GPS Dispatch Logic
                </a>
              </li>
              <li>
                <Link
                  to="/login"
                  className="hover:text-teal-300 text-teal-400 font-bold transition-colors inline-flex items-center gap-1.5"
                >
                  <span>Admin & Ops Portal</span>
                  <span className="text-xs">→</span>
                </Link>
              </li>
            </ul>
          </div>

          {/* Col 3: Services */}
          <div>
            <h3 className="text-xs font-extrabold text-white uppercase tracking-wider mb-4 pb-1 border-b border-slate-800">
              Cleaning & Services
            </h3>
            <ul className="space-y-2.5 text-xs sm:text-sm text-slate-300 font-medium">
              <li>
                <a
                  href="/#services"
                  onClick={(e) => handleNavClick(e, 'services')}
                  className="hover:text-teal-400 transition-colors"
                >
                  Residential Cleaning
                </a>
              </li>
              <li>
                <a
                  href="/#services"
                  onClick={(e) => handleNavClick(e, 'services')}
                  className="hover:text-teal-400 transition-colors"
                >
                  Commercial & Office Cleaning
                </a>
              </li>
              <li>
                <a
                  href="/#services"
                  onClick={(e) => handleNavClick(e, 'services')}
                  className="hover:text-teal-400 transition-colors"
                >
                  Industrial Deep Clean
                </a>
              </li>
              <li>
                <a
                  href="/#services"
                  onClick={(e) => handleNavClick(e, 'services')}
                  className="hover:text-teal-400 transition-colors"
                >
                  Kitchen & Bathroom Sanitization
                </a>
              </li>
              <li>
                <a
                  href="/#services"
                  onClick={(e) => handleNavClick(e, 'services')}
                  className="hover:text-teal-400 transition-colors"
                >
                  Housekeeping & Manpower
                </a>
              </li>
            </ul>
          </div>

          {/* Col 4: Contact & Operations Hub */}
          <div>
            <h3 className="text-xs font-extrabold text-white uppercase tracking-wider mb-4 pb-1 border-b border-slate-800">
              Operations & Support Hub
            </h3>
            <ul className="space-y-3.5 text-xs sm:text-sm text-slate-300 font-medium">
              <li className="flex items-start gap-3">
                <MapPin className="w-4 h-4 text-teal-400 shrink-0 mt-0.5" />
                <span className="leading-tight">
                  Patia & Saheed Nagar, Bhubaneswar, Odisha, India - 751024
                </span>
              </li>
              <li className="flex items-center gap-3">
                <Phone className="w-4 h-4 text-teal-400 shrink-0" />
                <a href="tel:+919876543210" className="hover:text-teal-400 transition-colors">
                  +91 98765 43210 / 1800-INDIA-PL
                </a>
              </li>
              <li className="flex items-center gap-3">
                <Mail className="w-4 h-4 text-teal-400 shrink-0" />
                <a href="mailto:support@indiapl.com" className="hover:text-teal-400 transition-colors">
                  support@indiapl.com
                </a>
              </li>
            </ul>
          </div>
        </div>

        {/* Bottom Bar */}
        <div className="pt-8 border-t border-[#132A44] flex flex-col md:flex-row items-center justify-between gap-4 text-xs text-slate-400">
          <p>© {currentYear} INDIA P.L. All rights reserved. Trusted Services. Better Tomorrow.</p>
          <div className="flex items-center space-x-6">
            <a href="#privacy" className="hover:text-teal-400 transition-colors">
              Privacy Policy
            </a>
            <a href="#terms" className="hover:text-teal-400 transition-colors">
              Terms & Conditions
            </a>
            <a href="#security" className="hover:text-teal-400 transition-colors">
              Security & Compliance
            </a>
          </div>
        </div>
      </div>
    </footer>
  );
};
