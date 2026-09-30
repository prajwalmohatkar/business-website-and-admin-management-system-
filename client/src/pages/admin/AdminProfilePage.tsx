import React, { useState } from 'react';
import { User, Lock, CheckCircle, Shield, Key } from 'lucide-react';
import { useAuth } from '../../context/AuthContext';
import { authService } from '../../services/authService';
import { SEOHead } from '../../components/seo/SEOHead';
import { formatDate } from '../../utils/formatters';

export const AdminProfilePage: React.FC = () => {
  const { admin } = useAuth();

  const [currentPassword, setCurrentPassword] = useState('');
  const [newPassword, setNewPassword] = useState('');
  const [confirmPassword, setConfirmPassword] = useState('');

  const [isUpdating, setIsUpdating] = useState(false);
  const [successMessage, setSuccessMessage] = useState('');
  const [errorMessage, setErrorMessage] = useState('');

  const handlePasswordChange = async (e: React.FormEvent) => {
    e.preventDefault();
    setErrorMessage('');
    setSuccessMessage('');

    if (newPassword.length < 6) {
      setErrorMessage('New password must be at least 6 characters long.');
      return;
    }

    if (newPassword !== confirmPassword) {
      setErrorMessage('New password and confirmation do not match.');
      return;
    }

    try {
      setIsUpdating(true);
      await authService.changePassword(currentPassword, newPassword);
      setSuccessMessage('Administrator password updated successfully.');
      setCurrentPassword('');
      setNewPassword('');
      setConfirmPassword('');
      setTimeout(() => setSuccessMessage(''), 4000);
    } catch (err: any) {
      setErrorMessage(err.message || 'Failed to update password.');
    } finally {
      setIsUpdating(false);
    }
  };

  return (
    <>
      <SEOHead title="Admin Profile & Security" noIndex={true} />

      <div className="max-w-3xl mx-auto space-y-6 pb-16">
        <div>
          <h1 className="text-2xl font-black text-slate-900 tracking-tight">
            Administrator Profile & Security
          </h1>
          <p className="text-xs sm:text-sm text-slate-500 mt-1">
            Manage your account credentials, security preferences, and login password.
          </p>
        </div>

        {/* Profile Card */}
        <div className="bg-white p-6 sm:p-8 rounded-2xl border border-slate-200 shadow-sm space-y-6">
          <div className="flex items-center space-x-4 pb-6 border-b border-slate-100">
            <div className="w-16 h-16 rounded-2xl bg-brand-600 text-white font-extrabold text-2xl flex items-center justify-center shadow-lg shadow-brand-500/20">
              {admin?.username?.charAt(0).toUpperCase() || 'A'}
            </div>
            <div>
              <div className="flex items-center space-x-2">
                <h2 className="text-lg font-bold text-slate-900">{admin?.username}</h2>
                <span className="px-2.5 py-0.5 bg-brand-50 text-brand-700 border border-brand-200 text-[10px] font-bold uppercase rounded-full">
                  {admin?.role || 'Administrator'}
                </span>
              </div>
              <p className="text-xs text-slate-500 mt-0.5">{admin?.email}</p>
              {admin?.lastLogin && (
                <p className="text-[11px] text-slate-400 mt-1">
                  Last login: {formatDate(admin.lastLogin)}
                </p>
              )}
            </div>
          </div>

          {/* Change Password Form */}
          <div>
            <div className="flex items-center space-x-2 mb-4">
              <Key className="w-4 h-4 text-brand-600" />
              <h3 className="text-sm font-bold text-slate-900">Change Password</h3>
            </div>

            {successMessage && (
              <div className="mb-4 p-3 bg-emerald-50 border border-emerald-200 text-emerald-700 text-xs rounded-xl font-semibold flex items-center space-x-2">
                <CheckCircle className="w-4 h-4 text-emerald-500 flex-shrink-0" />
                <span>{successMessage}</span>
              </div>
            )}

            {errorMessage && (
              <div className="mb-4 p-3 bg-rose-50 border border-rose-200 text-rose-700 text-xs rounded-xl font-semibold">
                {errorMessage}
              </div>
            )}

            <form onSubmit={handlePasswordChange} className="space-y-4 max-w-md">
              <div>
                <label className="block text-xs font-bold uppercase tracking-wider text-slate-700 mb-1">
                  Current Password
                </label>
                <input
                  type="password"
                  required
                  value={currentPassword}
                  onChange={(e) => setCurrentPassword(e.target.value)}
                  className="w-full px-3.5 py-2.5 bg-slate-50 border border-slate-200 rounded-xl text-xs font-semibold focus:outline-none focus:ring-2 focus:ring-brand-500 focus:bg-white"
                />
              </div>

              <div>
                <label className="block text-xs font-bold uppercase tracking-wider text-slate-700 mb-1">
                  New Password (min 6 characters)
                </label>
                <input
                  type="password"
                  required
                  value={newPassword}
                  onChange={(e) => setNewPassword(e.target.value)}
                  className="w-full px-3.5 py-2.5 bg-slate-50 border border-slate-200 rounded-xl text-xs font-semibold focus:outline-none focus:ring-2 focus:ring-brand-500 focus:bg-white"
                />
              </div>

              <div>
                <label className="block text-xs font-bold uppercase tracking-wider text-slate-700 mb-1">
                  Confirm New Password
                </label>
                <input
                  type="password"
                  required
                  value={confirmPassword}
                  onChange={(e) => setConfirmPassword(e.target.value)}
                  className="w-full px-3.5 py-2.5 bg-slate-50 border border-slate-200 rounded-xl text-xs font-semibold focus:outline-none focus:ring-2 focus:ring-brand-500 focus:bg-white"
                />
              </div>

              <button
                type="submit"
                disabled={isUpdating}
                className="px-6 py-2.5 bg-brand-600 hover:bg-brand-700 text-white rounded-xl text-xs font-bold shadow-md transition-colors disabled:opacity-60"
              >
                {isUpdating ? 'Updating...' : 'Update Password'}
              </button>
            </form>
          </div>
        </div>
      </div>
    </>
  );
};
