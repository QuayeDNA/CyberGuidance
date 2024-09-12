import { useState, useEffect } from 'react';
import Calendar from 'react-calendar';
import 'react-calendar/dist/Calendar.css';
import { isSameDay, format } from 'date-fns';
import { FaClock, FaInfoCircle } from 'react-icons/fa';
import { getAppointmentHistory } from '../../axiosServices/appointmentServices'; // Adjust the import path as needed

const MeetingCalendar = () => {
    const [selectedDate, setSelectedDate] = useState(new Date());
    const [showModal, setShowModal] = useState(false);
    const [modalContent, setModalContent] = useState({ date: null, details: '' });
    const [appointments, setAppointments] = useState([]);

    useEffect(() => {
        const fetchAppointments = async () => {
            try {
                const data = await getAppointmentHistory();
                setAppointments(data);
            } catch (error) {
                console.error('Error fetching appointment history:', error);
            }
        };

        fetchAppointments();
    }, []);

    const tileClassName = ({ date }) => {
        return appointments.some(appointment => isSameDay(new Date(appointment.date), date)) 
            ? 'bg-indigo-100 text-indigo-800 hover:bg-indigo-200 cursor-pointer rounded-full' 
            : 'hover:bg-gray-100 rounded-full';
    };

    const getMeetingDetails = (date) => {
        return appointments.filter(appointment => isSameDay(new Date(appointment.date), date));
    };

    const handleDateClick = (date) => {
        setSelectedDate(date);
        const meetings = getMeetingDetails(date);
        setModalContent({ date, meetings });
        setShowModal(true);
    };

    return (
        <div className="max-w-full overflow-hidden sm:max-w-screen-md mx-auto p-2">
            <div className="overflow-hidden rounded-lg">
                <Calendar
                    className="w-full bg-white rounded-lg border-none text-gray-600"
                    onChange={setSelectedDate}
                    value={selectedDate}
                    tileClassName={tileClassName}
                    onClickDay={handleDateClick}
                    aria-label="Meeting Calendar"
                />
            </div>

            {showModal && (
                <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
                    <div className="bg-white rounded-lg p-6 max-w-sm w-full">
                        <h3 className="text-xl font-semibold text-indigo-700 mb-4">
                            {format(modalContent.date, 'MMMM d, yyyy')}
                        </h3>
                        {modalContent.meetings.length > 0 ? (
                            <ul className="space-y-3">
                                {modalContent.meetings.map((meeting, index) => (
                                    <li key={index} className="flex items-start space-x-3 bg-indigo-50 p-3 rounded-lg">
                                        <FaClock className="text-indigo-500 mt-1" />
                                        <div>
                                            <p className="font-medium text-indigo-700">{meeting.reason}</p>
                                            <p className="text-sm text-indigo-500">{meeting.timeSlot}</p>
                                        </div>
                                    </li>
                                ))}
                            </ul>
                        ) : (
                            <div className="flex items-center space-x-3 bg-gray-50 p-3 rounded-lg">
                                <FaInfoCircle className="text-gray-400" />
                                <p className="text-gray-500">No meetings scheduled for this day.</p>
                            </div>
                        )}
                        <button 
                            onClick={() => setShowModal(false)}
                            className="mt-4 w-full bg-indigo-600 text-white py-2 rounded-lg hover:bg-indigo-700 transition duration-300"
                        >
                            Close
                        </button>
                    </div>
                </div>
            )}
        </div>
    );
};

export default MeetingCalendar;