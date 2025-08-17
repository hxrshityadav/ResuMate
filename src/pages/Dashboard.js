import React, { useState } from 'react';
import { Link } from 'react-router-dom';
import { useResume } from '../context/ResumeContext';
import DemoContent from '../components/DemoContent';
import './Dashboard.css';

const Dashboard = () => {
  const { state, actions } = useResume();
  const [showDeleteModal, setShowDeleteModal] = useState(false);
  const [resumeToDelete, setResumeToDelete] = useState(null);

  const handleDeleteResume = (resumeId) => {
    setResumeToDelete(resumeId);
    setShowDeleteModal(true);
  };

  const confirmDelete = () => {
    if (resumeToDelete) {
      actions.deleteResume(resumeToDelete);
      setShowDeleteModal(false);
      setResumeToDelete(null);
    }
  };

  const loadResume = (resume) => {
    actions.loadResume(resume.data);
  };

  const formatDate = (dateString) => {
    return new Date(dateString).toLocaleDateString('en-US', {
      year: 'numeric',
      month: 'short',
      day: 'numeric'
    });
  };

  return (
    <div className="dashboard">
      <div className="container">
        <div className="dashboard-content">
          {/* Sidebar */}
          <aside className="dashboard-sidebar">
            <div className="sidebar-content">
              <h2 className="sidebar-title">Dashboard</h2>
              
              <nav className="sidebar-nav">
                <div className="nav-section">
                  <h3 className="nav-section-title">Resume Tools</h3>
                  <Link to="/builder" className="nav-item">
                    <svg className="nav-icon" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M11 5H6a2 2 0 00-2 2v11a2 2 0 002 2h11a2 2 0 002-2v-5m-1.414-9.414a2 2 0 112.828 2.828L11.828 15H9v-2.828l8.586-8.586z" />
                    </svg>
                    Resume Builder
                  </Link>
                  <Link to="/templates" className="nav-item">
                    <svg className="nav-icon" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 11H5m14 0a2 2 0 012 2v6a2 2 0 01-2 2H5a2 2 0 01-2-2v-6a2 2 0 012-2m14 0V9a2 2 0 00-2-2M5 11V9a2 2 0 012-2m0 0V5a2 2 0 012-2h6a2 2 0 012 2v2M7 7h10" />
                    </svg>
                    Templates
                  </Link>
                  <Link to="/export" className="nav-item">
                    <svg className="nav-icon" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 10v6m0 0l-3-3m3 3l3-3m2 8H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z" />
                    </svg>
                    Export Resume
                  </Link>
                </div>

                <div className="nav-section">
                  <h3 className="nav-section-title">Quick Actions</h3>
                  <button 
                    onClick={() => actions.resetResume()}
                    className="nav-item nav-button"
                  >
                    <svg className="nav-icon" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 6v6m0 0v6m0-6h6m-6 0H6" />
                    </svg>
                    New Resume
                  </button>
                </div>
              </nav>
            </div>
          </aside>

          {/* Main Content */}
          <main className="dashboard-main">
            {/* Welcome Section */}
            <section className="welcome-section">
              <div className="welcome-content">
                <h1 className="welcome-title">
                  Welcome to ResuMate
                </h1>
                <p className="welcome-subtitle">
                  Create professional, ATS-friendly resumes that help you land your dream job.
                  Start building your resume or manage your existing ones.
                </p>
                <div className="welcome-actions">
                  <Link to="/builder" className="btn btn-primary">
                    <svg className="btn-icon" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M11 5H6a2 2 0 00-2 2v11a2 2 0 002 2h11a2 2 0 002-2v-5m-1.414-9.414a2 2 0 112.828 2.828L11.828 15H9v-2.828l8.586-8.586z" />
                    </svg>
                    Start Building
                  </Link>
                  <Link to="/templates" className="btn btn-secondary">
                    <svg className="btn-icon" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 12a3 3 0 11-6 0 3 3 0 016 0z" />
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M2.458 12C3.732 7.943 7.523 5 12 5c4.478 0 8.268 2.943 9.542 7-1.274 4.057-5.064 7-9.542 7-4.477 0-8.268-2.943-9.542-7z" />
                    </svg>
                    Browse Templates
                  </Link>
                </div>
              </div>
            </section>

            {/* Current Resume Status */}
            <section className="current-resume-section">
              <h2 className="section-title">Current Resume</h2>
              <div className="current-resume-card card">
                <div className="resume-info">
                  <div className="resume-details">
                    <h3 className="resume-name">
                      {state.personalInfo.fullName || 'Untitled Resume'}
                    </h3>
                    <p className="resume-template">
                      Template: <span className="template-name">{state.selectedTemplate}</span>
                    </p>
                    <div className="resume-progress">
                      <div className="progress-item">
                        <span className="progress-label">Personal Info:</span>
                        <span className={`progress-status ${state.personalInfo.fullName ? 'complete' : 'incomplete'}`}>
                          {state.personalInfo.fullName ? 'Complete' : 'Incomplete'}
                        </span>
                      </div>
                      <div className="progress-item">
                        <span className="progress-label">Experience:</span>
                        <span className={`progress-status ${state.experience.length > 0 ? 'complete' : 'incomplete'}`}>
                          {state.experience.length > 0 ? `${state.experience.length} entries` : 'None added'}
                        </span>
                      </div>
                      <div className="progress-item">
                        <span className="progress-label">Education:</span>
                        <span className={`progress-status ${state.education.length > 0 ? 'complete' : 'incomplete'}`}>
                          {state.education.length > 0 ? `${state.education.length} entries` : 'None added'}
                        </span>
                      </div>
                    </div>
                  </div>
                  <div className="resume-actions">
                    <Link to="/builder" className="btn btn-primary">
                      Continue Editing
                    </Link>
                    <Link to="/export" className="btn btn-outline">
                      Export
                    </Link>
                  </div>
                </div>
              </div>
            </section>

            {/* Saved Resumes */}
            <section className="saved-resumes-section">
              <div className="section-header">
                <h2 className="section-title">My Resumes</h2>
                <p className="section-subtitle">
                  {state.resumes.length} saved resume{state.resumes.length !== 1 ? 's' : ''}
                </p>
              </div>
              
              {state.resumes.length === 0 ? (
                <div className="empty-state card">
                  <div className="empty-icon">
                    <svg fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12h6m-6 4h6m2 5H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z" />
                    </svg>
                  </div>
                  <h3 className="empty-title">No saved resumes yet</h3>
                  <p className="empty-description">
                    Start building your first resume and save it to access it later.
                  </p>
                  <Link to="/builder" className="btn btn-primary">
                    Create Your First Resume
                  </Link>
                </div>
              ) : (
                <div className="resumes-grid grid grid-2">
                  {state.resumes.map((resume) => (
                    <div key={resume.id} className="resume-card card">
                      <div className="resume-card-header">
                        <h3 className="resume-card-title">{resume.name}</h3>
                        <div className="resume-card-actions">
                          <button
                            onClick={() => loadResume(resume)}
                            className="action-btn load-btn"
                            title="Load Resume"
                          >
                            <svg fill="none" stroke="currentColor" viewBox="0 0 24 24">
                              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 16v1a3 3 0 003 3h10a3 3 0 003-3v-1m-4-8l-4-4m0 0L8 8m4-4v12" />
                            </svg>
                          </button>
                          <button
                            onClick={() => handleDeleteResume(resume.id)}
                            className="action-btn delete-btn"
                            title="Delete Resume"
                          >
                            <svg fill="none" stroke="currentColor" viewBox="0 0 24 24">
                              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 7l-.867 12.142A2 2 0 0116.138 21H7.862a2 2 0 01-1.995-1.858L5 7m5 4v6m4-6v6m1-10V4a1 1 0 00-1-1h-4a1 1 0 00-1 1v3M4 7h16" />
                            </svg>
                          </button>
                        </div>
                      </div>
                      <div className="resume-card-content">
                        <p className="resume-card-name">
                          {resume.data.personalInfo.fullName || 'Unnamed Resume'}
                        </p>
                        <p className="resume-card-template">
                          Template: {resume.data.selectedTemplate}
                        </p>
                        <div className="resume-card-dates">
                          <p className="resume-card-date">
                            Created: {formatDate(resume.createdAt)}
                          </p>
                          <p className="resume-card-date">
                            Updated: {formatDate(resume.updatedAt)}
                          </p>
                        </div>
                      </div>
                    </div>
                  ))}
                </div>
              )}
            </section>

            {/* Demo Content */}
            <section className="demo-section">
              <DemoContent />
            </section>
          </main>
        </div>
      </div>

      {/* Delete Confirmation Modal */}
      {showDeleteModal && (
        <div className="modal-overlay" onClick={() => setShowDeleteModal(false)}>
          <div className="modal-content" onClick={(e) => e.stopPropagation()}>
            <h3 className="modal-title">Delete Resume</h3>
            <p className="modal-text">
              Are you sure you want to delete this resume? This action cannot be undone.
            </p>
            <div className="modal-actions">
              <button
                onClick={() => setShowDeleteModal(false)}
                className="btn btn-secondary"
              >
                Cancel
              </button>
              <button
                onClick={confirmDelete}
                className="btn btn-danger"
              >
                Delete
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default Dashboard;
