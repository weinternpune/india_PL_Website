import React from 'react';
import { useParams, Link, useNavigate } from 'react-router-dom';
import { useApp } from '../../context/AppContext';
import { StatusBadge } from '../../components/common/StatusBadge';
import {
  ArrowLeft,
  MapPin,
  Phone,
  Mail,
  Eye,
  Building2,
  Home,
} from 'lucide-react';

export const AdminCustomerDetailPage: React.FC = () => {
  const { id } = useParams<{ id: string }>();
  const navigate = useNavigate();
  const { getCustomerById, bookings } = useApp();

  const customer = getCustomerById(id || '');

  if (!customer) {
    return (
      <div className="py-16 text-center space-y-4">
        <h2 className="text-xl font-black text-[#0B2038]">Customer Not Found</h2>
        <p className="text-xs font-semibold text-slate-800">Could not locate customer with ID {id}.</p>
        <Link
          to="/admin/customers"
          className="inline-flex items-center gap-2 px-4 py-2 rounded-xl bg-[#008A8E] text-white text-xs font-bold"
        >
          <ArrowLeft className="w-4 h-4" />
          <span>Back to Customers</span>
        </Link>
      </div>
    );
  }

  // Find all bookings for this customer
  const customerBookings = bookings.filter((b) => b.customerId === customer.customerId);

  return (
    <div className="space-y-6 max-w-6xl mx-auto">
      {/* Top Navigation */}
      <div className="flex items-center justify-between">
        <div className="flex items-center gap-3">
          <button
            onClick={() => navigate('/admin/customers')}
            className="p-2 rounded-xl bg-white border border-slate-200 text-[#0B2038] hover:text-[#008A8E] hover:bg-teal-50 transition-colors shadow-xs cursor-pointer"
          >
            <ArrowLeft className="w-4 h-4" />
          </button>
          <div>
            <div className="flex items-center gap-2">
              <h1 className="text-2xl font-black text-[#0B2038] tracking-tight">{customer.name}</h1>
              <span className="font-mono text-xs font-bold px-2.5 py-0.5 rounded-full bg-teal-100 text-[#008A8E] border border-teal-200">
                {customer.customerId}
              </span>
            </div>
            <p className="text-xs font-semibold text-slate-800 mt-0.5">
              Registered Client since {customer.joinDate} • {customer.location}
            </p>
          </div>
        </div>

        <div className="flex items-center gap-2">
          {customer.isPremium && (
            <span className="px-3 py-1 rounded-full bg-teal-50 text-[#008A8E] border border-teal-200 text-xs font-bold">
              ★ Premium Member
            </span>
          )}
        </div>
      </div>

      {/* Grid: 2 Columns */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-6">
        {/* Left Column (4 cols): Profile & Saved Addresses */}
        <div className="lg:col-span-4 space-y-6">
          {/* Profile Card */}
          <div className="bg-white rounded-2xl p-6 border border-slate-200 shadow-sm text-center space-y-4">
            <img
              src={customer.avatar}
              alt={customer.name}
              className="w-24 h-24 rounded-full object-cover border-4 border-teal-100 mx-auto shadow-sm"
            />
            <div>
              <h3 className="text-lg font-black text-[#0B2038]">{customer.name}</h3>
              <p className="text-xs font-bold text-slate-800">{customer.location}</p>
            </div>

            <div className="space-y-2.5 text-xs text-slate-800 text-left pt-3 border-t border-slate-200">
              <div className="flex items-center gap-2.5">
                <Phone className="w-4 h-4 text-[#008A8E] shrink-0" />
                <span className="text-[#0B2038] font-bold">{customer.phone}</span>
              </div>
              <div className="flex items-center gap-2.5">
                <Mail className="w-4 h-4 text-[#008A8E] shrink-0" />
                <span className="text-[#0B2038] font-bold truncate">{customer.email}</span>
              </div>
              <div className="flex items-center gap-2.5">
                <MapPin className="w-4 h-4 text-[#008A8E] shrink-0" />
                <span className="text-[#0B2038] font-bold">{customer.location}</span>
              </div>
            </div>
          </div>

          {/* Saved Addresses */}
          <div className="bg-white rounded-2xl p-6 border border-slate-200 shadow-sm space-y-4">
            <div className="flex items-center justify-between pb-2 border-b border-slate-200">
              <h3 className="text-xs font-bold text-[#0B2038] uppercase tracking-wider">
                Saved Addresses ({customer.addresses.length})
              </h3>
            </div>

            <div className="space-y-3">
              {customer.addresses.map((addr) => (
                <div
                  key={addr.id}
                  className="p-3.5 rounded-xl bg-slate-50 border border-slate-200 space-y-2"
                >
                  <div className="flex items-center justify-between">
                    <div className="flex items-center gap-2">
                      <div className="w-7 h-7 rounded-lg bg-teal-100 text-[#008A8E] flex items-center justify-center">
                        {addr.label === 'Home' ? (
                          <Home className="w-3.5 h-3.5" />
                        ) : (
                          <Building2 className="w-3.5 h-3.5" />
                        )}
                      </div>
                      <span className="text-xs font-bold text-[#0B2038]">{addr.label}</span>
                    </div>

                    {addr.isDefault && (
                      <span className="text-[10px] font-bold px-2 py-0.5 rounded-full bg-emerald-50 text-emerald-900 border border-emerald-300">
                        Default Address
                      </span>
                    )}
                  </div>

                  <p className="text-xs text-slate-800 font-medium leading-relaxed">
                    {addr.addressLine}, {addr.city}, {addr.state} - {addr.pincode}
                  </p>

                  <div className="text-[10px] font-mono font-bold text-slate-700">
                    GPS: {addr.latitude.toFixed(4)}° N, {addr.longitude.toFixed(4)}° E
                  </div>
                </div>
              ))}
            </div>
          </div>
        </div>

        {/* Right Column (8 cols): Metrics, Booking History, and Payment History */}
        <div className="lg:col-span-8 space-y-6">
          {/* Customer Lifetime Metrics */}
          <div className="grid grid-cols-2 sm:grid-cols-4 gap-3">
            <div className="bg-white rounded-xl p-4 border border-slate-200 shadow-sm">
              <span className="text-[11px] font-bold text-[#0B2038] block">Total Bookings</span>
              <span className="text-2xl font-black text-[#0B2038] mt-1 block">
                {customer.totalBookings}
              </span>
              <span className="text-[10px] font-bold text-slate-700">Doorstep orders</span>
            </div>

            <div className="bg-white rounded-xl p-4 border border-slate-200 shadow-sm">
              <span className="text-[11px] font-bold text-[#0B2038] block">Completed</span>
              <span className="text-2xl font-black text-emerald-800 mt-1 block">
                {customer.completedBookings}
              </span>
              <span className="text-[10px] font-bold text-slate-700">100% verified</span>
            </div>

            <div className="bg-white rounded-xl p-4 border border-slate-200 shadow-sm">
              <span className="text-[11px] font-bold text-[#0B2038] block">Cancelled</span>
              <span className="text-2xl font-black text-rose-800 mt-1 block">
                {customer.cancelledBookings}
              </span>
              <span className="text-[10px] font-bold text-slate-700">Customer requests</span>
            </div>

            <div className="bg-white rounded-xl p-4 border border-slate-200 shadow-sm">
              <span className="text-[11px] font-bold text-[#0B2038] block">Total Spent</span>
              <span className="text-2xl font-black text-[#008A8E] mt-1 block">
                ₹{customer.totalSpent.toLocaleString('en-IN')}
              </span>
              <span className="text-[10px] font-bold text-slate-700">Lifetime value</span>
            </div>
          </div>

          {/* Booking History Table */}
          <div className="bg-white rounded-2xl p-6 border border-slate-200 shadow-sm space-y-4">
            <h3 className="text-base font-black text-[#0B2038]">
              Booking History for {customer.name}
            </h3>

            {customerBookings.length === 0 ? (
              <p className="text-xs font-semibold text-slate-700 py-6 text-center">
                No active bookings recorded in this session.
              </p>
            ) : (
              <div className="overflow-x-auto">
                <table className="w-full text-left text-xs">
                  <thead>
                    <tr className="border-b border-slate-200 text-[#0B2038] font-bold uppercase tracking-wider text-[11px]">
                      <th className="pb-3">Booking ID</th>
                      <th className="pb-3">Service</th>
                      <th className="pb-3">Date & Slot</th>
                      <th className="pb-3">Assigned Pro</th>
                      <th className="pb-3">Amount</th>
                      <th className="pb-3">Status</th>
                      <th className="pb-3 text-right">Action</th>
                    </tr>
                  </thead>
                  <tbody className="divide-y divide-slate-100">
                    {customerBookings.map((b) => (
                      <tr key={b.bookingId} className="hover:bg-slate-50 transition-colors">
                        <td className="py-3 font-mono font-bold text-[#008A8E]">
                          <Link to={`/admin/bookings/${b.bookingId}`} className="hover:underline">
                            {b.bookingId}
                          </Link>
                        </td>
                        <td className="py-3 font-bold text-[#0B2038]">{b.serviceName}</td>
                        <td className="py-3 text-slate-800 font-semibold whitespace-nowrap">
                          {b.date} • {b.timeSlot}
                        </td>
                        <td className="py-3 text-[#0B2038] font-bold">
                          {b.assignedWorkerName || <span className="text-slate-500 font-medium italic">None</span>}
                        </td>
                        <td className="py-3 font-black text-[#0B2038]">₹{b.totalAmount}</td>
                        <td className="py-3">
                          <StatusBadge status={b.status} size="sm" />
                        </td>
                        <td className="py-3 text-right">
                          <Link
                            to={`/admin/bookings/${b.bookingId}`}
                            className="p-1.5 text-slate-600 hover:text-[#008A8E] hover:bg-teal-50 rounded-lg inline-flex"
                          >
                            <Eye className="w-4 h-4" />
                          </Link>
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            )}
          </div>

          {/* Payment Methods & History */}
          <div className="bg-white rounded-2xl p-6 border border-slate-200 shadow-sm space-y-4">
            <div className="flex items-center justify-between pb-2 border-b border-slate-200">
              <h3 className="text-base font-black text-[#0B2038]">
                Payment Preferences & History
              </h3>
              <span className="text-xs font-bold text-emerald-900 bg-emerald-50 px-2.5 py-0.5 rounded-full border border-emerald-300">
                100% Encrypted & Safe
              </span>
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
              <div className="p-3.5 rounded-xl bg-slate-50 border border-slate-200 space-y-1 text-xs">
                <span className="font-bold text-[#0B2038] block">Primary Online Method</span>
                <p className="text-slate-800 font-medium">UPI (GPay, PhonePe, Paytm)</p>
                <span className="text-[10px] text-emerald-700 font-bold block pt-1">
                  ✓ Instant Verification
                </span>
              </div>
              <div className="p-3.5 rounded-xl bg-slate-50 border border-slate-200 space-y-1 text-xs">
                <span className="font-bold text-[#0B2038] block">Backup Method</span>
                <p className="text-slate-800 font-medium">Credit / Debit Card (VISA, RuPay)</p>
                <span className="text-[10px] text-slate-700 font-bold block pt-1">Card ending •••• 4210</span>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};
