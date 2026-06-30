import React from 'react';

export default function InputField({ label, id, type = 'text', placeholder, value, onChange, error, disabled = false, required = false, className = '', ...props }) {
  return (
    <div className={`space-y-1.5 ${className}`}>
      {label && (
        <label htmlFor={id} className="block text-xs font-body font-semibold uppercase tracking-widest text-gold">
          {label}{required && <span className="text-gold-light ml-0.5">*</span>}
        </label>
      )}
      <input
        type={type} id={id} value={value} onChange={onChange} disabled={disabled}
        placeholder={placeholder}
        className={`w-full h-12 bg-transparent border-0 border-b-2 px-1 py-2 text-champagne placeholder:text-pewter font-body text-base transition-all duration-300 focus:outline-none focus:border-gold-light focus:shadow-[0_4px_10px_rgba(212,175,55,0.2)] disabled:opacity-30 disabled:cursor-not-allowed ${
          error ? 'border-red-500/60 focus:border-red-400' : 'border-gold/30'
        }`}
        {...props}
      />
      {error && <p className="text-xs text-red-400 font-body flex items-center gap-1.5" role="alert">{error}</p>}
    </div>
  );
}
