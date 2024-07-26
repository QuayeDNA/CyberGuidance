import { useState, useEffect } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import counselorsData from '../../components/data/counselorsData';
import { FaSpinner, FaCheck, FaStar, FaCalendarAlt, FaClock, FaExclamationTriangle } from 'react-icons/fa';
import { motion, AnimatePresence } from 'framer-motion';

const CounselorProfile = () => {
    const { id } = useParams();
    const navigate = useNavigate();
    const [counselor, setCounselor] = useState(null);
    const [isModalOpen, setIsModalOpen] = useState(false);
    const [bookingStatus, setBookingStatus] = useState('booking');
    const [rating, setRating] = useState(0);
    const [isReportModalOpen, setIsReportModalOpen] = useState(false);
    const [reportReason, setReportReason] = useState('');

    useEffect(() => {
        const storedCounselor = localStorage.getItem('bookedCounselor');
        if (storedCounselor) {
            setCounselor(JSON.parse(storedCounselor));
        } else {
            const foundCounselor = counselorsData.find(c => c.id.toString() === id);
            if (foundCounselor) {
                setCounselor(foundCounselor);
                localStorage.setItem('bookedCounselor', JSON.stringify(foundCounselor));
            } else {
                navigate('/main/counselors');
            }
        }
    }, [id, navigate]);

    useEffect(() => {
        if (isModalOpen || isReportModalOpen) {
            document.body.style.overflow = 'hidden';
        } else {
            document.body.style.overflow = 'unset';
        }
    }, [isModalOpen, isReportModalOpen]);

    if (!counselor) {
        return (
            <motion.div
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                exit={{ opacity: 0 }}
                className="container mx-auto px-4 mt-8 text-center text-red-500"
            >
                Loading...
            </motion.div>
        );
    }

    const handleBookSession = () => {
        setIsModalOpen(true);
        setBookingStatus('booking');
        setTimeout(() => {
            setBookingStatus('success');
        }, 3000);
    };

    const closeModal = () => {
        setIsModalOpen(false);
        setBookingStatus('booking');
    };

    const handleRating = (value) => {
        setRating(value);
    };

    const handleReport = () => {
        setIsReportModalOpen(true);
    };

    const submitReport = () => {
        // Here you would typically send the report to your backend
        console.log('Report submitted:', reportReason);
        setIsReportModalOpen(false);
        setReportReason('');
    };

    const cancelBooking = () => {
        localStorage.removeItem('bookedCounselor');
        navigate('/student/counselors');
    };

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
                            src={counselor.imageUrl} 
                            alt={counselor.name} 
                            className="h-48 w-full object-cover md:w-48"
                        />
                    </div>
                    <div className="p-8">
                        <div className="uppercase tracking-wide text-sm text-indigo-500 font-semibold">
                            Professional Counselor
                        </div>
                        <h1 className="mt-2 text-3xl leading-8 font-extrabold tracking-tight text-gray-900 sm:text-4xl">
                            {counselor.name}
                        </h1>
                        <p className="mt-4 max-w-2xl text-xl text-gray-500">
                            {counselor.history}
                        </p>
                    </div>
                </div>
                <div className="px-8 py-6 bg-gray-50">
                <div className="flex items-center justify-between mb-4">
                        <div className="flex items-center">
                            {[1, 2, 3, 4, 5].map((star) => (
                                <FaStar
                                    key={star}
                                    className={`cursor-pointer ${star <= rating ? 'text-yellow-400' : 'text-gray-300'}`}
                                    onClick={() => handleRating(star)}
                                />
                            ))}
                        </div>
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
                    <div className="flex justify-between items-center">
                        <div>
                            <div className="flex items-center text-gray-500 mb-2">
                                <FaCalendarAlt className="mr-2" />
                                <span>Available Mon-Fri</span>
                            </div>
                            <div className="flex items-center text-gray-500">
                                <FaClock className="mr-2" />
                                <span>9:00 AM - 5:00 PM</span>
                            </div>
                        </div>
                        <div className="flex justify-between items-center mt-4">
                        <button 
                            className="bg-red-500 text-white px-6 py-3 rounded-full shadow-lg hover:bg-red-600 transition duration-300 ease-in-out transform hover:-translate-y-1 hover:scale-105 focus:outline-none"
                            onClick={cancelBooking}
                        >
                            Cancel Booking
                        </button>
                    </div>
                        <button 
                            className="bg-indigo-600 text-white px-6 py-3 rounded-full shadow-lg hover:bg-indigo-700 transition duration-300 ease-in-out transform hover:-translate-y-1 hover:scale-105 focus:outline-none"
                            onClick={handleBookSession}
                        >
                            Book a Session
                        </button>
                    </div>
                </div>
            </div>

            <AnimatePresence>
                {isModalOpen && (
                    <motion.div
                        initial={{ opacity: 0 }}
                        animate={{ opacity: 1 }}
                        exit={{ opacity: 0 }}
                        transition={{ duration: 0.3 }}
                        className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50"
                        onClick={closeModal}
                    >
                        <motion.div
                            initial={{ scale: 0.9, y: 50 }}
                            animate={{ scale: 1, y: 0 }}
                            exit={{ scale: 0.9, y: 50 }}
                            transition={{ type: 'spring', stiffness: 300, damping: 30 }}
                            className="bg-white p-8 rounded-lg shadow-xl text-center max-w-md mx-4"
                            onClick={(e) => e.stopPropagation()}
                        >
                            {bookingStatus === 'booking' ? (
                                <>
                                    <FaSpinner className="animate-spin text-5xl text-indigo-600 mx-auto mb-4" />
                                    <p className="text-xl font-semibold mb-2">Booking your session...</p>
                                    <p className="text-gray-600">Please wait while we connect you with {counselor.name}.</p>
                                </>
                            ) : (
                                <>
                                    <div className="w-16 h-16 bg-green-100 rounded-full flex items-center justify-center mx-auto mb-4">
                                        <FaCheck className="text-3xl text-green-500" />
                                    </div>
                                    <h3 className="text-2xl font-bold mb-2">Booking Successful!</h3>
                                    <p className="text-gray-600 mb-4">
                                        {counselor.name} has been notified of your request. You will receive a confirmation email shortly with further details about your session.
                                    </p>
                                    <button 
                                        className="mt-4 bg-indigo-600 text-white px-6 py-2 rounded-full hover:bg-indigo-700 transition duration-300 ease-in-out transform hover:-translate-y-1 hover:scale-105 focus:outline-none"
                                        onClick={closeModal}
                                    >
                                        Close
                                    </button>
                                </>
                            )}
                        </motion.div>
                    </motion.div>
                )}
            </AnimatePresence>
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
        </motion.div>
    );
};

export default CounselorProfile;