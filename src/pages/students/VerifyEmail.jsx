import { useState, useEffect } from "react";
import { useNavigate, useLocation } from "react-router-dom";
import {
  FaSpinner,
  FaCheckCircle,
  FaExclamationTriangle,
} from "react-icons/fa";
import axios from "axios";

function VerifyEmail() {
  const [isVerifying, setIsVerifying] = useState(true);
  const [isVerified, setIsVerified] = useState(false);
  const [error, setError] = useState("");
  const navigate = useNavigate();
  const location = useLocation();

  useEffect(() => {
    const verifyEmail = async () => {
      const token = new URLSearchParams(location.search).get("token");

      if (token) {
        try {
          const response = await axios.get(
            `https://cyber-guidance.onrender.com/api/verify/${token}`
          );

          if (response.status === 200) {
            setIsVerified(true);
          }
        } catch (error) {
          setError(
            error.response?.data?.message ||
              "Verification failed. Please try again."
          );
        }
      } else {
        setError("No verification token found");
      }
      setIsVerifying(false);
    };

    verifyEmail();
  }, [location]);

  return (
    <div className="flex flex-col items-center justify-center min-h-screen bg-gray-100">
      <div className="bg-white p-8 rounded-lg shadow-md text-center max-w-md w-full">
        {isVerifying ? (
          <div className="flex flex-col items-center">
            <FaSpinner className="animate-spin text-blue-500 text-4xl mb-4" />
            <h2 className="text-2xl font-semibold mb-2">Verifying your email...</h2>
            <p className="text-gray-600">Please wait while we verify your email address.</p>
          </div>
        ) : isVerified ? (
          <div className="flex flex-col items-center">
            <FaCheckCircle className="text-green-500 text-4xl mb-4" />
            <h2 className="text-2xl font-semibold mb-2">Email Verified!</h2>
            <p className="text-gray-600">Your email has been successfully verified.</p>
            <p className="text-gray-600 mt-2">Please proceed to the appropriate login page.</p>
            <div className="grid grid-cols-1 gap-4 mt-4 w-full">
              <button
                onClick={() => navigate("/login")}
                className="bg-blue-500 text-white px-4 py-2 rounded-full hover:bg-blue-600 transition-colors w-full">
                Go to Student Login
              </button>
              <button
                onClick={() => navigate("/counselor/login")}
                className="bg-green-500 text-white px-4 py-2 rounded-full hover:bg-green-600 transition-colors w-full">
                Go to Counselor Login
              </button>
              <button
                onClick={() => navigate("/admin/login")}
                className="bg-red-500 text-white px-4 py-2 rounded-full hover:bg-red-600 transition-colors w-full">
                Go to Admin Login
              </button>
            </div>
          </div>
        ) : (
          <div className="flex flex-col items-center">
            <FaExclamationTriangle className="text-red-500 text-4xl mb-4" />
            <h2 className="text-2xl font-semibold mb-2 text-red-500">Verification Failed</h2>
            <p className="text-gray-600">{error}</p>
            <div className="grid grid-cols-1 gap-4 mt-4 w-full">
              <button
                onClick={() => navigate("/login")}
                className="bg-blue-500 text-white px-4 py-2 rounded hover:bg-blue-600 transition-colors w-full">
                Go to Student Login
              </button>
              <button
                onClick={() => navigate("/login")}
                className="bg-green-500 text-white px-4 py-2 rounded hover:bg-green-600 transition-colors w-full">
                Go to Counselor Login
              </button>
              <button
                onClick={() => navigate("/admin/login")}
                className="bg-red-500 text-white px-4 py-2 rounded hover:bg-red-600 transition-colors w-full">
                Go to Admin Login
              </button>
            </div>
          </div>
        )}
      </div>
    </div>
  );
}

export default VerifyEmail;