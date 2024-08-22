import { useState } from 'react';
import { motion } from 'framer-motion';
import { FaEnvelope, FaLock, FaSpinner } from 'react-icons/fa';
import { useNavigate, Link } from 'react-router-dom';
import { useAuth } from '../../components/contexts/AuthContext';
import { loginUser } from '../../axiosServices/authServices'; // Import the loginUser function

const AdminLogin = () => {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [error, setError] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  const navigate = useNavigate();
  const { login } = useAuth();

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError('');
    setIsLoading(true);

    try {
      const response = await loginUser({ email, password });

      const { isAdmin, isCounselor, isStudent, isFirstLogin, token } = response;

      if (isAdmin) {
        login({ isAdmin, isCounselor, isStudent, isFirstLogin, token });
        navigate('/admin/overview');
      } else {
        setError('Not authorized as admin');
      }
    } catch (err) {
      console.error('Login error:', err);
      setError(err.message || 'Login failed. Please try again.');
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <motion.div
      initial={{ opacity: 0, y: -50 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.5 }}
      className="min-h-screen flex items-center justify-center bg-gradient-to-r from-blue-800 to-indigo-900"
    >
      <div className="bg-white p-8 rounded-lg shadow-xl w-96 max-w-md">
        <motion.h2 
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ delay: 0.2 }}
          className="text-3xl font-bold mb-6 text-center text-indigo-800"
        >
          Admin Login
        </motion.h2>
        <form onSubmit={handleSubmit} className="space-y-6">
          <div>
            <label htmlFor="email" className="block text-sm font-medium text-gray-700">
              Email
            </label>
            <div className="mt-1 relative rounded-md shadow-sm">
              <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                <FaEnvelope className="text-gray-400" />
              </div>
              <input
                type="email"
                id="email"
                className="focus:ring-indigo-500 focus:border-indigo-500 block w-full pl-10 pr-3 py-2 sm:text-sm border-gray-300 rounded-md"
                placeholder="Enter your email"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                required
              />
            </div>
          </div>
          <div>
            <label htmlFor="password" className="block text-sm font-medium text-gray-700">
              Password
            </label>
            <div className="mt-1 relative rounded-md shadow-sm">
              <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                <FaLock className="text-gray-400" />
              </div>
              <input
                type="password"
                id="password"
                className="focus:ring-indigo-500 focus:border-indigo-500 block w-full pl-10 pr-3 py-2 sm:text-sm border-gray-300 rounded-md"
                placeholder="Enter your password"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                required
              />
            </div>
          </div>
          {error && (
            <motion.p
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              className="text-red-500 text-sm text-center"
            >
              {error}
            </motion.p>
          )}
          <button
            type="submit"
            className="w-full flex justify-center py-2 px-4 border border-transparent rounded-md shadow-sm text-sm font-medium text-white bg-indigo-600 hover:bg-indigo-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-indigo-500 transition duration-150 ease-in-out"
            disabled={isLoading}
          >
            {isLoading ? (
              <FaSpinner className="animate-spin mr-2" />
            ) : null}
            {isLoading ? 'Signing In...' : 'Login'}
          </button>
        </form>
        <div className="mt-4 text-center">
          <Link to="/login" className="text-sm text-indigo-600 hover:text-indigo-500">
            Forgot your password? Navigate to the login page to request a password reset.
          </Link>
        </div>
        <div className="mt-4 text-center">
          <a href="/admin/signup" className="text-sm text-indigo-600 hover:text-indigo-500">
            Don&apos;t have an account? Sign up
          </a>
        </div>
      </div>
    </motion.div>
  );
};

export default AdminLogin;