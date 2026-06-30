import React from 'react';

export default function Card({ children, className = '', padding = 'normal', hover = true }) {
  const paddings = { none: '', small: 'p-4', normal: 'p-6 sm:p-8', large: 'p-8 sm:p-10' };
  return (
    <div className={`bg-charcoal border border-gold/30 corner-decor transition-all duration-500 ${
      hover ? 'hover:border-gold hover:-translate-y-2 hover:shadow-[0_0_15px_rgba(212,175,55,0.2)]' : ''
    } ${paddings[padding]} ${className}`}>
      {children}
    </div>
  );
}
