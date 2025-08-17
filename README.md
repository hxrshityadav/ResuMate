# ResuMate

A modern, professional, and ATS-friendly resume builder built with React. Create stunning resumes that pass Applicant Tracking Systems and impress hiring managers.

## 🚀 Features

### Core Functionality
- **Multiple ATS-Compliant Templates**: Choose from 6 professional templates designed to pass ATS systems
- **Real-time Preview**: See your resume update instantly as you edit
- **PDF & DOCX Export**: Download your resume in both formats for maximum compatibility
- **Auto-save**: Never lose your work with automatic localStorage saving
- **Multiple Resumes**: Save and manage multiple resume versions

### Templates Available
1. **Modern Professional** - Clean, modern design with subtle accents
2. **Classic Traditional** - Conservative format for traditional industries
3. **Minimal Clean** - Ultra-clean design focusing on content
4. **Executive Elite** - Sophisticated design for senior positions
5. **Creative Professional** - Balanced creativity and professionalism
6. **Academic Scholar** - Optimized for academic and research positions

### Resume Sections
- **Personal Information** - Contact details and professional links
- **Professional Summary** - Compelling career overview
- **Work Experience** - Detailed employment history with achievements
- **Education** - Academic background and qualifications
- **Skills** - Technical and soft skills organized by category
- **Projects** - Showcase personal projects and contributions

## 🛠️ Technology Stack

- **Frontend**: React 18 with Hooks and Functional Components
- **Routing**: React Router DOM v6
- **State Management**: React Context API with useReducer
- **Styling**: Modern CSS with utility classes and responsive design
- **Export Libraries**:
  - `jspdf` - PDF generation
  - `html2canvas` - HTML to canvas conversion
  - `docx` - Word document creation
  - `file-saver` - File download functionality
- **Storage**: Browser localStorage for data persistence

## 📁 Project Structure

```
src/
├── components/
│   ├── Navbar.js              # Navigation component
│   ├── ResumeForm.js          # Form components for editing
│   └── ResumePreview.js       # Live preview component
├── pages/
│   ├── LandingPage.js         # Homepage with features
│   ├── Dashboard.js           # Main dashboard
│   ├── TemplateSelection.js   # Template chooser
│   ├── ResumeBuilder.js       # Resume editor with preview
│   └── ExportPage.js          # Export functionality
├── context/
│   └── ResumeContext.js       # Global state management
├── utils/
│   └── exportUtils.js         # PDF/DOCX export utilities
└── App.js                     # Main app component
```

## 🚀 Getting Started

### Prerequisites
- Node.js (version 14 or higher)
- npm or yarn package manager

### Installation

1. **Clone the repository**
   ```bash
   git clone <repository-url>
   cd resumate
   ```

2. **Install dependencies**
   ```bash
   npm install
   ```

3. **Start the development server**
   ```bash
   npm start
   ```

4. **Open your browser**
   Navigate to `http://localhost:3000` to view the application.

### Building for Production

```bash
npm run build
```

This creates an optimized production build in the `build` folder.

## 🎨 Design Features

### Modern UI/UX
- **Responsive Design**: Works perfectly on desktop, tablet, and mobile devices
- **Clean Interface**: Intuitive navigation and user-friendly forms
- **Smooth Animations**: CSS transitions and hover effects
- **Professional Color Scheme**: Carefully chosen colors for maximum appeal

### ATS Optimization
- **Semantic HTML**: Proper heading structure and semantic tags
- **Standard Fonts**: Arial, Inter, and Times New Roman for compatibility
- **No Images in Resume**: Text-only content for ATS parsing
- **Consistent Formatting**: Proper spacing and layout structure
- **Standard Section Names**: Using recognized section headings

## 📱 Responsive Breakpoints

- **Desktop**: 1200px and above
- **Tablet**: 768px - 1199px
- **Mobile**: Below 768px

All components are fully responsive and optimized for touch interactions on mobile devices.

## 💾 Data Storage

The application uses browser localStorage to persist data:
- Resume content is automatically saved as you type
- Multiple resumes can be saved and managed
- Data persists across browser sessions
- No server required - completely client-side

