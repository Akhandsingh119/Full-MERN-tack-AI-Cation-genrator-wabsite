import React, { useState, useEffect, useCallback } from 'react';
import { useNavigate } from 'react-router-dom';
import { motion, AnimatePresence } from 'framer-motion';
import { toast } from 'react-toastify';
import api from '../api/axios';
import Button from '../components/Button';
import LoadingSpinner from '../components/LoadingSpinner';
import TopNavbar from '../components/TopNavbar';
import Modal from '../components/Modal';
import { useNotification } from '../context/NotificationContext';

export default function HistoryPage() {
  const navigate = useNavigate();
  const { addNotification } = useNotification();
  const [history, setHistory] = useState([]);
  const [filtered, setFiltered] = useState([]);
  const [loading, setLoading] = useState(true);
  const [searchQuery, setSearchQuery] = useState('');
  const [deleteTarget, setDeleteTarget] = useState(null);
  const [deleting, setDeleting] = useState(false);
  const [copiedId, setCopiedId] = useState(null);
  const [cardVariant, setCardVariant] = useState({});

  const fetchHistory = useCallback(async () => {
    try {
      setLoading(true);
      const res = await api.get('/post/history');
      setHistory(res.data);
      setFiltered(res.data);
    } catch (err) {
      if (err.response?.status === 401) navigate('/login');
      else toast.error('Failed to load history');
    } finally {
      setLoading(false);
    }
  }, [navigate]);

  useEffect(() => { fetchHistory(); }, [fetchHistory]);

  const handleSearch = useCallback((query) => {
    setSearchQuery(query);
    if (!query.trim()) { setFiltered(history); return; }
    const lower = query.toLowerCase();
    setFiltered(history.filter((item) => item.caption.toLowerCase().includes(lower)));
  }, [history]);

  const handleCopy = async (id, item) => {
    const variantKey = cardVariant[id] || 'medium';
    const text = item.variants?.[variantKey] || item.caption;
    try { await navigator.clipboard.writeText(text); setCopiedId(id); toast.info('Copied to clipboard'); setTimeout(() => setCopiedId(null), 2000); } catch {}
  };

  const handleDelete = async () => {
    if (!deleteTarget) return;
    setDeleting(true);
    try {
      await api.delete(`/post/${deleteTarget._id}`);
      const deleted = deleteTarget;
      setHistory((prev) => prev.filter((h) => h._id !== deleteTarget._id));
      setFiltered((prev) => prev.filter((h) => h._id !== deleteTarget._id));
      setDeleteTarget(null);
      const delCaption = deleted.variants?.medium || deleted.caption || '';
      addNotification('deleted', 'Caption Deleted', deleted.image, delCaption);
      toast.success('Caption deleted');
    } catch {
      toast.error('Failed to delete caption');
    } finally { setDeleting(false); }
  };

  const formatDate = (dateStr) => {
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
    return d.toLocaleDateString('en-US', { month: 'short', day: 'numeric', year: 'numeric' });
  };

  return (
    <div className="crosshatch-bg min-h-screen">
      <TopNavbar onSearch={handleSearch} />
      <div className="max-w-5xl mx-auto px-5 sm:px-8 py-8">
            <div className="mb-8 animate-fade-up">
              <h1 className="text-2xl font-display text-champagne uppercase tracking-widest">Caption History</h1>
              <p className="text-xs font-body text-pewter uppercase tracking-widest mt-1">
                {filtered.length > 0 ? `${filtered.length} caption${filtered.length !== 1 ? 's' : ''} generated` : 'Your generated captions will appear here'}
              </p>
            </div>

            {loading && (
              <div className="flex items-center justify-center py-24">
                <LoadingSpinner label="Loading history..." />
              </div>
            )}

            {!loading && filtered.length === 0 && (
              <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} className="flex flex-col items-center justify-center py-20 text-center">
                <div className="w-20 h-20 border-2 border-gold/30 flex items-center justify-center mb-6">
                  <svg className="w-9 h-9 text-gold/40" fill="none" stroke="currentColor" viewBox="0 0 24 24" strokeWidth={1.2}>
                    <path strokeLinecap="round" strokeLinejoin="round" d="m2.25 15.75 5.159-5.159a2.25 2.25 0 0 1 3.182 0l5.159 5.159m-1.5-1.5 1.409-1.409a2.25 2.25 0 0 1 3.182 0l2.909 2.909M3.75 21h16.5A2.25 2.25 0 0 0 22.5 18.75V5.25A2.25 2.25 0 0 0 20.25 3H3.75A2.25 2.25 0 0 0 1.5 5.25v13.5A2.25 2.25 0 0 0 3.75 21Z" />
                  </svg>
                </div>
                <h3 className="text-lg font-display text-champagne uppercase tracking-widest mb-2">No captions generated yet</h3>
                <p className="text-xs font-body text-pewter uppercase tracking-widest mb-8 max-w-sm">
                  {searchQuery ? 'No results match your search.' : 'Generate your first caption and it will appear here.'}
                </p>
                <Button variant="solid" size="lg" onClick={() => navigate('/dashboard')}>Generate Your First Caption</Button>
              </motion.div>
            )}

            {!loading && filtered.length > 0 && (
              <div className="space-y-4">
                <AnimatePresence>
                  {filtered.map((item, index) => (
                    <motion.div
                      key={item._id} layout
                      initial={{ opacity: 0, y: 16 }} animate={{ opacity: 1, y: 0 }} exit={{ opacity: 0, scale: 0.95 }}
                      transition={{ duration: 0.3, delay: index * 0.04 }}
                      className="bg-charcoal border border-gold/30 corner-decor transition-all duration-500 hover:border-gold hover:shadow-[0_0_15px_rgba(212,175,55,0.15)]"
                    >
                      <div className="flex flex-col sm:flex-row gap-0">
                        <div className="sm:w-48 sm:h-48 flex-shrink-0 bg-obsidian/50 border-b sm:border-b-0 sm:border-r border-gold/20 overflow-hidden">
                          {item.image ? (
                            <img src={item.image} alt="Caption" className="w-full h-full object-cover" />
                          ) : (
                            <div className="w-full h-full flex items-center justify-center text-gold/30">
                              <svg className="w-10 h-10" fill="none" stroke="currentColor" viewBox="0 0 24 24" strokeWidth={1.2}>
                                <path strokeLinecap="round" strokeLinejoin="round" d="m2.25 15.75 5.159-5.159a2.25 2.25 0 0 1 3.182 0l5.159 5.159m-1.5-1.5 1.409-1.409a2.25 2.25 0 0 1 3.182 0l2.909 2.909M3.75 21h16.5A2.25 2.25 0 0 0 22.5 18.75V5.25A2.25 2.25 0 0 0 20.25 3H3.75A2.25 2.25 0 0 0 1.5 5.25v13.5A2.25 2.25 0 0 0 3.75 21Z" />
                              </svg>
                            </div>
                          )}
                        </div>

                        <div className="flex-1 min-w-0 p-5 sm:p-6 flex flex-col justify-center gap-3">
                          {item.variants && (
                            <div className="flex border-b border-gold/20 -mx-1">
                              {['short', 'medium', 'long'].map((key) => (
                                <button
                                  key={key}
                                  onClick={() => setCardVariant(prev => ({ ...prev, [item._id]: key }))}
                                  className={`px-3 py-1.5 text-[10px] font-body font-semibold uppercase tracking-widest transition-all duration-300 border-b-2 -mb-[1px] ${
                                    (cardVariant[item._id] || 'medium') === key
                                      ? 'border-gold text-gold'
                                      : 'border-transparent text-pewter hover:text-champagne'
                                  }`}
                                >
                                  {key === 'short' ? 'Short' : key === 'medium' ? 'Med' : 'Long'}
                                </button>
                              ))}
                            </div>
                          )}

                          <div className="flex items-start justify-between gap-3">
                            <div className="min-w-0 flex-1">
                              <p className="text-sm font-body text-champagne leading-relaxed">
                                {item.variants?.[cardVariant[item._id] || 'medium'] || item.caption}
                              </p>
                            </div>
                            <span className="text-xs font-body text-pewter whitespace-nowrap flex-shrink-0 mt-0.5 uppercase tracking-widest">
                              {formatDate(item.createdAt)}
                            </span>
                          </div>

                          {item.hashtags?.length > 0 && (
                            <div className="flex flex-wrap gap-1.5">
                              {item.hashtags.map((tag, i) => (
                                <span key={i} className="px-2 py-0.5 border border-gold/20 text-[10px] font-body text-gold/70">{tag}</span>
                              ))}
                            </div>
                          )}

                          <div className="deco-divider my-1">
                            <span className="text-xs font-body text-pewter uppercase tracking-widest">Actions</span>
                          </div>

                          <div className="flex flex-wrap items-center gap-2">
                            <button
                              onClick={() => handleCopy(item._id, item)}
                              className="inline-flex items-center gap-1.5 px-3 py-1.5 border border-gold/30 text-xs font-body font-semibold uppercase tracking-widest text-gold hover:bg-gold hover:text-obsidian transition-all duration-300"
                            >
                              {copiedId === item._id ? 'Copied' : 'Copy'}
                            </button>
                            <button
                              onClick={() => window.open(item.image, '_blank')}
                              className="inline-flex items-center gap-1.5 px-3 py-1.5 border border-gold/20 text-xs font-body font-semibold uppercase tracking-widest text-pewter hover:text-champagne hover:border-gold/40 transition-all duration-300"
                            >
                              View
                            </button>
                            <button
                              onClick={() => setDeleteTarget(item)}
                              className="inline-flex items-center gap-1.5 px-3 py-1.5 border border-red-500/30 text-xs font-body font-semibold uppercase tracking-widest text-red-400 hover:bg-red-500/10 transition-all duration-300"
                            >
                              Delete
                            </button>
                          </div>
                        </div>
                      </div>
                    </motion.div>
                  ))}
                </AnimatePresence>
              </div>
            )}
          </div>

          <Modal isOpen={!!deleteTarget} onClose={() => !deleting && setDeleteTarget(null)} title="Delete Caption" size="sm">
        <p className="text-sm font-body text-pewter mb-6">Are you sure you want to delete this caption? This action cannot be undone.</p>
        <div className="flex items-center gap-3 justify-end">
          <button onClick={() => setDeleteTarget(null)} disabled={deleting} className="h-10 px-4 border border-gold/30 text-xs font-body font-semibold uppercase tracking-widest text-pewter hover:text-champagne transition-all duration-300 disabled:opacity-30">
            Cancel
          </button>
          <button onClick={handleDelete} disabled={deleting} className="h-10 px-5 border border-red-500/30 text-xs font-body font-semibold uppercase tracking-widest text-red-400 hover:bg-red-500/10 transition-all duration-300 disabled:opacity-30 flex items-center gap-2">
            {deleting && <svg className="animate-spin h-4 w-4" fill="none" viewBox="0 0 24 24"><circle className="opacity-20" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="3" fill="none" /><path className="opacity-70" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z" /></svg>}
            Delete
          </button>
        </div>
      </Modal>
    </div>
  );
}
