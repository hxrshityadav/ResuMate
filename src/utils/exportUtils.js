import html2canvas from 'html2canvas';
import jsPDF from 'jspdf';
import { Document, Packer, Paragraph, TextRun, HeadingLevel, AlignmentType } from 'docx';
import { saveAs } from 'file-saver';

// Export to PDF using html2canvas and jsPDF
export const exportToPDF = async (resumeData) => {
  try {
    const element = document.getElementById('resume-preview');
    if (!element) {
      throw new Error('Resume preview element not found');
    }

    // Create canvas from the resume preview
    const canvas = await html2canvas(element, {
      scale: 2,
      useCORS: true,
      allowTaint: true,
      backgroundColor: '#ffffff',
      width: element.scrollWidth,
      height: element.scrollHeight,
    });

    const imgData = canvas.toDataURL('image/png');
    const pdf = new jsPDF({
      orientation: 'portrait',
      unit: 'mm',
      format: 'a4',
    });

    const pdfWidth = pdf.internal.pageSize.getWidth();
    const pdfHeight = pdf.internal.pageSize.getHeight();
    const imgWidth = canvas.width;
    const imgHeight = canvas.height;
    
    // Calculate dimensions to fit the page
    const ratio = Math.min(pdfWidth / imgWidth, pdfHeight / imgHeight);
    const finalWidth = imgWidth * ratio;
    const finalHeight = imgHeight * ratio;
    
    // Center the image on the page
    const x = (pdfWidth - finalWidth) / 2;
    const y = (pdfHeight - finalHeight) / 2;

    pdf.addImage(imgData, 'PNG', x, y, finalWidth, finalHeight);

    // Generate filename
    const fileName = `${resumeData.personalInfo.fullName || 'Resume'}_${new Date().toISOString().split('T')[0]}.pdf`;
    
    pdf.save(fileName);
    return true;
  } catch (error) {
    console.error('PDF export failed:', error);
    throw error;
  }
};

