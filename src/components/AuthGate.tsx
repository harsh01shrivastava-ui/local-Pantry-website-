import React, { useState } from 'react';
import logoImg from '../assets/images/logo.png';
import { UserProfile, UserRole } from '../types/auth';
import {
  isSupabaseConfigured,
  signInUser,
  mapSupabaseUserToProfile,
  OWNER_EMAIL,
} from '../lib/supabase';

interface AuthGateProps {
  onLogin: (role: UserRole, profile?: UserProfile) => void;
}

export const AuthGate: React.FC<AuthGateProps> = ({ onLogin }) => {
  const [usernameInput, setUsernameInput] = useState('');
  const [emailInput, setEmailInput] = useState('');
  const [passwordInput, setPasswordInput] = useState('');
  const [showPassword, setShowPassword] = useState(false);
  const [loading, setLoading] = useState(false);
  const [errorMessage, setErrorMessage] = useState('');

  const normalizeEmail = (input: string): string => {
    const trimmed = input.trim();
    if (!trimmed) return '';
    if (trimmed.toLowerCase() === 'harsh01.shrivastava') {
      return 'harsh01.shrivastava@gmail.com';
    }
    if (!trimmed.includes('@')) {
      return `${trimmed}@gmail.com`;
    }
    return trimmed;
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setErrorMessage('');

    const targetEmail = normalizeEmail(emailInput);
    if (!targetEmail) {
      setErrorMessage('Please enter your email address.');
      return;
    }

    if (!passwordInput) {
      setErrorMessage('Please enter your password.');
      return;
    }

    setLoading(true);

    try {
      const isOwnerAttempt =
        targetEmail.toLowerCase() === OWNER_EMAIL.toLowerCase() ||
        targetEmail.toLowerCase() === 'harsh01.shrivastava@gmail.com';

      // 1. Authenticate with Supabase
      if (isSupabaseConfigured) {
        const { data, error } = await signInUser({
          email: targetEmail,
          password: passwordInput,
        });

        if (!error && data?.user) {
          const profile = mapSupabaseUserToProfile(data.user);
          if (usernameInput.trim() && profile.role !== 'owner') {
            profile.username = usernameInput.trim();
          }
          onLogin(profile.role, profile);
          return;
        }

        // If this was an owner login attempt and credentials failed, show error
        if (isOwnerAttempt) {
          setErrorMessage(
            error?.message || 'Invalid owner credentials. Please verify your email and password.'
          );
          setLoading(false);
          return;
        }
      } else {
        // Fallback for owner when Supabase is not reachable
        if (isOwnerAttempt) {
          if (passwordInput === 'Harsh2007@@') {
            const ownerProfile: UserProfile = {
              id: 'owner-local',
              name: 'Vikas Oli',
              email: 'harsh01.shrivastava@gmail.com',
              role: 'owner',
              avatarInitials: 'VO',
              phone: '+91 98200 12345',
              address: 'Civil Lines, Near Lake',
              city: 'Banswara',
            };
            onLogin('owner', ownerProfile);
            return;
          } else {
            setErrorMessage('Invalid owner password. Please try again.');
            setLoading(false);
            return;
          }
        }
      }

      // 2. Any other credentials open the normal customer storefront
      const trimmedUser = usernameInput.trim();
      const sanitizedUsername = trimmedUser || targetEmail.split('@')[0].toLowerCase().replace(/[^a-z0-9_]/g, '_');
      const displayName = trimmedUser || targetEmail.split('@')[0].replace(/[._]/g, ' ').replace(/\b\w/g, (c) => c.toUpperCase());

      const customerProfile: UserProfile = {
        id: `customer-${Date.now()}`,
        name: displayName || 'Pantry Patron',
        username: sanitizedUsername,
        email: targetEmail,
        role: 'customer',
        avatarInitials: (sanitizedUsername[0] || displayName[0] || 'P').toUpperCase(),
        phone: '+91 98200 12345',
        address: 'Banswara Artisanal Pantry',
        city: 'Banswara',
      };

      onLogin('customer', customerProfile);
    } catch (err: any) {
      setErrorMessage(err.message || 'Authentication error. Please try again.');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen w-full bg-[#fff8f5] flex items-center justify-center p-4 sm:p-6 relative overflow-hidden font-sans">
      {/* Subtle Warm Background Glow */}
      <div className="absolute top-0 left-0 w-full h-full pointer-events-none opacity-40 overflow-hidden">
        <div className="absolute -top-[120px] -left-[120px] w-[380px] h-[380px] rounded-full bg-[#dec0b7]/30 blur-3xl" />
        <div className="absolute -bottom-[120px] -right-[120px] w-[420px] h-[420px] rounded-full bg-[#9f3c16]/10 blur-3xl" />
      </div>

      {/* Auth Card */}
      <div className="relative w-full max-w-[420px] bg-white rounded-3xl p-7 sm:p-9 shadow-[0_20px_50px_rgba(159,60,22,0.08)] border border-[#dec0b7]/40 z-10">
        {/* 1. Brand Logo */}
        <div className="flex justify-center mb-4">
          <img
            src={logoImg}
            alt="The Local Pantry"
            className="h-16 sm:h-20 w-auto object-contain"
          />
        </div>

        {/* 2. Clean Title */}
        <h1 className="font-serif text-[26px] sm:text-[30px] text-[#1e1b19] font-medium tracking-tight text-center mb-6">
          The Local Pantry
        </h1>

        {/* Error notification */}
        {errorMessage && (
          <div className="p-3 mb-5 rounded-xl bg-red-50 border border-red-200 text-red-800 text-[12px] flex items-start gap-2">
            <span className="material-symbols-outlined text-[18px] text-[#ba1a1a] shrink-0 mt-0.5">
              error
            </span>
            <span className="leading-snug">{errorMessage}</span>
          </div>
        )}

        {/* Form */}
        <form onSubmit={handleSubmit} className="space-y-4">
          {/* Username Input Field */}
          <div>
            <label className="block text-[13px] font-medium text-[#57423b] mb-1.5 font-sans">
              Username <span className="text-[11px] font-normal text-[#8a726a]">(for visitors/patrons)</span>
            </label>
            <input
              type="text"
              placeholder="e.g. aditi_k or patron handle"
              value={usernameInput}
              onChange={(e) => setUsernameInput(e.target.value)}
              className="w-full px-4 py-2.5 sm:py-3 bg-[#fbf2ee] rounded-xl text-[14px] text-[#1e1b19] border border-[#efe6e3] focus:border-[#9f3c16] focus:bg-white focus:ring-2 focus:ring-[#9f3c16]/10 outline-none transition-all placeholder:text-[#8a726a]"
            />
          </div>

          {/* Email Input Field */}
          <div>
            <label className="block text-[13px] font-medium text-[#57423b] mb-1.5 font-sans">
              Email
            </label>
            <input
              type="text"
              required
              placeholder="Enter your email"
              value={emailInput}
              onChange={(e) => setEmailInput(e.target.value)}
              className="w-full px-4 py-2.5 sm:py-3 bg-[#fbf2ee] rounded-xl text-[14px] text-[#1e1b19] border border-[#efe6e3] focus:border-[#9f3c16] focus:bg-white focus:ring-2 focus:ring-[#9f3c16]/10 outline-none transition-all placeholder:text-[#8a726a]"
            />
          </div>

          {/* 4. Password Input Field */}
          <div>
            <label className="block text-[13px] font-medium text-[#57423b] mb-1.5 font-sans">
              Password
            </label>
            <div className="relative">
              <input
                type={showPassword ? 'text' : 'password'}
                required
                placeholder="Enter your password"
                value={passwordInput}
                onChange={(e) => setPasswordInput(e.target.value)}
                className="w-full pl-4 pr-11 py-2.5 sm:py-3 bg-[#fbf2ee] rounded-xl text-[14px] text-[#1e1b19] border border-[#efe6e3] focus:border-[#9f3c16] focus:bg-white focus:ring-2 focus:ring-[#9f3c16]/10 outline-none transition-all placeholder:text-[#8a726a]"
              />
              <button
                type="button"
                onClick={() => setShowPassword(!showPassword)}
                tabIndex={-1}
                className="material-symbols-outlined absolute right-3.5 top-1/2 -translate-y-1/2 text-[#8a726a] text-[20px] cursor-pointer hover:text-[#1e1b19] transition-colors"
                aria-label={showPassword ? 'Hide password' : 'Show password'}
              >
                {showPassword ? 'visibility_off' : 'visibility'}
              </button>
            </div>
          </div>

          {/* 5. Single Clean "Sign In" Button */}
          <button
            type="submit"
            disabled={loading}
            className="w-full mt-2 py-3 sm:py-3.5 px-4 rounded-xl bg-[#9f3c16] hover:bg-[#853212] active:scale-[0.99] disabled:opacity-70 text-white font-semibold text-[15px] flex items-center justify-center gap-2 shadow-sm hover:shadow-md transition-all cursor-pointer"
          >
            {loading && (
              <span className="inline-block w-4 h-4 border-2 border-white border-t-transparent rounded-full animate-spin" />
            )}
            <span>{loading ? 'Signing In...' : 'Sign In'}</span>
          </button>
        </form>
      </div>
    </div>
  );
};
