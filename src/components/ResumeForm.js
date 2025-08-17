import React, { useState } from 'react';
import { useResume } from '../context/ResumeContext';
import './ResumeForm.css';

const ResumeForm = ({ activeSection }) => {
  const { state, actions } = useResume();

  const PersonalInfoForm = () => (
    <div className="form-section-content">
      <h3 className="section-title">Personal Information</h3>
      <p className="section-description">
        Add your basic contact information and professional details.
      </p>
      
      <div className="form-grid">
        <div className="form-group">
          <label className="form-label">Full Name *</label>
          <input
            type="text"
            value={state.personalInfo.fullName}
            onChange={(e) => actions.updatePersonalInfo({ fullName: e.target.value })}
            placeholder="John Doe"
            className="form-input"
          />
        </div>
        
        <div className="form-group">
          <label className="form-label">Email Address *</label>
          <input
            type="email"
            value={state.personalInfo.email}
            onChange={(e) => actions.updatePersonalInfo({ email: e.target.value })}
            placeholder="john.doe@email.com"
            className="form-input"
          />
        </div>
        
        <div className="form-group">
          <label className="form-label">Phone Number</label>
          <input
            type="tel"
            value={state.personalInfo.phone}
            onChange={(e) => actions.updatePersonalInfo({ phone: e.target.value })}
            placeholder="+1 (555) 123-4567"
            className="form-input"
          />
        </div>
        
        <div className="form-group">
          <label className="form-label">Location</label>
          <input
            type="text"
            value={state.personalInfo.location}
            onChange={(e) => actions.updatePersonalInfo({ location: e.target.value })}
            placeholder="City, State"
            className="form-input"
          />
        </div>
        
        <div className="form-group">
          <label className="form-label">LinkedIn Profile</label>
          <input
            type="url"
            value={state.personalInfo.linkedin}
            onChange={(e) => actions.updatePersonalInfo({ linkedin: e.target.value })}
            placeholder="https://linkedin.com/in/johndoe"
            className="form-input"
          />
        </div>
        
        <div className="form-group">
          <label className="form-label">Website/Portfolio</label>
          <input
            type="url"
            value={state.personalInfo.website}
            onChange={(e) => actions.updatePersonalInfo({ website: e.target.value })}
            placeholder="https://johndoe.com"
            className="form-input"
          />
        </div>
      </div>
    </div>
  );

  const SummaryForm = () => (
    <div className="form-section-content">
      <h3 className="section-title">Professional Summary</h3>
      <p className="section-description">
        Write a compelling summary that highlights your key qualifications and career objectives.
      </p>
      
      <div className="form-group">
        <label className="form-label">Summary</label>
        <textarea
          value={state.summary}
          onChange={(e) => actions.updateSummary(e.target.value)}
          placeholder="Experienced software engineer with 5+ years of experience in full-stack development..."
          className="form-input form-textarea"
          rows="6"
        />
        <div className="form-help">
          Aim for 3-4 sentences that showcase your experience, skills, and what you bring to the role.
        </div>
      </div>
    </div>
  );

  const ExperienceForm = () => {
    const [editingIndex, setEditingIndex] = useState(-1);
    const [currentExp, setCurrentExp] = useState({
      company: '',
      position: '',
      location: '',
      startDate: '',
      endDate: '',
      current: false,
      description: ''
    });

    const handleAdd = () => {
      setEditingIndex(-1);
      setCurrentExp({
        company: '',
        position: '',
        location: '',
        startDate: '',
        endDate: '',
        current: false,
        description: ''
      });
    };

    const handleEdit = (index) => {
      setEditingIndex(index);
      setCurrentExp(state.experience[index]);
    };

    const handleSave = () => {
      const newExperience = [...state.experience];
      if (editingIndex >= 0) {
        newExperience[editingIndex] = currentExp;
      } else {
        newExperience.push(currentExp);
      }
      actions.updateExperience(newExperience);
      handleAdd();
    };

    const handleDelete = (index) => {
      const newExperience = state.experience.filter((_, i) => i !== index);
      actions.updateExperience(newExperience);
    };

    return (
      <div className="form-section-content">
        <div className="section-header">
          <div>
            <h3 className="section-title">Work Experience</h3>
            <p className="section-description">
              Add your professional experience, starting with the most recent position.
            </p>
          </div>
          <button onClick={handleAdd} className="btn btn-primary btn-sm">
            Add Experience
          </button>
        </div>

        {/* Experience List */}
        <div className="items-list">
          {state.experience.map((exp, index) => (
            <div key={index} className="item-card">
              <div className="item-content">
                <h4 className="item-title">{exp.position}</h4>
                <p className="item-subtitle">{exp.company} • {exp.location}</p>
                <p className="item-date">
                  {exp.startDate} - {exp.current ? 'Present' : exp.endDate}
                </p>
              </div>
              <div className="item-actions">
                <button onClick={() => handleEdit(index)} className="btn-icon">
                  <svg fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M11 5H6a2 2 0 00-2 2v11a2 2 0 002 2h11a2 2 0 002-2v-5m-1.414-9.414a2 2 0 112.828 2.828L11.828 15H9v-2.828l8.586-8.586z" />
                  </svg>
                </button>
                <button onClick={() => handleDelete(index)} className="btn-icon delete">
                  <svg fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 7l-.867 12.142A2 2 0 0116.138 21H7.862a2 2 0 01-1.995-1.858L5 7m5 4v6m4-6v6m1-10V4a1 1 0 00-1-1h-4a1 1 0 00-1 1v3M4 7h16" />
                  </svg>
                </button>
              </div>
            </div>
          ))}
        </div>

        {/* Experience Form */}
        {(editingIndex >= 0 || editingIndex === -1) && (
          <div className="form-modal">
            <div className="form-modal-content">
              <h4 className="form-modal-title">
                {editingIndex >= 0 ? 'Edit Experience' : 'Add Experience'}
              </h4>
              
              <div className="form-grid">
                <div className="form-group">
                  <label className="form-label">Job Title *</label>
                  <input
                    type="text"
                    value={currentExp.position}
                    onChange={(e) => setCurrentExp({ ...currentExp, position: e.target.value })}
                    placeholder="Software Engineer"
                    className="form-input"
                  />
                </div>
                
                <div className="form-group">
                  <label className="form-label">Company *</label>
                  <input
                    type="text"
                    value={currentExp.company}
                    onChange={(e) => setCurrentExp({ ...currentExp, company: e.target.value })}
                    placeholder="Tech Company Inc."
                    className="form-input"
                  />
                </div>
                
                <div className="form-group">
                  <label className="form-label">Location</label>
                  <input
                    type="text"
                    value={currentExp.location}
                    onChange={(e) => setCurrentExp({ ...currentExp, location: e.target.value })}
                    placeholder="San Francisco, CA"
                    className="form-input"
                  />
                </div>
                
                <div className="form-group">
                  <label className="form-label">Start Date *</label>
                  <input
                    type="text"
                    value={currentExp.startDate}
                    onChange={(e) => setCurrentExp({ ...currentExp, startDate: e.target.value })}
                    placeholder="Jan 2020"
                    className="form-input"
                  />
                </div>
                
                <div className="form-group">
                  <label className="form-label">End Date</label>
                  <input
                    type="text"
                    value={currentExp.endDate}
                    onChange={(e) => setCurrentExp({ ...currentExp, endDate: e.target.value })}
                    placeholder="Dec 2022"
                    className="form-input"
                    disabled={currentExp.current}
                  />
                </div>
                
                <div className="form-group checkbox-group">
                  <label className="checkbox-label">
                    <input
                      type="checkbox"
                      checked={currentExp.current}
                      onChange={(e) => setCurrentExp({ ...currentExp, current: e.target.checked })}
                    />
                    <span className="checkbox-text">I currently work here</span>
                  </label>
                </div>
              </div>
              
              <div className="form-group">
                <label className="form-label">Job Description</label>
                <textarea
                  value={currentExp.description}
                  onChange={(e) => setCurrentExp({ ...currentExp, description: e.target.value })}
                  placeholder="• Developed and maintained web applications using React and Node.js&#10;• Collaborated with cross-functional teams to deliver high-quality software&#10;• Improved application performance by 40% through optimization techniques"
                  className="form-input form-textarea"
                  rows="6"
                />
                <div className="form-help">
                  Use bullet points to describe your key achievements and responsibilities.
                </div>
              </div>
              
              <div className="form-modal-actions">
                <button onClick={handleAdd} className="btn btn-secondary">
                  Cancel
                </button>
                <button onClick={handleSave} className="btn btn-primary">
                  Save Experience
                </button>
              </div>
            </div>
          </div>
        )}
      </div>
    );
  };

  const EducationForm = () => {
    const [editingIndex, setEditingIndex] = useState(-1);
    const [currentEdu, setCurrentEdu] = useState({
      institution: '',
      degree: '',
      field: '',
      location: '',
      graduationDate: '',
      gpa: '',
      description: ''
    });

    const handleAdd = () => {
      setEditingIndex(-1);
      setCurrentEdu({
        institution: '',
        degree: '',
        field: '',
        location: '',
        graduationDate: '',
        gpa: '',
        description: ''
      });
    };

    const handleEdit = (index) => {
      setEditingIndex(index);
      setCurrentEdu(state.education[index]);
    };

    const handleSave = () => {
      const newEducation = [...state.education];
      if (editingIndex >= 0) {
        newEducation[editingIndex] = currentEdu;
      } else {
        newEducation.push(currentEdu);
      }
      actions.updateEducation(newEducation);
      handleAdd();
    };

    const handleDelete = (index) => {
      const newEducation = state.education.filter((_, i) => i !== index);
      actions.updateEducation(newEducation);
    };

    return (
      <div className="form-section-content">
        <div className="section-header">
          <div>
            <h3 className="section-title">Education</h3>
            <p className="section-description">
              Add your educational background, including degrees, certifications, and relevant coursework.
            </p>
          </div>
          <button onClick={handleAdd} className="btn btn-primary btn-sm">
            Add Education
          </button>
        </div>

        {/* Education List */}
        <div className="items-list">
          {state.education.map((edu, index) => (
            <div key={index} className="item-card">
              <div className="item-content">
                <h4 className="item-title">{edu.degree} in {edu.field}</h4>
                <p className="item-subtitle">{edu.institution} • {edu.location}</p>
                <p className="item-date">{edu.graduationDate}</p>
              </div>
              <div className="item-actions">
                <button onClick={() => handleEdit(index)} className="btn-icon">
                  <svg fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M11 5H6a2 2 0 00-2 2v11a2 2 0 002 2h11a2 2 0 002-2v-5m-1.414-9.414a2 2 0 112.828 2.828L11.828 15H9v-2.828l8.586-8.586z" />
                  </svg>
                </button>
                <button onClick={() => handleDelete(index)} className="btn-icon delete">
                  <svg fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 7l-.867 12.142A2 2 0 0116.138 21H7.862a2 2 0 01-1.995-1.858L5 7m5 4v6m4-6v6m1-10V4a1 1 0 00-1-1h-4a1 1 0 00-1 1v3M4 7h16" />
                  </svg>
                </button>
              </div>
            </div>
          ))}
        </div>

        {/* Education Form */}
        {(editingIndex >= 0 || editingIndex === -1) && (
          <div className="form-modal">
            <div className="form-modal-content">
              <h4 className="form-modal-title">
                {editingIndex >= 0 ? 'Edit Education' : 'Add Education'}
              </h4>
              
              <div className="form-grid">
                <div className="form-group">
                  <label className="form-label">Institution *</label>
                  <input
                    type="text"
                    value={currentEdu.institution}
                    onChange={(e) => setCurrentEdu({ ...currentEdu, institution: e.target.value })}
                    placeholder="University of California"
                    className="form-input"
                  />
                </div>
                
                <div className="form-group">
                  <label className="form-label">Degree *</label>
                  <input
                    type="text"
                    value={currentEdu.degree}
                    onChange={(e) => setCurrentEdu({ ...currentEdu, degree: e.target.value })}
                    placeholder="Bachelor of Science"
                    className="form-input"
                  />
                </div>
                
                <div className="form-group">
                  <label className="form-label">Field of Study *</label>
                  <input
                    type="text"
                    value={currentEdu.field}
                    onChange={(e) => setCurrentEdu({ ...currentEdu, field: e.target.value })}
                    placeholder="Computer Science"
                    className="form-input"
                  />
                </div>
                
                <div className="form-group">
                  <label className="form-label">Location</label>
                  <input
                    type="text"
                    value={currentEdu.location}
                    onChange={(e) => setCurrentEdu({ ...currentEdu, location: e.target.value })}
                    placeholder="Berkeley, CA"
                    className="form-input"
                  />
                </div>
                
                <div className="form-group">
                  <label className="form-label">Graduation Date</label>
                  <input
                    type="text"
                    value={currentEdu.graduationDate}
                    onChange={(e) => setCurrentEdu({ ...currentEdu, graduationDate: e.target.value })}
                    placeholder="May 2020"
                    className="form-input"
                  />
                </div>
                
                <div className="form-group">
                  <label className="form-label">GPA (Optional)</label>
                  <input
                    type="text"
                    value={currentEdu.gpa}
                    onChange={(e) => setCurrentEdu({ ...currentEdu, gpa: e.target.value })}
                    placeholder="3.8/4.0"
                    className="form-input"
                  />
                </div>
              </div>
              
              <div className="form-group">
                <label className="form-label">Additional Details</label>
                <textarea
                  value={currentEdu.description}
                  onChange={(e) => setCurrentEdu({ ...currentEdu, description: e.target.value })}
                  placeholder="Relevant coursework, honors, activities, etc."
                  className="form-input form-textarea"
                  rows="4"
                />
              </div>
              
              <div className="form-modal-actions">
                <button onClick={handleAdd} className="btn btn-secondary">
                  Cancel
                </button>
                <button onClick={handleSave} className="btn btn-primary">
                  Save Education
                </button>
              </div>
            </div>
          </div>
        )}
      </div>
    );
  };

  const SkillsForm = () => {
    const [newSkill, setNewSkill] = useState('');
    const [skillCategory, setSkillCategory] = useState('Technical');

    const categories = ['Technical', 'Programming Languages', 'Frameworks', 'Tools', 'Soft Skills', 'Languages'];

    const addSkill = () => {
      if (newSkill.trim()) {
        const skillObj = {
          name: newSkill.trim(),
          category: skillCategory
        };
        actions.updateSkills([...state.skills, skillObj]);
        setNewSkill('');
      }
    };

    const removeSkill = (index) => {
      const newSkills = state.skills.filter((_, i) => i !== index);
      actions.updateSkills(newSkills);
    };

    const groupedSkills = state.skills.reduce((acc, skill) => {
      if (!acc[skill.category]) {
        acc[skill.category] = [];
      }
      acc[skill.category].push(skill);
      return acc;
    }, {});

    return (
      <div className="form-section-content">
        <h3 className="section-title">Skills</h3>
        <p className="section-description">
          Add your technical and soft skills. Group them by category for better organization.
        </p>

        {/* Add Skill */}
        <div className="add-skill-section">
          <div className="form-grid">
            <div className="form-group">
              <label className="form-label">Skill</label>
              <input
                type="text"
                value={newSkill}
                onChange={(e) => setNewSkill(e.target.value)}
                placeholder="React, JavaScript, Leadership..."
                className="form-input"
                onKeyPress={(e) => e.key === 'Enter' && addSkill()}
              />
            </div>
            <div className="form-group">
              <label className="form-label">Category</label>
              <select
                value={skillCategory}
                onChange={(e) => setSkillCategory(e.target.value)}
                className="form-input"
              >
                {categories.map(category => (
                  <option key={category} value={category}>{category}</option>
                ))}
              </select>
            </div>
          </div>
          <button onClick={addSkill} className="btn btn-primary">
            Add Skill
          </button>
        </div>

        {/* Skills List */}
        <div className="skills-list">
          {Object.keys(groupedSkills).map(category => (
            <div key={category} className="skill-category">
              <h4 className="category-title">{category}</h4>
              <div className="skills-tags">
                {groupedSkills[category].map((skill, index) => {
                  const globalIndex = state.skills.findIndex(s => s === skill);
                  return (
                    <div key={globalIndex} className="skill-tag">
                      <span>{skill.name}</span>
                      <button
                        onClick={() => removeSkill(globalIndex)}
                        className="remove-skill"
                      >
                        ×
                      </button>
                    </div>
                  );
                })}
              </div>
            </div>
          ))}
        </div>
      </div>
    );
  };

  const ProjectsForm = () => {
    const [editingIndex, setEditingIndex] = useState(-1);
    const [currentProject, setCurrentProject] = useState({
      name: '',
      description: '',
      technologies: '',
      url: '',
      github: '',
      startDate: '',
      endDate: ''
    });

    const handleAdd = () => {
      setEditingIndex(-1);
      setCurrentProject({
        name: '',
        description: '',
        technologies: '',
        url: '',
        github: '',
        startDate: '',
        endDate: ''
      });
    };

    const handleEdit = (index) => {
      setEditingIndex(index);
      setCurrentProject(state.projects[index]);
    };

    const handleSave = () => {
      const newProjects = [...state.projects];
      if (editingIndex >= 0) {
        newProjects[editingIndex] = currentProject;
      } else {
        newProjects.push(currentProject);
      }
      actions.updateProjects(newProjects);
      handleAdd();
    };

    const handleDelete = (index) => {
      const newProjects = state.projects.filter((_, i) => i !== index);
      actions.updateProjects(newProjects);
    };

    return (
      <div className="form-section-content">
        <div className="section-header">
          <div>
            <h3 className="section-title">Projects</h3>
            <p className="section-description">
              Showcase your personal projects, contributions, and side work.
            </p>
          </div>
          <button onClick={handleAdd} className="btn btn-primary btn-sm">
            Add Project
          </button>
        </div>

        {/* Projects List */}
        <div className="items-list">
          {state.projects.map((project, index) => (
            <div key={index} className="item-card">
              <div className="item-content">
                <h4 className="item-title">{project.name}</h4>
                <p className="item-subtitle">{project.technologies}</p>
                <p className="item-description">{project.description}</p>
              </div>
              <div className="item-actions">
                <button onClick={() => handleEdit(index)} className="btn-icon">
                  <svg fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M11 5H6a2 2 0 00-2 2v11a2 2 0 002 2h11a2 2 0 002-2v-5m-1.414-9.414a2 2 0 112.828 2.828L11.828 15H9v-2.828l8.586-8.586z" />
                  </svg>
                </button>
                <button onClick={() => handleDelete(index)} className="btn-icon delete">
                  <svg fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 7l-.867 12.142A2 2 0 0116.138 21H7.862a2 2 0 01-1.995-1.858L5 7m5 4v6m4-6v6m1-10V4a1 1 0 00-1-1h-4a1 1 0 00-1 1v3M4 7h16" />
                  </svg>
                </button>
              </div>
            </div>
          ))}
        </div>

        {/* Project Form */}
        {(editingIndex >= 0 || editingIndex === -1) && (
          <div className="form-modal">
            <div className="form-modal-content">
              <h4 className="form-modal-title">
                {editingIndex >= 0 ? 'Edit Project' : 'Add Project'}
              </h4>
              
              <div className="form-grid">
                <div className="form-group">
                  <label className="form-label">Project Name *</label>
                  <input
                    type="text"
                    value={currentProject.name}
                    onChange={(e) => setCurrentProject({ ...currentProject, name: e.target.value })}
                    placeholder="E-commerce Website"
                    className="form-input"
                  />
                </div>
                
                <div className="form-group">
                  <label className="form-label">Technologies Used</label>
                  <input
                    type="text"
                    value={currentProject.technologies}
                    onChange={(e) => setCurrentProject({ ...currentProject, technologies: e.target.value })}
                    placeholder="React, Node.js, MongoDB"
                    className="form-input"
                  />
                </div>
                
                <div className="form-group">
                  <label className="form-label">Project URL</label>
                  <input
                    type="url"
                    value={currentProject.url}
                    onChange={(e) => setCurrentProject({ ...currentProject, url: e.target.value })}
                    placeholder="https://project-demo.com"
                    className="form-input"
                  />
                </div>
                
                <div className="form-group">
                  <label className="form-label">GitHub Repository</label>
                  <input
                    type="url"
                    value={currentProject.github}
                    onChange={(e) => setCurrentProject({ ...currentProject, github: e.target.value })}
                    placeholder="https://github.com/username/project"
                    className="form-input"
                  />
                </div>
                
                <div className="form-group">
                  <label className="form-label">Start Date</label>
                  <input
                    type="text"
                    value={currentProject.startDate}
                    onChange={(e) => setCurrentProject({ ...currentProject, startDate: e.target.value })}
                    placeholder="Jan 2023"
                    className="form-input"
                  />
                </div>
                
                <div className="form-group">
                  <label className="form-label">End Date</label>
                  <input
                    type="text"
                    value={currentProject.endDate}
                    onChange={(e) => setCurrentProject({ ...currentProject, endDate: e.target.value })}
                    placeholder="Mar 2023"
                    className="form-input"
                  />
                </div>
              </div>
              
              <div className="form-group">
                <label className="form-label">Project Description</label>
                <textarea
                  value={currentProject.description}
                  onChange={(e) => setCurrentProject({ ...currentProject, description: e.target.value })}
                  placeholder="Built a full-stack e-commerce application with user authentication, payment processing, and admin dashboard..."
                  className="form-input form-textarea"
                  rows="4"
                />
              </div>
              
              <div className="form-modal-actions">
                <button onClick={handleAdd} className="btn btn-secondary">
                  Cancel
                </button>
                <button onClick={handleSave} className="btn btn-primary">
                  Save Project
                </button>
              </div>
            </div>
          </div>
        )}
      </div>
    );
  };

  const renderSection = () => {
    switch (activeSection) {
      case 'personal':
        return <PersonalInfoForm />;
      case 'summary':
        return <SummaryForm />;
      case 'experience':
        return <ExperienceForm />;
      case 'education':
        return <EducationForm />;
      case 'skills':
        return <SkillsForm />;
      case 'projects':
        return <ProjectsForm />;
      default:
        return <PersonalInfoForm />;
    }
  };

  return (
    <div className="resume-form">
      {renderSection()}
    </div>
  );
};

export default ResumeForm;
