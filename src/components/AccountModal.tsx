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
import { MOCK_CUSTOMER, MOCK_OWNER } from '../data/mockOrders';

interface AccountModalProps {
  isOpen: boolean;
  onClose: () => void;
  currentUser: UserProfile;
  isLoggedIn: boolean;
  onLogin: (role: UserRole, profile?: UserProfile) => void;
  onLogout: () => void;
  onSwitchRole: (role: UserRole) => void;
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
  onSwitchRole,
  onNavigateToShop,
  onNavigateToDashboard,
}) => {
  // Auth Form State: 'signin' | 'signup'
  const [authMode, setAuthMode] = useState<'signin' | 'signup'>('signin');
  const [targetRole, setTargetRole] = useState<UserRole>('customer');

  const [fullNameInput, setFullNameInput] = useState('');
  const [emailInput, setEmailInput] = useState('harsh01.shrivastava@gmail.com');
  const [passwordInput, setPasswordInput] = useState('pantry2026');

  const [loading, setLoading] = useState(false);
  const [errorMessage, setErrorMessage] = useState('');
  const [successMessage, setSuccessMessage] = useState('');

  if (!isOpen) return null;

  const handleRoleQuickSelect = (role: UserRole) => {
    setTargetRole(role);
    setErrorMessage('');
    setSuccessMessage('');
    if (role === 'owner') {
      setEmailInput(OWNER_EMAIL || 'owner@thelocalpantry.in');
      setPasswordInput('pantry2026');
      setFullNameInput('Chef Ramesh Joshi');
    } else {
      setEmailInput('harsh01.shrivastava@gmail.com');
      setPasswordInput('pantry2026');
      setFullNameInput('Harsh Shrivastava');
    }
  };

  const handleAuthSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setErrorMessage('');
    setSuccessMessage('');
    setLoading(true);

    try {
      // If real Supabase credentials are configured in .env:
      if (isSupabaseConfigured) {
        if (authMode === 'signup') {
          const { data, error } = await signUpUser({
            email: emailInput.trim(),
            password: passwordInput,
            fullName: fullNameInput.trim() || (targetRole === 'owner' ? 'Chef Ramesh Joshi' : 'Pantry Patron'),
            role: targetRole,
          });

          if (error) {
            setErrorMessage(error.message);
            setLoading(false);
            return;
          }

          if (data?.user) {
            const profile = mapSupabaseUserToProfile(data.user);
            // If email confirmation is required by Supabase, user may not have an active session yet
            if (data.session) {
              setSuccessMessage('Account created and signed in successfully!');
              onLogin(profile.role, profile);
              setTimeout(() => onClose(), 800);
            } else {
              setSuccessMessage('Account created! Please check your email to confirm registration, or disable email confirmation in your Supabase project settings.');
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
            setSuccessMessage(`Welcome back, ${profile.name}!`);
            onLogin(profile.role, profile);
            setTimeout(() => onClose(), 600);
          }
        }
      } else {
        // Fallback / Demo mode when .env placeholders are active
        const simulatedProfile: UserProfile =
          targetRole === 'owner'
            ? {
                ...MOCK_OWNER,
                email: emailInput.trim() || MOCK_OWNER.email,
                name: fullNameInput.trim() || MOCK_OWNER.name,
              }
            : {
                ...MOCK_CUSTOMER,
                email: emailInput.trim() || MOCK_CUSTOMER.email,
                name: fullNameInput.trim() || MOCK_CUSTOMER.name,
              };

        onLogin(targetRole, simulatedProfile);
        setSuccessMessage(`Signed in as ${targetRole === 'owner' ? 'Store Owner' : 'Customer'} (Demo Mode)`);
        setTimeout(() => onClose(), 500);
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
            <span>Supabase Authentication</span>
          </div>
          <h2 className="font-serif text-[24px] sm:text-[26px] text-[#1e1b19] font-normal">
            {isLoggedIn ? 'Account & Session Center' : authMode === 'signin' ? 'Sign In to Your Account' : 'Create a New Account'}
          </h2>
        </div>

        {/* Supabase Status Pill */}
        <div className="mb-5 flex items-center justify-between px-3 py-1.5 rounded-lg bg-[#fbf2ee] border border-[#efe6e3] text-[11px]">
          <div className="flex items-center gap-1.5 text-[#57423b]">
            <span className={`w-2 h-2 rounded-full ${isSupabaseConfigured ? 'bg-emerald-500 animate-pulse' : 'bg-amber-500'}`} />
            <span>
              {isSupabaseConfigured ? 'Supabase Live Connection Active' : 'Demo Mode (Placeholders in .env)'}
            </span>
          </div>
          <span className="text-[10px] text-[#8a726a] font-mono">
            {isSupabaseConfigured ? 'Live Auth' : 'Local Auth'}
          </span>
        </div>

        {isLoggedIn ? (
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
                      {currentUser.role === 'owner' ? 'Store Owner' : 'Customer'}
                    </span>
                  </div>
                  <span className="text-[12px] text-[#57423b] block mt-0.5 font-mono">
                    {currentUser.email}
                  </span>
                </div>
              </div>
            </div>

            {/* Role Specific Actions */}
            {currentUser.role === 'owner' ? (
              <div className="space-y-3">
                <button
                  onClick={() => {
                    onClose();
                    onNavigateToDashboard();
                  }}
                  className="w-full py-3 px-4 rounded-xl bg-[#9f3c16] hover:bg-[#bf542c] text-white font-semibold text-[14px] flex items-center justify-center gap-2 shadow-sm transition-all cursor-pointer active:scale-98"
                >
                  <span className="material-symbols-outlined text-[20px]">dashboard</span>
                  <span>Open Owner Dashboard</span>
                </button>

                <button
                  onClick={() => onSwitchRole('customer')}
                  className="w-full py-2.5 px-4 rounded-xl bg-[#efe6e3] hover:bg-[#e9e1dd] text-[#1e1b19] font-semibold text-[13px] flex items-center justify-center gap-2 transition-all cursor-pointer"
                >
                  <span className="material-symbols-outlined text-[18px]">swap_horiz</span>
                  <span>Switch to Customer Profile</span>
                </button>
              </div>
            ) : (
              <div className="space-y-3">
                <div className="p-3.5 bg-white border border-[#efe6e3] rounded-xl text-[12px] space-y-1 shadow-xs">
                  <div className="font-semibold text-[#1e1b19]">Dispatch Address:</div>
                  <div className="text-[#57423b]">{currentUser.address}, {currentUser.city}</div>
                </div>

                <button
                  onClick={() => {
                    onClose();
                    onNavigateToShop();
                  }}
                  className="w-full py-2.5 px-4 rounded-xl bg-[#516444] hover:bg-[#435338] text-white font-semibold text-[13px] flex items-center justify-center gap-2 transition-all cursor-pointer shadow-xs"
                >
                  <span className="material-symbols-outlined text-[18px]">shopping_bag</span>
                  <span>Browse Provisions &amp; Shop</span>
                </button>

                <button
                  onClick={() => onSwitchRole('owner')}
                  className="w-full py-2.5 px-4 rounded-xl bg-[#9f3c16] hover:bg-[#bf542c] text-white font-semibold text-[13px] flex items-center justify-center gap-2 transition-all cursor-pointer shadow-xs"
                >
                  <span className="material-symbols-outlined text-[18px]">admin_panel_settings</span>
                  <span>Switch to Store Owner View</span>
                </button>
              </div>
            )}

            {/* Logout Button */}
            <div className="pt-3 border-t border-[#efe6e3] flex items-center justify-between">
              <span className="text-[12px] text-[#8a726a]">Signed in securely via Supabase</span>
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
                className={`flex-1 pb-2.5 text-[14px] font-semibold transition-colors border-b-2 ${
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
                className={`flex-1 pb-2.5 text-[14px] font-semibold transition-colors border-b-2 ${
                  authMode === 'signup'
                    ? 'border-[#9f3c16] text-[#9f3c16]'
                    : 'border-transparent text-[#57423b] hover:text-[#1e1b19]'
                }`}
              >
                Create Account (Sign Up)
              </button>
            </div>

            {/* Quick Fill Pre-sets for Instant Demo Testing */}
            <div className="mb-4">
              <div className="text-[11px] font-medium text-[#57423b] mb-1.5 flex items-center justify-between">
                <span>Quick-Fill Demo Credentials:</span>
                <span className="text-[10px] text-[#9f3c16] font-semibold">1-Click</span>
              </div>
              <div className="grid grid-cols-2 gap-2">
                <button
                  type="button"
                  onClick={() => handleRoleQuickSelect('customer')}
                  className={`py-1.5 px-2.5 rounded-lg border text-[11px] font-medium flex items-center justify-center gap-1.5 transition-colors cursor-pointer ${
                    targetRole === 'customer'
                      ? 'border-[#9f3c16] bg-[#fbf2ee] text-[#9f3c16] font-semibold'
                      : 'border-[#efe6e3] bg-white text-[#57423b] hover:bg-[#fbf2ee]'
                  }`}
                >
                  <span className="material-symbols-outlined text-[15px]">person</span>
                  <span>Customer Preset</span>
                </button>

                <button
                  type="button"
                  onClick={() => handleRoleQuickSelect('owner')}
                  className={`py-1.5 px-2.5 rounded-lg border text-[11px] font-medium flex items-center justify-center gap-1.5 transition-colors cursor-pointer ${
                    targetRole === 'owner'
                      ? 'border-[#516444] bg-[#516444]/10 text-[#516444] font-semibold'
                      : 'border-[#efe6e3] bg-white text-[#57423b] hover:bg-[#fbf2ee]'
                  }`}
                >
                  <span className="material-symbols-outlined text-[15px]">admin_panel_settings</span>
                  <span>Store Owner Preset</span>
                </button>
              </div>
            </div>

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
                  placeholder="Minimum 6 characters"
                  value={passwordInput}
                  onChange={(e) => setPasswordInput(e.target.value)}
                  className="w-full px-3.5 py-2.5 bg-[#fbf2ee] rounded-xl text-[13px] text-[#1e1b19] border border-[#efe6e3] focus:border-[#9f3c16] focus:bg-white outline-none transition-colors"
                />
              </div>

              {/* Role Selection when signing up */}
              {authMode === 'signup' && (
                <div>
                  <label className="block text-[12px] font-semibold text-[#57423b] mb-1 font-sans">
                    Register As:
                  </label>
                  <div className="grid grid-cols-2 gap-2">
                    <button
                      type="button"
                      onClick={() => setTargetRole('customer')}
                      className={`p-2 rounded-xl border text-[12px] font-medium transition-all ${
                        targetRole === 'customer'
                          ? 'border-[#9f3c16] bg-[#9f3c16]/10 text-[#9f3c16] font-semibold'
                          : 'border-[#efe6e3] text-[#57423b]'
                      }`}
                    >
                      Customer
                    </button>
                    <button
                      type="button"
                      onClick={() => setTargetRole('owner')}
                      className={`p-2 rounded-xl border text-[12px] font-medium transition-all ${
                        targetRole === 'owner'
                          ? 'border-[#516444] bg-[#516444]/10 text-[#516444] font-semibold'
                          : 'border-[#efe6e3] text-[#57423b]'
                      }`}
                    >
                      Store Owner
                    </button>
                  </div>
                </div>
              )}

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
                    ? 'Authenticating...'
                    : authMode === 'signin'
                    ? `Sign In as ${targetRole === 'owner' ? 'Store Owner' : 'Customer'}`
                    : `Create ${targetRole === 'owner' ? 'Store Owner' : 'Customer'} Account`}
                </span>
              </button>
            </form>
          </div>
        )}
      </div>
    </div>
  );
};
