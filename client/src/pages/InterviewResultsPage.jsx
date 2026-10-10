import React from 'react';
import { useNavigate } from 'react-router-dom';
import {
  Award,
  CheckCircle2,
  AlertCircle,
  RotateCcw,
  Map,
  Home,
  Target,
  Sparkles,
  ArrowRight,
  BookOpen,
} from 'lucide-react';
import { useAuth } from '../context/AuthContext';

export default function InterviewResultsPage() {
  const { studentData } = useAuth();
  const navigate = useNavigate();

  const latestResult = studentData.interviewHistory[0];

  if (!latestResult) {
    return (
      <div className="card" style={{ maxWidth: '640px', margin: '3rem auto', textAlign: 'center', padding: '3rem' }}>
        <Award size={48} style={{ opacity: 0.4, margin: '0 auto 1.5rem' }} />
        <h2 style={{ fontSize: '1.5rem', marginBottom: '0.5rem' }}>No Interview Results Yet</h2>
        <p style={{ marginBottom: '2rem' }}>
          You have not completed any mock interview sessions yet. Start a technical or HR mock round to generate your report.
        </p>
        <button onClick={() => navigate('/interview')} className="btn-primary">
          Start Mock Interview
          <ArrowRight size={16} />
        </button>
      </div>
    );
  }

  return (
    <div style={{ maxWidth: '960px', margin: '0 auto', display: 'flex', flexDirection: 'column', gap: '2rem' }}>
      {/* Header */}
      <div style={{ display: 'flex', flexWrap: 'wrap', alignItems: 'center', justifyContent: 'space-between', gap: '1rem' }}>
        <div>
          <h1 style={{ fontSize: '1.85rem', fontWeight: 700, letterSpacing: '-0.02em', marginBottom: '0.35rem' }}>
            Interview Analyzer & Results
          </h1>
          <p style={{ fontSize: '0.95rem' }}>
            Performance breakdown for {latestResult.type} ({latestResult.targetRole}) on {latestResult.date}
          </p>
        </div>

        <div style={{ display: 'flex', gap: '0.75rem', flexWrap: 'wrap' }}>
          <button onClick={() => navigate('/interview')} className="btn-outline btn-sm">
            <RotateCcw size={14} />
            Retry Interview
          </button>
          <button onClick={() => navigate('/home')} className="btn-primary btn-sm">
            <Home size={14} />
            Return to Home
          </button>
        </div>
      </div>

      {/* Main Score & Sub-scores */}
      <div
        className="card"
        style={{
          display: 'grid',
          gridTemplateColumns: 'repeat(auto-fit, minmax(200px, 1fr))',
          gap: '1.5rem',
          padding: '2rem',
        }}
      >
        <div style={{ borderRight: '1px solid var(--border)', paddingRight: '1rem' }}>
          <div style={{ fontSize: '0.8rem', fontWeight: 600, color: 'var(--muted-foreground)', textTransform: 'uppercase' }}>
            Overall Interview Score
          </div>
          <div style={{ fontSize: '3rem', fontWeight: 800, lineHeight: 1.1, marginTop: '0.25rem' }}>
            {latestResult.overallScore} <span style={{ fontSize: '1.4rem', fontWeight: 400, opacity: 0.5 }}>/ 100</span>
          </div>
          <div style={{ fontSize: '0.8rem', color: 'var(--muted-foreground)', marginTop: '0.4rem' }}>
            {latestResult.questionsAnswered} questions evaluated
          </div>
        </div>

        <div>
          <div style={{ fontSize: '0.8rem', fontWeight: 600, color: 'var(--muted-foreground)' }}>Technical Understanding</div>
          <div style={{ fontSize: '1.6rem', fontWeight: 700, marginTop: '0.2rem' }}>
            {latestResult.technicalScore || latestResult.overallScore}%
          </div>
          <div style={{ height: '5px', backgroundColor: 'var(--border)', borderRadius: '3px', marginTop: '0.5rem', overflow: 'hidden' }}>
            <div style={{ width: `${latestResult.technicalScore || latestResult.overallScore}%`, height: '100%', backgroundColor: 'var(--foreground)' }} />
          </div>
        </div>

        <div>
          <div style={{ fontSize: '0.8rem', fontWeight: 600, color: 'var(--muted-foreground)' }}>Correctness & Relevance</div>
          <div style={{ fontSize: '1.6rem', fontWeight: 700, marginTop: '0.2rem' }}>
            {latestResult.correctnessScore || latestResult.overallScore}%
          </div>
          <div style={{ height: '5px', backgroundColor: 'var(--border)', borderRadius: '3px', marginTop: '0.5rem', overflow: 'hidden' }}>
            <div style={{ width: `${latestResult.correctnessScore || latestResult.overallScore}%`, height: '100%', backgroundColor: 'var(--foreground)' }} />
          </div>
        </div>

        <div>
          <div style={{ fontSize: '0.8rem', fontWeight: 600, color: 'var(--muted-foreground)' }}>Communication Feedback</div>
          <div style={{ fontSize: '1.6rem', fontWeight: 700, marginTop: '0.2rem' }}>
            {latestResult.communicationScore || latestResult.overallScore}%
          </div>
          <div style={{ height: '5px', backgroundColor: 'var(--border)', borderRadius: '3px', marginTop: '0.5rem', overflow: 'hidden' }}>
            <div style={{ width: `${latestResult.communicationScore || latestResult.overallScore}%`, height: '100%', backgroundColor: 'var(--foreground)' }} />
          </div>
        </div>
      </div>

      {/* Strengths, Weaknesses, Recommended Topics */}
      <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(280px, 1fr))', gap: '1.5rem' }}>
        <div className="card">
          <h3 style={{ fontSize: '1.05rem', fontWeight: 600, marginBottom: '0.75rem', display: 'flex', alignItems: 'center', gap: '0.5rem' }}>
            <CheckCircle2 size={18} />
            Demonstrated Strengths
          </h3>
          <ul style={{ listStyle: 'none', display: 'flex', flexDirection: 'column', gap: '0.5rem', fontSize: '0.875rem' }}>
            {latestResult.strengths?.map((str, idx) => (
              <li key={idx}>✓ {str}</li>
            ))}
          </ul>
        </div>

        <div className="card">
          <h3 style={{ fontSize: '1.05rem', fontWeight: 600, marginBottom: '0.75rem', display: 'flex', alignItems: 'center', gap: '0.5rem' }}>
            <AlertCircle size={18} />
            Identified Weaknesses
          </h3>
          <ul style={{ listStyle: 'none', display: 'flex', flexDirection: 'column', gap: '0.5rem', fontSize: '0.875rem' }}>
            {latestResult.weaknesses?.map((wk, idx) => (
              <li key={idx}>• {wk}</li>
            ))}
          </ul>
        </div>

        <div className="card">
          <h3 style={{ fontSize: '1.05rem', fontWeight: 600, marginBottom: '0.75rem', display: 'flex', alignItems: 'center', gap: '0.5rem' }}>
            <Sparkles size={18} />
            Recommended Practice Topics
          </h3>
          <ul style={{ listStyle: 'none', display: 'flex', flexDirection: 'column', gap: '0.5rem', fontSize: '0.875rem' }}>
            {latestResult.recommendedTopics?.map((top, idx) => (
              <li key={idx}>→ {top}</li>
            ))}
          </ul>
        </div>
      </div>

      {/* Granular Question-by-Question Review */}
      <div>
        <h2 style={{ fontSize: '1.45rem', fontWeight: 700, marginBottom: '1.25rem' }}>
          Detailed Answer Breakdown
        </h2>

        <div style={{ display: 'flex', flexDirection: 'column', gap: '1.5rem' }}>
          {latestResult.answers?.map((ans, idx) => (
            <div key={idx} className="card" style={{ padding: '1.75rem' }}>
              <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start', marginBottom: '1rem' }}>
                <div>
                  <div className="badge" style={{ marginBottom: '0.4rem' }}>
                    Question {ans.questionNumber || idx + 1} · {ans.category || 'Evaluation'}
                  </div>
                  <h3 style={{ fontSize: '1.15rem', fontWeight: 600 }}>{ans.question}</h3>
                </div>
                <div style={{ textAlign: 'right', flexShrink: 0 }}>
                  <div style={{ fontSize: '1.5rem', fontWeight: 800 }}>{ans.score}</div>
                  <div style={{ fontSize: '0.75rem', color: 'var(--muted-foreground)' }}>SCORE / 100</div>
                </div>
              </div>

              {/* Student's submitted response */}
              <div style={{ marginBottom: '1.25rem', backgroundColor: 'var(--muted)', padding: '1rem', borderRadius: 'var(--radius-md)', border: '1px solid var(--border)' }}>
                <div style={{ fontSize: '0.785rem', fontWeight: 600, color: 'var(--muted-foreground)', marginBottom: '0.35rem', textTransform: 'uppercase' }}>
                  Your Submitted Answer:
                </div>
                <p style={{ fontSize: '0.9rem', color: 'var(--foreground)', whiteSpace: 'pre-wrap' }}>
                  "{ans.studentAnswer}"
                </p>
              </div>

              {/* Feedback cards */}
              <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(280px, 1fr))', gap: '1rem', marginBottom: '1rem' }}>
                <div style={{ padding: '0.85rem', border: '1px solid var(--border)', borderRadius: 'var(--radius-sm)' }}>
                  <div style={{ fontSize: '0.8rem', fontWeight: 600, marginBottom: '0.25rem' }}>Positive Feedback:</div>
                  <p style={{ fontSize: '0.825rem' }}>{ans.positiveFeedback}</p>
                </div>
                <div style={{ padding: '0.85rem', border: '1px solid var(--border)', borderRadius: 'var(--radius-sm)' }}>
                  <div style={{ fontSize: '0.8rem', fontWeight: 600, marginBottom: '0.25rem' }}>Missing Key Points:</div>
                  <p style={{ fontSize: '0.825rem' }}>{ans.missingPoints}</p>
                </div>
              </div>

              {/* Improved Answer Example */}
              <div style={{ padding: '1rem', backgroundColor: 'var(--muted)', borderRadius: 'var(--radius-sm)', border: '1px solid var(--border)' }}>
                <div style={{ fontSize: '0.8rem', fontWeight: 600, marginBottom: '0.25rem', display: 'flex', alignItems: 'center', gap: '0.4rem' }}>
                  <BookOpen size={14} />
                  Example of an Improved High-Scoring Response:
                </div>
                <p style={{ fontSize: '0.85rem', color: 'var(--foreground)' }}>
                  {ans.improvedAnswer}
                </p>
              </div>
            </div>
          ))}
        </div>
      </div>

      {/* Action Navigation Footer */}
      <div style={{ display: 'flex', justifyContent: 'space-between', flexWrap: 'wrap', gap: '1rem', borderTop: '1px solid var(--border)', paddingTop: '1.5rem' }}>
        <button onClick={() => navigate('/interview')} className="btn-outline">
          <RotateCcw size={16} />
          Practice Another Interview
        </button>

        <div style={{ display: 'flex', gap: '0.75rem' }}>
          <button onClick={() => navigate('/skills')} className="btn-secondary">
            <Target size={16} />
            Practice Weak Topics
          </button>
          <button onClick={() => navigate('/roadmap')} className="btn-primary">
            <Map size={16} />
            View Career Roadmap
          </button>
        </div>
      </div>
    </div>
  );
}
