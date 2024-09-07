import { useState, useEffect, useCallback, memo } from "react";
import { useNavigate, Link, Navigate } from "react-router-dom";
import { useAuth } from "../components/contexts/AuthContext";
import Footer from "../components/Footer";
import LoginForm from "./LoginForm";
import { FaSpinner } from "react-icons/fa";
import ForgotPasswordForm from "./ForgotPasswordForm";
import ResetPasswordForm from "./ResetPasswordForm";
import { loginUser } from "../axiosServices/authServices";
import {
  resendVerificationEmail,
  requestPasswordReset,
  resetPassword,
} from "../axiosServices/userAccountServices";
import bgImage from "../assets/Counselling-2.jpg";

const Login = memo(function LoginComponent() {
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
    const observer = new IntersectionObserver(
      (entries) => {
        entries.forEach((entry) => {
          if (entry.isIntersecting) {
            setShowCard(true);
            observer.disconnect();
          }
        });
      },
      { threshold: 0.5 }
    );

    const loginContainer = document.querySelector(".login-container");
    if (loginContainer) {
      observer.observe(loginContainer);
    }

    return () => observer.disconnect();
  }, []);

  const handleLogin = useCallback(
    async (data) => {
      setIsLoading(true);
      setError("");

      try {
        const response = await loginUser({
          email: data.email,
          password: data.password,
        });

        login({
          token: response.token,
          isStudent: response.isStudent,
          isCounselor: response.isCounselor,
          isAdmin: response.isAdmin,
          isFirstLogin: response.isFirstLogin,
        });
        localStorage.setItem("userToken", response.token);

        if (response.isStudent) {
          if (response.isFirstLogin) {
            navigate("/student/first-login");
          } else {
            navigate("/student/dashboard");
          }
        } else if (response.isCounselor) {
          if (response.isFirstLogin) {
            navigate("/counselor/first-login");
          } else {
            navigate("/counselor/dashboard");
          }
        }
      } catch (error) {
        if (
          error.message ===
          "Account not verified. Check your email for verification instructions"
        ) {
          setIsUnverified(true);
          setUnverifiedEmail(data.email);
        } else {
          setError(error.message || "Login failed. Please try again.");
        }
      } finally {
        setIsLoading(false);
      }
    },
    [login, navigate]
  );

  const handleResendVerification = useCallback(async () => {
    setIsLoading(true);
    try {
      await resendVerificationEmail(unverifiedEmail);
      setError("Verification email resent. Please check your inbox.");
    } catch (error) {
      setError(
        error.message || "Failed to resend verification email. Please try again."
      );
    } finally {
      setIsLoading(false);
    }
  }, [unverifiedEmail]);

  const handleForgotPassword = useCallback(
    async (data) => {
      setIsLoading(true);
      setError("");

      try {
        await requestPasswordReset(data.email);
        setResetEmail(data.email);
        setLoginState("resetPassword");
      } catch (error) {
        setError(
          error.message || "Failed to request password reset. Please try again."
        );
      } finally {
        setIsLoading(false);
      }
    },
    []
  );

  const handleResetPassword = useCallback(
    async (data) => {
      setIsLoading(true);
      setError("");

      try {
        await resetPassword(resetEmail, data.otp, data.newPassword);
        setError(
          "Password reset successfully. You can now log in with your new password."
        );
        setLoginState("login");
      } catch (error) {
        setError(error.message || "Failed to reset password. Please try again.");
      } finally {
        setIsLoading(false);
      }
    },
    [resetEmail]
  );

  const renderForm = useCallback(() => {
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
  }, [
    loginState,
    handleLogin,
    handleForgotPassword,
    handleResetPassword,
    isLoading,
  ]);

  if (userData) {
    const redirectPath = userData.isStudent
      ? "/student/dashboard"
      : userData.isCounselor
      ? "/counselor/dashboard"
      : userData.isAdmin
      ? "/admin/dashboard"
      : "/";
    return <Navigate to={redirectPath} replace />;
  }

  return (
    <div className="flex flex-col min-h-screen">
      <div className="relative flex-grow flex items-center justify-center">
        <div className="absolute inset-0">
          <img
            src={bgImage}
            alt="Background"
            className="w-full h-full object-cover"
          />
          <div className="absolute inset-0 bg-black opacity-50"></div>
        </div>
        <div className="relative z-10 login-container">
          {!showCard ? (
            <div className="relative z-10">
              <FaSpinner className="animate-spin text-white text-4xl" />
            </div>
          ) : (
            <div className="bg-white p-8 rounded-lg shadow-lg w-full max-w-md">
              <h2 className="text-3xl font-bold text-center mb-6 text-blue-600">
                {loginState === "login" ? "Welcome Back" : "Reset Password"}
              </h2>
              <p className="text-center text-gray-600 mb-6">
                {loginState === "login"
                  ? "We're here to support you. Please log in to continue."
                  : "Follow the steps to reset your password."}
              </p>
              {error && (
                <div
                  className="bg-red-100 border border-red-400 text-red-700 px-4 py-3 rounded relative mb-4"
                  role="alert"
                >
                  <span className="block sm:inline">{error}</span>
                </div>
              )}
              {isUnverified ? (
                <div
                  className="bg-yellow-100 border border-yellow-400 text-yellow-700 px-4 py-3 rounded relative mb-4"
                  role="alert"
                >
                  <p className="font-bold">Account not verified</p>
                  <p>
                    Please check your email for the verification link. If you
                    can&apos;t find it, you can:
                  </p>
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
                  <Link
                    to="/student/signup"
                    className="text-blue-600 hover:underline font-semibold"
                  >
                    Sign up
                  </Link>
                </p>
              )}
            </div>
          )}
        </div>
      </div>
      <Footer />
    </div>
  );
});

export default Login;