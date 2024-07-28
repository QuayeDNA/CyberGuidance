import { Suspense, lazy } from 'react';
import { BrowserRouter as Router, Routes, Route, Navigate } from 'react-router-dom';
import './App.css';
import { AuthProvider } from './components/contexts/AuthContext';
import LoadingComponent from './components/LoadingComponent';
import ErrorBoundary from './components/ErrorBoundary';

// Lazy load components
const Landing = lazy(() => import('./pages/Landing'));
const ComingSoon = lazy(() => import('./components/ComingSoon'));
const NotFound = lazy(() => import('./pages/NotFound'));

// Student routes
const StudentLogin = lazy(() => import('./pages/students/Login'));
const StudentSignup = lazy(() => import('./pages/students/Signup'));
const StudentMain = lazy(() => import('./pages/students/Main'));
const StudentSetup = lazy(() => import('./pages/students/SetupPage'));
const StudentPersonalization = lazy(() => import('./pages/students/UserPersonalization'));
const VerifyEmail = lazy(() => import('./pages/students/VerifyEmail'));

// Counselor routes
const CounselorLogin = lazy(() => import('./pages/counsellors/Login'));
const CounselorMain = lazy(() => import('./pages/counsellors/Main'));

// Admin routes
const AdminLogin = lazy(() => import('./pages/admin/Login'));
const AdminLayout = lazy(() => import('./pages/admin/Main'));
const Overview = lazy(() => import('./pages/admin/Overview'));
const SystemSettings = lazy(() => import('./pages/admin/SystemSettings'));
const Users = lazy(() => import('./pages/admin/UserManagement'));
const AnalyticsReports = lazy(() => import('./pages/admin/AnalyticsReports'));
const Notifications = lazy(() => import('./pages/admin/NotificationsCenter'));
const Appointments = lazy(() => import('./pages/admin/AppointmentManagement'));


function App() {
    return (
        <AuthProvider>
            <ErrorBoundary>
                <div className="App">
                    <Router>
                        <Suspense fallback={<LoadingComponent />}>
                            <Routes>
                                {/* Public routes */}
                                <Route path="/" element={<Landing />} />
                                <Route path="/coming-soon" element={<ComingSoon />} />

                                {/* Student routes */}
                                <Route path="/student" element={<Navigate to="/student/login" replace />} />
                                <Route path="/student/verify-email" element={<VerifyEmail />} />
                                <Route path="/student/login" element={<StudentLogin />} />
                                <Route path="/student/signup" element={<StudentSignup />} />
                                <Route path="/student/setup" element={<StudentSetup />} />
                                <Route path="/student/user-personalization" element={<StudentPersonalization />} />
                                <Route path="/student/*" element={<StudentMain />} />

                                {/* Counselor routes */}
                                <Route path="/counselor" element={<Navigate to="/counselor/login" replace />} />
                                <Route path="/counselor/login" element={<CounselorLogin />} />
                                <Route path="/counselor/*" element={<CounselorMain />} />

                                {/* Admin routes */} 
                                <Route path="/admin/login" element={<AdminLogin />} />
                                <Route path="/admin" element={<AdminLayout />}>
                                    <Route index element={<Navigate to="overview" replace />} />
                                    <Route path="overview" element={<Overview />} />
                                    <Route path="users" element={<Users />} />
                                    <Route path="appointments" element={<Appointments />} />
                                    <Route path="analytics" element={<AnalyticsReports />} />
                                    <Route path="settings" element={<SystemSettings />} />
                                    <Route path="notifications" element={<Notifications />} />
                                </Route>
                               

                                {/* Catch-all route for 404 */}
                                <Route path="*" element={<NotFound />} />
                            </Routes>
                        </Suspense>
                    </Router>
                </div>
            </ErrorBoundary>
        </AuthProvider>
    );
}

export default App;