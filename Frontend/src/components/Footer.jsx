import React from 'react';
import { Link } from 'react-router-dom';

export default function Footer() {
  return (
    <footer className="border-t border-gold/20 bg-obsidian">
      <div className="max-w-6xl mx-auto px-5 sm:px-8 py-8">
        <div className="flex flex-col sm:flex-row items-center justify-between gap-4">
          <div className="flex items-center gap-2">
            <div className="w-6 h-6 border-2 border-gold/60 flex items-center justify-center">
              <svg className="w-3.5 h-3.5 text-gold" fill="none" stroke="currentColor" viewBox="0 0 24 24" strokeWidth={2.2}>
                <path strokeLinecap="round" strokeLinejoin="round" d="M13 10V3L4 14h7v7l9-11h-7z" />
              </svg>
            </div>
            <span className="text-sm font-display text-gold uppercase tracking-widest">CaptionGen</span>
          </div>
          <p className="text-xs font-body text-pewter uppercase tracking-widest">&copy; MMXXVI CaptionGen. All rights reserved.</p>
        </div>
      </div>
    </footer>
  );
}
