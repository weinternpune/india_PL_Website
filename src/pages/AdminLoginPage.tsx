import React, { useState } from 'react';
import { useNavigate, useLocation } from 'react-router-dom';
import { useApp } from '../context/AppContext';
import { IndiaPLLogo } from '../components/common/IndiaPLLogo';
import { LoginMascot, MascotMode } from '../components/auth/LoginMascot';
import {
  Lock,
  Mail,
  ArrowRight,
  Eye,
  EyeOff,
  KeyRound,
  ShieldCheck,
} from 'lucide-react';

export const AdminLoginPage: React.FC = () => {
  const [identifier, setIdentifier] = useState('admin@indiapl.com');
  const [password, setPassword] = useState('admin123');
  const [showPassword, setShowPassword] = useState(false);
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  // Mascot interaction state
  const [mascotMode, setMascotMode] = useState<MascotMode>('idle');
  const [isTyping, setIsTyping] = useState(false);

  const { login } = useApp();
  const navigate = useNavigate();
  const location = useLocation();

  const from = (location.state as any)?.from?.pathname || '/admin/dashboard';

  const triggerTyping = () => {
    setIsTyping(true);
    const timeout = setTimeout(() => setIsTyping(false), 300);
    return () => clearTimeout(timeout);
  };

  const handleLogin = (e: React.FormEvent) => {
    e.preventDefault();
    setError(null);
    setIsLoading(true);

    setTimeout(() => {
      if (!identifier.trim() || !password.trim()) {
        setError('Please provide your admin email/phone and password');
        setIsLoading(false);
        return;
      }

      login(identifier, password);
      setIsLoading(false);
      navigate(from, { replace: true });
    }, 400);
  };

  const handleQuickFill = (role: 'Super Admin' | 'Ops Dispatcher') => {
    if (role === 'Super Admin') {
      setIdentifier('admin@indiapl.com');
      setPassword('admin123');
    } else {
      setIdentifier('+91 98765 00002');
      setPassword('ops2026');
    }
    setMascotMode('idle');
  };

  return (
    <div className="min-h-screen bg-gradient-to-b from-[#EBF8F7] via-[#F4FBFB] to-white flex flex-col justify-center py-8 sm:px-6 lg:px-8 relative overflow-hidden">
      {/* Background cyan glows */}
      <div className="absolute top-10 left-1/2 -translate-x-1/2 w-96 h-96 bg-teal-200/25 rounded-full blur-3xl pointer-events-none" />

      {/* Brand Header */}
      <div className="sm:mx-auto sm:w-full sm:max-w-[400px] text-center space-y-3">
        <div className="inline-block">
          <IndiaPLLogo variant="admin" size="md" />
        </div>
      </div>

      {/* Compact Main Login Card */}
      <div className="mt-5 sm:mx-auto sm:w-full sm:max-w-[400px] px-4 sm:px-0">
        <div className="bg-white py-6 px-6 sm:px-7 rounded-3xl border border-[#DCEEEB] shadow-xl relative space-y-4">
          
          {/* Interactive Mascot popout reacting to focus */}
          <div className="flex justify-center -mt-2">
            <LoginMascot mode={mascotMode} isTyping={isTyping} />
          </div>

          {/* Heading with high-contrast text */}
          <div className="text-center space-y-1">
            <h2 className="text-xl sm:text-2xl font-black text-[#0B2038] tracking-tight">
              Welcome Back!
            </h2>
            <p className="text-xs font-semibold text-[#0B2038]">
              Login to access the INDIA P.L. Operations & Dispatch Dashboard
            </p>
          </div>

          {error && (
            <div className="p-2.5 rounded-xl bg-rose-50 border border-rose-200 text-rose-800 text-xs text-center font-bold">
              {error}
            </div>
          )}

          {/* Form */}
          <form onSubmit={handleLogin} className="space-y-3.5">
            {/* Email / Mobile Field */}
            <div>
              <label className="block text-xs font-bold uppercase tracking-wider text-[#0B2038] mb-1">
                Email or Mobile Number
              </label>
              <div
                className={`relative rounded-xl border bg-[#F8FCFC] transition-all overflow-hidden ${
                  mascotMode === 'email'
                    ? 'border-[#008A8E] ring-2 ring-[#008A8E]/20 bg-white'
                    : 'border-slate-200 hover:border-slate-300'
                }`}
              >
                <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none text-[#008A8E]">
                  <Mail className="w-4 h-4" />
                </div>
                <input
                  type="text"
                  required
                  value={identifier}
                  onFocus={() => setMascotMode('email')}
                  onBlur={() => setMascotMode('idle')}
                  onChange={(e) => {
                    setIdentifier(e.target.value);
                    triggerTyping();
                  }}
                  placeholder="admin@indiapl.com or +91 98765 43210"
                  className="block w-full pl-9 pr-3 py-2.5 text-xs sm:text-sm font-semibold text-[#0B2038] bg-transparent placeholder-slate-400 focus:outline-none"
                />
              </div>
            </div>

            {/* Password Field */}
            <div>
              <div className="flex items-center justify-between mb-1">
                <label className="block text-xs font-bold uppercase tracking-wider text-[#0B2038]">
                  Password
                </label>
                <button
                  type="button"
                  onClick={() => alert('Demo Reset: Password is admin123 or select a one-click login below.')}
                  className="text-xs font-bold text-[#008A8E] hover:text-[#007074] transition-colors"
                >
                  Forgot?
                </button>
              </div>
              <div
                className={`relative rounded-xl border bg-[#F8FCFC] transition-all overflow-hidden ${
                  mascotMode === 'password'
                    ? 'border-[#008A8E] ring-2 ring-[#008A8E]/20 bg-white'
                    : 'border-slate-200 hover:border-slate-300'
                }`}
              >
                <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none text-[#008A8E]">
                  <KeyRound className="w-4 h-4" />
                </div>
                <input
                  type={showPassword ? 'text' : 'password'}
                  required
                  value={password}
                  onFocus={() => setMascotMode('password')}
                  onBlur={() => setMascotMode('idle')}
                  onChange={(e) => {
                    setPassword(e.target.value);
                    triggerTyping();
                  }}
                  placeholder="••••••••"
                  className="block w-full pl-9 pr-9 py-2.5 text-xs sm:text-sm font-semibold text-[#0B2038] bg-transparent placeholder-slate-400 focus:outline-none"
                />
                <button
                  type="button"
                  onClick={() => setShowPassword(!showPassword)}
                  className="absolute inset-y-0 right-0 pr-3 flex items-center text-slate-500 hover:text-[#0B2038]"
                >
                  {showPassword ? <EyeOff className="w-4 h-4" /> : <Eye className="w-4 h-4" />}
                </button>
              </div>
            </div>

            {/* Submit Button */}
            <button
              type="submit"
              disabled={isLoading}
              className="w-full inline-flex items-center justify-center gap-2 py-3 px-4 rounded-xl bg-[#008A8E] hover:bg-[#007074] text-white text-xs sm:text-sm font-bold shadow-md hover:shadow-lg transition-all active:scale-98 disabled:opacity-70 cursor-pointer mt-1"
            >
              <span>{isLoading ? 'Verifying Credentials...' : 'Login to Dashboard'}</span>
              <ArrowRight className="w-4 h-4" />
            </button>
          </form>

          {/* Quick Demo Logins */}
          <div className="pt-2 border-t border-slate-100">
            <span className="block text-[10px] font-black text-center text-slate-600 uppercase tracking-wider mb-2">
              One-Click Quick Login
            </span>
            <div className="grid grid-cols-2 gap-2">
              <button
                type="button"
                onClick={() => handleQuickFill('Super Admin')}
                className="py-1.5 px-3 text-xs font-bold rounded-lg bg-teal-50 text-[#008A8E] hover:bg-teal-100 border border-teal-200 transition-colors"
              >
                Super Admin
              </button>
              <button
                type="button"
                onClick={() => handleQuickFill('Ops Dispatcher')}
                className="py-1.5 px-3 text-xs font-bold rounded-lg bg-slate-50 text-[#0B2038] hover:bg-slate-100 border border-slate-200 transition-colors"
              >
                Ops Dispatcher
              </button>
            </div>
          </div>

          {/* Trust Badge */}
          <div className="p-2.5 rounded-xl bg-[#F0FAF9] border border-[#CFEAE7] flex items-center gap-2 text-left">
            <ShieldCheck className="w-4 h-4 text-[#008A8E] flex-shrink-0" />
            <p className="text-[11px] text-slate-800 font-medium">
              <span className="font-bold text-[#0B2038]">Safe & Protected.</span> Secured under ISO-grade operations protocol.
            </p>
          </div>
        </div>

        {/* Back Link */}
        <div className="text-center mt-4">
          <button
            onClick={() => navigate('/')}
            className="text-xs font-bold text-[#0B2038] hover:text-[#008A8E] transition-colors"
          >
            ← Back to Public Website
          </button>
        </div>
      </div>
    </div>
  );
};
