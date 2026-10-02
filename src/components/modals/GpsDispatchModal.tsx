import React, { useState } from 'react';
import { useApp } from '../../context/AppContext';
import { Booking, Worker } from '../../types';
import {
  findNearestAvailableWorkers,
  calculateHaversineDistance,
} from '../../services/gpsService';
import { StatusBadge } from '../common/StatusBadge';
import {
  Compass,
  MapPin,
  Send,
  CheckCircle2,
  XCircle,
  AlertTriangle,
  RotateCcw,
  UserCheck,
  Phone,
  Star,
  X,
  Radio,
  Navigation,
} from 'lucide-react';

interface GpsDispatchModalProps {
  bookingId: string;
  isOpen: boolean;
  onClose: () => void;
}

export const GpsDispatchModal: React.FC<GpsDispatchModalProps> = ({
  bookingId,
  isOpen,
  onClose,
}) => {
  const {
    getBookingById,
    workers,
    autoDispatchWorker,
    simulateWorkerResponse,
  } = useApp();

  const [isProcessing, setIsProcessing] = useState(false);
  const [dispatchMessage, setDispatchMessage] = useState<string | null>(null);

  if (!isOpen) return null;

  const booking = getBookingById(bookingId);
  if (!booking) return null;

  const customerLat = booking.customerLocation.latitude;
  const customerLng = booking.customerLocation.longitude;

  // Compute all potential candidates for this service
  const candidates = findNearestAvailableWorkers(
    customerLat,
    customerLng,
    booking.serviceCategory || booking.serviceName,
    workers,
    []
  );

  const handleTriggerAutoAssign = () => {
    setIsProcessing(true);
    setDispatchMessage('Scanning Bhubaneswar coordinates and calculating Haversine distance...');
    setTimeout(() => {
      const res = autoDispatchWorker(booking.bookingId);
      setIsProcessing(false);
      setDispatchMessage(res.message);
    }, 700);
  };

  const handleSimulateResponse = (accepted: boolean) => {
    setIsProcessing(true);
    simulateWorkerResponse(booking.bookingId, accepted);
    setTimeout(() => {
      setIsProcessing(false);
      setDispatchMessage(
        accepted
          ? `Worker accepted! Booking is now marked as Accepted.`
          : `Worker rejected. GPS algorithm automatically reallocated to next candidate.`
      );
    }, 500);
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-[#0B2038]/40 backdrop-blur-xs p-4 animate-in fade-in duration-200">
      <div className="bg-white rounded-3xl border border-[#DCEEEB] shadow-2xl max-w-2xl w-full max-h-[90vh] overflow-hidden flex flex-col">
        {/* Header */}
        <div className="px-6 py-5 bg-gradient-to-r from-teal-50 to-[#EBF8F7] border-b border-[#DCEEEB] flex items-center justify-between">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 rounded-2xl bg-[#009E9B] text-white flex items-center justify-center shadow-md">
              <Compass className="w-5 h-5 animate-pulse" />
            </div>
            <div>
              <div className="flex items-center gap-2">
                <h3 className="text-lg font-bold text-[#0B2038]">
                  Automatic GPS Worker Dispatch
                </h3>
                <span className="text-xs font-mono font-bold px-2 py-0.5 rounded-full bg-teal-100 text-[#00827F]">
                  {booking.bookingId}
                </span>
              </div>
              <p className="text-xs text-[#5B738B]">
                Haversine Geographic Matching • Auto-Assignment Engine
              </p>
            </div>
          </div>
          <button
            onClick={onClose}
            className="p-2 rounded-full hover:bg-white text-slate-400 hover:text-[#0B2038] transition-colors"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Body */}
        <div className="p-6 overflow-y-auto space-y-6">
          {/* Customer Location Info Card */}
          <div className="p-4 rounded-2xl bg-[#F4FBFB] border border-[#DCEEEB]">
            <div className="flex items-start justify-between gap-3">
              <div className="space-y-1">
                <span className="text-[11px] font-bold uppercase tracking-wider text-[#009E9B]">
                  Customer & Service Details
                </span>
                <h4 className="text-sm font-bold text-[#0B2038]">
                  {booking.customerName} • {booking.serviceName}
                </h4>
                <div className="flex items-center gap-1.5 text-xs text-[#5B738B]">
                  <MapPin className="w-3.5 h-3.5 text-[#009E9B] shrink-0" />
                  <span>{booking.customerLocation.address}, {booking.customerLocation.city}</span>
                </div>
              </div>
              <div className="text-right">
                <StatusBadge status={booking.status} />
                <div className="mt-1 font-mono text-[11px] text-slate-400">
                  {customerLat.toFixed(4)}°N, {customerLng.toFixed(4)}°E
                </div>
              </div>
            </div>
          </div>

          {/* Current Assigned Pro / Status Box */}
          {booking.assignedWorkerName ? (
            <div className="p-4 rounded-2xl border-2 border-teal-500/20 bg-teal-50/30">
              <div className="flex items-center justify-between mb-3">
                <span className="text-xs font-bold text-[#00827F] flex items-center gap-1.5">
                  <Radio className="w-3.5 h-3.5 text-[#009E9B] animate-pulse" />
                  Currently Targeted / Assigned Pro
                </span>
                <span className="text-xs font-bold px-2 py-0.5 rounded-full bg-teal-100 text-[#00827F]">
                  {booking.workerDistance} km away
                </span>
              </div>

              <div className="flex items-center justify-between flex-wrap gap-4">
                <div className="flex items-center gap-3">
                  <img
                    src={booking.assignedWorkerAvatar || 'https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?auto=format&fit=crop&w=256&q=80'}
                    alt={booking.assignedWorkerName}
                    className="w-12 h-12 rounded-2xl object-cover border-2 border-[#009E9B]"
                  />
                  <div>
                    <h5 className="text-sm font-bold text-[#0B2038]">
                      {booking.assignedWorkerName}
                    </h5>
                    <div className="flex items-center gap-2 text-xs text-[#5B738B]">
                      <span>{booking.assignedWorkerPhone}</span>
                      <span>•</span>
                      <span className="flex items-center text-amber-500">
                        <Star className="w-3 h-3 fill-current mr-0.5" />
                        {booking.assignedWorkerRating || 4.8}
                      </span>
                    </div>
                  </div>
                </div>

                {/* Worker Simulated Response Actions */}
                {booking.status === 'Worker Notified' && (
                  <div className="flex items-center gap-2">
                    <button
                      onClick={() => handleSimulateResponse(true)}
                      disabled={isProcessing}
                      className="inline-flex items-center gap-1.5 px-3 py-1.5 rounded-xl bg-emerald-600 text-white text-xs font-bold hover:bg-emerald-700 transition-colors shadow-sm"
                    >
                      <CheckCircle2 className="w-3.5 h-3.5" />
                      <span>Simulate Accept</span>
                    </button>
                    <button
                      onClick={() => handleSimulateResponse(false)}
                      disabled={isProcessing}
                      className="inline-flex items-center gap-1.5 px-3 py-1.5 rounded-xl bg-rose-50 text-rose-700 border border-rose-200 text-xs font-bold hover:bg-rose-100 transition-colors"
                    >
                      <XCircle className="w-3.5 h-3.5" />
                      <span>Simulate Reject</span>
                    </button>
                  </div>
                )}
              </div>
            </div>
          ) : (
            <div className="p-4 rounded-2xl border border-dashed border-amber-300 bg-amber-50/50 flex items-center justify-between">
              <div className="flex items-center gap-3">
                <AlertTriangle className="w-5 h-5 text-amber-600" />
                <div className="text-xs">
                  <p className="font-bold text-amber-900">No Professional Assigned Yet</p>
                  <p className="text-amber-700">Ready for automated nearest worker allocation.</p>
                </div>
              </div>
              <button
                onClick={handleTriggerAutoAssign}
                disabled={isProcessing}
                className="inline-flex items-center gap-1.5 px-4 py-2 rounded-full bg-[#009E9B] text-white text-xs font-bold hover:bg-[#00827F] transition-colors shadow-sm"
              >
                <Send className="w-3.5 h-3.5" />
                <span>Auto-Assign Nearest</span>
              </button>
            </div>
          )}

          {/* Feedback message */}
          {dispatchMessage && (
            <div className="p-3 text-xs rounded-xl bg-teal-50 border border-teal-200 text-[#00827F] flex items-center gap-2 animate-in fade-in">
              <Navigation className="w-4 h-4 shrink-0 text-[#009E9B]" />
              <span>{dispatchMessage}</span>
            </div>
          )}

          {/* Ranked Candidates by Haversine Distance */}
          <div>
            <div className="flex items-center justify-between mb-3">
              <h4 className="text-xs font-bold text-[#0B2038] uppercase tracking-wider">
                Eligible Verified Pros in Range (Haversine Sorted)
              </h4>
              <span className="text-xs font-semibold text-[#5B738B]">
                {candidates.length} active pros found
              </span>
            </div>

            <div className="divide-y divide-slate-100 border border-[#DCEEEB] rounded-2xl overflow-hidden bg-white">
              {candidates.length === 0 ? (
                <div className="p-6 text-center text-xs text-slate-400">
                  No active verified workers available for this category right now.
                </div>
              ) : (
                candidates.map(({ worker, distanceKm }, idx) => {
                  const isCurrent = worker.workerId === booking.assignedWorkerId;
                  return (
                    <div
                      key={worker.workerId}
                      className={`p-3.5 flex items-center justify-between gap-3 text-xs transition-colors ${
                        isCurrent ? 'bg-teal-50/70 font-semibold' : 'hover:bg-slate-50'
                      }`}
                    >
                      <div className="flex items-center gap-3">
                        <span className="w-5 text-center font-bold text-slate-400">
                          #{idx + 1}
                        </span>
                        <img
                          src={worker.profileImage}
                          alt={worker.name}
                          className="w-9 h-9 rounded-xl object-cover border border-slate-200"
                        />
                        <div>
                          <div className="flex items-center gap-2">
                            <span className="font-bold text-[#0B2038]">{worker.name}</span>
                            {isCurrent && (
                              <span className="text-[10px] font-bold px-1.5 py-0.2 bg-teal-200 text-[#00827F] rounded">
                                Selected
                              </span>
                            )}
                          </div>
                          <p className="text-[11px] text-[#5B738B]">{worker.locationName}</p>
                        </div>
                      </div>

                      <div className="flex items-center gap-4 text-right">
                        <div>
                          <span className="font-bold text-[#009E9B] text-sm">
                            {distanceKm} km
                          </span>
                          <p className="text-[10px] text-slate-400">Haversine</p>
                        </div>
                        <div className="hidden sm:block">
                          <StatusBadge status={worker.availability} type="availability" size="sm" />
                        </div>
                      </div>
                    </div>
                  );
                })
              )}
            </div>
          </div>

          {/* Dispatch Event Log */}
          {booking.dispatchLog && booking.dispatchLog.length > 0 && (
            <div>
              <h4 className="text-xs font-bold text-[#0B2038] uppercase tracking-wider mb-2">
                Dispatch Event Log
              </h4>
              <div className="space-y-1.5">
                {booking.dispatchLog.map((log, idx) => (
                  <div
                    key={idx}
                    className="p-2.5 rounded-xl bg-slate-50 border border-slate-200 flex items-center justify-between text-xs"
                  >
                    <div className="flex items-center gap-2">
                      <span className="w-5 h-5 rounded-full bg-teal-100 text-[#00827F] font-bold flex items-center justify-center text-[10px]">
                        {log.attemptNumber}
                      </span>
                      <span className="font-bold text-[#0B2038]">{log.workerName}</span>
                      <span className="text-slate-400">({log.distanceKm} km away)</span>
                    </div>
                    <div className="flex items-center gap-2">
                      <span
                        className={`font-semibold px-2 py-0.5 rounded text-[11px] ${
                          log.action === 'Accepted'
                            ? 'bg-emerald-100 text-emerald-800'
                            : log.action === 'Rejected'
                            ? 'bg-rose-100 text-rose-800'
                            : 'bg-sky-100 text-sky-800'
                        }`}
                      >
                        {log.action}
                      </span>
                      <span className="text-[10px] text-slate-400">{log.timestamp}</span>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          )}
        </div>

        {/* Footer Actions */}
        <div className="px-6 py-4 bg-slate-50 border-t border-[#DCEEEB] flex items-center justify-between">
          <button
            onClick={onClose}
            className="px-4 py-2 rounded-full border border-slate-300 text-xs font-semibold text-slate-700 hover:bg-white"
          >
            Close
          </button>

          <button
            onClick={handleTriggerAutoAssign}
            disabled={isProcessing}
            className="inline-flex items-center gap-2 px-5 py-2.5 rounded-full bg-[#009E9B] text-white text-xs font-bold hover:bg-[#00827F] transition-all shadow-sm"
          >
            <Compass className="w-4 h-4" />
            <span>Re-Run GPS Matching Engine</span>
          </button>
        </div>
      </div>
    </div>
  );
};
