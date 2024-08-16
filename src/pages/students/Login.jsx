import { useState, useEffect } from "react";
import { useForm, Controller } from "react-hook-form";
import { yupResolver } from "@hookform/resolvers/yup";
import * as yup from "yup";
import Footer from "../../components/Footer";
import bgImage from "../../assets/Counselling.jpg";
import { useNavigate, Link } from "react-router-dom";
import { FaSpinner } from "react-icons/fa";
import axios from "axios";
import { useAuth } from '../../components/contexts/AuthContext';

const loginSchema = yup.object().shape({
  email: yup.string().email("Invalid email format").required("Email is required"),
  password: yup.string().required("Password is required"),
});

const forgotPasswordSchema = yup.object().shape({
  email: yup.string().email("Invalid email format").required("Email is required"),
});

const otpSchema = yup.object().shape({
  otp: yup.string().required("OTP is required").length(6, "OTP must be 6 digits"),
});

const resetPasswordSchema = yup.object().shape({
  newPassword: yup.string().required("New password is required").min(8, "Password must be at least 8 characters"),
  confirmPassword: yup.string().oneOf([yup.ref('newPassword'), null], 'Passwords must match'),
});

function Login() {
  const navigate = useNavigate();
  const [isLoading, setIsLoading] = useState(false);
  const [showCard, setShowCard] = useState(false);
  const [error, setError] = useState("");
  const { setUserData } = useAuth();
  const [isUnverified, setIsUnverified] = useState(false);
  const [unverifiedEmail, setUnverifiedEmail] = useState("");
  const [loginState, setLoginState] = useState("login"); // "login", "forgotPassword", "otpVerification", "resetPassword"
  const [resetEmail, setResetEmail] = useState("");

  const loginForm = useForm({
    resolver: yupResolver(loginSchema),
  });

  const forgotPasswordForm = useForm({
    resolver: yupResolver(forgotPasswordSchema),
  });

  const otpForm = useForm({
    resolver: yupResolver(otpSchema),
  });

  const resetPasswordForm = useForm({
    resolver: yupResolver(resetPasswordSchema),
  });

  useEffect(() => {
    const timer = setTimeout(() => {
      setShowCard(true);
    }, 1000);

    return () => clearTimeout(timer);
  }, []);

  const isLoggedIn = () => {
    return localStorage.getItem("userToken") !== null;
  };

  const handleLogin = async (data) => {
    setIsLoading(true);
    setError("");
  
    try {
      console.log("Attempting login...");
      const response = await axios.post("https://cyber-guidance.onrender.com/api/login", {
        email: data.email,
        password: data.password,
      });
      
      setUserData(response.data);
      console.log("Login successful:", response.data);
      localStorage.setItem("userToken", response.data.token);
  
      if (response.data.isStudent) {
        if (response.data.isFirstLogin) {
          navigate("/student/setup");
        } else {
          navigate("/student/dashboard");
        }
      } else if (response.data.isCounselor) {
        navigate("/counselor/dashboard");
      } else if (response.data.isAdmin) {
        navigate("/admin/dashboard");
      } else {
        console.error("Unknown user type");
        setError("Unknown user type. Please contact support.");
      }
    } catch (error) {
      console.error("Login error:", error);
      if (error.response) {
        if (error.response.data.message === "Account not verified. Check your email for verification instructions") {
          setIsUnverified(true);
          setUnverifiedEmail(data.email);
        } else {
          setError(error.response.data.message || "An error occurred during login.");
        }
      } else if (error.request) {
        setError("No response received from the server. Please try again.");
      } else {
        setError("An error occurred. Please try again.");
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

  const userData = isLoggedIn();
  if (userData) {
    navigate('/' + (userData.isStudent ? 'student' : userData.isCounselor ? 'counselor' : 'admin') + '/dashboard');
  }


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
            ) : loginState === "login" ? (
              <form onSubmit={loginForm.handleSubmit(handleLogin)} className="space-y-6">
                <div>
                  <label htmlFor="email" className="block text-gray-700 font-semibold mb-2">
                    Email
                  </label>
                  <Controller
                    name="email"
                    control={loginForm.control}
                    render={({ field }) => (
                      <input
                        {...field}
                        type="email"
                        id="email"
                        className={`w-full px-4 py-2 border rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 ${
                          loginForm.formState.errors.email ? "border-red-500" : "border-gray-300"
                        }`}
                        placeholder="Enter your email"
                      />
                    )}
                  />
                  {loginForm.formState.errors.email && (
                    <p className="text-red-500 text-sm mt-1">{loginForm.formState.errors.email.message}</p>
                  )}
                </div>
                <div>
                  <label htmlFor="password" className="block text-gray-700 font-semibold mb-2">
                    Password
                  </label>
                  <Controller
                    name="password"
                    control={loginForm.control}
                    render={({ field }) => (
                      <input
                        {...field}
                        type="password"
                        id="password"
                        className={`w-full px-4 py-2 border rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 ${
                          loginForm.formState.errors.password ? "border-red-500" : "border-gray-300"
                        }`}
                        placeholder="Enter your password"
                      />
                    )}
                  />
                  {loginForm.formState.errors.password && (
                    <p className="text-red-500 text-sm mt-1">{loginForm.formState.errors.password.message}</p>
                  )}
                </div>
                <button
                  type="submit"
                  className="w-full bg-blue-600 text-white font-bold py-3 rounded-lg hover:bg-blue-700 transition duration-300 flex items-center justify-center"
                  disabled={isLoading}
                >
                  {isLoading ? (
                    <>
                      <FaSpinner className="animate-spin mr-2" />
                      Logging in...
                    </>
                  ) : (
                    "Log In"
                  )}
                </button>
                <p className="text-center text-gray-600 mt-4">
                  <button
                    onClick={() => setLoginState("forgotPassword")}
                    className="text-blue-600 hover:underline focus:outline-none"
                  >
                    Forgot Password?
                  </button>
                </p>
              </form>
            ) : loginState === "forgotPassword" ? (
              <form onSubmit={forgotPasswordForm.handleSubmit(handleForgotPassword)} className="space-y-6">
                <div>
                  <label htmlFor="forgotPasswordEmail" className="block text-gray-700 font-semibold mb-2">
                    Email
                  </label>
                  <Controller
                    name="email"
                    control={forgotPasswordForm.control}
                    render={({ field }) => (
                      <input
                        {...field}
                        type="email"
                        id="forgotPasswordEmail"
                        className={`w-full px-4 py-2 border rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 ${
                          forgotPasswordForm.formState.errors.email ? "border-red-500" : "border-gray-300"
                        }`}
                        placeholder="Enter your email"
                      />
                    )}
                  />
                  {forgotPasswordForm.formState.errors.email && (
                    <p className="text-red-500 text-sm mt-1">{forgotPasswordForm.formState.errors.email.message}</p>
                  )}
                </div>
                <button
                  type="submit"
                  className="w-full bg-blue-600 text-white font-bold py-3 rounded-lg hover:bg-blue-700 transition duration-300 flex items-center justify-center"
                  disabled={isLoading}
                >
                  {isLoading ? (
                    <>
                      <FaSpinner className="animate-spin mr-2" />
                      Sending...
                    </>
                  ) : (
                    "Send Reset Instructions"
                  )}
                </button>
                <p className="text-center text-gray-600 mt-4">
                  <button
                    onClick={() => setLoginState("login")}
                    className="text-blue-600 hover:underline focus:outline-none"
                  >
                    Back to Login
                  </button>
                </p>
              </form>
            ) : loginState === "otpVerification" ? (
              <form onSubmit={otpForm.handleSubmit(handleOtpVerification)} className="space-y-6">
                <div>
                  <label htmlFor="otp" className="block text-gray-700 font-semibold mb-2">
                    Enter OTP
                  </label>
                  <Controller
                    name="otp"
                    control={otpForm.control}
                    render={({ field }) => (
                      <input
                        {...field}
                        type="text"
                        id="otp"
                        className={`w-full px-4 py-2 border rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 ${
                          otpForm.formState.errors.otp ? "border-red-500" : "border-gray-300"
                        }`}
                        placeholder="Enter 6-digit OTP"
                      />
                    )}
                  />
                  {otpForm.formState.errors.otp && (
                    <p className="text-red-500 text-sm mt-1">{otpForm.formState.errors.otp.message}</p>
                  )}
                </div>
                <button
                  type="submit"
                  className="w-full bg-blue-600 text-white font-bold py-3 rounded-lg hover:bg-blue-700 transition duration-300 flex items-center justify-center"
                  disabled={isLoading}
                >
                  {isLoading ? (
                    <>
                      <FaSpinner className="animate-spin mr-2" />
                      Verifying...
                    </>
                  ) : (
                    "Verify OTP"
                  )}
                </button>
              </form>
            ) : loginState === "resetPassword" ? (
              <form onSubmit={resetPasswordForm.handleSubmit(handleResetPassword)} className="space-y-6">
                <div>
                  <label htmlFor="newPassword" className="block text-gray-700 font-semibold mb-2">
                    New Password
                  </label>
                  <Controller
                    name="newPassword"
                    control={resetPasswordForm.control}
                    render={({ field }) => (
                      <input
                        {...field}
                        type="password"
                        id="newPassword"
                        className={`w-full px-4 py-2 border rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 ${
                          resetPasswordForm.formState.errors.newPassword ? "border-red-500" : "border-gray-300"
                        }`}
                        placeholder="Enter new password"
                      />
                    )}
                  />
                  {resetPasswordForm.formState.errors.newPassword && (
                    <p className="text-red-500 text-sm mt-1">{resetPasswordForm.formState.errors.newPassword.message}</p>
                  )}
                </div>
                <div>
                  <label htmlFor="confirmPassword" className="block text-gray-700 font-semibold mb-2">
                    Confirm New Password
                  </label>
                  <Controller
                    name="confirmPassword"
                    control={resetPasswordForm.control}
                    render={({ field }) => (
                      <input
                        {...field}
                        type="password"
                        id="confirmPassword"
                        className={`w-full px-4 py-2 border rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 ${
                          resetPasswordForm.formState.errors.confirmPassword ? "border-red-500" : "border-gray-300"
                        }`}
                        placeholder="Confirm new password"
                      />
                    )}
                  />
                  {resetPasswordForm.formState.errors.confirmPassword && (
                    <p className="text-red-500 text-sm mt-1">{resetPasswordForm.formState.errors.confirmPassword.message}</p>
                  )}
                </div>
                <button
                  type="submit"
                  className="w-full bg-blue-600 text-white font-bold py-3 rounded-lg hover:bg-blue-700 transition duration-300 flex items-center justify-center"
                  disabled={isLoading}
                >
                  {isLoading ? (
                    <>
                      <FaSpinner className="animate-spin mr-2" />
                      Resetting...
                    </>
                  ) : (
                    "Reset Password"
                  )}
                </button>
              </form>
            ) : null}
            {loginState === "login" && (
              <p className="text-center text-gray-600 mt-6">
                Don&apos;t have an account?{" "}
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