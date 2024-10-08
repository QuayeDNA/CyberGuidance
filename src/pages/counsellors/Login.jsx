import { useState, useEffect } from "react";
import { useForm, Controller } from "react-hook-form";
import { yupResolver } from "@hookform/resolvers/yup";
import * as yup from "yup";
import Footer from "../../components/Footer";
import bgImage from "../../assets/Counselling.jpg";
import { useNavigate } from "react-router-dom";
import { FaSpinner } from "react-icons/fa";
import axios from "axios";

// Define the validation schema
const schema = yup.object().shape({
  email: yup.string().email("Invalid email format").required("Email is required"),
  password: yup.string().required("Password is required"),
});

function Login() {
  const navigate = useNavigate();
  const [isLoading, setIsLoading] = useState(false);
  const [showCard, setShowCard] = useState(false);
  const [apiError, setApiError] = useState(null);
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
    setApiError(null);

    try {
      const response = await axios.post("https://cyber-guidance.onrender.com/login", {
        email: data.email,
        password: data.password,
      });

      if (response.data.isCounselor) {
        localStorage.setItem("userToken", response.data.token);
        navigate("/counselor/dashboard");
      } else {
        setApiError("This account is not authorized as a counselor.");
      }
    } catch (error) {
      console.error("Login Error:", error);
      if (error.response) {
        setApiError(error.response.data.message || "An error occurred during login.");
      } else if (error.request) {
        setApiError("No response received from the server. Please try again later.");
      } else {
        setApiError("An error occurred during login. Please try again.");
      }
    } finally {
      setIsLoading(false);
    }
  };

  useEffect(() => {
    if (isLoggedIn()) {
      navigate("/counselor/dashboard");
    }
  }, [navigate]);

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
              Welcome Counselor
            </h2>
            <p className="text-center text-gray-600 mb-6">
              Please log in to access your dashboard.
            </p>
            {apiError && (
              <div className="mb-4 p-3 bg-red-100 border border-red-400 text-red-700 rounded">
                {apiError}
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
              Forgot your credentials? Please contact the admin.
            </p>
          </div>
        )}
      </div>
      <Footer />
    </div>
  );
}

export default Login;