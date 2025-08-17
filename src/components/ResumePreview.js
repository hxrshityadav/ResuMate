import React from 'react';
import { useResume } from '../context/ResumeContext';
import './ResumePreview.css';

const ResumePreview = () => {
  const { state } = useResume();

  const formatDescription = (description) => {
    if (!description) return [];
    return description.split('\n').filter(line => line.trim());
  };

  const ModernTemplate = () => (
    <div className="resume-template modern-template">
      {/* Header */}
      <header className="resume-header">
        <h1 className="resume-name">{state.personalInfo.fullName || 'Your Name'}</h1>
        <div className="contact-info">
          {state.personalInfo.email && <span>{state.personalInfo.email}</span>}
          {state.personalInfo.phone && <span>{state.personalInfo.phone}</span>}
          {state.personalInfo.location && <span>{state.personalInfo.location}</span>}
          {state.personalInfo.linkedin && <span>{state.personalInfo.linkedin}</span>}
          {state.personalInfo.website && <span>{state.personalInfo.website}</span>}
        </div>
      </header>

      {/* Summary */}
      {state.summary && (
        <section className="resume-section">
          <h2 className="section-title">Professional Summary</h2>
          <p className="summary-text">{state.summary}</p>
        </section>
      )}

      {/* Experience */}
      {state.experience.length > 0 && (
        <section className="resume-section">
          <h2 className="section-title">Work Experience</h2>
          {state.experience.map((exp, index) => (
            <div key={index} className="experience-item">
              <div className="experience-header">
                <h3 className="job-title">{exp.position}</h3>
                <span className="job-date">
                  {exp.startDate} - {exp.current ? 'Present' : exp.endDate}
                </span>
              </div>
              <div className="company-info">
                <span className="company-name">{exp.company}</span>
                {exp.location && <span className="job-location">{exp.location}</span>}
              </div>
              {exp.description && (
                <div className="job-description">
                  {formatDescription(exp.description).map((line, i) => (
                    <p key={i}>{line}</p>
                  ))}
                </div>
              )}
            </div>
          ))}
        </section>
      )}

      {/* Education */}
      {state.education.length > 0 && (
        <section className="resume-section">
          <h2 className="section-title">Education</h2>
          {state.education.map((edu, index) => (
            <div key={index} className="education-item">
              <div className="education-header">
                <h3 className="degree-title">{edu.degree} in {edu.field}</h3>
                {edu.graduationDate && <span className="graduation-date">{edu.graduationDate}</span>}
              </div>
              <div className="institution-info">
                <span className="institution-name">{edu.institution}</span>
                {edu.location && <span className="institution-location">{edu.location}</span>}
              </div>
              {edu.gpa && <p className="gpa">GPA: {edu.gpa}</p>}
              {edu.description && <p className="education-description">{edu.description}</p>}
            </div>
          ))}
        </section>
      )}

      {/* Skills */}
      {state.skills.length > 0 && (
        <section className="resume-section">
          <h2 className="section-title">Skills</h2>
          <div className="skills-container">
            {Object.entries(
              state.skills.reduce((acc, skill) => {
                if (!acc[skill.category]) acc[skill.category] = [];
                acc[skill.category].push(skill.name);
                return acc;
              }, {})
            ).map(([category, skills]) => (
              <div key={category} className="skill-group">
                <h4 className="skill-category">{category}:</h4>
                <p className="skill-list">{skills.join(', ')}</p>
              </div>
            ))}
          </div>
        </section>
      )}

      {/* Projects */}
      {state.projects.length > 0 && (
        <section className="resume-section">
          <h2 className="section-title">Projects</h2>
          {state.projects.map((project, index) => (
            <div key={index} className="project-item">
              <div className="project-header">
                <h3 className="project-title">{project.name}</h3>
                {(project.startDate || project.endDate) && (
                  <span className="project-date">
                    {project.startDate} {project.endDate && `- ${project.endDate}`}
                  </span>
                )}
              </div>
              {project.technologies && (
                <p className="project-technologies">Technologies: {project.technologies}</p>
              )}
              {project.description && <p className="project-description">{project.description}</p>}
              <div className="project-links">
                {project.url && <span>Live Demo: {project.url}</span>}
                {project.github && <span>GitHub: {project.github}</span>}
              </div>
            </div>
          ))}
        </section>
      )}
    </div>
  );

  const ClassicTemplate = () => (
    <div className="resume-template classic-template">
      {/* Header */}
      <header className="resume-header">
        <h1 className="resume-name">{state.personalInfo.fullName || 'Your Name'}</h1>
        <div className="contact-info">
          {state.personalInfo.email && <div>{state.personalInfo.email}</div>}
          {state.personalInfo.phone && <div>{state.personalInfo.phone}</div>}
          {state.personalInfo.location && <div>{state.personalInfo.location}</div>}
          {state.personalInfo.linkedin && <div>{state.personalInfo.linkedin}</div>}
          {state.personalInfo.website && <div>{state.personalInfo.website}</div>}
        </div>
      </header>

      {/* Summary */}
      {state.summary && (
        <section className="resume-section">
          <h2 className="section-title">OBJECTIVE</h2>
          <p className="summary-text">{state.summary}</p>
        </section>
      )}

      {/* Experience */}
      {state.experience.length > 0 && (
        <section className="resume-section">
          <h2 className="section-title">EXPERIENCE</h2>
          {state.experience.map((exp, index) => (
            <div key={index} className="experience-item">
              <h3 className="job-title">{exp.position}</h3>
              <div className="company-line">
                <span className="company-name">{exp.company}</span>
                {exp.location && <span className="job-location">• {exp.location}</span>}
                <span className="job-date">• {exp.startDate} - {exp.current ? 'Present' : exp.endDate}</span>
              </div>
              {exp.description && (
                <div className="job-description">
                  {formatDescription(exp.description).map((line, i) => (
                    <p key={i}>{line}</p>
                  ))}
                </div>
              )}
            </div>
          ))}
        </section>
      )}

      {/* Education */}
      {state.education.length > 0 && (
        <section className="resume-section">
          <h2 className="section-title">EDUCATION</h2>
          {state.education.map((edu, index) => (
            <div key={index} className="education-item">
              <h3 className="degree-title">{edu.degree} in {edu.field}</h3>
              <div className="institution-line">
                <span className="institution-name">{edu.institution}</span>
                {edu.location && <span className="institution-location">• {edu.location}</span>}
                {edu.graduationDate && <span className="graduation-date">• {edu.graduationDate}</span>}
              </div>
              {edu.gpa && <p className="gpa">GPA: {edu.gpa}</p>}
              {edu.description && <p className="education-description">{edu.description}</p>}
            </div>
          ))}
        </section>
      )}

      {/* Skills */}
      {state.skills.length > 0 && (
        <section className="resume-section">
          <h2 className="section-title">SKILLS</h2>
          <div className="skills-container">
            {Object.entries(
              state.skills.reduce((acc, skill) => {
                if (!acc[skill.category]) acc[skill.category] = [];
                acc[skill.category].push(skill.name);
                return acc;
              }, {})
            ).map(([category, skills]) => (
              <div key={category} className="skill-group">
                <strong className="skill-category">{category}:</strong> {skills.join(', ')}
              </div>
            ))}
          </div>
        </section>
      )}

      {/* Projects */}
      {state.projects.length > 0 && (
        <section className="resume-section">
          <h2 className="section-title">PROJECTS</h2>
          {state.projects.map((project, index) => (
            <div key={index} className="project-item">
              <h3 className="project-title">{project.name}</h3>
              <div className="project-meta">
                {project.technologies && <span>Technologies: {project.technologies}</span>}
                {(project.startDate || project.endDate) && (
                  <span className="project-date">
                    • {project.startDate} {project.endDate && `- ${project.endDate}`}
                  </span>
                )}
              </div>
              {project.description && <p className="project-description">{project.description}</p>}
              <div className="project-links">
                {project.url && <div>Live Demo: {project.url}</div>}
                {project.github && <div>GitHub: {project.github}</div>}
              </div>
            </div>
          ))}
        </section>
      )}
    </div>
  );

  const MinimalTemplate = () => (
    <div className="resume-template minimal-template">
      {/* Header */}
      <header className="resume-header">
        <h1 className="resume-name">{state.personalInfo.fullName || 'Your Name'}</h1>
        <div className="contact-info">
          {[
            state.personalInfo.email,
            state.personalInfo.phone,
            state.personalInfo.location,
            state.personalInfo.linkedin,
            state.personalInfo.website
          ].filter(Boolean).join(' • ')}
        </div>
      </header>

      {/* Summary */}
      {state.summary && (
        <section className="resume-section">
          <p className="summary-text">{state.summary}</p>
        </section>
      )}

      {/* Experience */}
      {state.experience.length > 0 && (
        <section className="resume-section">
          <h2 className="section-title">Experience</h2>
          {state.experience.map((exp, index) => (
            <div key={index} className="experience-item">
              <div className="item-header">
                <h3 className="job-title">{exp.position}, {exp.company}</h3>
                <span className="job-date">
                  {exp.startDate} - {exp.current ? 'Present' : exp.endDate}
                </span>
              </div>
              {exp.location && <p className="job-location">{exp.location}</p>}
              {exp.description && (
                <div className="job-description">
                  {formatDescription(exp.description).map((line, i) => (
                    <p key={i}>{line}</p>
                  ))}
                </div>
              )}
            </div>
          ))}
        </section>
      )}

      {/* Education */}
      {state.education.length > 0 && (
        <section className="resume-section">
          <h2 className="section-title">Education</h2>
          {state.education.map((edu, index) => (
            <div key={index} className="education-item">
              <div className="item-header">
                <h3 className="degree-title">{edu.degree} in {edu.field}, {edu.institution}</h3>
                {edu.graduationDate && <span className="graduation-date">{edu.graduationDate}</span>}
              </div>
              {edu.location && <p className="institution-location">{edu.location}</p>}
              {edu.gpa && <p className="gpa">GPA: {edu.gpa}</p>}
              {edu.description && <p className="education-description">{edu.description}</p>}
            </div>
          ))}
        </section>
      )}

      {/* Skills */}
      {state.skills.length > 0 && (
        <section className="resume-section">
          <h2 className="section-title">Skills</h2>
          <p className="skills-text">
            {state.skills.map(skill => skill.name).join(' • ')}
          </p>
        </section>
      )}

      {/* Projects */}
      {state.projects.length > 0 && (
        <section className="resume-section">
          <h2 className="section-title">Projects</h2>
          {state.projects.map((project, index) => (
            <div key={index} className="project-item">
              <div className="item-header">
                <h3 className="project-title">{project.name}</h3>
                {(project.startDate || project.endDate) && (
                  <span className="project-date">
                    {project.startDate} {project.endDate && `- ${project.endDate}`}
                  </span>
                )}
              </div>
              {project.technologies && <p className="project-technologies">{project.technologies}</p>}
              {project.description && <p className="project-description">{project.description}</p>}
              <div className="project-links">
                {project.url && <span>{project.url}</span>}
                {project.github && project.url && <span> • </span>}
                {project.github && <span>{project.github}</span>}
              </div>
            </div>
          ))}
        </section>
      )}
    </div>
  );

  const renderTemplate = () => {
    switch (state.selectedTemplate) {
      case 'classic':
        return <ClassicTemplate />;
      case 'minimal':
        return <MinimalTemplate />;
      case 'executive':
        return <ClassicTemplate />; // Using classic for executive
      case 'creative':
        return <ModernTemplate />; // Using modern for creative
      case 'academic':
        return <ClassicTemplate />; // Using classic for academic
      default:
        return <ModernTemplate />;
    }
  };

  return (
    <div className="resume-preview" id="resume-preview">
      {renderTemplate()}
    </div>
  );
};

export default ResumePreview;
