import React, { useState } from 'react';
import { Link } from 'react-router-dom';
import { toast } from 'react-toastify';
import api from '../api/axios';
import InputField from '../components/InputField';
import Button from '../components/Button';

const EMAIL_REGEX = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;

export default function ForgotPasswordPage() {
  const [email, setEmail] = useState('');
  const [fieldError, setFieldError] = useState('');
  const [loading, setLoading] = useState(false);
  const [submitted, setSubmitted] = useState(false);

  const validate = () => {
    if (!email.trim()) return 'Email is required';
    if (!EMAIL_REGEX.test(email.trim())) return 'Please enter a valid email address';
    return '';
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    const err = validate();
    setFieldError(err);
    if (err) return;

    setLoading(true);
    try {
      const response = await api.post('/auth/forgotpassword', { email: email.trim() });
      setSubmitted(true);
      toast.success(response?.data?.message || 'If the email exists, a reset link has been sent.');
    } catch (err) {
      const msg = err.response?.data?.message || 'Something went wrong. Please try again.';
      setFieldError(msg);
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
          <h1 className="text-2xl font-display text-champagne uppercase tracking-wide mb-2">Reset Password</h1>
          <p className="text-xs font-body uppercase tracking-widest text-pewter">We'll send you a recovery link</p>
        </div>

        <div className="bg-charcoal border border-gold/30 corner-decor p-6 sm:p-8">
          {!submitted ? (
            <>
              <p className="text-sm font-body text-pewter mb-6 leading-relaxed">
                Enter the email address associated with your account and we'll send you a link to reset your password.
              </p>
              <form onSubmit={handleSubmit} noValidate className="space-y-5">
                <InputField
                  id="email"
                  label="Email"
                  type="email"
                  placeholder="Enter your email address"
                  value={email}
                  onChange={(e) => { setEmail(e.target.value); setFieldError(''); }}
                  error={fieldError}
                  disabled={loading}
                  required
                  autoComplete="email"
                />
                <Button type="submit" variant="solid" size="lg" className="w-full" loading={loading} disabled={loading}>
                  Send Reset Link
                </Button>
              </form>
            </>
          ) : (
            <div className="space-y-5">
              <div className="p-4 border border-gold/30 bg-gold/5 flex items-start gap-3" role="status">
                <svg className="w-5 h-5 text-gold flex-shrink-0 mt-0.5" fill="none" stroke="currentColor" viewBox="0 0 24 24" strokeWidth={1.8}>
                  <path strokeLinecap="round" strokeLinejoin="round" d="M21.75 6.75v10.5a2.25 2.25 0 0 1-2.25 2.25h-15a2.25 2.25 0 0 1-2.25-2.25V6.75m19.5 0A2.25 2.25 0 0 0 19.5 4.5h-15a2.25 2.25 0 0 0-2.25 2.25m19.5 0v.243a2.25 2.25 0 0 1-1.07 1.916l-7.5 4.615a2.25 2.25 0 0 1-2.36 0L3.32 8.91a2.25 2.25 0 0 1-1.07-1.916V6.75" />
                </svg>
                <div className="space-y-1">
                  <p className="text-sm font-body text-gold font-semibold uppercase tracking-widest">Check Your Email</p>
                  <p className="text-sm font-body text-champagne/80 leading-relaxed">
                    If an account exists for <span className="text-gold">{email}</span>, we've sent a password reset link. The link expires in 1 hour.
                  </p>
                </div>
              </div>
              <p className="text-xs font-body text-pewter text-center">
                Didn't get the email? Check your spam folder, or{' '}
                <button
                  type="button"
                  onClick={() => { setSubmitted(false); setEmail(''); }}
                  className="text-gold hover:text-gold-light transition-colors duration-300 uppercase tracking-widest font-semibold"
                >
                  Try Again
                </button>
              </p>
            </div>
          )}
        </div>

        <p className="text-center text-xs font-body uppercase tracking-widest text-pewter mt-8">
          Remembered your password?{' '}
          <Link to="/login" className="font-semibold text-gold hover:text-gold-light transition-colors duration-300">Sign In</Link>
        </p>
      </div>
    </div>
  );
}
