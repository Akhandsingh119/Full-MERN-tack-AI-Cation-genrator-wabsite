import React from 'react';
import { Link, useLocation, useNavigate } from 'react-router-dom';
import { motion, AnimatePresence } from 'framer-motion';
import api from '../api/axios';

export default function Sidebar({ mobileOpen, onClose }) {
  const location = useLocation();
  const navigate = useNavigate();

  const navItems = [
    { path: '/', label: 'Home', icon: (
      <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24" strokeWidth={1.8}>
        <path strokeLinecap="round" strokeLinejoin="round" d="m2.25 12 8.954-8.955c.44-.439 1.152-.439 1.591 0L21.75 12M4.5 9.75v10.125c0 .621.504 1.125 1.125 1.125H9.75v-4.875c0-.621.504-1.125 1.125-1.125h2.25c.621 0 1.125.504 1.125 1.125V21h4.125c.621 0 1.125-.504 1.125-1.125V9.75M8.25 21h8.25" />
      </svg>
    ) },
    { path: '/dashboard', label: 'New Caption', icon: (
      <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24" strokeWidth={1.8}>
        <path strokeLinecap="round" strokeLinejoin="round" d="m2.25 15.75 5.159-5.159a2.25 2.25 0 0 1 3.182 0l5.159 5.159m-1.5-1.5 1.409-1.409a2.25 2.25 0 0 1 3.182 0l2.909 2.909M3.75 21h16.5A2.25 2.25 0 0 0 22.5 18.75V5.25A2.25 2.25 0 0 0 20.25 3H3.75A2.25 2.25 0 0 0 1.5 5.25v13.5A2.25 2.25 0 0 0 3.75 21Z" />
      </svg>
    ) },
    { path: '/history', label: 'History', icon: (
      <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24" strokeWidth={1.8}>
        <path strokeLinecap="round" strokeLinejoin="round" d="M12 6v6h4.5m4.5 0a9 9 0 1 1-18 0 9 9 0 0 1 18 0Z" />
      </svg>
    ) },
  ];

  const handleLogout = async () => {
    try { await api.post('/auth/logout'); } catch {}
    onClose?.();
    window.location.href = '/login';
  };

  const sidebarContent = (
    <div className="flex flex-col h-full bg-charcoal">
      {/* Logo */}
      <div className="flex items-center gap-2.5 px-5 h-16 border-b border-gold/20">
        <div className="w-8 h-8 border-2 border-gold flex items-center justify-center">
          <svg className="w-4 h-4 text-gold" fill="none" stroke="currentColor" viewBox="0 0 24 24" strokeWidth={2.2}>
            <path strokeLinecap="round" strokeLinejoin="round" d="M13 10V3L4 14h7v7l9-11h-7z" />
          </svg>
        </div>
        <span className="text-lg font-display text-gold tracking-widest uppercase">CaptionGen</span>
      </div>

      {/* New Caption Button */}
      <div className="px-4 pt-4 pb-3">
        <button
          onClick={() => { navigate('/dashboard'); onClose?.(); }}
          className="w-full h-11 border-2 border-gold bg-transparent text-gold font-body font-semibold uppercase tracking-widest text-xs flex items-center justify-center gap-2 hover:bg-gold hover:text-obsidian hover:shadow-[0_0_15px_rgba(212,175,55,0.3)] transition-all duration-500"
        >
          + New Caption
        </button>
      </div>

      {/* Nav Items */}
      <nav className="flex-1 px-3 space-y-0.5 overflow-y-auto">
        {navItems.map((item) => {
          const active = location.pathname === item.path;
          return (
            <Link
              key={item.path}
              to={item.path}
              onClick={onClose}
              className={`flex items-center gap-3 px-3.5 py-2.5 text-xs font-body font-semibold uppercase tracking-widest transition-all duration-300 ${
                active ? 'bg-gold/10 text-gold border-l-2 border-gold' : 'text-pewter hover:text-champagne hover:bg-gold/5'
              }`}
            >
              {item.icon}
              {item.label}
            </Link>
          );
        })}
      </nav>

      {/* Logout */}
      <div className="px-3 pb-4 pt-3 border-t border-gold/20">
        <button
          onClick={handleLogout}
          className="flex items-center gap-3 w-full px-3.5 py-2.5 text-xs font-body font-semibold uppercase tracking-widest text-pewter hover:text-red-400 hover:bg-red-500/5 transition-all duration-300"
        >
          <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24" strokeWidth={1.8}>
            <path strokeLinecap="round" strokeLinejoin="round" d="M15.75 9V5.25A2.25 2.25 0 0 0 13.5 3h-6a2.25 2.25 0 0 0-2.25 2.25v13.5A2.25 2.25 0 0 0 7.5 21h6a2.25 2.25 0 0 0 2.25-2.25V15m3 0 3-3m0 0-3-3m3 3H9" />
          </svg>
          Logout
        </button>
      </div>
    </div>
  );

  return (
    <>
      {/* Desktop Sidebar — fixed always visible on md+ */}
      <aside className="hidden md:flex fixed left-0 top-0 bottom-0 w-64 z-40 border-r border-gold/20 backdrop-blur-md">
        {sidebarContent}
      </aside>

      {/* Mobile Drawer — slide-down overlay */}
      <AnimatePresence>
        {mobileOpen && (
          <>
            {/* Backdrop */}
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              transition={{ duration: 0.25 }}
              className="fixed inset-0 z-40 bg-obsidian/70 md:hidden"
              onClick={onClose}
            />
            {/* Drawer */}
            <motion.aside
              initial={{ y: '-100%' }}
              animate={{ y: 0 }}
              exit={{ y: '-100%' }}
              transition={{ duration: 0.25, ease: 'easeInOut' }}
              className="fixed top-0 left-0 right-0 z-50 max-h-[90vh] overflow-y-auto border-b border-gold/20 md:hidden shadow-2xl"
            >
              {sidebarContent}
            </motion.aside>
          </>
        )}
      </AnimatePresence>
    </>
  );
}
