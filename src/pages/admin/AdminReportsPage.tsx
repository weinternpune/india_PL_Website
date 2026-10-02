import React, { useState } from 'react';
import { useApp } from '../../context/AppContext';
import {
  BarChart3,
  TrendingUp,
  Download,
  Calendar,
  IndianRupee,
  Users2,
  Percent,
  CheckCircle2,
  Clock,
  XCircle,
  FileSpreadsheet,
  Printer,
  ChevronDown,
} from 'lucide-react';

export const AdminReportsPage: React.FC = () => {
  const { metrics, bookings, workers, customers } = useApp();
  const [timeRange, setTimeRange] = useState<'7d' | '30d' | '90d'>('7d');

  // Counts from active bookings
  const completedCount = bookings.filter((b) => b.status === 'Completed').length;
  const pendingCount = bookings.filter((b) => b.status === 'Pending' || b.status === 'Finding Worker').length;
  const cancelledCount = bookings.filter((b) => b.status === 'Cancelled').length;

  const weeklyTrend = [
    { label: 'Mon', bookings: 14, revenue: 4200, completed: 13, cancelled: 1 },
    { label: 'Tue', bookings: 19, revenue: 5800, completed: 18, cancelled: 1 },
    { label: 'Wed', bookings: 16, revenue: 4900, completed: 15, cancelled: 0 },
    { label: 'Thu', bookings: 22, revenue: 6800, completed: 21, cancelled: 1 },
    { label: 'Fri', bookings: 25, revenue: 8100, completed: 23, cancelled: 2 },
    { label: 'Sat', bookings: 31, revenue: 9900, completed: 30, cancelled: 1 },
    { label: 'Sun', bookings: 18, revenue: 5300, completed: 18, cancelled: 0 },
  ];

  const maxRevenue = Math.max(...weeklyTrend.map((d) => d.revenue));

  // Service breakdown
  const categoryBreakdown = [
    { name: 'Residential Cleaning', share: 44, amount: '₹19,800' },
    { name: 'Deep Cleaning', share: 26, amount: '₹11,700' },
    { name: 'Commercial & Office', share: 18, amount: '₹8,100' },
    { name: 'Appliances & Repair', share: 12, amount: '₹5,400' },
  ];

  const handleExportCSV = () => {
    const csvContent =
      'data:text/csv;charset=utf-8,' +
      'Booking ID,Customer,Service,Amount,Status,Date\n' +
      bookings
        .map(
          (b) =>
            `${b.bookingId},"${b.customerName}","${b.serviceName}",${b.totalAmount},${b.status},${b.date}`
        )
        .join('\n');

    const encodedUri = encodeURI(csvContent);
    const link = document.createElement('a');
    link.setAttribute('href', encodedUri);
    link.setAttribute('download', `INDIA_PL_Operations_Report_${new Date().toISOString().slice(0, 10)}.csv`);
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
  };

  return (
    <div className="space-y-6">
      {/* Page Header */}
      <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4">
        <div>
          <h1 className="text-2xl font-extrabold text-[#0B2038]">
            Operations & Performance Analytics
          </h1>
          <p className="text-xs sm:text-sm text-[#5B738B] mt-0.5">
            Operational metrics, GMV revenue trends, pro fulfillment and cancellation diagnostics
          </p>
        </div>

        <div className="flex items-center gap-3">
          {/* Time range selector */}
          <div className="flex items-center p-1 bg-white border border-[#DCEEEB] rounded-2xl shadow-2xs text-xs font-bold text-[#5B738B]">
            {(['7d', '30d', '90d'] as const).map((r) => (
              <button
                key={r}
                onClick={() => setTimeRange(r)}
                className={`px-3 py-1.5 rounded-xl transition-all ${
                  timeRange === r
                    ? 'bg-[#009E9B] text-white shadow-2xs'
                    : 'hover:text-[#0B2038]'
                }`}
              >
                {r === '7d' ? 'Last 7 Days' : r === '30d' ? 'Month' : 'Quarter'}
              </button>
            ))}
          </div>

          <button
            onClick={handleExportCSV}
            className="inline-flex items-center gap-1.5 px-4 py-2 rounded-full bg-white border border-teal-300 text-[#009E9B] hover:bg-teal-50 text-xs font-bold shadow-2xs transition-colors"
          >
            <Download className="w-4 h-4" />
            <span>Export CSV</span>
          </button>
        </div>
      </div>

      {/* 8 Metric Reporting Cards (Part 11) */}
      <div className="grid grid-cols-2 sm:grid-cols-4 gap-4">
        <div className="bg-white rounded-3xl p-5 border border-[#DCEEEB] shadow-2xs space-y-1">
          <span className="text-xs font-bold text-[#5B738B] uppercase tracking-wider block">
            Total Bookings
          </span>
          <span className="text-2xl font-extrabold text-[#0B2038]">{metrics.totalBookings}</span>
          <span className="text-[11px] text-emerald-600 font-semibold block">+12% vs last cycle</span>
        </div>

        <div className="bg-white rounded-3xl p-5 border border-[#DCEEEB] shadow-2xs space-y-1">
          <span className="text-xs font-bold text-[#5B738B] uppercase tracking-wider block">
            Gross GMV
          </span>
          <span className="text-2xl font-extrabold text-[#009E9B]">
            ₹{metrics.gmv.toLocaleString('en-IN')}
          </span>
          <span className="text-[11px] text-emerald-600 font-semibold block">Target exceeded</span>
        </div>

        <div className="bg-white rounded-3xl p-5 border border-[#DCEEEB] shadow-2xs space-y-1">
          <span className="text-xs font-bold text-[#5B738B] uppercase tracking-wider block">
            Active Pros
          </span>
          <span className="text-2xl font-extrabold text-[#0B2038]">{metrics.activeWorkers}</span>
          <span className="text-[11px] text-[#5B738B] font-semibold block">In Bhubaneswar fleet</span>
        </div>

        <div className="bg-white rounded-3xl p-5 border border-[#DCEEEB] shadow-2xs space-y-1">
          <span className="text-xs font-bold text-[#5B738B] uppercase tracking-wider block">
            Cancellation Rate
          </span>
          <span className="text-2xl font-extrabold text-amber-600">
            {metrics.cancellationRate}%
          </span>
          <span className="text-[11px] text-emerald-600 font-semibold block">-0.4% this month</span>
        </div>

        <div className="bg-white rounded-3xl p-5 border border-[#DCEEEB] shadow-2xs space-y-1">
          <span className="text-xs font-bold text-[#5B738B] uppercase tracking-wider block">
            Completed Bookings
          </span>
          <span className="text-2xl font-extrabold text-emerald-700">{completedCount}</span>
          <span className="text-[11px] text-slate-400 font-medium block">Fulfilled successfully</span>
        </div>

        <div className="bg-white rounded-3xl p-5 border border-[#DCEEEB] shadow-2xs space-y-1">
          <span className="text-xs font-bold text-[#5B738B] uppercase tracking-wider block">
            Pending / In Queue
          </span>
          <span className="text-2xl font-extrabold text-cyan-700">{pendingCount}</span>
          <span className="text-[11px] text-slate-400 font-medium block">Awaiting GPS dispatch</span>
        </div>

        <div className="bg-white rounded-3xl p-5 border border-[#DCEEEB] shadow-2xs space-y-1">
          <span className="text-xs font-bold text-[#5B738B] uppercase tracking-wider block">
            Cancelled Bookings
          </span>
          <span className="text-2xl font-extrabold text-rose-600">{cancelledCount}</span>
          <span className="text-[11px] text-slate-400 font-medium block">Customer refund rate</span>
        </div>

        <div className="bg-white rounded-3xl p-5 border border-[#DCEEEB] shadow-2xs space-y-1">
          <span className="text-xs font-bold text-[#5B738B] uppercase tracking-wider block">
            Avg Job Duration
          </span>
          <span className="text-2xl font-extrabold text-[#0B2038]">2.4 Hrs</span>
          <span className="text-[11px] text-slate-400 font-medium block">Standard turnaround</span>
        </div>
      </div>

      {/* Revenue & Daily Fulfillment Charts */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-6">
        {/* Daily GMV Graph (8 cols) */}
        <div className="lg:col-span-8 bg-white rounded-3xl p-6 border border-[#DCEEEB] shadow-2xs space-y-4">
          <div className="flex items-center justify-between">
            <div>
              <h3 className="text-base font-bold text-[#0B2038]">
                Daily Revenue Fulfillment (GMV)
              </h3>
              <p className="text-xs text-[#5B738B]">
                Revenue aggregated by daily completed doorstep service sessions
              </p>
            </div>
            <span className="text-xs font-bold text-[#009E9B] bg-teal-50 px-3 py-1 rounded-full border border-teal-200">
              Peak: Saturday (₹9,900)
            </span>
          </div>

          {/* SVG Area / Line representation */}
          <div className="pt-6 pb-2">
            <div className="h-60 flex items-end justify-between gap-4 px-2">
              {weeklyTrend.map((item, i) => {
                const heightPct = Math.round((item.revenue / (maxRevenue + 1000)) * 100);
                return (
                  <div key={i} className="flex-1 flex flex-col items-center gap-2 group h-full justify-end">
                    <div className="opacity-0 group-hover:opacity-100 transition-opacity text-[10px] font-bold text-white bg-[#0B2038] px-2 py-1 rounded shadow-md pointer-events-none mb-1">
                      ₹{item.revenue.toLocaleString('en-IN')}
                    </div>
                    <div className="w-full max-w-[36px] bg-teal-50 rounded-t-xl h-full flex items-end">
                      <div
                        style={{ height: `${heightPct}%` }}
                        className="w-full rounded-t-xl bg-gradient-to-t from-[#009E9B] to-[#00C2BE] group-hover:brightness-110 transition-all duration-500"
                      />
                    </div>
                    <span className="text-xs font-bold text-[#5B738B]">{item.label}</span>
                  </div>
                );
              })}
            </div>
          </div>
        </div>

        {/* Category Contribution (4 cols) */}
        <div className="lg:col-span-4 bg-white rounded-3xl p-6 border border-[#DCEEEB] shadow-2xs space-y-4">
          <h3 className="text-base font-bold text-[#0B2038]">
            Revenue by Service Category
          </h3>

          <div className="space-y-4 pt-2">
            {categoryBreakdown.map((cat, i) => (
              <div key={i} className="space-y-1.5">
                <div className="flex justify-between text-xs">
                  <span className="font-semibold text-[#0B2038]">{cat.name}</span>
                  <span className="font-bold text-[#009E9B]">{cat.amount}</span>
                </div>
                <div className="w-full bg-slate-100 h-2 rounded-full overflow-hidden">
                  <div
                    style={{ width: `${cat.share}%` }}
                    className="h-full rounded-full bg-[#009E9B]"
                  />
                </div>
                <span className="text-[10px] text-slate-400 block text-right">
                  {cat.share}% of total volume
                </span>
              </div>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
};
