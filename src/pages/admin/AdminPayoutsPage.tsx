import React, { useState } from 'react';
import { useApp } from '../../context/AppContext';
import { PayoutRequest, PayoutStatus } from '../../types';
import {
  IndianRupee,
  Clock,
  CheckCircle2,
  XCircle,
  RefreshCw,
  FileCheck,
  Search,
  Landmark,
  QrCode,
  ShieldCheck,
  AlertTriangle,
  X,
  Copy,
} from 'lucide-react';

export const AdminPayoutsPage: React.FC = () => {
  const {
    payoutRequests,
    payoutMetrics,
    verifyPayout,
    approvePayout,
    rejectPayout,
    markPayoutPaid,
    calculateWorkerEarnings,
  } = useApp();

  const [activeTab, setActiveTab] = useState<string>('All');
  const [searchQuery, setSearchQuery] = useState<string>('');
  const [selectedPayout, setSelectedPayout] = useState<PayoutRequest | null>(null);

  // Modal Action States
  const [rejectingId, setRejectingId] = useState<string | null>(null);
  const [rejectionReason, setRejectionReason] = useState<string>('');
  const [payingId, setPayingId] = useState<string | null>(null);
  const [transactionRef, setTransactionRef] = useState<string>('');
  const [copiedUpi, setCopiedUpi] = useState<boolean>(false);

  // Filter logic
  const filteredPayouts = payoutRequests.filter((p) => {
    const matchesTab = activeTab === 'All' || p.status === activeTab;
    const q = searchQuery.toLowerCase().trim();
    const matchesSearch =
      !q ||
      p.id.toLowerCase().includes(q) ||
      p.workerName.toLowerCase().includes(q) ||
      p.workerPhone.includes(q) ||
      (p.paymentDetails.upiId && p.paymentDetails.upiId.toLowerCase().includes(q)) ||
      (p.paymentDetails.accountNumber && p.paymentDetails.accountNumber.includes(q));

    return matchesTab && matchesSearch;
  });

  const getStatusBadge = (status: PayoutStatus) => {
    switch (status) {
      case 'Pending':
        return (
          <span className="inline-flex items-center gap-1.5 px-2.5 py-1 rounded-full text-xs font-bold bg-amber-50 text-amber-900 border border-amber-300">
            <Clock className="w-3.5 h-3.5 text-amber-700" />
            Pending Review
          </span>
        );
      case 'Under Review':
        return (
          <span className="inline-flex items-center gap-1.5 px-2.5 py-1 rounded-full text-xs font-bold bg-blue-50 text-blue-900 border border-blue-300">
            <RefreshCw className="w-3.5 h-3.5 text-blue-700 animate-spin" />
            Under Review
          </span>
        );
      case 'Approved':
        return (
          <span className="inline-flex items-center gap-1.5 px-2.5 py-1 rounded-full text-xs font-bold bg-emerald-50 text-emerald-900 border border-emerald-300">
            <CheckCircle2 className="w-3.5 h-3.5 text-emerald-700" />
            Approved
          </span>
        );
      case 'Paid':
        return (
          <span className="inline-flex items-center gap-1.5 px-2.5 py-1 rounded-full text-xs font-bold bg-teal-50 text-teal-900 border border-[#00A896]/30">
            <ShieldCheck className="w-3.5 h-3.5 text-[#008A8E]" />
            Paid & Settled
          </span>
        );
      case 'Rejected':
        return (
          <span className="inline-flex items-center gap-1.5 px-2.5 py-1 rounded-full text-xs font-bold bg-rose-50 text-rose-900 border border-rose-300">
            <XCircle className="w-3.5 h-3.5 text-rose-700" />
            Rejected
          </span>
        );
      default:
        return null;
    }
  };

  const handleCopyUpi = (upiId: string) => {
    navigator.clipboard.writeText(upiId);
    setCopiedUpi(true);
    setTimeout(() => setCopiedUpi(false), 2000);
  };

  const handleOpenModal = (payout: PayoutRequest) => {
    setSelectedPayout(payout);
    setRejectingId(null);
    setPayingId(null);
    setRejectionReason('');
    setTransactionRef('');
  };

  const handleConfirmReject = (id: string) => {
    if (!rejectionReason.trim()) {
      alert('Please enter a clear reason for rejecting this payout request.');
      return;
    }
    rejectPayout(id, rejectionReason.trim());
    setRejectingId(null);
    setRejectionReason('');
    if (selectedPayout && selectedPayout.id === id) {
      setSelectedPayout({ ...selectedPayout, status: 'Rejected', rejectionReason: rejectionReason.trim() });
    }
  };

  const handleConfirmPaid = (id: string) => {
    if (!transactionRef.trim()) {
      alert('Please enter bank transaction reference or UTR number.');
      return;
    }
    markPayoutPaid(id, transactionRef.trim());
    setPayingId(null);
    setTransactionRef('');
    if (selectedPayout && selectedPayout.id === id) {
      setSelectedPayout({ ...selectedPayout, status: 'Paid', transactionRef: transactionRef.trim() });
    }
  };

  return (
    <div className="space-y-6">
      {/* Top Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <h1 className="text-2xl font-black text-[#0B2038] tracking-tight">
            Worker Payouts & Settlement
          </h1>
          <p className="text-sm font-medium text-slate-800 mt-1">
            Review earnings, verify bank accounts, and disburse weekly payouts to INDIA P.L. service professionals.
          </p>
        </div>
      </div>

      {/* 4 Summary Cards */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
        {/* Card 1: Total Pending Payouts */}
        <div className="bg-white rounded-xl p-5 border border-slate-200 shadow-sm relative overflow-hidden">
          <div className="flex items-center justify-between">
            <span className="text-xs font-bold uppercase tracking-wider text-[#0B2038]">
              Total Pending Payouts
            </span>
            <div className="w-9 h-9 rounded-lg bg-amber-50 text-amber-700 flex items-center justify-center border border-amber-200">
              <Clock className="w-5 h-5" />
            </div>
          </div>
          <div className="mt-3 flex items-baseline gap-2">
            <span className="text-2xl font-black text-[#0B2038]">
              ₹{payoutMetrics.totalPendingPayouts.toLocaleString('en-IN')}
            </span>
            <span className="text-xs font-bold text-amber-800">Awaiting transfer</span>
          </div>
          <p className="text-xs font-medium text-slate-700 mt-2">
            Across pending & under-review requests
          </p>
          <div className="absolute bottom-0 left-0 right-0 h-1 bg-amber-400" />
        </div>

        {/* Card 2: Pending Requests Count */}
        <div className="bg-white rounded-xl p-5 border border-slate-200 shadow-sm relative overflow-hidden">
          <div className="flex items-center justify-between">
            <span className="text-xs font-bold uppercase tracking-wider text-[#0B2038]">
              Pending Requests
            </span>
            <div className="w-9 h-9 rounded-lg bg-blue-50 text-blue-700 flex items-center justify-center border border-blue-200">
              <FileCheck className="w-5 h-5" />
            </div>
          </div>
          <div className="mt-3 flex items-baseline gap-2">
            <span className="text-2xl font-black text-[#0B2038]">
              {payoutMetrics.pendingRequestsCount}
            </span>
            <span className="text-xs font-bold text-blue-800">Requests</span>
          </div>
          <p className="text-xs font-medium text-slate-700 mt-2">
            Requires admin approval
          </p>
          <div className="absolute bottom-0 left-0 right-0 h-1 bg-blue-500" />
        </div>

        {/* Card 3: Paid This Month */}
        <div className="bg-white rounded-xl p-5 border border-slate-200 shadow-sm relative overflow-hidden">
          <div className="flex items-center justify-between">
            <span className="text-xs font-bold uppercase tracking-wider text-[#0B2038]">
              Paid This Month
            </span>
            <div className="w-9 h-9 rounded-lg bg-emerald-50 text-emerald-700 flex items-center justify-center border border-emerald-200">
              <CheckCircle2 className="w-5 h-5" />
            </div>
          </div>
          <div className="mt-3 flex items-baseline gap-2">
            <span className="text-2xl font-black text-[#0B2038]">
              ₹{payoutMetrics.paidThisMonth.toLocaleString('en-IN')}
            </span>
            <span className="text-xs font-bold text-emerald-800">Disbursed</span>
          </div>
          <p className="text-xs font-medium text-slate-700 mt-2">
            Successfully credited to workers
          </p>
          <div className="absolute bottom-0 left-0 right-0 h-1 bg-emerald-500" />
        </div>

        {/* Card 4: Total Worker Earnings */}
        <div className="bg-white rounded-xl p-5 border border-slate-200 shadow-sm relative overflow-hidden">
          <div className="flex items-center justify-between">
            <span className="text-xs font-bold uppercase tracking-wider text-[#0B2038]">
              Total Worker Earnings
            </span>
            <div className="w-9 h-9 rounded-lg bg-teal-50 text-[#008A8E] flex items-center justify-center border border-teal-200">
              <IndianRupee className="w-5 h-5" />
            </div>
          </div>
          <div className="mt-3 flex items-baseline gap-2">
            <span className="text-2xl font-black text-[#0B2038]">
              ₹{payoutMetrics.totalWorkerEarnings.toLocaleString('en-IN')}
            </span>
            <span className="text-xs font-bold text-teal-800">Platform share: 75%</span>
          </div>
          <p className="text-xs font-medium text-slate-700 mt-2">
            Cumulative professional payouts
          </p>
          <div className="absolute bottom-0 left-0 right-0 h-1 bg-[#008A8E]" />
        </div>
      </div>

      {/* Main Content Card: Tabs, Search, Table */}
      <div className="bg-white rounded-xl border border-slate-200 shadow-sm overflow-hidden">
        {/* Filters bar */}
        <div className="p-4 sm:p-5 border-b border-slate-200 flex flex-col md:flex-row md:items-center justify-between gap-4">
          {/* Tabs */}
          <div className="flex items-center gap-1.5 overflow-x-auto pb-1 md:pb-0 scrollbar-none">
            {['All', 'Pending', 'Under Review', 'Approved', 'Paid', 'Rejected'].map((tab) => {
              const count =
                tab === 'All'
                  ? payoutRequests.length
                  : payoutRequests.filter((p) => p.status === tab).length;
              const isActive = activeTab === tab;
              return (
                <button
                  key={tab}
                  onClick={() => setActiveTab(tab)}
                  className={`px-3 py-1.5 rounded-lg text-xs font-bold whitespace-nowrap transition-all flex items-center gap-1.5 ${
                    isActive
                      ? 'bg-[#0B2038] text-white shadow-sm'
                      : 'text-slate-800 hover:bg-slate-100 hover:text-[#0B2038]'
                  }`}
                >
                  <span>{tab}</span>
                  <span
                    className={`px-1.5 py-0.2 rounded-full text-[10px] ${
                      isActive ? 'bg-white/20 text-white' : 'bg-slate-200 text-slate-800'
                    }`}
                  >
                    {count}
                  </span>
                </button>
              );
            })}
          </div>

          {/* Search Box */}
          <div className="relative min-w-[260px]">
            <Search className="w-4 h-4 text-slate-600 absolute left-3 top-1/2 -translate-y-1/2" />
            <input
              type="text"
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              placeholder="Search by worker, ID, UPI or bank..."
              className="w-full pl-9 pr-4 py-1.5 bg-slate-50 border border-slate-200 rounded-lg text-xs font-semibold text-[#0B2038] placeholder-slate-500 focus:outline-none focus:border-[#008A8E] focus:bg-white"
            />
          </div>
        </div>

        {/* Payouts Table */}
        <div className="overflow-x-auto">
          <table className="w-full text-left text-xs">
            <thead className="bg-slate-50 border-b border-slate-200 text-[#0B2038] font-bold uppercase tracking-wider">
              <tr>
                <th className="py-3 px-4">Request ID</th>
                <th className="py-3 px-4">Worker / Pro</th>
                <th className="py-3 px-4">Requested Date</th>
                <th className="py-3 px-4">Completed Jobs</th>
                <th className="py-3 px-4">Available Balance</th>
                <th className="py-3 px-4">Requested Amount</th>
                <th className="py-3 px-4">Payout Method</th>
                <th className="py-3 px-4">Status</th>
                <th className="py-3 px-4 text-right">Actions</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-100">
              {filteredPayouts.length === 0 ? (
                <tr>
                  <td colSpan={9} className="py-12 text-center text-slate-700 font-semibold">
                    No payout requests found matching the current filters.
                  </td>
                </tr>
              ) : (
                filteredPayouts.map((payout) => {
                  const workerEarnings = calculateWorkerEarnings(payout.workerId);
                  return (
                    <tr
                      key={payout.id}
                      className="hover:bg-cyan-50/30 transition-colors cursor-pointer group"
                      onClick={() => handleOpenModal(payout)}
                    >
                      {/* ID */}
                      <td className="py-3.5 px-4 font-mono font-bold text-[#008A8E]">
                        {payout.id}
                      </td>

                      {/* Worker info */}
                      <td className="py-3.5 px-4">
                        <div className="flex items-center gap-2.5">
                          <img
                            src={payout.workerAvatar}
                            alt={payout.workerName}
                            className="w-8 h-8 rounded-full object-cover border border-slate-200"
                          />
                          <div>
                            <p className="font-bold text-[#0B2038] group-hover:text-[#008A8E] transition-colors">
                              {payout.workerName}
                            </p>
                            <p className="text-[11px] font-medium text-slate-700">
                              {payout.workerPhone}
                            </p>
                          </div>
                        </div>
                      </td>

                      {/* Date */}
                      <td className="py-3.5 px-4 font-semibold text-slate-800">
                        {payout.requestedDate}
                      </td>

                      {/* Jobs */}
                      <td className="py-3.5 px-4 font-bold text-slate-800">
                        {payout.completedJobs} jobs
                      </td>

                      {/* Available Balance */}
                      <td className="py-3.5 px-4 font-bold text-slate-800">
                        ₹{workerEarnings.availableBalance.toLocaleString('en-IN')}
                      </td>

                      {/* Requested Amount */}
                      <td className="py-3.5 px-4">
                        <span className="font-black text-sm text-[#0B2038]">
                          ₹{payout.requestedAmount.toLocaleString('en-IN')}
                        </span>
                      </td>

                      {/* Payment Method */}
                      <td className="py-3.5 px-4">
                        <div className="flex items-center gap-1.5">
                          {payout.paymentMethod === 'UPI' ? (
                            <QrCode className="w-4 h-4 text-emerald-600 flex-shrink-0" />
                          ) : (
                            <Landmark className="w-4 h-4 text-blue-600 flex-shrink-0" />
                          )}
                          <span className="font-semibold text-slate-800">
                            {payout.paymentMethod}
                          </span>
                        </div>
                        <p className="text-[10px] font-mono text-slate-700 truncate max-w-[130px]">
                          {payout.paymentDetails.upiId || payout.paymentDetails.accountNumber}
                        </p>
                      </td>

                      {/* Status */}
                      <td className="py-3.5 px-4">{getStatusBadge(payout.status)}</td>

                      {/* Action buttons */}
                      <td
                        className="py-3.5 px-4 text-right"
                        onClick={(e) => e.stopPropagation()}
                      >
                        <div className="flex items-center justify-end gap-1.5">
                          <button
                            onClick={() => handleOpenModal(payout)}
                            className="px-2.5 py-1 text-xs font-bold text-[#008A8E] hover:bg-[#008A8E]/10 rounded border border-[#008A8E]/30"
                          >
                            Details
                          </button>

                          {payout.status === 'Pending' && (
                            <button
                              onClick={() => verifyPayout(payout.id, 'Verified bank and booking records')}
                              className="px-2.5 py-1 text-xs font-bold text-blue-700 bg-blue-50 hover:bg-blue-100 rounded border border-blue-200"
                            >
                              Verify
                            </button>
                          )}

                          {payout.status === 'Under Review' && (
                            <button
                              onClick={() => approvePayout(payout.id, 'Approved for bank transfer')}
                              className="px-2.5 py-1 text-xs font-bold text-emerald-700 bg-emerald-50 hover:bg-emerald-100 rounded border border-emerald-200"
                            >
                              Approve
                            </button>
                          )}

                          {payout.status === 'Approved' && (
                            <button
                              onClick={() => {
                                setSelectedPayout(payout);
                                setPayingId(payout.id);
                              }}
                              className="px-2.5 py-1 text-xs font-bold text-white bg-[#008A8E] hover:bg-[#007074] rounded shadow-sm"
                            >
                              Disburse
                            </button>
                          )}
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

      {/* Verification / Approval / Settlement Modal */}
      {selectedPayout && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-900/60 backdrop-blur-xs">
          <div className="bg-white rounded-2xl max-w-2xl w-full max-h-[90vh] overflow-y-auto shadow-2xl border border-slate-200">
            {/* Modal Header */}
            <div className="p-5 border-b border-slate-200 flex items-center justify-between bg-slate-50 rounded-t-2xl">
              <div>
                <div className="flex items-center gap-2">
                  <h3 className="text-lg font-black text-[#0B2038]">
                    Payout Verification #{selectedPayout.id}
                  </h3>
                  {getStatusBadge(selectedPayout.status)}
                </div>
                <p className="text-xs font-medium text-slate-700 mt-0.5">
                  Requested on {selectedPayout.requestedDate}
                </p>
              </div>
              <button
                onClick={() => setSelectedPayout(null)}
                className="w-8 h-8 rounded-full bg-white border border-slate-200 flex items-center justify-center text-slate-700 hover:text-black"
              >
                <X className="w-5 h-5" />
              </button>
            </div>

            <div className="p-6 space-y-6">
              {/* Worker Profile Card */}
              <div className="flex items-start gap-4 p-4 rounded-xl bg-slate-50 border border-slate-200">
                <img
                  src={selectedPayout.workerAvatar}
                  alt={selectedPayout.workerName}
                  className="w-14 h-14 rounded-full object-cover border-2 border-white shadow-sm"
                />
                <div className="flex-1">
                  <h4 className="text-base font-black text-[#0B2038]">
                    {selectedPayout.workerName}
                  </h4>
                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-1.5 mt-1 text-xs text-slate-800 font-medium">
                    <p>Phone: <span className="font-bold text-[#0B2038]">{selectedPayout.workerPhone}</span></p>
                    <p>Email: <span className="font-bold text-[#0B2038]">{selectedPayout.workerEmail}</span></p>
                    <p>Worker ID: <span className="font-mono font-bold text-[#008A8E]">{selectedPayout.workerId}</span></p>
                    <p>Completed Jobs: <span className="font-bold text-[#0B2038]">{selectedPayout.completedJobs} verified jobs</span></p>
                  </div>
                </div>
              </div>

              {/* Earnings & Available Balance Summary */}
              <div>
                <h5 className="text-xs font-bold uppercase tracking-wider text-[#0B2038] mb-2.5">
                  Earnings & Safety Verification
                </h5>
                <div className="grid grid-cols-2 sm:grid-cols-4 gap-3">
                  <div className="p-3 bg-white rounded-lg border border-slate-200">
                    <span className="text-[11px] font-semibold text-slate-700">Lifetime Earnings</span>
                    <p className="text-base font-black text-[#0B2038] mt-1">
                      ₹{selectedPayout.totalEarnings.toLocaleString('en-IN')}
                    </p>
                  </div>
                  <div className="p-3 bg-white rounded-lg border border-slate-200">
                    <span className="text-[11px] font-semibold text-slate-700">Already Paid</span>
                    <p className="text-base font-black text-slate-800 mt-1">
                      ₹{selectedPayout.alreadyPaid.toLocaleString('en-IN')}
                    </p>
                  </div>
                  <div className="p-3 bg-white rounded-lg border border-slate-200">
                    <span className="text-[11px] font-semibold text-slate-700">Available Balance</span>
                    <p className="text-base font-black text-[#008A8E] mt-1">
                      ₹{selectedPayout.availableBalance.toLocaleString('en-IN')}
                    </p>
                  </div>
                  <div className="p-3 bg-cyan-50/50 rounded-lg border border-[#008A8E]/30">
                    <span className="text-[11px] font-bold text-[#0B2038]">Requested Amount</span>
                    <p className="text-lg font-black text-[#008A8E] mt-0.5">
                      ₹{selectedPayout.requestedAmount.toLocaleString('en-IN')}
                    </p>
                  </div>
                </div>

                {/* Safety check validation indicator */}
                <div className="mt-3 p-2.5 rounded-lg flex items-center gap-2 text-xs font-bold bg-emerald-50 text-emerald-900 border border-emerald-200">
                  <CheckCircle2 className="w-4 h-4 text-emerald-700 flex-shrink-0" />
                  <span>
                    Balance Check Passed: Requested ₹{selectedPayout.requestedAmount.toLocaleString()} is within verified available balance of ₹{selectedPayout.availableBalance.toLocaleString()}.
                  </span>
                </div>
              </div>

              {/* Bank & Payment Information */}
              <div>
                <h5 className="text-xs font-bold uppercase tracking-wider text-[#0B2038] mb-2.5">
                  Worker Bank & Payout Details
                </h5>
                <div className="p-4 rounded-xl border border-slate-200 bg-slate-50 space-y-2.5 text-xs">
                  <div className="flex items-center justify-between">
                    <span className="text-slate-700 font-medium">Payment Mode:</span>
                    <span className="font-bold text-[#0B2038]">{selectedPayout.paymentMethod}</span>
                  </div>

                  {selectedPayout.paymentDetails.upiId && (
                    <div className="flex items-center justify-between">
                      <span className="text-slate-700 font-medium">Worker UPI VPA:</span>
                      <div className="flex items-center gap-2">
                        <span className="font-mono font-bold text-[#0B2038] bg-white px-2 py-0.5 rounded border border-slate-200">
                          {selectedPayout.paymentDetails.upiId}
                        </span>
                        <button
                          onClick={() => handleCopyUpi(selectedPayout.paymentDetails.upiId!)}
                          className="text-[#008A8E] hover:text-[#0B2038] p-1"
                          title="Copy UPI ID"
                        >
                          <Copy className="w-4 h-4" />
                        </button>
                        {copiedUpi && <span className="text-[10px] font-bold text-emerald-600">Copied!</span>}
                      </div>
                    </div>
                  )}

                  {selectedPayout.paymentDetails.accountNumber && (
                    <>
                      <div className="flex items-center justify-between">
                        <span className="text-slate-700 font-medium">Account Holder:</span>
                        <span className="font-bold text-[#0B2038]">{selectedPayout.paymentDetails.accountHolder}</span>
                      </div>
                      <div className="flex items-center justify-between">
                        <span className="text-slate-700 font-medium">Bank Name:</span>
                        <span className="font-bold text-[#0B2038]">{selectedPayout.paymentDetails.bankName}</span>
                      </div>
                      <div className="flex items-center justify-between">
                        <span className="text-slate-700 font-medium">Account Number:</span>
                        <span className="font-mono font-bold text-[#0B2038]">{selectedPayout.paymentDetails.accountNumber}</span>
                      </div>
                      <div className="flex items-center justify-between">
                        <span className="text-slate-700 font-medium">IFSC Code:</span>
                        <span className="font-mono font-bold text-[#0B2038]">{selectedPayout.paymentDetails.ifscCode}</span>
                      </div>
                    </>
                  )}

                  {selectedPayout.transactionRef && (
                    <div className="flex items-center justify-between pt-2 border-t border-slate-200">
                      <span className="text-slate-700 font-medium">Disbursed Transaction Ref:</span>
                      <span className="font-mono font-black text-emerald-800 bg-emerald-50 px-2 py-0.5 rounded border border-emerald-200">
                        {selectedPayout.transactionRef}
                      </span>
                    </div>
                  )}

                  {selectedPayout.rejectionReason && (
                    <div className="p-2.5 rounded bg-rose-50 border border-rose-200 text-rose-900 mt-2">
                      <p className="font-bold">Rejection Reason:</p>
                      <p className="font-medium text-xs mt-0.5">{selectedPayout.rejectionReason}</p>
                    </div>
                  )}
                </div>
              </div>

              {/* Completed Bookings Included In Payout */}
              <div>
                <h5 className="text-xs font-bold uppercase tracking-wider text-[#0B2038] mb-2.5">
                  Completed Bookings In This Settlement ({selectedPayout.breakdown.length})
                </h5>
                <div className="border border-slate-200 rounded-xl overflow-hidden">
                  <table className="w-full text-xs text-left">
                    <thead className="bg-slate-50 border-b border-slate-200 text-[#0B2038] font-bold">
                      <tr>
                        <th className="py-2.5 px-3">Booking ID</th>
                        <th className="py-2.5 px-3">Service</th>
                        <th className="py-2.5 px-3">Date</th>
                        <th className="py-2.5 px-3 text-right">Customer Paid</th>
                        <th className="py-2.5 px-3 text-right">Worker Earning (75%)</th>
                      </tr>
                    </thead>
                    <tbody className="divide-y divide-slate-100">
                      {selectedPayout.breakdown.map((item) => (
                        <tr key={item.bookingId} className="hover:bg-slate-50">
                          <td className="py-2 px-3 font-mono font-bold text-[#008A8E]">
                            {item.bookingId}
                          </td>
                          <td className="py-2 px-3 font-medium text-[#0B2038]">
                            {item.serviceName}
                          </td>
                          <td className="py-2 px-3 text-slate-700 font-medium">
                            {item.completedDate}
                          </td>
                          <td className="py-2 px-3 text-right font-medium text-slate-800">
                            ₹{item.customerAmount}
                          </td>
                          <td className="py-2 px-3 text-right font-bold text-[#0B2038]">
                            ₹{item.workerEarning}
                          </td>
                        </tr>
                      ))}
                    </tbody>
                  </table>
                </div>
              </div>

              {/* Rejection Form If Active */}
              {rejectingId === selectedPayout.id && (
                <div className="p-4 rounded-xl bg-rose-50 border border-rose-200 space-y-3">
                  <div className="flex items-center gap-2 text-rose-900 font-bold text-xs">
                    <AlertTriangle className="w-4 h-4 text-rose-600" />
                    <span>Provide Reason for Rejecting Request</span>
                  </div>
                  <textarea
                    rows={2}
                    value={rejectionReason}
                    onChange={(e) => setRejectionReason(e.target.value)}
                    placeholder="e.g. Bank IFSC code mismatch or duplicate request."
                    className="w-full p-2.5 bg-white border border-rose-300 rounded-lg text-xs font-semibold text-[#0B2038] focus:outline-none focus:ring-1 focus:ring-rose-500"
                  />
                  <div className="flex items-center justify-end gap-2">
                    <button
                      onClick={() => setRejectingId(null)}
                      className="px-3 py-1.5 rounded-lg text-xs font-bold text-slate-700 hover:bg-slate-100"
                    >
                      Cancel
                    </button>
                    <button
                      onClick={() => handleConfirmReject(selectedPayout.id)}
                      className="px-3 py-1.5 rounded-lg text-xs font-bold text-white bg-rose-600 hover:bg-rose-700 shadow-sm"
                    >
                      Confirm Rejection
                    </button>
                  </div>
                </div>
              )}

              {/* Mark as Paid / Disbursed Form */}
              {payingId === selectedPayout.id && (
                <div className="p-4 rounded-xl bg-teal-50 border border-[#008A8E]/30 space-y-3">
                  <div className="flex items-center gap-2 text-[#0B2038] font-bold text-xs">
                    <ShieldCheck className="w-4 h-4 text-[#008A8E]" />
                    <span>Record Bank Transfer / UPI Reference (UTR)</span>
                  </div>
                  <input
                    type="text"
                    value={transactionRef}
                    onChange={(e) => setTransactionRef(e.target.value)}
                    placeholder="e.g. UPI/UTR-987625141 or NEFT-AXIS-91823"
                    className="w-full p-2.5 bg-white border border-slate-300 rounded-lg text-xs font-mono font-bold text-[#0B2038] focus:outline-none focus:border-[#008A8E]"
                  />
                  <div className="flex items-center justify-end gap-2">
                    <button
                      onClick={() => setPayingId(null)}
                      className="px-3 py-1.5 rounded-lg text-xs font-bold text-slate-700 hover:bg-slate-100"
                    >
                      Cancel
                    </button>
                    <button
                      onClick={() => handleConfirmPaid(selectedPayout.id)}
                      className="px-3 py-1.5 rounded-lg text-xs font-bold text-white bg-[#008A8E] hover:bg-[#007074] shadow-sm"
                    >
                      Save & Mark Disbursed
                    </button>
                  </div>
                </div>
              )}
            </div>

            {/* Modal Footer Actions */}
            <div className="p-4 border-t border-slate-200 bg-slate-50 flex flex-wrap items-center justify-between gap-3 rounded-b-2xl">
              <button
                onClick={() => setSelectedPayout(null)}
                className="px-4 py-2 rounded-lg text-xs font-bold text-slate-800 hover:bg-slate-200"
              >
                Close
              </button>

              <div className="flex items-center gap-2">
                {selectedPayout.status !== 'Rejected' && selectedPayout.status !== 'Paid' && (
                  <button
                    onClick={() => setRejectingId(selectedPayout.id)}
                    className="px-3 py-2 rounded-lg text-xs font-bold text-rose-700 bg-rose-50 hover:bg-rose-100 border border-rose-200"
                  >
                    Reject Request
                  </button>
                )}

                {selectedPayout.status === 'Pending' && (
                  <button
                    onClick={() => {
                      verifyPayout(selectedPayout.id, 'Verified by Super Admin');
                      setSelectedPayout({ ...selectedPayout, status: 'Under Review' });
                    }}
                    className="px-4 py-2 rounded-lg text-xs font-bold text-white bg-blue-600 hover:bg-blue-700 shadow-sm"
                  >
                    Verify & Put Under Review
                  </button>
                )}

                {selectedPayout.status === 'Under Review' && (
                  <button
                    onClick={() => {
                      approvePayout(selectedPayout.id, 'Approved for bank transfer');
                      setSelectedPayout({ ...selectedPayout, status: 'Approved' });
                    }}
                    className="px-4 py-2 rounded-lg text-xs font-bold text-white bg-emerald-600 hover:bg-emerald-700 shadow-sm"
                  >
                    Approve Payout
                  </button>
                )}

                {selectedPayout.status === 'Approved' && (
                  <button
                    onClick={() => setPayingId(selectedPayout.id)}
                    className="px-4 py-2 rounded-lg text-xs font-bold text-white bg-[#008A8E] hover:bg-[#007074] shadow-sm"
                  >
                    Disburse & Mark Paid
                  </button>
                )}
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};
