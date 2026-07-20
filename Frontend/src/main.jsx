import { StrictMode } from 'react';
import { createRoot } from 'react-dom/client';
import './index.css';

import Home from './pages/Home';
import Root from './pages/Root';
import { BrowserRouter, Routes, Route } from 'react-router-dom';
import Create from './pages/Create';
import { Toaster } from 'sonner';
import NotFound from './pages/NotFound';
import Login from './pages/Login';

import DashboardLayout from './pages/DashboardLayout';
import DashboardHome from './pages/dashboard/DashboardHome';
import MyResume from './pages/dashboard/MyResume';
import Profile from './pages/dashboard/Profile';
import Settings from './pages/dashboard/Settings';
import AtsChecker from './pages/AtsChecker';
import TargetResume from './pages/TargetResume';

import { AuthProvider } from './context/AuthContext';
import { ThemeProvider } from './context/ThemeContext';
import ProtectedRoute from './components/ProtectedRoute';
import { PageMotion } from './components/PageMotion';

import { ClerkProvider } from '@clerk/clerk-react';
import ClerkAuthAdapter from './components/ClerkAuthAdapter';

const PUBLISHABLE_KEY = import.meta.env.VITE_CLERK_PUBLISHABLE_KEY;

function SafeClerkProvider({ children }) {
    if (PUBLISHABLE_KEY && (PUBLISHABLE_KEY.startsWith('pk_test_') || PUBLISHABLE_KEY.startsWith('pk_live_'))) {
        return (
            <ClerkProvider publishableKey={PUBLISHABLE_KEY}>
                <ClerkAuthAdapter>{children}</ClerkAuthAdapter>
            </ClerkProvider>
        );
    }
    return children;
}

createRoot(document.getElementById('root')).render(
    <StrictMode>
        <SafeClerkProvider>
            <BrowserRouter>
                <ThemeProvider>
                    <AuthProvider>
                        <Toaster position="top-right" richColors />
                        <Routes>
                            {/* Public routes */}
                            <Route path='/' element={<Root />}>
                                <Route index element={<Home />} />
                                <Route path="ats-checker" element={<AtsChecker />} />
                                <Route path="target-resume" element={<TargetResume />} />
                                <Route
                                    path="create"
                                    element={
                                        <ProtectedRoute>
                                            <Create />
                                        </ProtectedRoute>
                                    }
                                />
                            </Route>

                            {/* Login page & Clerk SSO callback handler */}
                            <Route path="/login/*" element={<PageMotion routeKey="/login"><Login /></PageMotion>} />

                            {/* Protected dashboard */}
                            <Route
                                path="/dashboard"
                                element={
                                    <ProtectedRoute>
                                        <DashboardLayout />
                                    </ProtectedRoute>
                                }
                            >
                                <Route index element={<DashboardHome />} />
                                <Route path="resumes" element={<MyResume />} />
                                <Route path="profile" element={<Profile />} />
                                <Route path="settings" element={<Settings />} />
                            </Route>

                            <Route path="*" element={<PageMotion routeKey="not-found"><NotFound /></PageMotion>} />
                        </Routes>
                    </AuthProvider>
                </ThemeProvider>
            </BrowserRouter>
        </SafeClerkProvider>
    </StrictMode>
);
