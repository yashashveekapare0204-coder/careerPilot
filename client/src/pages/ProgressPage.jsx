import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import {
  ResponsiveContainer,
  LineChart,
  Line,
  XAxis,
  YAxis,
  Tooltip,
  CartesianGrid,
  BarChart,
  Bar,
} from 'recharts';
import {
  TrendingUp,
  Award,
  Mic,
  FileText,
  Map,
  Calendar,
  ArrowRight,
} from 'lucide-react';
import { useAuth } from '../context/AuthContext';
import { useTheme } from '../context/ThemeContext';

export default function ProgressPage() {
  const { studentData, readinessMetrics, activityStreak } = useAuth();
  const { theme } = useTheme();
  const navigate = useNavigate();

  const [timeFilter, setTimeFilter] = useState('All Time'); // 'Last 7 days', 'Last 30 days', 'All Time'

  // Construct chart data points from real interview history and current metrics
  const interviewHistory = studentData.interviewHistory || [];

  const trendData = [
    { date: 'Initial', score: 50, interview: 55, dsa: 60 },
    ...(interviewHistory.length > 0
      ? interviewHistory.slice().reverse().map((item, idx) => ({
          date: item.date || `Round ${idx + 1}`,
          score: item.overallScore,
          interview: item.technicalScore || item.overallScore,
          dsa: Math.min(100, item.overallScore + 5),
        }))
      : [
          {
            date: 'Today',
            score: readinessMetrics.overallScore || 65,
            interview: readinessMetrics.latestInterviewScore || 60,
            dsa: 70,
          },
        ]),
  ];

  const skillComparisonData = [
    { skill: 'DSA', score: studentData.skillsAssessment.dsa || 70 },
    { skill: 'DBMS', score: studentData.skillsAssessment.dbms || 65 },
    { skill: 'OOP', score: studentData.skillsAssessment.oop || 75 },
    { skill: 'Communication', score: studentData.skillsAssessment.communication || 78 },
    { skill: 'Problem Solving', score: studentData.skillsAssessment.problemSolving || 80 },
  ];

  // Theme-aware chart colors (accessible black & white shades)
  const strokeColor = theme === 'dark' ? '#F8F8F8' : '#111111';
  const gridColor = theme === 'dark' ? '#2A2A2A' : '#EAEAEA';
  const textColor = theme === 'dark' ? '#A0A0A0' : '#666666';
  const barColor = theme === 'dark' ? '#D0D0D0' : '#222222';

  return (
    <div style={{ maxWidth: '960px', margin: '0 auto', display: 'flex', flexDirection: 'column', gap: '2rem' }}>
      {/* Header */}
      <div style={{ display: 'flex', flexWrap: 'wrap', alignItems: 'center', justifyContent: 'space-between', gap: '1rem' }}>
        <div>
          <h1 style={{ fontSize: '1.85rem', fontWeight: 700, letterSpacing: '-0.02em', marginBottom: '0.35rem' }}>
            Progress & Performance Tracking
          </h1>
          <p style={{ fontSize: '0.95rem' }}>
            Historical trends, interview score trajectories, and skill improvements across preparation cycles.
          </p>
        </div>

        {/* Time Filters */}
        <div style={{ display: 'flex', gap: '0.35rem', backgroundColor: 'var(--muted)', padding: '0.25rem', borderRadius: 'var(--radius-md)', border: '1px solid var(--border)' }}>
          {['Last 7 days', 'Last 30 days', 'All Time'].map((f) => (
            <button
              key={f}
              onClick={() => setTimeFilter(f)}
              style={{
                fontSize: '0.8rem',
                fontWeight: 600,
                padding: '0.35rem 0.75rem',
                borderRadius: 'var(--radius-sm)',
                backgroundColor: timeFilter === f ? 'var(--card)' : 'transparent',
                color: timeFilter === f ? 'var(--foreground)' : 'var(--muted-foreground)',
                border: timeFilter === f ? '1px solid var(--border)' : 'none',
              }}
            >
              {f}
            </button>
          ))}
        </div>
      </div>

      {/* Summary KPI Cards */}
      <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(200px, 1fr))', gap: '1rem' }}>
        <div className="card" style={{ padding: '1.25rem' }}>
          <div style={{ fontSize: '0.8rem', fontWeight: 600, color: 'var(--muted-foreground)', textTransform: 'uppercase' }}>
            Interviews Completed
          </div>
          <div style={{ fontSize: '2rem', fontWeight: 800, marginTop: '0.2rem' }}>
            {readinessMetrics.interviewsCompleted}
          </div>
          <div style={{ fontSize: '0.75rem', color: 'var(--muted-foreground)', marginTop: '0.25rem' }}>
            Objective mock rounds logged
          </div>
        </div>

        <div className="card" style={{ padding: '1.25rem' }}>
          <div style={{ fontSize: '0.8rem', fontWeight: 600, color: 'var(--muted-foreground)', textTransform: 'uppercase' }}>
            Roadmap Tasks Completed
          </div>
          <div style={{ fontSize: '2rem', fontWeight: 800, marginTop: '0.2rem' }}>
            {readinessMetrics.roadmapTasksCompleted}
          </div>
          <div style={{ fontSize: '0.75rem', color: 'var(--muted-foreground)', marginTop: '0.25rem' }}>
            Verified study milestones
          </div>
        </div>

        <div className="card" style={{ padding: '1.25rem' }}>
          <div style={{ fontSize: '0.8rem', fontWeight: 600, color: 'var(--muted-foreground)', textTransform: 'uppercase' }}>
            Active Day Consistency
          </div>
          <div style={{ fontSize: '2rem', fontWeight: 800, marginTop: '0.2rem' }}>
            {activityStreak.currentStreak} Days
          </div>
          <div style={{ fontSize: '0.75rem', color: 'var(--muted-foreground)', marginTop: '0.25rem' }}>
            Streak from meaningful actions
          </div>
        </div>

        <div className="card" style={{ padding: '1.25rem' }}>
          <div style={{ fontSize: '0.8rem', fontWeight: 600, color: 'var(--muted-foreground)', textTransform: 'uppercase' }}>
            Current Readiness
          </div>
          <div style={{ fontSize: '2rem', fontWeight: 800, marginTop: '0.2rem' }}>
            {readinessMetrics.overallScore !== null ? `${readinessMetrics.overallScore}%` : 'Pending'}
          </div>
          <div style={{ fontSize: '0.75rem', color: 'var(--muted-foreground)', marginTop: '0.25rem' }}>
            Weighted placement readiness
          </div>
        </div>
      </div>

      {/* Chart 1: Interview Score Trajectory (Line Chart) */}
      <div className="card" style={{ padding: '1.75rem' }}>
        <h3 style={{ fontSize: '1.15rem', fontWeight: 700, marginBottom: '0.25rem' }}>
          Mock Interview Score Trajectory
        </h3>
        <p style={{ fontSize: '0.85rem', marginBottom: '1.5rem' }}>
          Track score improvements as you practice more behavioral and technical interview questions.
        </p>

        <div style={{ width: '100%', height: '280px' }}>
          <ResponsiveContainer width="100%" height="100%">
            <LineChart data={trendData} margin={{ top: 10, right: 20, left: -10, bottom: 0 }}>
              <CartesianGrid strokeDasharray="3 3" stroke={gridColor} vertical={false} />
              <XAxis dataKey="date" stroke={textColor} fontSize={12} tickLine={false} />
              <YAxis domain={[0, 100]} stroke={textColor} fontSize={12} tickLine={false} />
              <Tooltip
                contentStyle={{
                  backgroundColor: 'var(--card)',
                  borderColor: 'var(--border)',
                  borderRadius: '8px',
                  color: 'var(--foreground)',
                  fontSize: '12px',
                }}
              />
              <Line
                type="monotone"
                dataKey="score"
                name="Overall Score"
                stroke={strokeColor}
                strokeWidth={2.5}
                dot={{ r: 4, fill: strokeColor }}
                activeDot={{ r: 6 }}
              />
              <Line
                type="monotone"
                dataKey="interview"
                name="Technical Score"
                stroke={textColor}
                strokeWidth={1.8}
                strokeDasharray="4 4"
                dot={{ r: 3, fill: textColor }}
              />
            </LineChart>
          </ResponsiveContainer>
        </div>
      </div>

      {/* Chart 2: Skill-Wise Mastery Comparison (Bar Chart) */}
      <div className="card" style={{ padding: '1.75rem' }}>
        <h3 style={{ fontSize: '1.15rem', fontWeight: 700, marginBottom: '0.25rem' }}>
          Skill-Wise Proficiency Index
        </h3>
        <p style={{ fontSize: '0.85rem', marginBottom: '1.5rem' }}>
          Comparison across DSA, DBMS, OOP, Communication, and Problem Solving.
        </p>

        <div style={{ width: '100%', height: '260px' }}>
          <ResponsiveContainer width="100%" height="100%">
            <BarChart data={skillComparisonData} margin={{ top: 10, right: 20, left: -10, bottom: 0 }}>
              <CartesianGrid strokeDasharray="3 3" stroke={gridColor} vertical={false} />
              <XAxis dataKey="skill" stroke={textColor} fontSize={12} tickLine={false} />
              <YAxis domain={[0, 100]} stroke={textColor} fontSize={12} tickLine={false} />
              <Tooltip
                contentStyle={{
                  backgroundColor: 'var(--card)',
                  borderColor: 'var(--border)',
                  borderRadius: '8px',
                  color: 'var(--foreground)',
                  fontSize: '12px',
                }}
              />
              <Bar dataKey="score" name="Assessed Mastery %" fill={barColor} radius={[6, 6, 0, 0]} />
            </BarChart>
          </ResponsiveContainer>
        </div>
      </div>
    </div>
  );
}
