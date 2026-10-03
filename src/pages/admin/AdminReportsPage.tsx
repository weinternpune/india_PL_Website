import React, { useState } from 'react';
import { useApp } from '../../context/AppContext';
import {
  Download,
} from 'lucide-react';

export const AdminReportsPage: React.FC = () => {
  const {
    metrics,
    bookings,
    weeklyTrend,
    categoryBreakdown,
  } = useApp();
  const [timeRange, setTimeRange] = useState<'7d' | '30d' | '90d'>('7d');

  // Counts from active bookings
  const completedCount = bookings.filter((b) => b.status === 'Completed').length;
  const pendingCount = bookings.filter((b) => b.status === 'Pending' || b.status === 'Finding Worker').length;
  const cancelledCount = bookings.filter((b) => b.status === 'Cancelled').length;

  const maxRevenue = Math.max(...weeklyTrend.map((d) => d.revenue), 1000);

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
          <h1 className="text-2xl font-black text-[#0B2038] tracking-tight">
            Operations & Performance Analytics
          </h1>
          <p className="text-xs sm:text-sm text-slate-800 font-medium mt-0.5">
            Operational metrics, GMV revenue trends, pro fulfillment and cancellation diagnostics.
          </p>
        </div>

        <div className="flex items-center gap-3">
          {/* Time range selector */}
          <div className="flex items-center p-1 bg-white border border-slate-200 rounded-xl shadow-xs text-xs font-bold text-slate-800">
            {(['7d', '30d', '90d'] as const).map((r) => (
              <button
                key={r}
                onClick={() => setTimeRange(r)}
                className={`px-3 py-1.5 rounded-lg transition-all cursor-pointer ${
                  timeRange === r
                    ? 'bg-[#0B2038] text-white shadow-xs'
                    : 'hover:text-[#0B2038]'
                }`}
              >
                {r === '7d' ? 'Last 7 Days' : r === '30d' ? 'Month' : 'Quarter'}
              </button>
            ))}
          </div>

          <button
            onClick={handleExportCSV}
            className="inline-flex items-center gap-1.5 px-4 py-2 rounded-xl bg-white border border-teal-300 text-[#008A8E] hover:bg-teal-50 text-xs font-bold shadow-xs transition-colors cursor-pointer"
          >
            <Download className="w-4 h-4" />
            <span>Export CSV</span>
          </button>
        </div>
      </div>

      {/* 8 Metric Reporting Cards */}
      <div className="grid grid-cols-2 sm:grid-cols-4 gap-3.5">
        <div className="bg-white rounded-xl p-4 border border-slate-200 shadow-sm space-y-1">
          <span className="text-xs font-bold text-[#0B2038] uppercase tracking-wider block">
            Total Bookings
          </span>
          <span className="text-2xl font-black text-[#0B2038]">{metrics.totalBookings}</span>
          <span className="text-[11px] text-emerald-800 font-bold block">+12% vs last cycle</span>
        </div>

        <div className="bg-white rounded-xl p-4 border border-slate-200 shadow-sm space-y-1">
          <span className="text-xs font-bold text-[#0B2038] uppercase tracking-wider block">
            Gross GMV
          </span>
          <span className="text-2xl font-black text-[#008A8E]">
            ₹{metrics.gmv.toLocaleString('en-IN')}
          </span>
          <span className="text-[11px] text-emerald-800 font-bold block">Target exceeded</span>
        </div>

        <div className="bg-white rounded-xl p-4 border border-slate-200 shadow-sm space-y-1">
          <span className="text-xs font-bold text-[#0B2038] uppercase tracking-wider block">
            Active Pros
          </span>
          <span className="text-2xl font-black text-[#0B2038]">{metrics.activeWorkers}</span>
          <span className="text-[11px] text-slate-800 font-semibold block">In Bhubaneswar fleet</span>
        </div>

        <div className="bg-white rounded-xl p-4 border border-slate-200 shadow-sm space-y-1">
          <span className="text-xs font-bold text-[#0B2038] uppercase tracking-wider block">
            Cancellation Rate
          </span>
          <span className="text-2xl font-black text-amber-600">
            {metrics.cancellationRate}%
          </span>
          <span className="text-[11px] text-emerald-800 font-bold block">-0.4% this month</span>
        </div>

        <div className="bg-white rounded-xl p-4 border border-slate-200 shadow-sm space-y-1">
          <span className="text-xs font-bold text-[#0B2038] uppercase tracking-wider block">
            Completed Bookings
          </span>
          <span className="text-2xl font-black text-emerald-800">{completedCount}</span>
          <span className="text-[11px] text-slate-700 font-semibold block">Fulfilled successfully</span>
        </div>

        <div className="bg-white rounded-xl p-4 border border-slate-200 shadow-sm space-y-1">
          <span className="text-xs font-bold text-[#0B2038] uppercase tracking-wider block">
            Pending / In Queue
          </span>
          <span className="text-2xl font-black text-blue-800">{pendingCount}</span>
          <span className="text-[11px] text-slate-700 font-semibold block">Awaiting GPS dispatch</span>
        </div>

        <div className="bg-white rounded-xl p-4 border border-slate-200 shadow-sm space-y-1">
          <span className="text-xs font-bold text-[#0B2038] uppercase tracking-wider block">
            Cancelled Bookings
          </span>
          <span className="text-2xl font-black text-rose-800">{cancelledCount}</span>
          <span className="text-[11px] text-slate-700 font-semibold block">Customer refund rate</span>
        </div>

        <div className="bg-white rounded-xl p-4 border border-slate-200 shadow-sm space-y-1">
          <span className="text-xs font-bold text-[#0B2038] uppercase tracking-wider block">
            Avg Job Duration
          </span>
          <span className="text-2xl font-black text-[#0B2038]">2.4 Hrs</span>
          <span className="text-[11px] text-slate-700 font-semibold block">Standard turnaround</span>
        </div>
      </div>

      {/* Revenue & Daily Fulfillment Charts */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-6">
        {/* Daily GMV Graph (8 cols) */}
        <div className="lg:col-span-8 bg-white rounded-2xl p-5 border border-slate-200 shadow-sm space-y-4">
          <div className="flex items-center justify-between">
            <div>
              <h3 className="text-base font-black text-[#0B2038]">
                Daily Revenue Fulfillment (GMV)
              </h3>
              <p className="text-xs font-medium text-slate-700">
                Revenue aggregated by daily completed doorstep service sessions
              </p>
            </div>
            <span className="text-xs font-bold text-[#008A8E] bg-teal-50 px-3 py-1 rounded-full border border-teal-200">
              Peak: Saturday (₹9,900)
            </span>
          </div>

          {/* SVG Area / Line representation */}
          <div className="pt-6 pb-2 w-full overflow-hidden">
            <div className="h-56 w-full grid grid-cols-7 gap-1.5 sm:gap-3 md:gap-4 items-end px-1 sm:px-2">
              {weeklyTrend.map((item, i) => {
                const heightPct = Math.round((item.revenue / (maxRevenue + 1000)) * 100);
                return (
                  <div key={i} className="relative flex flex-col items-center gap-2 group h-full justify-end min-w-0">
                    <div className="absolute -top-7 left-1/2 -translate-x-1/2 opacity-0 group-hover:opacity-100 transition-opacity text-[10px] font-bold text-white bg-[#0B2038] px-2 py-1 rounded shadow-md pointer-events-none whitespace-nowrap z-20">
                      ₹{item.revenue.toLocaleString('en-IN')}
                    </div>
                    <div className="w-full max-w-[36px] bg-slate-100 rounded-t-xl h-full flex items-end">
                      <div
                        style={{ height: `${heightPct}%` }}
                        className="w-full rounded-t-xl bg-gradient-to-t from-[#008A8E] to-[#00C2BE] group-hover:brightness-110 transition-all duration-500"
                      />
                    </div>
                    <span className="text-xs font-bold text-[#0B2038] truncate">{item.label}</span>
                  </div>
                );
              })}
            </div>
          </div>
        </div>

        {/* Category Contribution (4 cols) */}
        <div className="lg:col-span-4 bg-white rounded-2xl p-5 border border-slate-200 shadow-sm space-y-4">
          <h3 className="text-base font-black text-[#0B2038]">
            Revenue by Service Category
          </h3>

          <div className="space-y-4 pt-1">
            {categoryBreakdown.map((cat, i) => (
              <div key={i} className="space-y-1.5">
                <div className="flex justify-between text-xs">
                  <span className="font-bold text-[#0B2038]">{cat.name}</span>
                  <span className="font-black text-[#008A8E]">{cat.amount}</span>
                </div>
                <div className="w-full bg-slate-100 h-2 rounded-full overflow-hidden">
                  <div
                    style={{ width: `${cat.share}%` }}
                    className="h-full rounded-full bg-[#008A8E]"
                  />
                </div>
                <span className="text-[10px] text-slate-700 font-bold block text-right">
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
