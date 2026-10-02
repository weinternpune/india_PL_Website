import React from 'react';
import { useParams, Link, useNavigate } from 'react-router-dom';
import { useApp } from '../../context/AppContext';
import { StatusBadge } from '../../components/common/StatusBadge';
import {
  ArrowLeft,
  MapPin,
  Phone,
  Mail,
  Calendar,
  CreditCard,
  CheckCircle2,
  XCircle,
  Eye,
  Trash2,
  Edit2,
  Building2,
  Home,
  Star,
  Clock,
} from 'lucide-react';

export const AdminCustomerDetailPage: React.FC = () => {
  const { id } = useParams<{ id: string }>();
  const navigate = useNavigate();
  const { getCustomerById, bookings } = useApp();

  const customer = getCustomerById(id || '');

  if (!customer) {
    return (
      <div className="py-16 text-center space-y-4">
        <h2 className="text-xl font-bold text-[#0B2038]">Customer Not Found</h2>
        <p className="text-xs text-[#5B738B]">Could not locate customer with ID {id}.</p>
        <Link
          to="/admin/customers"
          className="inline-flex items-center gap-2 px-4 py-2 rounded-full bg-[#009E9B] text-white text-xs font-bold"
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
            className="p-2 rounded-2xl bg-white border border-[#DCEEEB] text-slate-600 hover:text-[#009E9B] hover:bg-teal-50 transition-colors shadow-2xs"
          >
            <ArrowLeft className="w-4 h-4" />
          </button>
          <div>
            <div className="flex items-center gap-2">
              <h1 className="text-2xl font-extrabold text-[#0B2038]">{customer.name}</h1>
              <span className="font-mono text-xs font-bold px-2 py-0.5 rounded-full bg-teal-100 text-[#00827F]">
                {customer.customerId}
              </span>
            </div>
            <p className="text-xs text-[#5B738B]">
              Registered Client since {customer.joinDate} • {customer.location}
            </p>
          </div>
        </div>

        <div className="flex items-center gap-2">
          {customer.isPremium && (
            <span className="px-3 py-1 rounded-full bg-teal-50 text-[#009E9B] border border-teal-200 text-xs font-bold">
              ★ Premium Member
            </span>
          )}
        </div>
      </div>

      {/* Grid: 2 Columns */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-6">
        {/* Left Column (4 cols): Profile & Saved Addresses matching PDF Page 10 & 11 */}
        <div className="lg:col-span-4 space-y-6">
          {/* Profile Card matching PDF Page 10 */}
          <div className="bg-white rounded-3xl p-6 border border-[#DCEEEB] shadow-2xs text-center space-y-4">
            <img
              src={customer.avatar}
              alt={customer.name}
              className="w-24 h-24 rounded-full object-cover border-4 border-teal-100 mx-auto shadow-sm"
            />
            <div>
              <h3 className="text-lg font-bold text-[#0B2038]">{customer.name}</h3>
              <p className="text-xs text-[#5B738B]">{customer.location}</p>
            </div>

            <div className="space-y-2.5 text-xs text-[#5B738B] text-left pt-3 border-t border-slate-100">
              <div className="flex items-center gap-2.5">
                <Phone className="w-4 h-4 text-[#009E9B]" />
                <span className="text-[#0B2038] font-medium">{customer.phone}</span>
              </div>
              <div className="flex items-center gap-2.5">
                <Mail className="w-4 h-4 text-[#009E9B]" />
                <span className="text-[#0B2038] font-medium truncate">{customer.email}</span>
              </div>
              <div className="flex items-center gap-2.5">
                <MapPin className="w-4 h-4 text-[#009E9B]" />
                <span className="text-[#0B2038] font-medium">{customer.location}</span>
              </div>
            </div>
          </div>

          {/* Saved Addresses matching PDF Page 11 */}
          <div className="bg-white rounded-3xl p-6 border border-[#DCEEEB] shadow-2xs space-y-4">
            <div className="flex items-center justify-between pb-2 border-b border-slate-100">
              <h3 className="text-xs font-bold text-[#0B2038] uppercase tracking-wider">
                Saved Addresses ({customer.addresses.length})
              </h3>
              <span className="text-[10px] text-[#009E9B] font-bold">PDF Reference</span>
            </div>

            <div className="space-y-3">
              {customer.addresses.map((addr) => (
                <div
                  key={addr.id}
                  className="p-3.5 rounded-2xl bg-[#F8FCFC] border border-[#DCEEEB] space-y-2"
                >
                  <div className="flex items-center justify-between">
                    <div className="flex items-center gap-2">
                      <div className="w-7 h-7 rounded-xl bg-teal-100 text-[#009E9B] flex items-center justify-center">
                        {addr.label === 'Home' ? (
                          <Home className="w-3.5 h-3.5" />
                        ) : (
                          <Building2 className="w-3.5 h-3.5" />
                        )}
                      </div>
                      <span className="text-xs font-bold text-[#0B2038]">{addr.label}</span>
                    </div>

                    {addr.isDefault && (
                      <span className="text-[10px] font-bold px-2 py-0.5 rounded-full bg-emerald-50 text-emerald-700 border border-emerald-200">
                        Default Address
                      </span>
                    )}
                  </div>

                  <p className="text-xs text-[#5B738B] leading-relaxed">
                    {addr.addressLine}, {addr.city}, {addr.state} - {addr.pincode}
                  </p>

                  <div className="text-[10px] font-mono text-slate-400">
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
          <div className="grid grid-cols-2 sm:grid-cols-4 gap-4">
            <div className="bg-white rounded-2xl p-4 border border-[#DCEEEB] shadow-2xs">
              <span className="text-[11px] font-semibold text-[#5B738B] block">Total Bookings</span>
              <span className="text-2xl font-extrabold text-[#0B2038] mt-1 block">
                {customer.totalBookings}
              </span>
              <span className="text-[10px] text-slate-400">Doorstep orders</span>
            </div>

            <div className="bg-white rounded-2xl p-4 border border-[#DCEEEB] shadow-2xs">
              <span className="text-[11px] font-semibold text-[#5B738B] block">Completed</span>
              <span className="text-2xl font-extrabold text-emerald-700 mt-1 block">
                {customer.completedBookings}
              </span>
              <span className="text-[10px] text-slate-400">100% verified</span>
            </div>

            <div className="bg-white rounded-2xl p-4 border border-[#DCEEEB] shadow-2xs">
              <span className="text-[11px] font-semibold text-[#5B738B] block">Cancelled</span>
              <span className="text-2xl font-extrabold text-rose-600 mt-1 block">
                {customer.cancelledBookings}
              </span>
              <span className="text-[10px] text-slate-400">Customer requests</span>
            </div>

            <div className="bg-white rounded-2xl p-4 border border-[#DCEEEB] shadow-2xs">
              <span className="text-[11px] font-semibold text-[#5B738B] block">Total Spent</span>
              <span className="text-2xl font-extrabold text-[#009E9B] mt-1 block">
                ₹{customer.totalSpent.toLocaleString('en-IN')}
              </span>
              <span className="text-[10px] text-slate-400">Lifetime value</span>
            </div>
          </div>

          {/* Booking History Table */}
          <div className="bg-white rounded-3xl p-6 border border-[#DCEEEB] shadow-2xs space-y-4">
            <h3 className="text-base font-bold text-[#0B2038]">
              Booking History for {customer.name}
            </h3>

            {customerBookings.length === 0 ? (
              <p className="text-xs text-slate-400 py-6 text-center">
                No active bookings recorded in this session.
              </p>
            ) : (
              <div className="overflow-x-auto">
                <table className="w-full text-left text-xs">
                  <thead>
                    <tr className="border-b border-[#DCEEEB] text-[#5B738B] font-bold uppercase tracking-wider text-[11px]">
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
                        <td className="py-3 font-mono font-bold text-[#009E9B]">
                          <Link to={`/admin/bookings/${b.bookingId}`} className="hover:underline">
                            {b.bookingId}
                          </Link>
                        </td>
                        <td className="py-3 font-semibold text-[#0B2038]">{b.serviceName}</td>
                        <td className="py-3 text-[#5B738B]">
                          {b.date} • {b.timeSlot}
                        </td>
                        <td className="py-3 text-[#0B2038]">
                          {b.assignedWorkerName || <span className="text-slate-400 italic">None</span>}
                        </td>
                        <td className="py-3 font-bold text-[#0B2038]">₹{b.totalAmount}</td>
                        <td className="py-3">
                          <StatusBadge status={b.status} size="sm" />
                        </td>
                        <td className="py-3 text-right">
                          <Link
                            to={`/admin/bookings/${b.bookingId}`}
                            className="p-1.5 text-slate-400 hover:text-[#009E9B] hover:bg-teal-50 rounded-lg inline-flex"
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

          {/* Payment Methods & History matching PDF Page 12 */}
          <div className="bg-white rounded-3xl p-6 border border-[#DCEEEB] shadow-2xs space-y-4">
            <div className="flex items-center justify-between pb-2 border-b border-slate-100">
              <h3 className="text-base font-bold text-[#0B2038]">
                Payment Preferences & History (PDF Reference)
              </h3>
              <span className="text-xs font-semibold text-emerald-700 bg-emerald-50 px-2.5 py-0.5 rounded-full border border-emerald-200">
                100% Encrypted & Safe
              </span>
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
              <div className="p-3.5 rounded-2xl bg-[#F8FCFC] border border-[#DCEEEB] space-y-1 text-xs">
                <span className="font-bold text-[#0B2038] block">Primary Online Method</span>
                <p className="text-[#5B738B]">UPI (GPay, PhonePe, Paytm)</p>
                <span className="text-[10px] text-emerald-600 font-bold block pt-1">
                  ✓ Instant Verification
                </span>
              </div>
              <div className="p-3.5 rounded-2xl bg-[#F8FCFC] border border-[#DCEEEB] space-y-1 text-xs">
                <span className="font-bold text-[#0B2038] block">Backup Method</span>
                <p className="text-[#5B738B]">Credit / Debit Card (VISA, RuPay)</p>
                <span className="text-[10px] text-slate-400 block pt-1">Card ending •••• 4210</span>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};
