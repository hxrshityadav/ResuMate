import React, { createContext, useContext, useReducer, useEffect } from 'react';

// Initial state for resume data
const initialState = {
  personalInfo: {
    fullName: '',
    email: '',
    phone: '',
    location: '',
    linkedin: '',
    website: ''
  },
  summary: '',
  experience: [],
  education: [],
  skills: [],
  projects: [],
  selectedTemplate: 'modern',
  resumes: [] // Array to store multiple resumes
};

// Action types
const actionTypes = {
  UPDATE_PERSONAL_INFO: 'UPDATE_PERSONAL_INFO',
  UPDATE_SUMMARY: 'UPDATE_SUMMARY',
  UPDATE_EXPERIENCE: 'UPDATE_EXPERIENCE',
  UPDATE_EDUCATION: 'UPDATE_EDUCATION',
  UPDATE_SKILLS: 'UPDATE_SKILLS',
  UPDATE_PROJECTS: 'UPDATE_PROJECTS',
  SELECT_TEMPLATE: 'SELECT_TEMPLATE',
  LOAD_RESUME: 'LOAD_RESUME',
  SAVE_RESUME: 'SAVE_RESUME',
  DELETE_RESUME: 'DELETE_RESUME',
  RESET_RESUME: 'RESET_RESUME'
};

// Reducer function
const resumeReducer = (state, action) => {
  switch (action.type) {
    case actionTypes.UPDATE_PERSONAL_INFO:
      return {
        ...state,
        personalInfo: { ...state.personalInfo, ...action.payload }
      };
    
    case actionTypes.UPDATE_SUMMARY:
      return {
        ...state,
        summary: action.payload
      };
    
    case actionTypes.UPDATE_EXPERIENCE:
      return {
        ...state,
        experience: action.payload
      };
    
    case actionTypes.UPDATE_EDUCATION:
      return {
        ...state,
        education: action.payload
      };
    
    case actionTypes.UPDATE_SKILLS:
      return {
        ...state,
        skills: action.payload
      };
    
    case actionTypes.UPDATE_PROJECTS:
      return {
        ...state,
        projects: action.payload
      };
    
    case actionTypes.SELECT_TEMPLATE:
      return {
        ...state,
        selectedTemplate: action.payload
      };
    
    case actionTypes.LOAD_RESUME:
      return {
        ...state,
        ...action.payload
      };
    
    case actionTypes.SAVE_RESUME:
      const resumeToSave = {
        id: action.payload.id || Date.now().toString(),
        name: action.payload.name || `Resume ${state.resumes.length + 1}`,
        createdAt: action.payload.createdAt || new Date().toISOString(),
        updatedAt: new Date().toISOString(),
        data: {
          personalInfo: state.personalInfo,
          summary: state.summary,
          experience: state.experience,
          education: state.education,
          skills: state.skills,
          projects: state.projects,
          selectedTemplate: state.selectedTemplate
        }
      };
      
      const existingIndex = state.resumes.findIndex(r => r.id === resumeToSave.id);
      let updatedResumes;
      
      if (existingIndex >= 0) {
        updatedResumes = [...state.resumes];
        updatedResumes[existingIndex] = resumeToSave;
      } else {
        updatedResumes = [...state.resumes, resumeToSave];
      }
      
      return {
        ...state,
        resumes: updatedResumes
      };
    
    case actionTypes.DELETE_RESUME:
      return {
        ...state,
        resumes: state.resumes.filter(resume => resume.id !== action.payload)
      };
    
    case actionTypes.RESET_RESUME:
      return {
        ...initialState,
        resumes: state.resumes // Keep saved resumes
      };
    
    default:
      return state;
  }
};

// Create context
const ResumeContext = createContext();

// Provider component
export const ResumeProvider = ({ children }) => {
  const [state, dispatch] = useReducer(resumeReducer, initialState);

  // Load data from localStorage on mount
  useEffect(() => {
    const savedData = localStorage.getItem('resumeBuilderData');
    if (savedData) {
      try {
        const parsedData = JSON.parse(savedData);
        dispatch({ type: actionTypes.LOAD_RESUME, payload: parsedData });
      } catch (error) {
        console.error('Error loading saved data:', error);
      }
    }
  }, []);

  // Save to localStorage whenever state changes
  useEffect(() => {
    localStorage.setItem('resumeBuilderData', JSON.stringify(state));
  }, [state]);

  // Action creators
  const actions = {
    updatePersonalInfo: (data) => dispatch({ type: actionTypes.UPDATE_PERSONAL_INFO, payload: data }),
    updateSummary: (summary) => dispatch({ type: actionTypes.UPDATE_SUMMARY, payload: summary }),
    updateExperience: (experience) => dispatch({ type: actionTypes.UPDATE_EXPERIENCE, payload: experience }),
    updateEducation: (education) => dispatch({ type: actionTypes.UPDATE_EDUCATION, payload: education }),
    updateSkills: (skills) => dispatch({ type: actionTypes.UPDATE_SKILLS, payload: skills }),
    updateProjects: (projects) => dispatch({ type: actionTypes.UPDATE_PROJECTS, payload: projects }),
    selectTemplate: (template) => dispatch({ type: actionTypes.SELECT_TEMPLATE, payload: template }),
    loadResume: (resumeData) => dispatch({ type: actionTypes.LOAD_RESUME, payload: resumeData }),
    saveResume: (resumeInfo) => dispatch({ type: actionTypes.SAVE_RESUME, payload: resumeInfo }),
    deleteResume: (resumeId) => dispatch({ type: actionTypes.DELETE_RESUME, payload: resumeId }),
    resetResume: () => dispatch({ type: actionTypes.RESET_RESUME })
  };

  return (
    <ResumeContext.Provider value={{ state, actions }}>
      {children}
    </ResumeContext.Provider>
  );
};

// Custom hook to use the context
export const useResume = () => {
  const context = useContext(ResumeContext);
  if (!context) {
    throw new Error('useResume must be used within a ResumeProvider');
  }
  return context;
};

export default ResumeContext;
