import React, { useState, useRef, useEffect, useCallback } from 'react';
import { createPortal } from 'react-dom';
import { motion } from 'framer-motion';
import { useNotification } from '../context/NotificationContext';

function formatNotifDate(dateStr) {
  if (!dateStr) return '';
  const d = new Date(dateStr);
  const now = new Date();
  const diff = now - d;
  const mins = Math.floor(diff / 60000);
  const hours = Math.floor(diff / 3600000);
  const days = Math.floor(diff / 86400000);
  if (mins < 1) return 'Just now';
  if (mins < 60) return `${mins}m ago`;
  if (hours < 24) return `${hours}h ago`;
  if (days < 7) return `${days}d ago`;
  return d.toLocaleDateString('en-US', { month: 'short', day: 'numeric' });
}

export default function NotificationBell() {
  const { notifications, unreadCount, markAsRead, markAllAsRead } = useNotification();
  const [open, setOpen] = useState(false);
  const [animReady, setAnimReady] = useState(false);
  const [pos, setPos] = useState({ top: 0, right: 0 });
  const btnRef = useRef(null);
  const panelRef = useRef(null);

  const updatePosition = useCallback(() => {
    if (btnRef.current) {
      const rect = btnRef.current.getBoundingClientRect();
      
      // Calculate right position, ensuring at least 16px of padding from the right screen edge
      let calcRight = window.innerWidth - rect.right;
      calcRight = Math.max(16, calcRight);

      // Prevent the panel from bleeding off the left edge on very small screens
      // 360 is the max-width on desktop, calc(100vw-32px) on mobile
      const expectedWidth = window.innerWidth < 392 ? window.innerWidth - 32 : 360;
      if (window.innerWidth - calcRight < expectedWidth) {
        calcRight = 16; // Force standard margin if it would overflow left
      }

      setPos({ top: rect.bottom + 8, right: calcRight });
    }
  }, []);

  useEffect(() => {
    if (!open) { setAnimReady(false); return; }
    updatePosition();
    const raf = requestAnimationFrame(() => setAnimReady(true));
    const handleClick = (e) => {
      if (
        panelRef.current && !panelRef.current.contains(e.target) &&
        btnRef.current && !btnRef.current.contains(e.target)
      ) {
        setOpen(false);
      }
    };
    const handleEsc = (e) => { if (e.key === 'Escape') setOpen(false); };
    const handleMove = () => updatePosition();
    
    document.addEventListener('mousedown', handleClick);
    window.addEventListener('keydown', handleEsc);
    window.addEventListener('scroll', handleMove, true);
    window.addEventListener('resize', handleMove);
    
    return () => {
      cancelAnimationFrame(raf);
      document.removeEventListener('mousedown', handleClick);
      window.removeEventListener('keydown', handleEsc);
      window.removeEventListener('scroll', handleMove, true);
      window.removeEventListener('resize', handleMove);
    };
  }, [open, updatePosition]);

  return (
    <>
      <button
        ref={btnRef}
        onClick={() => { setOpen((prev) => !prev); }}
        className="relative p-1.5 text-pewter hover:text-champagne transition-colors duration-200"
        aria-label="Notifications"
      >
        <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24" strokeWidth={1.8}>
          <path strokeLinecap="round" strokeLinejoin="round" d="M14.857 17.082a23.848 23.848 0 0 0 5.454-1.31A8.967 8.967 0 0 1 18 9.75V9A6 6 0 0 0 6 9v.75a8.967 8.967 0 0 1-2.312 6.022c1.733.64 3.56 1.085 5.455 1.31m5.714 0a24.255 24.255 0 0 1-5.714 0m5.714 0a3 3 0 1 1-5.714 0" />
        </svg>
        {unreadCount > 0 && (
          <span className="absolute -top-0.5 -right-0.5 min-w-[16px] h-4 flex items-center justify-center bg-gold text-obsidian text-[9px] font-body font-bold px-1 leading-none">
            {unreadCount > 99 ? '99+' : unreadCount}
          </span>
        )}
      </button>

      {open && createPortal(
        <motion.div
          ref={panelRef}
          initial={{ opacity: 0, y: -6 }}
          animate={animReady ? { opacity: 1, y: 0 } : {}}
          transition={{ duration: 0.25, ease: 'easeInOut' }}
          style={{ position: 'fixed', top: pos.top, right: pos.right, zIndex: 999999 }}
          // CHANGED: Made width and max-height responsive for mobile
          className="w-[calc(100vw-32px)] sm:w-[360px] max-h-[85vh] sm:max-h-[480px] bg-charcoal border border-gold/30 shadow-[0_0_20px_rgba(0,0,0,0.5)] overflow-hidden flex flex-col"
        >
          <div className="flex items-center justify-between px-4 py-3 border-b border-gold/20 flex-shrink-0">
            <h3 className="text-xs font-body font-semibold uppercase tracking-widest text-champagne">Notifications</h3>
            {unreadCount > 0 && (
              <button
                onClick={markAllAsRead}
                className="text-[10px] font-body font-semibold uppercase tracking-widest text-gold hover:text-gold-light transition-colors duration-200"
              >
                Mark all read
              </button>
            )}
          </div>

          {/* CHANGED: Allowed the list to flexibly take remaining space within the new responsive constraints */}
          <div className="overflow-y-auto flex-1">
            {notifications.length === 0 ? (
              <div className="flex flex-col items-center justify-center py-12 px-4 text-center">
                <div className="w-12 h-12 border border-gold/20 flex items-center justify-center mb-3">
                  <svg className="w-5 h-5 text-pewter/40" fill="none" stroke="currentColor" viewBox="0 0 24 24" strokeWidth={1.5}>
                    <path strokeLinecap="round" strokeLinejoin="round" d="M14.857 17.082a23.848 23.848 0 0 0 5.454-1.31A8.967 8.967 0 0 1 18 9.75V9A6 6 0 0 0 6 9v.75a8.967 8.967 0 0 1-2.312 6.022c1.733.64 3.56 1.085 5.455 1.31m5.714 0a24.255 24.255 0 0 1-5.714 0m5.714 0a3 3 0 1 1-5.714 0" />
                  </svg>
                </div>
                <p className="text-xs font-body text-pewter uppercase tracking-widest">No notifications yet</p>
              </div>
            ) : (
              notifications.map((n) => (
                <button
                  key={n._id}
                  onClick={() => { if (!n.read) markAsRead(n._id); }}
                  className={`w-full text-left flex items-start gap-3 px-4 py-3 border-b border-gold/10 transition-all duration-200 hover:bg-gold/[0.03] ${
                    !n.read ? 'bg-gold/[0.02]' : ''
                  }`}
                >
                  <div className={`w-7 h-7 flex-shrink-0 flex items-center justify-center border mt-0.5 ${
                    n.type === 'deleted'
                      ? 'border-red-500/30 text-red-400'
                      : 'border-gold/30 text-gold'
                  }`}>
                    {n.type === 'deleted' ? (
                      <svg className="w-3.5 h-3.5" fill="none" stroke="currentColor" viewBox="0 0 24 24" strokeWidth={2}>
                        <path strokeLinecap="round" strokeLinejoin="round" d="M6 18 18 6M6 6l12 12" />
                      </svg>
                    ) : (
                      <svg className="w-3.5 h-3.5" fill="none" stroke="currentColor" viewBox="0 0 24 24" strokeWidth={2.5}>
                        <path strokeLinecap="round" strokeLinejoin="round" d="m4.5 12.75 6 6 9-13.5" />
                      </svg>
                    )}
                  </div>
                  <div className="flex-1 min-w-0">
                    <p className="text-[11px] font-body font-semibold uppercase tracking-widest text-champagne leading-tight">
                      {n.message}
                    </p>
                    {n.caption && (
                      <p className="text-[11px] font-body text-pewter leading-relaxed line-clamp-1 mt-0.5">
                        {n.caption}
                      </p>
                    )}
                    <p className="text-[9px] font-body text-pewter/50 mt-1">{formatNotifDate(n.createdAt)}</p>
                  </div>
                  {n.image && (
                    <div className="w-9 h-9 flex-shrink-0 border border-gold/20 overflow-hidden">
                      <img src={n.image} alt="" className="w-full h-full object-cover" />
                    </div>
                  )}
                  {!n.read && <span className="w-1.5 h-1.5 rounded-full bg-gold flex-shrink-0 mt-2" />}
                </button>
              ))
            )}
          </div>
        </motion.div>,
        document.body
      )}
    </>
  );
}