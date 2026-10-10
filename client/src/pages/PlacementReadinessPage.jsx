import React from 'react';
import { useNavigate } from 'react-router-dom';
import {
  Award,
  FileText,
  Mic,
  Map,
  CheckCircle2,
  AlertTriangle,
  ArrowRight,
  Info,
  Sparkles,
  TrendingUp,
} from 'lucide-react';
import { useAuth } from '../context/AuthContext';

export default function PlacementReadinessPage() {
  const { studentData, readinessMetrics } = useAuth();
  const navigate = useNavigate();

  const score = readinessMetrics.overallScore;

  return (
    <div style={{ maxWidth: '960px', margin: '0 auto', display: 'flex', flexDirection: 'column', gap: '2rem' }}>
      {/* Header */}
      <div>
        <h1 style={{ fontSize: '1.85rem', fontWeight: 700, letterSpacing: '-0.02em', marginBottom: '0.35rem' }}>
          Placement Readiness Index
        </h1>
        <p style={{ fontSize: '0.95rem' }}>
          A documented, multi-factor evaluation of your current campus placement preparedness.
        </p>
      </div>

      {/* Main Readiness Gauge Card */}
      <div
        className="card"
        style={{
          display: 'flex',
          flexWrap: 'wrap',
          alignItems: 'center',
          justifyContent: 'space-between',
          gap: '2rem',
          padding: '2.5rem',
        }}
      >
        <div style={{ maxWidth: '440px' }}>
          <div className="badge" style={{ marginBottom: '0.5rem' }}>
            Formula-Weighted Assessment
          </div>
          <h2 style={{ fontSize: '1.75rem', fontWeight: 800, marginBottom: '0.5rem' }}>
            {score !== null ? `${score} / 100` : 'Not Assessed Yet'}
          </h2>
          <p style={{ fontSize: '0.925rem', marginBottom: '1.5rem', lineHeight: 1.6 }}>
            {score !== null
              ? `Your readiness stands at ${score}%. Calculated from your latest resume ATS audit, technical/HR interview scores, and completed study roadmap milestones.`
              : 'You have not yet completed enough verified assessments. Complete your resume analysis or a mock interview to establish your baseline score.'}
          </p>

          <div style={{ display: 'flex', gap: '0.75rem', flexWrap: 'wrap' }}>
            <button onClick={() => navigate('/resume')} className="btn-primary btn-sm">
              <FileText size={14} />
              Resume Corrector
            </button>
            <button onClick={() => navigate('/interview')} className="btn-secondary btn-sm">
              <Mic size={14} />
              Take Mock Interview
            </button>
          </div>
        </div>

        {/* Visual Progress Meter */}
        <div
          style={{
            width: '180px',
            height: '180px',
            borderRadius: '50%',
            border: '14px solid var(--border)',
            borderTopColor: score !== null ? 'var(--foreground)' : 'var(--border)',
            borderRightColor: score && score > 50 ? 'var(--foreground)' : 'var(--border)',
            borderBottomColor: score && score > 75 ? 'var(--foreground)' : 'var(--border)',
            display: 'flex',
            flexDirection: 'column',
            alignItems: 'center',
            justifyContent: 'center',
            textAlign: 'center',
          }}
        >
          <span style={{ fontSize: '2.4rem', fontWeight: 800 }}>
            {score !== null ? score : '0'}
          </span>
          <span style={{ fontSize: '0.75rem', color: 'var(--muted-foreground)', fontWeight: 600 }}>READINESS %</span>
        </div>
      </div>

      {/* Transparent Formula Breakdown */}
      <div className="card">
        <h3 style={{ fontSize: '1.15rem', fontWeight: 700, marginBottom: '0.5rem' }}>
          Documented Formula & Weight Distribution
        </h3>
        <p style={{ fontSize: '0.85rem', marginBottom: '1.5rem' }}>
          Readiness = (Resume Score × 30%) + (Mock Interview Score × 35%) + (Technical Skills × 20%) + (Roadmap Completion × 15%)
        </p>

        <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(200px, 1fr))', gap: '1rem' }}>
          {/* Factor 1: Resume */}
          <div style={{ padding: '1rem', backgroundColor: 'var(--muted)', borderRadius: 'var(--radius-md)', border: '1px solid var(--border)' }}>
            <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: '0.35rem' }}>
              <span style={{ fontSize: '0.825rem', fontWeight: 600 }}>1. Resume ATS Quality</span>
              <span style={{ fontSize: '0.75rem', fontWeight: 700 }}>Weight: 30%</span>
            </div>
            <div style={{ fontSize: '1.4rem', fontWeight: 700 }}>
              {readinessMetrics.resumeScore !== null ? `${readinessMetrics.resumeScore}%` : 'Pending'}
            </div>
            <div style={{ fontSize: '0.75rem', color: 'var(--muted-foreground)', marginTop: '0.25rem' }}>
              Bullet impact, formatting, skills
            </div>
          </div>

          {/* Factor 2: Mock Interview */}
          <div style={{ padding: '1rem', backgroundColor: 'var(--muted)', borderRadius: 'var(--radius-md)', border: '1px solid var(--border)' }}>
            <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: '0.35rem' }}>
              <span style={{ fontSize: '0.825rem', fontWeight: 600 }}>2. Interview Performance</span>
              <span style={{ fontSize: '0.75rem', fontWeight: 700 }}>Weight: 35%</span>
            </div>
            <div style={{ fontSize: '1.4rem', fontWeight: 700 }}>
              {readinessMetrics.latestInterviewScore !== null ? `${readinessMetrics.latestInterviewScore}%` : 'Pending'}
            </div>
            <div style={{ fontSize: '0.75rem', color: 'var(--muted-foreground)', marginTop: '0.25rem' }}>
              Technical accuracy & depth
            </div>
          </div>

          {/* Factor 3: Technical Skills */}
          <div style={{ padding: '1rem', backgroundColor: 'var(--muted)', borderRadius: 'var(--radius-md)', border: '1px solid var(--border)' }}>
            <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: '0.35rem' }}>
              <span style={{ fontSize: '0.825rem', fontWeight: 600 }}>3. Technical Assessment</span>
              <span style={{ fontSize: '0.75rem', fontWeight: 700 }}>Weight: 20%</span>
            </div>
            <div style={{ fontSize: '1.4rem', fontWeight: 700 }}>
              {readinessMetrics.avgSkillScore !== null ? `${readinessMetrics.avgSkillScore}%` : 'Pending'}
            </div>
            <div style={{ fontSize: '0.75rem', color: 'var(--muted-foreground)', marginTop: '0.25rem' }}>
              DSA, DBMS, OOP, System Concepts
            </div>
          </div>

          {/* Factor 4: Roadmap Completion */}
          <div style={{ padding: '1rem', backgroundColor: 'var(--muted)', borderRadius: 'var(--radius-md)', border: '1px solid var(--border)' }}>
            <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: '0.35rem' }}>
              <span style={{ fontSize: '0.825rem', fontWeight: 600 }}>4. Roadmap Execution</span>
              <span style={{ fontSize: '0.75rem', fontWeight: 700 }}>Weight: 15%</span>
            </div>
            <div style={{ fontSize: '1.4rem', fontWeight: 700 }}>
              {readinessMetrics.roadmapPercent}%
            </div>
            <div style={{ fontSize: '0.75rem', color: 'var(--muted-foreground)', marginTop: '0.25rem' }}>
              {readinessMetrics.roadmapTasksCompleted} tasks finished
            </div>
          </div>
        </div>
      </div>

      {/* Strengths & Improvement Recommendations */}
      <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(280px, 1fr))', gap: '1.5rem' }}>
        <div className="card">
          <h3 style={{ fontSize: '1.05rem', fontWeight: 600, marginBottom: '0.75rem', display: 'flex', alignItems: 'center', gap: '0.5rem' }}>
            <CheckCircle2 size={18} />
            Current Placement Strengths
          </h3>
          <ul style={{ listStyle: 'none', display: 'flex', flexDirection: 'column', gap: '0.5rem', fontSize: '0.875rem' }}>
            <li>✓ Consistent progress in core web architecture & problem-solving.</li>
            <li>✓ Resume formatting conforms to single-column ATS requirements.</li>
            <li>✓ Structured answers with relevant terminology on technical prompts.</li>
          </ul>
        </div>

        <div className="card">
          <h3 style={{ fontSize: '1.05rem', fontWeight: 600, marginBottom: '0.75rem', display: 'flex', alignItems: 'center', gap: '0.5rem' }}>
            <TrendingUp size={18} />
            High-Impact Actions to Increase Score
          </h3>
          <ul style={{ listStyle: 'none', display: 'flex', flexDirection: 'column', gap: '0.5rem', fontSize: '0.875rem' }}>
            <li>→ Complete next 2 roadmap milestones in SQL query optimization (+4% readiness).</li>
            <li>→ Take an advanced mock technical round with voice response (+6% readiness).</li>
            <li>→ Quantify project impact metrics on resume bullets (+3% readiness).</li>
          </ul>
        </div>
      </div>

      {/* Mandatory Employment Disclaimer as per Section 14 */}
      <div
        style={{
          padding: '1.25rem',
          backgroundColor: 'var(--muted)',
          border: '1px solid var(--border)',
          borderRadius: 'var(--radius-md)',
          display: 'flex',
          gap: '0.75rem',
          alignItems: 'flex-start',
        }}
      >
        <Info size={20} style={{ flexShrink: 0, marginTop: '0.15rem' }} />
        <div style={{ fontSize: '0.825rem', lineHeight: 1.5 }}>
          <strong>Notice:</strong> Placement readiness is an estimate of candidate preparation based on self-reported inputs,
          automated resume heuristics, and AI-evaluated mock interview rounds. It does not constitute a guarantee of campus placement,
          employment offers, or interview clearances.
        </div>
      </div>
    </div>
  );
}
