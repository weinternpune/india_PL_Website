import React from 'react';
import {
  BookingStatus,
  WorkerAvailability,
  WorkerStatus,
  VerificationStatus,
} from '../../types';
import {
  CheckCircle2,
  Clock,
  Radio,
  Send,
  Loader2,
  ShieldCheck,
  ShieldAlert,
  XCircle,
  AlertCircle,
} from 'lucide-react';

interface StatusBadgeProps {
  status:
    | BookingStatus
    | WorkerAvailability
    | WorkerStatus
    | VerificationStatus
    | 'Paid'
    | 'Refunded'
    | string;
  type?: 'booking' | 'availability' | 'workerStatus' | 'verification' | 'payment';
  size?: 'sm' | 'md';
}

export const StatusBadge: React.FC<StatusBadgeProps> = ({
  status,
  type = 'booking',
  size = 'md',
}) => {
  const sizeClasses = size === 'sm' ? 'px-2 py-0.5 text-xs' : 'px-2.5 py-1 text-xs';

  // Config mapping based on status
  const getConfig = () => {
    switch (status) {
      // Booking Statuses
      case 'Accepted':
        return {
          bg: 'bg-emerald-50 text-emerald-700 border-emerald-200',
          dot: 'bg-emerald-500',
          icon: <CheckCircle2 className="w-3.5 h-3.5" />,
          label: 'Accepted',
        };
      case 'In Progress':
        return {
          bg: 'bg-blue-50 text-blue-700 border-blue-200',
          dot: 'bg-blue-500 animate-pulse',
          icon: <Loader2 className="w-3.5 h-3.5 animate-spin" />,
          label: 'In Progress',
        };
      case 'Completed':
        return {
          bg: 'bg-teal-50 text-[#00827F] border-teal-200',
          dot: 'bg-[#009E9B]',
          icon: <CheckCircle2 className="w-3.5 h-3.5" />,
          label: 'Completed',
        };
      case 'Worker Notified':
        return {
          bg: 'bg-sky-50 text-sky-700 border-sky-200',
          dot: 'bg-sky-500 animate-ping',
          icon: <Send className="w-3.5 h-3.5" />,
          label: 'Worker Notified',
        };
      case 'Finding Worker':
        return {
          bg: 'bg-cyan-50 text-cyan-800 border-cyan-200',
          dot: 'bg-cyan-500 animate-pulse',
          icon: <Radio className="w-3.5 h-3.5 animate-pulse" />,
          label: 'Finding Worker',
        };
      case 'Pending':
        return {
          bg: 'bg-amber-50 text-amber-800 border-amber-200',
          dot: 'bg-amber-500',
          icon: <Clock className="w-3.5 h-3.5" />,
          label: 'Pending',
        };
      case 'Cancelled':
        return {
          bg: 'bg-rose-50 text-rose-700 border-rose-200',
          dot: 'bg-rose-500',
          icon: <XCircle className="w-3.5 h-3.5" />,
          label: 'Cancelled',
        };

      // Worker Availability
      case 'Available':
        return {
          bg: 'bg-emerald-50 text-emerald-700 border-emerald-200',
          dot: 'bg-emerald-500',
          icon: <span className="w-2 h-2 rounded-full bg-emerald-500" />,
          label: 'Available',
        };
      case 'Busy':
        return {
          bg: 'bg-amber-50 text-amber-700 border-amber-200',
          dot: 'bg-amber-500',
          icon: <span className="w-2 h-2 rounded-full bg-amber-500" />,
          label: 'Busy',
        };
      case 'Offline':
        return {
          bg: 'bg-slate-100 text-slate-600 border-slate-200',
          dot: 'bg-slate-400',
          icon: <span className="w-2 h-2 rounded-full bg-slate-400" />,
          label: 'Offline',
        };

      // Worker & Account Statuses
      case 'Active':
        return {
          bg: 'bg-teal-50 text-[#00827F] border-teal-200',
          dot: 'bg-[#009E9B]',
          icon: <CheckCircle2 className="w-3.5 h-3.5" />,
          label: 'Active',
        };
      case 'Pending Verification':
        return {
          bg: 'bg-orange-50 text-orange-800 border-orange-200',
          dot: 'bg-orange-500',
          icon: <Clock className="w-3.5 h-3.5" />,
          label: 'Pending Verification',
        };
      case 'Suspended':
        return {
          bg: 'bg-rose-50 text-rose-700 border-rose-200',
          dot: 'bg-rose-500',
          icon: <AlertCircle className="w-3.5 h-3.5" />,
          label: 'Suspended',
        };

      // Verification Statuses
      case 'Verified':
        return {
          bg: 'bg-teal-50 text-[#00827F] border-teal-200',
          dot: 'bg-[#009E9B]',
          icon: <ShieldCheck className="w-3.5 h-3.5 text-[#009E9B]" />,
          label: 'Verified Pro',
        };
      case 'Rejected':
        return {
          bg: 'bg-rose-50 text-rose-700 border-rose-200',
          dot: 'bg-rose-500',
          icon: <ShieldAlert className="w-3.5 h-3.5" />,
          label: 'Rejected',
        };

      // Payment Statuses
      case 'Paid':
        return {
          bg: 'bg-emerald-50 text-emerald-700 border-emerald-200',
          dot: 'bg-emerald-500',
          icon: <CheckCircle2 className="w-3.5 h-3.5" />,
          label: 'Paid',
        };
      case 'Refunded':
        return {
          bg: 'bg-purple-50 text-purple-700 border-purple-200',
          dot: 'bg-purple-500',
          icon: <Clock className="w-3.5 h-3.5" />,
          label: 'Refunded',
        };

      default:
        return {
          bg: 'bg-slate-100 text-slate-700 border-slate-200',
          dot: 'bg-slate-400',
          icon: null,
          label: status,
        };
    }
  };

  const config = getConfig();

  return (
    <span
      className={`inline-flex items-center gap-1.5 font-semibold rounded-full border shadow-2xs whitespace-nowrap ${config.bg} ${sizeClasses}`}
    >
      {config.icon}
      <span>{config.label}</span>
    </span>
  );
};
