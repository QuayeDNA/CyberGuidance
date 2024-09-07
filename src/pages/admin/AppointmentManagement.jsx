import { useEffect, useState, Fragment } from 'react';
import { getAllAppointmentsAdmin, getTodayUpcomingAppointmentsAdmin } from '../../axiosServices/reportApi'; // Import API calls
import { FaCheckCircle, FaClock, FaCalendarAlt, FaRegIdBadge } from 'react-icons/fa'; // React Icons
import { Dialog, Transition, TransitionChild, DialogTitle } from '@headlessui/react'; // Headless UI for dialog
import moment from 'moment';

const AppointmentManagement = () => {
    const [appointments, setAppointments] = useState([]);
    const [upcomingAppointments, setUpcomingAppointments] = useState([]);
    const [stats, setStats] = useState({
        totalAppointments: 0,
        upcomingAppointments: 0,
        completedAppointments: 0,
        cancelledAppointments: 0,
    });
    const [isOpen, setIsOpen] = useState(false);
    const [selectedAppointment, setSelectedAppointment] = useState(null);

    useEffect(() => {
        const fetchAppointments = async () => {
            try {
                const data = await getAllAppointmentsAdmin();
                setAppointments(data.appointments);
                setStats(data.stats); // Get the counts from the response
            } catch (error) {
                console.error('Error fetching appointments:', error);
            }
        };

        const fetchUpcomingAppointments = async () => {
            try {
                const data = await getTodayUpcomingAppointmentsAdmin();
                setUpcomingAppointments(data.appointments);
            } catch (error) {
                console.error('Error fetching upcoming appointments:', error);
            }
        };

        fetchAppointments();
        fetchUpcomingAppointments();
    }, []);

    const getAvatarUrl = (name) => `https://ui-avatars.com/api/?name=${encodeURIComponent(name)}&background=random`;

    const openDialog = (appointment) => {
        setSelectedAppointment(appointment);
        setIsOpen(true);
    };

    const closeDialog = () => {
        setIsOpen(false);
        setSelectedAppointment(null);
    };

    return (
        <div className="p-6">
            {/* Analytics Cards */}
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4 mb-6">
                <div className="bg-white shadow-lg rounded-lg p-4">
                    <div className="flex items-center">
                        <FaCheckCircle className="w-8 h-8 text-green-500 mr-4" />
                        <div>
                            <h2 className="text-lg font-semibold">Total Appointments</h2>
                            <p className="text-gray-500">{stats.totalAppointments}</p>
                        </div>
                    </div>
                </div>
                <div className="bg-white shadow-lg rounded-lg p-4">
                    <div className="flex items-center">
                        <FaClock className="w-8 h-8 text-blue-500 mr-4" />
                        <div>
                            <h2 className="text-lg font-semibold">Upcoming</h2>
                            <p className="text-gray-500">{stats.upcomingAppointments}</p>
                        </div>
                    </div>
                </div>
                <div className="bg-white shadow-lg rounded-lg p-4">
                    <div className="flex items-center">
                        <FaRegIdBadge className="w-8 h-8 text-green-500 mr-4" />
                        <div>
                            <h2 className="text-lg font-semibold">Completed</h2>
                            <p className="text-gray-500">{stats.completedAppointments}</p>
                        </div>
                    </div>
                </div>
                <div className="bg-white shadow-lg rounded-lg p-4">
                    <div className="flex items-center">
                        <FaCalendarAlt className="w-8 h-8 text-red-500 mr-4" />
                        <div>
                            <h2 className="text-lg font-semibold">Cancelled</h2>
                            <p className="text-gray-500">{stats.cancelledAppointments}</p>
                        </div>
                    </div>
                </div>
            </div>

            {/* Upcoming Appointments */}
            <div className="bg-white shadow-lg rounded-lg overflow-hidden mb-6">
                <h2 className="text-xl font-semibold p-4">Today&apos;s Upcoming Appointments</h2>
                {upcomingAppointments.length === 0 ? (
                    <p className="text-center text-gray-500 p-4">No appointments today.</p>
                ) : (
                    <table className="min-w-full leading-normal">
                        <thead>
                            <tr>
                                <th className="px-5 py-3 bg-gray-100 text-left text-xs font-semibold text-gray-600 uppercase tracking-wider">Student</th>
                                <th className="px-5 py-3 bg-gray-100 text-left text-xs font-semibold text-gray-600 uppercase tracking-wider">Counselor</th>
                                <th className="px-5 py-3 bg-gray-100 text-left text-xs font-semibold text-gray-600 uppercase tracking-wider">Date</th>
                                <th className="px-5 py-3 bg-gray-100 text-left text-xs font-semibold text-gray-600 uppercase tracking-wider">Status</th>
                                <th className="px-5 py-3 bg-gray-100 text-left text-xs font-semibold text-gray-600 uppercase tracking-wider">Actions</th>
                            </tr>
                        </thead>
                        <tbody>
                            {upcomingAppointments.map((appointment) => (
                                <tr key={appointment.appointmentId} className="hover:bg-gray-50 transition duration-300 ease-in-out">
                                    <td className="px-5 py-5 border-b border-gray-200">
                                        <div className="flex items-center">
                                            <img
                                                className="w-10 h-10 rounded-full object-cover"
                                                src={appointment.student.profilePicture || getAvatarUrl(appointment.student.name)}
                                                alt={appointment.student.name}
                                            />
                                            <div className="ml-3">
                                                <p className="text-gray-900 whitespace-no-wrap">{appointment.student.name}</p>
                                            </div>
                                        </div>
                                    </td>
                                    <td className="px-5 py-5 border-b border-gray-200">
                                        <div className="flex items-center">
                                            <img
                                                className="w-10 h-10 rounded-full object-cover"
                                                src={appointment.counselor.profilePicture || getAvatarUrl(appointment.counselor.name)}
                                                alt={appointment.counselor.name}
                                            />
                                            <div className="ml-3">
                                                <p className="text-gray-900 whitespace-no-wrap">{appointment.counselor.name}</p>
                                            </div>
                                        </div>
                                    </td>
                                    <td className="px-5 py-5 border-b border-gray-200">
                                        <p className="text-gray-900 whitespace-no-wrap">{moment(appointment.date).format('MMM DD, YYYY')}</p>
                                        <p className="text-gray-600 whitespace-no-wrap">{appointment.timeSlot}</p>
                                    </td>
                                    <td className="px-5 py-5 border-b border-gray-200">
                                        <span
                                            className={`px-3 py-1 font-semibold leading-tight rounded-full
                                                ${appointment.status === 'completed' ? 'bg-green-200 text-green-800' : ''}
                                                ${appointment.status === 'pending' ? 'bg-yellow-200 text-yellow-800' : ''}
                                                ${appointment.status === 'in-progress' ? 'bg-blue-200 text-blue-800' : ''}`}
                                        >
                                            {appointment.status}
                                        </span>
                                    </td>
                                    <td className="px-5 py-5 border-b border-gray-200">
                                        <button
                                            className="text-indigo-600 hover:text-indigo-900"
                                            onClick={() => openDialog(appointment)}
                                        >
                                            Details
                                        </button>
                                    </td>
                                </tr>
                            ))}
                        </tbody>
                    </table>
                )}
            </div>

            {/* All Appointments */}
            <div className="bg-white shadow-lg rounded-lg overflow-hidden">
                <h2 className="text-xl font-semibold p-4">All Appointments</h2>
                {appointments.length === 0 ? (
                    <p className="text-center text-gray-500 p-4">No appointments booked.</p>
                ) : (
                    <table className="min-w-full leading-normal">
                        <thead>
                            <tr>
                                <th className="px-5 py-3 bg-gray-100 text-left text-xs font-semibold text-gray-600 uppercase tracking-wider">Student</th>
                                <th className="px-5 py-3 bg-gray-100 text-left text-xs font-semibold text-gray-600 uppercase tracking-wider">Counselor</th>
                                <th className="px-5 py-3 bg-gray-100 text-left text-xs font-semibold text-gray-600 uppercase tracking-wider">Date</th>
                                <th className="px-5 py-3 bg-gray-100 text-left text-xs font-semibold text-gray-600 uppercase tracking-wider">Status</th>
                                <th className="px-5 py-3 bg-gray-100 text-left text-xs font-semibold text-gray-600 uppercase tracking-wider">Actions</th>
                            </tr>
                        </thead>
                        <tbody>
                            {appointments.map((appointment) => (
                                <tr key={appointment.appointmentId} className="hover:bg-gray-50 transition duration-300 ease-in-out">
                                    <td className="px-5 py-5 border-b border-gray-200">
                                        <div className="flex items-center">
                                            <img
                                                className="w-10 h-10 rounded-full object-cover"
                                                src={appointment.student.profilePicture || getAvatarUrl(appointment.student.name)}
                                                alt={appointment.student.name}
                                            />
                                            <div className="ml-3">
                                                <p className="text-gray-900 whitespace-no-wrap">{appointment.student.name}</p>
                                            </div>
                                        </div>
                                    </td>
                                    <td className="px-5 py-5 border-b border-gray-200">
                                        <div className="flex items-center">
                                            <img
                                                className="w-10 h-10 rounded-full object-cover"
                                                src={appointment.counselor.profilePicture || getAvatarUrl(appointment.counselor.name)}
                                                alt={appointment.counselor.name}
                                            />
                                            <div className="ml-3">
                                                <p className="text-gray-900 whitespace-no-wrap">{appointment.counselor.name}</p>
                                            </div>
                                        </div>
                                    </td>
                                    <td className="px-5 py-5 border-b border-gray-200">
                                        <p className="text-gray-900 whitespace-no-wrap">{moment(appointment.date).format('MMM DD, YYYY')}</p>
                                        <p className="text-gray-600 whitespace-no-wrap">{appointment.timeSlot}</p>
                                    </td>
                                    <td className="px-5 py-5 border-b border-gray-200">
                                        <span
                                            className={`px-3 py-1 font-semibold leading-tight rounded-full
                                                ${appointment.status === 'completed' ? 'bg-green-200 text-green-800' : ''}
                                                ${appointment.status === 'pending' ? 'bg-yellow-200 text-yellow-800' : ''}
                                                ${appointment.status === 'in-progress' ? 'bg-blue-200 text-blue-800' : ''}`}
                                        >
                                            {appointment.status}
                                        </span>
                                    </td>
                                    <td className="px-5 py-5 border-b border-gray-200">
                                        <button
                                            className="text-indigo-600 hover:text-indigo-900"
                                            onClick={() => openDialog(appointment)}
                                        >
                                            Details
                                        </button>
                                    </td>
                                </tr>
                            ))}
                        </tbody>
                    </table>
                )}
            </div>

            {/* Appointment Details Dialog */}
            <Transition appear show={isOpen} as={Fragment}>
                <Dialog as="div" className="fixed inset-0 z-10 overflow-y-auto" onClose={closeDialog}>
                    <div className="min-h-screen px-4 text-center">
                        <TransitionChild
                            as={Fragment}
                            enter="ease-out duration-300"
                            enterFrom="opacity-0"
                            enterTo="opacity-100"
                            leave="ease-in duration-200"
                            leaveFrom="opacity-100"
                            leaveTo="opacity-0"
                        >
                            <div className="fixed inset-0 bg-black opacity-30" />
                        </TransitionChild>

                        {/* This element is to trick the browser into centering the modal contents. */}
                        <span className="inline-block h-screen align-middle" aria-hidden="true">
                            &#8203;
                        </span>
                        <TransitionChild
                            as={Fragment}
                            enter="ease-out duration-300"
                            enterFrom="opacity-0 scale-95"
                            enterTo="opacity-100 scale-100"
                            leave="ease-in duration-200"
                            leaveFrom="opacity-100 scale-100"
                            leaveTo="opacity-0 scale-95"
                        >
                            <div className="inline-block w-full max-w-md p-6 my-8 overflow-hidden text-left align-middle transition-all transform bg-white shadow-xl rounded-2xl">
                                <DialogTitle as="h3" className="text-lg font-medium leading-6 text-gray-900">
                                    Appointment Details
                                </DialogTitle>
                                <div className="mt-2">
                                    {selectedAppointment && (
                                        <div>
                                            <p><strong>Student:</strong> {selectedAppointment.student.name}</p>
                                            <p><strong>Counselor:</strong> {selectedAppointment.counselor.name}</p>
                                            <p><strong>Date:</strong> {moment(selectedAppointment.date).format('MMM DD, YYYY')}</p>
                                            <p><strong>Time Slot:</strong> {selectedAppointment.timeSlot}</p>
                                            <p><strong>Room ID:</strong> {selectedAppointment.roomId}</p>
                                            <p><strong>Status:</strong> {selectedAppointment.status}</p>
                                        </div>
                                    )}
                                </div>

                                <div className="mt-4">
                                    <button
                                        type="button"
                                        className="inline-flex justify-center px-4 py-2 text-sm font-medium text-blue-900 bg-blue-100 border border-transparent rounded-md hover:bg-blue-200 focus:outline-none focus-visible:ring-2 focus-visible:ring-offset-2 focus-visible:ring-blue-500"
                                        onClick={closeDialog}
                                    >
                                        Close
                                    </button>
                                </div>
                            </div>
                        </TransitionChild>
                    </div>
                </Dialog>
            </Transition>
        </div>
    );
};

export default AppointmentManagement;