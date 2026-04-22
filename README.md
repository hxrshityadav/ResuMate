# AI Resume Builder

AI Resume Builder is a full-stack web application designed to help users create professional resumes quickly and efficiently using AI-generated 
content and dynamic form generation. The project is built using React.js for the frontend and Spring Boot for the backend, delivering an intuitive
experience to fill out every resume section and export it as a PDF.

---

## Project Overview

This project simplifies resume creation by:

- Dynamically generating form fields based on AI JSON responses
- Suggesting content for summary, skills, projects, and other essential sections
- Covering comprehensive resume components including personal info, education, experience, certifications, achievements, languages, and interests
- Providing live preview and PDF export functionality

---

## Technologies Used

- **Frontend:** React.js, Tailwind CSS, DaisyUI
- **Backend:** Spring Boot, Java
- **APIs:** OpenAI (for AI-generated resume content)
- **Tools:** Git, Maven, IntelliJ IDEA, VS Code
- **Databases:** MySQL (planned for future persistence)

---

## Installation & Setup

### 1. Clone the repository:
```bash
git clone https://github.com/adarshrai00/AI-Resume-Builder.git
cd AI-Resume-Builder
```

### 2. Setup Frontend:
```bash
cd frontend
npm install
npm start
```

### 3. Setup Backend:
```bash
cd ../backend
mvn clean install
mvn spring-boot:run
```

### 4. Configure API Keys:
Add your OpenAI API key in backend config (application.properties or environment variables).

---

## Challenges Faced & Solutions

### Dynamic AI JSON Parsing
**Challenge:** AI outputs were inconsistent or incomplete.  
**Solution:** Built robust parsers with validation and fallback mechanisms to prevent crashes.

### Malformed JSON Errors
**Challenge:** AI occasionally returned invalid JSON.  
**Solution:** Added error handling and corrective parsing routines.

### API Rate Limits and Latency
**Challenge:** OpenAI API limits slowed development.  
**Solution:** Implemented caching and optimized prompts to reduce call volume.

### Data Structure Synchronization
**Challenge:** Ensuring consistent schema between frontend and backend.  
**Solution:** Defined strict JSON schemas used in both client and server code.

### Responsive UI Design
**Challenge:** Making the app accessible across devices.  
**Solution:** Used Tailwind CSS and DaisyUI for mobile-first responsive layouts.

### PDF Generation Styling
**Challenge:** Creating professional, print-friendly resumes.  
**Solution:** Implemented custom CSS styles and layout optimization for PDF export functionality.

---

## Features

- **AI-Powered Content Generation:** Automatically generates resume sections based on user input
- **Dynamic Form Fields:** Forms adapt based on AI responses
- **Live Preview:** Real-time preview of resume as you build it
- **PDF Export:** Export your completed resume as a professional PDF
- **Responsive Design:** Works seamlessly across desktop, tablet, and mobile devices
- **Comprehensive Sections:** Covers all essential resume components

---

## Future Enhancements

- Database integration with MySQL for data persistence
- User authentication and profile management
- Multiple resume templates
- Resume analytics and optimization suggestions
- Integration with job boards and LinkedIn
