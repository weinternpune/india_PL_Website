import React from 'react';
import { Link } from 'react-router-dom';
import { IndiaPLLogo } from '../common/IndiaPLLogo';
import { ShieldCheck, MapPin, Phone, Mail, Heart } from 'lucide-react';

export const PublicFooter: React.FC = () => {
  return (
    <footer className="bg-white border-t border-[#DCEEEB] mt-auto">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 pt-12 pb-8">
        <div className="grid grid-cols-1 md:grid-cols-4 gap-8 mb-12">
          {/* Col 1: Branding & Intro */}
          <div className="space-y-4 md:col-span-1">
            <IndiaPLLogo size="md" />
            <p className="text-sm text-[#5B738B] leading-relaxed">
              Empowering thousands of trained Indian service professionals while delivering 
              safe, verified, and quality doorstep services to homes and offices.
            </p>
            <div className="inline-flex items-center gap-2 text-xs font-semibold text-[#009E9B] bg-teal-50 px-3 py-1.5 rounded-full border border-teal-200">
              <ShieldCheck className="w-4 h-4" />
              <span>100% Background Verified Pros</span>
            </div>
          </div>

          {/* Col 2: Navigation */}
          <div>
            <h3 className="text-xs font-bold text-[#0B2038] uppercase tracking-wider mb-4">
              Platform
            </h3>
            <ul className="space-y-2.5 text-sm text-[#5B738B]">
              <li>
                <Link to="/" className="hover:text-[#009E9B] transition-colors">
                  Home
                </Link>
              </li>
              <li>
                <a href="/#about" className="hover:text-[#009E9B] transition-colors">
                  About Us
                </a>
              </li>
              <li>
                <a href="/#services" className="hover:text-[#009E9B] transition-colors">
                  Services Catalog
                </a>
              </li>
              <li>
                <Link to="/login" className="hover:text-[#009E9B] transition-colors font-semibold text-[#009E9B]">
                  Admin & Operations Portal
                </Link>
              </li>
            </ul>
          </div>

          {/* Col 3: Services */}
          <div>
            <h3 className="text-xs font-bold text-[#0B2038] uppercase tracking-wider mb-4">
              Cleaning & Care
            </h3>
            <ul className="space-y-2.5 text-sm text-[#5B738B]">
              <li>
                <span className="hover:text-[#009E9B] cursor-default">Residential Cleaning</span>
              </li>
              <li>
                <span className="hover:text-[#009E9B] cursor-default">Commercial & Office Cleaning</span>
              </li>
              <li>
                <span className="hover:text-[#009E9B] cursor-default">Industrial Deep Clean</span>
              </li>
              <li>
                <span className="hover:text-[#009E9B] cursor-default">Kitchen & Bathroom Sanitization</span>
              </li>
              <li>
                <span className="hover:text-[#009E9B] cursor-default">Housekeeping & Manpower</span>
              </li>
            </ul>
          </div>

          {/* Col 4: Contact & Operations Hub */}
          <div>
            <h3 className="text-xs font-bold text-[#0B2038] uppercase tracking-wider mb-4">
              Contact & Hub
            </h3>
            <ul className="space-y-3 text-sm text-[#5B738B]">
              <li className="flex items-start gap-2.5">
                <MapPin className="w-4 h-4 text-[#009E9B] shrink-0 mt-0.5" />
                <span>Patia & Saheed Nagar, Bhubaneswar, Odisha, India - 751024</span>
              </li>
              <li className="flex items-center gap-2.5">
                <Phone className="w-4 h-4 text-[#009E9B] shrink-0" />
                <span>+91 98765 43210 / 1800-INDIA-PL</span>
              </li>
              <li className="flex items-center gap-2.5">
                <Mail className="w-4 h-4 text-[#009E9B] shrink-0" />
                <span>support@indiapl.com</span>
              </li>
            </ul>
          </div>
        </div>

        {/* Bottom Bar */}
        <div className="pt-8 border-t border-[#E1F1F0] flex flex-col md:flex-row items-center justify-between gap-4 text-xs text-[#5B738B]">
          <p>© {new Date().getFullYear()} INDIA P.L. All rights reserved. Trusted Services. Better Tomorrow.</p>
          <div className="flex items-center space-x-6">
            <a href="#privacy" className="hover:text-[#009E9B] transition-colors">
              Privacy Policy
            </a>
            <a href="#terms" className="hover:text-[#009E9B] transition-colors">
              Terms & Conditions
            </a>
            <a href="#security" className="hover:text-[#009E9B] transition-colors">
              Security & Compliance
            </a>
          </div>
        </div>
      </div>
    </footer>
  );
};
