import React, { useEffect, useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { useNotification } from '../context/NotificationContext';

function ToastItem({ toast, onRemove }) {
  const [visible, setVisible] = useState(false);

  useEffect(() => {
    const t = requestAnimationFrame(() => setVisible(true));
    return () => cancelAnimationFrame(t);
  }, []);

  const isDeleted = toast.type === 'deleted';
  const borderColor = isDeleted ? 'border-red-500/40' : 'border-gold/40';
  const accentColor = isDeleted ? 'text-red-400' : 'text-gold';
  const iconBg = isDeleted ? 'border-red-500/30 text-red-400' : 'border-gold/30 text-gold';

  return (
    <motion.div
      initial={{ x: 120, opacity: 0 }}
      animate={visible ? { x: 0, opacity: 1 } : {}}
      exit={{ x: 120, opacity: 0 }}
      transition={{ type: 'spring', stiffness: 300, damping: 28 }}
      className={`w-80 bg-charcoal border ${borderColor} shadow-[0_0_25px_rgba(0,0,0,0.6)]`}
    >
      <div className="flex items-start gap-3 p-3">
        <div className={`w-8 h-8 flex-shrink-0 flex items-center justify-center border ${iconBg} mt-0.5`}>
          {isDeleted ? (
            <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24" strokeWidth={2}>
              <path strokeLinecap="round" strokeLinejoin="round" d="M6 18 18 6M6 6l12 12" />
            </svg>
          ) : (
            <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24" strokeWidth={2.5}>
              <path strokeLinecap="round" strokeLinejoin="round" d="m4.5 12.75 6 6 9-13.5" />
            </svg>
          )}
        </div>

        <div className="flex-1 min-w-0">
          <p className={`text-[11px] font-body font-semibold uppercase tracking-widest ${accentColor} mb-0.5`}>
            {toast.message}
          </p>
          {toast.caption && (
            <p className="text-[11px] font-body text-pewter leading-relaxed line-clamp-2">
              {toast.caption}
            </p>
          )}
        </div>

        {toast.image && (
          <div className="w-10 h-10 flex-shrink-0 border border-gold/20 overflow-hidden">
            <img src={toast.image} alt="" className="w-full h-full object-cover" />
          </div>
        )}

        <button
          onClick={() => onRemove(toast.id)}
          className="flex-shrink-0 w-5 h-5 flex items-center justify-center text-pewter hover:text-champagne transition-colors duration-200"
        >
          <svg className="w-3 h-3" fill="none" stroke="currentColor" viewBox="0 0 24 24" strokeWidth={2}>
            <path strokeLinecap="round" strokeLinejoin="round" d="M6 18 18 6M6 6l12 12" />
          </svg>
        </button>
      </div>
    </motion.div>
  );
}

export default function NotificationToast() {
  const { toasts, removeToast } = useNotification();

  return (
    <div className="fixed top-4 right-4 z-[9999] flex flex-col gap-2 pointer-events-none">
      <AnimatePresence>
        {toasts.map((t) => (
          <div key={t.id} className="pointer-events-auto">
            <ToastItem toast={t} onRemove={removeToast} />
          </div>
        ))}
      </AnimatePresence>
    </div>
  );
}
