import React, { useState } from 'react';
import { UserProfile, UserRole } from '../types/auth';
import {
  isSupabaseConfigured,
  signInUser,
  signUpUser,
  signOutUser,
  mapSupabaseUserToProfile,
  OWNER_EMAIL,
} from '../lib/supabase';

interface AccountModalProps {
  isOpen: boolean;
  onClose: () => void;
  currentUser: UserProfile | null;
  isLoggedIn: boolean;
  onLogin: (role: UserRole, profile?: UserProfile) => void;
  onLogout: () => void;
  onNavigateToShop: () => void;
  onNavigateToDashboard: () => void;
}

export const AccountModal: React.FC<AccountModalProps> = ({
  isOpen,
  onClose,
  currentUser,
  isLoggedIn,
  onLogin,
  onLogout,
  onNavigateToShop,
  onNavigateToDashboard,
}) => {
  // Auth Form State: 'signin' | 'signup'
  const [authMode, setAuthMode] = useState<'signin' | 'signup'>('signin');

  const [fullNameInput, setFullNameInput] = useState('');
  const [emailInput, setEmailInput] = useState('');
  const [passwordInput, setPasswordInput] = useState('');

  const [loading, setLoading] = useState(false);
  const [errorMessage, setErrorMessage] = useState('');
  const [successMessage, setSuccessMessage] = useState('');

  if (!isOpen) return null;

  const handleFillOwnerEmail = () => {
    setEmailInput(OWNER_EMAIL);
    setPasswordInput('');
    setErrorMessage('');
    setSuccessMessage('Owner email filled. Please enter your secure owner password.');
  };

  const handleAuthSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setErrorMessage('');
    setSuccessMessage('');
    setLoading(true);

    try {
      if (!isSupabaseConfigured) {
        throw new Error('Supabase configuration is missing in .env file.');
      }

      if (authMode === 'signup') {
        const trimmedEmail = emailInput.trim();
        const { data, error } = await signUpUser({
          email: trimmedEmail,
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
            setSuccessMessage('Account created and signed in successfully!');
            onLogin(profile.role, profile);
            setTimeout(() => onClose(), 800);
          } else {
            setSuccessMessage(
              'Account created! If email confirmation is enabled in your Supabase project, please check your inbox.'
            );
          }
        }
      } else {
        // Sign In
        const { data, error } = await signInUser({
          email: emailInput.trim(),
          password: passwordInput,
        });

        if (error) {
          setErrorMessage(error.message);
          setLoading(false);
          return;
        }

        if (data?.user) {
          const profile = mapSupabaseUserToProfile(data.user);
          setSuccessMessage(
            profile.role === 'owner'
              ? `Welcome back, Store Owner (${profile.name})!`
              : `Welcome back, ${profile.name}!`
          );
          onLogin(profile.role, profile);
          setTimeout(() => onClose(), 600);
        }
      }
    } catch (err: any) {
      setErrorMessage(err.message || 'An unexpected authentication error occurred.');
    } finally {
      setLoading(false);
    }
  };

  const handleSignOutClick = async () => {
    try {
      if (isSupabaseConfigured) {
        await signOutUser();
      }
    } finally {
      onLogout();
    }
  };

  return (
    <div className="fixed inset-0 z-50 overflow-y-auto bg-black/60 backdrop-blur-sm flex items-center justify-center p-3 sm:p-6 animate-fadeIn">
      <div
        className="relative bg-white rounded-2xl sm:rounded-3xl max-w-lg w-full shadow-2xl overflow-hidden border border-[#efe6e3] p-5 sm:p-7 max-h-[92vh] overflow-y-auto"
        onClick={(e) => e.stopPropagation()}
      >
        {/* Close Button */}
        <button
          onClick={onClose}
          aria-label="Close modal"
          className="absolute top-4 right-4 w-9 h-9 rounded-full bg-[#fbf2ee] hover:bg-[#efe6e3] text-[#57423b] flex items-center justify-center transition-colors cursor-pointer"
        >
          <span className="material-symbols-outlined text-[20px]">close</span>
        </button>

        {/* Modal Title */}
        <div className="mb-4">
          <div className="inline-flex items-center gap-1.5 text-[11px] font-semibold text-[#9f3c16] uppercase tracking-wider font-sans mb-1">
            <span className="material-symbols-outlined text-[16px]">lock</span>
            <span>Supabase Secure Authentication</span>
          </div>
          <h2 className="font-serif text-[24px] sm:text-[26px] text-[#1e1b19] font-normal">
            {isLoggedIn && currentUser
              ? 'Account & Session'
              : authMode === 'signin'
              ? 'Sign In to Your Account'
              : 'Create Customer Account'}
          </h2>
        </div>

        {/* Database Status Indicator */}
        <div className="mb-5 flex items-center justify-between px-3 py-1.5 rounded-lg bg-[#fbf2ee] border border-[#efe6e3] text-[11px]">
          <div className="flex items-center gap-1.5 text-[#57423b]">
            <span className="w-2 h-2 rounded-full bg-emerald-500 animate-pulse" />
            <span>Supabase Database Connected</span>
          </div>
          <span className="text-[10px] text-[#8a726a] font-mono">
            {OWNER_EMAIL ? `Owner: ${OWNER_EMAIL}` : 'Role-Protected'}
          </span>
        </div>

        {isLoggedIn && currentUser ? (
          /* LOGGED IN VIEW */
          <div className="space-y-5">
            {/* Active User Card */}
            <div className="p-4 bg-[#fbf2ee] rounded-2xl border border-[#efe6e3] flex items-center justify-between">
              <div className="flex items-center gap-3.5">
                <div
                  className={`w-12 h-12 rounded-full text-white flex items-center justify-center font-serif text-[18px] font-bold shadow-xs ${
                    currentUser.role === 'owner' ? 'bg-[#516444]' : 'bg-[#9f3c16]'
                  }`}
                >
                  {currentUser.avatarInitials}
                </div>
                <div>
                  <div className="flex items-center gap-2">
                    <span className="font-serif text-[18px] text-[#1e1b19] font-medium leading-tight">
                      {currentUser.name}
                    </span>
                    <span
                      className={`text-[10px] font-bold uppercase tracking-wider px-2 py-0.5 rounded-full ${
                        currentUser.role === 'owner'
                          ? 'bg-[#516444]/15 text-[#516444]'
                          : 'bg-[#9f3c16]/10 text-[#9f3c16]'
                      }`}
                    >
                      {currentUser.role === 'owner' ? 'Store Owner' : 'Verified Patron'}
                    </span>
                  </div>
                  <span className="text-[12px] text-[#57423b] block mt-0.5 font-mono">
                    {currentUser.email}
                  </span>
                </div>
              </div>
            </div>

            {/* Role-Specific Actions */}
            {currentUser.role === 'owner' ? (
              <div className="space-y-3">
                <div className="p-3 bg-[#516444]/10 rounded-xl border border-[#516444]/20 text-[12px] text-[#516444] flex items-center gap-2">
                  <span className="material-symbols-outlined text-[18px]">verified_user</span>
                  <span>Store Owner access verified for <strong>{currentUser.email}</strong>.</span>
                </div>

                <button
                  onClick={() => {
                    onClose();
                    onNavigateToDashboard();
                  }}
                  className="w-full py-3 px-4 rounded-xl bg-[#516444] hover:bg-[#435338] text-white font-semibold text-[14px] flex items-center justify-center gap-2 shadow-sm transition-all cursor-pointer active:scale-98"
                >
                  <span className="material-symbols-outlined text-[20px]">admin_panel_settings</span>
                  <span>Open Store Owner Portal</span>
                </button>

                <button
                  onClick={() => {
                    onClose();
                    onNavigateToShop();
                  }}
                  className="w-full py-2.5 px-4 rounded-xl bg-[#f5ece9] hover:bg-[#efe6e3] text-[#1e1b19] font-semibold text-[13px] flex items-center justify-center gap-2 transition-all cursor-pointer"
                >
                  <span className="material-symbols-outlined text-[18px]">storefront</span>
                  <span>View Customer Storefront</span>
                </button>
              </div>
            ) : (
              <div className="space-y-3">
                <div className="p-3.5 bg-white border border-[#efe6e3] rounded-xl text-[12px] space-y-1 shadow-xs">
                  <div className="font-semibold text-[#1e1b19]">Patron Account Status:</div>
                  <div className="text-[#57423b]">Standard customer permissions. Orders and address history are securely linked to your account.</div>
                </div>

                <button
                  onClick={() => {
                    onClose();
                    onNavigateToShop();
                  }}
                  className="w-full py-2.5 px-4 rounded-xl bg-[#9f3c16] hover:bg-[#bf542c] text-white font-semibold text-[13px] flex items-center justify-center gap-2 transition-all cursor-pointer shadow-xs"
                >
                  <span className="material-symbols-outlined text-[18px]">shopping_bag</span>
                  <span>Browse Provisions &amp; Shop</span>
                </button>
              </div>
            )}

            {/* Logout Button */}
            <div className="pt-3 border-t border-[#efe6e3] flex items-center justify-between">
              <span className="text-[12px] text-[#8a726a]">Authenticated via Supabase</span>
              <button
                onClick={handleSignOutClick}
                className="text-[12px] text-[#ba1a1a] hover:underline font-semibold cursor-pointer flex items-center gap-1"
              >
                <span className="material-symbols-outlined text-[16px]">logout</span>
                <span>Sign Out</span>
              </button>
            </div>
          </div>
        ) : (
          /* LOGGED OUT / AUTH FORM */
          <div>
            {/* Mode Toggle: Sign In vs Sign Up */}
            <div className="flex border-b border-[#efe6e3] mb-5">
              <button
                type="button"
                onClick={() => {
                  setAuthMode('signin');
                  setErrorMessage('');
                  setSuccessMessage('');
                }}
                className={`flex-1 pb-2.5 text-[14px] font-semibold transition-colors border-b-2 cursor-pointer ${
                  authMode === 'signin'
                    ? 'border-[#9f3c16] text-[#9f3c16]'
                    : 'border-transparent text-[#57423b] hover:text-[#1e1b19]'
                }`}
              >
                Sign In
              </button>
              <button
                type="button"
                onClick={() => {
                  setAuthMode('signup');
                  setErrorMessage('');
                  setSuccessMessage('');
                }}
                className={`flex-1 pb-2.5 text-[14px] font-semibold transition-colors border-b-2 cursor-pointer ${
                  authMode === 'signup'
                    ? 'border-[#9f3c16] text-[#9f3c16]'
                    : 'border-transparent text-[#57423b] hover:text-[#1e1b19]'
                }`}
              >
                Create Account
              </button>
            </div>

            {/* Owner Email Hint / Quick Fill */}
            {authMode === 'signin' && (
              <div className="mb-4 p-3 bg-[#fbf2ee] rounded-xl border border-[#efe6e3] flex items-center justify-between text-xs">
                <div className="flex items-center gap-2 text-[#57423b]">
                  <span className="material-symbols-outlined text-[18px] text-[#9f3c16]">badge</span>
                  <span>Store Owner: <strong>{OWNER_EMAIL}</strong></span>
                </div>
                <button
                  type="button"
                  onClick={handleFillOwnerEmail}
                  className="text-[11px] font-semibold text-[#9f3c16] hover:underline cursor-pointer"
                >
                  Fill Email
                </button>
              </div>
            )}

            {/* Error Message Banner */}
            {errorMessage && (
              <div className="p-3 mb-4 rounded-xl bg-red-50 border border-red-200 text-red-800 text-[12px] flex items-start gap-2">
                <span className="material-symbols-outlined text-[16px] shrink-0 mt-0.5">error</span>
                <span>{errorMessage}</span>
              </div>
            )}

            {/* Success Message Banner */}
            {successMessage && (
              <div className="p-3 mb-4 rounded-xl bg-emerald-50 border border-emerald-200 text-emerald-800 text-[12px] flex items-start gap-2">
                <span className="material-symbols-outlined text-[16px] shrink-0 mt-0.5">check_circle</span>
                <span>{successMessage}</span>
              </div>
            )}

            {/* Auth Form */}
            <form onSubmit={handleAuthSubmit} className="space-y-3.5">
              {authMode === 'signup' && (
                <div>
                  <label className="block text-[12px] font-semibold text-[#57423b] mb-1 font-sans">
                    Full Name
                  </label>
                  <input
                    type="text"
                    required
                    placeholder="e.g. Ananya Mehta"
                    value={fullNameInput}
                    onChange={(e) => setFullNameInput(e.target.value)}
                    className="w-full px-3.5 py-2.5 bg-[#fbf2ee] rounded-xl text-[13px] text-[#1e1b19] border border-[#efe6e3] focus:border-[#9f3c16] focus:bg-white outline-none transition-colors"
                  />
                </div>
              )}

              <div>
                <label className="block text-[12px] font-semibold text-[#57423b] mb-1 font-sans">
                  Email Address
                </label>
                <input
                  type="email"
                  required
                  placeholder="your.email@example.com"
                  value={emailInput}
                  onChange={(e) => setEmailInput(e.target.value)}
                  className="w-full px-3.5 py-2.5 bg-[#fbf2ee] rounded-xl text-[13px] text-[#1e1b19] border border-[#efe6e3] focus:border-[#9f3c16] focus:bg-white outline-none transition-colors"
                />
              </div>

              <div>
                <label className="block text-[12px] font-semibold text-[#57423b] mb-1 font-sans">
                  Password
                </label>
                <input
                  type="password"
                  required
                  minLength={6}
                  placeholder="Enter your password"
                  value={passwordInput}
                  onChange={(e) => setPasswordInput(e.target.value)}
                  className="w-full px-3.5 py-2.5 bg-[#fbf2ee] rounded-xl text-[13px] text-[#1e1b19] border border-[#efe6e3] focus:border-[#9f3c16] focus:bg-white outline-none transition-colors"
                />
              </div>

              <button
                type="submit"
                disabled={loading}
                className="w-full mt-2 py-3 px-4 rounded-xl bg-[#9f3c16] hover:bg-[#bf542c] disabled:opacity-70 text-white font-semibold text-[14px] flex items-center justify-center gap-2 shadow-sm transition-all cursor-pointer active:scale-98"
              >
                {loading ? (
                  <span className="inline-block w-4 h-4 border-2 border-white border-t-transparent rounded-full animate-spin" />
                ) : (
                  <span className="material-symbols-outlined text-[18px]">
                    {authMode === 'signin' ? 'login' : 'person_add'}
                  </span>
                )}
                <span>
                  {loading
                    ? 'Authenticating with Supabase...'
                    : authMode === 'signin'
                    ? 'Sign In'
                    : 'Create Customer Account'}
                </span>
              </button>
            </form>
          </div>
        )}
      </div>
    </div>
  );
};
