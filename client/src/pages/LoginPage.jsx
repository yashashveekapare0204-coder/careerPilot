import React, { useState } from 'react';
import { Link, useNavigate, useLocation } from 'react-router-dom';
import { Eye, EyeOff, Sun, Moon, ArrowRight, AlertCircle } from 'lucide-react';
import Logo from '../components/Logo';
import { useAuth } from '../context/AuthContext';
import { useTheme } from '../context/ThemeContext';

export default function LoginPage() {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [showPassword, setShowPassword] = useState(false);
  const [rememberMe, setRememberMe] = useState(true);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');
  const [message, setMessage] = useState('');

  const { login } = useAuth();
  const { theme, toggleTheme } = useTheme();
  const navigate = useNavigate();
  const location = useLocation();

  // Inspect if redirected from another page with custom notice
  React.useEffect(() => {
    if (location.state?.message) {
      setMessage(location.state.message);
    }
  }, [location.state]);

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError('');
    setMessage('');

    if (!email.trim() || !password) {
      setError('Please provide both email address and password.');
      return;
    }

    setLoading(true);
    try {
      const result = await login({ email: email.trim(), password, rememberMe });
      if (result.success) {
        const destination = location.state?.from || '/home';
        navigate(destination, { replace: true });
      } else {
        setError(result.error || 'Authentication failed. Please check your credentials.');
      }
    } catch (err) {
      setError(err.message || 'An unexpected error occurred during login.');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div
      style={{
        minHeight: '100vh',
        display: 'flex',
        backgroundColor: 'var(--background)',
        color: 'var(--foreground)',
      }}
    >
      {/* Theme toggle in corner */}
      <button
        onClick={toggleTheme}
        aria-label="Toggle theme"
        style={{
          position: 'fixed',
          top: '1.25rem',
          right: '1.5rem',
          zIndex: 50,
          background: 'var(--muted)',
          border: '1px solid var(--border)',
          borderRadius: 'var(--radius-md)',
          width: '38px',
          height: '38px',
          color: 'var(--foreground)',
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'center',
        }}
      >
        {theme === 'light' ? <Moon size={18} /> : <Sun size={18} />}
      </button>

      {/* Left Panel */}
      <div
        className="login-left-panel"
        style={{
          flex: 1,
          padding: '3rem',
          display: 'flex',
          flexDirection: 'column',
          justifyContent: 'space-between',
          borderRight: '1px solid var(--border)',
          backgroundColor: 'var(--card)',
        }}
      >
        <div>
          <Logo size="large" />
        </div>

        {/* Minimal black-and-white abstract illustration */}
        <div style={{ maxWidth: '420px', margin: '2rem 0' }}>
          <div
            style={{
              width: '100%',
              aspectRatio: '16/10',
              border: '1px solid var(--border)',
              borderRadius: 'var(--radius-lg)',
              backgroundColor: 'var(--muted)',
              display: 'flex',
              flexDirection: 'column',
              padding: '1.5rem',
              justifyContent: 'space-between',
              marginBottom: '2rem',
              position: 'relative',
              overflow: 'hidden',
            }}
          >
            {/* Minimal Grid & Path Art */}
            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
              <div style={{ fontSize: '0.8rem', fontWeight: 600, letterSpacing: '0.05em' }}>CAREERPILOT PLATFORM</div>
              <div style={{ width: '8px', height: '8px', borderRadius: '50%', backgroundColor: 'var(--foreground)' }} />
            </div>

            <div style={{ padding: '1rem 0' }}>
              <svg width="100%" height="70" viewBox="0 0 320 70" fill="none">
                <path
                  d="M10 60 Q 90 60, 140 35 T 260 20 T 310 10"
                  stroke="currentColor"
                  strokeWidth="2.5"
                  strokeDasharray="4 4"
                />
                <circle cx="10" cy="60" r="4" fill="currentColor" />
                <circle cx="140" cy="35" r="4" fill="currentColor" />
                <circle cx="260" cy="20" r="4" fill="currentColor" />
                <circle cx="310" cy="10" r="5" fill="currentColor" />
              </svg>
            </div>

            <div style={{ display: 'flex', justifyContent: 'space-between', fontSize: '0.75rem', color: 'var(--muted-foreground)' }}>
              <span>Resume Audit</span>
              <span>Mock Rounds</span>
              <span>Placement Ready</span>
            </div>
          </div>

          <h2 style={{ fontSize: '1.8rem', fontWeight: 700, marginBottom: '0.75rem', lineHeight: 1.3 }}>
            "Your next opportunity starts with better preparation."
          </h2>
          <p style={{ fontSize: '0.95rem' }}>
            Join students who practice structured technical and HR interviews with instant AI feedback.
          </p>
        </div>

        <div style={{ fontSize: '0.8rem', color: 'var(--muted-foreground)' }}>
          © {new Date().getFullYear()} CareerPilot AI
        </div>
      </div>

      {/* Right Panel */}
      <div
        style={{
          flex: 1,
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'center',
          padding: '2.5rem',
        }}
      >
        <div style={{ width: '100%', maxWidth: '420px' }}>
          <div style={{ marginBottom: '2rem' }}>
            <h1 style={{ fontSize: '2rem', fontWeight: 700, marginBottom: '0.5rem' }}>
              Welcome Back!
            </h1>
            <p style={{ fontSize: '0.95rem' }}>
              Continue your journey toward placement readiness.
            </p>
          </div>

          {/* Friendly notice if navigated with prompt */}
          {message && (
            <div
              style={{
                padding: '0.85rem 1rem',
                backgroundColor: 'var(--muted)',
                border: '1px solid var(--border)',
                borderRadius: 'var(--radius-md)',
                marginBottom: '1.25rem',
                fontSize: '0.875rem',
              }}
            >
              {message}
            </div>
          )}

          {/* Error display */}
          {error && (
            <div
              style={{
                padding: '0.85rem 1rem',
                backgroundColor: 'var(--muted)',
                border: '1px solid var(--foreground)',
                borderRadius: 'var(--radius-md)',
                marginBottom: '1.25rem',
                display: 'flex',
                alignItems: 'center',
                gap: '0.65rem',
                fontSize: '0.875rem',
              }}
            >
              <AlertCircle size={17} style={{ flexShrink: 0 }} />
              <span>{error}</span>
            </div>
          )}

          <form onSubmit={handleSubmit} style={{ display: 'flex', flexDirection: 'column', gap: '1.25rem' }}>
            <div>
              <label
                htmlFor="login-email"
                style={{
                  display: 'block',
                  fontSize: '0.85rem',
                  fontWeight: 600,
                  marginBottom: '0.4rem',
                }}
              >
                Email Address
              </label>
              <input
                id="login-email"
                type="email"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                placeholder="student@college.edu"
                required
                style={{ width: '100%' }}
                autoComplete="email"
              />
            </div>

            <div>
              <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '0.4rem' }}>
                <label
                  htmlFor="login-password"
                  style={{
                    fontSize: '0.85rem',
                    fontWeight: 600,
                  }}
                >
                  Password
                </label>
                <button
                  type="button"
                  onClick={() => alert('To reset password, re-enter your registered email and an email with reset instructions will be handled via Supabase Auth.')}
                  className="btn-ghost"
                  style={{ padding: 0, fontSize: '0.8rem', color: 'var(--muted-foreground)' }}
                >
                  Forgot password?
                </button>
              </div>
              <div style={{ position: 'relative' }}>
                <input
                  id="login-password"
                  type={showPassword ? 'text' : 'password'}
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  placeholder="••••••••"
                  required
                  style={{ width: '100%', paddingRight: '2.5rem' }}
                  autoComplete="current-password"
                />
                <button
                  type="button"
                  onClick={() => setShowPassword(!showPassword)}
                  aria-label={showPassword ? 'Hide password' : 'Show password'}
                  style={{
                    position: 'absolute',
                    right: '0.75rem',
                    top: '50%',
                    transform: 'translateY(-50%)',
                    background: 'transparent',
                    border: 'none',
                    color: 'var(--muted-foreground)',
                    padding: 0,
                  }}
                >
                  {showPassword ? <EyeOff size={16} /> : <Eye size={16} />}
                </button>
              </div>
            </div>

            <div style={{ display: 'flex', alignItems: 'center', gap: '0.5rem' }}>
              <input
                type="checkbox"
                id="rememberMe"
                checked={rememberMe}
                onChange={(e) => setRememberMe(e.target.checked)}
                style={{ cursor: 'pointer' }}
              />
              <label htmlFor="rememberMe" style={{ fontSize: '0.85rem', cursor: 'pointer', color: 'var(--muted-foreground)' }}>
                Remember me
              </label>
            </div>

            <button
              type="submit"
              disabled={loading}
              className="btn-primary btn-lg"
              id="login-submit-btn"
              style={{ width: '100%', marginTop: '0.5rem' }}
            >
              {loading ? 'Authenticating...' : 'Log In'}
              {!loading && <ArrowRight size={16} />}
            </button>
          </form>

          {/* Navigation link to Sign Up */}
          <div
            style={{
              marginTop: '2rem',
              textAlign: 'center',
              fontSize: '0.885rem',
              color: 'var(--muted-foreground)',
            }}
          >
            Don't have an account?{' '}
            <Link
              to="/signup"
              id="goto-signup-link"
              style={{
                fontWeight: 600,
                color: 'var(--foreground)',
                textDecoration: 'underline',
              }}
            >
              Sign up
            </Link>
          </div>
        </div>
      </div>

      <style>{`
        @media (max-width: 900px) {
          .login-left-panel {
            display: none !important;
          }
        }
      `}</style>
    </div>
  );
}
