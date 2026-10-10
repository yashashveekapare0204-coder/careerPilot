import React from 'react';
import { useNavigate } from 'react-router-dom';
import {
  Map,
  CheckCircle2,
  Clock,
  Sparkles,
  ArrowRight,
  Filter,
  CheckSquare,
  Square,
  AlertCircle,
} from 'lucide-react';
import { useAuth } from '../context/AuthContext';

export default function CareerRoadmapPage() {
  const { user, studentData, toggleRoadmapTask } = useAuth();
  const navigate = useNavigate();

  const tasks = studentData.roadmapTasks || [];
  const completedCount = tasks.filter(t => t.status === 'Completed').length;
  const progressPercent = Math.round((completedCount / (tasks.length || 1)) * 100);

  return (
    <div style={{ maxWidth: '960px', margin: '0 auto', display: 'flex', flexDirection: 'column', gap: '2rem' }}>
      {/* Header */}
      <div style={{ display: 'flex', flexWrap: 'wrap', alignItems: 'center', justifyContent: 'space-between', gap: '1rem' }}>
        <div>
          <h1 style={{ fontSize: '1.85rem', fontWeight: 700, letterSpacing: '-0.02em', marginBottom: '0.35rem' }}>
            Career Roadmap Planner
          </h1>
          <p style={{ fontSize: '0.95rem' }}>
            Structured placement study milestones tailored to your assessed gaps and target role ({user?.targetRole || 'Software Development Engineer'}).
          </p>
        </div>

        <button onClick={() => navigate('/interview')} className="btn-primary btn-sm">
          Test Progress in Mock Interview <ArrowRight size={14} />
        </button>
      </div>

      {/* Progress Card */}
      <div
        className="card"
        style={{
          padding: '1.75rem',
          display: 'flex',
          flexDirection: 'column',
          gap: '1rem',
        }}
      >
        <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
          <div>
            <div style={{ fontSize: '0.8rem', fontWeight: 600, color: 'var(--muted-foreground)', textTransform: 'uppercase' }}>
              Overall Roadmap Completion
            </div>
            <div style={{ fontSize: '1.5rem', fontWeight: 700, marginTop: '0.2rem' }}>
              {completedCount} of {tasks.length} Milestones Completed ({progressPercent}%)
            </div>
          </div>
          <span className="badge">
            {completedCount === tasks.length ? 'All Milestones Done!' : 'Active Learning Plan'}
          </span>
        </div>

        <div style={{ height: '8px', backgroundColor: 'var(--border)', borderRadius: '4px', overflow: 'hidden' }}>
          <div
            style={{
              width: `${progressPercent}%`,
              height: '100%',
              backgroundColor: 'var(--foreground)',
              transition: 'width 0.4s ease',
            }}
          />
        </div>
      </div>

      {/* Tasks List */}
      <div style={{ display: 'flex', flexDirection: 'column', gap: '1.25rem' }}>
        {tasks.map((task, index) => {
          const isDone = task.status === 'Completed';
          const isInProgress = task.status === 'In Progress';

          return (
            <div
              key={task.id}
              className="card"
              style={{
                display: 'flex',
                flexDirection: 'column',
                gap: '1rem',
                borderLeft: isDone ? '4px solid var(--foreground)' : (isInProgress ? '4px solid var(--border-strong)' : '1px solid var(--border)'),
                opacity: isDone ? 0.85 : 1,
              }}
            >
              <div style={{ display: 'flex', flexWrap: 'wrap', justifyContent: 'space-between', alignItems: 'flex-start', gap: '1rem' }}>
                <div style={{ flex: 1, minWidth: '280px' }}>
                  <div style={{ display: 'flex', alignItems: 'center', gap: '0.65rem', marginBottom: '0.4rem' }}>
                    <span className="badge" style={{ fontSize: '0.725rem' }}>
                      Week {task.week || 1}
                    </span>
                    <span className="badge" style={{ fontSize: '0.725rem' }}>
                      {task.priority || 'High'} Priority
                    </span>
                    <span
                      style={{
                        fontSize: '0.75rem',
                        fontWeight: 600,
                        padding: '0.15rem 0.55rem',
                        borderRadius: 'var(--radius-full)',
                        backgroundColor: isDone ? 'var(--foreground)' : 'var(--muted)',
                        color: isDone ? 'var(--background)' : 'var(--foreground)',
                      }}
                    >
                      {task.status}
                    </span>
                  </div>

                  <h3 style={{ fontSize: '1.15rem', fontWeight: 700, textDecoration: isDone ? 'line-through' : 'none' }}>
                    {task.topic}
                  </h3>
                  <p style={{ fontSize: '0.875rem', marginTop: '0.35rem' }}>
                    {task.explanation}
                  </p>
                </div>

                {/* Status Switcher Controls */}
                <div style={{ display: 'flex', alignItems: 'center', gap: '0.5rem', flexShrink: 0 }}>
                  <button
                    onClick={() => toggleRoadmapTask(task.id, isDone ? 'Not Started' : 'Completed')}
                    className={isDone ? 'btn-primary btn-sm' : 'btn-outline btn-sm'}
                  >
                    <CheckCircle2 size={15} />
                    <span>{isDone ? 'Completed' : 'Mark Complete'}</span>
                  </button>

                  {!isDone && (
                    <button
                      onClick={() => toggleRoadmapTask(task.id, isInProgress ? 'Not Started' : 'In Progress')}
                      className="btn-ghost btn-sm"
                      style={{ fontSize: '0.8rem' }}
                    >
                      {isInProgress ? 'Reset' : 'In Progress'}
                    </button>
                  )}
                </div>
              </div>

              {/* Task Details */}
              <div
                style={{
                  display: 'grid',
                  gridTemplateColumns: 'repeat(auto-fit, minmax(240px, 1fr))',
                  gap: '1rem',
                  padding: '0.85rem 1rem',
                  backgroundColor: 'var(--muted)',
                  borderRadius: 'var(--radius-md)',
                  fontSize: '0.825rem',
                }}
              >
                <div>
                  <div style={{ fontWeight: 600, color: 'var(--foreground)', marginBottom: '0.15rem' }}>Why it matters:</div>
                  <div style={{ color: 'var(--muted-foreground)' }}>{task.whyItMatters}</div>
                </div>
                <div>
                  <div style={{ fontWeight: 600, color: 'var(--foreground)', marginBottom: '0.15rem' }}>Suggested activity:</div>
                  <div style={{ color: 'var(--muted-foreground)' }}>{task.suggestedActivity}</div>
                </div>
                <div style={{ display: 'flex', alignItems: 'center', gap: '0.4rem', color: 'var(--foreground)', fontWeight: 600 }}>
                  <Clock size={14} />
                  <span>Est: {task.estimatedTime}</span>
                </div>
              </div>
            </div>
          );
        })}
      </div>
    </div>
  );
}
