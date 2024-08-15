import { useState, useEffect } from 'react';
import { useNavigate, useLocation } from 'react-router-dom';
import { FaSpinner, FaCheckCircle, FaExclamationTriangle } from 'react-icons/fa';
import axios from 'axios';

function VerifyEmail() {
  const [isVerifying, setIsVerifying] = useState(true);
  const [isVerified, setIsVerified] = useState(false);
  const [error, setError] = useState('');
  const navigate = useNavigate();
  const location = useLocation();

  useEffect(() => {
    const verifyEmail = async () => {
      const token = new URLSearchParams(location.search).get('token');

      if (token) {
        try {
          const response = await axios.get(`https://cyber-guidance.onrender.com/api/verify/${token}`);
          
          if (response.status === 200) {
            setIsVerified(true);
            setTimeout(() => {
              navigate('/student/login');
            }, 3000);
          }
        } catch (error) {
          setError(error.response?.data?.message || 'Verification failed. Please try again.');
        }
      } else {
        setError('No verification token found');
      }
      setIsVerifying(false);
    };

    verifyEmail();
  }, [location, navigate]);

  return (
    <div className="flex flex-col items-center justify-center min-h-screen bg-gray-100">
      <div className="bg-white p-8 rounded-lg shadow-md text-center">
        {isVerifying ? (
          <>
            <FaSpinner className="animate-spin text-blue-500 text-4xl mx-auto mb-4" />
            <h2 className="text-2xl font-semibold mb-2">Verifying your email...</h2>
            <p className="text-gray-600">Please wait while we verify your email address.</p>
          </>
        ) : isVerified ? (
          <>
            <FaCheckCircle className="text-green-500 text-4xl mx-auto mb-4" />
            <h2 className="text-2xl font-semibold mb-2">Email Verified!</h2>
            <p className="text-gray-600">Your email has been successfully verified.</p>
            <p className="text-gray-600 mt-2">Redirecting you to the login page...</p>
          </>
        ) : (
          <>
            <FaExclamationTriangle className="text-red-500 text-4xl mx-auto mb-4" />
            <h2 className="text-2xl font-semibold mb-2 text-red-500">Verification Failed</h2>
            <p className="text-gray-600">{error}</p>
            <button 
              onClick={() => navigate('/student/login')} 
              className="mt-4 bg-blue-500 text-white px-4 py-2 rounded hover:bg-blue-600 transition-colors"
            >
              Go to Student Login
            </button>
            <button 
              onClick={() => navigate('/counselor/login')} 
              className="mt-4 bg-green-500 text-white px-4 py-2 rounded hover:bg-green-600 transition-colors"
            >
              Go to Counselor Login
            </button>
            <button 
              onClick={() => navigate('/admin/login')} 
              className="mt-4 bg-red-500 text-white px-4 py-2 rounded hover:bg-red-600 transition-colors"
            >
              Go to Admin Login
            </button>
          </>
        )}
      </div>
    </div>
  );
}

export default VerifyEmail;