import { useState, useEffect } from 'react';
import { useForm } from 'react-hook-form';
import { motion, AnimatePresence } from 'framer-motion';
import { Tab, TabPanels, TabGroup, TabList, TabPanel } from '@headlessui/react';
import { FaCalendarPlus, FaUser, FaQuestion, FaInfoCircle, FaSpinner } from 'react-icons/fa';
import { IoMdTime } from 'react-icons/io';
import axios from 'axios';

const AppointmentManager = () => {
    const [appointments, setAppointments] = useState(null);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState('');
    const [successMessage, setSuccessMessage] = useState('');
    const [showInstructions, setShowInstructions] = useState(false);

    const { register, handleSubmit, reset, formState: { errors } } = useForm();

    useEffect(() => {
        fetchAppointmentHistory();
    }, []);

    const onBookAppointment = async (data) => {
        setLoading(true);
        setError('');
        setSuccessMessage('');
        try {
            const response = await axios.post('https://cyber-guidance.onrender.com/api/book-appointment', data);
            setSuccessMessage(response.data.message);
            reset();
            fetchAppointmentHistory();
            setShowInstructions(true);
        } catch (error) {
            setError(error.response?.data?.message || 'An error occurred while booking the appointment.');
        } finally {
            setLoading(false);
        }
    };

    const fetchAppointmentHistory = async () => {
        setLoading(true);
        try {
            const response = await axios.get('/appointment-history');
            setAppointments(response.data.appointments || []);
        } catch (error) {
            setError('Failed to fetch appointment history');
            setAppointments([]);
        } finally {
            setLoading(false);
        }
    };

    // Render loading state
    if (loading) {
        return (
            <div className="min-h-screen bg-gray-100 flex items-center justify-center">
                <motion.div
                    animate={{ rotate: 360 }}
                    transition={{ duration: 1, repeat: Infinity, ease: "linear" }}
                >  <FaSpinner className="text-blue-500 text-5xl" /></motion.div>
            </div>
        );
    }

    // Render error state
    if (error && !appointments) {
        return (
            <div className="min-h-screen bg-gray-100 flex items-center justify-center">
                <div className="bg-red-100 border border-red-400 text-red-700 px-4 py-3 rounded relative" role="alert">
                    <strong className="font-bold">Error: </strong>
                    <span className="block sm:inline">{error}</span>
                </div>
            </div>
        );
    }
    return (
        <div className="min-h-screen bg-gray-100 p-8">
            <div className="max-w-4xl mx-auto">
                <h1 className="text-xl font-bold mb-8 text-gray-800 text-center">Appointment Manager</h1>

                <TabGroup>
                    <TabList className="flex space-x-1 rounded-xl bg-blue-900/20 p-1 mb-8">
                        {['Book Appointment', 'Appointment History'].map((category) => (
                            <Tab
                                key={category}
                                className={({ selected }) =>
                                    `w-full rounded-lg py-2.5 text-sm font-medium leading-5 text-blue-700 transition-all duration-200
                  ${selected
                                        ? 'bg-white shadow'
                                        : 'text-blue-100 hover:bg-white/[0.12] hover:text-white'
                                    }`
                                }
                            >
                                {category}
                            </Tab>
                        ))}
                    </TabList>
                    <TabPanels>
                        <TabPanel>
                            <motion.div
                                initial={{ opacity: 0, y: 20 }}
                                animate={{ opacity: 1, y: 0 }}
                                transition={{ duration: 0.5 }}
                                className="bg-white shadow-lg rounded-lg p-6"
                            >
                                <h2 className="text-2xl font-semibold mb-4 text-center">Book a New Appointment</h2>
                                <form onSubmit={handleSubmit(onBookAppointment)} className="space-y-4">
                                    <div>
                                        <label htmlFor="date" className="block text-sm font-medium text-gray-700 mb-1">
                                            <FaCalendarPlus className="inline mr-2" />
                                            Date
                                        </label>
                                        <input
                                            type="date"
                                            id="date"
                                            {...register('date', { required: 'Date is required' })}
                                            className="w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-indigo-500 focus:border-indigo-500"
                                        />
                                        {errors.date && <p className="mt-1 text-sm text-red-600">{errors.date.message}</p>}
                                    </div>
                                    <div>
                                        <label htmlFor="timeSlot" className="block text-sm font-medium text-gray-700 mb-1">
                                            <IoMdTime className="inline mr-2" />
                                            Time Slot
                                        </label>
                                        <select
                                            id="timeSlot"
                                            {...register('timeSlot', { required: 'Time slot is required' })}
                                            className="w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-indigo-500 focus:border-indigo-500"
                                        >
                                            <option value="">Select a time slot</option>
                                            <option value="09:00-10:00">09:00 - 10:00</option>
                                            <option value="10:00-11:00">10:00 - 11:00</option>
                                            <option value="11:00-12:00">11:00 - 12:00</option>
                                        </select>
                                        {errors.timeSlot && <p className="mt-1 text-sm text-red-600">{errors.timeSlot.message}</p>}
                                    </div>
                                    <div>
                                        <label htmlFor="reason" className="block text-sm font-medium text-gray-700 mb-1">
                                            <FaQuestion className="inline mr-2" />
                                            Reason
                                        </label>
                                        <textarea
                                            id="reason"
                                            {...register('reason', { required: 'Reason is required' })}
                                            className="w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-indigo-500 focus:border-indigo-500"
                                            rows="3"
                                        ></textarea>
                                        {errors.reason && <p className="mt-1 text-sm text-red-600">{errors.reason.message}</p>}
                                    </div>
                                    <motion.button
                                        type="submit"
                                        whileHover={{ scale: 1.05 }}
                                        whileTap={{ scale: 0.95 }}
                                        className="w-full bg-blue-600 text-white rounded-md py-2 px-4 font-medium hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:ring-offset-2 transition-colors"
                                        disabled={loading}
                                    >
                                        {loading ? 'Booking...' : 'Book Appointment'}
                                    </motion.button>
                                </form>
                            </motion.div>
                        </TabPanel>
                        <TabPanel>
                            <motion.div
                                initial={{ opacity: 0, y: 20 }}
                                animate={{ opacity: 1, y: 0 }}
                                transition={{ duration: 0.5 }}
                                className="bg-white shadow-lg rounded-lg p-6"
                            >
                                <h2 className="text-2xl font-semibold mb-4 text-center">Appointment History</h2>
                                {loading ? (
                                    <div className="text-center py-4">
                                        <motion.div
                                            animate={{ rotate: 360 }}
                                            transition={{ duration: 1, repeat: Infinity, ease: "linear" }}
                                            className="inline-block w-8 h-8 border-t-2 border-blue-500 border-solid rounded-full"
                                        ></motion.div>
                                        <p className="mt-2 text-gray-600">Loading appointments...</p>
                                    </div>
                                ) : appointments.length === 0 ? (
                                    <p className="text-center text-gray-500">No appointments found.</p>
                                ) : (
                                    <div className="space-y-4">
                                        {appointments.map((appointment, index) => (
                                            <motion.div
                                                key={index}
                                                initial={{ opacity: 0, y: 20 }}
                                                animate={{ opacity: 1, y: 0 }}
                                                transition={{ duration: 0.3, delay: index * 0.1 }}
                                                className="bg-gray-50 p-4 rounded-lg flex items-center space-x-4"
                                            >
                                                <div className="flex-shrink-0">
                                                    <FaUser className="text-3xl text-blue-500" />
                                                </div>
                                                <div className="flex-grow">
                                                    <p className="text-sm text-gray-600">
                                                        <FaCalendarPlus className="inline mr-2" />
                                                        {appointment.date}
                                                    </p>
                                                    <p className="text-sm text-gray-600">
                                                        <IoMdTime className="inline mr-2" />
                                                        {appointment.timeSlot}
                                                    </p>
                                                    <p className="text-sm text-gray-600">
                                                        <FaQuestion className="inline mr-2" />
                                                        {appointment.reason}
                                                    </p>
                                                </div>
                                            </motion.div>
                                        ))}
                                    </div>
                                )}
                            </motion.div>
                        </TabPanel>
                    </TabPanels>
                </TabGroup>

                <AnimatePresence>
                    {error && (
                        <motion.div
                            initial={{ opacity: 0, y: -20 }}
                            animate={{ opacity: 1, y: 0 }}
                            exit={{ opacity: 0, y: -20 }}
                            transition={{ duration: 0.3 }}
                            className="mt-4 bg-red-100 border border-red-400 text-red-700 px-4 py-3 rounded relative"
                            role="alert"
                        >
                            <strong className="font-bold">Error: </strong>
                            <span className="block sm:inline">{error}</span>
                        </motion.div>
                    )}

                    {successMessage && (
                        <motion.div
                            initial={{ opacity: 0, y: -20 }}
                            animate={{ opacity: 1, y: 0 }}
                            exit={{ opacity: 0, y: -20 }}
                            transition={{ duration: 0.3 }}
                            className="mt-4 bg-green-100 border border-green-400 text-green-700 px-4 py-3 rounded relative"
                            role="alert"
                        >
                            <strong className="font-bold">Success: </strong>
                            <span className="block sm:inline">{successMessage}</span>
                        </motion.div>
                    )}

                    {showInstructions && (
                        <motion.div
                            initial={{ opacity: 0, y: -20 }}
                            animate={{ opacity: 1, y: 0 }}
                            exit={{ opacity: 0, y: -20 }}
                            transition={{ duration: 0.3 }}
                            className="mt-4 bg-blue-50 border border-blue-200 rounded-lg p-4"
                        >
                            <h3 className="text-lg font-semibold mb-2 flex items-center">
                                <FaInfoCircle className="mr-2 text-blue-500" />
                                Next Steps
                            </h3>
                            <p className="text-sm text-gray-700">
                                Your appointment request has been sent to the admin. Please check your email for further instructions and confirmation. If you don&apos;t receive an email within 24 hours, please contact the student support office.
                            </p>
                        </motion.div>
                    )}
                </AnimatePresence>
            </div>
        </div>
    );
};

export default AppointmentManager;