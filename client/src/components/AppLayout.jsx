import React, { useState } from 'react';
import { NavLink, useNavigate, useLocation, Outlet } from 'react-router-dom';
import {
  Home,
  FileText,
  Mic,
  CheckCircle2,
  Award,
  Target,
  Map,
  TrendingUp,
  Settings,
  LogOut,
  Sun,
  Moon,
  Bell,
  Menu,
  X,
  ChevronRight,
} from 'lucide-react';
import Logo from './Logo';
import { useAuth } from '../context/AuthContext';
import { useTheme } from '../context/ThemeContext';

export default function AppLayout() {
  const { user, logout, readinessMetrics } = useAuth();
  const { theme, toggleTheme } = useTheme();
  const navigate = useNavigate();
  const location = useLocation();
  const [sidebarOpen, setSidebarOpen] = useState(false);
  const [showNotificationModal, setShowNotificationModal] = useState(false);

  const navItems = [
    { label: 'Home', path: '/home', icon: Home },
    { label: 'Resume Corrector', path: '/resume', icon: FileText },
    { label: 'AI Mock Interview', path: '/interview', icon: Mic },
    { label: 'Interview Results', path: '/interview-results', icon: CheckCircle2 },
    { label: 'Placement Readiness', path: '/readiness', icon: Award },
    { label: 'Skill Gap Analysis', path: '/skills', icon: Target },
    { label: 'Career Roadmap', path: '/roadmap', icon: Map },
    { label: 'Progress Tracking', path: '/progress', icon: TrendingUp },
    { label: 'Profile & Settings', path: '/profile', icon: Settings },
  ];

  // Derive page title from route
  const getPageTitle = () => {
    const current = navItems.find(item => item.path === location.pathname);
    if (current) return current.label;
    if (location.pathname.startsWith('/interview')) return 'AI Mock Interview';
    return 'Home';
  };

  const handleLogout = async () => {
    await logout();
    navigate('/login');
  };

  return (
    <div
      style={{
        display: 'flex',
        minHeight: '100vh',
        backgroundColor: 'var(--background)',
        color: 'var(--foreground)',
      }}
    >
      {/* Mobile Sidebar Overlay */}
      {sidebarOpen && (
        <div
          onClick={() => setSidebarOpen(false)}
          style={{
            position: 'fixed',
            inset: 0,
            backgroundColor: 'rgba(0, 0, 0, 0.5)',
            zIndex: 40,
          }}
          className="sidebar-overlay"
        />
      )}

      {/* Persistent Left Sidebar */}
      <aside
        className={`app-sidebar ${sidebarOpen ? 'open' : ''}`}
        style={{
          width: '260px',
          borderRight: '1px solid var(--border)',
          backgroundColor: 'var(--card)',
          display: 'flex',
          flexDirection: 'column',
          flexShrink: 0,
          position: 'sticky',
          top: 0,
          height: '100vh',
          zIndex: 45,
          transition: 'transform 0.25s ease',
        }}
      >
        {/* Sidebar Header with Logo */}
        <div
          style={{
            padding: '1.25rem 1.4rem',
            borderBottom: '1px solid var(--border)',
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'space-between',
          }}
        >
          <Logo size="medium" />
          <button
            onClick={() => setSidebarOpen(false)}
            aria-label="Close menu"
            className="mobile-close-btn"
            style={{
              display: 'none',
              background: 'transparent',
              color: 'var(--foreground)',
              padding: '0.25rem',
            }}
          >
            <X size={20} />
          </button>
        </div>

        {/* Navigation list */}
        <nav
          style={{
            padding: '1rem 0.85rem',
            display: 'flex',
            flexDirection: 'column',
            gap: '0.3rem',
            flex: 1,
            overflowY: 'auto',
          }}
        >
          {navItems.map((item) => {
            const Icon = item.icon;
            const isActive = location.pathname === item.path;
            return (
              <NavLink
                key={item.path}
                to={item.path}
                onClick={() => setSidebarOpen(false)}
                style={{
                  display: 'flex',
                  alignItems: 'center',
                  gap: '0.75rem',
                  padding: '0.65rem 0.85rem',
                  borderRadius: 'var(--radius-md)',
                  fontSize: '0.885rem',
                  fontWeight: isActive ? 600 : 500,
                  color: isActive ? 'var(--primary-foreground)' : 'var(--muted-foreground)',
                  backgroundColor: isActive ? 'var(--primary)' : 'transparent',
                  textDecoration: 'none',
                  transition: 'var(--transition)',
                }}
                className={isActive ? 'nav-active' : 'nav-inactive'}
              >
                <Icon size={18} strokeWidth={isActive ? 2.3 : 1.8} />
                <span>{item.label}</span>
              </NavLink>
            );
          })}

          {/* 10. Logout button at bottom of nav list */}
          <button
            onClick={handleLogout}
            style={{
              display: 'flex',
              alignItems: 'center',
              gap: '0.75rem',
              padding: '0.65rem 0.85rem',
              borderRadius: 'var(--radius-md)',
              fontSize: '0.885rem',
              fontWeight: 500,
              color: 'var(--muted-foreground)',
              backgroundColor: 'transparent',
              textAlign: 'left',
              width: '100%',
              marginTop: '0.5rem',
              borderTop: '1px solid var(--border)',
              paddingTop: '0.85rem',
            }}
            className="logout-btn"
          >
            <LogOut size={18} />
            <span>Logout</span>
          </button>
        </nav>

        {/* Sidebar Footer: Quick Student Info */}
        <div
          style={{
            padding: '1rem 1.25rem',
            borderTop: '1px solid var(--border)',
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'space-between',
            backgroundColor: 'var(--muted)',
          }}
        >
          <div style={{ display: 'flex', alignItems: 'center', gap: '0.75rem', overflow: 'hidden' }}>
            <div
              style={{
                width: '34px',
                height: '34px',
                borderRadius: '50%',
                backgroundColor: 'var(--primary)',
                color: 'var(--primary-foreground)',
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'center',
                fontWeight: 600,
                fontSize: '0.85rem',
                flexShrink: 0,
              }}
            >
              {user?.fullName ? user.fullName.charAt(0).toUpperCase() : 'S'}
            </div>
            <div style={{ overflow: 'hidden' }}>
              <div
                style={{
                  fontSize: '0.85rem',
                  fontWeight: 600,
                  whiteSpace: 'nowrap',
                  overflow: 'hidden',
                  textOverflow: 'ellipsis',
                  color: 'var(--foreground)',
                }}
              >
                {user?.fullName || 'Student'}
              </div>
              <div
                style={{
                  fontSize: '0.75rem',
                  color: 'var(--muted-foreground)',
                  whiteSpace: 'nowrap',
                  overflow: 'hidden',
                  textOverflow: 'ellipsis',
                }}
              >
                {user?.targetRole || 'Placement Candidate'}
              </div>
            </div>
          </div>
        </div>
      </aside>

      {/* Main Content Area */}
      <div style={{ flex: 1, display: 'flex', flexDirection: 'column', minWidth: 0 }}>
        {/* Top Navigation */}
        <header
          style={{
            position: 'sticky',
            top: 0,
            zIndex: 30,
            height: '64px',
            backgroundColor: 'var(--background)',
            borderBottom: '1px solid var(--border)',
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'space-between',
            padding: '0 1.5rem',
          }}
        >
          <div style={{ display: 'flex', alignItems: 'center', gap: '1rem' }}>
            {/* Mobile Hamburger toggle */}
            <button
              onClick={() => setSidebarOpen(true)}
              aria-label="Open sidebar"
              className="mobile-hamburger"
              style={{
                display: 'none',
                background: 'transparent',
                border: '1px solid var(--border)',
                borderRadius: 'var(--radius-sm)',
                padding: '0.4rem',
                color: 'var(--foreground)',
              }}
            >
              <Menu size={18} />
            </button>

            {/* Current Page Title */}
            <div>
              <h1
                style={{
                  fontSize: '1.2rem',
                  fontWeight: 700,
                  letterSpacing: '-0.02em',
                }}
              >
                {getPageTitle()}
              </h1>
            </div>
          </div>

          {/* Right Top Nav Controls */}
          <div style={{ display: 'flex', alignItems: 'center', gap: '0.85rem' }}>
            {/* Student greeting */}
            <span
              style={{
                fontSize: '0.85rem',
                color: 'var(--muted-foreground)',
                display: 'none',
              }}
              className="desktop-greeting"
            >
              Hello, <strong style={{ color: 'var(--foreground)' }}>{user?.fullName?.split(' ')[0] || 'Student'}</strong>
            </span>

            {/* Placement Readiness mini pill */}
            {readinessMetrics.overallScore !== null ? (
              <NavLink
                to="/readiness"
                style={{
                  display: 'flex',
                  alignItems: 'center',
                  gap: '0.4rem',
                  padding: '0.35rem 0.65rem',
                  borderRadius: 'var(--radius-full)',
                  border: '1px solid var(--border)',
                  backgroundColor: 'var(--muted)',
                  fontSize: '0.785rem',
                  fontWeight: 600,
                  color: 'var(--foreground)',
                }}
                title="Your Placement Readiness Score"
              >
                <Award size={13} />
                <span>Readiness: {readinessMetrics.overallScore}/100</span>
              </NavLink>
            ) : null}

            {/* Light / Dark Mode Toggle */}
            <button
              onClick={toggleTheme}
              aria-label={`Switch to ${theme === 'light' ? 'Dark' : 'Light'} Mode`}
              title={`Switch to ${theme === 'light' ? 'Dark' : 'Light'} Mode`}
              style={{
                background: 'var(--muted)',
                border: '1px solid var(--border)',
                borderRadius: 'var(--radius-md)',
                width: '36px',
                height: '36px',
                padding: 0,
                color: 'var(--foreground)',
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'center',
              }}
            >
              {theme === 'light' ? <Moon size={17} /> : <Sun size={17} />}
            </button>

            {/* Notifications icon */}
            <button
              onClick={() => setShowNotificationModal(!showNotificationModal)}
              aria-label="Notifications"
              style={{
                background: 'transparent',
                border: '1px solid var(--border)',
                borderRadius: 'var(--radius-md)',
                width: '36px',
                height: '36px',
                padding: 0,
                color: 'var(--foreground)',
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'center',
                position: 'relative',
              }}
            >
              <Bell size={17} />
              <span
                style={{
                  position: 'absolute',
                  top: '7px',
                  right: '7px',
                  width: '6px',
                  height: '6px',
                  borderRadius: '50%',
                  backgroundColor: 'var(--primary)',
                }}
              />
            </button>

            {/* Profile Avatar link */}
            <NavLink
              to="/profile"
              style={{
                width: '36px',
                height: '36px',
                borderRadius: '50%',
                backgroundColor: 'var(--muted)',
                border: '1px solid var(--border)',
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'center',
                color: 'var(--foreground)',
                fontWeight: 600,
                fontSize: '0.85rem',
                textDecoration: 'none',
              }}
              title="Profile & Settings"
            >
              {user?.fullName ? user.fullName.charAt(0).toUpperCase() : 'U'}
            </NavLink>
          </div>
        </header>

        {/* Notifications modal dropdown */}
        {showNotificationModal && (
          <div
            style={{
              position: 'fixed',
              top: '70px',
              right: '20px',
              width: '320px',
              backgroundColor: 'var(--card)',
              border: '1px solid var(--border)',
              borderRadius: 'var(--radius-lg)',
              boxShadow: 'var(--shadow-lg)',
              zIndex: 60,
              padding: '1rem',
            }}
          >
            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '0.75rem' }}>
              <h4 style={{ fontSize: '0.95rem' }}>Notifications</h4>
              <button
                onClick={() => setShowNotificationModal(false)}
                style={{ background: 'transparent', border: 'none', color: 'var(--muted-foreground)' }}
              >
                <X size={16} />
              </button>
            </div>
            <div style={{ display: 'flex', flexDirection: 'column', gap: '0.75rem' }}>
              <div style={{ padding: '0.5rem', backgroundColor: 'var(--muted)', borderRadius: 'var(--radius-sm)' }}>
                <div style={{ fontSize: '0.825rem', fontWeight: 600 }}>Welcome to CareerPilot AI</div>
                <div style={{ fontSize: '0.775rem', color: 'var(--muted-foreground)' }}>
                  Upload your resume to get instant AI scoring and interview prep questions.
                </div>
              </div>
            </div>
          </div>
        )}

        {/* Main Outlet for sub-pages */}
        <main style={{ flex: 1, padding: '1.75rem', maxWidth: '1280px', width: '100%', margin: '0 auto' }}>
          <Outlet />
        </main>
      </div>

      <style>{`
        @media (max-width: 900px) {
          .app-sidebar {
            position: fixed !important;
            transform: translateX(-100%);
          }
          .app-sidebar.open {
            transform: translateX(0) !important;
          }
          .mobile-close-btn {
            display: block !important;
          }
          .mobile-hamburger {
            display: block !important;
          }
        }
        @media (min-width: 640px) {
          .desktop-greeting {
            display: inline-block !important;
          }
        }
        .nav-inactive:hover {
          background-color: var(--muted) !important;
          color: var(--foreground) !important;
        }
        .logout-btn:hover {
          background-color: var(--muted) !important;
          color: var(--foreground) !important;
        }
      `}</style>
    </div>
  );
}
