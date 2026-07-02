import React, { useState } from 'react';
import { Link, useNavigate, useParams } from 'react-router-dom';
import { toast } from 'react-toastify';
import api from '../api/axios';
import InputField from '../components/InputField';
import Button from '../components/Button';

export default function ResetPasswordPage() {
  const { token } = useParams();
  const navigate = useNavigate();

  const [newPassword, setNewPassword] = useState('');
  const [confirmPassword, setConfirmPassword] = useState('');
  const [fieldErrors, setFieldErrors] = useState({});
  const [apiError, setApiError] = useState('');
  const [loading, setLoading] = useState(false);
  const [resetSuccess, setResetSuccess] = useState(false);

  const validate = () => {
    const errors = {};
    if (!newPassword) errors.newPassword = 'New password is required';
    else if (newPassword.length < 6) errors.newPassword = 'Password must be at least 6 characters';
    if (!confirmPassword) errors.confirmPassword = 'Please confirm your new password';
    else if (newPassword !== confirmPassword) errors.confirmPassword = 'Passwords do not match';
    setFieldErrors(errors);
    return Object.keys(errors).length === 0;
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setApiError('');
    if (!token) {
      setApiError('Invalid reset link. Please request a new password reset.');
      return;
    }
    if (!validate()) return;

    setLoading(true);
    try {
      const response = await api.post(`/auth/reset-password/${token}`, { newPassword });
      setResetSuccess(true);
      toast.success(response?.data?.message || 'Password reset successfully');
    } catch (err) {
      const msg = err.response?.data?.message || 'Reset link is invalid or has expired.';
      setApiError(msg);
      toast.error(msg);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen flex items-center justify-center bg-obsidian px-4 relative">
      <div className="absolute inset-0 sunburst pointer-events-none opacity-40" />
      <div className="absolute inset-0 crosshatch-bg pointer-events-none opacity-40" />
      <div className="relative w-full max-w-sm animate-fade-up">
        <div className="text-center mb-10">
          <Link to="/" className="inline-flex items-center gap-2.5 mb-8">
            <div className="w-8 h-8 border-2 border-gold flex items-center justify-center">
              <svg className="w-4 h-4 text-gold" fill="none" stroke="currentColor" viewBox="0 0 24 24" strokeWidth={2.2}>
                <path strokeLinecap="round" strokeLinejoin="round" d="M13 10V3L4 14h7v7l9-11h-7z" />
              </svg>
            </div>
            <span className="text-lg font-display text-gold uppercase tracking-widest">CaptionGen</span>
          </Link>
          <h1 className="text-2xl font-display text-champagne uppercase tracking-wide mb-2">Set New Password</h1>
          <p className="text-xs font-body uppercase tracking-widest text-pewter">Choose a strong password</p>
        </div>

        <div className="bg-charcoal border border-gold/30 corner-decor p-6 sm:p-8">
          {!resetSuccess ? (
            <>
              {!token && (
                <div className="mb-5 p-3 border border-red-500/30 bg-red-500/5 flex items-center gap-2" role="alert">
                  <svg className="w-4 h-4 text-red-400 flex-shrink-0" fill="currentColor" viewBox="0 0 20 20">
                    <path fillRule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zM8.707 7.293a1 1 0 00-1.414 1.414L8.586 10l-1.293 1.293a1 1 0 101.414 1.414L10 11.414l1.293 1.293a1 1 0 001.414-1.414L11.414 10l1.293-1.293a1 1 0 00-1.414-1.414L10 8.586 8.707 7.293z" clipRule="evenodd" />
                  </svg>
                  <p className="text-sm font-body text-red-400">Invalid reset link</p>
                </div>
              )}
              <form onSubmit={handleSubmit} noValidate className="space-y-5">
                <InputField
                  id="newPassword"
                  label="New Password"
                  type="password"
                  placeholder="Enter a new password"
                  value={newPassword}
                  onChange={(e) => { setNewPassword(e.target.value); setFieldErrors(p => ({ ...p, newPassword: '' })); setApiError(''); }}
                  error={fieldErrors.newPassword}
                  disabled={loading}
                  required
                  autoComplete="new-password"
                />
                <InputField
                  id="confirmPassword"
                  label="Confirm New Password"
                  type="password"
                  placeholder="Confirm your new password"
                  value={confirmPassword}
                  onChange={(e) => { setConfirmPassword(e.target.value); setFieldErrors(p => ({ ...p, confirmPassword: '' })); setApiError(''); }}
                  error={fieldErrors.confirmPassword}
                  disabled={loading}
                  required
                  autoComplete="new-password"
                />
                {apiError && (
                  <div className="p-3 border border-red-500/30 bg-red-500/5 flex items-start gap-2" role="alert">
                    <svg className="w-4 h-4 text-red-400 flex-shrink-0 mt-0.5" fill="currentColor" viewBox="0 0 20 20">
                      <path fillRule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zM8.707 7.293a1 1 0 00-1.414 1.414L8.586 10l-1.293 1.293a1 1 0 101.414 1.414L10 11.414l1.293 1.293a1 1 0 001.414-1.414L11.414 10l1.293-1.293a1 1 0 00-1.414-1.414L10 8.586 8.707 7.293z" clipRule="evenodd" />
                    </svg>
                    <div className="space-y-1">
                      <p className="text-sm font-body text-red-400">{apiError}</p>
                      <Link to="/forgot-password" className="text-xs font-body text-gold hover:text-gold-light uppercase tracking-widest transition-colors duration-300">
                        Request a new link
                      </Link>
                    </div>
                  </div>
                )}
                <Button type="submit" variant="solid" size="lg" className="w-full" loading={loading} disabled={loading || !token}>
                  Reset Password
                </Button>
              </form>
            </>
          ) : (
            <div className="space-y-5">
              <div className="p-4 border border-gold/30 bg-gold/5 flex items-start gap-3" role="status">
                <svg className="w-5 h-5 text-gold flex-shrink-0 mt-0.5" fill="none" stroke="currentColor" viewBox="0 0 24 24" strokeWidth={2}>
                  <path strokeLinecap="round" strokeLinejoin="round" d="M9 12.75 11.25 15 15 9.75M21 12a9 9 0 1 1-18 0 9 9 0 0 1 18 0Z" />
                </svg>
                <div className="space-y-1">
                  <p className="text-sm font-body text-gold font-semibold uppercase tracking-widest">Password Reset</p>
                  <p className="text-sm font-body text-champagne/80 leading-relaxed">
                    Your password has been updated. You can now sign in with your new credentials.
                  </p>
                </div>
              </div>
              <Button type="button" variant="solid" size="lg" className="w-full" onClick={() => navigate('/login')}>
                Back to Sign In
              </Button>
            </div>
          )}
        </div>

        <p className="text-center text-xs font-body uppercase tracking-widest text-pewter mt-8">
          Need a new link?{' '}
          <Link to="/forgot-password" className="font-semibold text-gold hover:text-gold-light transition-colors duration-300">Request Again</Link>
        </p>
      </div>
    </div>
  );
}