## 🔧 Key Components

### ResumeContext
Global state management using React Context API:
- Manages all resume data
- Handles CRUD operations for resume sections
- Provides actions for updating different resume parts
- Integrates with localStorage for persistence

### ResumeForm
Dynamic form component that renders different sections:
- Personal information fields
- Experience/Education/Project management with modals
- Skills management with categorization
- Real-time validation and user feedback

### ResumePreview
Live preview component with multiple template support:
- Renders resume in selected template style
- Updates in real-time as user edits
- Optimized for PDF/DOCX export
- Print-friendly styling

### Export Utilities
Client-side export functionality:
- **PDF Export**: Uses html2canvas + jsPDF for pixel-perfect rendering
- **DOCX Export**: Uses docx library for native Word document creation
- **File Naming**: Automatic naming with user name and date
- **Error Handling**: Comprehensive error handling and user feedback

## 🎯 Usage Guide

### Creating Your First Resume

1. **Start from Landing Page**: Click "Build My Resume" to begin
2. **Choose Template**: Select from 6 professional templates
3. **Fill Personal Info**: Add your contact details and professional links
4. **Add Content**: Complete each section (Experience, Education, Skills, etc.)
5. **Preview**: Use the live preview to see your resume in real-time
6. **Export**: Download as PDF or DOCX when ready

### Managing Multiple Resumes

- **Save Resume**: Use the "Save Resume" button to store your current work
- **Load Resume**: Access saved resumes from the Dashboard
- **Delete Resume**: Remove resumes you no longer need
- **Edit Existing**: Load and continue editing any saved resume

### Template Switching

- Templates can be changed at any time without losing content
- All data is preserved when switching between templates
- Each template is optimized for different industries and roles

## 🔍 ATS Compliance Features

### What Makes It ATS-Friendly

1. **Clean HTML Structure**: Proper semantic markup
2. **Standard Fonts**: Widely supported font families
3. **No Graphics**: Text-only content for parsing
4. **Consistent Formatting**: Uniform spacing and structure
5. **Standard Section Names**: Recognized by ATS systems
6. **Proper Hierarchy**: Correct heading levels (H1, H2, H3)

### Recommended Best Practices

- Use standard job titles and company names
- Include relevant keywords from job descriptions
- Keep formatting simple and consistent
- Use bullet points for achievements
- Include quantifiable results where possible

## 🚀 Performance Optimizations

- **Code Splitting**: Lazy loading of components
- **Optimized Images**: Compressed assets and proper formats
- **Efficient State Management**: Minimal re-renders with proper dependency arrays
- **CSS Optimization**: Utility classes and responsive design patterns
- **Bundle Optimization**: Tree shaking and minification in production

## 🔧 Customization

### Adding New Templates

1. Create template component in `ResumePreview.js`
2. Add template styles in `ResumePreview.css`
3. Update template list in `TemplateSelection.js`
4. Ensure ATS compliance in new template

### Extending Functionality

- Add new resume sections by updating the context and forms
- Integrate additional export formats
- Add more template customization options
- Implement user accounts and cloud storage

## 🐛 Troubleshooting

### Common Issues

**Export not working**:
- Ensure popup blockers are disabled
- Check browser compatibility for file downloads
- Try a different browser if issues persist

**Data not saving**:
- Check if localStorage is enabled in browser
- Clear browser cache and try again
- Ensure sufficient storage space

**Preview not updating**:
- Refresh the page
- Check console for JavaScript errors
- Ensure all required fields are filled

## 📄 Browser Support

- **Chrome**: Version 80+
- **Firefox**: Version 75+
- **Safari**: Version 13+
- **Edge**: Version 80+

## 📝 License

This project is open source and available under the [MIT License](LICENSE).

## 🤝 Contributing

Contributions are welcome! Please feel free to submit a Pull Request.

## 📞 Support

For support and questions, please open an issue in the GitHub repository.

---

**ResuMate - Built with ❤️ using React and modern web technologies**
