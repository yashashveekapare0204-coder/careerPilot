import React from 'react';
import { useNavigate } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';

export default function Logo({ size = 'medium', className = '' }) {
  const navigate = useNavigate();
  const { user } = useAuth();

  const handleClick = (e) => {
    e.preventDefault();
    if (user) {
      navigate('/home');
    } else {
      navigate('/');
    }
  };

  const iconSizes = {
    small: 18,
    medium: 22,
    large: 28,
  };

  const textSizes = {
    small: '0.95rem',
    medium: '1.15rem',
    large: '1.45rem',
  };

  const currentIconSize = iconSizes[size] || 22;
  const currentTextSize = textSizes[size] || '1.15rem';

  return (
    <a
      href={user ? '/home' : '/'}
      onClick={handleClick}
      className={`logo-container ${className}`}
      style={{
        display: 'inline-flex',
        alignItems: 'center',
        gap: '0.6rem',
        textDecoration: 'none',
        color: 'var(--foreground)',
        cursor: 'pointer',
        fontWeight: 700,
        letterSpacing: '-0.02em',
      }}
      aria-label="CareerPilot AI Home"
    >
      <div
        style={{
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'center',
          width: currentIconSize + 10,
          height: currentIconSize + 10,
          borderRadius: '8px',
          backgroundColor: 'var(--foreground)',
          color: 'var(--background)',
          flexShrink: 0,
        }}
      >
        {/* Minimal compass arrow with upward trend line */}
        <svg
          width={currentIconSize}
          height={currentIconSize}
          viewBox="0 0 24 24"
          fill="none"
          stroke="currentColor"
          strokeWidth="2.2"
          strokeLinecap="round"
          strokeLinejoin="round"
        >
          {/* Compass arrow */}
          <polygon points="12 3 18 19 12 15 6 19 12 3" fill="currentColor" fillOpacity="0.15" />
          {/* Upward trending growth line */}
          <path d="M12 15 L12 21" />
          <path d="M9 21 L15 21" />
        </svg>
      </div>
      <span style={{ fontSize: currentTextSize, fontWeight: 700 }}>
        CareerPilot <span style={{ fontWeight: 400, opacity: 0.85 }}>AI</span>
      </span>
    </a>
  );
}
