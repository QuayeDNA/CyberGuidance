import { useState, useEffect } from "react";
import { useForm, Controller } from "react-hook-form";
import { yupResolver } from "@hookform/resolvers/yup";
import * as yup from "yup";
import Footer from "../../components/Footer";
import bgImage from "../../assets/Counselling.jpg";
import { useNavigate, Link } from "react-router-dom";
import { FaSpinner } from "react-icons/fa";
import axios from "axios"; // Make sure to install axios: npm install axios

// Define the validation schema
const schema = yup.object().shape({
  email: yup.string().email("Invalid email format").required("Email is required"),
  password: yup.string().required("Password is required"),
});

function Login() {
  const navigate = useNavigate();
  const [isLoading, setIsLoading] = useState(false);
  const [showCard, setShowCard] = useState(false);
  const [error, setError] = useState("");
  const {
    control,
    handleSubmit,
    formState: { errors },
  } = useForm({
    resolver: yupResolver(schema),
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
      const response = await axios.post("https://cyber-guidance.onrender.com/login", {
        email: data.email,
        password: data.password,
      });

      localStorage.setItem("userToken", response.data.token);
      
      if (response.data.isStudent) {
        const userInfoResponse = await axios.post("https://cyber-guidance.onrender.com/user-info", {
          email: data.email,
        });

        const isFirstLogin = !userInfoResponse.data.user.personalInfo;
        
        if (isFirstLogin) {
          navigate("/student/setup");
        } else {
          navigate("/student/dashboard");
        }
      } else if (response.data.isCounselor) {
        navigate("/counselor/dashboard");
      } else if (response.data.isAdmin) {
        navigate("/admin/dashboard");
      }
    } catch (error) {
      if (error.response) {
        // The request was made and the server responded with a status code
        // that falls out of the range of 2xx
        setError(error.response.data.message || "An error occurred during login.");
      } else if (error.request) {
        // The request was made but no response was received
        setError("No response received from the server. Please try again.");
      } else {
        // Something happened in setting up the request that triggered an Error
        setError("An error occurred. Please try again.");
      }
    } finally {
      setIsLoading(false);
    }
  };

  // Redirect user if already logged in
  if (isLoggedIn()) {
    navigate("/student/dashboard");
    return null;
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
              Welcome Back
            </h2>
            <p className="text-center text-gray-600 mb-6">
              We&apos;re here to support you. Please log in to continue.
            </p>
            {error && (
              <div className="bg-red-100 border border-red-400 text-red-700 px-4 py-3 rounded relative mb-4" role="alert">
                <span className="block sm:inline">{error}</span>
              </div>
            )}
            <form onSubmit={handleSubmit(handleLogin)} className="space-y-6">
              <div>
                <label htmlFor="email" className="block text-gray-700 font-semibold mb-2">
                  Email
                </label>
                <Controller
                  name="email"
                  control={control}
                  render={({ field }) => (
                    <input
                      {...field}
                      type="email"
                      id="email"
                      className={`w-full px-4 py-2 border rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 ${
                        errors.email ? "border-red-500" : "border-gray-300"
                      }`}
                      placeholder="Enter your email"
                    />
                  )}
                />
                {errors.email && (
                  <p className="text-red-500 text-sm mt-1">{errors.email.message}</p>
                )}
              </div>
              <div>
                <label htmlFor="password" className="block text-gray-700 font-semibold mb-2">
                  Password
                </label>
                <Controller
                  name="password"
                  control={control}
                  render={({ field }) => (
                    <input
                      {...field}
                      type="password"
                      id="password"
                      className={`w-full px-4 py-2 border rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 ${
                        errors.password ? "border-red-500" : "border-gray-300"
                      }`}
                      placeholder="Enter your password"
                    />
                  )}
                />
                {errors.password && (
                  <p className="text-red-500 text-sm mt-1">{errors.password.message}</p>
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
            </form>
            <p className="text-center text-gray-600 mt-6">
              Don&apos;t have an account?{" "}
              <Link to="/student/signup" className="text-blue-600 hover:underline font-semibold">
                Sign up
              </Link>
            </p>
          </div>
        )}
      </div>
      <Footer />
    </div>
  );
}

export default Login;