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
  ShieldCheck,
  Star,
  CheckCircle2,
  Calendar,
  FileText,
  Briefcase,
  AlertCircle,
  Compass,
  Award,
} from 'lucide-react';

export const AdminWorkerDetailPage: React.FC = () => {
  const { id } = useParams<{ id: string }>();
  const navigate = useNavigate();
  const { getWorkerById, toggleWorkerAvailability, updateWorker, bookings } = useApp();

  const [isVerificationModalOpen, setIsVerificationModalOpen] = useState(false);

  const worker = getWorkerById(id || '');

  if (!worker) {
    return (
      <div className="py-16 text-center space-y-4">
        <h2 className="text-xl font-bold text-[#0B2038]">Worker Profile Not Found</h2>
        <p className="text-xs text-[#5B738B]">Could not locate professional identifier {id}.</p>
        <Link
          to="/admin/workers"
          className="inline-flex items-center gap-2 px-4 py-2 rounded-full bg-[#009E9B] text-white text-xs font-bold"
        >
          <ArrowLeft className="w-4 h-4" />
          <span>Back to Pros</span>
        </Link>
      </div>
    );
  }

  // Find bookings assigned to this worker
  const workerBookings = bookings.filter((b) => b.assignedWorkerId === worker.workerId);

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
            className="p-2 rounded-2xl bg-white border border-[#DCEEEB] text-slate-600 hover:text-[#009E9B] hover:bg-teal-50 transition-colors shadow-2xs"
          >
            <ArrowLeft className="w-4 h-4" />
          </button>
          <div>
            <div className="flex items-center gap-2">
              <h1 className="text-2xl font-extrabold text-[#0B2038]">{worker.name}</h1>
              <span className="font-mono text-xs font-bold px-2 py-0.5 rounded-full bg-teal-100 text-[#00827F]">
                {worker.workerId}
              </span>
            </div>
            <p className="text-xs text-[#5B738B]">
              Registered Pro since {worker.joinedDate} • {worker.locationName}
            </p>
          </div>
        </div>

        <div className="flex items-center gap-3">
          <StatusBadge status={worker.verificationStatus} type="verification" size="md" />
          <button
            onClick={() => setIsVerificationModalOpen(true)}
            className="px-4 py-2 rounded-full bg-white text-[#009E9B] border border-teal-300 hover:bg-teal-50 text-xs font-bold shadow-2xs transition-colors"
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
          <div className="bg-white rounded-3xl p-6 border border-[#DCEEEB] shadow-2xs text-center space-y-4">
            <div className="relative inline-block">
              <img
                src={worker.profileImage}
                alt={worker.name}
                className="w-24 h-24 rounded-3xl object-cover border-4 border-teal-100 mx-auto shadow-md"
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
              <h3 className="text-lg font-bold text-[#0B2038]">{worker.name}</h3>
              <p className="text-xs text-[#009E9B] font-semibold">
                {worker.categories.join(' • ')} Specialist
              </p>
            </div>

            {/* Availability State Selector */}
            <div className="p-3 rounded-2xl bg-[#F4FBFB] border border-[#DCEEEB] space-y-2 text-left">
              <span className="text-[11px] font-bold uppercase tracking-wider text-[#5B738B] block">
                GPS Availability State
              </span>
              <div className="grid grid-cols-3 gap-1.5">
                {(['Available', 'Busy', 'Offline'] as WorkerAvailability[]).map((state) => (
                  <button
                    key={state}
                    onClick={() => handleAvailabilityChange(state)}
                    className={`py-1.5 px-2 rounded-xl text-xs font-bold transition-all ${
                      worker.availability === state
                        ? 'bg-[#009E9B] text-white shadow-2xs'
                        : 'bg-white text-slate-600 hover:bg-slate-100 border border-slate-200'
                    }`}
                  >
                    {state}
                  </button>
                ))}
              </div>
            </div>

            {/* Contact Details */}
            <div className="space-y-2.5 text-xs text-[#5B738B] text-left pt-2 border-t border-slate-100">
              <div className="flex items-center gap-2">
                <Phone className="w-4 h-4 text-[#009E9B]" />
                <span className="text-[#0B2038] font-medium">{worker.phone}</span>
              </div>
              <div className="flex items-center gap-2">
                <Mail className="w-4 h-4 text-[#009E9B]" />
                <span className="text-[#0B2038] font-medium truncate">{worker.email}</span>
              </div>
              <div className="flex items-center gap-2">
                <MapPin className="w-4 h-4 text-[#009E9B]" />
                <span className="text-[#0B2038] font-medium">{worker.locationName}</span>
              </div>
            </div>
          </div>

          {/* GPS Coordinates & Cluster Card */}
          <div className="bg-white rounded-3xl p-6 border border-[#DCEEEB] shadow-2xs space-y-3">
            <h4 className="text-xs font-bold uppercase tracking-wider text-[#0B2038]">
              Live GPS Cluster
            </h4>
            <div className="p-3 rounded-2xl bg-[#F8FCFC] border border-[#DCEEEB] space-y-1">
              <div className="flex justify-between text-xs">
                <span className="text-slate-400">Latitude</span>
                <span className="font-mono font-bold text-[#0B2038]">{worker.latitude}° N</span>
              </div>
              <div className="flex justify-between text-xs">
                <span className="text-slate-400">Longitude</span>
                <span className="font-mono font-bold text-[#0B2038]">{worker.longitude}° E</span>
              </div>
            </div>
            <p className="text-[11px] text-[#5B738B]">
              Real-time coordinates used by the automated Haversine dispatch algorithm.
            </p>
          </div>
        </div>

        {/* Right Column (8 cols): Performance Metrics, Skills, Documents & Recent Jobs */}
        <div className="lg:col-span-8 space-y-6">
          {/* Key Metrics Cards */}
          <div className="grid grid-cols-2 sm:grid-cols-4 gap-3">
            <div className="bg-white rounded-2xl p-4 border border-[#DCEEEB] shadow-2xs">
              <span className="text-[11px] font-semibold text-[#5B738B] block">Pro Rating</span>
              <div className="flex items-center gap-1 mt-1">
                <Star className="w-4 h-4 text-amber-500 fill-current" />
                <span className="text-xl font-extrabold text-[#0B2038]">{worker.rating}</span>
              </div>
              <span className="text-[10px] text-slate-400">{worker.ratingCount} ratings</span>
            </div>

            <div className="bg-white rounded-2xl p-4 border border-[#DCEEEB] shadow-2xs">
              <span className="text-[11px] font-semibold text-[#5B738B] block">Completed Jobs</span>
              <span className="text-xl font-extrabold text-[#009E9B] mt-1 block">
                {worker.completedJobs}
              </span>
              <span className="text-[10px] text-slate-400">Verified Doorstep</span>
            </div>

            <div className="bg-white rounded-2xl p-4 border border-[#DCEEEB] shadow-2xs">
              <span className="text-[11px] font-semibold text-[#5B738B] block">Cancellations</span>
              <span className="text-xl font-extrabold text-[#0B2038] mt-1 block">
                {worker.cancellationCount}
              </span>
              <span className="text-[10px] text-slate-400">Low risk pro</span>
            </div>

            <div className="bg-white rounded-2xl p-4 border border-[#DCEEEB] shadow-2xs">
              <span className="text-[11px] font-semibold text-[#5B738B] block">Experience</span>
              <span className="text-xl font-extrabold text-[#0B2038] mt-1 block">
                {worker.experienceYears} Years
              </span>
              <span className="text-[10px] text-slate-400">Trade Certified</span>
            </div>
          </div>

          {/* Service Capabilities */}
          <div className="bg-white rounded-3xl p-6 border border-[#DCEEEB] shadow-2xs space-y-3">
            <h3 className="text-sm font-bold text-[#0B2038] uppercase tracking-wider">
              Service Capabilities & Skill Tags
            </h3>
            <div className="flex flex-wrap gap-2">
              {worker.services.map((srv, idx) => (
                <span
                  key={idx}
                  className="px-3 py-1.5 rounded-xl bg-teal-50 text-[#00827F] font-semibold text-xs border border-teal-200"
                >
                  ✓ {srv}
                </span>
              ))}
            </div>
          </div>

          {/* Verified Documents */}
          <div className="bg-white rounded-3xl p-6 border border-[#DCEEEB] shadow-2xs space-y-4">
            <div className="flex items-center justify-between">
              <h3 className="text-sm font-bold text-[#0B2038] uppercase tracking-wider">
                Submitted Verification Documents
              </h3>
              <button
                onClick={() => setIsVerificationModalOpen(true)}
                className="text-xs font-bold text-[#009E9B] hover:text-[#00827F]"
              >
                Inspect All Documents →
              </button>
            </div>

            <div className="space-y-2">
              {worker.documents.map((doc) => (
                <div
                  key={doc.id}
                  className="p-3.5 rounded-2xl bg-[#F8FCFC] border border-[#DCEEEB] flex items-center justify-between text-xs"
                >
                  <div className="flex items-center gap-3">
                    <FileText className="w-4 h-4 text-[#009E9B]" />
                    <div>
                      <span className="font-bold text-[#0B2038] block">{doc.name}</span>
                      <span className="text-[11px] font-mono text-slate-400">
                        {doc.documentNumber}
                      </span>
                    </div>
                  </div>

                  <div className="flex items-center gap-2">
                    <span className="text-[10px] text-slate-400">Uploaded {doc.uploadedAt}</span>
                    {doc.verified ? (
                      <span className="px-2 py-0.5 text-[10px] font-bold rounded-full bg-emerald-50 text-emerald-700 border border-emerald-200">
                        Verified
                      </span>
                    ) : (
                      <span className="px-2 py-0.5 text-[10px] font-bold rounded-full bg-amber-50 text-amber-700 border border-amber-200">
                        Pending
                      </span>
                    )}
                  </div>
                </div>
              ))}
            </div>
          </div>

          {/* Recent Handled Bookings */}
          <div className="bg-white rounded-3xl p-6 border border-[#DCEEEB] shadow-2xs space-y-3">
            <h3 className="text-sm font-bold text-[#0B2038] uppercase tracking-wider">
              Recent Assigned Bookings
            </h3>
            {workerBookings.length === 0 ? (
              <p className="text-xs text-slate-400 py-4 text-center">
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
                        className="font-mono font-bold text-[#009E9B] hover:underline"
                      >
                        {b.bookingId}
                      </Link>
                      <span className="text-[#0B2038] font-medium ml-2">{b.serviceName}</span>
                      <p className="text-[11px] text-slate-400">
                        Customer: {b.customerName} • {b.date}
                      </p>
                    </div>
                    <div className="text-right">
                      <span className="font-bold text-[#0B2038]">₹{b.totalAmount}</span>
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
