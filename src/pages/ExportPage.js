import React, { useState } from 'react';
import { Link } from 'react-router-dom';
import { useResume } from '../context/ResumeContext';
import ResumePreview from '../components/ResumePreview';
import { exportToPDF, exportToWord } from '../utils/exportUtils';
import './ExportPage.css';

const ExportPage = () => {
  const { state } = useResume();
  const [isExporting, setIsExporting] = useState(false);
  const [exportStatus, setExportStatus] = useState('');

  const handlePDFExport = async () => {
    setIsExporting(true);
    setExportStatus('Generating PDF...');
    
    try {
      await exportToPDF(state);
      setExportStatus('PDF exported successfully!');
    } catch (error) {
      console.error('PDF export error:', error);
      setExportStatus('Failed to export PDF. Please try again.');
    } finally {
      setIsExporting(false);
      setTimeout(() => setExportStatus(''), 3000);
    }
  };

  const handleWordExport = async () => {
    setIsExporting(true);
    setExportStatus('Generating Word document...');
    
    try {
      await exportToWord(state);
      setExportStatus('Word document exported successfully!');
    } catch (error) {
      console.error('Word export error:', error);
      setExportStatus('Failed to export Word document. Please try again.');
    } finally {
      setIsExporting(false);
      setTimeout(() => setExportStatus(''), 3000);
    }
  };

  const getCompletionStatus = () => {
    const sections = [
      { name: 'Personal Info', complete: state.personalInfo.fullName && state.personalInfo.email },
      { name: 'Summary', complete: state.summary.trim().length > 0 },
      { name: 'Experience', complete: state.experience.length > 0 },
      { name: 'Education', complete: state.education.length > 0 },
      { name: 'Skills', complete: state.skills.length > 0 }
    ];
    
    const completed = sections.filter(section => section.complete).length;
    const total = sections.length;
    
    return { completed, total, sections, percentage: Math.round((completed / total) * 100) };
  };

  const completionStatus = getCompletionStatus();

  return (
    <div className="export-page">
      <div className="export-container">
        {/* Header */}
        <div className="export-header">
          <div className="header-content">
            <h1 className="page-title">Export Your Resume</h1>
            <p className="page-subtitle">
              Download your professional resume in PDF or Word format, ready to submit to employers.
            </p>
          </div>
          <div className="header-actions">
            <Link to="/builder" className="btn btn-secondary">
              <svg className="btn-icon" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M11 5H6a2 2 0 00-2 2v11a2 2 0 002 2h11a2 2 0 002-2v-5m-1.414-9.414a2 2 0 112.828 2.828L11.828 15H9v-2.828l8.586-8.586z" />
              </svg>
              Edit Resume
            </Link>
          </div>
        </div>

        <div className="export-content">
          {/* Left Panel - Export Options */}
          <div className="export-panel">
            {/* Completion Status */}
            <div className="completion-card card">
              <h3 className="card-title">Resume Completion</h3>
              <div className="completion-progress">
                <div className="progress-bar">
                  <div 
                    className="progress-fill" 
                    style={{ width: `${completionStatus.percentage}%` }}
                  ></div>
                </div>
                <span className="progress-text">
                  {completionStatus.completed} of {completionStatus.total} sections completed ({completionStatus.percentage}%)
                </span>
              </div>
              <div className="completion-details">
                {completionStatus.sections.map((section, index) => (
                  <div key={index} className={`completion-item ${section.complete ? 'complete' : 'incomplete'}`}>
                    <div className="completion-icon">
                      {section.complete ? (
                        <svg fill="none" stroke="currentColor" viewBox="0 0 24 24">
                          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
                        </svg>
                      ) : (
                        <svg fill="none" stroke="currentColor" viewBox="0 0 24 24">
                          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 8v4m0 4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
                        </svg>
                      )}
                    </div>
                    <span className="completion-label">{section.name}</span>
                  </div>
                ))}
              </div>
            </div>

            {/* Resume Info */}
            <div className="resume-info-card card">
              <h3 className="card-title">Resume Details</h3>
              <div className="resume-details">
                <div className="detail-item">
                  <span className="detail-label">Name:</span>
                  <span className="detail-value">{state.personalInfo.fullName || 'Not specified'}</span>
                </div>
                <div className="detail-item">
                  <span className="detail-label">Template:</span>
                  <span className="detail-value template-name">{state.selectedTemplate}</span>
                </div>
                <div className="detail-item">
                  <span className="detail-label">Sections:</span>
                  <span className="detail-value">
                    {[
                      state.personalInfo.fullName && 'Personal Info',
                      state.summary && 'Summary',
                      state.experience.length > 0 && 'Experience',
                      state.education.length > 0 && 'Education',
                      state.skills.length > 0 && 'Skills',
                      state.projects.length > 0 && 'Projects'
                    ].filter(Boolean).length} sections
                  </span>
                </div>
              </div>
            </div>

            {/* Export Options */}
            <div className="export-options-card card">
              <h3 className="card-title">Export Options</h3>
              <div className="export-buttons">
                <button
                  onClick={handlePDFExport}
                  disabled={isExporting}
                  className="export-btn pdf-btn"
                >
                  <div className="btn-content">
                    <div className="btn-icon-wrapper">
                      <svg className="btn-icon" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M7 21h10a2 2 0 002-2V9.414a1 1 0 00-.293-.707l-5.414-5.414A1 1 0 0012.586 3H7a2 2 0 00-2 2v14a2 2 0 002 2z" />
                      </svg>
                    </div>
                    <div className="btn-text">
                      <h4 className="btn-title">Download PDF</h4>
                      <p className="btn-description">Best for online applications and email</p>
                    </div>
                  </div>
                </button>

                <button
                  onClick={handleWordExport}
                  disabled={isExporting}
                  className="export-btn word-btn"
                >
                  <div className="btn-content">
                    <div className="btn-icon-wrapper">
                      <svg className="btn-icon" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12h6m-6 4h6m2 5H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z" />
                      </svg>
                    </div>
                    <div className="btn-text">
                      <h4 className="btn-title">Download Word</h4>
                      <p className="btn-description">Editable format for further customization</p>
                    </div>
                  </div>
                </button>
              </div>

              {/* Export Status */}
              {exportStatus && (
                <div className={`export-status ${exportStatus.includes('successfully') ? 'success' : exportStatus.includes('Failed') ? 'error' : 'info'}`}>
                  <div className="status-icon">
                    {exportStatus.includes('successfully') ? (
                      <svg fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
                      </svg>
                    ) : exportStatus.includes('Failed') ? (
                      <svg fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
                      </svg>
                    ) : (
                      <svg fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13 16h-1v-4h-1m1-4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
                      </svg>
                    )}
                  </div>
                  <span className="status-text">{exportStatus}</span>
                </div>
              )}
            </div>

            {/* Tips */}
            <div className="tips-card card">
              <h3 className="card-title">Export Tips</h3>
              <ul className="tips-list">
                <li>
                  <strong>PDF Format:</strong> Preserves formatting perfectly and is widely accepted by employers and ATS systems.
                </li>
                <li>
                  <strong>Word Format:</strong> Allows further editing and customization but may have slight formatting differences.
                </li>
                <li>
                  <strong>ATS-Friendly:</strong> Both formats are optimized to pass Applicant Tracking Systems.
                </li>
                <li>
                  <strong>File Names:</strong> Downloads will be named with your name and the current date.
                </li>
              </ul>
            </div>
          </div>

          {/* Right Panel - Preview */}
          <div className="preview-panel">
            <div className="preview-header">
              <h3 className="preview-title">Final Preview</h3>
              <div className="preview-actions">
                <Link to="/templates" className="btn btn-outline btn-sm">
                  Change Template
                </Link>
              </div>
            </div>
            <div className="preview-container">
              <ResumePreview />
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default ExportPage;
