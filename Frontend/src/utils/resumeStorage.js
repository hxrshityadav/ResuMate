const STORAGE_KEY = 'ats_saved_resumes';

export const getSavedResumes = () => {
    try {
        return JSON.parse(localStorage.getItem(STORAGE_KEY) || '[]');
    } catch {
        return [];
    }
};

export const saveResume = (resumeData) => {
    const resumes = getSavedResumes();
    const entry = {
        id: Date.now(),
        title: `${resumeData.name || 'My Resume'} — ${resumeData.role || 'Resume'}`,
        createdAt: new Date().toLocaleDateString('en-US', {
            month: 'short',
            day: 'numeric',
            year: 'numeric',
        }),
        data: resumeData,
    };
    resumes.unshift(entry);
    localStorage.setItem(STORAGE_KEY, JSON.stringify(resumes.slice(0, 10)));
    return entry;
};

export const deleteResume = (id) => {
    const resumes = getSavedResumes().filter((r) => r.id !== id);
    localStorage.setItem(STORAGE_KEY, JSON.stringify(resumes));
};
