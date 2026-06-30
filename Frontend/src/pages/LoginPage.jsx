import React, { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { useAuth } from '../hooks/useAuth';
import InputField from '../components/InputField';
import Button from '../components/Button';

export default function LoginPage() {
  const [username, setUsername] = useState('');
  const [password, setPassword] = useState('');
  const [fieldErrors, setFieldErrors] = useState({});
  const { login, error, loading, clearError } = useAuth();
  const navigate = useNavigate();

  const validate = () => {
    const errors = {};
    if (!username.trim()) errors.username = 'Username is required';
    if (!password) errors.password = 'Password is required';
    setFieldErrors(errors);
    return Object.keys(errors).length === 0;
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    clearError();
    if (!validate()) return;
    try { await login(username, password); navigate('/dashboard'); } catch {}
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
          <h1 className="text-2xl font-display text-champagne uppercase tracking-wide mb-2">Welcome Back</h1>
          <p className="text-xs font-body uppercase tracking-widest text-pewter">Sign in to continue</p>
        </div>

        <div className="bg-charcoal border border-gold/30 corner-decor p-6 sm:p-8">
          <form onSubmit={handleSubmit} noValidate className="space-y-5">
            <InputField id="username" label="Username" type="text" placeholder="Enter your username"
              value={username} onChange={(e) => { setUsername(e.target.value); setFieldErrors(p => ({ ...p, username: '' })); }}
              error={fieldErrors.username} disabled={loading} required />
            <InputField id="password" label="Password" type="password" placeholder="Enter your password"
              value={password} onChange={(e) => { setPassword(e.target.value); setFieldErrors(p => ({ ...p, password: '' })); }}
              error={fieldErrors.password} disabled={loading} required />
            {error && (
              <div className="p-3 border border-red-500/30 bg-red-500/5 flex items-center gap-2" role="alert">
                <svg className="w-4 h-4 text-red-400 flex-shrink-0" fill="currentColor" viewBox="0 0 20 20">
                  <path fillRule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zM8.707 7.293a1 1 0 00-1.414 1.414L8.586 10l-1.293 1.293a1 1 0 101.414 1.414L10 11.414l1.293 1.293a1 1 0 001.414-1.414L11.414 10l1.293-1.293a1 1 0 00-1.414-1.414L10 8.586 8.707 7.293z" clipRule="evenodd" />
                </svg>
                <p className="text-sm font-body text-red-400">{error}</p>
              </div>
            )}
            <Button type="submit" variant="solid" size="lg" className="w-full" loading={loading} disabled={loading}>Sign In</Button>
          </form>
        </div>

        <p className="text-center text-xs font-body uppercase tracking-widest text-pewter mt-8">
          Don't have an account?{' '}
          <Link to="/register" className="font-semibold text-gold hover:text-gold-light transition-colors duration-300">Create One</Link>
        </p>
      </div>
    </div>
  );
}
