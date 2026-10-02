import React, { useState, useRef, useEffect } from 'react';
import { Link, NavLink, useNavigate } from 'react-router-dom';
import { IndiaPLLogo } from '../common/IndiaPLLogo';
import { useApp } from '../../context/AppContext';
import {
  LayoutDashboard,
  CalendarCheck2,
  Users2,
  UserCheck,
  Layers,
  BarChart3,
  Bell,
  LogOut,
  Menu,
  X,
  Compass,
  CheckCircle2,
  Trash2,
  ShieldAlert,
  ChevronDown,
} from 'lucide-react';

export const AdminNavbar: React.FC = () => {
  const { adminUser, logout, notifications, unreadNotificationCount, markNotificationAsRead, clearAllNotifications } = useApp();
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);
  const [notifDropdownOpen, setNotifDropdownOpen] = useState(false);
  const [profileDropdownOpen, setProfileDropdownOpen] = useState(false);
  const navigate = useNavigate();

  const notifRef = useRef<HTMLDivElement>(null);
  const profileRef = useRef<HTMLDivElement>(null);

  // Close dropdowns on outside click
  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      if (notifRef.current && !notifRef.current.contains(event.target as Node)) {
        setNotifDropdownOpen(false);
      }
      if (profileRef.current && !profileRef.current.contains(event.target as Node)) {
        setProfileDropdownOpen(false);
      }
    };
    document.addEventListener('mousedown', handleClickOutside);
    return () => document.removeEventListener('mousedown', handleClickOutside);
  }, []);

  const navItems = [
    { name: 'Dashboard', path: '/admin/dashboard', icon: LayoutDashboard },
    { name: 'Bookings', path: '/admin/bookings', icon: CalendarCheck2 },
    { name: 'Workers / Pros', path: '/admin/workers', icon: Users2 },
    { name: 'Customers', path: '/admin/customers', icon: UserCheck },
    { name: 'Services', path: '/admin/services', icon: Layers },
    { name: 'Reports', path: '/admin/reports', icon: BarChart3 },
  ];

  const handleLogout = () => {
    logout();
    navigate('/login');
  };

  return (
    <header className="sticky top-0 z-40 bg-white/95 backdrop-blur-md border-b border-[#DCEEEB]">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex items-center justify-between h-18">
          {/* Left: Brand Logo */}
          <div className="flex items-center space-x-6">
            <Link to="/admin/dashboard" className="flex items-center">
              <IndiaPLLogo variant="admin" size="md" />
            </Link>
          </div>

          {/* Center: Admin Nav Items */}
          <nav className="hidden lg:flex items-center space-x-1">
            {navItems.map((item) => {
              const Icon = item.icon;
              return (
                <NavLink
                  key={item.name}
                  to={item.path}
                  className={({ isActive }) =>
                    `inline-flex items-center gap-2 px-3.5 py-2 rounded-xl text-sm font-semibold transition-all ${
                      isActive
                        ? 'bg-teal-50 text-[#009E9B] shadow-2xs'
                        : 'text-[#5B738B] hover:text-[#0B2038] hover:bg-slate-50'
                    }`
                  }
                >
                  <Icon className="w-4 h-4" />
                  <span>{item.name}</span>
                </NavLink>
              );
            })}
          </nav>

          {/* Right Side: Notifications, Profile, Logout */}
          <div className="flex items-center space-x-3">
            {/* Quick Dispatch Badge indicator */}
            <div className="hidden sm:inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-emerald-50 text-emerald-700 text-xs font-semibold border border-emerald-200">
              <span className="w-2 h-2 rounded-full bg-emerald-500 animate-pulse" />
              <span>GPS Dispatch Live</span>
            </div>

            {/* Notification Bell */}
            <div className="relative" ref={notifRef}>
              <button
                onClick={() => setNotifDropdownOpen(!notifDropdownOpen)}
                className="relative p-2.5 text-[#5B738B] hover:text-[#009E9B] hover:bg-teal-50/70 rounded-full transition-colors"
                title="Notifications"
                aria-label="View notifications"
              >
                <Bell className="w-5 h-5" />
                {unreadNotificationCount > 0 && (
                  <span className="absolute top-1.5 right-1.5 flex h-4 min-w-4 items-center justify-center rounded-full bg-rose-500 px-1 text-[10px] font-bold text-white shadow-2xs">
                    {unreadNotificationCount}
                  </span>
                )}
              </button>

              {/* Notification Popover Dropdown */}
              {notifDropdownOpen && (
                <div className="absolute right-0 mt-2 w-84 sm:w-96 rounded-2xl bg-white shadow-xl border border-[#DCEEEB] py-3 z-50 animate-in fade-in slide-in-from-top-2 duration-150">
                  <div className="flex items-center justify-between px-4 pb-2.5 border-b border-slate-100">
                    <div className="flex items-center gap-2">
                      <h4 className="text-sm font-bold text-[#0B2038]">Notifications</h4>
                      {unreadNotificationCount > 0 && (
                        <span className="px-2 py-0.5 text-xs font-semibold rounded-full bg-teal-50 text-[#009E9B] border border-teal-200">
                          {unreadNotificationCount} new
                        </span>
                      )}
                    </div>
                    {notifications.length > 0 && (
                      <button
                        onClick={clearAllNotifications}
                        className="text-xs text-slate-500 hover:text-rose-600 flex items-center gap-1"
                      >
                        <Trash2 className="w-3.5 h-3.5" />
                        <span>Clear</span>
                      </button>
                    )}
                  </div>

                  <div className="max-h-80 overflow-y-auto divide-y divide-slate-50 px-2 py-1">
                    {notifications.length === 0 ? (
                      <div className="py-8 text-center text-sm text-slate-400">
                        No notifications right now
                      </div>
                    ) : (
                      notifications.slice(0, 6).map((notif) => (
                        <div
                          key={notif.id}
                          onClick={() => {
                            markNotificationAsRead(notif.id);
                            if (notif.link) {
                              navigate(notif.link);
                              setNotifDropdownOpen(false);
                            }
                          }}
                          className={`p-3 rounded-xl cursor-pointer transition-colors ${
                            !notif.read ? 'bg-teal-50/40 hover:bg-teal-50/80' : 'hover:bg-slate-50'
                          }`}
                        >
                          <div className="flex items-start justify-between gap-2">
                            <span className="text-xs font-bold text-[#0B2038]">{notif.title}</span>
                            <span className="text-[10px] text-slate-400 shrink-0">{notif.timestamp}</span>
                          </div>
                          <p className="text-xs text-[#5B738B] mt-1 leading-relaxed">
                            {notif.message}
                          </p>
                        </div>
                      ))
                    )}
                  </div>

                  <div className="pt-2 px-3 border-t border-slate-100 text-center">
                    <Link
                      to="/admin/notifications"
                      onClick={() => setNotifDropdownOpen(false)}
                      className="text-xs font-semibold text-[#009E9B] hover:text-[#00827F] block py-1"
                    >
                      View All Notifications →
                    </Link>
                  </div>
                </div>
              )}
            </div>

            {/* Admin Profile Dropdown */}
            <div className="relative" ref={profileRef}>
              <button
                onClick={() => setProfileDropdownOpen(!profileDropdownOpen)}
                className="flex items-center gap-2.5 p-1.5 pl-2.5 pr-2 rounded-full hover:bg-slate-50 border border-slate-200 transition-colors"
              >
                <img
                  src={adminUser?.avatar || 'https://images.unsplash.com/photo-1573496359142-b8d87734a5a2?auto=format&fit=crop&w=256&q=80'}
                  alt={adminUser?.name || 'Admin'}
                  className="w-8 h-8 rounded-full object-cover border border-teal-200"
                />
                <div className="hidden md:flex flex-col text-left">
                  <span className="text-xs font-bold text-[#0B2038] leading-tight">
                    {adminUser?.name || 'Admin'}
                  </span>
                  <span className="text-[10px] font-medium text-[#009E9B]">
                    {adminUser?.role || 'Super Admin'}
                  </span>
                </div>
                <ChevronDown className="w-3.5 h-3.5 text-slate-500 hidden md:block" />
              </button>

              {profileDropdownOpen && (
                <div className="absolute right-0 mt-2 w-56 rounded-2xl bg-white shadow-xl border border-[#DCEEEB] py-2 z-50">
                  <div className="px-4 py-2.5 border-b border-slate-100">
                    <p className="text-xs font-bold text-[#0B2038]">{adminUser?.name}</p>
                    <p className="text-[11px] text-slate-500 truncate">{adminUser?.email}</p>
                    <div className="mt-1.5">
                      <span className="text-[10px] font-semibold text-[#009E9B] bg-teal-50 px-2 py-0.5 rounded-full border border-teal-200">
                        {adminUser?.role}
                      </span>
                    </div>
                  </div>

                  <div className="py-1 text-sm text-[#0B2038]">
                    <Link
                      to="/admin/dashboard"
                      onClick={() => setProfileDropdownOpen(false)}
                      className="block px-4 py-2 text-xs hover:bg-teal-50 hover:text-[#009E9B]"
                    >
                      Dashboard Overview
                    </Link>
                    <Link
                      to="/admin/reports"
                      onClick={() => setProfileDropdownOpen(false)}
                      className="block px-4 py-2 text-xs hover:bg-teal-50 hover:text-[#009E9B]"
                    >
                      Operations Reports
                    </Link>
                  </div>

                  <div className="pt-1 border-t border-slate-100">
                    <button
                      onClick={handleLogout}
                      className="w-full flex items-center gap-2 px-4 py-2 text-xs font-semibold text-rose-600 hover:bg-rose-50 transition-colors text-left"
                    >
                      <LogOut className="w-3.5 h-3.5" />
                      <span>Log Out</span>
                    </button>
                  </div>
                </div>
              )}
            </div>

            {/* Mobile Hamburger Button */}
            <div className="flex lg:hidden">
              <button
                onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
                className="p-2 text-slate-700 hover:text-[#009E9B] hover:bg-teal-50 rounded-lg"
              >
                {mobileMenuOpen ? <X className="w-6 h-6" /> : <Menu className="w-6 h-6" />}
              </button>
            </div>
          </div>
        </div>
      </div>

      {/* Mobile Admin Navigation drawer */}
      {mobileMenuOpen && (
        <div className="lg:hidden bg-white border-b border-[#DCEEEB] px-4 pt-2 pb-6 space-y-2">
          {navItems.map((item) => {
            const Icon = item.icon;
            return (
              <NavLink
                key={item.name}
                to={item.path}
                onClick={() => setMobileMenuOpen(false)}
                className={({ isActive }) =>
                  `flex items-center gap-3 px-3 py-2.5 rounded-xl text-sm font-semibold transition-all ${
                    isActive
                      ? 'bg-teal-50 text-[#009E9B]'
                      : 'text-[#5B738B] hover:bg-slate-50 hover:text-[#0B2038]'
                  }`
                }
              >
                <Icon className="w-4 h-4" />
                <span>{item.name}</span>
              </NavLink>
            );
          })}

          <div className="pt-3 border-t border-slate-100 flex items-center justify-between">
            <div className="flex items-center gap-2">
              <img
                src={adminUser?.avatar}
                alt={adminUser?.name}
                className="w-8 h-8 rounded-full object-cover"
              />
              <span className="text-xs font-bold text-[#0B2038]">{adminUser?.name}</span>
            </div>
            <button
              onClick={handleLogout}
              className="text-xs font-semibold text-rose-600 flex items-center gap-1 p-1.5 rounded-lg hover:bg-rose-50"
            >
              <LogOut className="w-4 h-4" />
              <span>Logout</span>
            </button>
          </div>
        </div>
      )}
    </header>
  );
};
