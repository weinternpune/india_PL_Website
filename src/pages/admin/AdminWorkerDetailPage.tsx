import React, { useState } from 'react';
import { useParams, Link, useNavigate } from 'react-router-dom';
import { useApp } from '../../context/AppContext';
import { StatusBadge } from '../../components/common/StatusBadge';
import { WorkerVerificationModal } from '../../components/modals/WorkerVerificationModal';
import { WorkerAvailability } from '../../types';
import {
  ArrowLeft,
  MapPin,
  Phone,
  Mail,
  Star,
  FileText,
  User,
  Calendar,
} from 'lucide-react';

export const AdminWorkerDetailPage: React.FC = () => {
  const { id } = useParams<{ id: string }>();
  const navigate = useNavigate();
  const {
    getWorkerById,
    updateWorker,
    bookings,
    getWorkerRatingStats,
    getWorkerRatings,
    calculateWorkerEarnings,
  } = useApp();

  const [isVerificationModalOpen, setIsVerificationModalOpen] = useState(false);

  const worker = getWorkerById(id || '');

  if (!worker) {
    return (
      <div className="py-16 text-center space-y-4">
        <h2 className="text-xl font-black text-[#0B2038]">Worker Profile Not Found</h2>
        <p className="text-xs font-semibold text-slate-800">Could not locate professional identifier {id}.</p>
        <Link
          to="/admin/workers"
          className="inline-flex items-center gap-2 px-4 py-2 rounded-xl bg-[#008A8E] text-white text-xs font-bold"
        >
          <ArrowLeft className="w-4 h-4" />
          <span>Back to Pros</span>
        </Link>
      </div>
    );
  }

  // Find bookings assigned to this worker
  const workerBookings = bookings.filter((b) => b.assignedWorkerId === worker.workerId);
  const ratingStats = getWorkerRatingStats(worker.workerId);
  const workerReviews = getWorkerRatings(worker.workerId);
  const earnings = calculateWorkerEarnings(worker.workerId);

  const handleAvailabilityChange = (newAvail: WorkerAvailability) => {
    updateWorker({ ...worker, availability: newAvail });
  };

  return (
    <div className="space-y-6 max-w-6xl mx-auto">
      {/* Top Header */}
      <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4">
        <div className="flex items-center gap-3">
          <button
            onClick={() => navigate('/admin/workers')}
            className="p-2 rounded-xl bg-white border border-slate-200 text-[#0B2038] hover:text-[#008A8E] hover:bg-teal-50 transition-colors shadow-sm cursor-pointer"
          >
            <ArrowLeft className="w-4 h-4" />
          </button>
          <div>
            <div className="flex items-center gap-2">
              <h1 className="text-2xl font-black text-[#0B2038] tracking-tight">{worker.name}</h1>
              <span className="font-mono text-xs font-bold px-2.5 py-0.5 rounded-full bg-teal-100 text-[#008A8E] border border-teal-200">
                {worker.workerId}
              </span>
            </div>
            <p className="text-xs font-semibold text-slate-800 mt-0.5">
              Registered Pro since {worker.joinedDate} • {worker.locationName}
            </p>
          </div>
        </div>

        <div className="flex items-center gap-3">
          <StatusBadge status={worker.verificationStatus} type="verification" size="md" />
          <button
            onClick={() => setIsVerificationModalOpen(true)}
            className="px-4 py-2 rounded-xl bg-white text-[#008A8E] border border-teal-300 hover:bg-teal-50 text-xs font-bold shadow-xs transition-colors cursor-pointer"
          >
            Review KYC Docs
          </button>
        </div>
      </div>

      {/* Grid: 2 Columns */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-6">
        {/* Left Column (4 cols): Profile Card & GPS Coordinates */}
        <div className="lg:col-span-4 space-y-6">
          {/* Main Profile Info Card */}
          <div className="bg-white rounded-2xl p-6 border border-slate-200 shadow-sm text-center space-y-4">
            <div className="relative inline-block">
              <img
                src={worker.profileImage}
                alt={worker.name}
                className="w-24 h-24 rounded-2xl object-cover border-4 border-teal-100 mx-auto shadow-md"
              />
              <span
                className={`absolute bottom-0 right-0 w-5 h-5 rounded-full border-2 border-white ${
                  worker.availability === 'Available'
                    ? 'bg-emerald-500'
                    : worker.availability === 'Busy'
                    ? 'bg-amber-500'
                    : 'bg-slate-400'
                }`}
              />
            </div>

            <div>
              <h3 className="text-lg font-black text-[#0B2038]">{worker.name}</h3>
              <p className="text-xs text-[#008A8E] font-bold">
                {worker.categories.join(' • ')} Specialist
              </p>
            </div>

            {/* Availability State Selector */}
            <div className="p-3.5 rounded-xl bg-slate-50 border border-slate-200 space-y-2 text-left">
              <span className="text-[11px] font-bold uppercase tracking-wider text-[#0B2038] block">
                GPS Availability State
              </span>
              <div className="grid grid-cols-3 gap-1.5">
                {(['Available', 'Busy', 'Offline'] as WorkerAvailability[]).map((state) => (
                  <button
                    key={state}
                    onClick={() => handleAvailabilityChange(state)}
                    className={`py-1.5 px-2 rounded-lg text-xs font-bold transition-all cursor-pointer ${
                      worker.availability === state
                        ? 'bg-[#008A8E] text-white shadow-sm'
                        : 'bg-white text-slate-800 hover:bg-slate-100 border border-slate-200'
                    }`}
                  >
                    {state}
                  </button>
                ))}
              </div>
            </div>

            {/* Contact Details */}
            <div className="space-y-2.5 text-xs text-slate-800 text-left pt-2 border-t border-slate-200">
              <div className="flex items-center gap-2">
                <Phone className="w-4 h-4 text-[#008A8E] shrink-0" />
                <span className="text-[#0B2038] font-bold">{worker.phone}</span>
              </div>
              <div className="flex items-center gap-2">
                <Mail className="w-4 h-4 text-[#008A8E] shrink-0" />
                <span className="text-[#0B2038] font-bold truncate">{worker.email}</span>
              </div>
              <div className="flex items-center gap-2">
                <MapPin className="w-4 h-4 text-[#008A8E] shrink-0" />
                <span className="text-[#0B2038] font-bold">{worker.locationName}</span>
              </div>
            </div>
          </div>

          {/* GPS Coordinates & Cluster Card */}
          <div className="bg-white rounded-2xl p-5 border border-slate-200 shadow-sm space-y-3">
            <h4 className="text-xs font-bold uppercase tracking-wider text-[#0B2038]">
              Live GPS Cluster
            </h4>
            <div className="p-3 rounded-xl bg-slate-50 border border-slate-200 space-y-1">
              <div className="flex justify-between text-xs">
                <span className="text-slate-700 font-bold">Latitude</span>
                <span className="font-mono font-black text-[#0B2038]">{worker.latitude}° N</span>
              </div>
              <div className="flex justify-between text-xs">
                <span className="text-slate-700 font-bold">Longitude</span>
                <span className="font-mono font-black text-[#0B2038]">{worker.longitude}° E</span>
              </div>
            </div>
            <p className="text-[11px] font-medium text-slate-700">
              Real-time coordinates used by the automated Haversine dispatch algorithm.
            </p>
          </div>
        </div>

        {/* Right Column (8 cols): Performance Metrics, Skills, Reviews & Recent Jobs */}
        <div className="lg:col-span-8 space-y-6">
          {/* Key Metrics Cards */}
          <div className="grid grid-cols-2 sm:grid-cols-4 gap-3">
            <div className="bg-white rounded-xl p-4 border border-slate-200 shadow-sm">
              <span className="text-[11px] font-bold text-[#0B2038] block">Pro Rating</span>
              <div className="flex items-center gap-1 mt-1">
                <Star className="w-4 h-4 text-amber-500 fill-current" />
                <span className="text-xl font-black text-[#0B2038]">
                  {ratingStats.totalReviews > 0 ? ratingStats.averageRating.toFixed(1) : '—'}
                </span>
              </div>
              <span className="text-[10px] font-bold text-slate-700">
                {ratingStats.totalReviews > 0 ? `${ratingStats.totalReviews} reviews` : 'No reviews'}
              </span>
            </div>

            <div className="bg-white rounded-xl p-4 border border-slate-200 shadow-sm">
              <span className="text-[11px] font-bold text-[#0B2038] block">Completed Jobs</span>
              <span className="text-xl font-black text-[#008A8E] mt-1 block">
                {worker.completedJobs}
              </span>
              <span className="text-[10px] font-bold text-slate-700">Verified Doorstep</span>
            </div>

            <div className="bg-white rounded-xl p-4 border border-slate-200 shadow-sm">
              <span className="text-[11px] font-bold text-[#0B2038] block">Available Balance</span>
              <span className="text-xl font-black text-[#0B2038] mt-1 block">
                ₹{earnings.availableBalance.toLocaleString('en-IN')}
              </span>
              <span className="text-[10px] font-bold text-slate-700">Ready for payout</span>
            </div>

            <div className="bg-white rounded-xl p-4 border border-slate-200 shadow-sm">
              <span className="text-[11px] font-bold text-[#0B2038] block">Experience</span>
              <span className="text-xl font-black text-[#0B2038] mt-1 block">
                {worker.experienceYears} Years
              </span>
              <span className="text-[10px] font-bold text-slate-700">Trade Certified</span>
            </div>
          </div>

          {/* Service Capabilities */}
          <div className="bg-white rounded-2xl p-5 border border-slate-200 shadow-sm space-y-3">
            <h3 className="text-xs font-bold text-[#0B2038] uppercase tracking-wider">
              Service Capabilities & Skill Tags
            </h3>
            <div className="flex flex-wrap gap-2">
              {worker.services.map((srv, idx) => (
                <span
                  key={idx}
                  className="px-3 py-1.5 rounded-lg bg-teal-50 text-[#008A8E] font-bold text-xs border border-teal-200"
                >
                  ✓ {srv}
                </span>
              ))}
            </div>
          </div>

          {/* Customer Reviews & Ratings (Dynamic Reviews List) */}
          <div className="bg-white rounded-2xl p-5 border border-slate-200 shadow-sm space-y-4">
            <div className="flex items-center justify-between">
              <div>
                <h3 className="text-xs font-bold text-[#0B2038] uppercase tracking-wider">
                  Customer Reviews & Ratings ({workerReviews.length})
                </h3>
                <p className="text-xs font-medium text-slate-700 mt-0.5">
                  Real verified customer feedback from completed bookings
                </p>
              </div>
              <div className="flex items-center gap-1.5 px-3 py-1 rounded-full bg-amber-50 border border-amber-300">
                <Star className="w-4 h-4 text-amber-500 fill-current" />
                <span className="text-xs font-black text-[#0B2038]">
                  {ratingStats.formattedRating}
                </span>
              </div>
            </div>

            {workerReviews.length === 0 ? (
              <div className="p-6 text-center text-xs font-bold text-slate-700 bg-slate-50 rounded-xl border border-slate-200">
                No customer reviews yet for this professional.
              </div>
            ) : (
              <div className="divide-y divide-slate-100">
                {workerReviews.map((rev) => (
                  <div key={rev.id} className="py-3.5 space-y-1.5">
                    <div className="flex items-center justify-between">
                      <div className="flex items-center gap-2">
                        {rev.customerAvatar ? (
                          <img
                            src={rev.customerAvatar}
                            alt={rev.customerName}
                            className="w-7 h-7 rounded-full object-cover border border-slate-200"
                          />
                        ) : (
                          <div className="w-7 h-7 rounded-full bg-teal-100 text-[#008A8E] flex items-center justify-center font-bold text-xs">
                            {rev.customerName.charAt(0)}
                          </div>
                        )}
                        <div>
                          <span className="text-xs font-bold text-[#0B2038]">
                            {rev.customerName}
                          </span>
                          <span className="text-[10px] text-slate-600 font-mono ml-2">
                            Booking {rev.bookingId}
                          </span>
                        </div>
                      </div>

                      <div className="flex items-center gap-1">
                        {[1, 2, 3, 4, 5].map((s) => (
                          <Star
                            key={s}
                            className={`w-3.5 h-3.5 ${
                              s <= rev.rating
                                ? 'text-amber-500 fill-current'
                                : 'text-slate-300'
                            }`}
                          />
                        ))}
                        <span className="text-xs font-bold text-[#0B2038] ml-1">
                          {rev.rating}.0
                        </span>
                      </div>
                    </div>

                    {rev.review && (
                      <p className="text-xs text-slate-800 font-medium pl-9 italic">
                        "{rev.review}"
                      </p>
                    )}

                    <div className="text-[10px] text-slate-600 font-semibold pl-9">
                      {new Date(rev.createdAt).toLocaleDateString('en-IN', {
                        day: 'numeric',
                        month: 'short',
                        year: 'numeric',
                      })}
                    </div>
                  </div>
                ))}
              </div>
            )}
          </div>

          {/* Verified Documents */}
          <div className="bg-white rounded-2xl p-5 border border-slate-200 shadow-sm space-y-4">
            <div className="flex items-center justify-between">
              <h3 className="text-xs font-bold text-[#0B2038] uppercase tracking-wider">
                Submitted Verification Documents
              </h3>
              <button
                onClick={() => setIsVerificationModalOpen(true)}
                className="text-xs font-bold text-[#008A8E] hover:text-[#007074] cursor-pointer"
              >
                Inspect All Documents →
              </button>
            </div>

            <div className="space-y-2">
              {worker.documents.map((doc) => (
                <div
                  key={doc.id}
                  className="p-3.5 rounded-xl bg-slate-50 border border-slate-200 flex items-center justify-between text-xs"
                >
                  <div className="flex items-center gap-3">
                    <FileText className="w-4 h-4 text-[#008A8E]" />
                    <div>
                      <span className="font-bold text-[#0B2038] block">{doc.name}</span>
                      <span className="text-[11px] font-mono text-slate-700">
                        {doc.documentNumber}
                      </span>
                    </div>
                  </div>

                  <div className="flex items-center gap-2">
                    <span className="text-[10px] font-semibold text-slate-700">Uploaded {doc.uploadedAt}</span>
                    {doc.verified ? (
                      <span className="px-2 py-0.5 text-[10px] font-bold rounded-full bg-emerald-50 text-emerald-900 border border-emerald-300">
                        Verified
                      </span>
                    ) : (
                      <span className="px-2 py-0.5 text-[10px] font-bold rounded-full bg-amber-50 text-amber-900 border border-amber-300">
                        Pending
                      </span>
                    )}
                  </div>
                </div>
              ))}
            </div>
          </div>

          {/* Recent Handled Bookings */}
          <div className="bg-white rounded-2xl p-5 border border-slate-200 shadow-sm space-y-3">
            <h3 className="text-xs font-bold text-[#0B2038] uppercase tracking-wider">
              Recent Assigned Bookings
            </h3>
            {workerBookings.length === 0 ? (
              <p className="text-xs font-semibold text-slate-700 py-4 text-center">
                No recent bookings assigned in active session.
              </p>
            ) : (
              <div className="divide-y divide-slate-100">
                {workerBookings.map((b) => (
                  <div
                    key={b.bookingId}
                    className="py-3 flex items-center justify-between text-xs"
                  >
                    <div>
                      <Link
                        to={`/admin/bookings/${b.bookingId}`}
                        className="font-mono font-bold text-[#008A8E] hover:underline"
                      >
                        {b.bookingId}
                      </Link>
                      <span className="text-[#0B2038] font-bold ml-2">{b.serviceName}</span>
                      <p className="text-[11px] font-medium text-slate-700">
                        Customer: {b.customerName} • {b.date}
                      </p>
                    </div>
                    <div className="text-right">
                      <span className="font-black text-[#0B2038]">₹{b.totalAmount}</span>
                      <div className="mt-0.5">
                        <StatusBadge status={b.status} size="sm" />
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            )}
          </div>
        </div>
      </div>

      {/* Verification Modal */}
      {isVerificationModalOpen && (
        <WorkerVerificationModal
          worker={worker}
          isOpen={isVerificationModalOpen}
          onClose={() => setIsVerificationModalOpen(false)}
        />
      )}
    </div>
  );
};
