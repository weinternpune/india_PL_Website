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
  User,
  ShieldCheck,
  Star,
  Compass,
  CheckCircle2,
  XCircle,
  Radio,
  FileText,
  CreditCard,
  History,
  Send,
  ExternalLink,
} from 'lucide-react';

export const AdminBookingDetailPage: React.FC = () => {
  const { id } = useParams<{ id: string }>();
  const navigate = useNavigate();
  const {
    getBookingById,
    updateBookingStatus,
    autoDispatchWorker,
    simulateWorkerResponse,
  } = useApp();

  const [isGpsModalOpen, setIsGpsModalOpen] = useState(false);
  const [statusDropdown, setStatusDropdown] = useState<BookingStatus | ''>('');

  const booking = getBookingById(id || '');

  if (!booking) {
    return (
      <div className="py-16 text-center space-y-4">
        <h2 className="text-xl font-bold text-[#0B2038]">Booking Not Found</h2>
        <p className="text-xs text-[#5B738B]">Could not locate booking identifier {id}.</p>
        <Link
          to="/admin/bookings"
          className="inline-flex items-center gap-2 px-4 py-2 rounded-full bg-[#009E9B] text-white text-xs font-bold"
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
            className="p-2 rounded-2xl bg-white border border-[#DCEEEB] text-slate-600 hover:text-[#009E9B] hover:bg-teal-50 transition-colors shadow-2xs"
          >
            <ArrowLeft className="w-4 h-4" />
          </button>
          <div>
            <div className="flex items-center gap-2">
              <h1 className="text-2xl font-extrabold text-[#0B2038]">
                Booking Details
              </h1>
              <span className="font-mono text-xs font-bold px-2.5 py-0.5 rounded-full bg-teal-100 text-[#00827F]">
                {booking.bookingId}
              </span>
            </div>
            <p className="text-xs text-[#5B738B]">
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
            className="inline-flex items-center gap-2 px-4 py-2 rounded-full bg-[#009E9B] text-white text-xs font-bold hover:bg-[#00827F] shadow-sm transition-all"
          >
            <Compass className="w-4 h-4 animate-spin" />
            <span>GPS Auto-Dispatch Engine</span>
          </button>
        </div>
      </div>

      {/* Main Grid: 2 Columns */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-6">
        {/* Left Column (8 cols): Service, Customer, Assigned Pro & History */}
        <div className="lg:col-span-8 space-y-6">
          {/* Selected Services Card matching PDF Page 8 & 9 */}
          <div className="bg-white rounded-3xl p-6 border border-[#DCEEEB] shadow-2xs space-y-4">
            <div className="flex items-center justify-between pb-3 border-b border-slate-100">
              <div>
                <span className="text-[11px] font-bold uppercase tracking-wider text-[#009E9B]">
                  Service Package
                </span>
                <h3 className="text-lg font-bold text-[#0B2038] mt-0.5">
                  {booking.serviceName}
                </h3>
              </div>
              <span className="text-xs font-semibold px-2.5 py-1 rounded-full bg-teal-50 text-[#00827F]">
                {booking.serviceCategory}
              </span>
            </div>

            {/* Selected sub-services */}
            <div className="space-y-2">
              <h4 className="text-xs font-bold text-[#5B738B] uppercase tracking-wider">
                Services Included
              </h4>
              <div className="divide-y divide-slate-100 border border-slate-100 rounded-2xl overflow-hidden">
                {booking.selectedServices.map((item, idx) => (
                  <div
                    key={idx}
                    className="p-3 bg-[#F8FCFC] flex items-center justify-between text-xs"
                  >
                    <div className="flex items-center gap-2">
                      <div className="w-5 h-5 rounded-full bg-teal-100 text-[#009E9B] flex items-center justify-center font-bold text-[10px]">
                        ✓
                      </div>
                      <span className="font-semibold text-[#0B2038]">{item.name}</span>
                    </div>
                    <span className="font-bold text-[#009E9B]">₹{item.price}</span>
                  </div>
                ))}
              </div>
            </div>

            {/* Timing & Duration details matching PDF Page 8 */}
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 pt-2">
              <div className="p-3.5 rounded-2xl bg-[#F4FBFB] border border-[#DCEEEB] flex items-center gap-3">
                <div className="w-9 h-9 rounded-xl bg-teal-100 text-[#009E9B] flex items-center justify-center">
                  <Calendar className="w-4 h-4" />
                </div>
                <div>
                  <span className="text-[11px] font-semibold text-slate-400 block">Date & Time</span>
                  <span className="text-xs font-bold text-[#0B2038]">
                    {booking.date} • {booking.timeSlot}
                  </span>
                </div>
              </div>

              <div className="p-3.5 rounded-2xl bg-[#F4FBFB] border border-[#DCEEEB] flex items-center gap-3">
                <div className="w-9 h-9 rounded-xl bg-teal-100 text-[#009E9B] flex items-center justify-center">
                  <Clock className="w-4 h-4" />
                </div>
                <div>
                  <span className="text-[11px] font-semibold text-slate-400 block">Estimated Duration</span>
                  <span className="text-xs font-bold text-[#0B2038]">
                    {booking.estimatedDuration}
                  </span>
                </div>
              </div>
            </div>
          </div>

          {/* Assigned Professional Card matching PDF Page 9 */}
          <div className="bg-white rounded-3xl p-6 border border-[#DCEEEB] shadow-2xs space-y-4">
            <div className="flex items-center justify-between pb-3 border-b border-slate-100">
              <div>
                <span className="text-[11px] font-bold uppercase tracking-wider text-[#009E9B]">
                  Assigned Professional
                </span>
                <h3 className="text-base font-bold text-[#0B2038] mt-0.5">
                  Doorstep Service Executive
                </h3>
              </div>
              {booking.workerDistance !== undefined && (
                <span className="text-xs font-bold px-3 py-1 rounded-full bg-teal-50 text-[#00827F] border border-teal-200">
                  {booking.workerDistance} km from customer
                </span>
              )}
            </div>

            {booking.assignedWorkerName ? (
              <div className="space-y-4">
                <div className="p-4 rounded-2xl bg-teal-50/40 border border-teal-200 flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4">
                  <div className="flex items-center gap-3.5">
                    <img
                      src={
                        booking.assignedWorkerAvatar ||
                        'https://images.unsplash.com/photo-1506794778202-cad84cf45f1d?auto=format&fit=crop&w=256&q=80'
                      }
                      alt={booking.assignedWorkerName}
                      className="w-14 h-14 rounded-2xl object-cover border-2 border-[#009E9B]"
                    />
                    <div>
                      <div className="flex items-center gap-2">
                        <h4 className="text-base font-bold text-[#0B2038]">
                          {booking.assignedWorkerName}
                        </h4>
                        <span className="inline-flex items-center gap-1 text-[10px] font-bold text-teal-800 bg-teal-100 px-2 py-0.5 rounded-full">
                          <ShieldCheck className="w-3 h-3 text-[#009E9B]" />
                          Verified Pro
                        </span>
                      </div>
                      <div className="flex items-center gap-3 text-xs text-[#5B738B] mt-1">
                        <span className="flex items-center gap-1">
                          <Phone className="w-3 h-3 text-[#009E9B]" />
                          {booking.assignedWorkerPhone}
                        </span>
                        <span>•</span>
                        <span className="flex items-center text-amber-500 font-bold">
                          <Star className="w-3 h-3 fill-current mr-0.5" />
                          {booking.assignedWorkerRating || 4.8}
                        </span>
                      </div>
                    </div>
                  </div>

                  <Link
                    to={`/admin/workers/${booking.assignedWorkerId}`}
                    className="px-3.5 py-1.5 rounded-full bg-white text-[#009E9B] border border-teal-300 text-xs font-bold hover:bg-teal-50 transition-colors"
                  >
                    View Pro Profile →
                  </Link>
                </div>

                {/* Worker Simulated Response Buttons */}
                {booking.status === 'Worker Notified' && (
                  <div className="p-3.5 rounded-2xl bg-amber-50 border border-amber-200 flex items-center justify-between flex-wrap gap-2 text-xs">
                    <span className="text-amber-900 font-semibold flex items-center gap-1.5">
                      <Radio className="w-4 h-4 text-amber-600 animate-pulse" />
                      Job request sent. Awaiting pro acceptance...
                    </span>
                    <div className="flex items-center gap-2">
                      <button
                        onClick={() => simulateWorkerResponse(booking.bookingId, true)}
                        className="px-3 py-1.5 rounded-full bg-emerald-600 text-white font-bold hover:bg-emerald-700 shadow-2xs"
                      >
                        Accept
                      </button>
                      <button
                        onClick={() => simulateWorkerResponse(booking.bookingId, false)}
                        className="px-3 py-1.5 rounded-full bg-rose-600 text-white font-bold hover:bg-rose-700 shadow-2xs"
                      >
                        Decline & Reassign
                      </button>
                    </div>
                  </div>
                )}
              </div>
            ) : (
              <div className="p-6 rounded-2xl border-2 border-dashed border-slate-200 text-center space-y-3">
                <Compass className="w-8 h-8 text-[#009E9B] mx-auto animate-pulse" />
                <div>
                  <h4 className="text-sm font-bold text-[#0B2038]">No Pro Assigned</h4>
                  <p className="text-xs text-[#5B738B]">
                    Run automatic Haversine GPS matching to calculate nearest available worker in Bhubaneswar.
                  </p>
                </div>
                <button
                  onClick={() => setIsGpsModalOpen(true)}
                  className="px-5 py-2 rounded-full bg-[#009E9B] text-white text-xs font-bold hover:bg-[#00827F] shadow-sm"
                >
                  Auto-Assign Nearest Worker Now
                </button>
              </div>
            )}
          </div>

          {/* Timeline and History */}
          <div className="bg-white rounded-3xl p-6 border border-[#DCEEEB] shadow-2xs space-y-4">
            <h3 className="text-base font-bold text-[#0B2038]">
              Lifecycle Event Log & History
            </h3>
            <div className="relative pl-6 space-y-6 before:absolute before:left-2 before:top-2 before:bottom-2 before:w-0.5 before:bg-teal-100">
              {booking.history.map((event, idx) => (
                <div key={idx} className="relative">
                  {/* Dot */}
                  <span className="absolute -left-6 top-1 w-4 h-4 rounded-full bg-white border-2 border-[#009E9B] flex items-center justify-center">
                    <span className="w-1.5 h-1.5 rounded-full bg-[#009E9B]" />
                  </span>
                  <div>
                    <div className="flex items-center gap-2">
                      <span className="text-xs font-bold text-[#0B2038]">{event.status}</span>
                      <span className="text-[10px] text-slate-400 font-mono">
                        {event.timestamp}
                      </span>
                    </div>
                    <p className="text-xs text-[#5B738B] mt-0.5 leading-relaxed">{event.note}</p>
                  </div>
                </div>
              ))}
            </div>
          </div>
        </div>

        {/* Right Column (4 cols): Customer Details, Address, GPS Map Card, Payment Breakdown */}
        <div className="lg:col-span-4 space-y-6">
          {/* Customer Profile Card matching PDF Page 10 */}
          <div className="bg-white rounded-3xl p-6 border border-[#DCEEEB] shadow-2xs space-y-4">
            <div className="flex items-center justify-between pb-3 border-b border-slate-100">
              <span className="text-xs font-bold text-[#5B738B] uppercase tracking-wider">
                Customer Profile
              </span>
              <Link
                to={`/admin/customers/${booking.customerId}`}
                className="text-xs font-bold text-[#009E9B] hover:text-[#00827F]"
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
                <h4 className="text-sm font-bold text-[#0B2038]">{booking.customerName}</h4>
                <span className="inline-block text-[10px] font-bold text-[#009E9B] bg-teal-50 px-2 py-0.5 rounded-full border border-teal-200">
                  Premium Member
                </span>
              </div>
            </div>

            <div className="space-y-2 text-xs text-[#5B738B] pt-2 border-t border-slate-100">
              <div className="flex items-center gap-2">
                <Phone className="w-3.5 h-3.5 text-[#009E9B]" />
                <span className="text-[#0B2038] font-medium">{booking.customerPhone}</span>
              </div>
              <div className="flex items-center gap-2">
                <Mail className="w-3.5 h-3.5 text-[#009E9B]" />
                <span className="text-[#0B2038] font-medium">{booking.customerEmail}</span>
              </div>
            </div>
          </div>

          {/* Service Address & GPS Card matching PDF Page 8 & 9 */}
          <div className="bg-white rounded-3xl p-6 border border-[#DCEEEB] shadow-2xs space-y-4">
            <div className="flex items-center justify-between pb-2 border-b border-slate-100">
              <span className="text-xs font-bold text-[#5B738B] uppercase tracking-wider">
                Service Address & GPS
              </span>
              <span className="text-[11px] font-mono font-bold text-[#009E9B]">
                {booking.customerLocation.city}
              </span>
            </div>

            <div className="flex items-start gap-3">
              <div className="w-8 h-8 rounded-xl bg-teal-50 text-[#009E9B] flex items-center justify-center shrink-0 mt-0.5">
                <MapPin className="w-4 h-4" />
              </div>
              <div>
                <h5 className="text-xs font-bold text-[#0B2038]">Home Location</h5>
                <p className="text-xs text-[#5B738B] mt-0.5 leading-relaxed">
                  {booking.customerLocation.address}, {booking.customerLocation.city}, {booking.customerLocation.state} - {booking.customerLocation.pincode}
                </p>
              </div>
            </div>

            {/* Stylized Visual Map Preview */}
            <div className="p-3.5 rounded-2xl bg-[#E6F7F5] border border-[#BDEAE5] space-y-2">
              <div className="flex items-center justify-between text-xs">
                <span className="font-bold text-[#00827F]">GPS Coordinates</span>
                <span className="font-mono text-[11px] text-[#00827F]">
                  {booking.customerLocation.latitude.toFixed(4)}° N,{' '}
                  {booking.customerLocation.longitude.toFixed(4)}° E
                </span>
              </div>
              <div className="h-20 bg-teal-100/60 rounded-xl flex items-center justify-center border border-teal-200 relative overflow-hidden">
                <div className="absolute inset-0 opacity-20 bg-[radial-gradient(#009E9B_1px,transparent_1px)] [background-size:8px_8px]" />
                <div className="relative flex items-center gap-1.5 text-xs font-bold text-[#00827F]">
                  <Compass className="w-4 h-4 text-[#009E9B]" />
                  <span>Patia Geo-Cluster</span>
                </div>
              </div>
            </div>
          </div>

          {/* Price Details Card matching PDF Page 8 */}
          <div className="bg-white rounded-3xl p-6 border border-[#DCEEEB] shadow-2xs space-y-4">
            <h3 className="text-sm font-bold text-[#0B2038] uppercase tracking-wider pb-2 border-b border-slate-100">
              Price Details
            </h3>

            <div className="space-y-2 text-xs">
              <div className="flex justify-between text-[#5B738B]">
                <span>Service Subtotal</span>
                <span className="font-semibold text-[#0B2038]">₹{booking.subtotal}</span>
              </div>
              <div className="flex justify-between text-[#5B738B]">
                <span>Platform Convenience Fee</span>
                <span className="font-semibold text-[#0B2038]">₹{booking.convenienceFee}</span>
              </div>
              <div className="pt-2 border-t border-slate-100 flex justify-between items-center text-sm">
                <span className="font-bold text-[#0B2038]">Total Amount</span>
                <span className="text-lg font-extrabold text-[#009E9B]">
                  ₹{booking.totalAmount}
                </span>
              </div>
            </div>

            <div className="pt-3 border-t border-slate-100 flex items-center justify-between text-xs">
              <div className="flex items-center gap-1.5 text-[#5B738B]">
                <CreditCard className="w-3.5 h-3.5 text-[#009E9B]" />
                <span>{booking.paymentMethod}</span>
              </div>
              <StatusBadge status={booking.paymentStatus} type="payment" size="sm" />
            </div>
          </div>

          {/* Manual Ops Override */}
          <div className="bg-white rounded-3xl p-5 border border-[#DCEEEB] shadow-2xs space-y-3">
            <h4 className="text-xs font-bold text-[#0B2038] uppercase tracking-wider">
              Manual Status Override
            </h4>
            <div className="flex items-center gap-2">
              <select
                value={statusDropdown}
                onChange={(e) => setStatusDropdown(e.target.value as BookingStatus)}
                className="w-full text-xs font-medium bg-slate-50 border border-slate-200 rounded-xl px-3 py-2"
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
                  className="px-3 py-2 bg-[#009E9B] text-white text-xs font-bold rounded-xl shrink-0"
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
