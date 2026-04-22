/**
 * Converts a resumeData object (from Create.jsx / localStorage) to plain text
 * suitable for ATS analysis.
 */
export const resumeToText = (data) => {
    const lines = [];

    if (data.name) lines.push(data.name);
    if (data.role) lines.push(data.role);
    if (data.email || data.phone || data.location) {
        const contact = [data.email, data.phone, data.location].filter(Boolean).join(' | ');
        lines.push(contact);
    }
    lines.push('');

    if (data.summary) {
        lines.push('PROFESSIONAL SUMMARY');
        lines.push(data.summary);
        lines.push('');
    }

    if (Array.isArray(data.skills) && data.skills.length) {
        lines.push('SKILLS');
        const skillNames = data.skills.map((s) =>
            typeof s === 'object' ? s.title || s.name || '' : s
        );
        lines.push(skillNames.filter(Boolean).join(', '));
        lines.push('');
    }

    if (Array.isArray(data.experience) && data.experience.length) {
        lines.push('EXPERIENCE');
        data.experience.forEach((exp) => {
            const title = exp.title || exp.jobTitle || '';
            const company = exp.company || '';
            const time = exp.time || exp.duration || '';
            lines.push(`${title}${company ? ' at ' + company : ''}${time ? ' | ' + time : ''}`);
            if (Array.isArray(exp.points)) {
                exp.points.forEach((p) => lines.push(`- ${p}`));
            } else if (exp.responsibility) {
                lines.push(`- ${exp.responsibility}`);
            }
            lines.push('');
        });
    }

    if (data.education) {
        lines.push('EDUCATION');
        if (Array.isArray(data.education)) {
            data.education.forEach((edu) => {
                lines.push(
                    [edu.degree, edu.university || edu.college, edu.graduationYear || edu.year]
                        .filter(Boolean)
                        .join(' — ')
                );
            });
        } else {
            lines.push(
                [data.education.degree, data.education.college, data.education.year]
                    .filter(Boolean)
                    .join(' — ')
            );
        }
        lines.push('');
    }

    if (Array.isArray(data.certifications) && data.certifications.length) {
        lines.push('CERTIFICATIONS');
        data.certifications.forEach((c) => {
            lines.push(`${c.title || ''} — ${c.issuingOrganization || ''} (${c.year || ''})`);
        });
        lines.push('');
    }

    if (Array.isArray(data.projects) && data.projects.length) {
        lines.push('PROJECTS');
        data.projects.forEach((p) => {
            lines.push(`${p.title || ''}: ${p.description || ''}`);
            if (Array.isArray(p.technologiesUsed) && p.technologiesUsed.length) {
                lines.push(`Technologies: ${p.technologiesUsed.join(', ')}`);
            }
        });
        lines.push('');
    }

    if (Array.isArray(data.achievements) && data.achievements.length) {
        lines.push('ACHIEVEMENTS');
        data.achievements.forEach((a) => {
            lines.push(`${a.title || ''} (${a.year || ''})`);
        });
        lines.push('');
    }

    if (Array.isArray(data.languages) && data.languages.length) {
        lines.push('LANGUAGES');
        lines.push(data.languages.map((l) => l.name || l).join(', '));
        lines.push('');
    }

    return lines.join('\n').trim();
};
