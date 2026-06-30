import React, { createContext, useContext, useState, useCallback, useRef, useEffect } from 'react';
import api from '../api/axios';
import { useAuth } from '../hooks/useAuth';

const NotificationContext = createContext(null);

export function NotificationProvider({ children }) {
  const { isAuthenticated } = useAuth();
  const [notifications, setNotifications] = useState([]);
  const [toasts, setToasts] = useState([]);
  const [unreadCount, setUnreadCount] = useState(0);
  const toastIdRef = useRef(0);

  const fetchNotifications = useCallback(async () => {
    if (!isAuthenticated) return;
    try {
      const [notifRes, countRes] = await Promise.all([
        api.get('/notification'),
        api.get('/notification/unread-count'),
      ]);
      setNotifications(notifRes.data);
      setUnreadCount(countRes.data.count);
    } catch {}
  }, [isAuthenticated]);

  useEffect(() => {
    if (isAuthenticated) fetchNotifications();
  }, [isAuthenticated, fetchNotifications]);

  useEffect(() => {
    if (!isAuthenticated) { setNotifications([]); setUnreadCount(0); }
  }, [isAuthenticated]);

  const removeToast = useCallback((id) => {
    setToasts((prev) => prev.filter((t) => t.id !== id));
  }, []);

  const addNotification = useCallback(async (type, message, image, caption) => {
    const toastId = ++toastIdRef.current;
    setToasts((prev) => [...prev, { id: toastId, type, message, image, caption }]);
    setTimeout(() => removeToast(toastId), 5000);

    if (!isAuthenticated) return;
    try {
      const res = await api.post('/notification', { type, message, image, caption });
      setNotifications((prev) => [res.data, ...prev]);
      if (!res.data.read) setUnreadCount((prev) => prev + 1);
    } catch {}
  }, [isAuthenticated, removeToast]);

  const markAsRead = useCallback(async (id) => {
    try {
      await api.patch(`/notification/${id}/read`);
      setNotifications((prev) => prev.map((n) => (n._id === id ? { ...n, read: true } : n)));
      setUnreadCount((prev) => Math.max(0, prev - 1));
    } catch {}
  }, []);

  const markAllAsRead = useCallback(async () => {
    try {
      await api.patch('/notification/read-all');
      setNotifications((prev) => prev.map((n) => ({ ...n, read: true })));
      setUnreadCount(0);
    } catch {}
  }, []);

  return (
    <NotificationContext.Provider value={{
      notifications, toasts, unreadCount,
      addNotification, removeToast, markAsRead, markAllAsRead, fetchNotifications,
    }}>
      {children}
    </NotificationContext.Provider>
  );
}

export function useNotification() {
  const ctx = useContext(NotificationContext);
  if (!ctx) throw new Error('useNotification must be used within NotificationProvider');
  return ctx;
}

export default NotificationContext;