// Export to Word document using docx library
export const exportToWord = async (resumeData) => {
  try {
    const children = [];

    // Helper function to add a section
    const addSection = (title, content) => {
      if (title) {
        children.push(
          new Paragraph({
            children: [
              new TextRun({
                text: title,
                bold: true,
                size: 24,
                color: "333333",
              }),
            ],
            heading: HeadingLevel.HEADING_2,
            spacing: { after: 200, before: 400 },
          })
        );
      }
      
      if (Array.isArray(content)) {
        content.forEach(item => children.push(item));
      } else if (content) {
        children.push(content);
      }
    };

    // Header with name and contact info
    if (resumeData.personalInfo.fullName) {
      children.push(
        new Paragraph({
          children: [
            new TextRun({
              text: resumeData.personalInfo.fullName,
              bold: true,
              size: 32,
              color: "1e293b",
            }),
          ],
          alignment: AlignmentType.CENTER,
          spacing: { after: 200 },
        })
      );
    }

    // Contact Information
    const contactInfo = [
      resumeData.personalInfo.email,
      resumeData.personalInfo.phone,
      resumeData.personalInfo.location,
      resumeData.personalInfo.linkedin,
      resumeData.personalInfo.website,
    ].filter(Boolean);

    if (contactInfo.length > 0) {
      children.push(
        new Paragraph({
          children: [
            new TextRun({
              text: contactInfo.join(' • '),
              size: 20,
              color: "64748b",
            }),
          ],
          alignment: AlignmentType.CENTER,
          spacing: { after: 400 },
        })
      );
    }

    // Professional Summary
    if (resumeData.summary) {
      addSection('PROFESSIONAL SUMMARY', 
        new Paragraph({
          children: [
            new TextRun({
              text: resumeData.summary,
              size: 20,
            }),
          ],
          spacing: { after: 200 },
        })
      );
    }

    // Work Experience
    if (resumeData.experience && resumeData.experience.length > 0) {
      const experienceContent = [];
      
      resumeData.experience.forEach((exp) => {
        // Job title
        experienceContent.push(
          new Paragraph({
            children: [
              new TextRun({
                text: exp.position,
                bold: true,
                size: 22,
              }),
            ],
            spacing: { after: 100 },
          })
        );

        // Company and dates
        const companyInfo = [
          exp.company,
          exp.location,
          `${exp.startDate} - ${exp.current ? 'Present' : exp.endDate}`
        ].filter(Boolean);

        experienceContent.push(
          new Paragraph({
            children: [
              new TextRun({
                text: companyInfo.join(' • '),
                italic: true,
                size: 20,
                color: "64748b",
              }),
            ],
            spacing: { after: 100 },
          })
        );

        // Job description
        if (exp.description) {
          const descriptionLines = exp.description.split('\n').filter(line => line.trim());
          descriptionLines.forEach(line => {
            experienceContent.push(
              new Paragraph({
                children: [
                  new TextRun({
                    text: line,
                    size: 20,
                  }),
                ],
                spacing: { after: 100 },
              })
            );
          });
        }

        experienceContent.push(
          new Paragraph({
            text: "",
            spacing: { after: 200 },
          })
        );
      });

      addSection('WORK EXPERIENCE', experienceContent);
    }

    // Education
    if (resumeData.education && resumeData.education.length > 0) {
      const educationContent = [];
      
      resumeData.education.forEach((edu) => {
        // Degree and field
        educationContent.push(
          new Paragraph({
            children: [
              new TextRun({
                text: `${edu.degree} in ${edu.field}`,
                bold: true,
                size: 22,
              }),
            ],
            spacing: { after: 100 },
          })
        );

        // Institution and details
        const eduInfo = [
          edu.institution,
          edu.location,
          edu.graduationDate
        ].filter(Boolean);

        educationContent.push(
          new Paragraph({
            children: [
              new TextRun({
                text: eduInfo.join(' • '),
                italic: true,
                size: 20,
                color: "64748b",
              }),
            ],
            spacing: { after: 100 },
          })
        );

        // GPA
        if (edu.gpa) {
          educationContent.push(
            new Paragraph({
              children: [
                new TextRun({
                  text: `GPA: ${edu.gpa}`,
                  size: 20,
                }),
              ],
              spacing: { after: 100 },
            })
          );
        }

        // Description
        if (edu.description) {
          educationContent.push(
            new Paragraph({
              children: [
                new TextRun({
                  text: edu.description,
                  size: 20,
                }),
              ],
              spacing: { after: 200 },
            })
          );
        }
      });

      addSection('EDUCATION', educationContent);
    }

    // Skills
    if (resumeData.skills && resumeData.skills.length > 0) {
      const skillsContent = [];
      
      // Group skills by category
      const groupedSkills = resumeData.skills.reduce((acc, skill) => {
        if (!acc[skill.category]) {
          acc[skill.category] = [];
        }
        acc[skill.category].push(skill.name);
        return acc;
      }, {});

      Object.entries(groupedSkills).forEach(([category, skills]) => {
        skillsContent.push(
          new Paragraph({
            children: [
              new TextRun({
                text: `${category}: `,
                bold: true,
                size: 20,
              }),
              new TextRun({
                text: skills.join(', '),
                size: 20,
              }),
            ],
            spacing: { after: 100 },
          })
        );
      });

      addSection('SKILLS', skillsContent);
    }

    // Projects
    if (resumeData.projects && resumeData.projects.length > 0) {
      const projectsContent = [];
      
      resumeData.projects.forEach((project) => {
        // Project name
        projectsContent.push(
          new Paragraph({
            children: [
              new TextRun({
                text: project.name,
                bold: true,
                size: 22,
              }),
            ],
            spacing: { after: 100 },
          })
        );

        // Technologies and dates
        const projectInfo = [
          project.technologies && `Technologies: ${project.technologies}`,
          project.startDate && project.endDate && `${project.startDate} - ${project.endDate}`
        ].filter(Boolean);

        if (projectInfo.length > 0) {
          projectsContent.push(
            new Paragraph({
              children: [
                new TextRun({
                  text: projectInfo.join(' • '),
                  italic: true,
                  size: 20,
                  color: "64748b",
                }),
              ],
              spacing: { after: 100 },
            })
          );
        }

        // Description
        if (project.description) {
          projectsContent.push(
            new Paragraph({
              children: [
                new TextRun({
                  text: project.description,
                  size: 20,
                }),
              ],
              spacing: { after: 100 },
            })
          );
        }

        // Links
        const links = [
          project.url && `Live Demo: ${project.url}`,
          project.github && `GitHub: ${project.github}`
        ].filter(Boolean);

        if (links.length > 0) {
          projectsContent.push(
            new Paragraph({
              children: [
                new TextRun({
                  text: links.join(' • '),
                  size: 18,
                  color: "64748b",
                }),
              ],
              spacing: { after: 200 },
            })
          );
        }
      });

      addSection('PROJECTS', projectsContent);
    }

    // Create the document
    const doc = new Document({
      sections: [
        {
          properties: {
            page: {
              margin: {
                top: 720,    // 0.5 inch
                right: 720,  // 0.5 inch
                bottom: 720, // 0.5 inch
                left: 720,   // 0.5 inch
              },
            },
          },
          children: children,
        },
      ],
    });

    // Generate and save the document
    const blob = await Packer.toBlob(doc);
    const fileName = `${resumeData.personalInfo.fullName || 'Resume'}_${new Date().toISOString().split('T')[0]}.docx`;
    
    saveAs(blob, fileName);
    return true;
  } catch (error) {
    console.error('Word export failed:', error);
    throw error;
  }
};
