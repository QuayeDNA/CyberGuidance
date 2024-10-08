import { Suspense, lazy } from "react";
import {
  BrowserRouter as Router,
  Routes,
  Route,
  Navigate,
} from "react-router-dom";
import "./App.css";
import { AuthProvider } from "./components/contexts/AuthContext";
import LoadingComponent from "./components/LoadingComponent";
import ErrorBoundary from "./components/ErrorBoundary";
import ProtectedRoute from "./components/ProtectedRoute";
import { ToastContainer } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";

// Lazy load components
const Landing = lazy(() => import("./pages/Landing"));
const ComingSoon = lazy(() => import("./components/ComingSoon"));
const NotFound = lazy(() => import("./pages/NotFound"));
const Unauthorized = lazy(() => import("./components/Unauthorized"));
const Login = lazy(() => import("./pages/Login"));
// Student routes

const StudentSignup = lazy(() => import("./pages/students/Signup"));
const StudentMain = lazy(() => import("./pages/students/Main"));
const StudentSetup = lazy(() => import("./pages/students/SetupPage"));
const StudentPersonalization = lazy(() =>
  import("./pages/students/UserPersonalization")
);
const VerifyEmail = lazy(() => import("./pages/students/VerifyEmail"));

// Counselor routes
const CounselorMain = lazy(() => import("./pages/counsellors/Main"));
const CounselorProfile = lazy(() =>
  import("./pages/counsellors/UserPersonalization")
);
const CounselorSetup = lazy(() => import("./pages/counsellors/CounselorInfoPage"));

// Admin routes
const AdminSignup = lazy(() => import("./pages/admin/Signup"));
const AdminLogin = lazy(() => import("./pages/admin/Login"));
const AdminLayout = lazy(() => import("./pages/admin/Main"));
const Overview = lazy(() => import("./pages/admin/Overview"));
const SystemSettings = lazy(() => import("./pages/admin/SystemSettings"));
const Users = lazy(() => import("./pages/admin/UserManagement"));
const AnalyticsReports = lazy(() => import("./pages/admin/AnalyticsReports"));
const Notifications = lazy(() => import("./pages/admin/NotificationsCenter"));
const Appointments = lazy(() => import("./pages/admin/AppointmentManagement"));
const Reports = lazy(() => import("./pages/admin/Reports"));

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
                <Route path="/verify-email" element={<VerifyEmail />} />
                <Route path="/login" element={<Login />} />
                <Route path="/admin/login" element={<AdminLogin />} />
                <Route path="/student/signup" element={<StudentSignup />} />
                <Route path="/admin/signup" element={<AdminSignup />} />

                {/* Protected Student routes */}
                <Route
                  path="/student"
                  element={
                    <ProtectedRoute roles={["student"]}>
                      <Navigate to="/student/dashboard" replace />
                    </ProtectedRoute>
                  }
                />
                <Route
                  path="/student/first-login"
                  element={
                    <ProtectedRoute roles={["student"]}>
                      <StudentSetup />
                    </ProtectedRoute>
                  }
                />
                <Route
                  path="/student/user-personalization"
                  element={
                    <ProtectedRoute roles={["student"]}>
                      <StudentPersonalization />
                    </ProtectedRoute>
                  }
                />
                <Route
                  path="/student/*"
                  element={
                    <ProtectedRoute roles={["student"]}>
                      <StudentMain />
                    </ProtectedRoute>
                  }
                />

                {/* Protected Counselor routes */}
                <Route
                  path="/counselor"
                  element={
                    <ProtectedRoute roles={["counselor"]}>
                      <Navigate to="/counselor/dashboard" replace />
                    </ProtectedRoute>
                  }
                />
                <Route
                  path="/counselor/first-login"
                  element={
                    <ProtectedRoute roles={["counselor"]}>
                      <CounselorProfile />
                    </ProtectedRoute>
                  }
                />
                <Route
                  path="/counselor/setup" 
                  element={
                    <ProtectedRoute roles={["counselor"]}>
                      <CounselorSetup />
                    </ProtectedRoute>
                  }
                />
                <Route
                  path="/counselor/*"
                  element={
                    <ProtectedRoute roles={["counselor"]}>
                      <CounselorMain />
                    </ProtectedRoute>
                  }
                />

                {/* Protected Admin routes */}
                <Route
                  path="/admin/*"
                  element={
                    <ProtectedRoute roles={["admin"]}>
                      <AdminLayout />
                    </ProtectedRoute>
                  }>
                  <Route index element={<Navigate to="overview" />} />
                  <Route path="overview" element={<Overview />} />
                  <Route path="users" element={<Users />} />
                  <Route path="appointments" element={<Appointments />} />
                  <Route path='reports' element={<Reports />} />
                  <Route path="analytics" element={<AnalyticsReports />} />
                  <Route path="settings" element={<SystemSettings />} />
                  <Route path="notifications" element={<Notifications />} />
                </Route>

                {/* Catch-all route for 404 */}
                <Route path="*" element={<NotFound />} />

                {/* Catch-all route for 401 */}
                <Route path="/unauthorized" element={<Unauthorized />} />
              </Routes>
            </Suspense>
          </Router>
        </div>
      </ErrorBoundary>
      <ToastContainer />
    </AuthProvider>
  );
}

export default App;
