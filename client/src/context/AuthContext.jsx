import React, { createContext, useContext, useState, useEffect, useMemo } from 'react';
import { createClient } from '@supabase/supabase-js';

const AuthContext = createContext();

// Initialize Supabase if environment variables are configured
const supabaseUrl = import.meta.env.VITE_SUPABASE_URL || '';
const supabaseAnonKey = import.meta.env.VITE_SUPABASE_ANON_KEY || '';
const isSupabaseConfigured = Boolean(supabaseUrl && supabaseAnonKey);

const supabase = isSupabaseConfigured ? createClient(supabaseUrl, supabaseAnonKey) : null;

const STORAGE_KEYS = {
  USER: 'careerpilot_auth_user',
  DATA_PREFIX: 'careerpilot_student_data_',
};

export function AuthProvider({ children }) {
  const [user, setUser] = useState(null);
  const [loading, setLoading] = useState(true);

  // Student preparation state
  const [studentData, setStudentData] = useState({
    resumeAnalysis: null,
    interviewHistory: [],
    roadmapTasks: [
      {
        id: 'task-1',
        topic: 'Binary Search & Two Pointers Patterns',
        explanation: 'Master core searching algorithms commonly tested in technical screening rounds.',
        whyItMatters: 'Appears in over 60% of product-based company coding assessments.',
        suggestedActivity: 'Solve 10 LeetCode Medium binary search problems and document corner cases.',
        estimatedTime: '4 hours',
        status: 'Not Started', // Not Started, In Progress, Completed
        week: 1,
        priority: 'High',
      },
      {
        id: 'task-2',
        topic: 'SQL Joins, Group By & Subqueries',
        explanation: 'Deep dive into complex relational query writing under timed conditions.',
        whyItMatters: 'Mandatory technical round requirement for DBMS evaluations.',
        suggestedActivity: 'Practice 15 SQL query challenges on HackerRank and LeetCode SQL 50.',
        estimatedTime: '3 hours',
        status: 'Not Started',
        week: 1,
        priority: 'High',
      },
      {
        id: 'task-3',
        topic: 'OOP Pillars & Real-World Modeling',
        explanation: 'Review Encapsulation, Abstraction, Polymorphism, and Inheritance with clean code.',
        whyItMatters: 'Essential for low-level design and live pair-coding interviews.',
        suggestedActivity: 'Design a Parking Lot or Library Management System in your preferred language.',
        estimatedTime: '5 hours',
        status: 'Not Started',
        week: 2,
        priority: 'Medium',
      },
      {
        id: 'task-4',
        topic: 'STAR Method for HR Behavioral Scenarios',
        explanation: 'Structure behavioral answers clearly using Situation, Task, Action, Result.',
        whyItMatters: 'Prevents rambling and ensures clear demonstration of leadership and conflict resolution.',
        suggestedActivity: 'Draft 5 personal stories demonstrating teamwork, handling failure, and tight deadlines.',
        estimatedTime: '2 hours',
        status: 'Not Started',
        week: 2,
        priority: 'Medium',
      },
    ],
    skillsAssessment: {
      dsa: null, // null means not assessed
      dbms: null,
      oop: null,
      communication: null,
      problemSolving: null,
    },
    activityDates: [], // Array of ISO date strings YYYY-MM-DD
    recentActivities: [], // Array of { id, type, title, date }
  });

  // Load existing session on initial mount
  useEffect(() => {
    async function initAuth() {
      try {
        if (supabase) {
          const { data: { session } } = await supabase.auth.getSession();
          if (session?.user) {
            const mappedUser = {
              id: session.user.id,
              email: session.user.email,
              fullName: session.user.user_metadata?.full_name || session.user.email.split('@')[0],
              college: session.user.user_metadata?.college || 'National Institute of Technology',
              graduationYear: session.user.user_metadata?.graduation_year || '2026',
              targetRole: session.user.user_metadata?.target_role || 'Software Development Engineer',
              preferredCompany: session.user.user_metadata?.preferred_company || 'Product Companies',
              skills: session.user.user_metadata?.skills || ['JavaScript', 'React', 'Data Structures', 'SQL'],
            };
            setUser(mappedUser);
            loadStudentData(mappedUser.id);
          }
        } else {
          // Check local stored session
          const storedUser = localStorage.getItem(STORAGE_KEYS.USER);
          if (storedUser) {
            const parsed = JSON.parse(storedUser);
            setUser(parsed);
            loadStudentData(parsed.id);
          }
        }
      } catch (err) {
        console.error('Error restoring session:', err);
      } finally {
        setLoading(false);
      }
    }

    initAuth();

    // Listen to Supabase auth changes if configured
    if (supabase) {
      const { data: { subscription } } = supabase.auth.onAuthStateChange((_event, session) => {
        if (session?.user) {
          const mappedUser = {
            id: session.user.id,
            email: session.user.email,
            fullName: session.user.user_metadata?.full_name || session.user.email.split('@')[0],
            college: session.user.user_metadata?.college || 'Engineering College',
            graduationYear: session.user.user_metadata?.graduation_year || '2026',
            targetRole: session.user.user_metadata?.target_role || 'Software Development Engineer',
            preferredCompany: session.user.user_metadata?.preferred_company || 'Top Tech Companies',
            skills: session.user.user_metadata?.skills || ['JavaScript', 'DSA', 'SQL'],
          };
          setUser(mappedUser);
          loadStudentData(mappedUser.id);
        } else {
          setUser(null);
        }
      });
      return () => subscription.unsubscribe();
    }
  }, []);

  const loadStudentData = (userId) => {
    try {
      const saved = localStorage.getItem(`${STORAGE_KEYS.DATA_PREFIX}${userId}`);
      if (saved) {
        setStudentData(prev => ({
          ...prev,
          ...JSON.parse(saved),
        }));
      }
    } catch (e) {
      console.warn('Could not parse student data from storage:', e);
    }
  };

  const persistStudentData = (userId, updated) => {
    try {
      localStorage.setItem(`${STORAGE_KEYS.DATA_PREFIX}${userId}`, JSON.stringify(updated));
    } catch (e) {
      console.warn('Could not save student data to storage:', e);
    }
  };

  // Sign In
  const login = async ({ email, password, rememberMe = true }) => {
    if (!email || !password) {
      return { success: false, error: 'Email and password are required.' };
    }

    if (supabase) {
      try {
        const { data, error } = await supabase.auth.signInWithPassword({ email, password });
        if (error) return { success: false, error: error.message };
        const u = {
          id: data.user.id,
          email: data.user.email,
          fullName: data.user.user_metadata?.full_name || email.split('@')[0],
          college: data.user.user_metadata?.college || 'Engineering College',
          graduationYear: '2026',
          targetRole: 'Software Development Engineer',
          preferredCompany: 'Top Tech Companies',
          skills: ['JavaScript', 'DSA', 'SQL'],
        };
        setUser(u);
        loadStudentData(u.id);
        return { success: true };
      } catch (err) {
        return { success: false, error: err.message || 'Authentication failed.' };
      }
    }

    // Local authentication fallback for instant standalone functionality
    const usersStore = JSON.parse(localStorage.getItem('careerpilot_registered_users') || '[]');
    const existing = usersStore.find(u => u.email.toLowerCase() === email.toLowerCase());

    if (existing) {
      if (existing.password === password) {
        const activeUser = {
          id: existing.id,
          email: existing.email,
          fullName: existing.fullName,
          college: existing.college || 'Engineering College',
          graduationYear: existing.graduationYear || '2026',
          targetRole: existing.targetRole || 'Software Development Engineer',
          preferredCompany: existing.preferredCompany || 'Product Companies',
          skills: existing.skills || ['JavaScript', 'DSA', 'SQL'],
        };
        setUser(activeUser);
        if (rememberMe) {
          localStorage.setItem(STORAGE_KEYS.USER, JSON.stringify(activeUser));
        }
        loadStudentData(activeUser.id);
        return { success: true };
      } else {
        return { success: false, error: 'Invalid password. Please check your credentials.' };
      }
    } else {
      // Create user if not registered yet for frictionless first-time testing
      const newUser = {
        id: 'usr_' + Date.now(),
        email,
        password,
        fullName: email.split('@')[0].replace('.', ' '),
        college: 'Engineering Institute of Technology',
        graduationYear: '2026',
        targetRole: 'Software Development Engineer',
        preferredCompany: 'Product Companies',
        skills: ['JavaScript', 'DSA', 'SQL'],
      };
      usersStore.push(newUser);
      localStorage.setItem('careerpilot_registered_users', JSON.stringify(usersStore));
      const activeUser = { ...newUser };
      delete activeUser.password;
      setUser(activeUser);
      localStorage.setItem(STORAGE_KEYS.USER, JSON.stringify(activeUser));
      loadStudentData(activeUser.id);
      return { success: true };
    }
  };

  // Sign Up
  const signup = async ({ fullName, email, password, college = '', targetRole = '' }) => {
    if (!fullName || !email || !password) {
      return { success: false, error: 'Please fill in all required fields.' };
    }

    if (supabase) {
      try {
        const { data, error } = await supabase.auth.signUp({
          email,
          password,
          options: {
            data: {
              full_name: fullName,
              college: college || 'Engineering College',
              target_role: targetRole || 'Software Development Engineer',
            },
          },
        });
        if (error) return { success: false, error: error.message };

        if (data.user) {
          const u = {
            id: data.user.id,
            email: data.user.email,
            fullName,
            college: college || 'Engineering College',
            graduationYear: '2026',
            targetRole: targetRole || 'Software Development Engineer',
            preferredCompany: 'Product Companies',
            skills: ['DSA', 'Problem Solving'],
          };
          setUser(u);
          loadStudentData(u.id);
          return { success: true };
        }
        return { success: true, message: 'Check your email to verify your account.' };
      } catch (err) {
        return { success: false, error: err.message || 'Registration failed.' };
      }
    }

    // Local authentication fallback
    const usersStore = JSON.parse(localStorage.getItem('careerpilot_registered_users') || '[]');
    if (usersStore.some(u => u.email.toLowerCase() === email.toLowerCase())) {
      return { success: false, error: 'An account with this email already exists. Please log in.' };
    }

    const newUser = {
      id: 'usr_' + Date.now(),
      email,
      password,
      fullName,
      college: college || 'Engineering College',
      graduationYear: '2026',
      targetRole: targetRole || 'Software Development Engineer',
      preferredCompany: 'Product Companies',
      skills: ['DSA', 'Problem Solving'],
    };
    usersStore.push(newUser);
    localStorage.setItem('careerpilot_registered_users', JSON.stringify(usersStore));

    const activeUser = { ...newUser };
    delete activeUser.password;
    setUser(activeUser);
    localStorage.setItem(STORAGE_KEYS.USER, JSON.stringify(activeUser));
    loadStudentData(activeUser.id);
    return { success: true };
  };

  // Sign Out
  const logout = async () => {
    if (supabase) {
      try {
        await supabase.auth.signOut();
      } catch (e) {
        console.warn('Supabase signout notice:', e);
      }
    }
    setUser(null);
    localStorage.removeItem(STORAGE_KEYS.USER);
  };

  // Update Profile
  const updateProfile = (updates) => {
    if (!user) return;
    const updated = { ...user, ...updates };
    setUser(updated);
    localStorage.setItem(STORAGE_KEYS.USER, JSON.stringify(updated));

    // Also update in registered users
    const usersStore = JSON.parse(localStorage.getItem('careerpilot_registered_users') || '[]');
    const idx = usersStore.findIndex(u => u.id === user.id);
    if (idx !== -1) {
      usersStore[idx] = { ...usersStore[idx], ...updates };
      localStorage.setItem('careerpilot_registered_users', JSON.stringify(usersStore));
    }
  };

  // Record a meaningful activity (increments streak appropriately)
  const recordActivity = (actionType, title) => {
    if (!user) return;
    const today = new Date().toISOString().split('T')[0];
    const newActivity = {
      id: 'act_' + Date.now(),
      type: actionType,
      title,
      date: new Date().toLocaleDateString('en-US', { month: 'short', day: 'numeric', year: 'numeric' }),
      timestamp: Date.now(),
    };

    setStudentData(prev => {
      const dates = prev.activityDates.includes(today)
        ? prev.activityDates
        : [...prev.activityDates, today];
      
      const updated = {
        ...prev,
        activityDates: dates,
        recentActivities: [newActivity, ...(prev.recentActivities || [])].slice(0, 10),
      };

      persistStudentData(user.id, updated);
      return updated;
    });
  };

  // Save Resume Analysis
  const saveResumeAnalysis = (analysis) => {
    if (!user || !analysis || typeof analysis.score !== 'number' || analysis.status === 'not_resume') return;
    const updatedSkills = { ...studentData.skillsAssessment };
    if (analysis.detectedSkills?.length) {
      if (!updatedSkills.dsa) updatedSkills.dsa = 70;
      if (!updatedSkills.problemSolving) updatedSkills.problemSolving = 75;
    }

    setStudentData(prev => {
      const updated = {
        ...prev,
        resumeAnalysis: analysis,
        skillsAssessment: updatedSkills,
      };
      persistStudentData(user.id, updated);
      return updated;
    });

    recordActivity('resume', `Resume analyzed: ${analysis.fileName || 'PDF Document'}`);
  };

  // Save Interview Result
  const saveInterviewResult = (result) => {
    if (!user) return;
    setStudentData(prev => {
      const newHistory = [result, ...(prev.interviewHistory || [])];
      
      // Update skill assessments based on interview evaluation
      const updatedSkills = { ...prev.skillsAssessment };
      if (result.technicalScore) {
        updatedSkills.dsa = Math.round(result.technicalScore);
        updatedSkills.dbms = Math.round(result.technicalScore * 0.95);
        updatedSkills.oop = Math.round(result.technicalScore * 0.9);
      }
      if (result.communicationScore) {
        updatedSkills.communication = Math.round(result.communicationScore);
      }
      if (result.overallScore) {
        updatedSkills.problemSolving = Math.round(result.overallScore);
      }

      const updated = {
        ...prev,
        interviewHistory: newHistory,
        skillsAssessment: updatedSkills,
      };
      persistStudentData(user.id, updated);
      return updated;
    });

    recordActivity('interview', `Completed ${result.type || 'Mock'} Interview (Score: ${result.overallScore}/100)`);
  };

  // Toggle Roadmap Task
  const toggleRoadmapTask = (taskId, newStatus) => {
    if (!user) return;
    setStudentData(prev => {
      const updatedTasks = prev.roadmapTasks.map(t => {
        if (t.id === taskId) {
          return { ...t, status: newStatus };
        }
        return t;
      });
      const updated = {
        ...prev,
        roadmapTasks: updatedTasks,
      };
      persistStudentData(user.id, updated);
      return updated;
    });

    if (newStatus === 'Completed') {
      const task = studentData.roadmapTasks.find(t => t.id === taskId);
      recordActivity('roadmap', `Completed Roadmap Task: ${task?.topic || 'Topic'}`);
    }
  };

  // Add Task to Roadmap from Skill Gap
  const addRoadmapTask = (task) => {
    if (!user) return;
    setStudentData(prev => {
      const exists = prev.roadmapTasks.some(t => t.topic.toLowerCase() === task.topic.toLowerCase());
      if (exists) return prev;
      const newTask = {
        id: 'task_' + Date.now(),
        topic: task.topic,
        explanation: task.explanation || 'Recommended based on skill gap analysis.',
        whyItMatters: task.whyItMatters || 'High impact topic for placement evaluation.',
        suggestedActivity: task.suggestedActivity || 'Solve targeted practice questions and study key concepts.',
        estimatedTime: task.estimatedTime || '3 hours',
        status: 'Not Started',
        week: task.week || 1,
        priority: task.priority || 'High',
      };
      const updated = {
        ...prev,
        roadmapTasks: [newTask, ...prev.roadmapTasks],
      };
      persistStudentData(user.id, updated);
      return updated;
    });
  };

  // Calculated Placement Readiness Score
  // Documented Formula:
  // Readiness = (Resume Score * 0.30) + (Interview Score * 0.35) + (Technical Skills * 0.20) + (Roadmap Completion * 0.15)
  // If no assessments completed, returns null ("Not assessed yet")
  const readinessMetrics = useMemo(() => {
    const hasResume = studentData.resumeAnalysis && typeof studentData.resumeAnalysis.score === 'number';
    const resumeScore = hasResume ? studentData.resumeAnalysis.score : null;

    const hasInterviews = studentData.interviewHistory && studentData.interviewHistory.length > 0;
    const latestInterview = hasInterviews ? studentData.interviewHistory[0] : null;
    const latestInterviewScore = latestInterview ? latestInterview.overallScore : null;

    const completedTasksCount = studentData.roadmapTasks.filter(t => t.status === 'Completed').length;
    const totalTasksCount = studentData.roadmapTasks.length || 1;
    const roadmapCompletionPercent = Math.round((completedTasksCount / totalTasksCount) * 100);

    const assessedSkills = Object.values(studentData.skillsAssessment).filter(v => typeof v === 'number');
    const avgSkillScore = assessedSkills.length > 0
      ? Math.round(assessedSkills.reduce((a, b) => a + b, 0) / assessedSkills.length)
      : null;

    // Determine if student has completed required assessments
    // Must have at least resume or interview to calculate a readiness score
    if (!hasResume && !hasInterviews) {
      return {
        overallScore: null, // "Not assessed yet"
        resumeScore: null,
        latestInterviewScore: null,
        interviewsCompleted: 0,
        roadmapTasksCompleted: completedTasksCount,
        roadmapPercent: roadmapCompletionPercent,
        avgSkillScore: null,
        isAssessed: false,
      };
    }

    // Weighted calculation
    let totalWeight = 0;
    let weightedSum = 0;

    if (resumeScore !== null) {
      weightedSum += resumeScore * 0.30;
      totalWeight += 0.30;
    }
    if (latestInterviewScore !== null) {
      weightedSum += latestInterviewScore * 0.35;
      totalWeight += 0.35;
    }
    if (avgSkillScore !== null) {
      weightedSum += avgSkillScore * 0.20;
      totalWeight += 0.20;
    }
    if (completedTasksCount > 0) {
      weightedSum += roadmapCompletionPercent * 0.15;
      totalWeight += 0.15;
    }

    const calculatedScore = totalWeight > 0 ? Math.round(weightedSum / totalWeight) : null;

    return {
      overallScore: calculatedScore,
      resumeScore,
      latestInterviewScore,
      interviewsCompleted: studentData.interviewHistory.length,
      roadmapTasksCompleted: completedTasksCount,
      roadmapPercent: roadmapCompletionPercent,
      avgSkillScore,
      isAssessed: true,
    };
  }, [studentData]);

  // Calculate Activity Streak
  const activityStreak = useMemo(() => {
    const dates = studentData.activityDates || [];
    if (dates.length === 0) {
      return {
        currentStreak: 0,
        longestStreak: 0,
        activeDaysThisWeek: 0,
        weeklyGrid: [false, false, false, false, false, false, false],
      };
    }

    const sorted = [...dates].sort().reverse();
    const today = new Date().toISOString().split('T')[0];
    const yesterday = new Date(Date.now() - 86400000).toISOString().split('T')[0];

    // Current streak
    let streak = 0;
    let checkDate = sorted.includes(today) ? new Date() : (sorted.includes(yesterday) ? new Date(Date.now() - 86400000) : null);

    if (checkDate) {
      while (true) {
        const dateStr = checkDate.toISOString().split('T')[0];
        if (sorted.includes(dateStr)) {
          streak++;
          checkDate = new Date(checkDate.getTime() - 86400000);
        } else {
          break;
        }
      }
    }

    // Weekly grid (last 7 days)
    const grid = [];
    let thisWeekActive = 0;
    for (let i = 6; i >= 0; i--) {
      const d = new Date(Date.now() - i * 86400000).toISOString().split('T')[0];
      const active = dates.includes(d);
      grid.push(active);
      if (active) thisWeekActive++;
    }

    return {
      currentStreak: streak,
      longestStreak: Math.max(streak, dates.length > 0 ? 1 : 0),
      activeDaysThisWeek: thisWeekActive,
      weeklyGrid: grid,
    };
  }, [studentData.activityDates]);

  return (
    <AuthContext.Provider
      value={{
        user,
        loading,
        login,
        signup,
        logout,
        updateProfile,
        studentData,
        readinessMetrics,
        activityStreak,
        saveResumeAnalysis,
        saveInterviewResult,
        toggleRoadmapTask,
        addRoadmapTask,
        recordActivity,
        isSupabaseConfigured,
      }}
    >
      {children}
    </AuthContext.Provider>
  );
}

export function useAuth() {
  const context = useContext(AuthContext);
  if (!context) {
    throw new Error('useAuth must be used within an AuthProvider');
  }
  return context;
}
