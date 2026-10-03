import React, { useState } from 'react';
import { Link } from 'react-router-dom';
import { IndiaPLLogo } from '../components/common/IndiaPLLogo';
import { AppDownloadModal } from '../components/modals/AppDownloadModal';
import {
  ArrowRight,
  ShieldCheck,
  Compass,
  MapPin,
  Clock,
  Star,
  Award,
  PhoneCall,
  Smartphone,
  ChevronRight,
  Check,
  Phone,
  Mail,
} from 'lucide-react';

export const PublicHomePage: React.FC = () => {
  const [downloadModalOpen, setDownloadModalOpen] = useState(false);
  const [selectedService, setSelectedService] = useState<string>('');

  const handleOpenDownload = (serviceName?: string) => {
    setSelectedService(serviceName || '');
    setDownloadModalOpen(true);
  };

  const handleGpsMatchingClick = (e: React.MouseEvent) => {
    e.preventDefault();
    handleOpenDownload('INDIA P.L. GPS Matching Engine');
  };

  const serviceHighlights = [
    {
      title: 'Residential Cleaning',
      desc: 'Clean Homes • Fresh Spaces • Happier Living',
      price: '₹297',
      img: 'https://images.unsplash.com/photo-1581578731548-c64695cc6952?auto=format&fit=crop&w=600&q=80',
      badge: 'Bestseller',
    },
    {
      title: 'Commercial & Office Cleaning',
      desc: 'Clean Workspaces • Better Productivity',
      price: '₹999',
      img: 'https://images.unsplash.com/photo-1613665813446-82a78c468a1d?auto=format&fit=crop&w=600&q=80',
      badge: 'Enterprise',
    },
    {
      title: 'Deep Cleaning',
      desc: 'Detailed Cleaning • Healthier Environment',
      price: '₹448',
      img: 'https://images.unsplash.com/photo-1527515637462-cff94eecc1ac?auto=format&fit=crop&w=600&q=80',
      badge: 'Popular',
    },
    {
      title: 'Kitchen & Bathroom Sanitization',
      desc: 'Anti-bacterial tile descaling & platform degreasing',
      price: '₹149',
      img: 'https://images.unsplash.com/photo-1584622781564-1d987f7333c1?auto=format&fit=crop&w=600&q=80',
      badge: 'Daily Care',
    },
  ];

  return (
    <div className="space-y-12 sm:space-y-16 pb-16">
      {/* Hero Section */}
      <section className="relative overflow-hidden pt-6 sm:pt-12 pb-10 sm:pb-16 bg-gradient-to-b from-[#E9F8F7] via-[#F4FBFB] to-white border-b border-[#DCEEEB]">
        {/* Soft background decor */}
        <div className="absolute top-0 right-1/4 w-96 h-96 bg-teal-200/25 rounded-full blur-3xl pointer-events-none" />
        <div className="absolute bottom-0 left-10 w-80 h-80 bg-cyan-100/35 rounded-full blur-2xl pointer-events-none" />

        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 relative">
          <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 lg:gap-8 xl:gap-12 items-center">
            {/* Left Content */}
            <div className="lg:col-span-7 space-y-6 text-center lg:text-left">
              {/* Trust Tag */}
              <div className="inline-flex items-center gap-2 px-3.5 py-1.5 rounded-full bg-white border border-[#CFEAE7] text-[#008A8E] text-xs font-bold shadow-2xs">
                <span className="w-2 h-2 rounded-full bg-[#008A8E] animate-pulse" />
                <span>Centralized Operations &amp; Workforce Platform</span>
              </div>

              {/* Main Headline: Line 1 dark navy in one line, Line 2 teal in one line without overlapping */}
              <h1 className="font-extrabold tracking-tight">
                <span className="text-2xl sm:text-3xl md:text-4xl lg:text-[30px] xl:text-[38px] 2xl:text-[46px] text-[#0B2038] block sm:whitespace-nowrap leading-tight">
                  Manage Customers, Bookings &amp;
                </span>
                <span className="text-2xl sm:text-3xl md:text-4xl lg:text-[30px] xl:text-[38px] 2xl:text-[46px] text-[#008A8E] block mt-1.5 sm:whitespace-nowrap leading-tight">
                  Service Professionals
                </span>
              </h1>

              {/* High-contrast Description */}
              <p className="text-base sm:text-lg text-[#3E556E] max-w-2xl mx-auto lg:mx-0 leading-relaxed font-normal">
                INDIA P.L. is an intelligent operations ecosystem engineered for on-demand home &amp;
                office services. Harness real-time Haversine GPS matching, background-verified pros,
                automated job dispatch, and granular operational control.
              </p>

              {/* CTA Buttons */}
              <div className="flex flex-col sm:flex-row items-center justify-center lg:justify-start gap-4 pt-1">
                <Link
                  to="/login"
                  className="w-full sm:w-auto inline-flex items-center justify-center gap-2.5 px-8 py-3.5 rounded-full bg-[#008A8E] hover:bg-[#007377] text-white font-bold text-sm shadow-md hover:shadow-lg transition-all active:scale-98"
                >
                  <span>Access Admin Dashboard</span>
                  <ArrowRight className="w-4 h-4" />
                </Link>

                <button
                  type="button"
                  onClick={handleGpsMatchingClick}
                  className="w-full sm:w-auto inline-flex items-center justify-center gap-2.5 px-7 py-3.5 rounded-full bg-white text-[#0B2038] font-bold text-sm border-2 border-[#DCEEEB] hover:border-teal-400 hover:bg-teal-50/50 transition-all shadow-2xs cursor-pointer active:scale-98"
                >
                  <Compass className="w-4 h-4 text-[#008A8E]" />
                  <span>How GPS Matching Works</span>
                </button>
              </div>

              {/* 4 Feature Badges: Full text visible with zero truncation (...) */}
              <div className="pt-4 grid grid-cols-2 lg:grid-cols-4 gap-2.5 w-full max-w-2xl mx-auto lg:mx-0">
                {[
                  { text: 'Trained Professionals', icon: Award },
                  { text: 'Safe & Hygienic', icon: ShieldCheck },
                  { text: 'Quality Assured', icon: Star },
                  { text: 'Flexible Scheduling', icon: Clock },
                ].map((item, i) => {
                  const Icon = item.icon;
                  return (
                    <div
                      key={i}
                      className="h-11 px-3 rounded-xl bg-white/95 border border-[#DCEEEB] flex items-center justify-center sm:justify-start gap-2 text-left shadow-2xs hover:border-teal-300 hover:shadow-xs transition-all"
                    >
                      <Icon className="w-4 h-4 text-[#008A8E] shrink-0" />
                      <span className="text-[11.5px] sm:text-xs font-bold text-[#0B2038] whitespace-nowrap">
                        {item.text}
                      </span>
                    </div>
                  );
                })}
              </div>
            </div>

            {/* Right-Side Operations Preview Card (Floating, Luminous Lighting & High-Contrast Dark Fonts) */}
            <div className="lg:col-span-5 flex justify-center lg:justify-end pt-2 pb-6">
              <div className="relative w-full max-w-[370px] sm:max-w-md animate-gentle-float">
                {/* Multi-layered Luminous Lighting Aura */}
                <div className="absolute -inset-2 rounded-[36px] bg-gradient-to-r from-teal-400/30 via-cyan-300/35 to-teal-500/30 blur-2xl opacity-75 pointer-events-none" />
                <div className="absolute -inset-0.5 rounded-[30px] bg-gradient-to-br from-teal-300/70 via-transparent to-cyan-300/70 opacity-80 pointer-events-none" />

                {/* Floating Preview Card Container */}
                <div className="relative bg-gradient-to-b from-white via-[#FCFEFE] to-[#F2FAF9] rounded-3xl p-5 sm:p-6 border-2 border-teal-300/90 shadow-[0_20px_50px_-15px_rgba(0,138,142,0.3),0_0_25px_rgba(45,212,191,0.2)] space-y-3.5 sm:space-y-4 z-10">
                  {/* Top Bar with Official Logo & Location */}
                  <div className="flex items-center justify-between pb-3.5 border-b border-teal-100">
                    <IndiaPLLogo size="sm" />
                    <div className="flex items-center gap-1.5 text-xs font-black text-[#044E51] bg-teal-100/90 px-3 py-1 rounded-full border border-teal-300 shadow-2xs">
                      <MapPin className="w-3.5 h-3.5 text-[#044E51]" />
                      <span>Bhubaneswar Hub</span>
                    </div>
                  </div>

                  {/* Active Booking Block with High-Contrast Dark Text */}
                  <div className="p-4 rounded-2xl bg-[#EAF8F6] border-2 border-teal-200/90 shadow-2xs space-y-2.5 relative">
                    <div className="flex items-center justify-between">
                      <div className="flex items-center gap-2">
                        <span className="text-xs font-black text-[#0B2038]">Booking #1001</span>
                        <span className="text-[10px] font-black px-2.5 py-0.5 rounded-full bg-teal-200/90 text-[#044E51] border border-teal-400/60">
                          Residential Cleaning
                        </span>
                      </div>
                      <span className="text-xs font-black px-2.5 py-0.5 rounded-full bg-emerald-200 text-[#064E3B] border border-emerald-400 shadow-2xs">
                        Accepted
                      </span>
                    </div>

                    <div className="flex items-center gap-3 pt-1">
                      <img
                        src="https://images.unsplash.com/photo-1506794778202-cad84cf45f1d?auto=format&fit=crop&w=256&q=80"
                        alt="Ramesh Kumar"
                        className="w-11 h-11 rounded-xl object-cover border-2 border-[#008A8E] shadow-sm"
                      />
                      <div className="flex-1 min-w-0">
                        <p className="text-sm font-black text-[#0B2038]">Ramesh Kumar</p>
                        <p className="text-xs text-[#0B2038] font-bold truncate">
                          Cleaning Specialist • 2.3 km away
                        </p>
                      </div>
                      <div className="text-right shrink-0">
                        <span className="text-base font-black text-[#006669]">₹297</span>
                        <p className="text-[11px] font-black text-[#0B2038]">Patia, BBS</p>
                      </div>
                    </div>
                  </div>

                  {/* Status Indicators Strip */}
                  <div className="p-3.5 rounded-2xl bg-teal-100/90 border border-teal-300 flex items-center justify-between text-xs shadow-2xs">
                    <div className="flex items-center gap-2">
                      <Compass className="w-4 h-4 text-[#044E51] animate-spin" />
                      <span className="font-black text-[#044E51]">
                        GPS Matching Active
                      </span>
                    </div>
                    <span className="text-xs font-black text-[#044E51] bg-white px-2.5 py-1 rounded-full border border-teal-300 shadow-2xs">
                      Haversine OK
                    </span>
                  </div>
                </div>

                {/* Layered Floating Status Badge with Lighting */}
                <div className="absolute -bottom-4 -left-4 bg-white rounded-2xl p-3.5 border-2 border-teal-300 shadow-[0_10px_30px_rgba(0,138,142,0.35)] flex items-center gap-3 z-20">
                  <div className="w-9 h-9 rounded-xl bg-[#008A8E] text-white flex items-center justify-center font-black text-sm shadow-xs">
                    ✓
                  </div>
                  <div>
                    <span className="text-xs font-black text-[#0B2038] block">32 Active Pros</span>
                    <span className="text-xs text-[#0B2038] font-bold">Ready in Bhubaneswar</span>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Services Grid (Compact top spacing, no redundant badge) */}
      <section id="services" className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 pt-2">
        <div className="text-center max-w-3xl mx-auto mb-10">
          <h2 className="text-2xl sm:text-3xl font-extrabold text-[#0B2038]">
            Popular Doorstep Services Managed by INDIA P.L.
          </h2>
          <p className="text-sm text-[#3E556E] mt-2">
            Standardized catalog with per-session pricing, verified tools, and flexible scheduling.
          </p>
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
          {serviceHighlights.map((srv, i) => (
            <div
              key={i}
              onClick={() => handleOpenDownload(srv.title)}
              className="bg-white rounded-3xl border border-[#DCEEEB] shadow-sm hover:shadow-md hover:border-teal-300 transition-all overflow-hidden flex flex-col group cursor-pointer"
            >
              <div className="relative h-44 overflow-hidden">
                <img
                  src={srv.img}
                  alt={srv.title}
                  className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-300"
                />
                <span className="absolute top-3 left-3 px-2.5 py-1 rounded-full bg-white/95 text-[#008A8E] text-[11px] font-bold shadow-sm">
                  {srv.badge}
                </span>
                <span className="absolute bottom-3 right-3 px-3 py-1 rounded-full bg-[#008A8E] text-white text-xs font-bold shadow-md">
                  Starting {srv.price}
                </span>
              </div>
              <div className="p-5 flex-1 flex flex-col justify-between">
                <div>
                  <h3 className="text-base font-bold text-[#0B2038] group-hover:text-[#008A8E] transition-colors">
                    {srv.title}
                  </h3>
                  <p className="text-xs text-[#3E556E] mt-1.5 leading-relaxed">{srv.desc}</p>
                </div>
                <div className="mt-4 pt-3 border-t border-slate-100 flex items-center justify-between">
                  <span className="text-xs font-bold text-[#008A8E] flex items-center gap-1 group-hover:translate-x-0.5 transition-transform">
                    Book in App <ChevronRight className="w-3.5 h-3.5" />
                  </span>
                  <span className="text-[11px] font-semibold text-slate-400">Fixed rate</span>
                </div>
              </div>
            </div>
          ))}
        </div>
      </section>

      {/* How GPS Matching Works (Compact & Clean) */}
      <section id="how-it-works" className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="bg-gradient-to-br from-[#E6F7F5] to-white rounded-3xl p-6 sm:p-10 border border-[#CFEAE7] shadow-xs">
          <div className="max-w-2xl mb-8">
            <span className="text-xs font-bold uppercase tracking-wider text-[#008A8E]">
              Automated Dispatch Logic
            </span>
            <h2 className="text-2xl sm:text-3xl font-extrabold text-[#0B2038] mt-1">
              How the Automatic GPS Worker Assignment Operates
            </h2>
            <p className="text-sm text-[#3E556E] mt-2">
              Zero manual bottleneck. The system matches the nearest available, background-verified
              professional with instant fallback cascading.
            </p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-4 gap-5">
            {[
              {
                step: '01',
                title: 'Customer Booking',
                desc: 'Customer books service in Bhubaneswar app with precise GPS coordinates.',
                icon: Smartphone,
              },
              {
                step: '02',
                title: 'Haversine Radius Filter',
                desc: 'System filters verified, active pros with service capability and sorts by distance.',
                icon: Compass,
              },
              {
                step: '03',
                title: 'Instant Job Dispatch',
                desc: 'Nearest pro receives prompt. Pro has 2 minutes to Accept or Decline.',
                icon: PhoneCall,
              },
              {
                step: '04',
                title: 'Auto-Cascade Reassignment',
                desc: 'If declined, request automatically cascades to the 2nd nearest pro immediately.',
                icon: ShieldCheck,
              },
            ].map((st, i) => {
              const Icon = st.icon;
              return (
                <div
                  key={i}
                  className="bg-white rounded-2xl p-5 border border-[#DCEEEB] shadow-2xs hover:shadow-sm hover:border-teal-300 transition-all flex flex-col justify-between"
                >
                  <div>
                    <div className="flex items-center justify-between mb-3">
                      <span className="text-xl font-black text-[#008A8E] leading-none">
                        {st.step}
                      </span>
                      <div className="w-9 h-9 rounded-xl bg-teal-50 flex items-center justify-center text-[#008A8E]">
                        <Icon className="w-4 h-4" />
                      </div>
                    </div>
                    <h4 className="text-sm font-bold text-[#0B2038]">{st.title}</h4>
                    <p className="text-xs text-[#3E556E] mt-1.5 leading-relaxed">{st.desc}</p>
                  </div>
                </div>
              );
            })}
          </div>
        </div>
      </section>

      {/* About Section */}
      <section id="about" className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-10 lg:gap-12 items-center">
          <div className="space-y-5">
            <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-teal-50 text-[#008A8E] text-xs font-bold border border-teal-200">
              <ShieldCheck className="w-3.5 h-3.5" />
              <span>About INDIA P.L.</span>
            </div>
            <h2 className="text-3xl font-extrabold text-[#0B2038] tracking-tight">
              Trusted Services. Better Tomorrow.
            </h2>
            <p className="text-sm text-[#3E556E] leading-relaxed">
              INDIA P.L. was founded to transform the Indian informal service workforce into respected,
              fairly compensated micro-entrepreneurs. Our platform combines deep background verification,
              skills training, and cutting-edge logistics to deliver impeccable service at transparent rates.
            </p>
            <div className="space-y-3 pt-2">
              {[
                'Strict Aadhaar & Police verification for every professional',
                'Transparent pricing with zero hidden surcharges',
                'Specialized high-density operational hubs in Odisha and nationwide',
                'Enterprise-grade operations and dispatch suite for dispatchers',
              ].map((item, idx) => (
                <div key={idx} className="flex items-center gap-2.5 text-xs text-[#0B2038] font-bold">
                  <div className="w-4 h-4 rounded-full bg-teal-100 text-[#008A8E] flex items-center justify-center shrink-0">
                    <Check className="w-3 h-3 stroke-[3]" />
                  </div>
                  <span>{item}</span>
                </div>
              ))}
            </div>
          </div>

          <div className="relative">
            <div className="rounded-3xl overflow-hidden border-2 border-[#DCEEEB] shadow-xl">
              <img
                src="https://images.unsplash.com/photo-1600585154340-be6161a56a0c?auto=format&fit=crop&w=800&q=80"
                alt="Service Operations Team"
                className="w-full h-80 object-cover"
              />
            </div>
            <div className="absolute -bottom-6 -right-4 bg-white p-4 rounded-2xl border border-teal-200 shadow-xl max-w-xs">
              <p className="text-xs font-bold text-[#0B2038]">Operational Headquarters</p>
              <p className="text-[11px] text-[#3E556E] mt-0.5 font-medium">
                Patia &amp; Saheed Nagar, Bhubaneswar, Odisha - 751024
              </p>
            </div>
          </div>
        </div>
      </section>

      {/* Dedicated Contact Section */}
      <section id="contact" className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="bg-white rounded-3xl p-8 sm:p-10 border border-[#DCEEEB] shadow-sm space-y-8">
          <div className="text-center max-w-2xl mx-auto">
            <h2 className="text-2xl sm:text-3xl font-extrabold text-[#0B2038]">
              Contact the Operations Desk
            </h2>
            <p className="text-sm text-[#3E556E] mt-2">
              Have questions about service coverage, enterprise bookings, or service professional onboarding? 
              Connect with our live Bhubaneswar team.
            </p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
            {/* Phone Card */}
            <div className="p-6 rounded-2xl bg-[#F4FBFB] border border-[#DCEEEB] flex flex-col justify-between">
              <div>
                <div className="w-10 h-10 rounded-xl bg-teal-100 flex items-center justify-center text-[#008A8E] mb-4">
                  <Phone className="w-5 h-5" />
                </div>
                <h4 className="text-sm font-bold text-[#0B2038]">Phone &amp; Helpline</h4>
                <p className="text-xs text-[#3E556E] mt-1">Available 8:00 AM – 8:00 PM daily for customers &amp; partners.</p>
              </div>
              <div className="mt-4 pt-3 border-t border-slate-200/60">
                <a
                  href="tel:+919876543210"
                  className="text-sm font-extrabold text-[#008A8E] hover:underline"
                >
                  +91 98765 43210
                </a>
                <p className="text-[11px] text-slate-400">Toll-free: 1800-INDIA-PL</p>
              </div>
            </div>

            {/* Email Card */}
            <div className="p-6 rounded-2xl bg-[#F4FBFB] border border-[#DCEEEB] flex flex-col justify-between">
              <div>
                <div className="w-10 h-10 rounded-xl bg-teal-100 flex items-center justify-center text-[#008A8E] mb-4">
                  <Mail className="w-5 h-5" />
                </div>
                <h4 className="text-sm font-bold text-[#0B2038]">Support &amp; Inquiries</h4>
                <p className="text-xs text-[#3E556E] mt-1">Send us inquiries regarding operations, invoicing, or compliance.</p>
              </div>
              <div className="mt-4 pt-3 border-t border-slate-200/60">
                <a
                  href="mailto:support@indiapl.com"
                  className="text-sm font-extrabold text-[#008A8E] hover:underline"
                >
                  support@indiapl.com
                </a>
                <p className="text-[11px] text-slate-400">Avg. response: &lt; 2 hours</p>
              </div>
            </div>

            {/* Office Hub Card */}
            <div className="p-6 rounded-2xl bg-[#F4FBFB] border border-[#DCEEEB] flex flex-col justify-between">
              <div>
                <div className="w-10 h-10 rounded-xl bg-teal-100 flex items-center justify-center text-[#008A8E] mb-4">
                  <MapPin className="w-5 h-5" />
                </div>
                <h4 className="text-sm font-bold text-[#0B2038]">Central Operations Hub</h4>
                <p className="text-xs text-[#3E556E] mt-1">Patia &amp; Saheed Nagar, Bhubaneswar, Odisha, India - 751024</p>
              </div>
              <div className="mt-4 pt-3 border-t border-slate-200/60">
                <span className="text-xs font-bold text-[#0B2038]">High Density Hub #1</span>
                <p className="text-[11px] text-[#008A8E] font-semibold">Bhubaneswar-Cuttack Region</p>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Admin Portal CTA Banner */}
      <section className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="rounded-3xl bg-gradient-to-r from-[#008A8E] to-[#007377] p-8 sm:p-12 text-white shadow-xl flex flex-col md:flex-row items-center justify-between gap-6">
          <div className="space-y-2 text-center md:text-left">
            <span className="text-xs font-bold uppercase tracking-wider text-teal-200">
              Operations Control Center
            </span>
            <h3 className="text-2xl sm:text-3xl font-extrabold">
              Ready to manage live operations?
            </h3>
            <p className="text-xs sm:text-sm text-teal-100 max-w-xl">
              Monitor active bookings, dispatch nearest workers, approve new service pros, and inspect
              GMV metrics in real-time.
            </p>
          </div>
          <Link
            to="/login"
            className="px-8 py-3.5 rounded-full bg-white text-[#008A8E] font-bold text-sm hover:bg-teal-50 transition-all shadow-md shrink-0 active:scale-98"
          >
            Launch Admin Dashboard →
          </Link>
        </div>
      </section>

      {/* Download App Modal */}
      <AppDownloadModal
        isOpen={downloadModalOpen}
        onClose={() => setDownloadModalOpen(false)}
        serviceName={selectedService}
      />
    </div>
  );
};
