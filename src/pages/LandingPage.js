import React from 'react';
import { Link } from 'react-router-dom';
import { BentoGridDemo } from '../components/BentoGridDemo';
import './LandingPage.css';

const LandingPage = () => {
  const features = [
    {
      title: 'ATS-Compliant Templates',
      description: 'Our resume templates are designed to pass Applicant Tracking Systems with proper formatting and structure.',
      icon: (
        <svg className="feature-icon" fill="none" stroke="currentColor" viewBox="0 0 24 24">
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z" />
        </svg>
      )
    },
    {
      title: 'Professional Templates',
      description: 'Choose from multiple modern, clean templates designed by professionals to make you stand out.',
      icon: (
        <svg className="feature-icon" fill="none" stroke="currentColor" viewBox="0 0 24 24">
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 11H5m14 0a2 2 0 012 2v6a2 2 0 01-2 2H5a2 2 0 01-2-2v-6a2 2 0 012-2m14 0V9a2 2 0 00-2-2M5 11V9a2 2 0 012-2m0 0V5a2 2 0 012-2h6a2 2 0 012 2v2M7 7h10" />
        </svg>
      )
    },
    {
      title: 'Real-time Preview',
      description: 'See your resume update in real-time as you edit, ensuring perfect formatting before export.',
      icon: (
        <svg className="feature-icon" fill="none" stroke="currentColor" viewBox="0 0 24 24">
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 12a3 3 0 11-6 0 3 3 0 016 0z" />
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M2.458 12C3.732 7.943 7.523 5 12 5c4.478 0 8.268 2.943 9.542 7-1.274 4.057-5.064 7-9.542 7-4.477 0-8.268-2.943-9.542-7z" />
        </svg>
      )
    },
    {
      title: 'Multiple Export Formats',
      description: 'Download your resume as PDF or DOCX format, ready to submit to any employer.',
      icon: (
        <svg className="feature-icon" fill="none" stroke="currentColor" viewBox="0 0 24 24">
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 10v6m0 0l-3-3m3 3l3-3m2 8H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z" />
        </svg>
      )
    },
    {
      title: 'Auto-Save & Storage',
      description: 'Never lose your work with automatic saving and local storage of all your resume data.',
      icon: (
        <svg className="feature-icon" fill="none" stroke="currentColor" viewBox="0 0 24 24">
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M8 7H5a2 2 0 00-2 2v9a2 2 0 002 2h14a2 2 0 002-2V9a2 2 0 00-2-2h-3m-1 4l-3-3m0 0l-3 3m3-3v12" />
        </svg>
      )
    },
    {
      title: 'Mobile Responsive',
      description: 'Build and edit your resume on any device with our fully responsive design.',
      icon: (
        <svg className="feature-icon" fill="none" stroke="currentColor" viewBox="0 0 24 24">
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 18h.01M8 21h8a2 2 0 002-2V5a2 2 0 00-2-2H8a2 2 0 00-2 2v14a2 2 0 002 2z" />
        </svg>
      )
    }
  ];

  return (
    <div className="landing-page">
      {/* Header */}
      <header className="landing-header">
        <div className="container">
          <nav className="landing-nav">
            <div className="nav-logo">
              <span className="logo-text">Resu</span>
              <span className="logo-accent">Mate</span>
            </div>
            <div className="nav-actions">
              <Link to="/signin" className="btn btn-outline">
                Sign In
              </Link>
              <Link to="/signup" className="btn btn-primary">
                Get Started
              </Link>
            </div>
          </nav>
        </div>
      </header>

      {/* Hero Section */}
      <section className="hero-section">
        <div className="container">
          <div className="hero-content">
            <div className="hero-text">
              <h1 className="hero-title fade-in">
                Create Professional 
                <span className="text-gradient"> ATS-Friendly </span>
                Resumes with ResuMate
              </h1>
              <p className="hero-subtitle slide-up">
                Create stunning, professional resumes that pass Applicant Tracking Systems 
                and impress hiring managers. Choose from multiple templates, get real-time 
                preview, and export in PDF or DOCX format.
              </p>
              <div className="hero-buttons slide-up">
                <Link to="/signup" className="btn btn-primary btn-large">
                  <svg className="btn-icon" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M11 5H6a2 2 0 00-2 2v11a2 2 0 002 2h11a2 2 0 002-2v-5m-1.414-9.414a2 2 0 112.828 2.828L11.828 15H9v-2.828l8.586-8.586z" />
                  </svg>
                  Build My Resume
                </Link>
                <Link to="/templates" className="btn btn-secondary btn-large">
                  <svg className="btn-icon" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 12a3 3 0 11-6 0 3 3 0 016 0z" />
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M2.458 12C3.732 7.943 7.523 5 12 5c4.478 0 8.268 2.943 9.542 7-1.274 4.057-5.064 7-9.542 7-4.477 0-8.268-2.943-9.542-7z" />
                  </svg>
                  View Templates
                </Link>
              </div>
            </div>
            <div className="hero-visual">
              <div className="resume-preview-mockup">
                <div className="mockup-header">
                  <div className="mockup-dots">
                    <span></span>
                    <span></span>
                    <span></span>
                  </div>
                </div>
                <div className="mockup-content">
                  <div className="mockup-line long"></div>
                  <div className="mockup-line medium"></div>
                  <div className="mockup-line short"></div>
                  <div className="mockup-section">
                    <div className="mockup-line medium"></div>
                    <div className="mockup-line long"></div>
                    <div className="mockup-line short"></div>
                  </div>
                  <div className="mockup-section">
                    <div className="mockup-line short"></div>
                    <div className="mockup-line long"></div>
                    <div className="mockup-line medium"></div>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Features Section - Bento Grid */}
      <section className="features-section">
        <div className="container">
          <div className="section-header">
            <h2 className="section-title">Why Choose ResuMate?</h2>
            <p className="section-subtitle">
              Everything you need to create professional resumes that get you hired
            </p>
          </div>
          <div className="bento-grid-container">
            <BentoGridDemo />
          </div>
        </div>
      </section>

      {/* CTA Section */}
      <section className="cta-section gradient-bg">
        <div className="container">
          <div className="cta-content">
            <h2 className="cta-title">Ready to Build Your Perfect Resume?</h2>
            <p className="cta-subtitle">
              Join thousands of job seekers who have successfully landed their dream jobs 
              with our professional resume builder.
            </p>
            <Link to="/signup" className="btn btn-secondary btn-large">
              Start Building Now - It's Free!
            </Link>
          </div>
        </div>
      </section>

      {/* Footer */}
      <footer className="landing-footer">
        <div className="container">
          <div className="footer-content">
            <div className="footer-logo">
              <span className="logo-text">Resu</span>
              <span className="logo-accent">Mate</span>
            </div>
            <p className="footer-text">
              © 2024 ResuMate. Build professional, ATS-friendly resumes with ease.
            </p>
          </div>
        </div>
      </footer>
    </div>
  );
};

export default LandingPage;
