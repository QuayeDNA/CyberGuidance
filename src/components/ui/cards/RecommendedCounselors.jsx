import { useState, useEffect } from 'react';
import axios from 'axios';
import { useNavigate } from 'react-router-dom';
import { FaSpinner, FaExclamationCircle } from 'react-icons/fa';

const CounselorsComponent = () => {
  const [counselors, setCounselors] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const navigate = useNavigate();

  useEffect(() => {
    const fetchCounselors = async () => {
      try {
        setLoading(true);
        const response = await axios.get('https://cyber-guidance.onrender.com/api/recommend-counselors', {
          headers: {
            Authorization: `Bearer ${localStorage.getItem('token')}`,
          },
        });
        const counselorsWithImageSource = response.data.counselors.map(counselor => ({
          ...counselor,
          imageSource: Math.random() > 0.5 ? 'ui-avatars' : 'picsum'
        }));
        setCounselors(counselorsWithImageSource);
        setLoading(false);
      } catch (error) {
        console.error('Error fetching recommended counselors:', error);
        setError(error.message);
        setLoading(false);
      }
    };

    fetchCounselors();
  }, []);

  const handleCounselorSelect = (counselorId) => {
    navigate(`/student/counselor/${counselorId}`);
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
      <div className="flex justify-center items-center h-64">
        <FaExclamationCircle className="h-8 w-8 text-red-500 mr-2" />
        <p className="text-red-500">Error: {error}</p>
      </div>
    );
  }

  return (
    <div className="p-4 overflow-x-auto flex space-x-4">
      {counselors.map((counselor) => (
        <div
          key={counselor._id}
          className="bg-white shadow-md rounded-lg overflow-hidden hover:shadow-lg transition-shadow duration-300 cursor-pointer p-4"
          onClick={() => handleCounselorSelect(counselor._id)}
        >
          <div className="w-24 h-24 rounded-full overflow-hidden mx-auto mt-4">
            <img
              src={
                counselor.imageSource === 'ui-avatars'
                  ? `https://ui-avatars.com/api/?name=${counselor.username}&background=random&color=fff`
                  : `https://picsum.photos/200?random=${counselor._id}`
              }
              alt={`${counselor.username}'s profile`}
              className="w-full h-full object-cover"
            />
          </div>
          <div className="p-4 text-center">
            <h3 className="font-semibold text-lg">
              {counselor.personalInfo?.fullName || counselor.username}
            </h3>
            <p className="text-gray-500 text-sm">
              {counselor.specialties.join(", ")}
            </p>
          </div>
        </div>
      ))}
    </div>
  );
};

export default CounselorsComponent;