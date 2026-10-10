import React from 'react';
import { useNavigate } from 'react-router-dom';
import {
  FileText,
  Mic,
  Map,
  ArrowRight,
  Flame,
  Award,
  CheckCircle2,
  Clock,
  Sparkles,
  AlertCircle,
} from 'lucide-react';
import { useAuth } from '../context/AuthContext';
import { useTheme } from '../context/ThemeContext';

export default function HomePage() {
  const { user, studentData, readinessMetrics, activityStreak } = useAuth();
  const { theme } = useTheme();
  const navigate = useNavigate();

  // Dynamic "Your Next Best Step" logic
  const getNextBestStep = () => {
    const hasResume = studentData.resumeAnalysis !== null;
    const hasInterviews = studentData.interviewHistory.length > 0;
    const completedTasks = studentData.roadmapTasks.filter(t => t.status === 'Completed').length;
    const totalTasks = studentData.roadmapTasks.length;

    if (!hasResume) {
      return {
        title: 'Upload your resume to begin',
        description: 'Upload your PDF resume to parse technical skills, analyze formatting, and generate tailored questions.',
        actionLabel: 'Upload Resume',
        actionPath: '/resume',
      };
    }

    if (!hasInterviews) {
      return {
        title: 'Your resume analysis is complete. Start a personalized mock interview',
        description: 'Practice questions tailored to your identified projects, tech stack, and target job role.',
        actionLabel: 'Start Mock Interview',
        actionPath: '/interview',
      };
    }

    const latestInterview = studentData.interviewHistory[0];
    if (latestInterview && latestInterview.overallScore < 70) {
      return {
        title: 'Practice weak technical topics identified in your interview',
        description: `Your last interview score was ${latestInterview.overallScore}/100. Review missing points and practice weak questions.`,
        actionLabel: 'Review Results',
        actionPath: '/interview-results',
      };
    }

    if (completedTasks < totalTasks) {
      return {
        title: 'Continue your personalized Career Roadmap',
        description: `You have completed ${completedTasks} of ${totalTasks} tasks. Keep completing weekly milestones to boost readiness.`,
        actionLabel: 'Open Roadmap',
        actionPath: '/roadmap',
      };
    }

    return {
      title: 'Take another mock interview to measure your improvement',
      description: 'You have made strong progress across resume and roadmap milestones. Measure your updated readiness now.',
      actionLabel: 'Start New Interview',
      actionPath: '/interview',
    };
  };

  const nextStep = getNextBestStep();

  // SVG Circular Gauge calculation
  const score = readinessMetrics.overallScore;
  const radius = 62;
  const circumference = 2 * Math.PI * radius;
  const strokeDashoffset = score !== null
    ? circumference - (score / 100) * circumference
    : circumference;

  return (
    <div style={{ display: 'flex', flexDirection: 'column', gap: '2rem' }}>
      {/* Home Header */}
      <div
        style={{
          display: 'flex',
          flexWrap: 'wrap',
          alignItems: 'center',
          justifyContent: 'space-between',
          gap: '1rem',
          borderBottom: '1px solid var(--border)',
          paddingBottom: '1.25rem',
        }}
      >
        <div>
          <h1 style={{ fontSize: '1.85rem', fontWeight: 700, letterSpacing: '-0.02em', marginBottom: '0.25rem' }}>
            Welcome back, {user?.fullName || 'Student'}!
          </h1>
          <p style={{ fontSize: '0.95rem' }}>
            Here is your placement preparation overview.
          </p>
        </div>

        {/* Compact Placement Readiness Score Summary at top-right */}
        <div
          style={{
            display: 'flex',
            alignItems: 'center',
            gap: '0.75rem',
            padding: '0.65rem 1.15rem',
            backgroundColor: 'var(--card)',
            border: '1px solid var(--border)',
            borderRadius: 'var(--radius-md)',
            boxShadow: 'var(--shadow-sm)',
          }}
        >
          <div
            style={{
              width: '32px',
              height: '32px',
              borderRadius: '50%',
              backgroundColor: 'var(--muted)',
              border: '1px solid var(--border)',
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center',
            }}
          >
            <Award size={18} />
          </div>
          <div>
            <div style={{ fontSize: '0.75rem', color: 'var(--muted-foreground)', fontWeight: 600, textTransform: 'uppercase' }}>
              Readiness Status
            </div>
            <div style={{ fontSize: '0.95rem', fontWeight: 700 }}>
              {score !== null ? `${score} / 100` : 'Not Assessed Yet'}
            </div>
          </div>
        </div>
      </div>

      {/* Quick Actions (3 Prominent Buttons) */}
      <div
        style={{
          display: 'grid',
          gridTemplateColumns: 'repeat(auto-fit, minmax(220px, 1fr))',
          gap: '1rem',
        }}
      >
        <button
          onClick={() => navigate('/resume')}
          className="btn-primary"
          style={{ padding: '0.95rem 1.25rem', justifyContent: 'space-between' }}
        >
          <span style={{ display: 'flex', alignItems: 'center', gap: '0.65rem', fontWeight: 600 }}>
            <FileText size={18} />
            Start Resume Analysis
          </span>
          <ArrowRight size={16} />
        </button>

        <button
          onClick={() => navigate('/interview')}
          className="btn-secondary"
          style={{ padding: '0.95rem 1.25rem', justifyContent: 'space-between' }}
        >
          <span style={{ display: 'flex', alignItems: 'center', gap: '0.65rem', fontWeight: 600 }}>
            <Mic size={18} />
            Start Mock Interview
          </span>
          <ArrowRight size={16} />
        </button>

        <button
          onClick={() => navigate('/roadmap')}
          className="btn-secondary"
          style={{ padding: '0.95rem 1.25rem', justifyContent: 'space-between' }}
        >
          <span style={{ display: 'flex', alignItems: 'center', gap: '0.65rem', fontWeight: 600 }}>
            <Map size={18} />
            View Career Roadmap
          </span>
          <ArrowRight size={16} />
        </button>
      </div>

      {/* Main Grid: Left area (Scores + Next Step) & Right area (Skills + Streak) */}
      <div
        style={{
          display: 'grid',
          gridTemplateColumns: 'repeat(12, 1fr)',
          gap: '1.5rem',
        }}
      >
        {/* Large Circular Readiness Score Card (Left 5 cols) */}
        <div
          className="card"
          style={{
            gridColumn: 'span 5',
            display: 'flex',
            flexDirection: 'column',
            alignItems: 'center',
            justifyContent: 'center',
            textAlign: 'center',
            padding: '2rem 1.5rem',
          }}
        >
          <div style={{ position: 'relative', width: '160px', height: '160px', margin: '0.5rem 0 1rem' }}>
            <svg width="160" height="160" viewBox="0 0 160 160" style={{ transform: 'rotate(-90deg)' }}>
              {/* Background grey remaining track */}
              <circle
                cx="80"
                cy="80"
                r={radius}
                fill="none"
                stroke="var(--border)"
                strokeWidth="12"
              />
              {/* Progress arc: black in Light Mode, white in Dark Mode */}
              {score !== null && (
                <circle
                  cx="80"
                  cy="80"
                  r={radius}
                  fill="none"
                  stroke="var(--foreground)"
                  strokeWidth="12"
                  strokeDasharray={circumference}
                  strokeDashoffset={strokeDashoffset}
                  strokeLinecap="round"
                  style={{ transition: 'stroke-dashoffset 0.8s ease' }}
                />
              )}
            </svg>

            {/* Score inside circle */}
            <div
              style={{
                position: 'absolute',
                inset: 0,
                display: 'flex',
                flexDirection: 'column',
                alignItems: 'center',
                justifyContent: 'center',
              }}
            >
              {score !== null ? (
                <>
                  <span style={{ fontSize: '2.5rem', fontWeight: 800, lineHeight: 1 }}>{score}</span>
                  <span style={{ fontSize: '0.785rem', color: 'var(--muted-foreground)', marginTop: '0.2rem' }}>OUT OF 100</span>
                </>
              ) : (
                <span style={{ fontSize: '0.85rem', fontWeight: 600, color: 'var(--muted-foreground)', textAlign: 'center', padding: '0 0.5rem' }}>
                  Not assessed yet
                </span>
              )}
            </div>
          </div>

          <h3 style={{ fontSize: '1.15rem', fontWeight: 700, marginBottom: '0.25rem' }}>
            Placement Readiness
          </h3>
          <p style={{ fontSize: '0.825rem', maxWidth: '280px', marginBottom: '1.25rem' }}>
            {score !== null
              ? 'Weighted score based on resume, mock interview rounds, and roadmap completion.'
              : 'Complete your first resume analysis or mock interview round to calculate your verified score.'}
          </p>

          {score === null ? (
            <button
              onClick={() => navigate('/resume')}
              className="btn-primary btn-sm"
            >
              Begin Preparation
              <ArrowRight size={14} />
            </button>
          ) : (
            <button
              onClick={() => navigate('/readiness')}
              className="btn-outline btn-sm"
            >
              View Full Formula & Breakdown
            </button>
          )}
        </div>

        {/* 4 Compact Score Cards (Right 7 cols) */}
        <div
          style={{
            gridColumn: 'span 7',
            display: 'grid',
            gridTemplateColumns: 'repeat(2, 1fr)',
            gap: '1rem',
          }}
        >
          {/* Card 1: Resume Score */}
          <div className="card" style={{ padding: '1.25rem' }}>
            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '0.75rem' }}>
              <span style={{ fontSize: '0.825rem', fontWeight: 600, color: 'var(--muted-foreground)' }}>
                Resume Score
              </span>
              <FileText size={17} style={{ color: 'var(--muted-foreground)' }} />
            </div>
            <div style={{ fontSize: '1.85rem', fontWeight: 700 }}>
              {readinessMetrics.resumeScore !== null ? `${readinessMetrics.resumeScore}%` : '—'}
            </div>
            <div style={{ fontSize: '0.75rem', color: 'var(--muted-foreground)', marginTop: '0.35rem' }}>
              {readinessMetrics.resumeScore !== null ? 'ATS quality score' : 'No resume uploaded yet'}
            </div>
          </div>

          {/* Card 2: Latest Interview Score */}
          <div className="card" style={{ padding: '1.25rem' }}>
            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '0.75rem' }}>
              <span style={{ fontSize: '0.825rem', fontWeight: 600, color: 'var(--muted-foreground)' }}>
                Latest Interview
              </span>
              <Mic size={17} style={{ color: 'var(--muted-foreground)' }} />
            </div>
            <div style={{ fontSize: '1.85rem', fontWeight: 700 }}>
              {readinessMetrics.latestInterviewScore !== null ? `${readinessMetrics.latestInterviewScore}%` : '—'}
            </div>
            <div style={{ fontSize: '0.75rem', color: 'var(--muted-foreground)', marginTop: '0.35rem' }}>
              {readinessMetrics.latestInterviewScore !== null ? 'Most recent mock evaluation' : 'No mock rounds yet'}
            </div>
          </div>

          {/* Card 3: Interviews Completed */}
          <div className="card" style={{ padding: '1.25rem' }}>
            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '0.75rem' }}>
              <span style={{ fontSize: '0.825rem', fontWeight: 600, color: 'var(--muted-foreground)' }}>
                Interviews Completed
              </span>
              <CheckCircle2 size={17} style={{ color: 'var(--muted-foreground)' }} />
            </div>
            <div style={{ fontSize: '1.85rem', fontWeight: 700 }}>
              {readinessMetrics.interviewsCompleted}
            </div>
            <div style={{ fontSize: '0.75rem', color: 'var(--muted-foreground)', marginTop: '0.35rem' }}>
              Verified practice rounds
            </div>
          </div>

          {/* Card 4: Roadmap Tasks Completed */}
          <div className="card" style={{ padding: '1.25rem' }}>
            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '0.75rem' }}>
              <span style={{ fontSize: '0.825rem', fontWeight: 600, color: 'var(--muted-foreground)' }}>
                Roadmap Tasks
              </span>
              <Map size={17} style={{ color: 'var(--muted-foreground)' }} />
            </div>
            <div style={{ fontSize: '1.85rem', fontWeight: 700 }}>
              {readinessMetrics.roadmapTasksCompleted}
            </div>
            <div style={{ fontSize: '0.75rem', color: 'var(--muted-foreground)', marginTop: '0.35rem' }}>
              Completed preparation tasks
            </div>
          </div>

          {/* Recommended Next Step Card (spans full width of right col) */}
          <div
            className="card"
            style={{
              gridColumn: 'span 2',
              backgroundColor: 'var(--card)',
              border: '1px solid var(--border-strong)',
              display: 'flex',
              flexDirection: 'column',
              justifyContent: 'space-between',
              padding: '1.25rem 1.5rem',
            }}
          >
            <div>
              <div style={{ display: 'flex', alignItems: 'center', gap: '0.5rem', marginBottom: '0.4rem' }}>
                <Sparkles size={16} />
                <span style={{ fontSize: '0.785rem', fontWeight: 700, textTransform: 'uppercase', letterSpacing: '0.04em' }}>
                  Your Next Best Step
                </span>
              </div>
              <h4 style={{ fontSize: '1.05rem', fontWeight: 600, marginBottom: '0.35rem' }}>
                {nextStep.title}
              </h4>
              <p style={{ fontSize: '0.85rem', lineHeight: 1.5 }}>
                {nextStep.description}
              </p>
            </div>

            <div style={{ marginTop: '1rem', display: 'flex', justifyContent: 'flex-end' }}>
              <button
                onClick={() => navigate(nextStep.actionPath)}
                className="btn-primary btn-sm"
              >
                {nextStep.actionLabel}
                <ArrowRight size={14} />
              </button>
            </div>
          </div>
        </div>

        {/* Skill Performance Card (Left 7 cols) */}
        <div
          className="card"
          style={{
            gridColumn: 'span 7',
            padding: '1.5rem',
          }}
        >
          <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '1.25rem' }}>
            <div>
              <h3 style={{ fontSize: '1.1rem', fontWeight: 600 }}>Skill Performance</h3>
              <p style={{ fontSize: '0.8rem' }}>Assessed technical and communication domains</p>
            </div>
            <button
              onClick={() => navigate('/skills')}
              className="btn-ghost btn-sm"
              style={{ fontSize: '0.8rem' }}
            >
              Detailed Gaps <ArrowRight size={13} />
            </button>
          </div>

          <div style={{ display: 'flex', flexDirection: 'column', gap: '1.1rem' }}>
            {[
              { name: 'DSA (Data Structures & Algorithms)', key: 'dsa' },
              { name: 'DBMS (Database Management)', key: 'dbms' },
              { name: 'Object-Oriented Programming (OOP)', key: 'oop' },
              { name: 'Communication Clarity', key: 'communication' },
              { name: 'Problem Solving & Logic', key: 'problemSolving' },
            ].map((skill) => {
              const val = studentData.skillsAssessment[skill.key];
              return (
                <div key={skill.key}>
                  <div style={{ display: 'flex', justifyContent: 'space-between', fontSize: '0.85rem', marginBottom: '0.35rem' }}>
                    <span style={{ fontWeight: 500 }}>{skill.name}</span>
                    <span style={{ fontWeight: 600, color: val !== null ? 'var(--foreground)' : 'var(--muted-foreground)' }}>
                      {val !== null ? `${val}%` : 'Not assessed'}
                    </span>
                  </div>
                  <div style={{ height: '6px', backgroundColor: 'var(--border)', borderRadius: '3px', overflow: 'hidden' }}>
                    <div
                      style={{
                        width: val !== null ? `${val}%` : '0%',
                        height: '100%',
                        backgroundColor: 'var(--foreground)',
                        transition: 'width 0.4s ease',
                      }}
                    />
                  </div>
                </div>
              );
            })}
          </div>
        </div>

        {/* Activity Streak Card (In the BOTTOM-RIGHT AREA of Home Page as strictly required) */}
        <div
          className="card"
          style={{
            gridColumn: 'span 5',
            padding: '1.5rem',
            display: 'flex',
            flexDirection: 'column',
            justifyContent: 'space-between',
          }}
        >
          <div>
            <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginBottom: '1rem' }}>
              <div style={{ display: 'flex', alignItems: 'center', gap: '0.5rem' }}>
                <Flame size={20} />
                <h3 style={{ fontSize: '1.1rem', fontWeight: 600 }}>Activity Streak</h3>
              </div>
              <span className="badge" style={{ fontSize: '0.725rem' }}>
                {activityStreak.currentStreak > 0 ? `${activityStreak.currentStreak} Day Streak` : 'No Active Streak'}
              </span>
            </div>

            <p style={{ fontSize: '0.8rem', marginBottom: '1.25rem' }}>
              Streaks increase only when meaningful tasks (resume analysis, interview rounds, roadmap items) are completed.
            </p>

            <div
              style={{
                display: 'grid',
                gridTemplateColumns: 'repeat(3, 1fr)',
                gap: '0.75rem',
                backgroundColor: 'var(--muted)',
                padding: '1rem',
                borderRadius: 'var(--radius-md)',
                textAlign: 'center',
                marginBottom: '1.25rem',
              }}
            >
              <div>
                <div style={{ fontSize: '1.4rem', fontWeight: 700 }}>{activityStreak.currentStreak}</div>
                <div style={{ fontSize: '0.7rem', color: 'var(--muted-foreground)', textTransform: 'uppercase' }}>Current</div>
              </div>
              <div>
                <div style={{ fontSize: '1.4rem', fontWeight: 700 }}>{activityStreak.longestStreak}</div>
                <div style={{ fontSize: '0.7rem', color: 'var(--muted-foreground)', textTransform: 'uppercase' }}>Longest</div>
              </div>
              <div>
                <div style={{ fontSize: '1.4rem', fontWeight: 700 }}>{activityStreak.activeDaysThisWeek}/7</div>
                <div style={{ fontSize: '0.7rem', color: 'var(--muted-foreground)', textTransform: 'uppercase' }}>This Week</div>
              </div>
            </div>

            {/* Weekly Activity Grid (Mon - Sun) */}
            <div style={{ marginTop: '0.5rem' }}>
              <div style={{ fontSize: '0.775rem', fontWeight: 600, color: 'var(--muted-foreground)', marginBottom: '0.5rem' }}>
                Weekly Activity History
              </div>
              <div style={{ display: 'flex', justifyContent: 'space-between', gap: '0.4rem' }}>
                {['M', 'T', 'W', 'T', 'F', 'S', 'S'].map((day, idx) => {
                  const isActive = activityStreak.weeklyGrid[idx];
                  return (
                    <div key={idx} style={{ display: 'flex', flexDirection: 'column', alignItems: 'center', gap: '0.35rem', flex: 1 }}>
                      <div
                        style={{
                          width: '100%',
                          height: '24px',
                          borderRadius: '4px',
                          backgroundColor: isActive ? 'var(--foreground)' : 'var(--border)',
                          transition: 'background-color 0.2s',
                        }}
                        title={isActive ? 'Active preparation completed' : 'No activity recorded'}
                      />
                      <span style={{ fontSize: '0.7rem', color: 'var(--muted-foreground)' }}>{day}</span>
                    </div>
                  );
                })}
              </div>
            </div>
          </div>
        </div>

        {/* Recent Activity List (Spans full 12 cols at bottom) */}
        <div
          className="card"
          style={{
            gridColumn: 'span 12',
            padding: '1.5rem',
          }}
        >
          <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '1rem' }}>
            <h3 style={{ fontSize: '1.1rem', fontWeight: 600 }}>Recent Activity</h3>
            <span style={{ fontSize: '0.8rem', color: 'var(--muted-foreground)' }}>Logged from real assessments</span>
          </div>

          {studentData.recentActivities && studentData.recentActivities.length > 0 ? (
            <div style={{ display: 'flex', flexDirection: 'column', gap: '0.75rem' }}>
              {studentData.recentActivities.map((act) => (
                <div
                  key={act.id}
                  style={{
                    display: 'flex',
                    alignItems: 'center',
                    justifyContent: 'space-between',
                    padding: '0.75rem 1rem',
                    backgroundColor: 'var(--muted)',
                    borderRadius: 'var(--radius-md)',
                    border: '1px solid var(--border)',
                  }}
                >
                  <div style={{ display: 'flex', alignItems: 'center', gap: '0.75rem' }}>
                    <div
                      style={{
                        width: '28px',
                        height: '28px',
                        borderRadius: '50%',
                        backgroundColor: 'var(--foreground)',
                        color: 'var(--background)',
                        display: 'flex',
                        alignItems: 'center',
                        justifyContent: 'center',
                      }}
                    >
                      {act.type === 'resume' ? <FileText size={14} /> : (act.type === 'interview' ? <Mic size={14} /> : <CheckCircle2 size={14} />)}
                    </div>
                    <span style={{ fontSize: '0.875rem', fontWeight: 500 }}>{act.title}</span>
                  </div>
                  <span style={{ fontSize: '0.785rem', color: 'var(--muted-foreground)' }}>{act.date}</span>
                </div>
              ))}
            </div>
          ) : (
            <div
              style={{
                padding: '2rem',
                textAlign: 'center',
                backgroundColor: 'var(--muted)',
                borderRadius: 'var(--radius-md)',
                color: 'var(--muted-foreground)',
                fontSize: '0.875rem',
              }}
            >
              No activities recorded yet. Complete a resume analysis or mock interview to begin your activity log.
            </div>
          )}
        </div>
      </div>

      <style>{`
        @media (max-width: 960px) {
          .card[style*="gridColumn: span 5"],
          .card[style*="gridColumn: span 7"],
          div[style*="gridColumn: span 7"] {
            grid-column: span 12 !important;
          }
        }
      `}</style>
    </div>
  );
}
