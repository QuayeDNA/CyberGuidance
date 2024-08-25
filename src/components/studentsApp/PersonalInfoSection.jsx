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
        setPersonalInfo(response.data.user.personalInfo);

          // Extract first name and store in local storage
          const fullName = response.data.user.personalInfo.fullName;
          const firstName = fullName.split(' ')[0];
          localStorage.setItem('userFirstName', firstName);
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
          {Object.entries(personalInfo).map(([key, value], index) => (
            <p key={index} className="text-gray-700">
              <span className="font-bold">{key.replace(/([A-Z])/g, ' $1').replace(/^./, str => str.toUpperCase())}:</span> {value}
            </p>
          ))}
        </div>
      ) : (
        <p className="text-gray-700">No personal information available.</p>
      )}
    </section>
  );
}

export default PersonalInfoSection;