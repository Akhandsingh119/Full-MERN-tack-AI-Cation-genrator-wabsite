import React from 'react';

export default function MobileHeader({ onMenuToggle, isMenuOpen }) {
  return (
    <header className="md:hidden fixed top-0 left-0 right-0 z-50 h-14 bg-obsidian/90 backdrop-blur-md border-b border-gold/20 flex items-center justify-between px-4">
      <div className="flex items-center gap-2.5">
        <div className="w-7 h-7 border-2 border-gold flex items-center justify-center">
          <svg className="w-3.5 h-3.5 text-gold" fill="none" stroke="currentColor" viewBox="0 0 24 24" strokeWidth={2.2}>
            <path strokeLinecap="round" strokeLinejoin="round" d="M13 10V3L4 14h7v7l9-11h-7z" />
          </svg>
        </div>
        <span className="text-sm font-display text-gold tracking-widest uppercase">CaptionGen</span>
      </div>

      <button
        onClick={onMenuToggle}
        className="p-2 text-pewter hover:text-gold transition-colors duration-300"
        aria-label={isMenuOpen ? 'Close menu' : 'Open menu'}
      >
        {isMenuOpen ? (
          <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24" strokeWidth={1.8}>
            <path strokeLinecap="round" strokeLinejoin="round" d="M6 18L18 6M6 6l12 12" />
          </svg>
        ) : (
          <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24" strokeWidth={1.8}>
            <path strokeLinecap="round" strokeLinejoin="round" d="M3.75 6.75h16.5M3.75 12h16.5m-16.5 5.25h16.5" />
          </svg>
        )}
      </button>
    </header>
  );
}
