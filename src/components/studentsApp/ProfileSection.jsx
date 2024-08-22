import { useState, useEffect } from 'react';
import axios from 'axios';
import { FaSpinner, FaExclamationTriangle } from 'react-icons/fa';

function ProfileSection() {
  const [profileData, setProfileData] = useState(null);
  const [error, setError] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchProfileData = async () => {
      try {
        const response = await axios.get('https://cyber-guidance.onrender.com/api/user-info/', {
          headers: {
            Authorization: `Bearer ${localStorage.getItem('token')}`,
          },
        });
        setProfileData(response.data.user);
      } catch (err) {
        if (err.response) {
          setError(err.response.data.message);
        } else if (err.request) {
          setError('No response received from server');
        } else {
          setError('An error occurred');
        }
      } finally {
        setLoading(false);
      }
    };

    fetchProfileData();
  }, []);

  return (
    <section className="rounded-lg shadow-md p-6 mb-8 bg-white">
      <h1 className="text-2xl font-bold mb-4">User Profile</h1>
      {loading ? (
        <div className="flex items-center justify-center h-32">
          <FaSpinner className="animate-spin text-blue-500 text-3xl" />
        </div>
      ) : error ? (
        <div className="bg-red-100 border-l-4 border-red-500 text-red-700 p-4 mb-4">
          <div className="flex items-center">
            <FaExclamationTriangle className="text-red-500 mr-2" />
            <p className="font-bold">Error</p>
          </div>
          <p className="mt-2">{error}</p>
        </div>
      ) : profileData ? (
        <div className="flex flex-col md:flex-row items-start md:items-center space-y-4 md:space-y-0 md:space-x-8">
          <div className="flex-shrink-0 w-32 h-32 rounded-full overflow-hidden shadow-lg">
            <img
              src={`https://picsum.photos/200?random=${profileData._id}`}
              alt="Profile"
              className="w-full h-full object-cover"
            />
          </div>
          <div className="flex flex-col">
            <h2 className="text-xl font-bold">{profileData.personalInfo.fullName || 'N/A'}</h2>
            <p className="text-gray-700">{profileData.email || 'N/A'}</p>
            <p className="text-gray-700">{profileData.username || 'N/A'}</p>
          </div>
        </div>
      ) : (
        <p className="text-gray-700">No profile data available.</p>
      )}
    </section>
  );
}

export default ProfileSection;