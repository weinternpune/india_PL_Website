import React, { useState } from 'react';
import { useParams, Link, useNavigate } from 'react-router-dom';
import { useApp } from '../../context/AppContext';
import { StatusBadge } from '../../components/common/StatusBadge';
import { GpsDispatchModal } from '../../components/modals/GpsDispatchModal';
import { BookingStatus } from '../../types';
import {
  ArrowLeft,
  Calendar,
  Clock,
  MapPin,
  Phone,
  Mail,
  ShieldCheck,
  Star,
  Compass,
  Radio,
  CreditCard,
} from 'lucide-react';

export const AdminBookingDetailPage: React.FC = () => {
  const { id } = useParams<{ id: string }>();
  const navigate = useNavigate();
  const {
    getBookingById,
    updateBookingStatus,
    simulateWorkerResponse,
  } = useApp();

  const [isGpsModalOpen, setIsGpsModalOpen] = useState(false);
  const [statusDropdown, setStatusDropdown] = useState<BookingStatus | ''>('');

  const booking = getBookingById(id || '');

  if (!booking) {
    return (
      <div className="py-16 text-center space-y-4">
        <h2 className="text-xl font-black text-[#0B2038]">Booking Not Found</h2>
        <p className="text-xs font-semibold text-slate-800">Could not locate booking identifier {id}.</p>
        <Link
          to="/admin/bookings"
          className="inline-flex items-center gap-2 px-4 py-2 rounded-xl bg-[#008A8E] text-white text-xs font-bold"
        >
          <ArrowLeft className="w-4 h-4" />
          <span>Back to Bookings</span>
        </Link>
      </div>
    );
  }

  const handleStatusChange = (newStatus: BookingStatus) => {
    updateBookingStatus(booking.bookingId, newStatus);
    setStatusDropdown('');
  };

  return (
    <div className="space-y-6 max-w-6xl mx-auto">
      {/* Top Navigation & Status Bar */}
      <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4">
        <div className="flex items-center gap-3">
          <button
            onClick={() => navigate('/admin/bookings')}
            className="p-2 rounded-xl bg-white border border-slate-200 text-[#0B2038] hover:text-[#008A8E] hover:bg-teal-50 transition-colors shadow-xs cursor-pointer"
          >
            <ArrowLeft className="w-4 h-4" />
          </button>
          <div>
            <div className="flex items-center gap-2">
              <h1 className="text-2xl font-black text-[#0B2038] tracking-tight">
                Booking Details
              </h1>
              <span className="font-mono text-xs font-bold px-2.5 py-0.5 rounded-full bg-teal-100 text-[#008A8E] border border-teal-200">
                {booking.bookingId}
              </span>
            </div>
            <p className="text-xs font-semibold text-slate-800 mt-0.5">
              Created on {new Date(booking.createdAt).toLocaleDateString('en-IN', { dateStyle: 'medium' })} • Doorstep operations
            </p>
          </div>
        </div>

        {/* Status Badge & Actions */}
        <div className="flex items-center gap-3">
          <StatusBadge status={booking.status} size="md" />

          {/* Quick GPS Dispatch Trigger */}
          <button
            onClick={() => setIsGpsModalOpen(true)}
            className="inline-flex items-center gap-2 px-4 py-2 rounded-xl bg-[#008A8E] text-white text-xs font-bold hover:bg-[#007074] shadow-sm transition-all cursor-pointer"
          >
            <Compass className="w-4 h-4 animate-spin" />
            <span>GPS Auto-Dispatch</span>
          </button>
        </div>
      </div>

      {/* Main Grid: 2 Columns */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-6">
        {/* Left Column (8 cols): Service, Customer, Assigned Pro & History */}
        <div className="lg:col-span-8 space-y-6">
          {/* Selected Services Card */}
          <div className="bg-white rounded-2xl p-6 border border-slate-200 shadow-sm space-y-4">
            <div className="flex items-center justify-between pb-3 border-b border-slate-200">
              <div>
                <span className="text-[11px] font-bold uppercase tracking-wider text-[#008A8E]">
                  Service Package
                </span>
                <h3 className="text-lg font-black text-[#0B2038] mt-0.5">
                  {booking.serviceName}
                </h3>
              </div>
              <span className="text-xs font-bold px-2.5 py-1 rounded-full bg-teal-50 text-[#008A8E] border border-teal-200">
                {booking.serviceCategory}
              </span>
            </div>

            {/* Selected sub-services */}
            <div className="space-y-2">
              <h4 className="text-xs font-bold text-[#0B2038] uppercase tracking-wider">
                Services Included
              </h4>
              <div className="divide-y divide-slate-100 border border-slate-200 rounded-xl overflow-hidden">
                {booking.selectedServices.map((item, idx) => (
                  <div
                    key={idx}
                    className="p-3 bg-slate-50 flex items-center justify-between text-xs"
                  >
                    <div className="flex items-center gap-2">
                      <div className="w-5 h-5 rounded-full bg-teal-100 text-[#008A8E] flex items-center justify-center font-bold text-[10px]">
                        ✓
                      </div>
                      <span className="font-bold text-[#0B2038]">{item.name}</span>
                    </div>
                    <span className="font-black text-[#008A8E]">₹{item.price}</span>
                  </div>
                ))}
              </div>
            </div>

            {/* Timing & Duration details */}
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 pt-2">
              <div className="p-3.5 rounded-xl bg-slate-50 border border-slate-200 flex items-center gap-3">
                <div className="w-9 h-9 rounded-lg bg-teal-100 text-[#008A8E] flex items-center justify-center">
                  <Calendar className="w-4 h-4" />
                </div>
                <div>
                  <span className="text-[11px] font-bold text-slate-700 block">Date & Time</span>
                  <span className="text-xs font-black text-[#0B2038]">
                    {booking.date} • {booking.timeSlot}
                  </span>
                </div>
              </div>

              <div className="p-3.5 rounded-xl bg-slate-50 border border-slate-200 flex items-center gap-3">
                <div className="w-9 h-9 rounded-lg bg-teal-100 text-[#008A8E] flex items-center justify-center">
                  <Clock className="w-4 h-4" />
                </div>
                <div>
                  <span className="text-[11px] font-bold text-slate-700 block">Estimated Duration</span>
                  <span className="text-xs font-black text-[#0B2038]">
                    {booking.estimatedDuration}
                  </span>
                </div>
              </div>
            </div>
          </div>

          {/* Assigned Professional Card */}
          <div className="bg-white rounded-2xl p-6 border border-slate-200 shadow-sm space-y-4">
            <div className="flex items-center justify-between pb-3 border-b border-slate-200">
              <div>
                <span className="text-[11px] font-bold uppercase tracking-wider text-[#008A8E]">
                  Assigned Professional
                </span>
                <h3 className="text-base font-black text-[#0B2038] mt-0.5">
                  Doorstep Service Executive
                </h3>
              </div>
              {booking.workerDistance !== undefined && (
                <span className="text-xs font-bold px-3 py-1 rounded-full bg-teal-50 text-[#008A8E] border border-teal-200">
                  {booking.workerDistance} km from customer
                </span>
              )}
            </div>

            {booking.assignedWorkerName ? (
              <div className="space-y-4">
                <div className="p-4 rounded-xl bg-teal-50/40 border border-teal-200 flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4">
                  <div className="flex items-center gap-3.5">
                    <img
                      src={
                        booking.assignedWorkerAvatar ||
                        'https://images.unsplash.com/photo-1506794778202-cad84cf45f1d?auto=format&fit=crop&w=256&q=80'
                      }
                      alt={booking.assignedWorkerName}
                      className="w-14 h-14 rounded-xl object-cover border-2 border-[#008A8E]"
                    />
                    <div>
                      <div className="flex items-center gap-2">
                        <h4 className="text-base font-black text-[#0B2038]">
                          {booking.assignedWorkerName}
                        </h4>
                        <span className="inline-flex items-center gap-1 text-[10px] font-bold text-teal-900 bg-teal-100 px-2 py-0.5 rounded-full">
                          <ShieldCheck className="w-3 h-3 text-[#008A8E]" />
                          Verified Pro
                        </span>
                      </div>
                      <div className="flex items-center gap-3 text-xs text-slate-800 mt-1 font-semibold">
                        <span className="flex items-center gap-1">
                          <Phone className="w-3 h-3 text-[#008A8E]" />
                          {booking.assignedWorkerPhone}
                        </span>
                        <span>•</span>
                        <span className="flex items-center text-amber-600 font-bold">
                          <Star className="w-3 h-3 fill-current mr-0.5" />
                          {booking.assignedWorkerRating || 4.8}
                        </span>
                      </div>
                    </div>
                  </div>

                  <Link
                    to={`/admin/workers/${booking.assignedWorkerId}`}
                    className="px-3.5 py-1.5 rounded-lg bg-white text-[#008A8E] border border-teal-300 text-xs font-bold hover:bg-teal-50 transition-colors shadow-xs"
                  >
                    View Pro Profile →
                  </Link>
                </div>

                {/* Worker Simulated Response Buttons */}
                {booking.status === 'Worker Notified' && (
                  <div className="p-3.5 rounded-xl bg-amber-50 border border-amber-200 flex items-center justify-between flex-wrap gap-2 text-xs">
                    <span className="text-amber-900 font-bold flex items-center gap-1.5">
                      <Radio className="w-4 h-4 text-amber-600 animate-pulse" />
                      Job request sent. Awaiting pro acceptance...
                    </span>
                    <div className="flex items-center gap-2">
                      <button
                        onClick={() => simulateWorkerResponse(booking.bookingId, true)}
                        className="px-3 py-1.5 rounded-lg bg-emerald-600 text-white font-bold hover:bg-emerald-700 shadow-xs cursor-pointer"
                      >
                        Accept
                      </button>
                      <button
                        onClick={() => simulateWorkerResponse(booking.bookingId, false)}
                        className="px-3 py-1.5 rounded-lg bg-rose-600 text-white font-bold hover:bg-rose-700 shadow-xs cursor-pointer"
                      >
                        Decline & Reassign
                      </button>
                    </div>
                  </div>
                )}
              </div>
            ) : (
              <div className="p-6 rounded-xl border-2 border-dashed border-slate-200 text-center space-y-3">
                <Compass className="w-8 h-8 text-[#008A8E] mx-auto animate-pulse" />
                <div>
                  <h4 className="text-sm font-bold text-[#0B2038]">No Pro Assigned</h4>
                  <p className="text-xs text-slate-700 font-medium">
                    Run automatic Haversine GPS matching to calculate nearest available worker in Bhubaneswar.
                  </p>
                </div>
                <button
                  onClick={() => setIsGpsModalOpen(true)}
                  className="px-5 py-2 rounded-xl bg-[#008A8E] text-white text-xs font-bold hover:bg-[#007074] shadow-sm cursor-pointer"
                >
                  Auto-Assign Nearest Worker Now
                </button>
              </div>
            )}
          </div>

          {/* Timeline and History */}
          <div className="bg-white rounded-2xl p-6 border border-slate-200 shadow-sm space-y-4">
            <h3 className="text-base font-black text-[#0B2038]">
              Lifecycle Event Log & History
            </h3>
            <div className="relative pl-6 space-y-6 before:absolute before:left-2 before:top-2 before:bottom-2 before:w-0.5 before:bg-teal-200">
              {booking.history.map((event, idx) => (
                <div key={idx} className="relative">
                  {/* Dot */}
                  <span className="absolute -left-6 top-1 w-4 h-4 rounded-full bg-white border-2 border-[#008A8E] flex items-center justify-center">
                    <span className="w-1.5 h-1.5 rounded-full bg-[#008A8E]" />
                  </span>
                  <div>
                    <div className="flex items-center gap-2">
                      <span className="text-xs font-bold text-[#0B2038]">{event.status}</span>
                      <span className="text-[10px] text-slate-600 font-mono font-bold">
                        {event.timestamp}
                      </span>
                    </div>
                    <p className="text-xs text-slate-800 mt-0.5 font-medium leading-relaxed">{event.note}</p>
                  </div>
                </div>
              ))}
            </div>
          </div>
        </div>

        {/* Right Column (4 cols): Customer Details, Address, GPS Map Card, Payment Breakdown */}
        <div className="lg:col-span-4 space-y-6">
          {/* Customer Profile Card */}
          <div className="bg-white rounded-2xl p-6 border border-slate-200 shadow-sm space-y-4">
            <div className="flex items-center justify-between pb-3 border-b border-slate-200">
              <span className="text-xs font-bold text-[#0B2038] uppercase tracking-wider">
                Customer Profile
              </span>
              <Link
                to={`/admin/customers/${booking.customerId}`}
                className="text-xs font-bold text-[#008A8E] hover:text-[#007074]"
              >
                View →
              </Link>
            </div>

            <div className="flex items-center gap-3">
              <img
                src={booking.customerAvatar}
                alt={booking.customerName}
                className="w-12 h-12 rounded-full object-cover border-2 border-teal-200"
              />
              <div>
                <h4 className="text-sm font-black text-[#0B2038]">{booking.customerName}</h4>
                <span className="inline-block text-[10px] font-bold text-[#008A8E] bg-teal-50 px-2 py-0.5 rounded-full border border-teal-200">
                  Premium Member
                </span>
              </div>
            </div>

            <div className="space-y-2 text-xs text-slate-800 pt-2 border-t border-slate-200 font-medium">
              <div className="flex items-center gap-2">
                <Phone className="w-3.5 h-3.5 text-[#008A8E]" />
                <span className="text-[#0B2038] font-bold">{booking.customerPhone}</span>
              </div>
              <div className="flex items-center gap-2">
                <Mail className="w-3.5 h-3.5 text-[#008A8E]" />
                <span className="text-[#0B2038] font-bold truncate">{booking.customerEmail}</span>
              </div>
            </div>
          </div>

          {/* Service Address & GPS Card */}
          <div className="bg-white rounded-2xl p-6 border border-slate-200 shadow-sm space-y-4">
            <div className="flex items-center justify-between pb-2 border-b border-slate-200">
              <span className="text-xs font-bold text-[#0B2038] uppercase tracking-wider">
                Service Address & GPS
              </span>
              <span className="text-[11px] font-mono font-bold text-[#008A8E]">
                {booking.customerLocation.city}
              </span>
            </div>

            <div className="flex items-start gap-3">
              <div className="w-8 h-8 rounded-lg bg-teal-50 text-[#008A8E] flex items-center justify-center shrink-0 mt-0.5 border border-teal-200">
                <MapPin className="w-4 h-4" />
              </div>
              <div>
                <h5 className="text-xs font-bold text-[#0B2038]">Home Location</h5>
                <p className="text-xs text-slate-800 mt-0.5 font-medium leading-relaxed">
                  {booking.customerLocation.address}, {booking.customerLocation.city}, {booking.customerLocation.state} - {booking.customerLocation.pincode}
                </p>
              </div>
            </div>

            {/* Stylized Visual Map Preview */}
            <div className="p-3.5 rounded-xl bg-teal-50/50 border border-teal-200 space-y-2">
              <div className="flex items-center justify-between text-xs">
                <span className="font-bold text-[#008A8E]">GPS Coordinates</span>
                <span className="font-mono text-[11px] font-bold text-[#0B2038]">
                  {booking.customerLocation.latitude.toFixed(4)}° N,{' '}
                  {booking.customerLocation.longitude.toFixed(4)}° E
                </span>
              </div>
              <div className="h-20 bg-teal-100/50 rounded-lg flex items-center justify-center border border-teal-200 relative overflow-hidden">
                <div className="relative flex items-center gap-1.5 text-xs font-bold text-[#008A8E]">
                  <Compass className="w-4 h-4 text-[#008A8E]" />
                  <span>Bhubaneswar Geo-Cluster</span>
                </div>
              </div>
            </div>
          </div>

          {/* Price Details Card */}
          <div className="bg-white rounded-2xl p-6 border border-slate-200 shadow-sm space-y-4">
            <h3 className="text-xs font-bold text-[#0B2038] uppercase tracking-wider pb-2 border-b border-slate-200">
              Price Details
            </h3>

            <div className="space-y-2 text-xs">
              <div className="flex justify-between text-slate-800 font-medium">
                <span>Service Subtotal</span>
                <span className="font-bold text-[#0B2038]">₹{booking.subtotal}</span>
              </div>
              <div className="flex justify-between text-slate-800 font-medium">
                <span>Platform Convenience Fee</span>
                <span className="font-bold text-[#0B2038]">₹{booking.convenienceFee}</span>
              </div>
              <div className="pt-2 border-t border-slate-200 flex justify-between items-center text-sm">
                <span className="font-black text-[#0B2038]">Total Amount</span>
                <span className="text-lg font-black text-[#008A8E]">
                  ₹{booking.totalAmount}
                </span>
              </div>
            </div>

            <div className="pt-3 border-t border-slate-200 flex items-center justify-between text-xs">
              <div className="flex items-center gap-1.5 text-slate-800 font-semibold">
                <CreditCard className="w-3.5 h-3.5 text-[#008A8E]" />
                <span>{booking.paymentMethod}</span>
              </div>
              <StatusBadge status={booking.paymentStatus} type="payment" size="sm" />
            </div>
          </div>

          {/* Manual Ops Override */}
          <div className="bg-white rounded-2xl p-5 border border-slate-200 shadow-sm space-y-3">
            <h4 className="text-xs font-bold text-[#0B2038] uppercase tracking-wider">
              Manual Status Override
            </h4>
            <div className="flex items-center gap-2">
              <select
                value={statusDropdown}
                onChange={(e) => setStatusDropdown(e.target.value as BookingStatus)}
                className="w-full text-xs font-semibold text-[#0B2038] bg-slate-50 border border-slate-200 rounded-xl px-3 py-2"
              >
                <option value="">Select status...</option>
                <option value="Pending">Pending</option>
                <option value="Finding Worker">Finding Worker</option>
                <option value="Worker Notified">Worker Notified</option>
                <option value="Accepted">Accepted</option>
                <option value="In Progress">In Progress</option>
                <option value="Completed">Completed</option>
                <option value="Cancelled">Cancelled</option>
              </select>
              {statusDropdown && (
                <button
                  onClick={() => handleStatusChange(statusDropdown as BookingStatus)}
                  className="px-3.5 py-2 bg-[#008A8E] text-white text-xs font-bold rounded-xl shrink-0 cursor-pointer shadow-xs"
                >
                  Apply
                </button>
              )}
            </div>
          </div>
        </div>
      </div>

      {/* GPS Dispatch Modal */}
      {isGpsModalOpen && (
        <GpsDispatchModal
          bookingId={booking.bookingId}
          isOpen={isGpsModalOpen}
          onClose={() => setIsGpsModalOpen(false)}
        />
      )}
    </div>
  );
};
