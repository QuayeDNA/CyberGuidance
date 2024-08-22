import { useState, useEffect } from 'react';
import axios from 'axios';
import { FaSpinner, FaExclamationTriangle } from 'react-icons/fa';

function PersonalInfoSection() {
  const [personalInfo, setPersonalInfo] = useState(null);
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
        setPersonalInfo(response.data.user);
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
    <section className="bg-white rounded-lg shadow-md p-6 mb-8">
      <h2 className="text-2xl font-bold mb-4">Personal Information</h2>
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
      ) : personalInfo ? (
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          <p className="text-gray-700">
            <span className="font-bold">Full Name:</span> {personalInfo.personalInfo.fullName}
          </p>
          <p className="text-gray-700">
            <span className="font-bold">Department:</span> {personalInfo.personalInfo.department}
          </p>
          <p className="text-gray-700">
            <span className="font-bold">Mobile Number:</span> {personalInfo.personalInfo.mobileNumber}
          </p>
          <p className="text-gray-700">
            <span className="font-bold">Bio:</span> {personalInfo.personalInfo.bio}
          </p>
        </div>
      ) : (
        <p className="text-gray-700">No personal information available.</p>
      )}
    </section>
  );
}

export default PersonalInfoSection;