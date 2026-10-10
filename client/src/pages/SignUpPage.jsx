import React, { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { Eye, EyeOff, Sun, Moon, ArrowRight, AlertCircle, CheckCircle2 } from 'lucide-react';
import Logo from '../components/Logo';
import { useAuth } from '../context/AuthContext';
import { useTheme } from '../context/ThemeContext';

export default function SignUpPage() {
  const [fullName, setFullName] = useState('');
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [confirmPassword, setConfirmPassword] = useState('');
  const [showPassword, setShowPassword] = useState(false);
  const [agreeTerms, setAgreeTerms] = useState(false);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');

  const { signup } = useAuth();
  const { theme, toggleTheme } = useTheme();
  const navigate = useNavigate();

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError('');

    if (!fullName.trim() || !email.trim() || !password) {
      setError('Please fill in all required fields.');
      return;
    }

    if (password.length < 6) {
      setError('Password must be at least 6 characters.');
      return;
    }

    if (password !== confirmPassword) {
      setError('Passwords do not match. Please verify both entries.');
      return;
    }

    if (!agreeTerms) {
      setError('Please accept the Terms of Service and Privacy Policy to proceed.');
      return;
    }

    setLoading(true);
    try {
      const result = await signup({
        fullName: fullName.trim(),
        email: email.trim(),
        password,
      });

      if (result.success) {
        navigate('/home');
      } else {
        setError(result.error || 'Failed to create account.');
      }
    } catch (err) {
      setError(err.message || 'An error occurred during account creation.');
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

      {/* Form Panel (Left) */}
      <div
        style={{
          flex: 1,
          display: 'flex',
          flexDirection: 'column',
          justifyContent: 'center',
          alignItems: 'center',
          padding: '2.5rem',
          borderRight: '1px solid var(--border)',
        }}
      >
        <div style={{ width: '100%', maxWidth: '440px' }}>
          <div style={{ marginBottom: '1.75rem' }}>
            <div style={{ marginBottom: '1.5rem' }}>
              <Logo size="medium" />
            </div>
            <h1 style={{ fontSize: '2rem', fontWeight: 700, marginBottom: '0.4rem' }}>
              Create Your Account
            </h1>
            <p style={{ fontSize: '0.95rem' }}>
              Start building your placement readiness today.
            </p>
          </div>

          {/* Error notice */}
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

          <form onSubmit={handleSubmit} style={{ display: 'flex', flexDirection: 'column', gap: '1.15rem' }}>
            <div>
              <label
                htmlFor="signup-name"
                style={{ display: 'block', fontSize: '0.85rem', fontWeight: 600, marginBottom: '0.35rem' }}
              >
                Full Name
              </label>
              <input
                id="signup-name"
                type="text"
                value={fullName}
                onChange={(e) => setFullName(e.target.value)}
                placeholder="Yashashvee Kapare"
                required
                style={{ width: '100%' }}
                autoComplete="name"
              />
            </div>

            <div>
              <label
                htmlFor="signup-email"
                style={{ display: 'block', fontSize: '0.85rem', fontWeight: 600, marginBottom: '0.35rem' }}
              >
                Email Address
              </label>
              <input
                id="signup-email"
                type="email"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                placeholder="yashashvee@college.edu"
                required
                style={{ width: '100%' }}
                autoComplete="email"
              />
            </div>

            <div>
              <label
                htmlFor="signup-password"
                style={{ display: 'block', fontSize: '0.85rem', fontWeight: 600, marginBottom: '0.35rem' }}
              >
                Password
              </label>
              <div style={{ position: 'relative' }}>
                <input
                  id="signup-password"
                  type={showPassword ? 'text' : 'password'}
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  placeholder="At least 6 characters"
                  required
                  style={{ width: '100%', paddingRight: '2.5rem' }}
                  autoComplete="new-password"
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

            <div>
              <label
                htmlFor="signup-confirm-password"
                style={{ display: 'block', fontSize: '0.85rem', fontWeight: 600, marginBottom: '0.35rem' }}
              >
                Confirm Password
              </label>
              <input
                id="signup-confirm-password"
                type={showPassword ? 'text' : 'password'}
                value={confirmPassword}
                onChange={(e) => setConfirmPassword(e.target.value)}
                placeholder="Confirm your password"
                required
                style={{ width: '100%' }}
                autoComplete="new-password"
              />
            </div>

            <div style={{ display: 'flex', alignItems: 'flex-start', gap: '0.6rem', marginTop: '0.2rem' }}>
              <input
                type="checkbox"
                id="agreeTerms"
                checked={agreeTerms}
                onChange={(e) => setAgreeTerms(e.target.checked)}
                style={{ marginTop: '0.2rem', cursor: 'pointer' }}
                required
              />
              <label htmlFor="agreeTerms" style={{ fontSize: '0.825rem', color: 'var(--muted-foreground)', cursor: 'pointer' }}>
                I agree to the Terms of Service and Privacy Policy for student placement preparation.
              </label>
            </div>

            <button
              type="submit"
              disabled={loading}
              className="btn-primary btn-lg"
              id="signup-submit-btn"
              style={{ width: '100%', marginTop: '0.5rem' }}
            >
              {loading ? 'Creating Account...' : 'Create Account'}
              {!loading && <ArrowRight size={16} />}
            </button>
          </form>

          {/* Navigation link to Login */}
          <div
            style={{
              marginTop: '1.75rem',
              textAlign: 'center',
              fontSize: '0.885rem',
              color: 'var(--muted-foreground)',
            }}
          >
            Already have an account?{' '}
            <Link
              to="/login"
              id="goto-login-link"
              style={{
                fontWeight: 600,
                color: 'var(--foreground)',
                textDecoration: 'underline',
              }}
            >
              Log in
            </Link>
          </div>
        </div>
      </div>

      {/* Information Panel (Right) */}
      <div
        className="signup-right-panel"
        style={{
          flex: 1,
          padding: '4rem',
          display: 'flex',
          flexDirection: 'column',
          justifyContent: 'center',
          backgroundColor: 'var(--card)',
        }}
      >
        <div style={{ maxWidth: '460px' }}>
          <h2 style={{ fontSize: '2rem', fontWeight: 700, marginBottom: '1rem' }}>
            What is CareerPilot AI?
          </h2>
          <p style={{ fontSize: '1.05rem', lineHeight: 1.6, marginBottom: '2.5rem' }}>
            CareerPilot AI brings your placement preparation into one place. Analyze your resume, practice
            personalized interviews, understand your weak areas, and follow a roadmap designed to help you improve.
          </p>

          <div style={{ display: 'flex', flexDirection: 'column', gap: '1.5rem' }}>
            <div style={{ display: 'flex', gap: '1rem', alignItems: 'flex-start' }}>
              <div
                style={{
                  width: '32px',
                  height: '32px',
                  borderRadius: '50%',
                  backgroundColor: 'var(--foreground)',
                  color: 'var(--background)',
                  display: 'flex',
                  alignItems: 'center',
                  justifyContent: 'center',
                  flexShrink: 0,
                  marginTop: '0.1rem',
                }}
              >
                <CheckCircle2 size={18} />
              </div>
              <div>
                <h4 style={{ fontSize: '1rem', marginBottom: '0.2rem' }}>Personalized AI feedback</h4>
                <p style={{ fontSize: '0.875rem' }}>
                  Mock interview questions and resume evaluations generated directly from your specific projects and skills.
                </p>
              </div>
            </div>

            <div style={{ display: 'flex', gap: '1rem', alignItems: 'flex-start' }}>
              <div
                style={{
                  width: '32px',
                  height: '32px',
                  borderRadius: '50%',
                  backgroundColor: 'var(--foreground)',
                  color: 'var(--background)',
                  display: 'flex',
                  alignItems: 'center',
                  justifyContent: 'center',
                  flexShrink: 0,
                  marginTop: '0.1rem',
                }}
              >
                <CheckCircle2 size={18} />
              </div>
              <div>
                <h4 style={{ fontSize: '1rem', marginBottom: '0.2rem' }}>All placement tools in one place</h4>
                <p style={{ fontSize: '0.875rem' }}>
                  No juggling disparate question lists, resume tips, and roadmaps. Everything integrates into one workflow.
                </p>
              </div>
            </div>

            <div style={{ display: 'flex', gap: '1rem', alignItems: 'flex-start' }}>
              <div
                style={{
                  width: '32px',
                  height: '32px',
                  borderRadius: '50%',
                  backgroundColor: 'var(--foreground)',
                  color: 'var(--background)',
                  display: 'flex',
                  alignItems: 'center',
                  justifyContent: 'center',
                  flexShrink: 0,
                  marginTop: '0.1rem',
                }}
              >
                <CheckCircle2 size={18} />
              </div>
              <div>
                <h4 style={{ fontSize: '1rem', marginBottom: '0.2rem' }}>Progress tracking over time</h4>
                <p style={{ fontSize: '0.875rem' }}>
                  Track your preparation streak, watch your readiness score climb, and know exactly when you are ready.
                </p>
              </div>
            </div>
          </div>
        </div>
      </div>

      <style>{`
        @media (max-width: 900px) {
          .signup-right-panel {
            display: none !important;
          }
        }
      `}</style>
    </div>
  );
}
