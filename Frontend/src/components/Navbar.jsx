import React, { useState } from 'react';
import { Link, useLocation, useNavigate } from 'react-router-dom';
import { useAuth } from '../hooks/useAuth';
import api from '../api/axios';

export default function Navbar() {
  const { isAuthenticated, user, logout } = useAuth();
  const [mobileOpen, setMobileOpen] = useState(false);
  const location = useLocation();
  const navigate = useNavigate();

  const isActive = (path) => location.pathname === path;

  const handleLogout = () => {
    logout();
    navigate('/');
    setMobileOpen(false);
  };

  return (
    <nav className="sticky top-0 z-50 bg-obsidian/90 backdrop-blur-md border-b border-gold/20">
      <div className="max-w-6xl mx-auto px-5 sm:px-8">
        <div className="flex items-center justify-between h-16">
          <Link to="/" className="flex items-center gap-2.5 group">
            <div className="w-8 h-8 border-2 border-gold flex items-center justify-center transition-all duration-500 group-hover:shadow-[0_0_12px_rgba(212,175,55,0.4)]">
              <svg className="w-4 h-4 text-gold" fill="none" stroke="currentColor" viewBox="0 0 24 24" strokeWidth={2.2}>
                <path strokeLinecap="round" strokeLinejoin="round" d="M13 10V3L4 14h7v7l9-11h-7z" />
              </svg>
            </div>
            <span className="text-lg font-display text-gold tracking-widest uppercase">CaptionGen</span>
          </Link>

          <div className="hidden md:flex items-center gap-8">
            <Link to="/" className={`text-xs font-body font-semibold uppercase tracking-widest transition-colors duration-300 ${isActive('/') ? 'text-gold' : 'text-pewter hover:text-champagne'}`}>
              Home
            </Link>
            <div className="w-px h-4 bg-gold/20" />
            {isAuthenticated && (
              <>
                <Link to="/dashboard" className={`text-xs font-body font-semibold uppercase tracking-widest transition-colors duration-300 ${isActive('/dashboard') ? 'text-gold' : 'text-pewter hover:text-champagne'}`}>
                  New Caption
                </Link>
                <div className="w-px h-4 bg-gold/20" />
                <Link to="/history" className={`text-xs font-body font-semibold uppercase tracking-widest transition-colors duration-300 ${isActive('/history') ? 'text-gold' : 'text-pewter hover:text-champagne'}`}>
                  History
                </Link>
              </>
            )}
          </div>

          <div className="hidden md:flex items-center gap-4">
            {isAuthenticated ? (
              <div className="flex items-center gap-4">
                <div className="flex items-center gap-2">
                  <div className="w-7 h-7 border-2 border-gold/40 flex items-center justify-center text-xs font-display font-bold text-gold">
                    {user?.username?.charAt(0)?.toUpperCase() || 'U'}
                  </div>
                  <span className="text-xs font-body uppercase tracking-widest text-champagne/70">{user?.username}</span>
                </div>
                <div className="w-px h-4 bg-gold/20" />
                <button
                  onClick={handleLogout}
                  className="text-xs font-body font-semibold uppercase tracking-widest text-pewter hover:text-red-400 transition-colors duration-300"
                >
                  Sign Out
                </button>
              </div>
            ) : (
              <div className="flex items-center gap-3">
                <Link to="/login" className="text-xs font-body font-semibold uppercase tracking-widest text-pewter hover:text-champagne transition-colors duration-300 px-3 py-1.5">
                  Sign In
                </Link>
                <Link to="/register" className="text-xs font-body font-semibold uppercase tracking-widest border-2 border-gold bg-transparent text-gold hover:bg-gold hover:text-obsidian px-4 py-2 transition-all duration-500 hover:shadow-[0_0_15px_rgba(212,175,55,0.3)]">
                  Get Started
                </Link>
              </div>
            )}
          </div>

          <button
            onClick={() => setMobileOpen(!mobileOpen)}
            className="md:hidden p-2 -mr-2 text-pewter hover:text-gold transition-colors duration-300"
            aria-label="Toggle menu"
          >
            <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24" strokeWidth={1.8}>
              {mobileOpen ? (
                <path strokeLinecap="round" strokeLinejoin="round" d="M6 18L18 6M6 6l12 12" />
              ) : (
                <path strokeLinecap="round" strokeLinejoin="round" d="M4 6h16M4 12h16M4 18h16" />
              )}
            </svg>
          </button>
        </div>

        {mobileOpen && (
          <div className="md:hidden py-4 border-t border-gold/20 animate-fade-in">
            <div className="flex flex-col gap-1">
              <Link to="/" onClick={() => setMobileOpen(false)} className={`text-xs font-body font-semibold uppercase tracking-widest px-3 py-2.5 transition-colors duration-300 ${isActive('/') ? 'text-gold' : 'text-pewter hover:text-champagne'}`}>
                Home
              </Link>
              {isAuthenticated && (
                <>
                  <Link to="/dashboard" onClick={() => setMobileOpen(false)} className={`text-xs font-body font-semibold uppercase tracking-widest px-3 py-2.5 transition-colors duration-300 ${isActive('/dashboard') ? 'text-gold' : 'text-pewter hover:text-champagne'}`}>
                    New Caption
                  </Link>
                  <Link to="/history" onClick={() => setMobileOpen(false)} className={`text-xs font-body font-semibold uppercase tracking-widest px-3 py-2.5 transition-colors duration-300 ${isActive('/history') ? 'text-gold' : 'text-pewter hover:text-champagne'}`}>
                    History
                  </Link>
                </>
              )}
              <div className="h-px bg-gold/20 my-2" />
              {isAuthenticated ? (
                <button onClick={handleLogout} className="text-left text-xs font-body font-semibold uppercase tracking-widest text-pewter hover:text-red-400 px-3 py-2.5 transition-colors duration-300">
                  Sign Out
                </button>
              ) : (
                <>
                  <Link to="/login" onClick={() => setMobileOpen(false)} className="text-xs font-body font-semibold uppercase tracking-widest text-pewter hover:text-champagne px-3 py-2.5 transition-colors duration-300">
                    Sign In
                  </Link>
                  <Link to="/register" onClick={() => setMobileOpen(false)} className="text-xs font-body font-semibold uppercase tracking-widest border-2 border-gold text-gold hover:bg-gold hover:text-obsidian px-3 py-2.5 text-center mt-1 transition-all duration-500">
                    Get Started
                  </Link>
                </>
              )}
            </div>
          </div>
        )}
      </div>
    </nav>
  );
}
