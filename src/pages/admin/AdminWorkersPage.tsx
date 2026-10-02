import React, { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { useApp } from '../../context/AppContext';
import { Worker, WorkerAvailability, VerificationStatus } from '../../types';
import { StatusBadge } from '../../components/common/StatusBadge';
import { WorkerVerificationModal } from '../../components/modals/WorkerVerificationModal';
import {
  Users2,
  Search,
  Filter,
  ShieldCheck,
  ShieldAlert,
  Clock,
  Star,
  Plus,
  Eye,
  MapPin,
  Phone,
  CheckCircle,
  XCircle,
  Briefcase,
  FileText,
  ToggleLeft,
  ToggleRight,
} from 'lucide-react';

export const AdminWorkersPage: React.FC = () => {
  const { workers, toggleWorkerAvailability, approveWorker, rejectWorker } = useApp();
  const navigate = useNavigate();

  const [activeTab, setActiveTab] = useState<'all' | 'pending' | 'active'>('all');
  const [searchTerm, setSearchTerm] = useState('');
  const [availabilityFilter, setAvailabilityFilter] = useState<string>('All');
  const [selectedWorkerForReview, setSelectedWorkerForReview] = useState<Worker | null>(null);

  // Filter workers
  const filteredWorkers = workers.filter((w) => {
    // Tab filter
    if (activeTab === 'pending' && w.verificationStatus !== 'Pending') return false;
    if (activeTab === 'active' && w.status !== 'Active') return false;

    // Availability filter
    if (availabilityFilter !== 'All' && w.availability !== availabilityFilter) return false;

    // Search filter
    const term = searchTerm.toLowerCase();
    return (
      w.name.toLowerCase().includes(term) ||
      w.workerId.toLowerCase().includes(term) ||
      w.phone.includes(term) ||
      w.locationName.toLowerCase().includes(term) ||
      w.categories.some((c) => c.toLowerCase().includes(term)) ||
      w.services.some((s) => s.toLowerCase().includes(term))
    );
  });

  const pendingCount = workers.filter((w) => w.verificationStatus === 'Pending').length;

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4">
        <div>
          <h1 className="text-2xl font-extrabold text-[#0B2038]">Service Professionals (Pros)</h1>
          <p className="text-xs sm:text-sm text-[#5B738B] mt-0.5">
            Manage field workforce, GPS availability states, and pro background verifications
          </p>
        </div>

        <div className="flex items-center gap-3">
          <Link
            to="/admin/dashboard"
            className="inline-flex items-center gap-2 px-4 py-2.5 rounded-full bg-white text-[#0B2038] border border-slate-200 text-xs font-bold hover:bg-slate-50 transition-colors shadow-2xs"
          >
            <span>Overview</span>
          </Link>
        </div>
      </div>

      {/* Main Tabs (All Pros vs Pending Applications) */}
      <div className="bg-white rounded-3xl p-5 border border-[#DCEEEB] shadow-2xs space-y-4">
        <div className="flex flex-col md:flex-row items-center justify-between gap-4">
          {/* Main Tab Toggle */}
          <div className="flex items-center gap-1.5 p-1 bg-slate-100 rounded-2xl w-full sm:w-auto">
            <button
              onClick={() => setActiveTab('all')}
              className={`flex-1 sm:flex-initial px-4 py-2 rounded-xl text-xs font-bold transition-all ${
                activeTab === 'all'
                  ? 'bg-white text-[#0B2038] shadow-2xs'
                  : 'text-[#5B738B] hover:text-[#0B2038]'
              }`}
            >
              All Pros ({workers.length})
            </button>

            <button
              onClick={() => setActiveTab('pending')}
              className={`flex-1 sm:flex-initial px-4 py-2 rounded-xl text-xs font-bold transition-all flex items-center gap-1.5 ${
                activeTab === 'pending'
                  ? 'bg-[#009E9B] text-white shadow-2xs'
                  : 'text-[#5B738B] hover:text-[#0B2038]'
              }`}
            >
              <span>Pending Applications</span>
              {pendingCount > 0 && (
                <span
                  className={`px-1.5 py-0.2 rounded-full text-[10px] font-bold ${
                    activeTab === 'pending'
                      ? 'bg-white text-[#009E9B]'
                      : 'bg-amber-100 text-amber-800'
                  }`}
                >
                  {pendingCount}
                </span>
              )}
            </button>

            <button
              onClick={() => setActiveTab('active')}
              className={`flex-1 sm:flex-initial px-4 py-2 rounded-xl text-xs font-bold transition-all ${
                activeTab === 'active'
                  ? 'bg-white text-[#0B2038] shadow-2xs'
                  : 'text-[#5B738B] hover:text-[#0B2038]'
              }`}
            >
              Active Fleet ({workers.filter((w) => w.status === 'Active').length})
            </button>
          </div>

          {/* Search Box */}
          <div className="w-full md:w-80 relative">
            <Search className="w-4 h-4 text-slate-400 absolute left-3.5 top-1/2 -translate-y-1/2" />
            <input
              type="text"
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              placeholder="Search pro name, skill, phone..."
              className="w-full pl-10 pr-4 py-2 bg-[#F8FCFC] border border-[#D1F0EE] rounded-2xl text-xs font-medium text-[#0B2038] placeholder-slate-400 focus:outline-none focus:border-[#009E9B] focus:bg-white"
            />
          </div>
        </div>

        {/* Sub-Filters: Availability */}
        <div className="flex items-center gap-2 pt-2 border-t border-slate-100 text-xs text-[#5B738B]">
          <span className="font-bold uppercase tracking-wider text-[11px] text-[#0B2038]">
            Filter Availability:
          </span>
          {['All', 'Available', 'Busy', 'Offline'].map((av) => (
            <button
              key={av}
              onClick={() => setAvailabilityFilter(av)}
              className={`px-3 py-1 rounded-full text-xs font-semibold transition-all ${
                availabilityFilter === av
                  ? 'bg-teal-50 text-[#009E9B] border border-teal-300'
                  : 'bg-slate-50 text-slate-600 hover:bg-slate-100'
              }`}
            >
              {av}
            </button>
          ))}
        </div>
      </div>

      {/* PART 8: Dedicated Pending Applications View if Pending Tab Selected */}
      {activeTab === 'pending' && (
        <div className="space-y-4">
          <div className="flex items-center justify-between">
            <h3 className="text-base font-bold text-[#0B2038]">
              Pending Pro Verification Applications
            </h3>
            <span className="text-xs text-[#5B738B]">
              Carefully verify Aadhaar & police clearance before activating
            </span>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            {filteredWorkers.map((applicant) => (
              <div
                key={applicant.workerId}
                className="bg-white rounded-3xl p-5 border border-[#DCEEEB] shadow-2xs hover:shadow-sm transition-all space-y-4 flex flex-col justify-between"
              >
                <div className="space-y-3">
                  <div className="flex items-start justify-between">
                    <div className="flex items-center gap-3">
                      <img
                        src={applicant.profileImage}
                        alt={applicant.name}
                        className="w-12 h-12 rounded-2xl object-cover border border-slate-200"
                      />
                      <div>
                        <div className="flex items-center gap-2">
                          <h4 className="text-sm font-bold text-[#0B2038]">{applicant.name}</h4>
                          <span className="font-mono text-[10px] text-slate-400">
                            {applicant.workerId}
                          </span>
                        </div>
                        <p className="text-xs text-[#5B738B]">{applicant.locationName}</p>
                      </div>
                    </div>
                    <StatusBadge status={applicant.verificationStatus} type="verification" size="sm" />
                  </div>

                  <div className="grid grid-cols-2 gap-2 text-xs text-[#5B738B] pt-2 border-t border-slate-100">
                    <div>
                      <span className="block text-[10px] uppercase font-bold text-slate-400">
                        Phone
                      </span>
                      <span className="font-medium text-[#0B2038]">{applicant.phone}</span>
                    </div>
                    <div>
                      <span className="block text-[10px] uppercase font-bold text-slate-400">
                        Email
                      </span>
                      <span className="font-medium text-[#0B2038] truncate block">
                        {applicant.email}
                      </span>
                    </div>
                    <div>
                      <span className="block text-[10px] uppercase font-bold text-slate-400">
                        Service Category
                      </span>
                      <span className="font-medium text-[#009E9B]">
                        {applicant.categories.join(', ')}
                      </span>
                    </div>
                    <div>
                      <span className="block text-[10px] uppercase font-bold text-slate-400">
                        Experience
                      </span>
                      <span className="font-medium text-[#0B2038]">
                        {applicant.experienceYears} Years
                      </span>
                    </div>
                  </div>

                  {/* Submitted Documents Checklist */}
                  <div className="pt-2">
                    <span className="block text-[10px] uppercase font-bold text-slate-400 mb-1.5">
                      Submitted Documents
                    </span>
                    <div className="space-y-1.5">
                      {applicant.documents.map((doc) => (
                        <div
                          key={doc.id}
                          className="flex items-center justify-between text-[11px] p-2 rounded-xl bg-slate-50 border border-slate-100"
                        >
                          <span className="font-medium text-[#0B2038] flex items-center gap-1.5">
                            <FileText className="w-3.5 h-3.5 text-[#009E9B]" />
                            {doc.name}
                          </span>
                          <span className="text-slate-400 font-mono">{doc.documentNumber}</span>
                        </div>
                      ))}
                    </div>
                  </div>
                </div>

                {/* Actions: View, Approve, Reject (Part 8) */}
                <div className="pt-4 border-t border-slate-100 flex items-center justify-between gap-2">
                  <button
                    onClick={() => setSelectedWorkerForReview(applicant)}
                    className="px-3.5 py-1.5 rounded-full bg-slate-100 hover:bg-slate-200 text-[#0B2038] text-xs font-bold transition-colors"
                  >
                    View Full KYC
                  </button>

                  <div className="flex items-center gap-2">
                    <button
                      onClick={() => rejectWorker(applicant.workerId)}
                      className="px-3 py-1.5 rounded-full border border-rose-300 text-rose-700 hover:bg-rose-50 text-xs font-bold transition-colors"
                    >
                      Reject
                    </button>
                    <button
                      onClick={() => approveWorker(applicant.workerId)}
                      className="px-4 py-1.5 rounded-full bg-[#009E9B] text-white hover:bg-[#00827F] text-xs font-bold shadow-2xs transition-colors"
                    >
                      Approve Pro
                    </button>
                  </div>
                </div>
              </div>
            ))}
          </div>
        </div>
      )}

      {/* Main Workers Table (Part 7 Table) */}
      <div className="bg-white rounded-3xl border border-[#DCEEEB] shadow-2xs overflow-hidden">
        <div className="overflow-x-auto">
          <table className="w-full text-left text-xs">
            <thead>
              <tr className="bg-[#F8FCFC] border-b border-[#DCEEEB] text-[#5B738B] font-bold uppercase tracking-wider text-[11px]">
                <th className="py-3.5 pl-6">Worker ID</th>
                <th className="py-3.5 px-3">Profile & Name</th>
                <th className="py-3.5 px-3">Phone</th>
                <th className="py-3.5 px-3">Service Categories</th>
                <th className="py-3.5 px-3">Location</th>
                <th className="py-3.5 px-3">Availability</th>
                <th className="py-3.5 px-3">Status</th>
                <th className="py-3.5 px-3">Rating</th>
                <th className="py-3.5 px-3">Jobs</th>
                <th className="py-3.5 px-3">Verification</th>
                <th className="py-3.5 pr-6 text-right">Actions</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-100">
              {filteredWorkers.length === 0 ? (
                <tr>
                  <td colSpan={11} className="py-12 text-center text-slate-400">
                    No professionals found matching current filters.
                  </td>
                </tr>
              ) : (
                filteredWorkers.map((w) => (
                  <tr
                    key={w.workerId}
                    className="hover:bg-teal-50/20 transition-colors group cursor-pointer"
                    onClick={() => navigate(`/admin/workers/${w.workerId}`)}
                  >
                    {/* Worker ID */}
                    <td className="py-4 pl-6 font-mono font-bold text-[#0B2038]">
                      <span className="text-[#009E9B] group-hover:underline">{w.workerId}</span>
                    </td>

                    {/* Profile & Name */}
                    <td className="py-4 px-3">
                      <div className="flex items-center gap-2.5">
                        <img
                          src={w.profileImage}
                          alt={w.name}
                          className="w-8 h-8 rounded-xl object-cover border border-slate-200 shrink-0"
                        />
                        <div>
                          <span className="font-bold text-[#0B2038] block truncate max-w-[130px]">
                            {w.name}
                          </span>
                          <span className="text-[10px] text-slate-400 font-mono">
                            {w.experienceYears}y exp
                          </span>
                        </div>
                      </div>
                    </td>

                    {/* Phone */}
                    <td className="py-4 px-3 text-[#5B738B] whitespace-nowrap">{w.phone}</td>

                    {/* Categories */}
                    <td className="py-4 px-3">
                      <div className="flex flex-wrap gap-1 max-w-[150px]">
                        {w.categories.map((c, i) => (
                          <span
                            key={i}
                            className="px-2 py-0.5 rounded-md bg-teal-50 text-[#00827F] font-semibold text-[10px]"
                          >
                            {c}
                          </span>
                        ))}
                      </div>
                    </td>

                    {/* Location */}
                    <td className="py-4 px-3 text-[#5B738B]">
                      <div className="flex items-center gap-1">
                        <MapPin className="w-3.5 h-3.5 text-[#009E9B] shrink-0" />
                        <span className="truncate max-w-[110px]">{w.locationName}</span>
                      </div>
                    </td>

                    {/* Availability */}
                    <td
                      className="py-4 px-3 whitespace-nowrap"
                      onClick={(e) => e.stopPropagation()}
                    >
                      <button
                        onClick={() => toggleWorkerAvailability(w.workerId)}
                        className="cursor-pointer"
                        title="Click to toggle availability"
                      >
                        <StatusBadge status={w.availability} type="availability" size="sm" />
                      </button>
                    </td>

                    {/* Status */}
                    <td className="py-4 px-3 whitespace-nowrap">
                      <StatusBadge status={w.status} type="workerStatus" size="sm" />
                    </td>

                    {/* Rating */}
                    <td className="py-4 px-3 whitespace-nowrap">
                      {w.rating > 0 ? (
                        <div className="flex items-center gap-1 font-bold text-[#0B2038]">
                          <Star className="w-3.5 h-3.5 text-amber-500 fill-current" />
                          <span>{w.rating}</span>
                          <span className="text-slate-400 text-[10px] font-normal">
                            ({w.ratingCount})
                          </span>
                        </div>
                      ) : (
                        <span className="text-slate-400 text-[11px]">—</span>
                      )}
                    </td>

                    {/* Completed Jobs */}
                    <td className="py-4 px-3 font-semibold text-[#0B2038] whitespace-nowrap">
                      {w.completedJobs}
                    </td>

                    {/* Verification Status */}
                    <td className="py-4 px-3 whitespace-nowrap">
                      <StatusBadge status={w.verificationStatus} type="verification" size="sm" />
                    </td>

                    {/* Actions */}
                    <td
                      className="py-4 pr-6 text-right whitespace-nowrap"
                      onClick={(e) => e.stopPropagation()}
                    >
                      <div className="flex items-center justify-end gap-1.5">
                        <button
                          onClick={() => setSelectedWorkerForReview(w)}
                          className="p-1.5 text-slate-500 hover:text-[#009E9B] hover:bg-teal-50 rounded-lg transition-colors"
                          title="Review Documents"
                        >
                          <FileText className="w-4 h-4" />
                        </button>
                        <Link
                          to={`/admin/workers/${w.workerId}`}
                          className="p-1.5 text-slate-400 hover:text-[#0B2038] hover:bg-slate-100 rounded-lg transition-colors"
                          title="View Profile"
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

      {/* Review Modal */}
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
