import React from 'react';

export default function Button({ children, variant = 'default', size = 'md', disabled = false, loading = false, type = 'button', onClick, className = '', ...props }) {
  const base = 'inline-flex items-center justify-center font-body font-semibold uppercase tracking-widest border-2 border-gold transition-all duration-500 focus-visible:ring-2 focus-visible:ring-gold focus-visible:ring-offset-2 focus-visible:ring-offset-obsidian disabled:opacity-30 disabled:cursor-not-allowed';

  const variants = {
    default: 'bg-transparent text-gold hover:bg-gold hover:text-obsidian hover:shadow-[0_0_20px_rgba(212,175,55,0.4)]',
    solid: 'bg-gold text-obsidian hover:bg-gold-light',
    outline: 'border border-gold/40 bg-transparent text-gold hover:bg-midnight hover:border-midnight',
    ghost: 'bg-transparent text-pewter hover:text-champagne',
  };

  const sizes = { sm: 'h-10 px-4 text-xs', md: 'h-12 px-6 text-xs', lg: 'h-14 px-8 text-sm' };

  return (
    <button type={type} onClick={onClick} disabled={disabled || loading} className={`${base} ${variants[variant]} ${sizes[size]} ${className}`} {...props}>
      {loading && (
        <svg className="animate-spin -ml-1 mr-2 h-4 w-4 text-current" fill="none" viewBox="0 0 24 24">
          <circle className="opacity-20" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="3" fill="none" />
          <path className="opacity-70" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z" />
        </svg>
      )}
      {children}
    </button>
  );
}
