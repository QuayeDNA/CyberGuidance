import { useState, useEffect } from 'react';
import { useNavigate, useLocation } from 'react-router-dom';
import { FaSpinner, FaCheckCircle } from 'react-icons/fa';

function VerifyEmail() {
  const [isVerifying, setIsVerifying] = useState(true);
  const [isVerified, setIsVerified] = useState(false);
  const navigate = useNavigate();
  const location = useLocation();

  useEffect(() => {
    const verifyEmail = async () => {
      // Get the token from the URL
      const params = new URLSearchParams(location.search);
      const token = params.get('token');

      if (token) {
        try {
          // Simulate API call to verify the token
          await new Promise(resolve => setTimeout(resolve, 2000));
          
          // If verification is successful
          setIsVerified(true);
          
          // Redirect to login page after 3 seconds
          setTimeout(() => {
            navigate('/student/login');
          }, 3000);
        } catch (error) {
          // Handle verification error
          console.error('Verification failed:', error);
        }
      } else {
        // Handle case where token is not present
        console.error('No verification token found');
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
            <h2 className="text-2xl font-semibold mb-2 text-red-500">Verification Failed</h2>
            <p className="text-gray-600">We couldn&apos;t verify your email. Please try again or contact support.</p>
          </>
        )}
      </div>
    </div>
  );
}

export default VerifyEmail;