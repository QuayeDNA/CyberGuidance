import { useState, useEffect } from 'react';
import axios from 'axios';
import { FaSpinner, FaExclamationTriangle, FaUser, FaEnvelope, FaPhone, FaBuilding, FaInfoCircle, FaTag } from 'react-icons/fa';
import PropTypes from 'prop-types';

function CounselorInfoSection() {
  const [counselorInfo, setCounselorInfo] = useState(null);
  const [error, setError] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchCounselorData = async () => {
      try {
        const response = await axios.get('https://cyber-guidance.onrender.com/api/user-info', {
          headers: {
            Authorization: `Bearer ${localStorage.getItem('token')}`,
          },
        });
        setCounselorInfo(response.data.user);
      } catch (err) {
        setError(err.response?.data.message || 'An error occurred while fetching data');
      } finally {
        setLoading(false);
      }
    };

    fetchCounselorData();
  }, []);

  const InfoItem = ({ icon, label, value }) => (
    <div className="flex items-start mb-4">
      <div className="text-blue-500 mr-3 mt-1">
        {icon}
      </div>
      <div>
        <p className="font-semibold text-gray-700">{label}</p>
        <p className="text-gray-600">{value || 'Not provided'}</p>
      </div>
    </div>
  );

  InfoItem.propTypes = {
    icon: PropTypes.element.isRequired,
    label: PropTypes.string.isRequired,
    value: PropTypes.string,
  };
  

  return (
    <section className="bg-white rounded-lg shadow-md p-6 mb-8">
      <h2 className="text-2xl font-bold mb-6 text-blue-600">Counselor Information</h2>
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
      ) : counselorInfo ? (
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          <div>
            <InfoItem 
              icon={<FaUser />} 
              label="Full Name" 
              value={counselorInfo.personalInfo.fullName} 
            />
            <InfoItem 
              icon={<FaEnvelope />} 
              label="Email" 
              value={counselorInfo.email} 
            />
            <InfoItem 
              icon={<FaPhone />} 
              label="Mobile Number" 
              value={counselorInfo.personalInfo.mobileNumber} 
            />
            <InfoItem 
              icon={<FaBuilding />} 
              label="Department" 
              value={counselorInfo.personalInfo.department} 
            />
          </div>
          <div>
            <InfoItem 
              icon={<FaUser />} 
              label="Username" 
              value={counselorInfo.username} 
            />
            <div className="mb-4">
              <div className="flex items-center mb-2">
                <FaTag className="text-blue-500 mr-2" />
                <p className="font-semibold text-gray-700">Specialties</p>
              </div>
              <ul className="list-disc list-inside text-gray-600 pl-5">
                {counselorInfo.specialties.map((specialty, index) => (
                  <li key={index}>{specialty}</li>
                ))}
              </ul>
            </div>
          </div>
          <div className="md:col-span-2">
            <InfoItem 
              icon={<FaInfoCircle />} 
              label="Bio" 
              value={counselorInfo.personalInfo.bio} 
            />
          </div>
        </div>
      ) : (
        <p className="text-gray-700">No counselor information available.</p>
      )}
    </section>
  );
}

export default CounselorInfoSection;