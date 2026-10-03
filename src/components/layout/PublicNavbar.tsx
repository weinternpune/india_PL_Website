import React, { useState } from 'react';
import { Link, useLocation, useNavigate } from 'react-router-dom';
import { IndiaPLLogo } from '../common/IndiaPLLogo';
import { Menu, X, ArrowRight } from 'lucide-react';

export const PublicNavbar: React.FC = () => {
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);
  const location = useLocation();
  const navigate = useNavigate();

  const navLinks = [
    { name: 'Home', href: '/' },
    { name: 'About', href: '/#about' },
    { name: 'Services', href: '/#services' },
    { name: 'Contact', href: '/#contact' },
  ];

  const handleNavClick = (e: React.MouseEvent<HTMLAnchorElement>, href: string) => {
    if (href.startsWith('/#')) {
      const targetId = href.replace('/#', '');
      if (location.pathname === '/') {
        e.preventDefault();
        const element = document.getElementById(targetId);
        if (element) {
          element.scrollIntoView({ behavior: 'smooth' });
        }
      } else {
        // Navigate to home with hash
        navigate(href);
      }
    }
    setMobileMenuOpen(false);
  };

  return (
    <header className="sticky top-0 z-50 bg-white/95 backdrop-blur-md border-b border-[#DCEEEB] shadow-2xs">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex items-center justify-between h-20">
          {/* Logo with official emblem */}
          <Link to="/" className="flex items-center transition-opacity hover:opacity-95">
            <IndiaPLLogo size="md" />
          </Link>

          {/* Desktop Nav Items */}
          <nav className="hidden md:flex items-center space-x-9">
            {navLinks.map((link) => (
              <a
                key={link.name}
                href={link.href}
                onClick={(e) => handleNavClick(e, link.href)}
                className="text-sm font-bold text-[#0B2038] hover:text-[#009E9B] transition-colors cursor-pointer"
              >
                {link.name}
              </a>
            ))}
          </nav>

          {/* Right Action Buttons */}
          <div className="hidden md:flex items-center space-x-3.5">
            <Link
              to="/login"
              className="text-sm font-bold text-[#0B2038] hover:text-[#009E9B] px-4 py-2.5 rounded-full hover:bg-teal-50/70 transition-all border border-transparent hover:border-teal-200"
            >
              Log In
            </Link>
            <Link
              to="/login"
              className="inline-flex items-center gap-2 bg-[#009E9B] text-white text-sm font-bold px-5 py-2.5 rounded-full hover:bg-[#008784] shadow-sm hover:shadow-md transition-all active:scale-98"
            >
              <span>Admin Portal</span>
              <ArrowRight className="w-4 h-4" />
            </Link>
          </div>

          {/* Mobile menu button */}
          <div className="flex md:hidden">
            <button
              onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
              className="p-2 rounded-xl text-[#0B2038] hover:text-[#009E9B] hover:bg-teal-50 transition-colors"
              aria-label="Toggle navigation menu"
            >
              {mobileMenuOpen ? <X className="w-6 h-6" /> : <Menu className="w-6 h-6" />}
            </button>
          </div>
        </div>
      </div>

      {/* Mobile menu dropdown */}
      {mobileMenuOpen && (
        <div className="md:hidden bg-white border-b border-[#DCEEEB] px-4 pt-3 pb-6 space-y-3 shadow-lg">
          {navLinks.map((link) => (
            <a
              key={link.name}
              href={link.href}
              onClick={(e) => handleNavClick(e, link.href)}
              className="block px-3 py-2.5 rounded-xl text-base font-bold text-[#0B2038] hover:bg-teal-50 hover:text-[#009E9B] transition-colors"
            >
              {link.name}
            </a>
          ))}
          <div className="pt-3 border-t border-slate-100 flex flex-col gap-2.5">
            <Link
              to="/login"
              onClick={() => setMobileMenuOpen(false)}
              className="w-full text-center py-3 text-sm font-bold text-[#0B2038] bg-teal-50/80 hover:bg-teal-100/60 rounded-full transition-colors"
            >
              Log In
            </Link>
            <Link
              to="/login"
              onClick={() => setMobileMenuOpen(false)}
              className="w-full inline-flex items-center justify-center gap-2 py-3 text-sm font-bold text-white bg-[#009E9B] hover:bg-[#008784] rounded-full shadow-sm transition-colors"
            >
              <span>Admin Portal</span>
              <ArrowRight className="w-4 h-4" />
            </Link>
          </div>
        </div>
      )}
    </header>
  );
};
