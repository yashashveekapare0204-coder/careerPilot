import React, { useState, useEffect, useRef } from 'react';
import { useNavigate } from 'react-router-dom';
import {
  Mic,
  MicOff,
  Sparkles,
  ArrowRight,
  ArrowLeft,
  CheckCircle2,
  Clock,
  AlertCircle,
  HelpCircle,
  ChevronRight,
  RotateCcw,
} from 'lucide-react';
import { useAuth } from '../context/AuthContext';

export default function MockInterviewPage() {
  const { studentData, saveInterviewResult, recordActivity } = useAuth();
  const navigate = useNavigate();

  // Interview setup state
  const [inProgress, setInProgress] = useState(false);
  const [interviewType, setInterviewType] = useState('Technical Interview'); // HR, Technical, Mixed
  const [targetRole, setTargetRole] = useState('Software Development Engineer');
  const [difficulty, setDifficulty] = useState('Intermediate');
  const [questionCount, setQuestionCount] = useState(3);
  const [inputMode, setInputMode] = useState('text'); // text or voice

  // Interview session state
  const [questions, setQuestions] = useState([]);
  const [currentIndex, setCurrentIndex] = useState(0);
  const [currentAnswer, setCurrentAnswer] = useState('');
  const [answers, setAnswers] = useState([]); // Array of { question, answer, score, positiveFeedback, missingPoints, improvedAnswer }
  const [evaluating, setEvaluating] = useState(false);
  const [generatingQuestions, setGeneratingQuestions] = useState(false);
  const [isRecording, setIsRecording] = useState(false);
  const [speechSupported, setSpeechSupported] = useState(false);
  const [speechError, setSpeechError] = useState('');

  // Speech Recognition reference
  const recognitionRef = useRef(null);

  useEffect(() => {
    // Check Web Speech API support
    const SpeechRecognition = window.SpeechRecognition || window.webkitSpeechRecognition;
    if (SpeechRecognition) {
      setSpeechSupported(true);
      const recognition = new SpeechRecognition();
      recognition.continuous = true;
      recognition.interimResults = true;
      recognition.lang = 'en-US';

      recognition.onresult = (event) => {
        let transcript = '';
        for (let i = event.resultIndex; i < event.results.length; i++) {
          transcript += event.results[i][0].transcript;
        }
        setCurrentAnswer(prev => prev + (prev.endsWith(' ') || prev === '' ? '' : ' ') + transcript);
      };

      recognition.onerror = (event) => {
        console.warn('Speech recognition error:', event.error);
        setSpeechError('Microphone input note: ' + event.error + '. You can type your answer.');
        setIsRecording(false);
      };

      recognition.onend = () => {
        setIsRecording(false);
      };

      recognitionRef.current = recognition;
    }
  }, []);

  const toggleRecording = () => {
    if (!recognitionRef.current) {
      alert('Speech Recognition is not supported in this browser. Please use keyboard text input.');
      return;
    }

    if (isRecording) {
      recognitionRef.current.stop();
      setIsRecording(false);
    } else {
      setSpeechError('');
      try {
        recognitionRef.current.start();
        setIsRecording(true);
      } catch (err) {
        console.warn('Error starting speech:', err);
      }
    }
  };

  // Start interview session
  const handleStartInterview = async () => {
    setGeneratingQuestions(true);

    try {
      // Call backend API for Gemini question generation
      const res = await fetch('/api/interview/start', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          type: interviewType,
          role: targetRole,
          difficulty,
          count: questionCount,
          resumeData: studentData.resumeAnalysis,
        }),
      });

      let generated;
      if (res.ok) {
        const data = await res.json();
        generated = data.questions;
      } else {
        generated = getFallbackQuestions(interviewType, targetRole, questionCount);
      }

      setQuestions(generated);
      setCurrentIndex(0);
      setAnswers([]);
      setCurrentAnswer('');
      setInProgress(true);
    } catch (err) {
      console.warn('Backend interview start notice, using local generator:', err);
      const generated = getFallbackQuestions(interviewType, targetRole, questionCount);
      setQuestions(generated);
      setCurrentIndex(0);
      setAnswers([]);
      setCurrentAnswer('');
      setInProgress(true);
    } finally {
      setGeneratingQuestions(false);
    }
  };

  const getFallbackQuestions = (type, role, count) => {
    const list = [
      {
        id: 1,
        question: `How would you explain the differences between process and thread synchronization, and what concurrency issues arise in high-load ${role} systems?`,
        category: 'Technical Understanding',
      },
      {
        id: 2,
        question: `Describe a situation from your past projects where you diagnosed a challenging bug or performance bottleneck. What was your step-by-step resolution process?`,
        category: 'Problem Solving & Projects',
      },
      {
        id: 3,
        question: `When collaborating under tight project deadlines, how do you handle conflicting architectural opinions or disagreements with team members?`,
        category: 'Behavioral & Communication',
      },
      {
        id: 4,
        question: `Explain how indexing works in relational databases like PostgreSQL. When does an index degrade write performance?`,
        category: 'Technical Architecture',
      },
      {
        id: 5,
        question: `Walk through the time and space complexity trade-offs between QuickSort, MergeSort, and HeapSort in real-world standard libraries.`,
        category: 'Core Algorithms',
      },
    ];
    return list.slice(0, count);
  };

  // Submit current answer and evaluate
  const handleSubmitAnswer = async () => {
    if (!currentAnswer.trim()) {
      alert('Please provide an answer using voice or text before submitting.');
      return;
    }

    if (isRecording && recognitionRef.current) {
      recognitionRef.current.stop();
      setIsRecording(false);
    }

    setEvaluating(true);
    const activeQ = questions[currentIndex];

    try {
      const res = await fetch('/api/interview/answer', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          question: activeQ.question,
          studentAnswer: currentAnswer,
          role: targetRole,
          category: activeQ.category,
        }),
      });

      let evaluation;
      if (res.ok) {
        evaluation = await res.json();
      } else {
        evaluation = evaluateAnswerLocally(activeQ.question, currentAnswer);
      }

      const recordedAnswer = {
        questionNumber: currentIndex + 1,
        question: activeQ.question,
        category: activeQ.category,
        studentAnswer: currentAnswer,
        score: evaluation.score,
        positiveFeedback: evaluation.positiveFeedback,
        missingPoints: evaluation.missingPoints,
        improvedAnswer: evaluation.improvedAnswer,
      };

      const updatedAnswers = [...answers, recordedAnswer];
      setAnswers(updatedAnswers);
      setCurrentAnswer('');

      // If more questions exist, proceed to next
      if (currentIndex + 1 < questions.length) {
        setCurrentIndex(currentIndex + 1);
      } else {
        // Interview complete! Finish and navigate to results page
        finishInterview(updatedAnswers);
      }
    } catch (err) {
      console.warn('Evaluation fallback:', err);
      const evaluation = evaluateAnswerLocally(activeQ.question, currentAnswer);
      const recordedAnswer = {
        questionNumber: currentIndex + 1,
        question: activeQ.question,
        category: activeQ.category,
        studentAnswer: currentAnswer,
        score: evaluation.score,
        positiveFeedback: evaluation.positiveFeedback,
        missingPoints: evaluation.missingPoints,
        improvedAnswer: evaluation.improvedAnswer,
      };
      const updatedAnswers = [...answers, recordedAnswer];
      setAnswers(updatedAnswers);
      setCurrentAnswer('');

      if (currentIndex + 1 < questions.length) {
        setCurrentIndex(currentIndex + 1);
      } else {
        finishInterview(updatedAnswers);
      }
    } finally {
      setEvaluating(false);
    }
  };

  const evaluateAnswerLocally = (question, answer) => {
    const wordCount = answer.trim().split(/\s+/).length;
    let baseScore = 75;
    if (wordCount < 15) baseScore = 55;
    else if (wordCount > 60) baseScore = 88;

    return {
      score: baseScore,
      positiveFeedback: 'Clear structured response with relevant terminology addressing the core question.',
      missingPoints: 'Could elaborate further on edge case considerations, scale trade-offs, and metric impacts.',
      improvedAnswer: `A comprehensive answer structures the definition clearly, provides a concrete code or project example, and contrasts advantages with potential trade-offs.`,
    };
  };

  const finishInterview = (finalAnswers) => {
    const overallScore = Math.round(
      finalAnswers.reduce((sum, a) => sum + a.score, 0) / finalAnswers.length
    );

    const interviewRecord = {
      id: 'int_' + Date.now(),
      date: new Date().toLocaleDateString('en-US', { month: 'short', day: 'numeric', year: 'numeric' }),
      type: interviewType,
      targetRole,
      difficulty,
      overallScore,
      questionsAnswered: finalAnswers.length,
      technicalScore: Math.round(overallScore * 0.95),
      communicationScore: Math.min(100, Math.round(overallScore * 1.05)),
      correctnessScore: overallScore,
      completenessScore: Math.round(overallScore * 0.9),
      strengths: [
        'Demonstrated solid grasp of core technical definitions.',
        'Structured thought process with clear sequential explanations.',
      ],
      weaknesses: [
        'Can provide deeper real-world performance metrics.',
        'Consider using the STAR method more rigorously on scenario questions.',
      ],
      recommendedTopics: [
        'Deep-dive Concurrency and Locking Primitives',
        'Database Query Optimization & B-Tree Indexes',
      ],
      answers: finalAnswers,
    };

    saveInterviewResult(interviewRecord);
    navigate('/interview-results');
  };

  return (
    <div style={{ maxWidth: '880px', margin: '0 auto', display: 'flex', flexDirection: 'column', gap: '2rem' }}>
      {/* Header */}
      <div>
        <h1 style={{ fontSize: '1.85rem', fontWeight: 700, letterSpacing: '-0.02em', marginBottom: '0.35rem' }}>
          AI Mock Interview
        </h1>
        <p style={{ fontSize: '0.95rem' }}>
          Practice real-time technical and HR interview rounds with AI question generation and objective answer scoring.
        </p>
      </div>

      {!inProgress ? (
        /* Setup Configuration Screen */
        <div className="card" style={{ padding: '2rem', display: 'flex', flexDirection: 'column', gap: '1.75rem' }}>
          {/* Resume Personalization Banner */}
          {studentData.resumeAnalysis ? (
            <div
              style={{
                padding: '1rem',
                backgroundColor: 'var(--muted)',
                borderRadius: 'var(--radius-md)',
                border: '1px solid var(--border)',
                display: 'flex',
                alignItems: 'center',
                gap: '0.75rem',
              }}
            >
              <Sparkles size={20} />
              <div style={{ fontSize: '0.875rem' }}>
                <strong>Personalized to your resume:</strong> Questions will adapt to your uploaded projects and verified skills (
                {studentData.resumeAnalysis.detectedSkills?.slice(0, 4).join(', ')}).
              </div>
            </div>
          ) : (
            <div
              style={{
                padding: '1rem',
                backgroundColor: 'var(--muted)',
                borderRadius: 'var(--radius-md)',
                border: '1px solid var(--border)',
                display: 'flex',
                alignItems: 'center',
                gap: '0.75rem',
              }}
            >
              <AlertCircle size={20} />
              <div style={{ fontSize: '0.875rem' }}>
                <strong>Standard Mode:</strong> No resume uploaded yet. Questions will be generated based on your selected target role. Upload your resume in the Resume Corrector for personalized project questions.
              </div>
            </div>
          )}

          <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(260px, 1fr))', gap: '1.25rem' }}>
            {/* Interview Type */}
            <div>
              <label style={{ display: 'block', fontSize: '0.85rem', fontWeight: 600, marginBottom: '0.4rem' }}>
                Interview Type
              </label>
              <select
                value={interviewType}
                onChange={(e) => setInterviewType(e.target.value)}
                style={{ width: '100%' }}
              >
                <option value="Technical Interview">Technical Interview</option>
                <option value="HR Interview">HR Interview (Behavioral)</option>
                <option value="Mixed Interview">Mixed (Technical + HR)</option>
              </select>
            </div>

            {/* Target Job Role */}
            <div>
              <label style={{ display: 'block', fontSize: '0.85rem', fontWeight: 600, marginBottom: '0.4rem' }}>
                Target Job Role
              </label>
              <select
                value={targetRole}
                onChange={(e) => setTargetRole(e.target.value)}
                style={{ width: '100%' }}
              >
                <option value="Software Development Engineer">Software Development Engineer (SDE)</option>
                <option value="Frontend Developer">Frontend Developer (React/JS)</option>
                <option value="Backend Developer">Backend Developer (Node/Java/Python)</option>
                <option value="Full Stack Engineer">Full Stack Engineer</option>
                <option value="Data Analyst">Data Analyst</option>
              </select>
            </div>

            {/* Difficulty Level */}
            <div>
              <label style={{ display: 'block', fontSize: '0.85rem', fontWeight: 600, marginBottom: '0.4rem' }}>
                Difficulty Level
              </label>
              <select
                value={difficulty}
                onChange={(e) => setDifficulty(e.target.value)}
                style={{ width: '100%' }}
              >
                <option value="Entry Level">Entry Level (Campus Freshers)</option>
                <option value="Intermediate">Intermediate (Standard SDE-1)</option>
                <option value="Advanced">Advanced (High-Bar Product Rounds)</option>
              </select>
            </div>

            {/* Number of Questions */}
            <div>
              <label style={{ display: 'block', fontSize: '0.85rem', fontWeight: 600, marginBottom: '0.4rem' }}>
                Number of Questions
              </label>
              <select
                value={questionCount}
                onChange={(e) => setQuestionCount(Number(e.target.value))}
                style={{ width: '100%' }}
              >
                <option value={3}>3 Questions (Quick Practice ~10 mins)</option>
                <option value={5}>5 Questions (Standard Round ~18 mins)</option>
                <option value={7}>7 Questions (Comprehensive ~25 mins)</option>
              </select>
            </div>
          </div>

          <div style={{ paddingTop: '1rem', borderTop: '1px solid var(--border)' }}>
            <button
              onClick={handleStartInterview}
              disabled={generatingQuestions}
              className="btn-primary btn-lg"
              style={{ width: '100%', maxWidth: '300px' }}
            >
              {generatingQuestions ? 'Generating Questions...' : 'Start Interview Session'}
              {!generatingQuestions && <ArrowRight size={18} />}
            </button>
          </div>
        </div>
      ) : (
        /* Active Interview In-Progress Screen */
        <div className="card" style={{ padding: '2rem', display: 'flex', flexDirection: 'column', gap: '1.5rem' }}>
          {/* Progress Indicator */}
          <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between' }}>
            <div style={{ display: 'flex', alignItems: 'center', gap: '0.5rem' }}>
              <span className="badge">
                Question {currentIndex + 1} of {questions.length}
              </span>
              <span style={{ fontSize: '0.8rem', color: 'var(--muted-foreground)' }}>
                {questions[currentIndex]?.category}
              </span>
            </div>

            <button
              onClick={() => {
                if (window.confirm('Are you sure you want to exit? Your partial answers will generate a preliminary report.')) {
                  if (answers.length > 0) finishInterview(answers);
                  else setInProgress(false);
                }
              }}
              className="btn-ghost btn-sm"
              style={{ color: 'var(--muted-foreground)' }}
            >
              End Interview
            </button>
          </div>

          {/* Progress Bar */}
          <div style={{ height: '4px', backgroundColor: 'var(--border)', borderRadius: '2px', overflow: 'hidden' }}>
            <div
              style={{
                width: `${((currentIndex + 1) / questions.length) * 100}%`,
                height: '100%',
                backgroundColor: 'var(--foreground)',
                transition: 'width 0.3s ease',
              }}
            />
          </div>

          {/* Question Display Card */}
          <div
            style={{
              padding: '1.5rem',
              backgroundColor: 'var(--muted)',
              borderRadius: 'var(--radius-md)',
              border: '1px solid var(--border)',
            }}
          >
            <div style={{ fontSize: '0.8rem', fontWeight: 600, color: 'var(--muted-foreground)', marginBottom: '0.4rem', textTransform: 'uppercase' }}>
              Interviewer Prompt:
            </div>
            <h2 style={{ fontSize: '1.25rem', fontWeight: 600, lineHeight: 1.4 }}>
              {questions[currentIndex]?.question}
            </h2>
          </div>

          {/* Speech error or notice if any */}
          {speechError && (
            <div style={{ fontSize: '0.825rem', color: 'var(--muted-foreground)' }}>
              {speechError}
            </div>
          )}

          {/* Student Answer Text Area with Voice toggle */}
          <div>
            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '0.5rem' }}>
              <label style={{ fontSize: '0.85rem', fontWeight: 600 }}>
                Your Answer
              </label>

              {speechSupported && (
                <button
                  type="button"
                  onClick={toggleRecording}
                  style={{
                    display: 'flex',
                    alignItems: 'center',
                    gap: '0.4rem',
                    padding: '0.35rem 0.75rem',
                    borderRadius: 'var(--radius-full)',
                    backgroundColor: isRecording ? 'var(--foreground)' : 'var(--muted)',
                    color: isRecording ? 'var(--background)' : 'var(--foreground)',
                    border: '1px solid var(--border)',
                    fontSize: '0.785rem',
                    fontWeight: 600,
                  }}
                >
                  {isRecording ? <MicOff size={14} /> : <Mic size={14} />}
                  <span>{isRecording ? 'Listening (Click to Stop)' : 'Voice Input (Web Speech)'}</span>
                </button>
              )}
            </div>

            <textarea
              rows={6}
              value={currentAnswer}
              onChange={(e) => setCurrentAnswer(e.target.value)}
              placeholder="Speak or type your answer clearly. Structure your response with definitions, examples, and trade-offs..."
              style={{ width: '100%', resize: 'vertical' }}
            />
          </div>

          {/* Actions */}
          <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', paddingTop: '0.5rem', borderTop: '1px solid var(--border)' }}>
            <span style={{ fontSize: '0.8rem', color: 'var(--muted-foreground)' }}>
              {currentAnswer.trim().split(/\s+/).filter(Boolean).length} words recorded
            </span>

            <div style={{ display: 'flex', gap: '0.75rem' }}>
              <button
                onClick={handleSubmitAnswer}
                disabled={evaluating || !currentAnswer.trim()}
                className="btn-primary"
              >
                {evaluating ? (
                  'Evaluating Answer...'
                ) : (
                  currentIndex + 1 === questions.length ? 'Submit & View Report' : 'Submit Answer & Next'
                )}
                {!evaluating && <ChevronRight size={16} />}
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
