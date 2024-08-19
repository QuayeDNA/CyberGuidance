import { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import axios from 'axios';
import { FaSpinner } from 'react-icons/fa';
import { useAuth } from '../../contexts/AuthContext';

const RecommendedCounselors = () => {
  const [counselors, setCounselors] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [isOnline, setIsOnline] = useState(navigator.onLine);
  const navigate = useNavigate();
  const { userData } = useAuth();

  useEffect(() => {
    const handleOnline = () => setIsOnline(true);
    const handleOffline = () => setIsOnline(false);

    window.addEventListener('online', handleOnline);
    window.addEventListener('offline', handleOffline);

    return () => {
      window.removeEventListener('online', handleOnline);
      window.removeEventListener('offline', handleOffline);
    };
  }, []);

  useEffect(() => {
    const fetchRecommendedCounselors = async () => {
      if (!userData) {
        setError('User not authenticated');
        setLoading(false);
        return;
      }

      try {
        setLoading(true);
        const response = await axios.get(
          'https://cyber-guidance.onrender.com/api/recommend-counselors',
          {
            headers: {
              Authorization: `Bearer ${userData.token}`,
            },
          }
        );
        setCounselors(response.data.counselors);
        setLoading(false);
      } catch (error) {
        setError('Failed to fetch recommended counselors. Please try again later.');
        setLoading(false);
      }
    };

    fetchRecommendedCounselors();
  }, [userData]);

  const handleCounselorSelect = (username) => {
    navigate(`/student/counselor/${username}`);
  };

  if (loading) {
    return (
      <div className="flex justify-center items-center h-64">
        <FaSpinner className="animate-spin h-8 w-8 text-blue-500" />
        <p className="ml-2">Loading recommended counselors...</p>
      </div>
    );
  }

  if (error) {
    return (
      <div className="text-center text-red-500 p-4">
        <p>{error}</p>
        <button 
          onClick={() => window.location.reload()} 
          className="mt-4 bg-blue-500 hover:bg-blue-700 text-white font-bold py-2 px-4 rounded"
        >
          Retry
        </button>
      </div>
    );
  }

  return (
    <div className="p-4">
      <h2 className="text-2xl font-bold mb-4">Recommended Counselors</h2>
      {!isOnline && (
        <div className="text-center text-red-500 mb-4">
          <p>You are currently offline. Some features may not be available.</p>
        </div>
      )}
      {counselors.length === 0 ? (
        <p>No recommended counselors found. Try updating your interests or check back later.</p>
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
          {counselors.map((counselor) => (
            <div
              key={counselor.username}
              className="bg-white shadow-md rounded-lg overflow-hidden hover:shadow-lg transition-shadow duration-300 cursor-pointer"
              onClick={() => handleCounselorSelect(counselor.username)}
            >
              <div className="p-4">
                <img
                  src={counselor.profilePicture || 'https://ui-avatars.com/api/?name=' + counselor.username}
                  alt={`${counselor.username}'s profile`}
                  className="w-16 h-16 rounded-full mb-4"
                />
                <h3 className="font-semibold text-lg mb-2">{counselor.username}</h3>
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  );
};

export default RecommendedCounselors;