import React, { useState, useEffect } from 'react';
import { BrowserRouter, Routes, Route, Navigate, useLocation } from 'react-router-dom';
import { ToastContainer } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';
import { AuthProvider } from './context/AuthContext';
import { NotificationProvider } from './context/NotificationContext';
import ProtectedRoute from './utils/ProtectedRoute';
import Navbar from './components/Navbar';
import MobileHeader from './components/MobileHeader';
import Sidebar from './components/Sidebar';
import Footer from './components/Footer';
import NotificationToast from './components/NotificationToast';
import LandingPage from './pages/LandingPage';
import LoginPage from './pages/LoginPage';
import RegisterPage from './pages/RegisterPage';
import DashboardPage from './pages/DashboardPage';
import HistoryPage from './pages/HistoryPage';

function AppShell() {
  const location = useLocation();
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);

  const authPages = ['/dashboard', '/history'];
  const isAuthPage = authPages.some((p) => location.pathname.startsWith(p));
  const hideFooter = location.pathname.startsWith('/dashboard');

  useEffect(() => { setMobileMenuOpen(false); }, [location.pathname]);
  useEffect(() => {
    document.body.style.overflow = mobileMenuOpen ? 'hidden' : '';
    return () => { document.body.style.overflow = ''; };
  }, [mobileMenuOpen]);
  useEffect(() => {
    const handleEsc = (e) => { if (e.key === 'Escape') setMobileMenuOpen(false); };
    window.addEventListener('keydown', handleEsc);
    return () => window.removeEventListener('keydown', handleEsc);
  }, []);

  return (
    <div className="min-h-screen bg-obsidian text-champagne antialiased grain">
      <NotificationToast />
      <ToastContainer
        position="top-right"
        autoClose={3000}
        hideProgressBar={false}
        newestOnTop
        closeOnClick
        rtl={false}
        pauseOnFocusLoss
        draggable
        pauseOnHover
        theme="dark"
        toastClassName="!bg-charcoal !border-gold/30 !text-champagne !font-body !shadow-[0_0_15px_rgba(212,175,55,0.1)]"
      />
      {isAuthPage ? (
        <>
          <MobileHeader
            onMenuToggle={() => setMobileMenuOpen((prev) => !prev)}
            isMenuOpen={mobileMenuOpen}
          />
          <Sidebar
            mobileOpen={mobileMenuOpen}
            onClose={() => setMobileMenuOpen(false)}
          />
        </>
      ) : (
        <Navbar />
      )}

      <div className={isAuthPage ? 'md:pl-64 pt-14 md:pt-0' : ''}>
        <Routes>
          <Route path="/" element={<LandingPage />} />
          <Route path="/login" element={<LoginPage />} />
          <Route path="/register" element={<RegisterPage />} />
          <Route path="/dashboard" element={<ProtectedRoute><DashboardPage /></ProtectedRoute>} />
          <Route path="/history" element={<ProtectedRoute><HistoryPage /></ProtectedRoute>} />
          <Route path="*" element={<Navigate to="/" replace />} />
        </Routes>
        {!isAuthPage && !hideFooter && <Footer />}
      </div>
    </div>
  );
}

function App() {
  return (
    <AuthProvider>
      <NotificationProvider>
        <BrowserRouter>
          <AppShell />
        </BrowserRouter>
      </NotificationProvider>
    </AuthProvider>
  );
}

export default App;
