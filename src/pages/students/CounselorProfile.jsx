import { useState, useEffect } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { FaStar, FaCalendarAlt, FaClock, FaExclamationTriangle, FaSpinner } from 'react-icons/fa';
import { motion, AnimatePresence } from 'framer-motion';
import axios from 'axios';
import { toast } from 'react-toastify';

const CounselorProfile = () => {
    const { id } = useParams();
    const navigate = useNavigate();
    const [counselor, setCounselor] = useState(null);
    const [loading, setLoading] = useState(true);
    const [isReportModalOpen, setIsReportModalOpen] = useState(false);
    const [reportReason, setReportReason] = useState('');
    const [isBookingModalOpen, setIsBookingModalOpen] = useState(false);
    const [bookingDate, setBookingDate] = useState('');
    const [bookingTimeSlot, setBookingTimeSlot] = useState('');
    const [bookingReason, setBookingReason] = useState('');
    const [isSubmitting, setIsSubmitting] = useState(false);

    useEffect(() => {
        fetchCounselorDetails();
    }, [id]);

    const fetchCounselorDetails = async () => {
        try {
            const response = await axios.get(`https://cyber-guidance.onrender.com/api/counselor/${id}`, {
                headers: {
                    Authorization: `Bearer ${localStorage.getItem('token')}`
                }
            });
            setCounselor(response.data.counselor);
            setLoading(false);
        } catch (error) {
            console.error('Error fetching counselor details:', error);
            toast.error('Failed to fetch counselor details. Please try again.');
            setLoading(false);
        }
    };

    const handleReport = () => {
        setIsReportModalOpen(true);
    };

    const submitReport = () => {
        // Here you would typically send the report to your backend
        console.log('Report submitted:', reportReason);
        setIsReportModalOpen(false);
        setReportReason('');
        toast.success('Report submitted successfully. We will review it shortly.');
    };

    const handleBookAppointment = () => {
        setIsBookingModalOpen(true);
    };

    const submitBooking = async () => {
        setIsSubmitting(true);
        try {
            const response = await axios.post('https://cyber-guidance.onrender.com/api/book-appointment', {
                email: counselor.email,
                date: bookingDate,
                timeSlot: bookingTimeSlot,
                reason: bookingReason
            }, {
                headers: {
                    Authorization: `Bearer ${localStorage.getItem('token')}`
                }
            });
            toast.success('Appointment request sent successfully!');
            setIsBookingModalOpen(false);
            // Show a success message with more details
            toast.info('Your appointment request has been sent to the admin for processing. You will receive a confirmation soon.', {
                autoClose: 5000
            });
        } catch (error) {
            console.error('Error booking appointment:', error);
            toast.error('Failed to book appointment. Please try again.');
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
            <div className="bg-white shadow-2xl rounded-lg overflow-hidden">
                <div className="md:flex">
                    <div className="md:flex-shrink-0">
                        <img 
                            src={counselor.imageUrl || 'default-avatar.png'} 
                            alt={counselor.username} 
                            className="h-48 w-full object-cover md:w-48"
                        />
                    </div>
                    <div className="p-8">
                        <div className="uppercase tracking-wide text-sm text-indigo-500 font-semibold">
                            Professional Counselor
                        </div>
                        <h1 className="mt-2 text-3xl leading-8 font-extrabold tracking-tight text-gray-900 sm:text-4xl">
                            {counselor.username}
                        </h1>
                        <p className="mt-4 max-w-2xl text-xl text-gray-500">
                            {counselor.email}
                        </p>
                    </div>
                </div>
                <div className="px-8 py-6 bg-gray-50">
                    <div className="flex items-center justify-between mb-4">
                        <button
                            className="bg-blue-500 text-white px-4 py-2 rounded-full hover:bg-blue-600 transition duration-300"
                            onClick={handleBookAppointment}
                        >
                            Book Appointment
                        </button>
                        <button
                            className="bg-red-500 text-white px-4 py-2 rounded-full hover:bg-red-600 transition duration-300 flex items-center"
                            onClick={handleReport}
                        >
                            <FaExclamationTriangle className='mr-2'/>
                            Report
                        </button>
                    </div>
                    <div className="mb-4">
                        <h3 className="text-lg font-semibold mb-2">Specialties:</h3>
                        <div className="flex flex-wrap">
                            {counselor.specialties.map((specialty, index) => (
                                <span key={index} className="bg-blue-100 text-blue-800 text-sm font-medium mr-2 mb-2 px-2.5 py-0.5 rounded">
                                    {specialty}
                                </span>
                            ))}
                        </div>
                    </div>
                </div>
            </div>
            
            {/* Report Modal */}
            <AnimatePresence>
                {isReportModalOpen && (
                    <motion.div
                        initial={{ opacity: 0 }}
                        animate={{ opacity: 1 }}
                        exit={{ opacity: 0 }}
                        transition={{ duration: 0.3 }}
                        className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50"
                        onClick={() => setIsReportModalOpen(false)}
                    >
                        <motion.div
                            initial={{ scale: 0.9, y: 50 }}
                            animate={{ scale: 1, y: 0 }}
                            exit={{ scale: 0.9, y: 50 }}
                            transition={{ type: 'spring', stiffness: 300, damping: 30 }}
                            className="bg-white p-8 rounded-lg shadow-xl text-center max-w-md mx-4"
                            onClick={(e) => e.stopPropagation()}
                        >
                            <h3 className="text-2xl font-bold mb-4">Report Counselor</h3>
                            <textarea
                                className="w-full h-32 p-2 border rounded mb-4"
                                placeholder="Please provide details about your concern..."
                                value={reportReason}
                                onChange={(e) => setReportReason(e.target.value)}
                            ></textarea>
                            <div className="flex justify-end space-x-4">
                                <button 
                                    className="px-4 py-2 bg-gray-300 rounded hover:bg-gray-400 transition duration-300"
                                    onClick={() => setIsReportModalOpen(false)}
                                >
                                    Cancel
                                </button>
                                <button 
                                    className="px-4 py-2 bg-red-500 text-white rounded hover:bg-red-600 transition duration-300"
                                    onClick={submitReport}
                                >
                                    Submit Report
                                </button>
                            </div>
                        </motion.div>
                    </motion.div>
                )}
            </AnimatePresence>

            {/* Booking Modal */}
            <AnimatePresence>
                {isBookingModalOpen && (
                    <motion.div
                        initial={{ opacity: 0 }}
                        animate={{ opacity: 1 }}
                        exit={{ opacity: 0 }}
                        transition={{ duration: 0.3 }}
                        className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50"
                        onClick={() => setIsBookingModalOpen(false)}
                    >
                        <motion.div
                            initial={{ scale: 0.9, y: 50 }}
                            animate={{ scale: 1, y: 0 }}
                            exit={{ scale: 0.9, y: 50 }}
                            transition={{ type: 'spring', stiffness: 300, damping: 30 }}
                            className="bg-white p-8 rounded-lg shadow-xl text-center max-w-md mx-4"
                            onClick={(e) => e.stopPropagation()}
                        >
                            <h3 className="text-2xl font-bold mb-4">Book Appointment</h3>
                            <input
                                type="date"
                                className="w-full p-2 border rounded mb-4"
                                value={bookingDate}
                                onChange={(e) => setBookingDate(e.target.value)}
                            />
                            <input
                                type="time"
                                className="w-full p-2 border rounded mb-4"
                                value={bookingTimeSlot}
                                onChange={(e) => setBookingTimeSlot(e.target.value)}
                            />
                            <textarea
                                className="w-full h-32 p-2 border rounded mb-4"
                                placeholder="Reason for appointment..."
                                value={bookingReason}
                                onChange={(e) => setBookingReason(e.target.value)}
                            ></textarea>
                            <div className="flex justify-end space-x-4">
                                <button 
                                    className="px-4 py-2 bg-gray-300 rounded hover:bg-gray-400 transition duration-300"
                                    onClick={() => setIsBookingModalOpen(false)}
                                >
                                    Cancel
                                </button>
                                <button
                                    className="px-4 py-2 bg-blue-500 text-white rounded hover:bg-blue-600 transition duration-300 flex items-center justify-center"
                                    onClick={submitBooking}
                                    disabled={isSubmitting}
                                >
                                    {isSubmitting ? (
                                        <>
                                            <FaSpinner className="animate-spin mr-2" />
                                            Submitting...
                                        </>
                                    ) : (
                                        'Book Appointment'
                                    )}
                                </button>
                            </div>
                        </motion.div>
                    </motion.div>
                )}
            </AnimatePresence>
        </motion.div>
    );
};

export default CounselorProfile;