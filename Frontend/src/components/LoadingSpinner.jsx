import React from 'react';

export default function LoadingSpinner({ size = 'md', label }) {
  const sizes = { sm: 'h-4 w-4', md: 'h-6 w-6', lg: 'h-8 w-8' };
  return (
    <div className="flex flex-col items-center justify-center gap-4">
      <div className={`animate-spin ${sizes[size]} border-2 border-gold/30 border-t-gold`} />
      {label && <p className="text-sm font-body text-pewter uppercase tracking-widest">{label}</p>}
    </div>
  );
}
