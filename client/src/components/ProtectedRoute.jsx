import React from 'react';
import { Navigate, useLocation } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';

export default function ProtectedRoute({ children }) {
  const { user, loading } = useAuth();
  const location = useLocation();

  if (loading) {
    return (
      <div
        style={{
          minHeight: '100vh',
          display: 'flex',
          flexDirection: 'column',
          alignItems: 'center',
          justifyContent: 'center',
          backgroundColor: 'var(--background)',
          color: 'var(--foreground)',
          gap: '1rem',
        }}
      >
        <div
          style={{
            width: '32px',
            height: '32px',
            border: '2px solid var(--border)',
            borderTopColor: 'var(--primary)',
            borderRadius: '50%',
            animation: 'spin 0.75s linear infinite',
          }}
        />
        <p style={{ fontSize: '0.9rem', color: 'var(--muted-foreground)' }}>
          Loading CareerPilot AI...
        </p>
        <style>{`
          @keyframes spin {
            to { transform: rotate(360deg); }
          }
        `}</style>
      </div>
    );
  }

  if (!user) {
    // Redirect unauthenticated visitors to Login page with state
    return (
      <Navigate
        to="/login"
        replace
        state={{
          from: location.pathname,
          message: 'Please log in to access this page.',
        }}
      />
    );
  }

  return children;
}
