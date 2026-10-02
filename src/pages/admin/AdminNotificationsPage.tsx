import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { useApp } from '../../context/AppContext';
import {
  Bell,
  CheckCircle2,
  Trash2,
  CalendarCheck2,
  Users2,
  CreditCard,
  Settings,
  ArrowRight,
  Filter,
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
        return <CalendarCheck2 className="w-4 h-4 text-[#009E9B]" />;
      case 'worker':
        return <Users2 className="w-4 h-4 text-emerald-600" />;
      case 'payment':
        return <CreditCard className="w-4 h-4 text-blue-600" />;
      default:
        return <Bell className="w-4 h-4 text-slate-500" />;
    }
  };

  return (
    <div className="space-y-6 max-w-4xl mx-auto">
      {/* Header */}
      <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4">
        <div>
          <h1 className="text-2xl font-extrabold text-[#0B2038]">System & Dispatch Alerts</h1>
          <p className="text-xs sm:text-sm text-[#5B738B] mt-0.5">
            Operational real-time notifications for bookings, pro activities, and transaction logs
          </p>
        </div>

        {notifications.length > 0 && (
          <button
            onClick={clearAllNotifications}
            className="inline-flex items-center gap-1.5 px-4 py-2 rounded-full border border-slate-200 text-slate-600 hover:text-rose-600 hover:bg-rose-50 text-xs font-bold transition-colors"
          >
            <Trash2 className="w-3.5 h-3.5" />
            <span>Clear All Notifications</span>
          </button>
        )}
      </div>

      {/* Filter Tabs */}
      <div className="bg-white rounded-3xl p-4 border border-[#DCEEEB] shadow-2xs flex items-center justify-between flex-wrap gap-2">
        <div className="flex items-center gap-1.5">
          {(['all', 'booking', 'worker', 'payment'] as const).map((t) => (
            <button
              key={t}
              onClick={() => setFilterType(t)}
              className={`px-4 py-1.5 rounded-full text-xs font-bold capitalize transition-all ${
                filterType === t
                  ? 'bg-[#009E9B] text-white shadow-2xs'
                  : 'bg-slate-50 text-[#5B738B] hover:bg-teal-50 hover:text-[#009E9B]'
              }`}
            >
              {t === 'all' ? 'All Alerts' : `${t}s`}
            </button>
          ))}
        </div>

        <span className="text-xs text-[#5B738B] font-semibold">
          {filteredNotifs.length} Notifications
        </span>
      </div>

      {/* Notification Cards List */}
      <div className="space-y-3">
        {filteredNotifs.length === 0 ? (
          <div className="bg-white rounded-3xl p-12 border border-[#DCEEEB] text-center text-xs text-slate-400">
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
              className={`bg-white rounded-2xl p-4 border transition-all cursor-pointer flex items-start justify-between gap-4 ${
                !notif.read
                  ? 'border-teal-300 bg-teal-50/20 shadow-xs'
                  : 'border-[#DCEEEB] hover:border-slate-300 shadow-2xs'
              }`}
            >
              <div className="flex items-start gap-3.5">
                <div className="w-9 h-9 rounded-xl bg-teal-50 border border-teal-200 flex items-center justify-center shrink-0 mt-0.5">
                  {getIcon(notif.type)}
                </div>
                <div>
                  <div className="flex items-center gap-2">
                    <h4 className="text-xs font-bold text-[#0B2038]">{notif.title}</h4>
                    {!notif.read && (
                      <span className="w-2 h-2 rounded-full bg-[#009E9B] shrink-0" />
                    )}
                  </div>
                  <p className="text-xs text-[#5B738B] mt-1 leading-relaxed">{notif.message}</p>
                </div>
              </div>

              <div className="text-right shrink-0 space-y-2">
                <span className="text-[10px] text-slate-400 font-mono block">
                  {notif.timestamp}
                </span>
                {notif.link && (
                  <span className="inline-flex items-center gap-1 text-[11px] font-bold text-[#009E9B] hover:underline">
                    <span>View</span>
                    <ArrowRight className="w-3 h-3" />
                  </span>
                )}
              </div>
            </div>
          ))
        )}
      </div>
    </div>
  );
};
