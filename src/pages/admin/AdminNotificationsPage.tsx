import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { useApp } from '../../context/AppContext';
import {
  Bell,
  Trash2,
  CalendarCheck2,
  Users2,
  CreditCard,
  ArrowRight,
} from 'lucide-react';

export const AdminNotificationsPage: React.FC = () => {
  const { notifications, markNotificationAsRead, clearAllNotifications } = useApp();
  const navigate = useNavigate();
  const [filterType, setFilterType] = useState<'all' | 'booking' | 'worker' | 'payment'>('all');

  const filteredNotifs = notifications.filter((n) => {
    if (filterType === 'all') return true;
    return n.type === filterType;
  });

  const getIcon = (type: string) => {
    switch (type) {
      case 'booking':
        return <CalendarCheck2 className="w-4 h-4 text-[#008A8E]" />;
      case 'worker':
        return <Users2 className="w-4 h-4 text-emerald-700" />;
      case 'payment':
        return <CreditCard className="w-4 h-4 text-blue-700" />;
      default:
        return <Bell className="w-4 h-4 text-slate-700" />;
    }
  };

  return (
    <div className="space-y-6 max-w-4xl mx-auto">
      {/* Header */}
      <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4">
        <div>
          <h1 className="text-2xl font-black text-[#0B2038] tracking-tight">System & Dispatch Alerts</h1>
          <p className="text-xs sm:text-sm text-slate-800 font-medium mt-0.5">
            Operational real-time notifications for bookings, pro activities, and transaction logs.
          </p>
        </div>

        {notifications.length > 0 && (
          <button
            onClick={clearAllNotifications}
            className="inline-flex items-center gap-1.5 px-4 py-2 rounded-xl border border-slate-200 text-slate-700 hover:text-rose-700 hover:bg-rose-50 text-xs font-bold transition-colors cursor-pointer"
          >
            <Trash2 className="w-3.5 h-3.5" />
            <span>Clear All Notifications</span>
          </button>
        )}
      </div>

      {/* Filter Tabs */}
      <div className="bg-white rounded-2xl p-4 border border-slate-200 shadow-sm flex items-center justify-between flex-wrap gap-2">
        <div className="flex items-center gap-1.5">
          {(['all', 'booking', 'worker', 'payment'] as const).map((t) => (
            <button
              key={t}
              onClick={() => setFilterType(t)}
              className={`px-4 py-1.5 rounded-lg text-xs font-bold capitalize transition-all cursor-pointer ${
                filterType === t
                  ? 'bg-[#0B2038] text-white shadow-sm'
                  : 'bg-slate-100 text-slate-800 hover:bg-slate-200 hover:text-[#0B2038]'
              }`}
            >
              {t === 'all' ? 'All Alerts' : `${t}s`}
            </button>
          ))}
        </div>

        <span className="text-xs text-slate-800 font-bold">
          {filteredNotifs.length} Notifications
        </span>
      </div>

      {/* Notification Cards List */}
      <div className="space-y-3">
        {filteredNotifs.length === 0 ? (
          <div className="bg-white rounded-2xl p-12 border border-slate-200 text-center text-xs font-bold text-slate-700">
            No notifications in this category.
          </div>
        ) : (
          filteredNotifs.map((notif) => (
            <div
              key={notif.id}
              onClick={() => {
                markNotificationAsRead(notif.id);
                if (notif.link) navigate(notif.link);
              }}
              className={`bg-white rounded-xl p-4 border transition-all cursor-pointer flex items-start justify-between gap-4 ${
                !notif.read
                  ? 'border-teal-300 bg-teal-50/30 shadow-xs'
                  : 'border-slate-200 hover:border-slate-300'
              }`}
            >
              <div className="flex items-start gap-3.5">
                <div className="w-8 h-8 rounded-lg bg-teal-50 border border-teal-200 flex items-center justify-center shrink-0 mt-0.5">
                  {getIcon(notif.type)}
                </div>
                <div>
                  <div className="flex items-center gap-2">
                    <h4 className="text-xs font-bold text-[#0B2038]">{notif.title}</h4>
                    {!notif.read && (
                      <span className="w-2 h-2 rounded-full bg-[#008A8E]" />
                    )}
                  </div>
                  <p className="text-xs text-slate-800 font-medium mt-0.5">{notif.message}</p>
                  <span className="text-[10px] font-semibold text-slate-700 mt-1 block">
                    {notif.timestamp}
                  </span>
                </div>
              </div>

              {notif.link && (
                <div className="text-slate-500 hover:text-[#008A8E] shrink-0 p-1">
                  <ArrowRight className="w-4 h-4" />
                </div>
              )}
            </div>
          ))
        )}
      </div>
    </div>
  );
};
