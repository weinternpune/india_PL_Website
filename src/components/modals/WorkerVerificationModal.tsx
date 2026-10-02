import React from 'react';
import { Worker } from '../../types';
import { useApp } from '../../context/AppContext';
import { StatusBadge } from '../common/StatusBadge';
import {
  X,
  ShieldCheck,
  ShieldAlert,
  FileText,
  MapPin,
  Briefcase,
  Calendar,
  Phone,
  Mail,
  CheckCircle,
} from 'lucide-react';

interface WorkerVerificationModalProps {
  worker: Worker | null;
  isOpen: boolean;
  onClose: () => void;
}

export const WorkerVerificationModal: React.FC<WorkerVerificationModalProps> = ({
  worker,
  isOpen,
  onClose,
}) => {
  const { approveWorker, rejectWorker } = useApp();

  if (!isOpen || !worker) return null;

  const handleApprove = () => {
    approveWorker(worker.workerId);
    onClose();
  };

  const handleReject = () => {
    rejectWorker(worker.workerId);
    onClose();
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-[#0B2038]/40 backdrop-blur-xs p-4 animate-in fade-in duration-200">
      <div className="bg-white rounded-3xl border border-[#DCEEEB] shadow-2xl max-w-xl w-full max-h-[90vh] overflow-hidden flex flex-col">
        {/* Header */}
        <div className="px-6 py-4 bg-teal-50/70 border-b border-[#DCEEEB] flex items-center justify-between">
          <div className="flex items-center gap-2.5">
            <div className="w-9 h-9 rounded-xl bg-[#009E9B] text-white flex items-center justify-center">
              <ShieldCheck className="w-5 h-5" />
            </div>
            <div>
              <h3 className="text-base font-bold text-[#0B2038]">
                Professional Verification Review
              </h3>
              <p className="text-xs text-[#5B738B]">
                Review credentials & background checks for {worker.workerId}
              </p>
            </div>
          </div>
          <button
            onClick={onClose}
            className="p-1.5 rounded-full hover:bg-white text-slate-400 hover:text-[#0B2038]"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Content */}
        <div className="p-6 overflow-y-auto space-y-5">
          {/* Pro Summary Card */}
          <div className="p-4 rounded-2xl bg-[#F4FBFB] border border-[#DCEEEB] flex items-center gap-4">
            <img
              src={worker.profileImage}
              alt={worker.name}
              className="w-16 h-16 rounded-2xl object-cover border-2 border-teal-200"
            />
            <div className="flex-1 space-y-1">
              <div className="flex items-center justify-between">
                <h4 className="text-base font-bold text-[#0B2038]">{worker.name}</h4>
                <StatusBadge status={worker.verificationStatus} type="verification" size="sm" />
              </div>
              <div className="flex flex-wrap gap-x-4 gap-y-1 text-xs text-[#5B738B]">
                <span className="flex items-center gap-1">
                  <Phone className="w-3.5 h-3.5 text-[#009E9B]" />
                  {worker.phone}
                </span>
                <span className="flex items-center gap-1">
                  <Mail className="w-3.5 h-3.5 text-[#009E9B]" />
                  {worker.email}
                </span>
              </div>
              <div className="flex items-center gap-3 text-xs text-slate-500 pt-1">
                <span className="flex items-center gap-1">
                  <MapPin className="w-3.5 h-3.5 text-[#009E9B]" />
                  {worker.locationName}
                </span>
                <span>•</span>
                <span className="flex items-center gap-1">
                  <Briefcase className="w-3.5 h-3.5 text-[#009E9B]" />
                  {worker.experienceYears} Years Experience
                </span>
              </div>
            </div>
          </div>

          {/* Categories & Services */}
          <div>
            <h5 className="text-xs font-bold text-[#0B2038] uppercase tracking-wider mb-2">
              Applied Categories & Services
            </h5>
            <div className="flex flex-wrap gap-1.5">
              {worker.services.map((srv, idx) => (
                <span
                  key={idx}
                  className="px-2.5 py-1 rounded-full text-xs font-semibold bg-teal-50 text-[#00827F] border border-teal-200"
                >
                  {srv}
                </span>
              ))}
            </div>
          </div>

          {/* Submitted Documents */}
          <div>
            <h5 className="text-xs font-bold text-[#0B2038] uppercase tracking-wider mb-2">
              Submitted KYC & Verification Documents
            </h5>
            <div className="space-y-2">
              {worker.documents.map((doc) => (
                <div
                  key={doc.id}
                  className="p-3 rounded-2xl bg-white border border-[#DCEEEB] flex items-center justify-between"
                >
                  <div className="flex items-center gap-3">
                    <div className="w-8 h-8 rounded-xl bg-slate-100 flex items-center justify-center text-slate-600">
                      <FileText className="w-4 h-4 text-[#009E9B]" />
                    </div>
                    <div>
                      <span className="text-xs font-bold text-[#0B2038] block">{doc.name}</span>
                      <span className="text-[11px] font-mono text-slate-500">
                        Doc No: {doc.documentNumber}
                      </span>
                    </div>
                  </div>

                  <div className="flex items-center gap-2">
                    <span className="text-[11px] text-slate-400">Uploaded {doc.uploadedAt}</span>
                    {doc.verified ? (
                      <span className="inline-flex items-center gap-1 text-[11px] font-bold text-emerald-700 bg-emerald-50 px-2 py-0.5 rounded-full border border-emerald-200">
                        <CheckCircle className="w-3 h-3 text-emerald-600" />
                        Valid
                      </span>
                    ) : (
                      <span className="inline-flex items-center gap-1 text-[11px] font-bold text-amber-700 bg-amber-50 px-2 py-0.5 rounded-full border border-amber-200">
                        Needs Review
                      </span>
                    )}
                  </div>
                </div>
              ))}
            </div>
          </div>

          {/* Registration Date */}
          <div className="text-xs text-[#5B738B] flex items-center gap-1.5 pt-1">
            <Calendar className="w-3.5 h-3.5 text-slate-400" />
            <span>Applicant Registered: {worker.joinedDate}</span>
          </div>
        </div>

        {/* Footer Actions */}
        <div className="px-6 py-4 bg-slate-50 border-t border-[#DCEEEB] flex items-center justify-between">
          <button
            onClick={onClose}
            className="px-4 py-2 text-xs font-semibold text-slate-600 hover:bg-white rounded-full border border-slate-200"
          >
            Close
          </button>

          <div className="flex items-center gap-2.5">
            {worker.verificationStatus !== 'Rejected' && (
              <button
                onClick={handleReject}
                className="inline-flex items-center gap-1.5 px-4 py-2 rounded-full border border-rose-300 text-rose-700 hover:bg-rose-50 text-xs font-bold transition-all"
              >
                <ShieldAlert className="w-4 h-4" />
                <span>Reject Application</span>
              </button>
            )}

            {worker.verificationStatus !== 'Verified' && (
              <button
                onClick={handleApprove}
                className="inline-flex items-center gap-1.5 px-5 py-2.5 rounded-full bg-[#009E9B] text-white hover:bg-[#00827F] text-xs font-bold shadow-sm transition-all"
              >
                <ShieldCheck className="w-4 h-4" />
                <span>Approve & Activate Pro</span>
              </button>
            )}
          </div>
        </div>
      </div>
    </div>
  );
};
