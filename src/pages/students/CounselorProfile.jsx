import { useState, useEffect } from "react";
import { useParams } from "react-router-dom";
import { Dialog, Transition } from "@headlessui/react";
import { Fragment } from "react";
import { FaUserCircle, FaEnvelope, FaCalendarAlt, FaExclamationTriangle, FaSpinner } from "react-icons/fa";
import { motion } from "framer-motion";
import axios from "axios";
import { toast } from "react-toastify";
import { useAuth } from '../../components/contexts/AuthContext';

const CounselorProfile = () => {
  const { id } = useParams();
  const [counselor, setCounselor] = useState(null);
  const [loading, setLoading] = useState(true);
  const [isReportModalOpen, setIsReportModalOpen] = useState(false);
  const [reportReason, setReportReason] = useState("");
  const [isBookingModalOpen, setIsBookingModalOpen] = useState(false);
  const [bookingDate, setBookingDate] = useState("");
  const [bookingTimeSlot, setBookingTimeSlot] = useState("");
  const [bookingReason, setBookingReason] = useState("");
  const [isSubmitting, setIsSubmitting] = useState(false);
  const { userData } = useAuth();

  useEffect(() => {
    fetchCounselorDetails();
  }, [id]);

  const fetchCounselorDetails = async () => {
    try {
      const response = await axios.get(
        `https://cyber-guidance.onrender.com/api/counselor/${id}`,
        {
          headers: {
            Authorization: `Bearer ${localStorage.getItem("token")}`,
          },
        }
      );
      setCounselor(response.data.counselor);
      setLoading(false);
    } catch (error) {
      console.error("Error fetching counselor details:", error);
      toast.error("Failed to fetch counselor details. Please try again.");
      setLoading(false);
    }
  };

  const handleReport = () => setIsReportModalOpen(true);
  const handleBookAppointment = () => setIsBookingModalOpen(true);

  const submitReport = () => {
    console.log("Report submitted:", reportReason);
    setIsReportModalOpen(false);
    setReportReason("");
    toast.success("Report submitted successfully. We will review it shortly.");
  };

  const submitBooking = async () => {
    setIsSubmitting(true);
     try {
            if (!userData || !userData.token) {
                throw new Error('No token found');
            }

      const response = await axios.post(
        "https://cyber-guidance.onrender.com/api/book-appointment",
        {
          email: counselor.email,
          date: bookingDate,
          timeSlot: bookingTimeSlot,
          reason: bookingReason,
        },
        {
           headers: {
                    Authorization: `Bearer ${userData.token}`,
                },
        }
      );
      if (response.status === 200) {
        toast.success("Appointment request sent successfully!");
        setIsBookingModalOpen(false);
        toast.info("Your appointment request has been sent to the admin for processing. You will receive a confirmation soon.", { autoClose: 5000 });
      } else {
        throw new Error(`Unexpected response status: ${response.status}`);
      }
    } catch (error) {
      console.error("Error booking appointment:", error);
      toast.error("Failed to book appointment. Please try again.");
    } finally {
      setIsSubmitting(false);
    }
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
      className="container mx-auto px-4 py-8"
    >
      <div className="bg-white shadow-xl rounded-lg overflow-hidden">
        <div className="p-8">
          <div className="flex items-center justify-center mb-6">
            <FaUserCircle className="text-8xl text-blue-500" />
          </div>
          <h1 className="text-3xl font-bold text-center text-gray-800 mb-2">{counselor.username}</h1>
          <div className="flex items-center justify-center text-gray-600 mb-6">
            <FaEnvelope className="mr-2" />
            <span>{counselor.email}</span>
          </div>
          <div className="flex justify-center space-x-4 mb-8">
            <button
              onClick={handleBookAppointment}
              className="bg-blue-500 hover:bg-blue-600 text-white font-bold py-2 px-4 rounded-full transition duration-300 flex items-center"
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
        </div>
      </div>

      {/* Report Modal */}
      <Transition appear show={isReportModalOpen} as={Fragment}>
        <Dialog as="div" className="relative z-10" onClose={() => setIsReportModalOpen(false)}>
          <Transition.Child
            as={Fragment}
            enter="ease-out duration-300"
            enterFrom="opacity-0"
            enterTo="opacity-100"
            leave="ease-in duration-200"
            leaveFrom="opacity-100"
            leaveTo="opacity-0"
          >
            <div className="fixed inset-0 bg-black bg-opacity-25" />
          </Transition.Child>

          <div className="fixed inset-0 overflow-y-auto">
            <div className="flex min-h-full items-center justify-center p-4 text-center">
              <Transition.Child
                as={Fragment}
                enter="ease-out duration-300"
                enterFrom="opacity-0 scale-95"
                enterTo="opacity-100 scale-100"
                leave="ease-in duration-200"
                leaveFrom="opacity-100 scale-100"
                leaveTo="opacity-0 scale-95"
              >
                <Dialog.Panel className="w-full max-w-md transform overflow-hidden rounded-2xl bg-white p-6 text-left align-middle shadow-xl transition-all">
                  <Dialog.Title
                    as="h3"
                    className="text-lg font-medium leading-6 text-gray-900"
                  >
                    Report Counselor
                  </Dialog.Title>
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
                      onClick={() => setIsReportModalOpen(false)}
                    >
                      Cancel
                    </button>
                    <button
                      type="button"
                      className="inline-flex justify-center rounded-md border border-transparent bg-red-100 px-4 py-2 text-sm font-medium text-red-900 hover:bg-red-200 focus:outline-none focus-visible:ring-2 focus-visible:ring-red-500 focus-visible:ring-offset-2"
                      onClick={submitReport}
                    >
                      Submit Report
                    </button>
                  </div>
                </Dialog.Panel>
              </Transition.Child>
            </div>
          </div>
        </Dialog>
      </Transition>

      {/* Booking Modal */}
      <Transition appear show={isBookingModalOpen} as={Fragment}>
        <Dialog as="div" className="relative z-10" onClose={() => setIsBookingModalOpen(false)}>
          <Transition.Child
            as={Fragment}
            enter="ease-out duration-300"
            enterFrom="opacity-0"
            enterTo="opacity-100"
            leave="ease-in duration-200"
            leaveFrom="opacity-100"
            leaveTo="opacity-0"
          >
            <div className="fixed inset-0 bg-black bg-opacity-25" />
          </Transition.Child>

          <div className="fixed inset-0 overflow-y-auto">
            <div className="flex min-h-full items-center justify-center p-4 text-center">
              <Transition.Child
                as={Fragment}
                enter="ease-out duration-300"
                enterFrom="opacity-0 scale-95"
                enterTo="opacity-100 scale-100"
                leave="ease-in duration-200"
                leaveFrom="opacity-100 scale-100"
                leaveTo="opacity-0 scale-95"
              >
                <Dialog.Panel className="w-full max-w-md transform overflow-hidden rounded-2xl bg-white p-6 text-left align-middle shadow-xl transition-all">
                  <Dialog.Title
                    as="h3"
                    className="text-lg font-medium leading-6 text-gray-900"
                  >
                    Book Appointment
                  </Dialog.Title>
                  <div className="mt-2 space-y-4">
                    <input
                      type="date"
                      className="w-full p-2 border rounded"
                      value={bookingDate}
                      onChange={(e) => setBookingDate(e.target.value)}
                    />
                    <input
                      type="time"
                      className="w-full p-2 border rounded"
                      value={bookingTimeSlot}
                      onChange={(e) => setBookingTimeSlot(e.target.value)}
                    />
                    <textarea
                      className="w-full h-32 p-2 border rounded"
                      placeholder="Reason for appointment..."
                      value={bookingReason}
                      onChange={(e) => setBookingReason(e.target.value)}
                    ></textarea>
                  </div>

                  <div className="mt-4 flex justify-end space-x-4">
                    <button
                      type="button"
                      className="inline-flex justify-center rounded-md border border-transparent bg-gray-100 px-4 py-2 text-sm font-medium text-gray-900 hover:bg-gray-200 focus:outline-none focus-visible:ring-2 focus-visible:ring-gray-500 focus-visible:ring-offset-2"
                      onClick={() => setIsBookingModalOpen(false)}
                    >
                      Cancel
                    </button>
                    <button
                      type="button"
                      className="inline-flex justify-center rounded-md border border-transparent bg-blue-100 px-4 py-2 text-sm font-medium text-blue-900 hover:bg-blue-200 focus:outline-none focus-visible:ring-2 focus-visible:ring-blue-500 focus-visible:ring-offset-2"
                      onClick={submitBooking}
                      disabled={isSubmitting}
                    >
                      {isSubmitting ? (
                        <>
                          <FaSpinner className="animate-spin mr-2" />
                          Submitting...
                        </>
                      ) : (
                        "Book Appointment"
                      )}
                    </button>
                  </div>
                </Dialog.Panel>
              </Transition.Child>
            </div>
          </div>
        </Dialog>
      </Transition>
    </motion.div>
  );
};

export default CounselorProfile;