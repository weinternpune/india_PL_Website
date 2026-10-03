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
  Wallet,
  Bell,
  LogOut,
  Menu,
  X,
  Trash2,
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

  // Strict 6 nav items as requested by user
  const navItems = [
    { name: 'Dashboard', path: '/admin/dashboard', icon: LayoutDashboard },
    { name: 'Bookings', path: '/admin/bookings', icon: CalendarCheck2 },
    { name: 'Workers', path: '/admin/workers', icon: Users2 },
    { name: 'Customers', path: '/admin/customers', icon: UserCheck },
    { name: 'Services', path: '/admin/services', icon: Layers },
    { name: 'Payouts', path: '/admin/payouts', icon: Wallet },
  ];

  const handleLogout = () => {
    logout();
    navigate('/login');
  };

  return (
    <header className="sticky top-0 z-40 bg-white/95 backdrop-blur-md border-b border-[#DCEEEB] shadow-2xs">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex items-center justify-between h-16 sm:h-17">
          {/* Left: Official Brand Logo strictly inside container */}
          <div className="flex items-center shrink-0 mr-4">
            <Link to="/admin/dashboard" className="flex items-center transition-opacity hover:opacity-95">
              <IndiaPLLogo size="sm" />
            </Link>
          </div>

          {/* Center: Admin Nav Items */}
          <nav className="hidden lg:flex items-center space-x-1 xl:space-x-1.5">
            {navItems.map((item) => {
              const Icon = item.icon;
              return (
                <NavLink
                  key={item.name}
                  to={item.path}
                  className={({ isActive }) =>
                    `inline-flex items-center gap-1.5 px-3 py-1.5 xl:px-3.5 xl:py-2 rounded-xl text-xs xl:text-sm font-bold transition-all ${
                      isActive
                        ? 'bg-teal-50 text-[#008A8E] shadow-2xs border border-teal-200/80'
                        : 'text-[#0B2038] hover:text-[#008A8E] hover:bg-teal-50/50'
                    }`
                  }
                >
                  <Icon className="w-4 h-4 shrink-0" />
                  <span className="whitespace-nowrap">{item.name}</span>
                </NavLink>
              );
            })}
          </nav>

          {/* Right Side: Notifications & Super Admin Profile */}
          <div className="flex items-center space-x-2 sm:space-x-3 shrink-0">
            {/* Notification Bell */}
            <div className="relative" ref={notifRef}>
              <button
                onClick={() => setNotifDropdownOpen(!notifDropdownOpen)}
                className="relative p-2 text-[#0B2038] hover:text-[#008A8E] hover:bg-teal-50/70 rounded-full transition-colors"
                title="Notifications"
                aria-label="View notifications"
              >
                <Bell className="w-5 h-5" />
                {unreadNotificationCount > 0 && (
                  <span className="absolute top-1 right-1 flex h-4 min-w-4 items-center justify-center rounded-full bg-rose-500 px-1 text-[10px] font-bold text-white shadow-2xs">
                    {unreadNotificationCount}
                  </span>
                )}
              </button>

              {/* Notification Popover Dropdown */}
              {notifDropdownOpen && (
                <div className="absolute right-0 mt-2 w-80 sm:w-96 rounded-2xl bg-white shadow-xl border border-[#DCEEEB] py-3 z-50 animate-in fade-in slide-in-from-top-2 duration-150">
                  <div className="flex items-center justify-between px-4 pb-2.5 border-b border-slate-100">
                    <div className="flex items-center gap-2">
                      <h4 className="text-sm font-bold text-[#0B2038]">Notifications</h4>
                      {unreadNotificationCount > 0 && (
                        <span className="px-2 py-0.5 text-xs font-semibold rounded-full bg-teal-50 text-[#008A8E] border border-teal-200">
                          {unreadNotificationCount} new
                        </span>
                      )}
                    </div>
                    {notifications.length > 0 && (
                      <button
                        onClick={clearAllNotifications}
                        className="text-xs text-slate-500 hover:text-rose-600 flex items-center gap-1 font-semibold"
                      >
                        <Trash2 className="w-3.5 h-3.5" />
                        <span>Clear</span>
                      </button>
                    )}
                  </div>

                  <div className="max-h-80 overflow-y-auto divide-y divide-slate-50 px-2 py-1">
                    {notifications.length === 0 ? (
                      <div className="py-8 text-center text-xs font-bold text-[#0B2038]">
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
                            !notif.read ? 'bg-teal-50/50 hover:bg-teal-50/90' : 'hover:bg-slate-50'
                          }`}
                        >
                          <div className="flex items-start justify-between gap-2">
                            <span className="text-xs font-bold text-[#0B2038]">{notif.title}</span>
                            <span className="text-[10px] text-slate-400 shrink-0">{notif.timestamp}</span>
                          </div>
                          <p className="text-xs text-[#0B2038] font-medium mt-1 leading-relaxed">
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
                      className="text-xs font-bold text-[#008A8E] hover:underline block py-1"
                    >
                      View All Notifications →
                    </Link>
                  </div>
                </div>
              )}
            </div>

            {/* Compact Super Admin Profile Button */}
            <div className="relative" ref={profileRef}>
              <button
                onClick={() => setProfileDropdownOpen(!profileDropdownOpen)}
                className="flex items-center gap-2 p-1.5 pl-2 pr-2.5 rounded-full hover:bg-teal-50/70 border border-[#DCEEEB] transition-all shadow-2xs"
              >
                <img
                  src={adminUser?.avatar || 'https://images.unsplash.com/photo-1573496359142-b8d87734a5a2?auto=format&fit=crop&w=256&q=80'}
                  alt={adminUser?.name || 'Admin'}
                  className="w-7 h-7 rounded-full object-cover border border-[#008A8E] shrink-0"
                />
                <div className="hidden sm:flex flex-col text-left leading-none">
                  <span className="text-xs font-extrabold text-[#0B2038]">
                    {adminUser?.name || 'Priyanka Sahu'}
                  </span>
                  <span className="text-[10px] text-[#008A8E] font-bold mt-0.5">
                    {adminUser?.role || 'Super Admin'}
                  </span>
                </div>
                <ChevronDown className="w-3.5 h-3.5 text-[#0B2038] ml-0.5" />
              </button>

              {/* Profile Dropdown Menu */}
              {profileDropdownOpen && (
                <div className="absolute right-0 mt-2 w-56 rounded-2xl bg-white shadow-xl border border-[#DCEEEB] py-2 z-50 animate-in fade-in slide-in-from-top-2 duration-150">
                  <div className="px-4 py-2.5 border-b border-slate-100">
                    <p className="text-xs font-bold text-[#0B2038]">{adminUser?.name || 'Priyanka Sahu'}</p>
                    <p className="text-[11px] text-[#008A8E] font-semibold">{adminUser?.email || 'admin@indiapl.com'}</p>
                    <span className="mt-1 inline-block px-2 py-0.5 text-[9px] font-bold uppercase rounded-md bg-teal-50 text-[#008A8E] border border-teal-200">
                      {adminUser?.role || 'Super Admin'}
                    </span>
                  </div>

                  <div className="py-1">
                    <Link
                      to="/admin/notifications"
                      onClick={() => setProfileDropdownOpen(false)}
                      className="flex items-center gap-2.5 px-4 py-2 text-xs font-bold text-[#0B2038] hover:bg-teal-50 hover:text-[#008A8E]"
                    >
                      <Bell className="w-4 h-4" />
                      <span>Notifications</span>
                    </Link>
                    <Link
                      to="/admin/workers"
                      onClick={() => setProfileDropdownOpen(false)}
                      className="flex items-center gap-2.5 px-4 py-2 text-xs font-bold text-[#0B2038] hover:bg-teal-50 hover:text-[#008A8E]"
                    >
                      <Users2 className="w-4 h-4" />
                      <span>Manage Workers</span>
                    </Link>
                    <Link
                      to="/admin/payouts"
                      onClick={() => setProfileDropdownOpen(false)}
                      className="flex items-center gap-2.5 px-4 py-2 text-xs font-bold text-[#0B2038] hover:bg-teal-50 hover:text-[#008A8E]"
                    >
                      <Wallet className="w-4 h-4" />
                      <span>Worker Payouts</span>
                    </Link>
                  </div>

                  <div className="pt-1 border-t border-slate-100">
                    <button
                      onClick={handleLogout}
                      className="w-full flex items-center gap-2.5 px-4 py-2 text-xs font-bold text-rose-600 hover:bg-rose-50"
                    >
                      <LogOut className="w-4 h-4" />
                      <span>Sign Out</span>
                    </button>
                  </div>
                </div>
              )}
            </div>

            {/* Mobile menu toggle */}
            <div className="flex lg:hidden">
              <button
                onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
                className="p-2 rounded-xl text-[#0B2038] hover:text-[#008A8E] hover:bg-teal-50"
                aria-label="Toggle mobile menu"
              >
                {mobileMenuOpen ? <X className="w-5 h-5" /> : <Menu className="w-5 h-5" />}
              </button>
            </div>
          </div>
        </div>
      </div>

      {/* Mobile Drawer Menu */}
      {mobileMenuOpen && (
        <div className="lg:hidden bg-white border-b border-[#DCEEEB] px-4 pt-2 pb-5 space-y-2 shadow-lg">
          {navItems.map((item) => {
            const Icon = item.icon;
            return (
              <NavLink
                key={item.name}
                to={item.path}
                onClick={() => setMobileMenuOpen(false)}
                className={({ isActive }) =>
                  `flex items-center gap-3 px-3.5 py-2.5 rounded-xl text-sm font-bold transition-all ${
                    isActive
                      ? 'bg-teal-50 text-[#008A8E] border border-teal-200/80'
                      : 'text-[#0B2038] hover:bg-teal-50/50'
                  }`
                }
              >
                <Icon className="w-4 h-4" />
                <span>{item.name}</span>
              </NavLink>
            );
          })}
          <div className="pt-2 border-t border-slate-100">
            <button
              onClick={() => {
                setMobileMenuOpen(false);
                handleLogout();
              }}
              className="w-full flex items-center gap-3 px-3.5 py-2.5 rounded-xl text-sm font-bold text-rose-600 hover:bg-rose-50"
            >
              <LogOut className="w-4 h-4" />
              <span>Log Out</span>
            </button>
          </div>
        </div>
      )}
    </header>
  );
};
