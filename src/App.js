import React from 'react';
import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
import { ResumeProvider } from './context/ResumeContext';
import { ThemeProvider } from './context/ThemeContext';

// Import pages
import LandingPage from './pages/LandingPage';
import SignIn from './pages/SignIn';
import SignUp from './pages/SignUp';
import Dashboard from './pages/Dashboard';
import TemplateSelection from './pages/TemplateSelection';
import ResumeBuilder from './pages/ResumeBuilder';
import ExportPage from './pages/ExportPage';

// Import components
import ModernNavbar from './components/ModernNavbar';
import AuthGuard from './components/AuthGuard';

function App() {
  return (
    <ThemeProvider>
      <ResumeProvider>
        <Router>
        <div className="App">
          <Routes>
            {/* Public pages without navbar */}
            <Route path="/" element={<LandingPage />} />
            <Route path="/signin" element={<SignIn />} />
            <Route path="/signup" element={<SignUp />} />
            
            {/* Protected app pages with navbar */}
            <Route path="/dashboard" element={
              <AuthGuard>
                <ModernNavbar />
                <Dashboard />
              </AuthGuard>
            } />
            <Route path="/templates" element={
              <AuthGuard>
                <ModernNavbar />
                <TemplateSelection />
              </AuthGuard>
            } />
            <Route path="/builder" element={
              <AuthGuard>
                <ModernNavbar />
                <ResumeBuilder />
              </AuthGuard>
            } />
            <Route path="/export" element={
              <AuthGuard>
                <ModernNavbar />
                <ExportPage />
              </AuthGuard>
            } />
          </Routes>
        </div>
        </Router>
      </ResumeProvider>
    </ThemeProvider>
  );
}

export default App;
