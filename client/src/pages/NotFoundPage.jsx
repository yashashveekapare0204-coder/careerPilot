import React from 'react';
import { useNavigate } from 'react-router-dom';
import { Home, LogIn, ArrowLeft } from 'lucide-react';
import Logo from '../components/Logo';
import { useAuth } from '../context/AuthContext';

export default function NotFoundPage() {
  const navigate = useNavigate();
  const { user } = useAuth();

  return (
    <div
      style={{
        minHeight: '100vh',
        display: 'flex',
        flexDirection: 'column',
        alignItems: 'center',
        justifyContent: 'center',
        padding: '2rem',
        textAlign: 'center',
        backgroundColor: 'var(--background)',
        color: 'var(--foreground)',
      }}
    >
      <div style={{ marginBottom: '2rem' }}>
        <Logo size="large" />
      </div>

      <div
        className="card"
        style={{
          maxWidth: '520px',
          width: '100%',
          padding: '3rem 2rem',
          display: 'flex',
          flexDirection: 'column',
          alignItems: 'center',
          gap: '1.25rem',
        }}
      >
        <div
          style={{
            fontSize: '4.5rem',
            fontWeight: 800,
            lineHeight: 1,
            letterSpacing: '-0.03em',
            fontFamily: 'monospace',
          }}
        >
          404
        </div>

        <h1 style={{ fontSize: '1.5rem', fontWeight: 700 }}>
          Page Not Found
        </h1>

        <p style={{ fontSize: '0.925rem', lineHeight: 1.5, color: 'var(--muted-foreground)' }}>
          The link you followed may be broken or the page may have been moved. Return to your placement preparation.
        </p>

        <div style={{ display: 'flex', gap: '0.75rem', flexWrap: 'wrap', justifyContent: 'center', marginTop: '1rem' }}>
          {user ? (
            <button
              onClick={() => navigate('/home')}
              className="btn-primary"
              id="not-found-return-home-btn"
            >
              <Home size={16} />
              Return to Home
            </button>
          ) : (
            <>
              <button
                onClick={() => navigate('/')}
                className="btn-outline"
                id="not-found-return-landing-btn"
              >
                <ArrowLeft size={16} />
                Landing Page
              </button>
              <button
                onClick={() => navigate('/login')}
                className="btn-primary"
                id="not-found-go-login-btn"
              >
                <LogIn size={16} />
                Go to Login
              </button>
            </>
          )}
        </div>
      </div>
    </div>
  );
}
