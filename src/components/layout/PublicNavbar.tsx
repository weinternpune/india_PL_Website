import React, { useState } from 'react';
import { Link, useLocation } from 'react-router-dom';
import { IndiaPLLogo } from '../common/IndiaPLLogo';
import { Menu, X, ArrowRight, ShieldCheck } from 'lucide-react';

export const PublicNavbar: React.FC = () => {
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);
  const location = useLocation();

  const navLinks = [
    { name: 'Home', href: '/' },
    { name: 'About', href: '/#about' },
    { name: 'Services', href: '/#services' },
    { name: 'Contact', href: '/#contact' },
  ];

  return (
    <header className="sticky top-0 z-50 bg-white/95 backdrop-blur-md border-b border-[#DCEEEB]">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex items-center justify-between h-20">
          {/* Logo */}
          <Link to="/" className="flex items-center">
            <IndiaPLLogo size="md" />
          </Link>

          {/* Desktop Nav Items */}
          <nav className="hidden md:flex items-center space-x-8">
            {navLinks.map((link) => (
              <a
                key={link.name}
                href={link.href}
                className="text-sm font-semibold text-[#0B2038] hover:text-[#009E9B] transition-colors"
              >
                {link.name}
              </a>
            ))}
          </nav>

          {/* Right Action Buttons */}
          <div className="hidden md:flex items-center space-x-4">
            <Link
              to="/login"
              className="text-sm font-semibold text-[#009E9B] hover:text-[#00827F] px-4 py-2 rounded-full hover:bg-teal-50/60 transition-all border border-transparent hover:border-teal-200"
            >
              Log In
            </Link>
            <Link
              to="/login"
              className="inline-flex items-center gap-2 bg-[#009E9B] text-white text-sm font-semibold px-5 py-2.5 rounded-full hover:bg-[#008784] shadow-sm hover:shadow-md transition-all active:scale-98"
            >
              <span>Admin Portal</span>
              <ArrowRight className="w-4 h-4" />
            </Link>
          </div>

          {/* Mobile menu button */}
          <div className="flex md:hidden">
            <button
              onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
              className="p-2 rounded-lg text-slate-700 hover:text-[#009E9B] hover:bg-teal-50"
            >
              {mobileMenuOpen ? <X className="w-6 h-6" /> : <Menu className="w-6 h-6" />}
            </button>
          </div>
        </div>
      </div>

      {/* Mobile menu dropdown */}
      {mobileMenuOpen && (
        <div className="md:hidden bg-white border-b border-[#DCEEEB] px-4 pt-3 pb-6 space-y-3">
          {navLinks.map((link) => (
            <a
              key={link.name}
              href={link.href}
              onClick={() => setMobileMenuOpen(false)}
              className="block px-3 py-2 rounded-lg text-base font-medium text-[#0B2038] hover:bg-teal-50 hover:text-[#009E9B]"
            >
              {link.name}
            </a>
          ))}
          <div className="pt-3 border-t border-slate-100 flex flex-col gap-2.5">
            <Link
              to="/login"
              onClick={() => setMobileMenuOpen(false)}
              className="w-full text-center py-2.5 text-sm font-semibold text-[#009E9B] bg-teal-50 rounded-full"
            >
              Log In
            </Link>
            <Link
              to="/login"
              onClick={() => setMobileMenuOpen(false)}
              className="w-full text-center py-2.5 text-sm font-semibold text-white bg-[#009E9B] rounded-full shadow-sm"
            >
              Admin Dashboard
            </Link>
          </div>
        </div>
      )}
    </header>
  );
};
