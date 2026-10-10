import React, { useState } from 'react';
import { Link, useNavigate, useLocation } from 'react-router-dom';
import { Sun, Moon, Menu, X, ArrowRight, UserCheck } from 'lucide-react';
import Logo from './Logo';
import { useTheme } from '../context/ThemeContext';
import { useAuth } from '../context/AuthContext';

export default function Navbar() {
  const { theme, toggleTheme } = useTheme();
  const { user } = useAuth();
  const navigate = useNavigate();
  const location = useLocation();
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);

  // Handle Home navigation as strictly required by prompt:
  // "When a visitor clicks 'Home':
  // - If the user is not logged in, redirect them to the Login page.
  // - If they do not have an account, provide an option to navigate to Sign Up.
  // - If the user is logged in, open the actual CareerPilot AI Home page.
  // - Never render a blank page."
  const handleHomeClick = (e) => {
    e.preventDefault();
    setMobileMenuOpen(false);
    if (user) {
      navigate('/home');
    } else {
      navigate('/login', {
        state: { message: 'Please log in to access your student Home dashboard, or create a free account.' },
      });
    }
  };

  // Handle Start for Free / Get Started:
  // "When a visitor clicks 'Start for Free' on the landing page:
  // - Navigate to the Sign Up page.
  // - If the user is already logged in, navigate to the Home page instead."
  const handleStartForFree = (e) => {
    e.preventDefault();
    setMobileMenuOpen(false);
    if (user) {
      navigate('/home');
    } else {
      navigate('/signup');
    }
  };

  const scrollToSection = (id) => {
    setMobileMenuOpen(false);
    if (location.pathname !== '/') {
      navigate(`/#${id}`);
      return;
    }
    const el = document.getElementById(id);
    if (el) {
      el.scrollIntoView({ behavior: 'smooth' });
    }
  };

  return (
    <header
      style={{
        position: 'sticky',
        top: 0,
        zIndex: 50,
        backgroundColor: 'var(--background)',
        borderBottom: '1px solid var(--border)',
        backdropFilter: 'blur(8px)',
        transition: 'background-color 0.2s, border-color 0.2s',
      }}
    >
      <div
        style={{
          maxWidth: '1240px',
          margin: '0 auto',
          padding: '0.85rem 1.5rem',
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'space-between',
        }}
      >
        {/* Left: CareerPilot AI Logo */}
        <Logo size="medium" />

        {/* Right: Desktop Navigation */}
        <nav
          style={{
            display: 'none',
            alignItems: 'center',
            gap: '1.75rem',
          }}
          className="desktop-nav"
        >
          <a
            href={user ? '/home' : '/login'}
            onClick={handleHomeClick}
            style={{
              fontSize: '0.925rem',
              fontWeight: 500,
              color: 'var(--foreground)',
              opacity: 0.9,
              cursor: 'pointer',
            }}
          >
            Home
          </a>
          <button
            onClick={() => scrollToSection('features')}
            className="btn-ghost"
            style={{ fontSize: '0.925rem', fontWeight: 500, padding: 0 }}
          >
            Features
          </button>
          <button
            onClick={() => scrollToSection('how-it-works')}
            className="btn-ghost"
            style={{ fontSize: '0.925rem', fontWeight: 500, padding: 0 }}
          >
            How It Works
          </button>
          <button
            onClick={() => scrollToSection('reviews')}
            className="btn-ghost"
            style={{ fontSize: '0.925rem', fontWeight: 500, padding: 0 }}
          >
            Reviews
          </button>

          {/* Theme Toggle Button */}
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

          {/* Auth Action Buttons */}
          {user ? (
            <button
              onClick={() => navigate('/home')}
              className="btn-primary"
              style={{ padding: '0.55rem 1.15rem' }}
            >
              <UserCheck size={16} />
              Open Home
            </button>
          ) : (
            <div style={{ display: 'flex', alignItems: 'center', gap: '0.75rem' }}>
              <Link
                to="/login"
                className="btn-outline btn-sm"
                style={{ padding: '0.55rem 1rem' }}
              >
                Login
              </Link>
              <button
                onClick={handleStartForFree}
                className="btn-primary btn-sm"
                style={{ padding: '0.55rem 1.15rem' }}
              >
                Start for Free
                <ArrowRight size={14} />
              </button>
            </div>
          )}
        </nav>

        {/* Mobile controls */}
        <div
          style={{
            display: 'flex',
            alignItems: 'center',
            gap: '0.5rem',
          }}
          className="mobile-controls"
        >
          <button
            onClick={toggleTheme}
            aria-label="Toggle theme"
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

          <button
            onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
            aria-label="Toggle mobile menu"
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
            }}
          >
            {mobileMenuOpen ? <X size={20} /> : <Menu size={20} />}
          </button>
        </div>
      </div>

      {/* Mobile Drawer */}
      {mobileMenuOpen && (
        <div
          style={{
            padding: '1.25rem 1.5rem',
            borderTop: '1px solid var(--border)',
            backgroundColor: 'var(--background)',
            display: 'flex',
            flexDirection: 'column',
            gap: '1rem',
          }}
        >
          <a
            href={user ? '/home' : '/login'}
            onClick={handleHomeClick}
            style={{
              fontSize: '1rem',
              fontWeight: 500,
              padding: '0.5rem 0',
              color: 'var(--foreground)',
            }}
          >
            Home
          </a>
          <button
            onClick={() => scrollToSection('features')}
            className="btn-ghost"
            style={{ textAlign: 'left', justifyContent: 'flex-start', padding: '0.5rem 0', fontSize: '1rem' }}
          >
            Features
          </button>
          <button
            onClick={() => scrollToSection('how-it-works')}
            className="btn-ghost"
            style={{ textAlign: 'left', justifyContent: 'flex-start', padding: '0.5rem 0', fontSize: '1rem' }}
          >
            How It Works
          </button>
          <button
            onClick={() => scrollToSection('reviews')}
            className="btn-ghost"
            style={{ textAlign: 'left', justifyContent: 'flex-start', padding: '0.5rem 0', fontSize: '1rem' }}
          >
            Reviews
          </button>

          <div style={{ paddingTop: '0.5rem', display: 'flex', flexDirection: 'column', gap: '0.75rem' }}>
            {user ? (
              <button
                onClick={() => {
                  setMobileMenuOpen(false);
                  navigate('/home');
                }}
                className="btn-primary"
                style={{ width: '100%' }}
              >
                Go to Home
              </button>
            ) : (
              <>
                <Link
                  to="/login"
                  onClick={() => setMobileMenuOpen(false)}
                  className="btn-outline"
                  style={{ width: '100%', textAlign: 'center' }}
                >
                  Login
                </Link>
                <button
                  onClick={handleStartForFree}
                  className="btn-primary"
                  style={{ width: '100%' }}
                >
                  Start for Free
                </button>
              </>
            )}
          </div>
        </div>
      )}

      <style>{`
        @media (min-width: 768px) {
          .desktop-nav {
            display: flex !important;
          }
          .mobile-controls {
            display: none !important;
          }
        }
      `}</style>
    </header>
  );
}
