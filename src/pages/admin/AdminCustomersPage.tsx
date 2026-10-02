import React, { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { useApp } from '../../context/AppContext';
import { Customer } from '../../types';
import {
  UserCheck,
  Search,
  MapPin,
  Phone,
  Mail,
  Calendar,
  Eye,
  CreditCard,
  CheckCircle2,
  XCircle,
} from 'lucide-react';

export const AdminCustomersPage: React.FC = () => {
  const { customers } = useApp();
  const navigate = useNavigate();
  const [searchTerm, setSearchTerm] = useState('');

  const filteredCustomers = customers.filter((c) => {
    const term = searchTerm.toLowerCase();
    return (
      c.name.toLowerCase().includes(term) ||
      c.customerId.toLowerCase().includes(term) ||
      c.phone.includes(term) ||
      c.email.toLowerCase().includes(term) ||
      c.location.toLowerCase().includes(term)
    );
  });

  return (
    <div className="space-y-6">
      {/* Page Header */}
      <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4">
        <div>
          <h1 className="text-2xl font-extrabold text-[#0B2038]">Registered Customers</h1>
          <p className="text-xs sm:text-sm text-[#5B738B] mt-0.5">
            Monitor client retention, booking frequency, and registered doorstep locations
          </p>
        </div>

        <div className="text-xs text-[#5B738B] font-semibold bg-white px-4 py-2 rounded-full border border-[#DCEEEB]">
          Total Customers: <span className="text-[#009E9B] font-bold">{customers.length}</span>
        </div>
      </div>

      {/* Search Bar */}
      <div className="bg-white rounded-3xl p-5 border border-[#DCEEEB] shadow-2xs flex flex-col sm:flex-row items-center justify-between gap-4">
        <div className="w-full sm:w-96 relative">
          <Search className="w-4 h-4 text-slate-400 absolute left-3.5 top-1/2 -translate-y-1/2" />
          <input
            type="text"
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            placeholder="Search by name, customer ID, phone, email..."
            className="w-full pl-10 pr-4 py-2.5 bg-[#F8FCFC] border border-[#D1F0EE] rounded-2xl text-xs font-medium text-[#0B2038] placeholder-slate-400 focus:outline-none focus:border-[#009E9B] focus:bg-white"
          />
        </div>

        <span className="text-xs text-[#5B738B] font-medium">
          Showing {filteredCustomers.length} active customer accounts
        </span>
      </div>

      {/* Customer Table matching Part 9 */}
      <div className="bg-white rounded-3xl border border-[#DCEEEB] shadow-2xs overflow-hidden">
        <div className="overflow-x-auto">
          <table className="w-full text-left text-xs">
            <thead>
              <tr className="bg-[#F8FCFC] border-b border-[#DCEEEB] text-[#5B738B] font-bold uppercase tracking-wider text-[11px]">
                <th className="py-3.5 pl-6">Customer ID</th>
                <th className="py-3.5 px-3">Profile & Name</th>
                <th className="py-3.5 px-3">Phone</th>
                <th className="py-3.5 px-3">Email</th>
                <th className="py-3.5 px-3">Location</th>
                <th className="py-3.5 px-3">Total Bookings</th>
                <th className="py-3.5 px-3">Completed</th>
                <th className="py-3.5 px-3">Cancelled</th>
                <th className="py-3.5 px-3">Status</th>
                <th className="py-3.5 pr-6 text-right">Actions</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-100">
              {filteredCustomers.length === 0 ? (
                <tr>
                  <td colSpan={10} className="py-12 text-center text-slate-400">
                    No customers found matching current search.
                  </td>
                </tr>
              ) : (
                filteredCustomers.map((cust) => (
                  <tr
                    key={cust.customerId}
                    className="hover:bg-teal-50/20 transition-colors group cursor-pointer"
                    onClick={() => navigate(`/admin/customers/${cust.customerId}`)}
                  >
                    {/* Customer ID */}
                    <td className="py-4 pl-6 font-mono font-bold text-[#009E9B]">
                      <span className="group-hover:underline">{cust.customerId}</span>
                    </td>

                    {/* Profile */}
                    <td className="py-4 px-3">
                      <div className="flex items-center gap-2.5">
                        <img
                          src={cust.avatar}
                          alt={cust.name}
                          className="w-8 h-8 rounded-full object-cover border border-teal-200 shrink-0"
                        />
                        <div>
                          <span className="font-bold text-[#0B2038] block truncate max-w-[130px]">
                            {cust.name}
                          </span>
                          {cust.isPremium && (
                            <span className="text-[10px] font-bold text-[#009E9B]">
                              ★ Premium Member
                            </span>
                          )}
                        </div>
                      </div>
                    </td>

                    {/* Phone */}
                    <td className="py-4 px-3 text-[#5B738B] whitespace-nowrap">{cust.phone}</td>

                    {/* Email */}
                    <td className="py-4 px-3 text-[#5B738B] truncate max-w-[150px]">
                      {cust.email}
                    </td>

                    {/* Location */}
                    <td className="py-4 px-3 text-[#5B738B]">
                      <div className="flex items-center gap-1">
                        <MapPin className="w-3.5 h-3.5 text-[#009E9B] shrink-0" />
                        <span className="truncate max-w-[130px]">{cust.location}</span>
                      </div>
                    </td>

                    {/* Total Bookings */}
                    <td className="py-4 px-3 font-bold text-[#0B2038] whitespace-nowrap">
                      {cust.totalBookings}
                    </td>

                    {/* Completed */}
                    <td className="py-4 px-3 text-emerald-700 font-semibold whitespace-nowrap">
                      {cust.completedBookings}
                    </td>

                    {/* Cancelled */}
                    <td className="py-4 px-3 text-rose-600 font-semibold whitespace-nowrap">
                      {cust.cancelledBookings}
                    </td>

                    {/* Status */}
                    <td className="py-4 px-3 whitespace-nowrap">
                      <span className="px-2.5 py-0.5 rounded-full text-xs font-semibold bg-emerald-50 text-emerald-700 border border-emerald-200">
                        {cust.status}
                      </span>
                    </td>

                    {/* Actions */}
                    <td
                      className="py-4 pr-6 text-right whitespace-nowrap"
                      onClick={(e) => e.stopPropagation()}
                    >
                      <Link
                        to={`/admin/customers/${cust.customerId}`}
                        className="p-1.5 inline-flex text-slate-400 hover:text-[#009E9B] hover:bg-teal-50 rounded-lg transition-colors"
                        title="View Customer Profile"
                      >
                        <Eye className="w-4 h-4" />
                      </Link>
                    </td>
                  </tr>
                ))
              )}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
};
