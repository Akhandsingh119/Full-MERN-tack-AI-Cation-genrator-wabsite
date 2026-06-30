import React, { useState } from 'react';
import { useAuth } from '../hooks/useAuth';
import NotificationBell from './NotificationBell';

export default function TopNavbar({ onSearch }) {
  const { user } = useAuth();
  const [searchVal, setSearchVal] = useState('');

  const handleChange = (e) => {
    setSearchVal(e.target.value);
    onSearch?.(e.target.value);
  };

  const initial = user?.username?.charAt(0)?.toUpperCase() || 'U';

  return (
    <header className="h-16 border-b border-gold/20 bg-charcoal/30 backdrop-blur-md flex items-center justify-between px-4 sm:px-6">
      <div className="flex-1 max-w-md">
        <div className="relative">
          <svg className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-pewter" fill="none" stroke="currentColor" viewBox="0 0 24 24" strokeWidth={1.8}>
            <path strokeLinecap="round" strokeLinejoin="round" d="m21 21-5.197-5.197m0 0A7.5 7.5 0 1 0 5.196 5.196a7.5 7.5 0 0 0 10.607 10.607Z" />
          </svg>
          <input
            type="text" value={searchVal} onChange={handleChange}
            placeholder="Search history..."
            className="w-full h-10 pl-9 pr-4 bg-transparent border-0 border-b-2 border-gold/30 text-champagne placeholder:text-pewter font-body text-sm focus:outline-none focus:border-gold-light transition-all duration-300"
          />
        </div>
      </div>

      <div className="flex items-center gap-4">
        <NotificationBell />
        <div className="w-8 h-8 border-2 border-gold/40 flex items-center justify-center text-xs font-display font-bold text-gold">
          {initial}
        </div>
      </div>
    </header>
  );
}
