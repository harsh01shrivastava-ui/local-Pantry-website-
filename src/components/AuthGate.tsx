import React, { useState } from 'react';
import logoImg from '../assets/images/logo.png';
import { UserProfile, UserRole } from '../types/auth';
import {
  isSupabaseConfigured,
  signInUser,
  signUpUser,
  mapSupabaseUserToProfile,
  OWNER_EMAIL,
} from '../lib/supabase';

interface AuthGateProps {
  onLogin: (role: UserRole, profile?: UserProfile) => void;
}

export const AuthGate: React.FC<AuthGateProps> = ({ onLogin }) => {
  const [authMode, setAuthMode] = useState<'signin' | 'signup'>('signin');
  const [emailInput, setEmailInput] = useState('');
  const [passwordInput, setPasswordInput] = useState('');
  const [fullNameInput, setFullNameInput] = useState('');
  const [showPassword, setShowPassword] = useState(false);

  const [loading, setLoading] = useState(false);
  const [errorMessage, setErrorMessage] = useState('');
  const [successMessage, setSuccessMessage] = useState('');

  const normalizeEmail = (input: string): string => {
    const trimmed = input.trim().toLowerCase();
    if (!trimmed) return '';
    if (trimmed === 'harsh01.shrivastava') {
      return 'harsh01.shrivastava@gmail.com';
    }
    if (!trimmed.includes('@')) {
      return `${trimmed}@gmail.com`;
    }
    return trimmed;
  };

  const handleQuickFillOwner = () => {
    setEmailInput('harsh01.shrivastava@gmail.com');
    setPasswordInput('Harsh2007@@');
    setAuthMode('signin');
    setErrorMessage('');
    setSuccessMessage('Owner credentials loaded. Click "Enter Kitchen Studio" to proceed.');
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setErrorMessage('');
    setSuccessMessage('');

    const targetEmail = normalizeEmail(emailInput);
    if (!targetEmail) {
      setErrorMessage('Please enter a valid email address or username.');
      return;
    }

    if (!passwordInput) {
      setErrorMessage('Please enter your password.');
      return;
    }

    setLoading(true);

    try {
      if (!isSupabaseConfigured) {
        throw new Error('Supabase configuration is missing in .env file.');
      }

      if (authMode === 'signup') {
        const { data, error } = await signUpUser({
          email: targetEmail,
          password: passwordInput,
          fullName: fullNameInput.trim() || 'Pantry Patron',
          role: 'customer',
        });

        if (error) {
          setErrorMessage(error.message);
          setLoading(false);
          return;
        }

        if (data?.user) {
          const profile = mapSupabaseUserToProfile(data.user);
          if (data.session) {
            setSuccessMessage(`Account created! Welcome to The Local Pantry, ${profile.name}!`);
            setTimeout(() => {
              onLogin(profile.role, profile);
            }, 600);
          } else {
            setSuccessMessage(
              'Account registered! If confirmation is required in your Supabase project, please check your inbox.'
            );
          }
        }
      } else {
        // Sign In
        const { data, error } = await signInUser({
          email: targetEmail,
          password: passwordInput,
        });

        if (error) {
          setErrorMessage(error.message || 'Invalid login credentials. Please check your email and password.');
          setLoading(false);
          return;
        }

        if (data?.user) {
          const profile = mapSupabaseUserToProfile(data.user);
          if (profile.role === 'owner') {
            setSuccessMessage(`Store Owner verified! Redirecting to Kitchen Dashboard...`);
          } else {
            setSuccessMessage(`Welcome back, ${profile.name}! Opening storefront...`);
          }

          setTimeout(() => {
            onLogin(profile.role, profile);
          }, 600);
        }
      }
    } catch (err: any) {
      setErrorMessage(err.message || 'An unexpected error occurred during authentication.');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen w-full bg-[#fff8f5] flex items-center justify-center p-3 sm:p-6 lg:p-8 relative overflow-hidden font-sans">
      {/* Decorative Warm Background Accents */}
      <div className="absolute top-0 left-0 w-full h-full pointer-events-none opacity-40 overflow-hidden">
        <div className="absolute -top-[120px] -left-[120px] w-[380px] h-[380px] rounded-full bg-[#dec0b7]/30 blur-3xl" />
        <div className="absolute -bottom-[120px] -right-[120px] w-[420px] h-[420px] rounded-full bg-[#9f3c16]/10 blur-3xl" />
        <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[600px] h-[600px] rounded-full bg-[#516444]/5 blur-3xl" />
      </div>

      {/* Main Glassmorphic Auth Gate Card */}
      <div className="relative w-full max-w-[520px] bg-white/95 backdrop-blur-xl rounded-3xl p-6 sm:p-9 shadow-[0_25px_60px_-15px_rgba(159,60,22,0.12)] border border-[#dec0b7]/40 z-10 animate-fadeIn">
        {/* Top Brand Lockup */}
        <div className="text-center mb-6 sm:mb-7">
          <div className="inline-block relative mb-3">
            <img
              src={logoImg}
              alt="The Local Pantry Logo"
              className="h-16 sm:h-20 w-auto object-contain mx-auto rounded-2xl p-1 bg-white shadow-xs border border-[#dec0b7]/40 transition-transform hover:scale-105"
            />
          </div>

          <div className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-[#516444]/10 text-[#516444] text-[10px] sm:text-[11px] font-semibold uppercase tracking-wider mb-2 font-sans">
            <span>✨</span>
            <span>Banswara Artisanal Kitchen Studio</span>
          </div>

          <h1 className="font-serif text-[28px] sm:text-[34px] text-[#1e1b19] font-normal tracking-tight leading-tight">
            The Local Pantry
          </h1>

          <p className="text-[13px] sm:text-[14px] text-[#57423b] mt-1.5 max-w-sm mx-auto leading-relaxed">
            Pure homemade condiments and small-batch provisions. Please sign in to access your pantry bag or store owner management.
          </p>
        </div>

        {/* 1-Click Owner Quick Access Banner */}
        <div className="mb-5 p-3 sm:p-3.5 bg-[#fbf2ee] rounded-2xl border border-[#efe6e3] flex flex-col sm:flex-row sm:items-center justify-between gap-2.5 transition-all">
          <div className="flex items-center gap-2">
            <div className="w-8 h-8 rounded-xl bg-[#516444]/15 text-[#516444] flex items-center justify-center shrink-0">
              <span className="material-symbols-outlined text-[18px]">admin_panel_settings</span>
            </div>
            <div className="text-left">
              <span className="text-[11px] font-bold uppercase tracking-wider text-[#516444] block font-sans">
                Store Owner Portal
              </span>
              <span className="text-[12px] text-[#57423b] font-mono">
                {OWNER_EMAIL}
              </span>
            </div>
          </div>

          <button
            type="button"
            onClick={handleQuickFillOwner}
            className="px-3 py-1.5 rounded-lg bg-[#516444] hover:bg-[#435338] text-white text-[11px] font-semibold transition-all cursor-pointer shadow-xs active:scale-95 shrink-0 text-center"
          >
            Quick-Fill Owner
          </button>
        </div>

        {/* Tabs: Sign In vs Create Account */}
        <div className="flex border-b border-[#efe6e3] mb-5">
          <button
            type="button"
            onClick={() => {
              setAuthMode('signin');
              setErrorMessage('');
              setSuccessMessage('');
            }}
            className={`flex-1 pb-3 text-[14px] font-semibold transition-colors border-b-2 cursor-pointer flex items-center justify-center gap-1.5 ${
              authMode === 'signin'
                ? 'border-[#9f3c16] text-[#9f3c16]'
                : 'border-transparent text-[#8a726a] hover:text-[#1e1b19]'
            }`}
          >
            <span className="material-symbols-outlined text-[18px]">login</span>
            <span>Sign In</span>
          </button>
          <button
            type="button"
            onClick={() => {
              setAuthMode('signup');
              setErrorMessage('');
              setSuccessMessage('');
            }}
            className={`flex-1 pb-3 text-[14px] font-semibold transition-colors border-b-2 cursor-pointer flex items-center justify-center gap-1.5 ${
              authMode === 'signup'
                ? 'border-[#9f3c16] text-[#9f3c16]'
                : 'border-transparent text-[#8a726a] hover:text-[#1e1b19]'
            }`}
          >
            <span className="material-symbols-outlined text-[18px]">person_add</span>
            <span>Create Account</span>
          </button>
        </div>

        {/* Notification Alerts */}
        {errorMessage && (
          <div className="p-3.5 mb-4 rounded-xl bg-red-50 border border-red-200 text-red-800 text-[12px] flex items-start gap-2.5 animate-fadeIn">
            <span className="material-symbols-outlined text-[18px] text-[#ba1a1a] shrink-0 mt-0.5">error</span>
            <span className="leading-snug">{errorMessage}</span>
          </div>
        )}

        {successMessage && (
          <div className="p-3.5 mb-4 rounded-xl bg-emerald-50 border border-emerald-200 text-emerald-800 text-[12px] flex items-start gap-2.5 animate-fadeIn">
            <span className="material-symbols-outlined text-[18px] text-emerald-600 shrink-0 mt-0.5">check_circle</span>
            <span className="leading-snug">{successMessage}</span>
          </div>
        )}

        {/* Auth Form */}
        <form onSubmit={handleSubmit} className="space-y-4">
          {authMode === 'signup' && (
            <div>
              <label className="block text-[12px] font-semibold text-[#57423b] mb-1.5 font-sans">
                Full Name
              </label>
              <div className="relative">
                <input
                  type="text"
                  required
                  placeholder="e.g. Ananya Mehta"
                  value={fullNameInput}
                  onChange={(e) => setFullNameInput(e.target.value)}
                  className="w-full pl-10 pr-3.5 py-2.5 bg-[#fbf2ee] rounded-xl text-[13px] text-[#1e1b19] border border-[#efe6e3] focus:border-[#9f3c16] focus:bg-white outline-none transition-all placeholder:text-[#8a726a]"
                />
                <span className="material-symbols-outlined absolute left-3 top-2.5 text-[#8a726a] text-[18px]">
                  person
                </span>
              </div>
            </div>
          )}

          <div>
            <label className="block text-[12px] font-semibold text-[#57423b] mb-1.5 font-sans">
              Email Address or Username
            </label>
            <div className="relative">
              <input
                type="text"
                required
                placeholder="harsh01.shrivastava@gmail.com or your email"
                value={emailInput}
                onChange={(e) => setEmailInput(e.target.value)}
                className="w-full pl-10 pr-3.5 py-2.5 bg-[#fbf2ee] rounded-xl text-[13px] text-[#1e1b19] border border-[#efe6e3] focus:border-[#9f3c16] focus:bg-white outline-none transition-all placeholder:text-[#8a726a]"
              />
              <span className="material-symbols-outlined absolute left-3 top-2.5 text-[#8a726a] text-[18px]">
                mail
              </span>
            </div>
            {emailInput && !emailInput.includes('@') && (
              <span className="text-[11px] text-[#8a726a] mt-1 block">
                Will sign in as: <strong className="text-[#1e1b19]">{normalizeEmail(emailInput)}</strong>
              </span>
            )}
          </div>

          <div>
            <div className="flex items-center justify-between mb-1.5">
              <label className="block text-[12px] font-semibold text-[#57423b] font-sans">
                Password
              </label>
              <button
                type="button"
                onClick={() => setShowPassword(!showPassword)}
                className="text-[11px] text-[#9f3c16] hover:underline cursor-pointer"
              >
                {showPassword ? 'Hide' : 'Show'}
              </button>
            </div>
            <div className="relative">
              <input
                type={showPassword ? 'text' : 'password'}
                required
                minLength={6}
                placeholder="Enter your password"
                value={passwordInput}
                onChange={(e) => setPasswordInput(e.target.value)}
                className="w-full pl-10 pr-10 py-2.5 bg-[#fbf2ee] rounded-xl text-[13px] text-[#1e1b19] border border-[#efe6e3] focus:border-[#9f3c16] focus:bg-white outline-none transition-all placeholder:text-[#8a726a]"
              />
              <span className="material-symbols-outlined absolute left-3 top-2.5 text-[#8a726a] text-[18px]">
                lock
              </span>
              <button
                type="button"
                onClick={() => setShowPassword(!showPassword)}
                className="material-symbols-outlined absolute right-3 top-2.5 text-[#8a726a] text-[18px] cursor-pointer hover:text-[#1e1b19]"
              >
                {showPassword ? 'visibility_off' : 'visibility'}
              </button>
            </div>
          </div>

          <button
            type="submit"
            disabled={loading}
            className="w-full mt-2 py-3 px-4 rounded-xl bg-[#9f3c16] hover:bg-[#bf542c] disabled:opacity-70 text-white font-semibold text-[14px] flex items-center justify-center gap-2 shadow-md transition-all cursor-pointer active:scale-98"
          >
            {loading ? (
              <span className="inline-block w-4 h-4 border-2 border-white border-t-transparent rounded-full animate-spin" />
            ) : (
              <span className="material-symbols-outlined text-[18px]">
                {authMode === 'signin' ? 'login' : 'arrow_forward'}
              </span>
            )}
            <span>
              {loading
                ? 'Authenticating with Supabase...'
                : authMode === 'signin'
                ? 'Sign In to The Local Pantry'
                : 'Create Account & Enter'}
            </span>
          </button>
        </form>

        {/* Artisanal Heritage Highlights */}
        <div className="mt-6 pt-5 border-t border-[#efe6e3] grid grid-cols-3 gap-2 text-center text-[10px] sm:text-[11px] text-[#57423b]">
          <div className="flex flex-col items-center">
            <span className="material-symbols-outlined text-[18px] text-[#516444] mb-0.5">spa</span>
            <span>100% Natural</span>
          </div>
          <div className="flex flex-col items-center">
            <span className="material-symbols-outlined text-[18px] text-[#9f3c16] mb-0.5">cookie</span>
            <span>Small-Batch Craft</span>
          </div>
          <div className="flex flex-col items-center">
            <span className="material-symbols-outlined text-[18px] text-[#516444] mb-0.5">local_shipping</span>
            <span>Pan-India Dispatch</span>
          </div>
        </div>
      </div>
    </div>
  );
};
