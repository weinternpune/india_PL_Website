import React, { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { useApp } from '../../context/AppContext';
import { BookingStatus, Booking } from '../../types';
import { StatusBadge } from '../../components/common/StatusBadge';
import { GpsDispatchModal } from '../../components/modals/GpsDispatchModal';
import { NewBookingModal } from '../../components/modals/NewBookingModal';
import {
  CalendarCheck2,
  Search,
  Filter,
  Plus,
  Compass,
  Eye,
  MapPin,
  Clock,
  User,
  Radio,
  Download,
} from 'lucide-react';

export const AdminBookingsPage: React.FC = () => {
  const { bookings, autoDispatchWorker } = useApp();
  const navigate = useNavigate();

  const [searchTerm, setSearchTerm] = useState('');
  const [statusFilter, setStatusFilter] = useState<string>('All');
  const [selectedBookingForGps, setSelectedBookingForGps] = useState<string | null>(null);
  const [isNewBookingModalOpen, setIsNewBookingModalOpen] = useState(false);

  const statuses: (BookingStatus | 'All')[] = [
    'All',
    'Pending',
    'Finding Worker',
    'Worker Notified',
    'Accepted',
    'In Progress',
    'Completed',
    'Cancelled',
  ];

  // Filter bookings
  const filteredBookings = bookings.filter((b) => {
    const matchesStatus = statusFilter === 'All' || b.status === statusFilter;
    const term = searchTerm.toLowerCase();
    const matchesSearch =
      b.bookingId.toLowerCase().includes(term) ||
      b.customerName.toLowerCase().includes(term) ||
      b.serviceName.toLowerCase().includes(term) ||
      b.customerLocation.city.toLowerCase().includes(term) ||
      b.customerLocation.address.toLowerCase().includes(term) ||
      (b.assignedWorkerName && b.assignedWorkerName.toLowerCase().includes(term));

    return matchesStatus && matchesSearch;
  });

  return (
    <div className="space-y-6">
      {/* Page Header */}
      <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4">
        <div>
          <h1 className="text-2xl font-extrabold text-[#0B2038]">Customer Bookings</h1>
          <p className="text-xs sm:text-sm text-[#5B738B] mt-0.5">
            Monitor, dispatch, and track doorstep service bookings in Bhubaneswar and Odisha
          </p>
        </div>

        <div className="flex items-center gap-3">
          <button
            onClick={() => setIsNewBookingModalOpen(true)}
            className="inline-flex items-center gap-2 px-5 py-2.5 rounded-full bg-[#009E9B] text-white text-xs font-bold hover:bg-[#00827F] shadow-sm transition-all"
          >
            <Plus className="w-4 h-4" />
            <span>Create Booking</span>
          </button>
        </div>
      </div>

      {/* Filters and Search Bar */}
      <div className="bg-white rounded-3xl p-5 border border-[#DCEEEB] shadow-2xs space-y-4">
        <div className="flex flex-col md:flex-row items-center justify-between gap-4">
          {/* Search Input */}
          <div className="w-full md:w-96 relative">
            <Search className="w-4 h-4 text-slate-400 absolute left-3.5 top-1/2 -translate-y-1/2" />
            <input
              type="text"
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              placeholder="Search by ID, customer, service, worker..."
              className="w-full pl-10 pr-4 py-2.5 bg-[#F8FCFC] border border-[#D1F0EE] rounded-2xl text-xs font-medium text-[#0B2038] placeholder-slate-400 focus:outline-none focus:border-[#009E9B] focus:bg-white transition-all"
            />
          </div>

          {/* Quick Stats Pill */}
          <div className="text-xs text-[#5B738B] font-medium flex items-center gap-2">
            <span>Showing {filteredBookings.length} of {bookings.length} Bookings</span>
          </div>
        </div>

        {/* Status Filter Tabs */}
        <div className="flex items-center gap-1.5 overflow-x-auto pb-1 scrollbar-none">
          {statuses.map((st) => (
            <button
              key={st}
              onClick={() => setStatusFilter(st)}
              className={`px-3.5 py-1.5 rounded-full text-xs font-semibold whitespace-nowrap transition-all ${
                statusFilter === st
                  ? 'bg-[#009E9B] text-white shadow-2xs'
                  : 'bg-slate-50 text-[#5B738B] hover:bg-teal-50 hover:text-[#009E9B]'
              }`}
            >
              {st}
            </button>
          ))}
        </div>
      </div>

      {/* Bookings Table (Columns strictly matching Part 5 of prompt) */}
      <div className="bg-white rounded-3xl border border-[#DCEEEB] shadow-2xs overflow-hidden">
        <div className="overflow-x-auto">
          <table className="w-full text-left text-xs">
            <thead>
              <tr className="bg-[#F8FCFC] border-b border-[#DCEEEB] text-[#5B738B] font-bold uppercase tracking-wider text-[11px]">
                <th className="py-3.5 pl-6">Booking ID</th>
                <th className="py-3.5 px-3">Customer</th>
                <th className="py-3.5 px-3">Service</th>
                <th className="py-3.5 px-3">Date</th>
                <th className="py-3.5 px-3">Time</th>
                <th className="py-3.5 px-3">Location</th>
                <th className="py-3.5 px-3">Worker</th>
                <th className="py-3.5 px-3">Distance</th>
                <th className="py-3.5 px-3">Status</th>
                <th className="py-3.5 px-3">Amount</th>
                <th className="py-3.5 pr-6 text-right">Actions</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-100">
              {filteredBookings.length === 0 ? (
                <tr>
                  <td colSpan={11} className="py-12 text-center text-slate-400">
                    No bookings found matching current filters.
                  </td>
                </tr>
              ) : (
                filteredBookings.map((b) => (
                  <tr
                    key={b.bookingId}
                    className="hover:bg-teal-50/20 transition-colors group cursor-pointer"
                    onClick={() => navigate(`/admin/bookings/${b.bookingId}`)}
                  >
                    {/* Booking ID */}
                    <td className="py-4 pl-6 font-mono font-bold text-[#0B2038]">
                      <span className="text-[#009E9B] group-hover:underline">
                        {b.bookingId}
                      </span>
                    </td>

                    {/* Customer */}
                    <td className="py-4 px-3" onClick={(e) => e.stopPropagation()}>
                      <Link
                        to={`/admin/customers/${b.customerId}`}
                        className="flex items-center gap-2 hover:text-[#009E9B]"
                      >
                        <img
                          src={b.customerAvatar}
                          alt={b.customerName}
                          className="w-7 h-7 rounded-full object-cover border border-slate-200 shrink-0"
                        />
                        <span className="font-semibold text-[#0B2038] truncate max-w-[120px]">
                          {b.customerName}
                        </span>
                      </Link>
                    </td>

                    {/* Service */}
                    <td className="py-4 px-3">
                      <span className="font-medium text-[#0B2038]">{b.serviceName}</span>
                    </td>

                    {/* Date */}
                    <td className="py-4 px-3 text-[#5B738B] whitespace-nowrap">{b.date}</td>

                    {/* Time */}
                    <td className="py-4 px-3 text-[#5B738B] whitespace-nowrap">{b.timeSlot}</td>

                    {/* Location */}
                    <td className="py-4 px-3 text-[#5B738B]">
                      <div className="flex items-center gap-1">
                        <MapPin className="w-3.5 h-3.5 text-[#009E9B] shrink-0" />
                        <span className="truncate max-w-[110px]">
                          {b.customerLocation.city}
                        </span>
                      </div>
                    </td>

                    {/* Worker */}
                    <td className="py-4 px-3">
                      {b.assignedWorkerName ? (
                        <div className="flex items-center gap-1.5">
                          <img
                            src={
                              b.assignedWorkerAvatar ||
                              'https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?auto=format&fit=crop&w=256&q=80'
                            }
                            alt={b.assignedWorkerName}
                            className="w-6 h-6 rounded-full object-cover border border-teal-200 shrink-0"
                          />
                          <span className="font-semibold text-[#0B2038] truncate max-w-[100px]">
                            {b.assignedWorkerName}
                          </span>
                        </div>
                      ) : (
                        <span className="text-slate-400 italic">Not Assigned</span>
                      )}
                    </td>

                    {/* Distance */}
                    <td className="py-4 px-3 whitespace-nowrap">
                      {b.workerDistance !== undefined ? (
                        <span className="font-bold text-[#009E9B]">
                          {b.workerDistance} km
                        </span>
                      ) : (
                        <span className="text-slate-400">—</span>
                      )}
                    </td>

                    {/* Status */}
                    <td className="py-4 px-3 whitespace-nowrap">
                      <StatusBadge status={b.status} size="sm" />
                    </td>

                    {/* Amount */}
                    <td className="py-4 px-3 font-extrabold text-[#0B2038] whitespace-nowrap">
                      ₹{b.totalAmount}
                    </td>

                    {/* Actions */}
                    <td
                      className="py-4 pr-6 text-right whitespace-nowrap"
                      onClick={(e) => e.stopPropagation()}
                    >
                      <div className="flex items-center justify-end gap-1.5">
                        <button
                          onClick={() => setSelectedBookingForGps(b.bookingId)}
                          className="px-2.5 py-1 rounded-lg bg-teal-50 text-[#009E9B] hover:bg-[#009E9B] hover:text-white transition-all font-semibold flex items-center gap-1 text-[11px]"
                          title="Trigger Automatic GPS Pro Assignment"
                        >
                          <Compass className="w-3.5 h-3.5" />
                          <span>GPS Dispatch</span>
                        </button>
                        <Link
                          to={`/admin/bookings/${b.bookingId}`}
                          className="p-1.5 text-slate-400 hover:text-[#0B2038] hover:bg-slate-100 rounded-lg transition-colors"
                          title="View Details"
                        >
                          <Eye className="w-4 h-4" />
                        </Link>
                      </div>
                    </td>
                  </tr>
                ))
              )}
            </tbody>
          </table>
        </div>
      </div>

      {/* GPS Dispatch Modal */}
      {selectedBookingForGps && (
        <GpsDispatchModal
          bookingId={selectedBookingForGps}
          isOpen={!!selectedBookingForGps}
          onClose={() => setSelectedBookingForGps(null)}
        />
      )}

      {/* New Booking Modal */}
      {isNewBookingModalOpen && (
        <NewBookingModal
          isOpen={isNewBookingModalOpen}
          onClose={() => setIsNewBookingModalOpen(false)}
          onCreated={(bookingId) => setSelectedBookingForGps(bookingId)}
        />
      )}
    </div>
  );
};
