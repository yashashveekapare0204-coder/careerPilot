import React from 'react';
import { useNavigate } from 'react-router-dom';
import {
  FileText,
  Mic,
  Award,
  Target,
  Map,
  TrendingUp,
  CheckCircle,
  ArrowRight,
  ShieldCheck,
  Zap,
  BookOpen,
  Sparkles,
} from 'lucide-react';
import Navbar from '../components/Navbar';
import { useAuth } from '../context/AuthContext';

export default function LandingPage() {
  const { user } = useAuth();
  const navigate = useNavigate();

  const handleStartForFree = () => {
    if (user) {
      navigate('/home');
    } else {
      navigate('/signup');
    }
  };

  const handleToolClick = (path) => {
    if (user) {
      navigate(path);
    } else {
      navigate('/login', {
        state: { message: 'Please log in to access this placement tool, or create an account for free.' },
      });
    }
  };

  const scrollToFeatures = () => {
    const el = document.getElementById('features');
    if (el) el.scrollIntoView({ behavior: 'smooth' });
  };

  return (
    <div style={{ minHeight: '100vh', display: 'flex', flexDirection: 'column' }}>
      <Navbar />

      {/* Hero Section */}
      <section
        style={{
          padding: '5rem 1.5rem 4rem',
          maxWidth: '1240px',
          margin: '0 auto',
          width: '100%',
          textAlign: 'center',
        }}
      >
        <div
          className="badge"
          style={{
            marginBottom: '1.5rem',
            padding: '0.35rem 0.85rem',
            letterSpacing: '0.05em',
          }}
        >
          <Sparkles size={13} />
          AI-Powered Campus Placement Companion
        </div>

        <h1
          style={{
            fontSize: 'clamp(2.5rem, 6vw, 4rem)',
            fontWeight: 800,
            letterSpacing: '-0.03em',
            lineHeight: 1.15,
            maxWidth: '900px',
            margin: '0 auto 1.5rem',
          }}
        >
          Your Career. Your Preparation. Your Future.
        </h1>

        <p
          style={{
            fontSize: '1.2rem',
            maxWidth: '720px',
            margin: '0 auto 2.5rem',
            lineHeight: 1.6,
          }}
        >
          Prepare smarter for placements with AI-powered resume feedback, personalized mock interviews,
          and a career roadmap built around your strengths and weaknesses.
        </p>

        <div
          style={{
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center',
            gap: '1rem',
            flexWrap: 'wrap',
            marginBottom: '4rem',
          }}
        >
          <button
            onClick={handleStartForFree}
            className="btn-primary btn-lg"
            id="hero-start-free-btn"
          >
            Start for Free
            <ArrowRight size={18} />
          </button>
          <button
            onClick={scrollToFeatures}
            className="btn-outline btn-lg"
            id="hero-explore-features-btn"
          >
            Explore Features
          </button>
        </div>

        {/* Clean visual preview of product interface */}
        <div
          style={{
            backgroundColor: 'var(--card)',
            border: '1px solid var(--border)',
            borderRadius: 'var(--radius-lg)',
            padding: '2rem',
            maxWidth: '960px',
            margin: '0 auto',
            boxShadow: 'var(--shadow-lg)',
            textAlign: 'left',
          }}
        >
          <div
            style={{
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'space-between',
              borderBottom: '1px solid var(--border)',
              paddingBottom: '1rem',
              marginBottom: '1.5rem',
            }}
          >
            <div style={{ display: 'flex', alignItems: 'center', gap: '0.5rem' }}>
              <div style={{ width: '10px', height: '10px', borderRadius: '50%', backgroundColor: 'var(--border)' }} />
              <div style={{ width: '10px', height: '10px', borderRadius: '50%', backgroundColor: 'var(--border)' }} />
              <div style={{ width: '10px', height: '10px', borderRadius: '50%', backgroundColor: 'var(--border)' }} />
              <span style={{ fontSize: '0.8rem', color: 'var(--muted-foreground)', marginLeft: '0.5rem' }}>
                careerpilot.ai / student-preview
              </span>
            </div>
            <div className="badge">Interactive Preview</div>
          </div>

          <div
            style={{
              display: 'grid',
              gridTemplateColumns: 'repeat(auto-fit, minmax(240px, 1fr))',
              gap: '1.25rem',
            }}
          >
            {/* Preview Box 1: Readiness Circle */}
            <div
              style={{
                backgroundColor: 'var(--muted)',
                borderRadius: 'var(--radius-md)',
                padding: '1.5rem',
                display: 'flex',
                flexDirection: 'column',
                alignItems: 'center',
                textAlign: 'center',
                border: '1px solid var(--border)',
              }}
            >
              <div
                style={{
                  width: '90px',
                  height: '90px',
                  borderRadius: '50%',
                  border: '6px solid var(--border)',
                  borderTopColor: 'var(--foreground)',
                  borderRightColor: 'var(--foreground)',
                  display: 'flex',
                  alignItems: 'center',
                  justifyContent: 'center',
                  marginBottom: '0.75rem',
                  fontWeight: 700,
                  fontSize: '1.35rem',
                }}
              >
                84
              </div>
              <div style={{ fontWeight: 600, fontSize: '0.9rem' }}>Placement Readiness</div>
              <p style={{ fontSize: '0.785rem', marginTop: '0.25rem' }}>Weighted from verified assessments</p>
            </div>

            {/* Preview Box 2: Resume Score */}
            <div
              style={{
                backgroundColor: 'var(--muted)',
                borderRadius: 'var(--radius-md)',
                padding: '1.5rem',
                border: '1px solid var(--border)',
              }}
            >
              <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: '0.5rem' }}>
                <span style={{ fontSize: '0.825rem', fontWeight: 600 }}>Resume Quality</span>
                <span style={{ fontSize: '0.825rem', fontWeight: 700 }}>88 / 100</span>
              </div>
              <div style={{ height: '6px', backgroundColor: 'var(--border)', borderRadius: '3px', overflow: 'hidden' }}>
                <div style={{ width: '88%', height: '100%', backgroundColor: 'var(--foreground)' }} />
              </div>
              <div style={{ marginTop: '1rem', display: 'flex', flexWrap: 'wrap', gap: '0.4rem' }}>
                <span className="badge" style={{ fontSize: '0.7rem' }}>DSA</span>
                <span className="badge" style={{ fontSize: '0.7rem' }}>React</span>
                <span className="badge" style={{ fontSize: '0.7rem' }}>SQL</span>
                <span className="badge" style={{ fontSize: '0.7rem' }}>Node.js</span>
              </div>
            </div>

            {/* Preview Box 3: Next Best Step */}
            <div
              style={{
                backgroundColor: 'var(--muted)',
                borderRadius: 'var(--radius-md)',
                padding: '1.5rem',
                border: '1px solid var(--border)',
                display: 'flex',
                flexDirection: 'column',
                justifyContent: 'space-between',
              }}
            >
              <div>
                <span className="badge" style={{ marginBottom: '0.5rem' }}>Next Best Step</span>
                <div style={{ fontSize: '0.9rem', fontWeight: 600, marginTop: '0.4rem' }}>
                  Practice Tech Mock Interview
                </div>
                <p style={{ fontSize: '0.785rem', marginTop: '0.35rem' }}>
                  Based on detected skills from your resume, tackle 5 tailored algorithmic questions.
                </p>
              </div>
              <div style={{ marginTop: '0.75rem', fontSize: '0.8rem', fontWeight: 600, display: 'flex', alignItems: 'center', gap: '0.3rem' }}>
                Start Interview <ArrowRight size={13} />
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Features Section */}
      <section
        id="features"
        style={{
          padding: '5rem 1.5rem',
          maxWidth: '1240px',
          margin: '0 auto',
          width: '100%',
        }}
      >
        <div style={{ textAlign: 'center', maxWidth: '640px', margin: '0 auto 3.5rem' }}>
          <div className="badge" style={{ marginBottom: '0.75rem' }}>Key Modules</div>
          <h2 style={{ fontSize: '2.2rem', marginBottom: '0.75rem' }}>
            Built for Systematic Placement Preparation
          </h2>
          <p>
            Every tool is designed to pinpoint weaknesses, guide your daily practice, and track genuine placement readiness.
          </p>
        </div>

        <div
          style={{
            display: 'grid',
            gridTemplateColumns: 'repeat(auto-fit, minmax(320px, 1fr))',
            gap: '1.5rem',
          }}
        >
          {/* Feature 1 */}
          <div className="card">
            <div style={{ width: '42px', height: '42px', borderRadius: '8px', backgroundColor: 'var(--muted)', display: 'flex', alignItems: 'center', justifyContent: 'center', marginBottom: '1.25rem', border: '1px solid var(--border)' }}>
              <FileText size={20} />
            </div>
            <h3 style={{ fontSize: '1.15rem', marginBottom: '0.5rem' }}>Resume Corrector</h3>
            <p style={{ fontSize: '0.9rem' }}>
              Analyze resume quality, skills, projects, formatting, and identify missing technical information essential for ATS screening.
            </p>
          </div>

          {/* Feature 2 */}
          <div className="card">
            <div style={{ width: '42px', height: '42px', borderRadius: '8px', backgroundColor: 'var(--muted)', display: 'flex', alignItems: 'center', justifyContent: 'center', marginBottom: '1.25rem', border: '1px solid var(--border)' }}>
              <Mic size={20} />
            </div>
            <h3 style={{ fontSize: '1.15rem', marginBottom: '0.5rem' }}>AI Interview Coach</h3>
            <p style={{ fontSize: '0.9rem' }}>
              Practice personalized HR and technical interviews customized to your actual projects, tech stack, and target job role.
            </p>
          </div>

          {/* Feature 3 */}
          <div className="card">
            <div style={{ width: '42px', height: '42px', borderRadius: '8px', backgroundColor: 'var(--muted)', display: 'flex', alignItems: 'center', justifyContent: 'center', marginBottom: '1.25rem', border: '1px solid var(--border)' }}>
              <CheckCircle size={20} />
            </div>
            <h3 style={{ fontSize: '1.15rem', marginBottom: '0.5rem' }}>Interview Analyzer</h3>
            <p style={{ fontSize: '0.9rem' }}>
              Receive granular scores, positive feedback, identified missing points, and model answer improvements for every response.
            </p>
          </div>

          {/* Feature 4 */}
          <div className="card">
            <div style={{ width: '42px', height: '42px', borderRadius: '8px', backgroundColor: 'var(--muted)', display: 'flex', alignItems: 'center', justifyContent: 'center', marginBottom: '1.25rem', border: '1px solid var(--border)' }}>
              <Award size={20} />
            </div>
            <h3 style={{ fontSize: '1.15rem', marginBottom: '0.5rem' }}>Placement Readiness</h3>
            <p style={{ fontSize: '0.9rem' }}>
              Understand your current preparation level via a transparent weighted formula combining resume strength, mock rounds, and roadmap execution.
            </p>
          </div>

          {/* Feature 5 */}
          <div className="card">
            <div style={{ width: '42px', height: '42px', borderRadius: '8px', backgroundColor: 'var(--muted)', display: 'flex', alignItems: 'center', justifyContent: 'center', marginBottom: '1.25rem', border: '1px solid var(--border)' }}>
              <Target size={20} />
            </div>
            <h3 style={{ fontSize: '1.15rem', marginBottom: '0.5rem' }}>Skill Gap Finder</h3>
            <p style={{ fontSize: '0.9rem' }}>
              Identify critical gaps in DSA, DBMS, OOP, System Design, and Communication compared against real company hiring bars.
            </p>
          </div>

          {/* Feature 6 */}
          <div className="card">
            <div style={{ width: '42px', height: '42px', borderRadius: '8px', backgroundColor: 'var(--muted)', display: 'flex', alignItems: 'center', justifyContent: 'center', marginBottom: '1.25rem', border: '1px solid var(--border)' }}>
              <Map size={20} />
            </div>
            <h3 style={{ fontSize: '1.15rem', marginBottom: '0.5rem' }}>Career Roadmap Planner</h3>
            <p style={{ fontSize: '0.9rem' }}>
              Receive personalized study milestones with estimated study hours, high-impact activities, and structured weekly goals.
            </p>
          </div>

          {/* Feature 7 */}
          <div className="card" style={{ gridColumn: 'span 1' }}>
            <div style={{ width: '42px', height: '42px', borderRadius: '8px', backgroundColor: 'var(--muted)', display: 'flex', alignItems: 'center', justifyContent: 'center', marginBottom: '1.25rem', border: '1px solid var(--border)' }}>
              <TrendingUp size={20} />
            </div>
            <h3 style={{ fontSize: '1.15rem', marginBottom: '0.5rem' }}>Progress Tracker</h3>
            <p style={{ fontSize: '0.9rem' }}>
              Monitor interview trends, active streak consistency, and topic improvements over 7-day, 30-day, and all-time windows.
            </p>
          </div>
        </div>
      </section>

      {/* Popular Tools Section */}
      <section
        style={{
          padding: '4rem 1.5rem',
          backgroundColor: 'var(--muted)',
          borderTop: '1px solid var(--border)',
          borderBottom: '1px solid var(--border)',
        }}
      >
        <div style={{ maxWidth: '1240px', margin: '0 auto', width: '100%' }}>
          <div style={{ marginBottom: '2.5rem' }}>
            <div className="badge" style={{ marginBottom: '0.5rem' }}>Quick Launch</div>
            <h2 style={{ fontSize: '1.85rem' }}>Popular Preparation Tools</h2>
            <p>Access specialized tools directly to practice or evaluate specific preparation areas.</p>
          </div>

          <div
            style={{
              display: 'grid',
              gridTemplateColumns: 'repeat(auto-fit, minmax(220px, 1fr))',
              gap: '1rem',
            }}
          >
            {[
              { title: 'Resume Corrector', desc: 'Audit resume and fix formatting errors', path: '/resume', icon: FileText },
              { title: 'Interview Analyzer', desc: 'Inspect answer depth & feedback', path: '/interview-results', icon: CheckCircle },
              { title: 'Placement Readiness Checker', desc: 'View complete scoring breakdown', path: '/readiness', icon: Award },
              { title: 'Skill Gap Finder', desc: 'Compare profile against job requirements', path: '/skills', icon: Target },
              { title: 'Career Roadmap Planner', desc: 'Track weekly milestones & study tasks', path: '/roadmap', icon: Map },
            ].map((tool, idx) => {
              const Icon = tool.icon;
              return (
                <div
                  key={idx}
                  onClick={() => handleToolClick(tool.path)}
                  style={{
                    backgroundColor: 'var(--card)',
                    border: '1px solid var(--border)',
                    borderRadius: 'var(--radius-md)',
                    padding: '1.25rem',
                    cursor: 'pointer',
                    display: 'flex',
                    flexDirection: 'column',
                    justifyContent: 'space-between',
                    minHeight: '140px',
                    transition: 'var(--transition)',
                  }}
                  className="card"
                >
                  <div>
                    <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginBottom: '0.75rem' }}>
                      <Icon size={18} />
                      <ArrowRight size={14} style={{ color: 'var(--muted-foreground)' }} />
                    </div>
                    <div style={{ fontWeight: 600, fontSize: '0.95rem', marginBottom: '0.35rem' }}>{tool.title}</div>
                    <div style={{ fontSize: '0.8rem', color: 'var(--muted-foreground)' }}>{tool.desc}</div>
                  </div>
                </div>
              );
            })}
          </div>
        </div>
      </section>

      {/* How It Works Section */}
      <section
        id="how-it-works"
        style={{
          padding: '5rem 1.5rem',
          maxWidth: '1240px',
          margin: '0 auto',
          width: '100%',
        }}
      >
        <div style={{ textAlign: 'center', maxWidth: '640px', margin: '0 auto 3.5rem' }}>
          <div className="badge" style={{ marginBottom: '0.75rem' }}>Step-by-Step Flow</div>
          <h2 style={{ fontSize: '2.2rem', marginBottom: '0.75rem' }}>How CareerPilot AI Works</h2>
          <p>A simple four-step process created by college students for campus placements.</p>
        </div>

        <div
          style={{
            display: 'grid',
            gridTemplateColumns: 'repeat(auto-fit, minmax(240px, 1fr))',
            gap: '1.5rem',
          }}
        >
          {[
            {
              step: '01',
              title: 'Upload your resume',
              desc: 'Drop in your PDF resume to parse technical skills, academic projects, and bullet formatting automatically.',
            },
            {
              step: '02',
              title: 'Practice personalized interviews',
              desc: 'Engage in voice or text interview simulations asking questions derived directly from your verified background.',
            },
            {
              step: '03',
              title: 'Discover strengths & weaknesses',
              desc: 'Get immediate objective grading on technical depth, problem-solving, and communication clarity.',
            },
            {
              step: '04',
              title: 'Follow your career roadmap',
              desc: 'Work through tailored weekly study milestones to systematically convert weak areas into placement assets.',
            },
          ].map((item, idx) => (
            <div
              key={idx}
              className="card"
              style={{ position: 'relative' }}
            >
              <div
                style={{
                  fontSize: '2rem',
                  fontWeight: 800,
                  opacity: 0.3,
                  marginBottom: '0.75rem',
                  fontFamily: 'monospace',
                }}
              >
                {item.step}
              </div>
              <h3 style={{ fontSize: '1.1rem', marginBottom: '0.5rem' }}>{item.title}</h3>
              <p style={{ fontSize: '0.875rem' }}>{item.desc}</p>
            </div>
          ))}
        </div>
      </section>

      {/* Reviews Section */}
      <section
        id="reviews"
        style={{
          padding: '4.5rem 1.5rem',
          backgroundColor: 'var(--muted)',
          borderTop: '1px solid var(--border)',
        }}
      >
        <div style={{ maxWidth: '1240px', margin: '0 auto', width: '100%' }}>
          <div style={{ textAlign: 'center', maxWidth: '640px', margin: '0 auto 3rem' }}>
            <div className="badge" style={{ marginBottom: '0.75rem' }}>Student Experiences</div>
            <h2 style={{ fontSize: '2rem', marginBottom: '0.5rem' }}>Sample Student Feedback</h2>
            <p style={{ fontSize: '0.85rem' }}>
              Representative student reviews illustrating typical interview preparation and resume correction outcomes.
            </p>
          </div>

          <div
            style={{
              display: 'grid',
              gridTemplateColumns: 'repeat(auto-fit, minmax(300px, 1fr))',
              gap: '1.5rem',
            }}
          >
            {[
              {
                quote:
                  'The resume corrector caught three missing metric impacts in my project descriptions. Fixing those helped me clear the initial screening.',
                name: 'Aditya S.',
                role: 'Final Year CSE Student',
                college: 'Campus Batch 2025',
              },
              {
                quote:
                  'Practicing technical mock rounds with questions customized to my React and Node projects was much more helpful than generic question banks.',
                name: 'Pooja M.',
                role: 'Information Technology',
                college: 'Placed at Product MNC',
              },
              {
                quote:
                  'The readiness score gave me an honest picture. Seeing my DSA and communication breakdown guided my final month of focused revision.',
                name: 'Rohan K.',
                role: 'Electronics & Telecomm',
                college: 'SDE Intern 2026',
              },
            ].map((review, idx) => (
              <div
                key={idx}
                className="card"
                style={{
                  display: 'flex',
                  flexDirection: 'column',
                  justifyContent: 'space-between',
                }}
              >
                <p style={{ fontStyle: 'italic', fontSize: '0.925rem', marginBottom: '1.25rem', color: 'var(--foreground)' }}>
                  "{review.quote}"
                </p>
                <div style={{ borderTop: '1px solid var(--border)', paddingTop: '0.75rem' }}>
                  <div style={{ fontWeight: 600, fontSize: '0.9rem' }}>{review.name}</div>
                  <div style={{ fontSize: '0.785rem', color: 'var(--muted-foreground)' }}>
                    {review.role} · {review.college}
                  </div>
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Final Section */}
      <section
        style={{
          padding: '5rem 1.5rem',
          maxWidth: '900px',
          margin: '0 auto',
          textAlign: 'center',
          width: '100%',
        }}
      >
        <h2 style={{ fontSize: 'clamp(2rem, 5vw, 3rem)', fontWeight: 700, marginBottom: '1rem', letterSpacing: '-0.02em' }}>
          Your Placement Journey Starts Here.
        </h2>
        <p style={{ fontSize: '1.1rem', maxWidth: '600px', margin: '0 auto 2rem' }}>
          Analyze your resume, test your technical and behavioral skills in mock rounds, and follow a clear roadmap to placement readiness.
        </p>
        <button
          onClick={handleStartForFree}
          className="btn-primary btn-lg"
          id="final-start-free-btn"
        >
          Start for Free
          <ArrowRight size={18} />
        </button>
      </section>

      {/* Minimal Footer */}
      <footer
        style={{
          marginTop: 'auto',
          borderTop: '1px solid var(--border)',
          backgroundColor: 'var(--card)',
          padding: '2rem 1.5rem',
          fontSize: '0.85rem',
          color: 'var(--muted-foreground)',
        }}
      >
        <div
          style={{
            maxWidth: '1240px',
            margin: '0 auto',
            display: 'flex',
            flexWrap: 'wrap',
            justifyContent: 'space-between',
            alignItems: 'center',
            gap: '1rem',
          }}
        >
          <div>
            © {new Date().getFullYear()} CareerPilot AI. Built for college placement preparation.
          </div>
          <div style={{ display: 'flex', gap: '1.5rem' }}>
            <a href="#features" onClick={scrollToFeatures} style={{ color: 'inherit' }}>Features</a>
            <a href="#how-it-works" style={{ color: 'inherit' }}>How It Works</a>
            <a href="#reviews" style={{ color: 'inherit' }}>Reviews</a>
            <span style={{ color: 'inherit' }}>Privacy & Terms</span>
          </div>
        </div>
      </footer>
    </div>
  );
}
