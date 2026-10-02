import React, { useState } from 'react';
import { useNavigate, useLocation } from 'react-router-dom';
import { useApp } from '../context/AppContext';
import { IndiaPLLogo } from '../components/common/IndiaPLLogo';
import {
  ShieldCheck,
  Lock,
  Mail,
  Phone,
  ArrowRight,
  Eye,
  EyeOff,
  Sparkles,
  KeyRound,
} from 'lucide-react';

export const AdminLoginPage: React.FC = () => {
  const [identifier, setIdentifier] = useState('admin@indiapl.com');
  const [password, setPassword] = useState('admin123');
  const [showPassword, setShowPassword] = useState(false);
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const { login } = useApp();
  const navigate = useNavigate();
  const location = useLocation();

  const from = (location.state as any)?.from?.pathname || '/admin/dashboard';

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
  };

  return (
    <div className="min-h-screen bg-gradient-to-b from-[#EBF8F7] via-[#F4FBFB] to-white flex flex-col justify-center py-12 sm:px-6 lg:px-8 relative overflow-hidden">
      {/* Background cyan glows */}
      <div className="absolute top-10 left-1/2 -translate-x-1/2 w-96 h-96 bg-teal-200/25 rounded-full blur-3xl pointer-events-none" />

      {/* Brand Header */}
      <div className="sm:mx-auto sm:w-full sm:max-w-md text-center space-y-4">
        <div className="inline-block">
          <IndiaPLLogo variant="admin" size="lg" />
        </div>
      </div>

      {/* Main Login Card matching PDF Pages 2 & 3 */}
      <div className="mt-8 sm:mx-auto sm:w-full sm:max-w-md px-4 sm:px-0">
        <div className="bg-white py-8 px-6 sm:px-10 rounded-3xl border border-[#DCEEEB] shadow-xl relative space-y-6">
          {/* Visual Shield Graphic matching PDF Page 2 */}
          <div className="flex justify-center">
            <div className="relative">
              <div className="w-16 h-16 rounded-2xl bg-gradient-to-br from-teal-50 to-[#D8F5F2] border border-[#BDEAE5] flex items-center justify-center text-[#009E9B] shadow-xs">
                <ShieldCheck className="w-8 h-8" />
              </div>
              <div className="absolute -bottom-1 -right-1 w-6 h-6 rounded-full bg-[#009E9B] text-white flex items-center justify-center text-[10px] shadow-sm">
                <Lock className="w-3 h-3" />
              </div>
            </div>
          </div>

          {/* Heading */}
          <div className="text-center space-y-1">
            <h2 className="text-2xl font-extrabold text-[#0B2038]">Welcome Back!</h2>
            <p className="text-xs sm:text-sm text-[#5B738B]">
              Login to access the INDIA P.L. Operations & Dispatch Dashboard
            </p>
          </div>

          {error && (
            <div className="p-3 rounded-2xl bg-rose-50 border border-rose-200 text-rose-700 text-xs text-center font-medium">
              {error}
            </div>
          )}

          {/* Form */}
          <form onSubmit={handleLogin} className="space-y-4">
            {/* Email / Mobile Field (matching Page 2) */}
            <div>
              <label className="block text-xs font-bold uppercase tracking-wider text-[#0B2038] mb-1.5">
                Email or Mobile Number
              </label>
              <div className="relative rounded-2xl border border-[#D1F0EE] bg-[#F8FCFC] focus-within:border-[#009E9B] focus-within:bg-white transition-all overflow-hidden">
                <div className="absolute inset-y-0 left-0 pl-3.5 flex items-center pointer-events-none text-[#009E9B]">
                  <Mail className="w-4 h-4" />
                </div>
                <input
                  type="text"
                  required
                  value={identifier}
                  onChange={(e) => setIdentifier(e.target.value)}
                  placeholder="admin@indiapl.com or +91 98765 43210"
                  className="block w-full pl-10 pr-4 py-3 text-xs sm:text-sm font-medium text-[#0B2038] bg-transparent placeholder-slate-400 focus:outline-none"
                />
              </div>
            </div>

            {/* Password Field */}
            <div>
              <div className="flex items-center justify-between mb-1.5">
                <label className="block text-xs font-bold uppercase tracking-wider text-[#0B2038]">
                  Password
                </label>
                <button
                  type="button"
                  onClick={() => alert('Demo Reset: You can use admin123 or click the quick demo login buttons below.')}
                  className="text-xs font-semibold text-[#009E9B] hover:text-[#00827F] transition-colors"
                >
                  Forgot Password?
                </button>
              </div>
              <div className="relative rounded-2xl border border-[#D1F0EE] bg-[#F8FCFC] focus-within:border-[#009E9B] focus-within:bg-white transition-all overflow-hidden">
                <div className="absolute inset-y-0 left-0 pl-3.5 flex items-center pointer-events-none text-[#009E9B]">
                  <KeyRound className="w-4 h-4" />
                </div>
                <input
                  type={showPassword ? 'text' : 'password'}
                  required
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  placeholder="••••••••"
                  className="block w-full pl-10 pr-10 py-3 text-xs sm:text-sm font-medium text-[#0B2038] bg-transparent placeholder-slate-400 focus:outline-none"
                />
                <button
                  type="button"
                  onClick={() => setShowPassword(!showPassword)}
                  className="absolute inset-y-0 right-0 pr-3.5 flex items-center text-slate-400 hover:text-slate-600"
                >
                  {showPassword ? <EyeOff className="w-4 h-4" /> : <Eye className="w-4 h-4" />}
                </button>
              </div>
            </div>

            {/* Submit Button matching PDF Page 2 */}
            <button
              type="submit"
              disabled={isLoading}
              className="w-full inline-flex items-center justify-center gap-2 py-3.5 px-4 rounded-full bg-[#009E9B] hover:bg-[#008784] text-white text-sm font-bold shadow-md hover:shadow-lg transition-all active:scale-98 disabled:opacity-70 cursor-pointer"
            >
              <span>{isLoading ? 'Verifying Credentials...' : 'Login to Dashboard'}</span>
              <ArrowRight className="w-4 h-4" />
            </button>
          </form>

          {/* Quick Demo Logins */}
          <div className="pt-2 border-t border-slate-100">
            <span className="block text-[11px] font-bold text-center text-slate-400 uppercase tracking-wider mb-2.5">
              One-Click Quick Login
            </span>
            <div className="grid grid-cols-2 gap-2">
              <button
                type="button"
                onClick={() => handleQuickFill('Super Admin')}
                className="py-2 px-3 text-xs font-semibold rounded-xl bg-teal-50 text-[#00827F] hover:bg-teal-100/70 border border-teal-200 transition-colors"
              >
                Super Admin
              </button>
              <button
                type="button"
                onClick={() => handleQuickFill('Ops Dispatcher')}
                className="py-2 px-3 text-xs font-semibold rounded-xl bg-slate-50 text-[#0B2038] hover:bg-slate-100 border border-slate-200 transition-colors"
              >
                Ops Dispatcher
              </button>
            </div>
          </div>

          {/* Trust Badge matching PDF Page 2 */}
          <div className="p-3 rounded-2xl bg-[#F0FAF9] border border-[#CFEAE7] flex items-center gap-2.5 text-left">
            <div className="w-5 h-5 rounded-full bg-[#009E9B] text-white flex items-center justify-center shrink-0 text-[10px]">
              ✓
            </div>
            <p className="text-[11px] text-[#5B738B]">
              <span className="font-semibold text-[#0B2038]">Safe & Protected.</span> Credentials
              and customer data are secured under ISO-grade operations protocol.
            </p>
          </div>
        </div>

        {/* Back Link */}
        <div className="text-center mt-6">
          <button
            onClick={() => navigate('/')}
            className="text-xs font-semibold text-[#5B738B] hover:text-[#009E9B] transition-colors"
          >
            ← Back to Public Website
          </button>
        </div>
      </div>
    </div>
  );
};
