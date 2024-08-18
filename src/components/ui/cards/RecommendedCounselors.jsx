import { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import axios from 'axios';
import { Menu, MenuButton, MenuItems, MenuItem } from '@headlessui/react';
import { FaChevronDown, FaSpinner } from 'react-icons/fa';
import { useAuth } from '../../contexts/AuthContext';

const RecommendedCounselors = () => {
  const [counselors, setCounselors] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const navigate = useNavigate();
  const { userData } = useAuth();

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
          { email: userData.email },
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
      {counselors.length === 0 ? (
        <p>No recommended counselors found. Try updating your interests or check back later.</p>
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
          {counselors.map((counselor) => (
            <div key={counselor.username} className="bg-white shadow-md rounded-lg overflow-hidden hover:shadow-lg transition-shadow duration-300">
              <div className="p-4">
                <h3 className="font-semibold text-lg mb-2">{counselor.username}</h3>
                <p className="text-gray-600 mb-4">Specialties: {counselor.specialties.join(', ')}</p>
                <Menu as="div" className="relative inline-block text-left">
                  <div>
                    <MenuButton className="inline-flex justify-center w-full px-4 py-2 text-sm font-medium text-white bg-blue-500 rounded-md hover:bg-blue-600 focus:outline-none focus-visible:ring-2 focus-visible:ring-white focus-visible:ring-opacity-75">
                      Options
                      <FaChevronDown
                        className="w-5 h-5 ml-2 -mr-1 text-violet-200 hover:text-violet-100"
                        aria-hidden="true"
                      />
                    </MenuButton>
                  </div>
                  <MenuItems className="absolute right-0 w-56 mt-2 origin-top-right bg-white divide-y divide-gray-100 rounded-md shadow-lg ring-1 ring-black ring-opacity-5 focus:outline-none">
                    <div className="px-1 py-1">
                      <MenuItem>
                        {({ active }) => (
                          <button
                            className={`${
                              active ? 'bg-blue-500 text-white' : 'text-gray-900'
                            } group flex rounded-md items-center w-full px-2 py-2 text-sm`}
                            onClick={() => handleCounselorSelect(counselor.username)}
                          >
                            View Profile
                          </button>
                        )}
                      </MenuItem>
                      <MenuItem>
                        {({ active }) => (
                          <button
                            className={`${
                              active ? 'bg-blue-500 text-white' : 'text-gray-900'
                            } group flex rounded-md items-center w-full px-2 py-2 text-sm`}
                          >
                            Schedule Session
                          </button>
                        )}
                      </MenuItem>
                    </div>
                  </MenuItems>
                </Menu>
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  );
};

export default RecommendedCounselors;