import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import {
  Target,
  Plus,
  CheckCircle,
  ExternalLink,
  BookOpen,
  ArrowRight,
  Sparkles,
  Zap,
} from 'lucide-react';
import { useAuth } from '../context/AuthContext';

export default function SkillGapPage() {
  const { user, studentData, addRoadmapTask } = useAuth();
  const navigate = useNavigate();
  const [addedTasks, setAddedTasks] = useState({});

  const targetRole = user?.targetRole || 'Software Development Engineer';

  // Skill gap data mapped to placement requirements
  const skillsList = [
    {
      id: 'dsa',
      name: 'Data Structures & Algorithms',
      assessedScore: studentData.skillsAssessment.dsa || 70,
      targetLevel: 85,
      priority: 'High',
      status: studentData.skillsAssessment.dsa >= 80 ? 'Proficient' : 'Priority Gap',
      explanation: 'Core focus on Graphs, Dynamic Programming, and Binary Search.',
      practiceSuggestion: 'Solve LeetCode Top 75 Placement and Blind 75 curated lists.',
      resourceName: 'NeetCode Roadmap (Free)',
      resourceUrl: 'https://neetcode.io/roadmap',
    },
    {
      id: 'dbms',
      name: 'Database Management Systems (DBMS)',
      assessedScore: studentData.skillsAssessment.dbms || 65,
      targetLevel: 80,
      priority: 'High',
      status: studentData.skillsAssessment.dbms >= 80 ? 'Proficient' : 'Priority Gap',
      explanation: 'ACID properties, B+ Tree indexing, normalization, and complex JOIN queries.',
      practiceSuggestion: 'Practice HackerRank Advanced SQL and design relational schemas.',
      resourceName: 'PostgreSQL Tutorial & SQLBolt (Free)',
      resourceUrl: 'https://sqlbolt.com',
    },
    {
      id: 'oop',
      name: 'Object-Oriented Programming (OOP)',
      assessedScore: studentData.skillsAssessment.oop || 75,
      targetLevel: 80,
      priority: 'Medium',
      status: studentData.skillsAssessment.oop >= 80 ? 'Proficient' : 'Moderate Gap',
      explanation: 'Polymorphism, abstraction, SOLID design principles, and design patterns.',
      practiceSuggestion: 'Implement Factory and Singleton patterns in Java or C++.',
      resourceName: 'Refactoring Guru Design Patterns (Free)',
      resourceUrl: 'https://refactoring.guru/design-patterns',
    },
    {
      id: 'os',
      name: 'Operating Systems & Concurrency',
      assessedScore: 60,
      targetLevel: 75,
      priority: 'Medium',
      status: 'Moderate Gap',
      explanation: 'Process scheduling, virtual memory paging, multithreading race conditions.',
      practiceSuggestion: 'Review deadlock conditions and write synchronized mutex code.',
      resourceName: 'OSTEP Operating Systems Guide (Free)',
      resourceUrl: 'https://pages.cs.wisc.edu/~remzi/OSTEP/',
    },
    {
      id: 'cn',
      name: 'Computer Networks',
      assessedScore: 68,
      targetLevel: 75,
      priority: 'Medium',
      status: 'Moderate Gap',
      explanation: 'TCP 3-way handshake, DNS resolution, HTTP/1.1 vs HTTP/2/3 differences.',
      practiceSuggestion: 'Trace packet requests using curl and inspect browser DevTools network tab.',
      resourceName: 'Stanford Computer Networks Lectures (Free)',
      resourceUrl: 'https://cs.stanford.edu',
    },
    {
      id: 'comm',
      name: 'Communication & Behavioral Clarity',
      assessedScore: studentData.skillsAssessment.communication || 78,
      targetLevel: 85,
      priority: 'High',
      status: 'Moderate Gap',
      explanation: 'STAR technique execution under pressure and technical conciseness.',
      practiceSuggestion: 'Record 2-minute mock elevator pitches explaining your hardest project bug.',
      resourceName: 'Harvard Career Services Interview Guide (Free)',
      resourceUrl: 'https://careerservices.fas.harvard.edu',
    },
  ];

  const handleAddToRoadmap = (skill) => {
    addRoadmapTask({
      topic: `${skill.name} Deep Dive`,
      explanation: skill.explanation,
      whyItMatters: `Required benchmark for ${targetRole} evaluations (${skill.targetLevel}% bar).`,
      suggestedActivity: skill.practiceSuggestion,
      estimatedTime: '4 hours',
      priority: skill.priority,
      week: 1,
    });

    setAddedTasks(prev => ({ ...prev, [skill.id]: true }));
  };

  return (
    <div style={{ maxWidth: '960px', margin: '0 auto', display: 'flex', flexDirection: 'column', gap: '2rem' }}>
      {/* Header */}
      <div style={{ display: 'flex', flexWrap: 'wrap', alignItems: 'center', justifyContent: 'space-between', gap: '1rem' }}>
        <div>
          <h1 style={{ fontSize: '1.85rem', fontWeight: 700, letterSpacing: '-0.02em', marginBottom: '0.35rem' }}>
            Skill Gap Analysis
          </h1>
          <p style={{ fontSize: '0.95rem' }}>
            Comparing your assessed performance against campus placement bars for <strong>{targetRole}</strong>.
          </p>
        </div>

        <button onClick={() => navigate('/roadmap')} className="btn-primary btn-sm">
          Open Career Roadmap <ArrowRight size={14} />
        </button>
      </div>

      {/* Skills Grid */}
      <div style={{ display: 'flex', flexDirection: 'column', gap: '1.25rem' }}>
        {skillsList.map((skill) => {
          const isAdded = addedTasks[skill.id];
          const isPriority = skill.status === 'Priority Gap';

          return (
            <div
              key={skill.id}
              className="card"
              style={{
                display: 'flex',
                flexDirection: 'column',
                gap: '1rem',
                borderLeft: isPriority ? '4px solid var(--foreground)' : '1px solid var(--border)',
              }}
            >
              <div style={{ display: 'flex', flexWrap: 'wrap', justifyContent: 'space-between', alignItems: 'center', gap: '1rem' }}>
                <div>
                  <div style={{ display: 'flex', alignItems: 'center', gap: '0.65rem' }}>
                    <h3 style={{ fontSize: '1.15rem', fontWeight: 700 }}>{skill.name}</h3>
                    <span className="badge" style={{ fontSize: '0.725rem' }}>
                      {skill.priority} Priority
                    </span>
                    <span
                      style={{
                        fontSize: '0.75rem',
                        fontWeight: 600,
                        padding: '0.2rem 0.6rem',
                        borderRadius: 'var(--radius-full)',
                        backgroundColor: isPriority ? 'var(--foreground)' : 'var(--muted)',
                        color: isPriority ? 'var(--background)' : 'var(--foreground)',
                      }}
                    >
                      {skill.status}
                    </span>
                  </div>
                  <p style={{ fontSize: '0.85rem', marginTop: '0.35rem' }}>
                    {skill.explanation}
                  </p>
                </div>

                {/* Score vs Target Indicator */}
                <div style={{ display: 'flex', alignItems: 'center', gap: '1.5rem', textAlign: 'right' }}>
                  <div>
                    <div style={{ fontSize: '0.75rem', color: 'var(--muted-foreground)', fontWeight: 600 }}>Assessed Level</div>
                    <div style={{ fontSize: '1.3rem', fontWeight: 700 }}>{skill.assessedScore}%</div>
                  </div>
                  <div style={{ borderLeft: '1px solid var(--border)', paddingLeft: '1.5rem' }}>
                    <div style={{ fontSize: '0.75rem', color: 'var(--muted-foreground)', fontWeight: 600 }}>Hiring Bar</div>
                    <div style={{ fontSize: '1.3rem', fontWeight: 700 }}>{skill.targetLevel}%</div>
                  </div>
                </div>
              </div>

              {/* Progress bar comparison */}
              <div>
                <div style={{ height: '6px', backgroundColor: 'var(--border)', borderRadius: '3px', position: 'relative', overflow: 'hidden' }}>
                  <div
                    style={{
                      width: `${skill.assessedScore}%`,
                      height: '100%',
                      backgroundColor: 'var(--foreground)',
                      position: 'absolute',
                      left: 0,
                    }}
                  />
                </div>
              </div>

              {/* Practice recommendation and Action */}
              <div
                style={{
                  display: 'flex',
                  flexWrap: 'wrap',
                  justifyContent: 'space-between',
                  alignItems: 'center',
                  gap: '1rem',
                  paddingTop: '0.75rem',
                  borderTop: '1px solid var(--border)',
                  fontSize: '0.85rem',
                }}
              >
                <div>
                  <strong>Recommended Practice:</strong> {skill.practiceSuggestion}
                  <div style={{ marginTop: '0.25rem' }}>
                    <a
                      href={skill.resourceUrl}
                      target="_blank"
                      rel="noopener noreferrer"
                      style={{
                        display: 'inline-flex',
                        alignItems: 'center',
                        gap: '0.3rem',
                        fontSize: '0.785rem',
                        color: 'var(--muted-foreground)',
                        textDecoration: 'underline',
                      }}
                    >
                      <BookOpen size={13} /> {skill.resourceName} <ExternalLink size={11} />
                    </a>
                  </div>
                </div>

                <button
                  onClick={() => handleAddToRoadmap(skill)}
                  disabled={isAdded}
                  className="btn-outline btn-sm"
                  style={{ flexShrink: 0 }}
                >
                  {isAdded ? (
                    <>
                      <CheckCircle size={14} />
                      Added to Roadmap
                    </>
                  ) : (
                    <>
                      <Plus size={14} />
                      Add Topic to Roadmap
                    </>
                  )}
                </button>
              </div>
            </div>
          );
        })}
      </div>
    </div>
  );
}
