import { useState, useEffect } from "react";
import { useNavigate, Link, Navigate } from "react-router-dom";
import axios from "axios";
import { useAuth } from '../components/contexts/AuthContext';
import Footer from "../components/Footer";
import bgImage from "../assets/Counselling.jpg";
import LoginForm from "./LoginForm";
import { FaSpinner } from "react-icons/fa";
import ForgotPasswordForm from "./ForgotPasswordForm";
import OtpVerificationForm from "./OtpVerificationForm";
import ResetPasswordForm from "./ResetPasswordForm";

function Login() {
  const navigate = useNavigate();
  const [isLoading, setIsLoading] = useState(false);
  const [showCard, setShowCard] = useState(false);
  const [error, setError] = useState("");
  const { userData, login } = useAuth();
  const [isUnverified, setIsUnverified] = useState(false);
  const [unverifiedEmail, setUnverifiedEmail] = useState("");
  const [loginState, setLoginState] = useState("login");
  const [resetEmail, setResetEmail] = useState("");

  useEffect(() => {
    const timer = setTimeout(() => {
      setShowCard(true);
    }, 1000);

    return () => clearTimeout(timer);
  }, []);

  if (userData) {
    const redirectPath = userData.isStudent ? '/student/dashboard' :
                         userData.isCounselor ? '/counselor/dashboard' :
                         userData.isAdmin ? '/admin/dashboard' : '/';
    return <Navigate to={redirectPath} replace />;
  }

  const handleLogin = async (data) => {
    setIsLoading(true);
    setError("");
  
    try {
      const response = await axios.post("https://cyber-guidance.onrender.com/api/login", {
        email: data.email,
        password: data.password,
      });
      
      login({
        token: response.data.token,
        isStudent: response.data.isStudent,
        isCounselor: response.data.isCounselor,
        isAdmin: response.data.isAdmin,
        isFirstLogin: response.data.isFirstLogin
      });
      localStorage.setItem("userToken", response.data.token);
  
      if (response.data.isStudent) {
        if (response.data.isFirstLogin) {
          navigate('/student/first-login');
        } else {
          navigate('/student/dashboard');
        }
      } else if (response.data.isCounselor) {
        navigate('/counselor/dashboard');
      } else if (response.data.isAdmin) {
        navigate('/admin/dashboard');
      }
    } catch (error) {
      if (error.response?.data?.message === "Account not verified. Check your email for verification instructions") {
        setIsUnverified(true);
        setUnverifiedEmail(data.email);
      } else {
        setError(error.response?.data?.message || "Login failed. Please try again.");
      }
    } finally {
      setIsLoading(false);
    }
  };

  const handleResendVerification = async () => {
    setIsLoading(true);
    try {
      await axios.post("https://cyber-guidance.onrender.com/api/resend-verification-email", {
        email: unverifiedEmail,
      });
      setError("Verification email resent. Please check your inbox.");
    } catch (error) {
      setError("Failed to resend verification email. Please try again.");
    } finally {
      setIsLoading(false);
    }
  };

  const handleForgotPassword = async (data) => {
    setIsLoading(true);
    setError("");
  
    try {
      await axios.post("https://cyber-guidance.onrender.com/api/forgot-password", {
        email: data.email,
      });
      setResetEmail(data.email);
      setLoginState("otpVerification");
    } catch (error) {
      setError(error.response?.data?.message || "Failed to request password reset. Please try again.");
    } finally {
      setIsLoading(false);
    }
  };

  const handleOtpVerification = async (data) => {
    setIsLoading(true);
    setError("");
  
    try {
      await axios.post("https://cyber-guidance.onrender.com/api/verify-otp", {
        email: resetEmail,
        otp: data.otp,
      });
      setLoginState("resetPassword");
    } catch (error) {
      setError(error.response?.data?.message || "Invalid OTP. Please try again.");
    } finally {
      setIsLoading(false);
    }
  };

  const handleResetPassword = async (data) => {
    setIsLoading(true);
    setError("");
  
    try {
      await axios.post("https://cyber-guidance.onrender.com/api/reset-password", {
        email: resetEmail,
        newPassword: data.newPassword,
      });
      setError("Password reset successfully. You can now log in with your new password.");
      setLoginState("login");
    } catch (error) {
      setError(error.response?.data?.message || "Failed to reset password. Please try again.");
    } finally {
      setIsLoading(false);
    }
  };

  const renderForm = () => {
    switch (loginState) {
      case "login":
        return (
          <LoginForm 
            onSubmit={handleLogin} 
            isLoading={isLoading} 
            onForgotPassword={() => setLoginState("forgotPassword")} 
          />
        );
      case "forgotPassword":
        return (
          <ForgotPasswordForm 
            onSubmit={handleForgotPassword} 
            isLoading={isLoading} 
            onBackToLogin={() => setLoginState("login")} 
          />
        );
      case "otpVerification":
        return (
          <OtpVerificationForm 
            onSubmit={handleOtpVerification} 
            isLoading={isLoading} 
          />
        );
      case "resetPassword":
        return (
          <ResetPasswordForm 
            onSubmit={handleResetPassword} 
            isLoading={isLoading} 
          />
        );
      default:
        return null;
    }
  };

  return (
    <div className="flex flex-col min-h-screen">
      <div className="relative flex-grow flex items-center justify-center">
        <div className="absolute inset-0">
          <img src={bgImage} alt="Background" className="w-full h-full object-cover" />
          <div className="absolute inset-0 bg-black opacity-50"></div>
        </div>
        {!showCard ? (
          <div className="relative z-10">
            <FaSpinner className="animate-spin text-white text-4xl" />
          </div>
        ) : (
          <div className="relative z-10 bg-white p-8 rounded-lg shadow-lg w-full max-w-md transition-all duration-500 ease-in-out transform hover:scale-105">
            <h2 className="text-3xl font-bold text-center mb-6 text-blue-600">
              {loginState === "login" ? "Welcome Back" : "Reset Password"}
            </h2>
            <p className="text-center text-gray-600 mb-6">
              {loginState === "login" ? "We're here to support you. Please log in to continue." : "Follow the steps to reset your password."}
            </p>
            {error && (
              <div className="bg-red-100 border border-red-400 text-red-700 px-4 py-3 rounded relative mb-4" role="alert">
                <span className="block sm:inline">{error}</span>
              </div>
            )}
            {isUnverified ? (
              <div className="bg-yellow-100 border border-yellow-400 text-yellow-700 px-4 py-3 rounded relative mb-4" role="alert">
                <p className="font-bold">Account not verified</p>
                <p>Please check your email for the verification link. If you can&apos;t find it, you can:</p>
                <ul className="list-disc list-inside mt-2">
                  <li>Check your spam folder</li>
                  <li>Search for an email from our domain</li>
                  <li>
                    <button
                      onClick={handleResendVerification}
                      className="text-blue-600 hover:underline focus:outline-none"
                      disabled={isLoading}
                    >
                      Resend verification email
                    </button>
                  </li>
                </ul>
              </div>
            ) : (
              renderForm()
            )}
            {loginState === "login" && (
              <p className="text-center text-gray-600 mt-6">
                Don&pos;t have an account?{" "}
                <Link to="/student/signup" className="text-blue-600 hover:underline font-semibold">
                  Sign up
                </Link>
              </p>
            )}
          </div>
        )}
      </div>
      <Footer />
    </div>
  );
}

export default Login;