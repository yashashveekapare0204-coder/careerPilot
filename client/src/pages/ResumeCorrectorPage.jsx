import React, { useState, useRef } from 'react';
import { useNavigate } from 'react-router-dom';
import {
  UploadCloud,
  FileText,
  CheckCircle,
  X,
  RefreshCw,
  ArrowRight,
  AlertCircle,
  Sparkles,
  Check,
  Award,
  Zap,
} from 'lucide-react';
import { useAuth } from '../context/AuthContext';

export default function ResumeCorrectorPage() {
  const { studentData, saveResumeAnalysis } = useAuth();
  const navigate = useNavigate();
  const fileInputRef = useRef(null);

  const [selectedFile, setSelectedFile] = useState(null);
  const [fileDetails, setFileDetails] = useState(null);
  const [dragOver, setDragOver] = useState(false);
  const [validationError, setValidationError] = useState('');
  const [rejection, setRejection] = useState(null);

  // Genuine loading state with sequential status messages
  const [analyzing, setAnalyzing] = useState(false);
  const [statusMessage, setStatusMessage] = useState('');

  // Active analysis results (show saved if exists and not re-analyzing)
  const [analysisResult, setAnalysisResult] = useState(() => studentData.resumeAnalysis);

  const handleFile = (file) => {
    setValidationError('');
    setRejection(null);
    if (!file) return;

    const lowerName = file.name.toLowerCase();
    const isAllowed =
      lowerName.endsWith('.pdf') ||
      lowerName.endsWith('.doc') ||
      lowerName.endsWith('.docx') ||
      file.type === 'application/pdf' ||
      file.type === 'application/msword' ||
      file.type === 'application/vnd.openxmlformats-officedocument.wordprocessingml.document';

    if (!isAllowed) {
      setValidationError('Please upload a valid PDF, DOC, or DOCX file. Other file formats are not accepted.');
      return;
    }

    if (file.size > 5 * 1024 * 1024) {
      setValidationError('File size exceeds the 5MB limit. Please upload a smaller file.');
      return;
    }

    setSelectedFile(file);
    setFileDetails({
      name: file.name,
      size: (file.size / (1024 * 1024)).toFixed(2) + ' MB',
    });
  };

  const handleDrop = (e) => {
    e.preventDefault();
    setDragOver(false);
    if (e.dataTransfer.files && e.dataTransfer.files[0]) {
      handleFile(e.dataTransfer.files[0]);
    }
  };

  const handleRemove = () => {
    setSelectedFile(null);
    setFileDetails(null);
    setValidationError('');
    setRejection(null);
    if (fileInputRef.current) fileInputRef.current.value = '';
  };

  const startAnalysis = async () => {
    if (!selectedFile) return;

    setAnalyzing(true);
    setValidationError('');
    setRejection(null);
    setAnalysisResult(null);

    const messages = [
      'Extracting document content...',
      'Verifying document structure & type...',
      'Evaluating resume content and formatting...',
      'Preparing suggestions and ATS score...',
    ];

    let msgIdx = 0;
    setStatusMessage(messages[0]);
    const interval = setInterval(() => {
      msgIdx = (msgIdx + 1) % messages.length;
      setStatusMessage(messages[msgIdx]);
    }, 1500);

    try {
      // Send to backend API
      const formData = new FormData();
      formData.append('resume', selectedFile);

      const response = await fetch('/api/resume/analyze', {
        method: 'POST',
        body: formData,
      });

      let data;
      try {
        data = await response.json();
      } catch {
        data = { status: 'error', score: null, message: 'Invalid response from server.' };
      }

      clearInterval(interval);

      // 1. Non-resume rejection state: Display rejection message and NO score
      if (data.status === 'not_resume' || data.score === null) {
        setRejection({
          title: 'Document Validation Rejected',
          type: data.documentType || 'Non-Resume Document',
          message: data.message || 'This document does not appear to be a resume. Please upload your resume or CV.',
        });
        setAnalysisResult(null);
        return;
      }

      // 2. Unreadable or extraction failure
      if (data.status === 'unreadable' || (!response.ok && data.status === 'unreadable')) {
        setValidationError(data.message || 'The uploaded file is empty, corrupted, or unreadable.');
        setAnalysisResult(null);
        return;
      }

      // 3. AI / API failure
      if (data.status === 'error' || !response.ok) {
        setValidationError(data.message || 'AI analysis service encountered an error. Please try again.');
        setAnalysisResult(null);
        return;
      }

      // 4. Valid resume with genuine calculated score
      if (typeof data.score === 'number' && data.score >= 0) {
        setAnalysisResult(data);
        saveResumeAnalysis({ ...data, fileName: fileDetails.name });
      } else {
        setValidationError('Invalid response received from analysis engine. No score generated.');
        setAnalysisResult(null);
      }
    } catch (err) {
      clearInterval(interval);
      console.error('Backend API request error:', err);
      setValidationError('Failed to connect to the resume analyzer server. Please try again.');
      setAnalysisResult(null);
    } finally {
      clearInterval(interval);
      setAnalyzing(false);
    }
  };

  return (
    <div style={{ maxWidth: '960px', margin: '0 auto', display: 'flex', flexDirection: 'column', gap: '2rem' }}>
      {/* Page Title & Intro */}
      <div>
        <h1 style={{ fontSize: '1.85rem', fontWeight: 700, letterSpacing: '-0.02em', marginBottom: '0.35rem' }}>
          Resume Corrector
        </h1>
        <p style={{ fontSize: '0.95rem' }}>
          Analyze resume quality, detected skills, formatting issues, and receive actionable ATS feedback.
        </p>
      </div>

      {/* Upload Interface Card (If no active results or user wants to re-upload) */}
      {!analysisResult || analyzing ? (
        <div
          className="card"
          style={{
            maxWidth: '680px',
            margin: '1rem auto',
            width: '100%',
            padding: '2.5rem',
            textAlign: 'center',
          }}
        >
          <div style={{ marginBottom: '1.5rem' }}>
            <h2 style={{ fontSize: '1.45rem', fontWeight: 700, marginBottom: '0.35rem' }}>
              Upload Your Resume
            </h2>
            <p style={{ fontSize: '0.9rem' }}>
              Upload your resume in PDF, DOC, or DOCX format to receive personalized feedback.
            </p>
          </div>

          {/* Document Validation Rejection Message (Mandatory Non-Resume Alert) */}
          {rejection && (
            <div
              style={{
                padding: '1.25rem 1.5rem',
                backgroundColor: 'rgba(239, 68, 68, 0.08)',
                border: '1.5px solid #ef4444',
                borderRadius: 'var(--radius-md)',
                marginBottom: '1.5rem',
                textAlign: 'left',
                display: 'flex',
                flexDirection: 'column',
                gap: '0.45rem',
              }}
            >
              <div style={{ display: 'flex', alignItems: 'center', gap: '0.5rem', color: '#ef4444', fontWeight: 700, fontSize: '0.95rem' }}>
                <AlertCircle size={18} style={{ flexShrink: 0 }} />
                <span>{rejection.title}</span>
              </div>
              <p style={{ fontSize: '0.875rem', margin: 0, color: 'var(--foreground)', lineHeight: 1.5 }}>
                {rejection.message}
              </p>
              {rejection.type && (
                <div style={{ fontSize: '0.785rem', color: 'var(--muted-foreground)', marginTop: '0.25rem' }}>
                  Identified Document: <strong>{rejection.type}</strong> — Scoring halted. No score will be calculated for non-resumes.
                </div>
              )}
            </div>
          )}

          {/* Validation Error Message */}
          {validationError && (
            <div
              style={{
                padding: '0.75rem 1rem',
                backgroundColor: 'var(--muted)',
                border: '1px solid var(--foreground)',
                borderRadius: 'var(--radius-md)',
                marginBottom: '1.25rem',
                fontSize: '0.85rem',
                display: 'flex',
                alignItems: 'center',
                gap: '0.5rem',
                textAlign: 'left',
              }}
            >
              <AlertCircle size={16} style={{ flexShrink: 0 }} />
              <span>{validationError}</span>
            </div>
          )}

          {/* Drop Area */}
          {!fileDetails ? (
            <div
              onDragOver={(e) => { e.preventDefault(); setDragOver(true); }}
              onDragLeave={() => setDragOver(false)}
              onDrop={handleDrop}
              onClick={() => fileInputRef.current?.click()}
              style={{
                border: `2px dashed ${dragOver ? 'var(--foreground)' : 'var(--border-strong)'}`,
                borderRadius: 'var(--radius-lg)',
                padding: '3rem 2rem',
                backgroundColor: dragOver ? 'var(--muted)' : 'transparent',
                cursor: 'pointer',
                transition: 'var(--transition)',
                display: 'flex',
                flexDirection: 'column',
                alignItems: 'center',
                gap: '1rem',
              }}
            >
              <div
                style={{
                  width: '56px',
                  height: '56px',
                  borderRadius: '50%',
                  backgroundColor: 'var(--muted)',
                  border: '1px solid var(--border)',
                  display: 'flex',
                  alignItems: 'center',
                  justifyContent: 'center',
                }}
              >
                <UploadCloud size={28} />
              </div>

              <div>
                <button
                  type="button"
                  className="btn-primary btn-sm"
                  style={{ marginBottom: '0.5rem', pointerEvents: 'none' }}
                >
                  Browse Files
                </button>
                <p style={{ fontSize: '0.85rem', color: 'var(--muted-foreground)' }}>
                  or drag and drop your resume file here
                </p>
              </div>

              <div style={{ fontSize: '0.775rem', color: 'var(--muted-foreground)', marginTop: '0.5rem' }}>
                Supported formats: <strong>PDF, DOC, DOCX</strong> (Maximum size: 5MB)
              </div>
            </div>
          ) : (
            /* File selected & validated state */
            <div
              style={{
                border: '1px solid var(--border)',
                borderRadius: 'var(--radius-md)',
                padding: '1.5rem',
                backgroundColor: 'var(--muted)',
                display: 'flex',
                flexDirection: 'column',
                gap: '1rem',
                textAlign: 'left',
              }}
            >
              <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between' }}>
                <div style={{ display: 'flex', alignItems: 'center', gap: '0.75rem' }}>
                  <div
                    style={{
                      width: '40px',
                      height: '40px',
                      borderRadius: 'var(--radius-sm)',
                      backgroundColor: 'var(--foreground)',
                      color: 'var(--background)',
                      display: 'flex',
                      alignItems: 'center',
                      justifyContent: 'center',
                    }}
                  >
                    <FileText size={20} />
                  </div>
                  <div>
                    <div style={{ fontSize: '0.95rem', fontWeight: 600 }}>{fileDetails.name}</div>
                    <div style={{ fontSize: '0.8rem', color: 'var(--muted-foreground)' }}>{fileDetails.size}</div>
                  </div>
                </div>

                <div style={{ display: 'flex', alignItems: 'center', gap: '0.4rem', color: 'var(--foreground)', fontSize: '0.85rem', fontWeight: 600 }}>
                  <CheckCircle size={18} />
                  <span>File uploaded successfully.</span>
                </div>
              </div>

              {/* Remove and Replace options */}
              <div style={{ display: 'flex', gap: '1rem', paddingTop: '0.5rem', borderTop: '1px solid var(--border)' }}>
                <button
                  type="button"
                  onClick={() => fileInputRef.current?.click()}
                  className="btn-ghost btn-sm"
                  style={{ padding: 0, fontSize: '0.825rem' }}
                >
                  Replace file
                </button>
                <button
                  type="button"
                  onClick={handleRemove}
                  className="btn-ghost btn-sm"
                  style={{ padding: 0, fontSize: '0.825rem' }}
                >
                  Remove
                </button>
              </div>
            </div>
          )}

          <input
            ref={fileInputRef}
            type="file"
            accept=".pdf,.doc,.docx,application/pdf,application/msword,application/vnd.openxmlformats-officedocument.wordprocessingml.document"
            onChange={(e) => e.target.files && handleFile(e.target.files[0])}
            style={{ display: 'none' }}
          />

          {/* Analyze Resume Button */}
          <div style={{ marginTop: '2rem' }}>
            <button
              onClick={startAnalysis}
              disabled={!selectedFile || analyzing}
              className="btn-primary btn-lg"
              style={{ width: '100%', maxWidth: '320px', margin: '0 auto' }}
            >
              {analyzing ? (
                <>
                  <RefreshCw size={18} className="animate-spin" />
                  Analyzing Resume...
                </>
              ) : (
                <>
                  <Sparkles size={18} />
                  Analyze Resume
                </>
              )}
            </button>
          </div>

          {/* Genuine Animated Loading State with sequential messages */}
          {analyzing && (
            <div
              style={{
                marginTop: '2rem',
                padding: '1.25rem',
                backgroundColor: 'var(--muted)',
                borderRadius: 'var(--radius-md)',
                display: 'flex',
                flexDirection: 'column',
                alignItems: 'center',
                gap: '0.75rem',
              }}
            >
              <div
                style={{
                  width: '28px',
                  height: '28px',
                  border: '3px solid var(--border)',
                  borderTopColor: 'var(--foreground)',
                  borderRadius: '50%',
                  animation: 'spin 0.8s linear infinite',
                }}
              />
              <div style={{ fontSize: '0.9rem', fontWeight: 600 }}>
                {statusMessage}
              </div>
              <p style={{ fontSize: '0.785rem' }}>Extracting text and performing structured Gemini evaluation...</p>
            </div>
          )}
        </div>
      ) : (
        /* Resume Analysis Results View */
        <div style={{ display: 'flex', flexDirection: 'column', gap: '1.75rem' }} className="animate-fade-in">
          {/* Automatic Recommendation Banner */}
          <div
            style={{
              padding: '1.5rem',
              backgroundColor: 'var(--card)',
              border: '2px solid var(--foreground)',
              borderRadius: 'var(--radius-lg)',
              display: 'flex',
              flexWrap: 'wrap',
              alignItems: 'center',
              justifyContent: 'space-between',
              gap: '1rem',
            }}
          >
            <div>
              <div className="badge" style={{ marginBottom: '0.4rem' }}>
                <Sparkles size={12} />
                Analysis Complete
              </div>
              <h3 style={{ fontSize: '1.2rem', fontWeight: 700, marginBottom: '0.2rem' }}>
                Your resume analysis is complete!
              </h3>
              <p style={{ fontSize: '0.875rem' }}>
                Now practice questions based on your resume, projects, and skills.
              </p>
            </div>

            <button
              onClick={() => navigate('/interview')}
              className="btn-primary"
              style={{ padding: '0.75rem 1.4rem' }}
            >
              Start Personalized Mock Interview
              <ArrowRight size={16} />
            </button>
          </div>

          {/* Header Score Card */}
          <div
            className="card"
            style={{
              display: 'flex',
              flexWrap: 'wrap',
              alignItems: 'center',
              justifyContent: 'space-between',
              gap: '1.5rem',
              padding: '1.75rem',
            }}
          >
            <div>
              <div style={{ fontSize: '0.825rem', color: 'var(--muted-foreground)', fontWeight: 600, textTransform: 'uppercase' }}>
                ATS Compatibility & Quality Score
              </div>
              <div style={{ fontSize: '3rem', fontWeight: 800, lineHeight: 1.1, marginTop: '0.25rem' }}>
                {analysisResult.score} <span style={{ fontSize: '1.5rem', fontWeight: 400, opacity: 0.6 }}>/ 100</span>
              </div>
              <div style={{ fontSize: '0.85rem', color: 'var(--muted-foreground)', marginTop: '0.35rem' }}>
                Document evaluated: <strong>{analysisResult.fileName}</strong>
              </div>
            </div>

            <div style={{ display: 'flex', gap: '0.75rem', flexWrap: 'wrap' }}>
              <button
                onClick={() => { setAnalysisResult(null); setSelectedFile(null); setFileDetails(null); }}
                className="btn-outline btn-sm"
              >
                <RefreshCw size={14} />
                Analyze Again
              </button>
              <button
                onClick={() => navigate('/roadmap')}
                className="btn-secondary btn-sm"
              >
                View Career Roadmap
              </button>
            </div>
          </div>

          {/* Grid of Results */}
          <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(400px, 1fr))', gap: '1.5rem' }}>
            {/* Skills Identified */}
            <div className="card">
              <h3 style={{ fontSize: '1.05rem', fontWeight: 600, marginBottom: '0.75rem' }}>Skills Identified</h3>
              <div style={{ display: 'flex', flexWrap: 'wrap', gap: '0.5rem' }}>
                {analysisResult.detectedSkills?.map((skill, idx) => (
                  <span key={idx} className="badge" style={{ padding: '0.35rem 0.75rem', fontSize: '0.8rem' }}>
                    {skill}
                  </span>
                ))}
              </div>
            </div>

            {/* Education & Projects Summary */}
            <div className="card">
              <h3 style={{ fontSize: '1.05rem', fontWeight: 600, marginBottom: '0.75rem' }}>Education & Project Summary</h3>
              <div style={{ display: 'flex', flexDirection: 'column', gap: '0.75rem', fontSize: '0.875rem' }}>
                <div>
                  <div style={{ fontWeight: 600, color: 'var(--foreground)' }}>Academic Profile</div>
                  <div style={{ color: 'var(--muted-foreground)' }}>{analysisResult.educationSummary}</div>
                </div>
                <div>
                  <div style={{ fontWeight: 600, color: 'var(--foreground)' }}>Projects Detected</div>
                  <div style={{ color: 'var(--muted-foreground)' }}>{analysisResult.projectSummary}</div>
                </div>
              </div>
            </div>

            {/* Strengths */}
            <div className="card">
              <h3 style={{ fontSize: '1.05rem', fontWeight: 600, marginBottom: '0.75rem' }}>Strengths</h3>
              <ul style={{ listStyle: 'none', display: 'flex', flexDirection: 'column', gap: '0.65rem' }}>
                {analysisResult.strengths?.map((str, idx) => (
                  <li key={idx} style={{ display: 'flex', gap: '0.6rem', fontSize: '0.875rem' }}>
                    <Check size={16} style={{ flexShrink: 0, marginTop: '0.2rem' }} />
                    <span>{str}</span>
                  </li>
                ))}
              </ul>
            </div>

            {/* Missing or Unclear Details */}
            <div className="card">
              <h3 style={{ fontSize: '1.05rem', fontWeight: 600, marginBottom: '0.75rem' }}>Missing or Unclear Details</h3>
              <ul style={{ listStyle: 'none', display: 'flex', flexDirection: 'column', gap: '0.65rem' }}>
                {analysisResult.missingDetails?.map((item, idx) => (
                  <li key={idx} style={{ display: 'flex', gap: '0.6rem', fontSize: '0.875rem' }}>
                    <AlertCircle size={16} style={{ flexShrink: 0, marginTop: '0.2rem' }} />
                    <span>{item}</span>
                  </li>
                ))}
              </ul>
            </div>

            {/* Formatting Issues */}
            <div className="card">
              <h3 style={{ fontSize: '1.05rem', fontWeight: 600, marginBottom: '0.75rem' }}>Formatting Issues</h3>
              <ul style={{ listStyle: 'none', display: 'flex', flexDirection: 'column', gap: '0.65rem' }}>
                {analysisResult.formattingIssues?.map((fmt, idx) => (
                  <li key={idx} style={{ display: 'flex', gap: '0.6rem', fontSize: '0.875rem' }}>
                    <span style={{ fontWeight: 700 }}>•</span>
                    <span>{fmt}</span>
                  </li>
                ))}
              </ul>
            </div>

            {/* Improvement Suggestions & Target-Role Recommendations */}
            <div className="card">
              <h3 style={{ fontSize: '1.05rem', fontWeight: 600, marginBottom: '0.75rem' }}>Improvement Suggestions</h3>
              <ul style={{ listStyle: 'none', display: 'flex', flexDirection: 'column', gap: '0.65rem' }}>
                {analysisResult.improvementSuggestions?.map((sug, idx) => (
                  <li key={idx} style={{ display: 'flex', gap: '0.6rem', fontSize: '0.875rem' }}>
                    <Sparkles size={16} style={{ flexShrink: 0, marginTop: '0.2rem' }} />
                    <span>{sug}</span>
                  </li>
                ))}
              </ul>
              <div style={{ marginTop: '1.25rem', paddingTop: '1rem', borderTop: '1px solid var(--border)' }}>
                <h4 style={{ fontSize: '0.9rem', fontWeight: 600, marginBottom: '0.4rem' }}>Target-Role Recommendations:</h4>
                <ul style={{ listStyle: 'none', display: 'flex', flexDirection: 'column', gap: '0.4rem', fontSize: '0.825rem', color: 'var(--muted-foreground)' }}>
                  {analysisResult.targetRoleRecommendations?.map((rec, idx) => (
                    <li key={idx}>→ {rec}</li>
                  ))}
                </ul>
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
