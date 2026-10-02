import React from 'react';
import { Link } from 'react-router-dom';
import { IndiaPLLogo } from '../components/common/IndiaPLLogo';
import {
  ArrowRight,
  ShieldCheck,
  Compass,
  Users2,
  CalendarCheck2,
  CheckCircle2,
  Sparkles,
  MapPin,
  Clock,
  Star,
  Award,
  PhoneCall,
  Smartphone,
  ChevronRight,
  Check,
} from 'lucide-react';

export const PublicHomePage: React.FC = () => {
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
    <div className="space-y-16 sm:space-y-24 pb-16">
      {/* Hero Section */}
      <section className="relative overflow-hidden pt-8 sm:pt-14 pb-12 sm:pb-20 bg-gradient-to-b from-[#E9F8F7] via-[#F4FBFB] to-white border-b border-[#DCEEEB]">
        {/* Soft background decor */}
        <div className="absolute top-0 right-1/4 w-96 h-96 bg-teal-200/30 rounded-full blur-3xl pointer-events-none" />
        <div className="absolute bottom-0 left-10 w-80 h-80 bg-cyan-100/40 rounded-full blur-2xl pointer-events-none" />

        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 relative">
          <div className="grid grid-cols-1 lg:grid-cols-12 gap-12 items-center">
            {/* Left Content */}
            <div className="lg:col-span-7 space-y-6 text-center lg:text-left">
              {/* Trust Tag */}
              <div className="inline-flex items-center gap-2 px-3.5 py-1.5 rounded-full bg-white border border-[#CFEAE7] text-[#009E9B] text-xs font-bold shadow-2xs">
                <span className="w-2 h-2 rounded-full bg-[#009E9B] animate-pulse" />
                <span>Centralized Operations & Workforce Platform</span>
              </div>

              {/* Main Headline */}
              <h1 className="text-3xl sm:text-5xl lg:text-6xl font-extrabold text-[#0B2038] tracking-tight leading-tight">
                Manage Customers, Bookings & <br className="hidden sm:inline" />
                <span className="text-[#009E9B]">Service Professionals</span>
              </h1>

              {/* Description */}
              <p className="text-base sm:text-lg text-[#5B738B] max-w-2xl mx-auto lg:mx-0 leading-relaxed font-normal">
                INDIA P.L. is an intelligent operations ecosystem engineered for on-demand home &
                office services. Harness real-time Haversine GPS matching, background-verified pros,
                automated job dispatch, and granular operational control.
              </p>

              {/* CTA Buttons */}
              <div className="flex flex-col sm:flex-row items-center justify-center lg:justify-start gap-4 pt-2">
                <Link
                  to="/login"
                  className="w-full sm:w-auto inline-flex items-center justify-center gap-2 px-8 py-4 rounded-full bg-[#009E9B] text-white font-bold text-sm shadow-md hover:bg-[#008784] hover:shadow-lg transition-all"
                >
                  <span>Access Admin Dashboard</span>
                  <ArrowRight className="w-4 h-4" />
                </Link>

                <a
                  href="#how-it-works"
                  className="w-full sm:w-auto inline-flex items-center justify-center gap-2 px-6 py-4 rounded-full bg-white text-[#0B2038] font-bold text-sm border border-[#CFEAE7] hover:bg-teal-50/50 transition-all shadow-2xs"
                >
                  <Compass className="w-4 h-4 text-[#009E9B]" />
                  <span>How GPS Matching Works</span>
                </a>
              </div>

              {/* PDF Pillars Feature Badges */}
              <div className="pt-6 grid grid-cols-2 sm:grid-cols-4 gap-3 max-w-xl mx-auto lg:mx-0">
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
                      className="p-2.5 rounded-xl bg-white/80 border border-[#DCEEEB] flex items-center gap-2 text-left"
                    >
                      <Icon className="w-4 h-4 text-[#009E9B] shrink-0" />
                      <span className="text-[11px] font-semibold text-[#0B2038] leading-tight">
                        {item.text}
                      </span>
                    </div>
                  );
                })}
              </div>
            </div>

            {/* Right Mockup (Customer App + Admin Dispatch Visualizer) */}
            <div className="lg:col-span-5 flex justify-center">
              <div className="relative w-full max-w-md">
                {/* Mobile Preview Card matching PDF Screen 4 & 9 */}
                <div className="bg-white rounded-3xl p-5 border-2 border-[#DCEEEB] shadow-2xl space-y-4">
                  {/* Top Bar */}
                  <div className="flex items-center justify-between pb-3 border-b border-slate-100">
                    <IndiaPLLogo size="sm" />
                    <div className="flex items-center gap-1 text-[11px] font-bold text-[#009E9B] bg-teal-50 px-2 py-0.5 rounded-full">
                      <MapPin className="w-3 h-3" />
                      <span>Bhubaneswar</span>
                    </div>
                  </div>

                  {/* Banner matching PDF Page 4 */}
                  <div className="p-3.5 rounded-2xl bg-gradient-to-r from-teal-500 to-[#00827F] text-white">
                    <span className="text-[10px] font-bold uppercase tracking-wider text-teal-200">
                      Your Next Job Starts Here
                    </span>
                    <h4 className="text-sm font-bold mt-0.5">Indian Naukari P.L.</h4>
                    <p className="text-[11px] text-teal-100 mt-1">
                      Verified jobs, top companies & automated pro matching.
                    </p>
                  </div>

                  {/* Booking Card matching PDF Page 9 */}
                  <div className="p-3 rounded-2xl bg-[#F4FBFB] border border-[#DCEEEB] space-y-2">
                    <div className="flex items-center justify-between">
                      <span className="text-xs font-bold text-[#0B2038]">Booking #1001</span>
                      <span className="text-[10px] font-bold px-2 py-0.5 rounded-full bg-emerald-100 text-emerald-800">
                        Accepted
                      </span>
                    </div>
                    <div className="flex items-center gap-3">
                      <img
                        src="https://images.unsplash.com/photo-1506794778202-cad84cf45f1d?auto=format&fit=crop&w=256&q=80"
                        alt="Ramesh Kumar"
                        className="w-10 h-10 rounded-xl object-cover border border-[#009E9B]"
                      />
                      <div className="flex-1">
                        <p className="text-xs font-bold text-[#0B2038]">Ramesh Kumar</p>
                        <p className="text-[11px] text-[#5B738B]">
                          Cleaning Specialist • 2.3 km away
                        </p>
                      </div>
                      <div className="text-right">
                        <span className="text-xs font-extrabold text-[#009E9B]">₹297</span>
                        <p className="text-[10px] text-slate-400">Patia, BBS</p>
                      </div>
                    </div>
                  </div>

                  {/* GPS Matching Status Badge */}
                  <div className="p-3 rounded-2xl bg-teal-50/70 border border-teal-200 flex items-center justify-between text-xs">
                    <div className="flex items-center gap-2">
                      <Compass className="w-4 h-4 text-[#009E9B] animate-spin" />
                      <span className="font-semibold text-[#00827F]">
                        GPS Dispatch Engine: Active
                      </span>
                    </div>
                    <span className="font-bold text-[#009E9B]">Haversine OK</span>
                  </div>
                </div>

                {/* Floating badge */}
                <div className="absolute -bottom-4 -left-4 bg-white rounded-2xl p-3 border border-[#CFEAE7] shadow-xl flex items-center gap-3">
                  <div className="w-9 h-9 rounded-xl bg-teal-500 text-white flex items-center justify-center font-bold text-sm">
                    ✓
                  </div>
                  <div>
                    <span className="text-xs font-bold text-[#0B2038] block">32 Active Pros</span>
                    <span className="text-[10px] text-[#5B738B]">Ready in Bhubaneswar</span>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Services Grid matching PDF Page 4, 5, 6 */}
      <section id="services" className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="text-center max-w-3xl mx-auto mb-12">
          <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-teal-50 text-[#009E9B] text-xs font-bold mb-3 border border-teal-200">
            <Sparkles className="w-3.5 h-3.5" />
            <span>Service Catalog Management</span>
          </div>
          <h2 className="text-2xl sm:text-3xl font-extrabold text-[#0B2038]">
            Popular Doorstep Services Managed by INDIA P.L.
          </h2>
          <p className="text-sm text-[#5B738B] mt-2">
            Standardized catalog with per-session pricing, verified tools, and flexible scheduling.
          </p>
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
          {serviceHighlights.map((srv, i) => (
            <div
              key={i}
              className="bg-white rounded-3xl border border-[#DCEEEB] shadow-sm hover:shadow-md transition-all overflow-hidden flex flex-col group"
            >
              <div className="relative h-44 overflow-hidden">
                <img
                  src={srv.img}
                  alt={srv.title}
                  className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-300"
                />
                <span className="absolute top-3 left-3 px-2.5 py-1 rounded-full bg-white/95 text-[#009E9B] text-[11px] font-bold shadow-sm">
                  {srv.badge}
                </span>
                <span className="absolute bottom-3 right-3 px-3 py-1 rounded-full bg-[#009E9B] text-white text-xs font-bold shadow-md">
                  Starting {srv.price}
                </span>
              </div>
              <div className="p-5 flex-1 flex flex-col justify-between">
                <div>
                  <h3 className="text-base font-bold text-[#0B2038] group-hover:text-[#009E9B] transition-colors">
                    {srv.title}
                  </h3>
                  <p className="text-xs text-[#5B738B] mt-1.5 leading-relaxed">{srv.desc}</p>
                </div>
                <div className="mt-4 pt-3 border-t border-slate-100 flex items-center justify-between">
                  <span className="text-xs font-semibold text-[#009E9B] flex items-center gap-1">
                    Manage in Admin <ChevronRight className="w-3.5 h-3.5" />
                  </span>
                  <span className="text-[11px] text-slate-400">Fixed rate</span>
                </div>
              </div>
            </div>
          ))}
        </div>
      </section>

      {/* How GPS Matching Works (Part 6 & 14) */}
      <section id="how-it-works" className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="bg-gradient-to-br from-[#E6F7F5] to-white rounded-3xl p-8 sm:p-12 border border-[#CFEAE7] shadow-sm">
          <div className="max-w-2xl mb-10">
            <span className="text-xs font-bold uppercase tracking-wider text-[#009E9B]">
              Automated Dispatch Logic
            </span>
            <h2 className="text-2xl sm:text-3xl font-extrabold text-[#0B2038] mt-1">
              How the Automatic GPS Worker Assignment Operates
            </h2>
            <p className="text-sm text-[#5B738B] mt-2">
              Zero manual bottleneck. The system matches the nearest available, background-verified
              professional with instant fallback cascading.
            </p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-4 gap-6 relative">
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
                icon: CheckCircle2,
              },
            ].map((st, i) => {
              const Icon = st.icon;
              return (
                <div
                  key={i}
                  className="bg-white rounded-2xl p-5 border border-[#DCEEEB] shadow-xs relative"
                >
                  <span className="text-2xl font-extrabold text-teal-200 block mb-2">{st.step}</span>
                  <div className="w-10 h-10 rounded-xl bg-teal-50 flex items-center justify-center text-[#009E9B] mb-3">
                    <Icon className="w-5 h-5" />
                  </div>
                  <h4 className="text-sm font-bold text-[#0B2038]">{st.title}</h4>
                  <p className="text-xs text-[#5B738B] mt-1 leading-relaxed">{st.desc}</p>
                </div>
              );
            })}
          </div>
        </div>
      </section>

      {/* About Section */}
      <section id="about" className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-12 items-center">
          <div className="space-y-5">
            <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-teal-50 text-[#009E9B] text-xs font-bold border border-teal-200">
              <ShieldCheck className="w-3.5 h-3.5" />
              <span>About INDIA P.L.</span>
            </div>
            <h2 className="text-3xl font-extrabold text-[#0B2038] tracking-tight">
              Trusted Services. Better Tomorrow.
            </h2>
            <p className="text-sm text-[#5B738B] leading-relaxed">
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
                <div key={idx} className="flex items-center gap-2.5 text-xs text-[#0B2038] font-semibold">
                  <div className="w-4 h-4 rounded-full bg-teal-100 text-[#009E9B] flex items-center justify-center shrink-0">
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
              <p className="text-[11px] text-[#5B738B] mt-0.5">
                Patia & Saheed Nagar, Bhubaneswar, Odisha - 751024
              </p>
            </div>
          </div>
        </div>
      </section>

      {/* Admin Portal CTA Banner */}
      <section className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="rounded-3xl bg-gradient-to-r from-[#009E9B] to-[#00827F] p-8 sm:p-12 text-white shadow-xl flex flex-col md:flex-row items-center justify-between gap-6">
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
            className="px-8 py-3.5 rounded-full bg-white text-[#009E9B] font-bold text-sm hover:bg-teal-50 transition-all shadow-md shrink-0"
          >
            Launch Admin Dashboard →
          </Link>
        </div>
      </section>
    </div>
  );
};
