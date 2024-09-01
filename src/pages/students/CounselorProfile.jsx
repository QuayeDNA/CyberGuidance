import { useState, useEffect, useCallback } from 'react';
import { useParams } from "react-router-dom";
import { FaUserCircle, FaEnvelope, FaCalendarAlt, FaPhoneAlt, FaSpinner, FaExclamationCircle } from "react-icons/fa";
import { motion } from "framer-motion";
import { toast } from "react-toastify";
import { useAuth } from '../../components/contexts/AuthContext';
import { fetchUserById } from "../../axiosServices/userDataServices";
import PropTypes from 'prop-types';
import BookingModal from "./BookingModal";
import EmergencyBookingButton from '../../components/studentsApp/EmergencyBooking';

const CounselorProfile = () => {
  const { id } = useParams();
  const [counselor, setCounselor] = useState(null);
  const [loading, setLoading] = useState(true);
  const [isBookAppointmentModalOpen, setIsBookAppointmentModalOpen] = useState(false);
  const [isEmergencyBookingOpen, setIsEmergencyBookingOpen] = useState(false);
  const { userData } = useAuth();

  useEffect(() => {
    fetchCounselorDetails();
  }, [id, userData?.id]);

  
  const fetchCounselorDetails = async () => {
    try {
      const counselorData = await fetchUserById(id);
      console.log('Counselor data:', counselorData);
      setCounselor(counselorData);
      setLoading(false);
    } catch (error) {
      console.error("Error fetching counselor details:", error);
      toast.error("Failed to fetch counselor details. Please try again.");
      setLoading(false);
    }
  };

  const handleBookAppointment = useCallback(() => {
    setIsBookAppointmentModalOpen(true);
  }, []);

  const handleEmergencyBooking = useCallback(() => {
    setIsEmergencyBookingOpen(true);
  }, []);

  const handleAppointmentBooked = () => {
    // Handle the appointment booking success
    console.log('Appointment booked successfully');
  };

  if (loading) {
    return (
      <div className="flex justify-center items-center h-screen">
        <FaSpinner className="animate-spin text-4xl text-blue-500" />
      </div>
    );
  }

  if (!counselor) {
    return (
      <div className="container mx-auto px-4 mt-8 text-center text-red-500">
        Counselor not found.
      </div>
    );
  }

  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      exit={{ opacity: 0, y: -20 }}
      transition={{ duration: 0.5 }}
      className="container mx-auto px-4 py-8 sm:px-6 lg:px-8"
    >
      <CounselorProfileCard
        counselor={counselor}
        handleBookAppointment={handleBookAppointment}
        handleEmergencyBooking={handleEmergencyBooking}
      />
      {isBookAppointmentModalOpen && (
        <BookingModal
          isOpen={isBookAppointmentModalOpen}
          onClose={() => setIsBookAppointmentModalOpen(false)}
          onAppointmentBooked={handleAppointmentBooked}
          counselorId={counselor?._id}
        />
      )}
      <EmergencyBookingButton
        counselorId={counselor?._id}
        counselorName={counselor?.personalInfo?.fullName}
        isOpen={isEmergencyBookingOpen}
        onClose={() => setIsEmergencyBookingOpen(false)}
        onBookingInitiated={() => {/* Handle emergency booking initiated */}}
      />
    </motion.div>
  );
};

const getRandomColor = () => {
  const colors = [
    'bg-red-200', 'bg-green-200', 'bg-blue-200', 'bg-yellow-200', 'bg-purple-200', 'bg-pink-200', 'bg-indigo-200'
  ];
  return colors[Math.floor(Math.random() * colors.length)];
};

const CounselorProfileCard = ({ counselor, handleBookAppointment, handleEmergencyBooking }) => (
  <div className="bg-white shadow-xl rounded-lg overflow-hidden">
    <div className="p-8">
      <div className="flex items-center justify-center mb-6">
        <FaUserCircle className="text-8xl text-blue-500" />
      </div>
      <h1 className="text-3xl font-bold text-center text-gray-800 mb-2">{counselor?.personalInfo?.fullName}</h1>
      <div className="flex items-center justify-center text-gray-600 mb-6">
        <FaEnvelope className="mr-2" />
        <span>{counselor?.email}</span>
      </div>
      <div className="flex items-center justify-center text-gray-600 mb-6">
        <FaPhoneAlt className="mr-2" />
        <span>{counselor?.personalInfo?.mobileNumber}</span>
      </div>
      <div className="flex justify-center space-x-4 mb-8">
        <button
          className="bg-blue-500 hover:bg-blue-600 text-white font-bold py-2 px-4 rounded-full transition duration-300 flex items-center"
          onClick={handleBookAppointment}
        >
          <FaCalendarAlt className="mr-2" />
          Book Appointment
        </button>
        <button
          className="bg-red-500 hover:bg-red-600 text-white font-bold py-2 px-4 rounded-full transition duration-300 flex items-center"
          onClick={handleEmergencyBooking}
        >
          <FaExclamationCircle className="mr-2" />
          Emergency Booking
        </button>
      </div>
      <div className="text-gray-600 text-center space-y-4">
        <p>{counselor?.personalInfo?.bio}</p>
        <p>Department: {counselor?.personalInfo?.department}</p>
        <div className="text-gray-600 text-center">
          <p className="font-bold">Specialties:</p>
          <div className="flex flex-wrap justify-center gap-2 mt-2">
            {counselor?.specialties?.map((specialty, index) => (
              <span
                key={index}
                className={`px-3 py-1 rounded-full text-sm font-medium ${getRandomColor()}`}
              >
                {specialty}
              </span>
            ))}
          </div>
        </div>
      </div>
    </div>
  </div>
);

CounselorProfileCard.propTypes = {
  counselor: PropTypes.object.isRequired,
  handleReport: PropTypes.func.isRequired,
  handleBookAppointment: PropTypes.func.isRequired,
  handleEmergencyBooking: PropTypes.func.isRequired,
};



export default CounselorProfile;