import { useState, useEffect } from 'react';
import axios from 'axios';
import { useNavigate } from 'react-router-dom';
import { FaSpinner, FaExclamationCircle, FaUser } from 'react-icons/fa';
import EmergencyBookingButton from '../../studentsApp/EmergencyBooking';

const CounselorsComponent = () => {
  const [counselors, setCounselors] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [emergencyBookingOpen, setEmergencyBookingOpen] = useState(false);
  const [selectedCounselor, setSelectedCounselor] = useState(null);
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
        setCounselors(response.data.counselors);
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

  const handleEmergencyBooking = (counselor) => {
    setSelectedCounselor(counselor);
    setEmergencyBookingOpen(true);
  };

  const closeEmergencyBooking = () => {
    setEmergencyBookingOpen(false);
    setSelectedCounselor(null);
  };

  if (loading) {
    return (
      <div className="flex justify-center items-center h-64">
        <FaSpinner className="animate-spin text-4xl text-blue-500" />
        <p className="ml-2">Loading recommended counselors...</p>
      </div>
    );
  }

  if (error) {
    return (
      <div className="text-center text-red-500">
        <FaExclamationCircle className="text-5xl mb-2" />
        <p>Error: {error}</p>
      </div>
    );
  }

  return (
    <div className="p-4">
      <h2 className="text-xl font-light mb-4 text-gray-800">Recommended Counselors</h2>
      <div className="overflow-x-auto pb-4">
        <div className="flex space-x-4">
          {counselors.map((counselor) => (
            <div key={counselor._id} className="flex-shrink-0 w-64 bg-white rounded-lg shadow-md overflow-hidden relative">
              <button
                onClick={() => handleEmergencyBooking(counselor)}
                className="absolute top-2 right-2 p-2 bg-red-500 text-white rounded-full hover:bg-red-600 transition-colors z-10"
                aria-label="Emergency Booking"
              >
                <FaExclamationCircle />
              </button>
              <div className="p-4">
                <div className="relative w-24 h-24 mx-auto mb-3">
                  {counselor.personalInfo?.profilePicture ? (
                    <img
                      src={counselor.personalInfo.profilePicture}
                      alt={counselor.personalInfo.fullName || counselor.username}
                      className="w-full h-full rounded-full object-cover"
                    />
                  ) : (
                    <div className="w-full h-full rounded-full bg-gray-200 flex items-center justify-center">
                      <FaUser className="text-gray-500 text-4xl" />
                    </div>
                  )}
                  <div className={`absolute bottom-0 right-0 w-4 h-4 rounded-full border-2 border-white ${counselor.isAvailable ? 'bg-green-500' : 'bg-red-500'}`}></div>
                </div>
                <h3 className="text-lg font-semibold text-center mb-1 truncate">
                  {counselor.personalInfo?.fullName || counselor.username}
                </h3>
                <p className="text-sm text-gray-600 text-center mb-3 h-12 overflow-hidden">
                  {counselor.specialties.join(", ")}
                </p>
                <div className="text-center">
                  <button
                    onClick={() => handleCounselorSelect(counselor._id)}
                    className="py-1 px-4 text-sm rounded-full bg-blue-500 text-white hover:bg-blue-600 transition-colors inline-flex items-center"
                  >
                    <FaUser className="mr-1" /> Book Appointment
                  </button>
                </div>
              </div>
            </div>
          ))}
        </div>
      </div>
      {selectedCounselor && (
        <EmergencyBookingButton
          counselorId={selectedCounselor._id}
          counselorName={selectedCounselor.personalInfo?.fullName || selectedCounselor.username}
          isOpen={emergencyBookingOpen}
          onClose={closeEmergencyBooking}
          onBookingInitiated={() => {/* Handle booking initiated */}}
        />
      )}
    </div>
  );
};

export default CounselorsComponent;