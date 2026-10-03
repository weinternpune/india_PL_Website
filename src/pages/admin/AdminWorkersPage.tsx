import React, { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { useApp } from '../../context/AppContext';
import { Worker } from '../../types';
import { StatusBadge } from '../../components/common/StatusBadge';
import { WorkerVerificationModal } from '../../components/modals/WorkerVerificationModal';
import {
  Search,
  Star,
  Eye,
  MapPin,
  FileText,
} from 'lucide-react';

export const AdminWorkersPage: React.FC = () => {
  const { workers, toggleWorkerAvailability, approveWorker, rejectWorker, getWorkerRatingStats } = useApp();
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
          <h1 className="text-2xl font-black text-[#0B2038] tracking-tight">Service Professionals (Pros)</h1>
          <p className="text-xs sm:text-sm text-slate-800 font-medium mt-0.5">
            Manage field workforce, GPS availability states, and pro background verifications across Odisha.
          </p>
        </div>

        <div className="flex items-center gap-3">
          <Link
            to="/admin/payouts"
            className="inline-flex items-center gap-2 px-4 py-2 rounded-xl bg-[#008A8E] text-white text-xs font-bold hover:bg-[#007074] transition-colors shadow-sm"
          >
            <span>Worker Payouts Hub →</span>
          </Link>
        </div>
      </div>

      {/* Main Tabs (All Pros vs Pending Applications) */}
      <div className="bg-white rounded-2xl p-5 border border-slate-200 shadow-sm space-y-4">
        <div className="flex flex-col md:flex-row items-center justify-between gap-4">
          {/* Main Tab Toggle */}
          <div className="flex items-center gap-1.5 p-1 bg-slate-100 rounded-xl w-full sm:w-auto">
            <button
              onClick={() => setActiveTab('all')}
              className={`flex-1 sm:flex-initial px-4 py-2 rounded-lg text-xs font-bold transition-all cursor-pointer ${
                activeTab === 'all'
                  ? 'bg-[#0B2038] text-white shadow-sm'
                  : 'text-slate-800 hover:text-[#0B2038]'
              }`}
            >
              All Pros ({workers.length})
            </button>

            <button
              onClick={() => setActiveTab('pending')}
              className={`flex-1 sm:flex-initial px-4 py-2 rounded-lg text-xs font-bold transition-all flex items-center justify-center gap-1.5 cursor-pointer ${
                activeTab === 'pending'
                  ? 'bg-[#008A8E] text-white shadow-sm'
                  : 'text-slate-800 hover:text-[#0B2038]'
              }`}
            >
              <span>Pending Applications</span>
              {pendingCount > 0 && (
                <span
                  className={`px-1.5 py-0.2 rounded-full text-[10px] font-bold ${
                    activeTab === 'pending'
                      ? 'bg-white text-[#008A8E]'
                      : 'bg-amber-100 text-amber-900 border border-amber-300'
                  }`}
                >
                  {pendingCount}
                </span>
              )}
            </button>

            <button
              onClick={() => setActiveTab('active')}
              className={`flex-1 sm:flex-initial px-4 py-2 rounded-lg text-xs font-bold transition-all cursor-pointer ${
                activeTab === 'active'
                  ? 'bg-[#0B2038] text-white shadow-sm'
                  : 'text-slate-800 hover:text-[#0B2038]'
              }`}
            >
              Active Fleet ({workers.filter((w) => w.status === 'Active').length})
            </button>
          </div>

          {/* Search Box */}
          <div className="w-full md:w-80 relative">
            <Search className="w-4 h-4 text-slate-500 absolute left-3.5 top-1/2 -translate-y-1/2" />
            <input
              type="text"
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              placeholder="Search pro name, skill, phone..."
              className="w-full pl-10 pr-4 py-2 bg-slate-50 border border-slate-200 rounded-xl text-xs font-semibold text-[#0B2038] placeholder-slate-500 focus:outline-none focus:border-[#008A8E] focus:bg-white"
            />
          </div>
        </div>

        {/* Sub-Filters: Availability */}
        <div className="flex items-center gap-2 pt-2 border-t border-slate-200 text-xs text-slate-800">
          <span className="font-bold uppercase tracking-wider text-[11px] text-[#0B2038]">
            Filter Availability:
          </span>
          {['All', 'Available', 'Busy', 'Offline'].map((av) => (
            <button
              key={av}
              onClick={() => setAvailabilityFilter(av)}
              className={`px-3 py-1 rounded-lg text-xs font-bold transition-all cursor-pointer ${
                availabilityFilter === av
                  ? 'bg-teal-50 text-[#008A8E] border border-teal-300'
                  : 'text-slate-700 hover:bg-slate-100 hover:text-[#0B2038]'
              }`}
            >
              {av}
            </button>
          ))}
        </div>
      </div>

      {/* Pending Applications Section */}
      {activeTab === 'pending' && (
        <div className="space-y-4">
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
            {filteredWorkers.map((applicant) => (
              <div
                key={applicant.workerId}
                className="bg-white rounded-2xl p-5 border border-amber-200 shadow-sm space-y-4 relative overflow-hidden"
              >
                <div className="absolute top-0 left-0 right-0 h-1 bg-amber-400" />
                <div className="space-y-3">
                  <div className="flex items-start justify-between">
                    <div className="flex items-center gap-3">
                      <img
                        src={applicant.profileImage}
                        alt={applicant.name}
                        className="w-12 h-12 rounded-xl object-cover border border-slate-200"
                      />
                      <div>
                        <h3 className="font-bold text-[#0B2038] text-sm">{applicant.name}</h3>
                        <span className="font-mono text-xs font-bold text-[#008A8E]">
                          {applicant.workerId}
                        </span>
                      </div>
                    </div>
                    <StatusBadge status={applicant.verificationStatus} type="verification" size="sm" />
                  </div>

                  <div className="grid grid-cols-2 gap-2 text-xs text-slate-800 pt-2 border-t border-slate-100">
                    <div>
                      <span className="block text-[10px] uppercase font-bold text-slate-600">
                        Phone
                      </span>
                      <span className="font-bold text-[#0B2038]">{applicant.phone}</span>
                    </div>
                    <div>
                      <span className="block text-[10px] uppercase font-bold text-slate-600">
                        Email
                      </span>
                      <span className="font-bold text-[#0B2038] truncate block">
                        {applicant.email}
                      </span>
                    </div>
                    <div>
                      <span className="block text-[10px] uppercase font-bold text-slate-600">
                        Service Category
                      </span>
                      <span className="font-bold text-[#008A8E]">
                        {applicant.categories.join(', ')}
                      </span>
                    </div>
                    <div>
                      <span className="block text-[10px] uppercase font-bold text-slate-600">
                        Experience
                      </span>
                      <span className="font-bold text-[#0B2038]">
                        {applicant.experienceYears} Years
                      </span>
                    </div>
                  </div>

                  {/* Submitted Documents Checklist */}
                  <div className="pt-2">
                    <span className="block text-[10px] uppercase font-bold text-slate-600 mb-1.5">
                      Submitted Documents
                    </span>
                    <div className="space-y-1.5">
                      {applicant.documents.map((doc) => (
                        <div
                          key={doc.id}
                          className="flex items-center justify-between text-[11px] p-2 rounded-xl bg-slate-50 border border-slate-200"
                        >
                          <span className="font-bold text-[#0B2038] flex items-center gap-1.5">
                            <FileText className="w-3.5 h-3.5 text-[#008A8E]" />
                            {doc.name}
                          </span>
                          <span className="text-slate-600 font-mono font-medium">{doc.documentNumber}</span>
                        </div>
                      ))}
                    </div>
                  </div>
                </div>

                {/* Actions: View, Approve, Reject */}
                <div className="pt-4 border-t border-slate-200 flex items-center justify-between gap-2">
                  <button
                    onClick={() => setSelectedWorkerForReview(applicant)}
                    className="px-3.5 py-1.5 rounded-lg bg-slate-100 hover:bg-slate-200 text-[#0B2038] text-xs font-bold transition-colors cursor-pointer"
                  >
                    View Full KYC
                  </button>

                  <div className="flex items-center gap-2">
                    <button
                      onClick={() => rejectWorker(applicant.workerId)}
                      className="px-3 py-1.5 rounded-lg border border-rose-300 text-rose-700 hover:bg-rose-50 text-xs font-bold transition-colors cursor-pointer"
                    >
                      Reject
                    </button>
                    <button
                      onClick={() => approveWorker(applicant.workerId)}
                      className="px-4 py-1.5 rounded-lg bg-[#008A8E] text-white hover:bg-[#007074] text-xs font-bold shadow-sm transition-colors cursor-pointer"
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

      {/* Main Workers Table */}
      <div className="bg-white rounded-2xl border border-slate-200 shadow-sm overflow-hidden">
        <div className="overflow-x-auto">
          <table className="w-full text-left text-xs">
            <thead>
              <tr className="bg-slate-50 border-b border-slate-200 text-[#0B2038] font-bold uppercase tracking-wider text-[11px]">
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
                  <td colSpan={11} className="py-12 text-center text-slate-700 font-bold">
                    No professionals found matching current filters.
                  </td>
                </tr>
              ) : (
                filteredWorkers.map((w) => {
                  const ratingStats = getWorkerRatingStats(w.workerId);
                  return (
                    <tr
                      key={w.workerId}
                      className="hover:bg-cyan-50/30 transition-colors group cursor-pointer"
                      onClick={() => navigate(`/admin/workers/${w.workerId}`)}
                    >
                      {/* Worker ID */}
                      <td className="py-4 pl-6 font-mono font-bold text-[#008A8E]">
                        <span className="group-hover:underline">{w.workerId}</span>
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
                            <span className="text-[10px] text-slate-600 font-mono font-medium">
                              {w.experienceYears}y exp
                            </span>
                          </div>
                        </div>
                      </td>

                      {/* Phone */}
                      <td className="py-4 px-3 text-slate-800 font-semibold whitespace-nowrap">{w.phone}</td>

                      {/* Categories */}
                      <td className="py-4 px-3">
                        <div className="flex flex-wrap gap-1 max-w-[150px]">
                          {w.categories.map((c, i) => (
                            <span
                              key={i}
                              className="px-2 py-0.5 rounded-md bg-teal-50 text-[#008A8E] font-bold text-[10px] border border-teal-200"
                            >
                              {c}
                            </span>
                          ))}
                        </div>
                      </td>

                      {/* Location */}
                      <td className="py-4 px-3 text-slate-800 font-medium">
                        <div className="flex items-center gap-1">
                          <MapPin className="w-3.5 h-3.5 text-[#008A8E] shrink-0" />
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

                      {/* Dynamic Rating */}
                      <td className="py-4 px-3 whitespace-nowrap">
                        {ratingStats.totalReviews > 0 ? (
                          <div className="flex items-center gap-1 font-bold text-[#0B2038]">
                            <Star className="w-3.5 h-3.5 text-amber-500 fill-current" />
                            <span>{ratingStats.averageRating.toFixed(1)}</span>
                            <span className="text-slate-700 text-[10px] font-bold">
                              ({ratingStats.totalReviews})
                            </span>
                          </div>
                        ) : (
                          <span className="text-slate-600 text-[11px] font-medium">No ratings yet</span>
                        )}
                      </td>

                      {/* Completed Jobs */}
                      <td className="py-4 px-3 font-black text-[#0B2038] whitespace-nowrap">
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
                            className="p-1.5 text-slate-700 hover:text-[#008A8E] hover:bg-teal-50 rounded-lg transition-colors cursor-pointer"
                            title="Review Documents"
                          >
                            <FileText className="w-4 h-4" />
                          </button>
                          <Link
                            to={`/admin/workers/${w.workerId}`}
                            className="p-1.5 text-slate-700 hover:text-[#0B2038] hover:bg-slate-100 rounded-lg transition-colors"
                            title="View Profile"
                          >
                            <Eye className="w-4 h-4" />
                          </Link>
                        </div>
                      </td>
                    </tr>
                  );
                })
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
