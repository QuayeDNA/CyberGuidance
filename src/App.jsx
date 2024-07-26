import { BrowserRouter as Router, Routes, Route, Navigate } from 'react-router-dom';
import './App.css';
import { AuthProvider } from './components/contexts/AuthContext';
// Student routes
import StudentLogin from "./pages/students/Login";
import StudentSignup from "./pages/students/Signup";
import StudentMain from "./pages/students/Main";
import StudentSetup from "./pages/students/SetupPage";
import StudentPersonalization from "./pages/students/UserPersonalization";

// Counselor routes
import CounselorLogin from "./pages/counsellors/Login";
import CounselorMain from "./pages/counsellors/Main";

// Admin routes
import AdminLogin from "./pages/admin/Login";
import AdminMain from "./pages/admin/Main";

// Shared components
import Landing from "./pages/Landing";
import ComingSoon from "./components/ComingSoon";
import NotFound from "./pages/NotFound";

function App() {
    return (
        <AuthProvider>
        <div className="App">
            <Router>
                <Routes>
                    {/* Public routes */}
                    <Route path="/" element={<Landing />} />
                    <Route path="/coming-soon" element={<ComingSoon />} />

                    {/* Student routes */}
                    <Route path="/student" element={<Navigate to="/student/login" replace />} />
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
                    <Route path="/admin" element={<Navigate to="/admin/login" replace />} />
                    <Route path="/admin/login" element={<AdminLogin />} />
                    <Route path="/admin/*" element={<AdminMain />} />

                    {/* Catch-all route for 404 */}
                    <Route path="*" element={<NotFound />} />
                </Routes>
            </Router>
        </div>
        </AuthProvider>
    );
}

export default App;