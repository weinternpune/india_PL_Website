import React from 'react';
import { Link } from 'react-router-dom';
import { IndiaPLLogo } from '../common/IndiaPLLogo';
import { ShieldCheck, MapPin, Radio, Activity } from 'lucide-react';

export const AdminFooter: React.FC = () => {
  return (
    <footer className="bg-white border-t border-[#DCEEEB] mt-auto">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        <div className="flex flex-col md:flex-row items-center justify-between gap-4">
          <div className="flex items-center gap-4">
            <IndiaPLLogo variant="admin" size="sm" />
            <span className="hidden sm:inline text-xs text-[#5B738B] border-l border-slate-200 pl-4">
              Centralized Workforce, Real-time Dispatch & Operations Portal
            </span>
          </div>

          <div className="flex flex-wrap items-center gap-4 text-xs font-semibold text-[#5B738B]">
            <Link to="/admin/dashboard" className="hover:text-[#009E9B] transition-colors">
              Dashboard
            </Link>
            <Link to="/admin/bookings" className="hover:text-[#009E9B] transition-colors">
              Bookings
            </Link>
            <Link to="/admin/workers" className="hover:text-[#009E9B] transition-colors">
              Workers
            </Link>
            <Link to="/admin/customers" className="hover:text-[#009E9B] transition-colors">
              Customers
            </Link>
            <Link to="/admin/services" className="hover:text-[#009E9B] transition-colors">
              Services
            </Link>
            <Link to="/admin/payouts" className="hover:text-[#009E9B] transition-colors">
              Payouts
            </Link>
          </div>
        </div>

        <div className="mt-6 pt-6 border-t border-slate-100 flex flex-col sm:flex-row items-center justify-between gap-3 text-xs text-[#5B738B]">
          <div className="flex items-center gap-2">
            <span className="inline-block w-2 h-2 rounded-full bg-emerald-500 animate-pulse" />
            <span>Operations Hub: Patia & Saheed Nagar, Bhubaneswar • System Status: Nominal</span>
          </div>
          <p>© {new Date().getFullYear()} INDIA P.L. Admin & Operations Portal. Built for high-scale service dispatch.</p>
        </div>
      </div>
    </footer>
  );
};
