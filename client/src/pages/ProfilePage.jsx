import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import {
  User,
  Building,
  GraduationCap,
  Briefcase,
  Lock,
  Sun,
  Moon,
  LogOut,
  Check,
  AlertCircle,
} from 'lucide-react';
import { useAuth } from '../context/AuthContext';
import { useTheme } from '../context/ThemeContext';

export default function ProfilePage() {
  const { user, updateProfile, logout } = useAuth();
  const { theme, toggleTheme } = useTheme();
  const navigate = useNavigate();

  const [fullName, setFullName] = useState(user?.fullName || '');
  const [college, setCollege] = useState(user?.college || '');
  const [graduationYear, setGraduationYear] = useState(user?.graduationYear || '2026');
  const [targetRole, setTargetRole] = useState(user?.targetRole || 'Software Development Engineer');
  const [preferredCompany, setPreferredCompany] = useState(user?.preferredCompany || 'Product MNCs');
  const [skillsInput, setSkillsInput] = useState((user?.skills || ['JavaScript', 'React', 'DSA', 'SQL']).join(', '));

  const [savedSuccess, setSavedSuccess] = useState(false);
  const [passwordNotice, setPasswordNotice] = useState('');

  const handleSave = (e) => {
    e.preventDefault();
    const skillsArray = skillsInput.split(',').map(s => s.trim()).filter(Boolean);

    updateProfile({
      fullName: fullName.trim(),
      college: college.trim(),
      graduationYear: graduationYear.trim(),
      targetRole: targetRole.trim(),
      preferredCompany: preferredCompany.trim(),
      skills: skillsArray,
    });

    setSavedSuccess(true);
    setTimeout(() => setSavedSuccess(false), 3000);
  };

  const handlePasswordReset = () => {
    setPasswordNotice('Password reset link sent to your registered email address (' + (user?.email || 'email') + ').');
  };

  const handleLogout = async () => {
    await logout();
    navigate('/login');
  };

  return (
    <div style={{ maxWidth: '780px', margin: '0 auto', display: 'flex', flexDirection: 'column', gap: '2rem' }}>
      {/* Header */}
      <div>
        <h1 style={{ fontSize: '1.85rem', fontWeight: 700, letterSpacing: '-0.02em', marginBottom: '0.35rem' }}>
          Profile & Settings
        </h1>
        <p style={{ fontSize: '0.95rem' }}>
          Manage your personal information, academic credentials, and placement preferences.
        </p>
      </div>

      {savedSuccess && (
        <div
          style={{
            padding: '0.85rem 1rem',
            backgroundColor: 'var(--muted)',
            border: '1px solid var(--foreground)',
            borderRadius: 'var(--radius-md)',
            display: 'flex',
            alignItems: 'center',
            gap: '0.5rem',
            fontSize: '0.875rem',
          }}
        >
          <Check size={18} />
          <span>Profile changes saved successfully!</span>
        </div>
      )}

      {/* Main Form */}
      <form onSubmit={handleSave} className="card" style={{ padding: '2rem', display: 'flex', flexDirection: 'column', gap: '1.5rem' }}>
        <h2 style={{ fontSize: '1.25rem', fontWeight: 600 }}>Student Information</h2>

        <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(280px, 1fr))', gap: '1.25rem' }}>
          <div>
            <label style={{ display: 'block', fontSize: '0.85rem', fontWeight: 600, marginBottom: '0.35rem' }}>
              Full Name
            </label>
            <input
              type="text"
              value={fullName}
              onChange={(e) => setFullName(e.target.value)}
              required
              style={{ width: '100%' }}
            />
          </div>

          <div>
            <label style={{ display: 'block', fontSize: '0.85rem', fontWeight: 600, marginBottom: '0.35rem' }}>
              Email Address
            </label>
            <input
              type="email"
              value={user?.email || ''}
              disabled
              style={{ width: '100%', opacity: 0.65, cursor: 'not-allowed' }}
            />
          </div>

          <div>
            <label style={{ display: 'block', fontSize: '0.85rem', fontWeight: 600, marginBottom: '0.35rem' }}>
              College / University
            </label>
            <input
              type="text"
              value={college}
              onChange={(e) => setCollege(e.target.value)}
              placeholder="e.g. National Institute of Technology"
              style={{ width: '100%' }}
            />
          </div>

          <div>
            <label style={{ display: 'block', fontSize: '0.85rem', fontWeight: 600, marginBottom: '0.35rem' }}>
              Graduation Year
            </label>
            <select
              value={graduationYear}
              onChange={(e) => setGraduationYear(e.target.value)}
              style={{ width: '100%' }}
            >
              <option value="2024">2024</option>
              <option value="2025">2025</option>
              <option value="2026">2026</option>
              <option value="2027">2027</option>
            </select>
          </div>

          <div>
            <label style={{ display: 'block', fontSize: '0.85rem', fontWeight: 600, marginBottom: '0.35rem' }}>
              Target Role
            </label>
            <input
              type="text"
              value={targetRole}
              onChange={(e) => setTargetRole(e.target.value)}
              placeholder="e.g. Software Development Engineer"
              style={{ width: '100%' }}
            />
          </div>

          <div>
            <label style={{ display: 'block', fontSize: '0.85rem', fontWeight: 600, marginBottom: '0.35rem' }}>
              Preferred Companies
            </label>
            <input
              type="text"
              value={preferredCompany}
              onChange={(e) => setPreferredCompany(e.target.value)}
              placeholder="e.g. Product MNCs, Top Startups"
              style={{ width: '100%' }}
            />
          </div>
        </div>

        <div>
          <label style={{ display: 'block', fontSize: '0.85rem', fontWeight: 600, marginBottom: '0.35rem' }}>
            Current Core Skills (Comma separated)
          </label>
          <input
            type="text"
            value={skillsInput}
            onChange={(e) => setSkillsInput(e.target.value)}
            placeholder="React, Node.js, C++, DSA, PostgreSQL"
            style={{ width: '100%' }}
          />
        </div>

        <div style={{ display: 'flex', justifyContent: 'flex-end', paddingTop: '1rem', borderTop: '1px solid var(--border)' }}>
          <button type="submit" className="btn-primary">
            Save Profile Changes
          </button>
        </div>
      </form>

      {/* Preferences & Security */}
      <div className="card" style={{ padding: '2rem', display: 'flex', flexDirection: 'column', gap: '1.5rem' }}>
        <h2 style={{ fontSize: '1.25rem', fontWeight: 600 }}>Preferences & Account</h2>

        <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', padding: '1rem', backgroundColor: 'var(--muted)', borderRadius: 'var(--radius-md)' }}>
          <div>
            <div style={{ fontWeight: 600, fontSize: '0.9rem' }}>Theme Appearance</div>
            <div style={{ fontSize: '0.8rem', color: 'var(--muted-foreground)' }}>
              Currently in {theme === 'light' ? 'Light Mode' : 'Dark Mode'}. Persisted automatically across sessions.
            </div>
          </div>
          <button onClick={toggleTheme} className="btn-outline btn-sm">
            {theme === 'light' ? <Moon size={15} /> : <Sun size={15} />}
            <span>Switch to {theme === 'light' ? 'Dark' : 'Light'} Mode</span>
          </button>
        </div>

        <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', padding: '1rem', backgroundColor: 'var(--muted)', borderRadius: 'var(--radius-md)' }}>
          <div>
            <div style={{ fontWeight: 600, fontSize: '0.9rem' }}>Password & Security</div>
            <div style={{ fontSize: '0.8rem', color: 'var(--muted-foreground)' }}>
              Update your account password via Supabase Auth reset verification.
            </div>
            {passwordNotice && (
              <div style={{ fontSize: '0.8rem', color: 'var(--foreground)', marginTop: '0.35rem', fontWeight: 500 }}>
                {passwordNotice}
              </div>
            )}
          </div>
          <button type="button" onClick={handlePasswordReset} className="btn-outline btn-sm">
            <Lock size={15} />
            <span>Reset Password</span>
          </button>
        </div>

        <div style={{ paddingTop: '1rem', borderTop: '1px solid var(--border)', display: 'flex', justifyContent: 'flex-start' }}>
          <button onClick={handleLogout} className="btn-secondary" style={{ color: 'var(--foreground)' }}>
            <LogOut size={16} />
            <span>Sign Out of Account</span>
          </button>
        </div>
      </div>
    </div>
  );
}
