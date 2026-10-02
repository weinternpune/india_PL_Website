import React, { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { useApp } from '../../context/AppContext';
import { StatusBadge } from '../../components/common/StatusBadge';
import { GpsDispatchModal } from '../../components/modals/GpsDispatchModal';
import { NewBookingModal } from '../../components/modals/NewBookingModal';
import { WorkerVerificationModal } from '../../components/modals/WorkerVerificationModal';
import { Worker } from '../../types';
import {
  CalendarCheck2,
  Calendar,
  Users2,
  UserCheck,
  IndianRupee,
  Percent,
  TrendingUp,
  Compass,
  ArrowRight,
  Plus,
  Clock,
  MapPin,
  CheckCircle2,
  ShieldAlert,
  ShieldCheck,
  RefreshCw,
  Eye,
  Radio,
  Sparkles,
} from 'lucide-react';

export const AdminDashboardHome: React.FC = () => {
  const {
    metrics,
    bookings,
    workers,
    customers,
    chartDays,
    isBackendConnected,
    refreshFromBackend,
    isLoading,
    autoDispatchWorker,
  } = useApp();

  const navigate = useNavigate();

  // Modals state
  const [selectedBookingForGps, setSelectedBookingForGps] = useState<string | null>(null);
  const [isNewBookingModalOpen, setIsNewBookingModalOpen] = useState(false);
  const [selectedWorkerForReview, setSelectedWorkerForReview] = useState<Worker | null>(null);

  // Quick stats matching Part 4 requirements
  const statCards = [
    {
      title: 'Total Bookings',
      value: metrics.totalBookings,
      change: '+14% this month',
      isPositive: true,
      icon: CalendarCheck2,
      color: 'teal',
    },
    {
      title: "Today's Bookings",
      value: metrics.todayBookings,
      change: '+4 vs yesterday',
      isPositive: true,
      icon: Calendar,
      color: 'cyan',
    },
    {
      title: 'Active Workers',
      value: metrics.activeWorkers,
      change: '88% online now',
      isPositive: true,
      icon: Users2,
      color: 'emerald',
    },
    {
      title: 'Total Customers',
      value: metrics.totalCustomers,
      change: '+28 new this week',
      isPositive: true,
      icon: UserCheck,
      color: 'blue',
    },
    {
      title: 'GMV (Gross Revenue)',
      value: `₹${metrics.gmv.toLocaleString('en-IN')}`,
      change: '+18.2% vs last month',
      isPositive: true,
      icon: IndianRupee,
      color: 'teal',
    },
    {
      title: 'Cancellation Rate',
      value: `${metrics.cancellationRate}%`,
      change: '-0.6% improvement',
      isPositive: true,
      icon: Percent,
      color: 'amber',
    },
  ];

  // Max daily bookings for scaling the bar heights dynamically
  const maxDayBookings = Math.max(...chartDays.map((d) => d.bookings), 1);

  // Status breakdown calculations
  const statusCounts = {
    Accepted: bookings.filter((b) => b.status === 'Accepted').length,
    'In Progress': bookings.filter((b) => b.status === 'In Progress').length,
    'Finding Worker': bookings.filter((b) => b.status === 'Finding Worker' || b.status === 'Worker Notified').length,
    Completed: bookings.filter((b) => b.status === 'Completed').length,
    Pending: bookings.filter((b) => b.status === 'Pending').length,
    Cancelled: bookings.filter((b) => b.status === 'Cancelled').length,
  };

  // Pending worker registrations
  const pendingApplicants = workers.filter(
    (w) => w.verificationStatus === 'Pending' || w.status === 'Pending Verification'
  );

  // Active workers
  const activePros = workers.filter((w) => w.status === 'Active');

  return (
    <div className="space-y-8">
      {/* Top Banner & Quick Actions */}
      <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4">
        <div>
          <h1 className="text-2xl sm:text-3xl font-extrabold text-[#0B2038]">
            Operations Command Dashboard
          </h1>
          <p className="text-xs sm:text-sm text-[#5B738B] mt-0.5">
            Real-time fleet monitoring, GPS automated assignment, and booking controls.
          </p>
        </div>

        <div className="flex items-center gap-2.5 flex-wrap">
          {isBackendConnected ? (
            <div className="inline-flex items-center gap-1.5 px-3 py-1.5 rounded-full bg-emerald-50 text-emerald-700 border border-emerald-200 text-xs font-semibold">
              <span className="w-2 h-2 rounded-full bg-emerald-500 animate-pulse" />
              <span>Live Backend Connected</span>
            </div>
          ) : (
            <div
              className="inline-flex items-center gap-1.5 px-3 py-1.5 rounded-full bg-teal-50/70 text-[#00827F] border border-teal-200 text-xs font-semibold"
              title="All data is dynamic. Provide VITE_API_BASE_URL in .env to connect your backend."
            >
              <span className="w-2 h-2 rounded-full bg-[#009E9B]" />
              <span>Dynamic Store Ready</span>
            </div>
          )}

          <button
            onClick={() => setIsNewBookingModalOpen(true)}
            className="inline-flex items-center gap-2 px-4 py-2.5 rounded-full bg-white text-[#009E9B] border border-teal-200 text-xs font-bold hover:bg-teal-50 shadow-2xs transition-all"
          >
            <Plus className="w-4 h-4" />
            <span>Simulate New Booking</span>
          </button>

          {bookings.find((b) => b.status === 'Pending' || b.status === 'Finding Worker') && (
            <button
              onClick={() => {
                const target = bookings.find(
                  (b) => b.status === 'Pending' || b.status === 'Finding Worker'
                );
                if (target) setSelectedBookingForGps(target.bookingId);
              }}
              className="inline-flex items-center gap-2 px-5 py-2.5 rounded-full bg-[#009E9B] text-white text-xs font-bold hover:bg-[#00827F] shadow-sm hover:shadow transition-all"
            >
              <Compass className="w-4 h-4 animate-spin" />
              <span>Launch GPS Dispatch Engine</span>
            </button>
          )}
        </div>
      </div>

      {/* 6 Summary Metric Cards (Part 4) */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-6 gap-4">
        {statCards.map((card, idx) => {
          const Icon = card.icon;
          return (
            <div
              key={idx}
              className="bg-white rounded-2xl p-4 border border-[#DCEEEB] shadow-2xs hover:shadow-sm transition-all flex flex-col justify-between"
            >
              <div className="flex items-center justify-between">
                <span className="text-xs font-semibold text-[#5B738B] truncate">
                  {card.title}
                </span>
                <div className="w-7 h-7 rounded-xl bg-teal-50 text-[#009E9B] flex items-center justify-center shrink-0">
                  <Icon className="w-4 h-4" />
                </div>
              </div>

              <div className="mt-3">
                <span className="text-2xl font-extrabold text-[#0B2038] tracking-tight">
                  {card.value}
                </span>
                <p className="text-[11px] font-medium text-emerald-600 flex items-center gap-1 mt-1">
                  <TrendingUp className="w-3 h-3" />
                  <span>{card.change}</span>
                </p>
              </div>
            </div>
          );
        })}
      </div>

      {/* Charts & Status Breakdown Grid */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-6">
        {/* Bookings Per Day Chart (8 cols) */}
        <div className="lg:col-span-8 bg-white rounded-3xl p-6 border border-[#DCEEEB] shadow-2xs space-y-4">
          <div className="flex items-center justify-between">
            <div>
              <h3 className="text-base font-bold text-[#0B2038]">Bookings Per Day Trend</h3>
              <p className="text-xs text-[#5B738B]">
                Daily volume and automated allocation distribution (Past 7 Days)
              </p>
            </div>
            <span className="text-xs font-bold text-[#009E9B] bg-teal-50 px-3 py-1 rounded-full border border-teal-200">
              Avg: 20 bookings/day
            </span>
          </div>

          {/* SVG Bar Chart with Tooltips */}
          <div className="pt-8 pb-2 w-full overflow-hidden">
            <div className="h-56 w-full grid grid-cols-7 gap-1.5 sm:gap-3 md:gap-4 items-end px-1 sm:px-2">
              {chartDays.map((item, i) => {
                const heightPercent = Math.round((item.bookings / (maxDayBookings + 5)) * 100);
                const isHighlight = item.day === 'Sat' || item.day === 'Sun';
                return (
                  <div key={i} className="relative flex flex-col items-center gap-2 group h-full justify-end min-w-0">
                    {/* Hover tooltip positioned absolutely */}
                    <div className="absolute -top-7 left-1/2 -translate-x-1/2 opacity-0 group-hover:opacity-100 transition-opacity text-[10px] font-bold text-white bg-[#0B2038] px-2 py-1 rounded shadow-md pointer-events-none whitespace-nowrap z-20">
                      {item.bookings} jobs (₹{item.gmv.toLocaleString('en-IN')})
                    </div>

                    {/* Bar */}
                    <div className="w-full max-w-[38px] bg-teal-50 rounded-t-xl overflow-hidden h-full flex items-end">
                      <div
                        style={{ height: `${heightPercent}%` }}
                        className={`w-full rounded-t-xl transition-all duration-500 ${
                          isHighlight
                            ? 'bg-gradient-to-t from-[#009E9B] to-[#00C2BE]'
                            : 'bg-gradient-to-t from-[#009E9B]/80 to-[#009E9B]'
                        } group-hover:brightness-110`}
                      />
                    </div>

                    {/* Label */}
                    <span className="text-xs font-bold text-[#5B738B] group-hover:text-[#009E9B] transition-colors truncate">
                      {item.day}
                    </span>
                  </div>
                );
              })}
            </div>
          </div>

          <div className="pt-4 border-t border-slate-100 flex items-center justify-between text-xs text-[#5B738B]">
            <div className="flex items-center gap-4">
              <span className="flex items-center gap-1.5">
                <span className="w-3 h-3 rounded bg-[#009E9B]" /> Completed / Dispatched
              </span>
              <span className="flex items-center gap-1.5">
                <span className="w-3 h-3 rounded bg-teal-100" /> Reserved Capacity
              </span>
            </div>
            <Link
              to="/admin/reports"
              className="font-semibold text-[#009E9B] hover:text-[#00827F] flex items-center gap-1"
            >
              Full Reports Analytics →
            </Link>
          </div>
        </div>

        {/* Booking Status Breakdown (4 cols) */}
        <div className="lg:col-span-4 bg-white rounded-3xl p-6 border border-[#DCEEEB] shadow-2xs space-y-4">
          <div className="flex items-center justify-between">
            <h3 className="text-base font-bold text-[#0B2038]">Status Breakdown</h3>
            <span className="text-xs font-bold text-[#5B738B]">Live Queue</span>
          </div>

          <div className="space-y-3 pt-2">
            {[
              { label: 'Accepted', count: statusCounts.Accepted, color: 'bg-emerald-500' },
              { label: 'In Progress', count: statusCounts['In Progress'], color: 'bg-blue-500' },
              { label: 'Finding / Notified', count: statusCounts['Finding Worker'], color: 'bg-cyan-500' },
              { label: 'Completed', count: statusCounts.Completed, color: 'bg-[#009E9B]' },
              { label: 'Pending', count: statusCounts.Pending, color: 'bg-amber-500' },
              { label: 'Cancelled', count: statusCounts.Cancelled, color: 'bg-rose-500' },
            ].map((stat, i) => {
              const total = bookings.length || 1;
              const pct = Math.round((stat.count / total) * 100);
              return (
                <div key={i} className="space-y-1">
                  <div className="flex justify-between text-xs">
                    <span className="font-semibold text-[#0B2038]">{stat.label}</span>
                    <span className="font-bold text-[#5B738B]">
                      {stat.count} ({pct}%)
                    </span>
                  </div>
                  <div className="w-full bg-slate-100 h-2 rounded-full overflow-hidden">
                    <div
                      style={{ width: `${Math.max(pct, 5)}%` }}
                      className={`h-full rounded-full ${stat.color}`}
                    />
                  </div>
                </div>
              );
            })}
          </div>

          {/* Quick GPS Status Info */}
          <div className="p-3 rounded-2xl bg-teal-50 border border-teal-200 mt-4 flex items-center gap-2.5">
            <Radio className="w-4 h-4 text-[#009E9B] animate-pulse shrink-0" />
            <p className="text-[11px] text-[#00827F] leading-tight">
              Haversine GPS matching automatically evaluates pro distance within 15 km in Bhubaneswar.
            </p>
          </div>
        </div>
      </div>

      {/* Recent Bookings Table & Live Worker Summary Grid */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-6">
        {/* Recent Bookings (8 cols) */}
        <div className="lg:col-span-8 bg-white rounded-3xl p-6 border border-[#DCEEEB] shadow-2xs space-y-4">
          <div className="flex items-center justify-between">
            <div>
              <h3 className="text-base font-bold text-[#0B2038]">Recent Customer Bookings</h3>
              <p className="text-xs text-[#5B738B]">
                Active bookings and automatic worker assignment states
              </p>
            </div>
            <Link
              to="/admin/bookings"
              className="text-xs font-bold text-[#009E9B] hover:text-[#00827F] flex items-center gap-1"
            >
              View All ({bookings.length}) →
            </Link>
          </div>

          <div className="overflow-x-auto">
            <table className="w-full text-left text-xs">
              <thead>
                <tr className="border-b border-[#DCEEEB] text-[#5B738B] font-bold uppercase tracking-wider text-[11px]">
                  <th className="pb-3 pl-3 pr-2 whitespace-nowrap">Booking ID</th>
                  <th className="pb-3 px-3 whitespace-nowrap">Customer</th>
                  <th className="pb-3 px-3 whitespace-nowrap">Service</th>
                  <th className="pb-3 px-3 whitespace-nowrap">Assigned Pro</th>
                  <th className="pb-3 px-3 whitespace-nowrap">Distance</th>
                  <th className="pb-3 px-3 whitespace-nowrap">Status</th>
                  <th className="pb-3 pr-3 text-right whitespace-nowrap">Actions</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-slate-100">
                {bookings.slice(0, 5).map((booking) => (
                  <tr key={booking.bookingId} className="hover:bg-teal-50/30 transition-colors">
                    <td className="py-3.5 pl-3 pr-2 font-mono font-bold text-[#0B2038] whitespace-nowrap">
                      {booking.bookingId}
                    </td>
                    <td className="py-3.5 px-3">
                      <div className="flex items-center gap-2">
                        <img
                          src={booking.customerAvatar}
                          alt={booking.customerName}
                          className="w-7 h-7 rounded-full object-cover border border-slate-200 shrink-0"
                        />
                        <span className="font-semibold text-[#0B2038] whitespace-nowrap">{booking.customerName}</span>
                      </div>
                    </td>
                    <td className="py-3.5 px-3 text-[#5B738B] whitespace-nowrap">{booking.serviceName}</td>
                    <td className="py-3.5 px-3 whitespace-nowrap">
                      {booking.assignedWorkerName ? (
                        <span className="font-semibold text-[#0B2038]">
                          {booking.assignedWorkerName}
                        </span>
                      ) : (
                        <span className="text-slate-400 italic">Unassigned</span>
                      )}
                    </td>
                    <td className="py-3.5 px-3 whitespace-nowrap">
                      {booking.workerDistance !== undefined ? (
                        <span className="font-bold text-[#009E9B]">
                          {booking.workerDistance} km
                        </span>
                      ) : (
                        <span className="text-slate-400">—</span>
                      )}
                    </td>
                    <td className="py-3.5 px-3 whitespace-nowrap">
                      <StatusBadge status={booking.status} size="sm" />
                    </td>
                    <td className="py-3.5 pr-3 text-right whitespace-nowrap">
                      <div className="flex items-center justify-end gap-1.5">
                        <button
                          onClick={() => setSelectedBookingForGps(booking.bookingId)}
                          className="p-1.5 text-[#009E9B] hover:bg-teal-50 rounded-lg transition-colors"
                          title="GPS Auto-Dispatch"
                        >
                          <Compass className="w-4 h-4" />
                        </button>
                        <Link
                          to={`/admin/bookings/${booking.bookingId}`}
                          className="p-1.5 text-slate-500 hover:text-[#0B2038] hover:bg-slate-100 rounded-lg transition-colors"
                          title="View Details"
                        >
                          <Eye className="w-4 h-4" />
                        </Link>
                      </div>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>

        {/* Pending Worker Registrations (4 cols) */}
        <div className="lg:col-span-4 bg-white rounded-3xl p-6 border border-[#DCEEEB] shadow-2xs space-y-4 flex flex-col justify-between">
          <div>
            <div className="flex items-center justify-between mb-2">
              <div className="flex items-center gap-2">
                <h3 className="text-base font-bold text-[#0B2038]">Pro Applications</h3>
                {pendingApplicants.length > 0 && (
                  <span className="px-2 py-0.5 text-xs font-bold rounded-full bg-amber-100 text-amber-800">
                    {pendingApplicants.length} Pending
                  </span>
                )}
              </div>
              <Link
                to="/admin/workers"
                className="text-xs font-bold text-[#009E9B] hover:text-[#00827F]"
              >
                All Pros →
              </Link>
            </div>
            <p className="text-xs text-[#5B738B]">
              New workers awaiting Aadhaar & skill verification before going active
            </p>

            <div className="space-y-3 mt-4">
              {pendingApplicants.length === 0 ? (
                <div className="p-6 text-center text-xs text-slate-400 bg-slate-50 rounded-2xl">
                  No pending pro applications. All workers verified!
                </div>
              ) : (
                pendingApplicants.map((pro) => (
                  <div
                    key={pro.workerId}
                    className="p-3.5 rounded-2xl border border-[#DCEEEB] bg-[#F8FCFC] flex items-center justify-between gap-3"
                  >
                    <div className="flex items-center gap-3">
                      <img
                        src={pro.profileImage}
                        alt={pro.name}
                        className="w-10 h-10 rounded-xl object-cover border border-slate-200"
                      />
                      <div>
                        <h4 className="text-xs font-bold text-[#0B2038]">{pro.name}</h4>
                        <p className="text-[11px] text-[#5B738B]">
                          {pro.categories.join(', ')} • {pro.experienceYears}y exp
                        </p>
                        <span className="text-[10px] text-slate-400">{pro.locationName}</span>
                      </div>
                    </div>

                    <button
                      onClick={() => setSelectedWorkerForReview(pro)}
                      className="px-3 py-1.5 rounded-full bg-[#009E9B] text-white text-[11px] font-bold hover:bg-[#00827F] transition-colors shrink-0 shadow-2xs"
                    >
                      Review
                    </button>
                  </div>
                ))
              )}
            </div>
          </div>

          {/* Active Workers Summary */}
          <div className="pt-4 border-t border-slate-100">
            <div className="flex items-center justify-between text-xs font-bold text-[#0B2038] mb-2">
              <span>Active Pros in Fleet</span>
              <span className="text-[#009E9B]">{activePros.length} Pros</span>
            </div>
            <div className="flex -space-x-2 overflow-hidden">
              {activePros.slice(0, 6).map((w) => (
                <img
                  key={w.workerId}
                  src={w.profileImage}
                  alt={w.name}
                  title={`${w.name} (${w.availability})`}
                  className="inline-block h-8 w-8 rounded-full ring-2 ring-white object-cover"
                />
              ))}
              {activePros.length > 6 && (
                <div className="h-8 w-8 rounded-full bg-teal-100 text-[#009E9B] text-xs font-bold flex items-center justify-center ring-2 ring-white">
                  +{activePros.length - 6}
                </div>
              )}
            </div>
          </div>
        </div>
      </div>

      {/* Modals */}
      {selectedBookingForGps && (
        <GpsDispatchModal
          bookingId={selectedBookingForGps}
          isOpen={!!selectedBookingForGps}
          onClose={() => setSelectedBookingForGps(null)}
        />
      )}

      {isNewBookingModalOpen && (
        <NewBookingModal
          isOpen={isNewBookingModalOpen}
          onClose={() => setIsNewBookingModalOpen(false)}
          onCreated={(bookingId) => setSelectedBookingForGps(bookingId)}
        />
      )}

      {selectedWorkerForReview && (
        <WorkerVerificationModal
          worker={selectedWorkerForReview}
          isOpen={!!selectedWorkerForReview}
          onClose={() => setSelectedWorkerForReview(null)}
        />
      )}
    </div>
  );
};
