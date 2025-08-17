import React, { useState } from 'react';
import { Link } from 'react-router-dom';
import { useResume } from '../context/ResumeContext';
import ResumeForm from '../components/ResumeForm';
import ResumePreview from '../components/ResumePreview';
import './ResumeBuilder.css';

const ResumeBuilder = () => {
  const { state, actions } = useResume();
  const [activeSection, setActiveSection] = useState('personal');
  const [showSaveModal, setShowSaveModal] = useState(false);
  const [resumeName, setResumeName] = useState('');

  const sections = [
    { id: 'personal', label: 'Personal Info', icon: 'user' },
    { id: 'summary', label: 'Summary', icon: 'document' },
    { id: 'experience', label: 'Experience', icon: 'briefcase' },
    { id: 'education', label: 'Education', icon: 'academic' },
    { id: 'skills', label: 'Skills', icon: 'star' },
    { id: 'projects', label: 'Projects', icon: 'code' }
  ];

  const handleSaveResume = () => {
    if (!resumeName.trim()) {
      alert('Please enter a name for your resume');
      return;
    }
    
    actions.saveResume({ name: resumeName.trim() });
    setShowSaveModal(false);
    setResumeName('');
    alert('Resume saved successfully!');
  };

  const getIcon = (iconName) => {
    const icons = {
      user: (
        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M16 7a4 4 0 11-8 0 4 4 0 018 0zM12 14a7 7 0 00-7 7h14a7 7 0 00-7-7z" />
      ),
      document: (
        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12h6m-6 4h6m2 5H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z" />
      ),
      briefcase: (
        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M21 13.255A23.931 23.931 0 0112 15c-3.183 0-6.22-.62-9-1.745M16 6V4a2 2 0 00-2-2h-4a2 2 0 00-2-2v2m8 0H8m8 0v2a2 2 0 002 2v8a2 2 0 01-2 2H8a2 2 0 01-2-2v-8a2 2 0 012-2V8" />
      ),
      academic: (
        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 14l9-5-9-5-9 5 9 5z M12 14l6.16-3.422a12.083 12.083 0 01.665 6.479A11.952 11.952 0 0012 20.055a11.952 11.952 0 00-6.824-2.998 12.078 12.078 0 01.665-6.479L12 14z" />
      ),
      star: (
        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M11.049 2.927c.3-.921 1.603-.921 1.902 0l1.519 4.674a1 1 0 00.95.69h4.915c.969 0 1.371 1.24.588 1.81l-3.976 2.888a1 1 0 00-.363 1.118l1.518 4.674c.3.922-.755 1.688-1.538 1.118l-3.976-2.888a1 1 0 00-1.176 0l-3.976 2.888c-.783.57-1.838-.197-1.538-1.118l1.518-4.674a1 1 0 00-.363-1.118l-3.976-2.888c-.784-.57-.38-1.81.588-1.81h4.914a1 1 0 00.951-.69l1.519-4.674z" />
      ),
      code: (
        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M10 20l4-16m4 4l4 4-4 4M6 16l-4-4 4-4" />
      )
    };
    return icons[iconName] || icons.document;
  };

  const isComplete = (sectionId) => {
    switch (sectionId) {
      case 'personal':
        return state.personalInfo.fullName && state.personalInfo.email;
      case 'summary':
        return state.summary.trim().length > 0;
      case 'experience':
        return state.experience.length > 0;
      case 'education':
        return state.education.length > 0;
      case 'skills':
        return state.skills.length > 0;
      case 'projects':
        return state.projects.length > 0;
      default:
        return false;
    }
  };

  return (
    <div className="resume-builder">
      <div className="builder-container">
        {/* Header */}
        <div className="builder-header">
          <div className="header-left">
            <h1 className="builder-title">ResuMate Builder</h1>
            <p className="builder-subtitle">
              Template: <span className="template-name">{state.selectedTemplate}</span>
            </p>
          </div>
          <div className="header-actions">
            <button
              onClick={() => setShowSaveModal(true)}
              className="btn btn-outline"
            >
              <svg className="btn-icon" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M8 7H5a2 2 0 00-2 2v9a2 2 0 002 2h14a2 2 0 002-2V9a2 2 0 00-2-2h-3m-1 4l-3-3m0 0l-3 3m3-3v12" />
              </svg>
              Save Resume
            </button>
            <Link to="/export" className="btn btn-primary">
              <svg className="btn-icon" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 10v6m0 0l-3-3m3 3l3-3m2 8H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z" />
              </svg>
              Export Resume
            </Link>
          </div>
        </div>

        {/* Main Content */}
        <div className="builder-content">
          {/* Form Section */}
          <div className="form-section">
            {/* Section Navigation */}
            <div className="section-nav">
              <h3 className="nav-title">Resume Sections</h3>
              <div className="nav-items">
                {sections.map((section) => (
                  <button
                    key={section.id}
                    onClick={() => setActiveSection(section.id)}
                    className={`nav-item ${activeSection === section.id ? 'active' : ''} ${isComplete(section.id) ? 'complete' : ''}`}
                  >
                    <div className="nav-item-icon">
                      <svg fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        {getIcon(section.icon)}
                      </svg>
                    </div>
                    <span className="nav-item-label">{section.label}</span>
                    {isComplete(section.id) && (
                      <div className="completion-badge">
                        <svg fill="none" stroke="currentColor" viewBox="0 0 24 24">
                          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
                        </svg>
                      </div>
                    )}
                  </button>
                ))}
              </div>
            </div>

            {/* Form Content */}
            <div className="form-content">
              <ResumeForm activeSection={activeSection} />
            </div>
          </div>

          {/* Preview Section */}
          <div className="preview-section">
            <div className="preview-header">
              <h3 className="preview-title">Live Preview</h3>
              <div className="preview-actions">
                <Link to="/templates" className="btn btn-outline btn-sm">
                  Change Template
                </Link>
              </div>
            </div>
            <div className="preview-content">
              <ResumePreview />
            </div>
          </div>
        </div>
      </div>

      {/* Save Modal */}
      {showSaveModal && (
        <div className="modal-overlay" onClick={() => setShowSaveModal(false)}>
          <div className="modal-content" onClick={(e) => e.stopPropagation()}>
            <h3 className="modal-title">Save Resume</h3>
            <div className="form-group">
              <label className="form-label">Resume Name</label>
              <input
                type="text"
                value={resumeName}
                onChange={(e) => setResumeName(e.target.value)}
                placeholder="Enter a name for your resume"
                className="form-input"
                autoFocus
              />
            </div>
            <div className="modal-actions">
              <button
                onClick={() => setShowSaveModal(false)}
                className="btn btn-secondary"
              >
                Cancel
              </button>
              <button
                onClick={handleSaveResume}
                className="btn btn-primary"
              >
                Save Resume
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default ResumeBuilder;
