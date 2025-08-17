import React from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { useResume } from '../context/ResumeContext';
import './TemplateSelection.css';

const TemplateSelection = () => {
  const { state, actions } = useResume();
  const navigate = useNavigate();

  const templates = [
    {
      id: 'modern',
      name: 'Modern Professional',
      description: 'Clean, modern design with subtle accents. Perfect for tech and creative industries.',
      features: ['ATS-Compliant', 'Clean Layout', 'Modern Typography', 'Subtle Colors'],
      preview: '/api/placeholder/300/400'
    },
    {
      id: 'classic',
      name: 'Classic Traditional',
      description: 'Traditional format preferred by conservative industries like finance and law.',
      features: ['ATS-Compliant', 'Traditional Format', 'Professional', 'Conservative'],
      preview: '/api/placeholder/300/400'
    },
    {
      id: 'minimal',
      name: 'Minimal Clean',
      description: 'Ultra-clean design focusing on content. Great for any industry.',
      features: ['ATS-Compliant', 'Minimal Design', 'Content-Focused', 'Versatile'],
      preview: '/api/placeholder/300/400'
    },
    {
      id: 'executive',
      name: 'Executive Elite',
      description: 'Sophisticated design for senior-level positions and executives.',
      features: ['ATS-Compliant', 'Executive Style', 'Premium Look', 'Leadership-Focused'],
      preview: '/api/placeholder/300/400'
    },
    {
      id: 'creative',
      name: 'Creative Professional',
      description: 'Balanced creativity and professionalism for design and marketing roles.',
      features: ['ATS-Compliant', 'Creative Elements', 'Professional', 'Design-Forward'],
      preview: '/api/placeholder/300/400'
    },
    {
      id: 'academic',
      name: 'Academic Scholar',
      description: 'Designed for academic positions, research roles, and scholarly applications.',
      features: ['ATS-Compliant', 'Academic Format', 'Research-Focused', 'Publication-Ready'],
      preview: '/api/placeholder/300/400'
    }
  ];

  const handleTemplateSelect = (templateId) => {
    actions.selectTemplate(templateId);
    navigate('/builder');
  };

  const TemplatePreview = ({ template }) => (
    <div className="template-preview">
      <div className="template-mockup">
        <div className="mockup-header">
          <div className="mockup-name">John Doe</div>
          <div className="mockup-title">Software Engineer</div>
        </div>
        <div className="mockup-content">
          <div className="mockup-section">
            <div className="mockup-section-title">Experience</div>
            <div className="mockup-lines">
              <div className="mockup-line long"></div>
              <div className="mockup-line medium"></div>
              <div className="mockup-line short"></div>
            </div>
          </div>
          <div className="mockup-section">
            <div className="mockup-section-title">Education</div>
            <div className="mockup-lines">
              <div className="mockup-line medium"></div>
              <div className="mockup-line long"></div>
            </div>
          </div>
          <div className="mockup-section">
            <div className="mockup-section-title">Skills</div>
            <div className="mockup-skills">
              <span className="mockup-skill">JavaScript</span>
              <span className="mockup-skill">React</span>
              <span className="mockup-skill">Node.js</span>
            </div>
          </div>
        </div>
      </div>
    </div>
  );

  return (
    <div className="template-selection">
      <div className="container">
        {/* Header */}
        <div className="page-header">
          <div className="header-content">
            <h1 className="page-title">Choose Your Template</h1>
            <p className="page-subtitle">
              Select from our collection of ATS-friendly, professional resume templates. 
              All templates are designed to pass Applicant Tracking Systems while maintaining 
              a professional appearance.
            </p>
          </div>
          <div className="header-actions">
            <Link to="/dashboard" className="btn btn-secondary">
              <svg className="btn-icon" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M10 19l-7-7m0 0l7-7m-7 7h18" />
              </svg>
              Back to Dashboard
            </Link>
          </div>
        </div>

        {/* Current Selection */}
        {state.selectedTemplate && (
          <div className="current-selection">
            <div className="selection-info">
              <h3 className="selection-title">Current Template</h3>
              <p className="selection-template">
                {templates.find(t => t.id === state.selectedTemplate)?.name || state.selectedTemplate}
              </p>
            </div>
            <Link to="/builder" className="btn btn-primary">
              Continue with Current Template
            </Link>
          </div>
        )}

        {/* Templates Grid */}
        <div className="templates-section">
          <div className="section-header">
            <h2 className="section-title">Available Templates</h2>
            <p className="section-subtitle">
              All templates are ATS-compliant and professionally designed
            </p>
          </div>

          <div className="templates-grid">
            {templates.map((template) => (
              <div 
                key={template.id} 
                className={`template-card ${state.selectedTemplate === template.id ? 'selected' : ''}`}
              >
                <div className="template-card-header">
                  <TemplatePreview template={template} />
                  {state.selectedTemplate === template.id && (
                    <div className="selected-badge">
                      <svg fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
                      </svg>
                      Selected
                    </div>
                  )}
                </div>
                
                <div className="template-card-content">
                  <h3 className="template-name">{template.name}</h3>
                  <p className="template-description">{template.description}</p>
                  
                  <div className="template-features">
                    {template.features.map((feature, index) => (
                      <span key={index} className="feature-tag">
                        {feature}
                      </span>
                    ))}
                  </div>
                  
                  <div className="template-actions">
                    <button
                      onClick={() => handleTemplateSelect(template.id)}
                      className={`btn ${state.selectedTemplate === template.id ? 'btn-secondary' : 'btn-primary'}`}
                    >
                      {state.selectedTemplate === template.id ? 'Continue Editing' : 'Select Template'}
                    </button>
                    <button className="btn btn-outline preview-btn">
                      <svg className="btn-icon" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 12a3 3 0 11-6 0 3 3 0 016 0z" />
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M2.458 12C3.732 7.943 7.523 5 12 5c4.478 0 8.268 2.943 9.542 7-1.274 4.057-5.064 7-9.542 7-4.477 0-8.268-2.943-9.542-7z" />
                      </svg>
                      Preview
                    </button>
                  </div>
                </div>
              </div>
            ))}
          </div>
        </div>

        {/* ATS Information */}
        <div className="ats-info-section">
          <div className="info-card">
            <div className="info-icon">
              <svg fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z" />
              </svg>
            </div>
            <div className="info-content">
              <h3 className="info-title">ATS-Friendly Guarantee</h3>
              <p className="info-description">
                All our templates are designed to be compatible with Applicant Tracking Systems (ATS). 
                This means your resume will be properly parsed and read by automated systems used by 
                most employers today.
              </p>
              <ul className="info-features">
                <li>No complex layouts or graphics that confuse ATS systems</li>
                <li>Proper use of semantic HTML structure</li>
                <li>Standard fonts and formatting</li>
                <li>Optimized for both human readers and machines</li>
              </ul>
            </div>
          </div>
        </div>

        {/* Quick Start */}
        <div className="quick-start-section">
          <div className="quick-start-content">
            <h3 className="quick-start-title">Ready to get started?</h3>
            <p className="quick-start-description">
              Choose a template above and start building your professional resume in minutes.
            </p>
            <div className="quick-start-actions">
              <Link to="/builder" className="btn btn-primary">
                Start Building Resume
              </Link>
              <Link to="/dashboard" className="btn btn-outline">
                Back to Dashboard
              </Link>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default TemplateSelection;
