import { useState, useEffect, useCallback } from 'react';
import { useParams } from "react-router-dom";
import { Dialog, Transition, DialogPanel, DialogTitle, TransitionChild } from "@headlessui/react";
import { Fragment } from "react";
import { FaUserCircle, FaEnvelope, FaCalendarAlt, FaExclamationTriangle, FaPhoneAlt, FaSpinner } from "react-icons/fa";
import { motion } from "framer-motion";
import { toast } from "react-toastify";
import { useAuth } from '../../components/contexts/AuthContext';
import { fetchUserById } from "../../axiosServices/userDataServices";
import PropTypes from 'prop-types';
import BookingModal from "./BookingModal";

const CounselorProfile = () => {
  const { id } = useParams();
  const [counselor, setCounselor] = useState(null);
  const [loading, setLoading] = useState(true);
  const [isReportModalOpen, setIsReportModalOpen] = useState(false);
  const [reportReason, setReportReason] = useState("");
  const [isBookAppointmentModalOpen, setIsBookAppointmentModalOpen] = useState(false);
  const { userData } = useAuth();

  useEffect(() => {
    fetchCounselorDetails();
  }, [id, userData?.id]);

  const handleReport = () => setIsReportModalOpen(true);
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

  const submitReport = async () => {
    try {
      if (!userData) throw new Error("User not authenticated.");
      
      // Assume there is an endpoint to submit reports.
      // Replace this with your actual report submission logic.

      toast.success("Report submitted successfully.");
      setIsReportModalOpen(false);
      setReportReason("");
    } catch (error) {
      console.error("Error submitting report:", error);
      toast.error("Failed to submit report. Please try again.");
    }
  };

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
      handleReport={handleReport}
      handleBookAppointment={handleBookAppointment}
    />
   {isBookAppointmentModalOpen && (
  <BookingModal
  isOpen={isBookAppointmentModalOpen}
  onClose={() => setIsBookAppointmentModalOpen(false)}
  onAppointmentBooked={handleAppointmentBooked}
  counselorId={counselor?._id}
  />
)}
    <ReportModal
      isOpen={isReportModalOpen}
      onClose={() => setIsReportModalOpen(false)}
      onSubmit={submitReport}
      reportReason={reportReason}
      setReportReason={setReportReason}
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

const CounselorProfileCard = ({ counselor, handleReport, handleBookAppointment }) => (
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
          onClick={handleReport}
          className="bg-red-500 hover:bg-red-600 text-white font-bold py-2 px-4 rounded-full transition duration-300 flex items-center"
        >
          <FaExclamationTriangle className="mr-2" />
          Report
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
};

const ReportModal = ({
  isOpen,
  onClose,
  onSubmit,
  reportReason,
  setReportReason,
}) => (
  <Transition appear show={isOpen} as={Fragment}>
    <Dialog as="div" className="relative z-10" onClose={onClose}>
      <TransitionChild
        as={Fragment}
        enter="ease-out duration-300"
        enterFrom="opacity-0"
        enterTo="opacity-100"
        leave="ease-in duration-200"
        leaveFrom="opacity-100"
        leaveTo="opacity-0"
      >
        <div className="fixed inset-0 bg-black bg-opacity-25" />
      </TransitionChild>

      <div className="fixed inset-0 overflow-y-auto">
        <div className="flex min-h-full items-center justify-center p-4 text-center">
          <TransitionChild
            as={Fragment}
            enter="ease-out duration-300"
            enterFrom="opacity-0 scale-95"
            enterTo="opacity-100 scale-100"
            leave="ease-in duration-200"
            leaveFrom="opacity-100 scale-100"
            leaveTo="opacity-0 scale-95"
          >
            <DialogPanel className="w-full max-w-md transform overflow-hidden rounded-2xl bg-white p-6 text-left align-middle shadow-xl transition-all">
              <DialogTitle
                as="h3"
                className="text-lg font-medium leading-6 text-gray-900"
              >
                Report Counselor
              </DialogTitle>
              <div className="mt-2">
                <textarea
                  className="w-full h-32 p-2 border rounded mb-4"
                  placeholder="Please provide details about your concern..."
                  value={reportReason}
                  onChange={(e) => setReportReason(e.target.value)}
                ></textarea>
              </div>

              <div className="mt-4 flex justify-end space-x-4">
                <button
                  type="button"
                  className="inline-flex justify-center rounded-md border border-transparent bg-gray-100 px-4 py-2 text-sm font-medium text-gray-900 hover:bg-gray-200 focus:outline-none focus-visible:ring-2 focus-visible:ring-gray-500 focus-visible:ring-offset-2"
                  onClick={onClose}
                >
                  Cancel
                </button>
                <button
                  type="button"
                  className="inline-flex justify-center rounded-md border border-transparent bg-red-100 px-4 py-2 text-sm font-medium text-red-900 hover:bg-red-200 focus:outline-none focus-visible:ring-2 focus-visible:ring-red-500 focus-visible:ring-offset-2"
                  onClick={onSubmit}
                >
                  Submit
                </button>
              </div>
            </DialogPanel>
          </TransitionChild>
        </div>
      </div>
    </Dialog>
  </Transition>
);

ReportModal.propTypes = {
  isOpen: PropTypes.bool.isRequired,
  onClose: PropTypes.func.isRequired,
  onSubmit: PropTypes.func.isRequired,
  reportReason: PropTypes.string.isRequired,
  setReportReason: PropTypes.func.isRequired,
}

export default CounselorProfile;