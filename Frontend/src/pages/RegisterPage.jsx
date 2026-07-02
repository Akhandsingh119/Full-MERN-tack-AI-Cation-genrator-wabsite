import React, { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { useAuth } from '../hooks/useAuth';
import InputField from '../components/InputField';
import Button from '../components/Button';

export default function RegisterPage() {
  const [username, setUsername] = useState('');
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [confirmPassword, setConfirmPassword] = useState('');
  const [fieldErrors, setFieldErrors] = useState({});
  const { register, error, loading, clearError } = useAuth();
  const navigate = useNavigate();

  const validate = () => {
    const errors = {};
    if (!username.trim()) errors.username = 'Username is required';
    else if (username.trim().length < 3) errors.username = 'Username must be at least 3 characters';
    if (!email.trim()) errors.email = 'Email is required';
    else if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email.trim())) errors.email = 'Please enter a valid email address';
    if (!password) errors.password = 'Password is required';
    else if (password.length < 6) errors.password = 'Password must be at least 6 characters';
    if (password !== confirmPassword) errors.confirmPassword = 'Passwords do not match';
    setFieldErrors(errors);
    return Object.keys(errors).length === 0;
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    clearError();
    if (!validate()) return;
    try { await register(username, email, password); navigate('/dashboard'); } catch {}
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
          <h1 className="text-2xl font-display text-champagne uppercase tracking-wide mb-2">Create Your Account</h1>
          <p className="text-xs font-body uppercase tracking-widest text-pewter">Start generating AI captions today</p>
        </div>

        <div className="bg-charcoal border border-gold/30 corner-decor p-6 sm:p-8">
          <form onSubmit={handleSubmit} noValidate className="space-y-5">
            <InputField id="username" label="Username" type="text" placeholder="Choose a username"
              value={username} onChange={(e) => { setUsername(e.target.value); setFieldErrors(p => ({ ...p, username: '' })); }}
              error={fieldErrors.username} disabled={loading} required autoComplete="username" />
            <InputField id="email" label="Email" type="email" placeholder="Enter your email address"
              value={email} onChange={(e) => { setEmail(e.target.value); setFieldErrors(p => ({ ...p, email: '' })); }}
              error={fieldErrors.email} disabled={loading} required autoComplete="email" />
            <InputField id="password" label="Password" type="password" placeholder="Create a password"
              value={password} onChange={(e) => { setPassword(e.target.value); setFieldErrors(p => ({ ...p, password: '' })); }}
              error={fieldErrors.password} disabled={loading} required autoComplete="new-password" />
            <InputField id="confirmPassword" label="Confirm Password" type="password" placeholder="Confirm your password"
              value={confirmPassword} onChange={(e) => { setConfirmPassword(e.target.value); setFieldErrors(p => ({ ...p, confirmPassword: '' })); }}
              error={fieldErrors.confirmPassword} disabled={loading} required autoComplete="new-password" />
            {error && (
              <div className="p-3 border border-red-500/30 bg-red-500/5 flex items-center gap-2" role="alert">
                <svg className="w-4 h-4 text-red-400 flex-shrink-0" fill="currentColor" viewBox="0 0 20 20">
                  <path fillRule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zM8.707 7.293a1 1 0 00-1.414 1.414L8.586 10l-1.293 1.293a1 1 0 101.414 1.414L10 11.414l1.293 1.293a1 1 0 001.414-1.414L11.414 10l1.293-1.293a1 1 0 00-1.414-1.414L10 8.586 8.707 7.293z" clipRule="evenodd" />
                </svg>
                <p className="text-sm font-body text-red-400">{error}</p>
              </div>
            )}
            <Button type="submit" variant="solid" size="lg" className="w-full" loading={loading} disabled={loading}>Create Account</Button>
          </form>
        </div>

        <p className="text-center text-xs font-body uppercase tracking-widest text-pewter mt-8">
          Already have an account?{' '}
          <Link to="/login" className="font-semibold text-gold hover:text-gold-light transition-colors duration-300">Sign In</Link>
        </p>
      </div>
    </div>
  );
}
