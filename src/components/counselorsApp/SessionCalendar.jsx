import { useState, useEffect } from 'react';
import { format, isSameDay, isSameMonth, startOfMonth, endOfMonth, eachDayOfInterval, isToday } from 'date-fns';
import { motion, AnimatePresence } from 'framer-motion';
import { FaChevronLeft, FaChevronRight, FaClock, FaUser, FaVideo } from 'react-icons/fa';
import { getAppointmentHistory } from '../../axiosServices/appointmentServices';

const MeetingCalendar = () => {
  const [currentDate, setCurrentDate] = useState(new Date());
  const [appointments, setAppointments] = useState([]);
  const [selectedDate, setSelectedDate] = useState(null);

  useEffect(() => {
    const fetchAppointments = async () => {
      try {
        const response = await getAppointmentHistory();
        setAppointments(response.appointments || []); // Ensure appointments is always an array
      } catch (error) {
        console.error('Error fetching appointment history:', error);
        setAppointments([]); // Set appointments to an empty array on error
      }
    };
    fetchAppointments();
  }, []);

  const daysInMonth = eachDayOfInterval({
    start: startOfMonth(currentDate),
    end: endOfMonth(currentDate)
  });

  const nextMonth = () => setCurrentDate(date => new Date(date.getFullYear(), date.getMonth() + 1, 1));
  const prevMonth = () => setCurrentDate(date => new Date(date.getFullYear(), date.getMonth() - 1, 1));

  const getDayAppointments = (day) => appointments.filter(app => isSameDay(new Date(app.date), day));

  const renderCalendarDay = (day) => {
    const dayAppointments = getDayAppointments(day);
    const isSelected = selectedDate && isSameDay(day, selectedDate);

    return (
      <motion.div
        key={day.toString()}
        className={`
          p-2 border rounded-lg cursor-pointer transition-all
          ${isToday(day) ? 'bg-blue-100 border-blue-300' : 'hover:bg-gray-100'}
          ${isSelected ? 'ring-2 ring-blue-500' : ''}
          ${!isSameMonth(day, currentDate) ? 'opacity-50' : ''}
        `}
        onClick={() => setSelectedDate(day)}
        whileHover={{ scale: 1.05 }}
        whileTap={{ scale: 0.95 }}
      >
        <div className="text-center">
          <span className={`text-sm ${isToday(day) ? 'font-bold' : ''}`}>
            {format(day, 'd')}
          </span>
        </div>
        {dayAppointments.length > 0 && (
          <div className="mt-1 flex justify-center">
            <span className="w-2 h-2 bg-green-500 rounded-full"></span>
          </div>
        )}
      </motion.div>
    );
  };

  const renderAppointmentDetails = () => {
    if (!selectedDate) return null;

    const dayAppointments = getDayAppointments(selectedDate);

    return (
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        exit={{ opacity: 0, y: -20 }}
        className="mt-4 bg-white rounded-lg shadow-lg p-4"
      >
        <h3 className="text-lg font-semibold mb-3">{format(selectedDate, 'MMMM d, yyyy')}</h3>
        {dayAppointments.length === 0 ? (
          <p className="text-gray-500">No appointments scheduled for this day.</p>
        ) : (
          dayAppointments.map((app) => (
            <div key={app.id} className="mb-4 p-3 bg-gray-50 rounded-lg">
              <div className="flex items-center mb-2">
                <FaClock className="text-blue-500 mr-2" />
                <span className="font-medium">{app.timeSlot}</span>
              </div>
              <div className="flex items-center mb-2">
                <FaUser className="text-green-500 mr-2" />
                <span>{app.counselor.fullName}</span>
              </div>
              <div className="flex items-center mb-2">
                <FaVideo className="text-purple-500 mr-2" />
                <span>Room ID: {app.roomId}</span>
              </div>
              <p className="text-sm text-gray-600 mt-2">{app.reason}</p>
              <div className={`mt-2 inline-block px-2 py-1 rounded-full text-xs font-semibold
                ${app.status === 'pending' ? 'bg-yellow-100 text-yellow-800' : 
                  app.status === 'in-progress' ? 'bg-green-100 text-green-800' : 
                  'bg-gray-100 text-gray-800'}`}>
                {app.status}
              </div>
            </div>
          ))
        )}
      </motion.div>
    );
  };

  return (
    <div className="max-w-4xl mx-auto p-4">
      <div className="bg-white rounded-xl shadow-lg p-6">
        <div className="flex justify-between items-center mb-6">
          <h2 className="text-2xl font-bold text-gray-800">
            {format(currentDate, 'MMMM yyyy')}
          </h2>
          <div className="flex space-x-2">
            <button onClick={prevMonth} className="p-2 rounded-full hover:bg-gray-100">
              <FaChevronLeft className="text-gray-600" />
            </button>
            <button onClick={nextMonth} className="p-2 rounded-full hover:bg-gray-100">
              <FaChevronRight className="text-gray-600" />
            </button>
          </div>
        </div>
        <div className="grid grid-cols-7 gap-2 mb-4">
          {['Sun', 'Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat'].map(day => (
            <div key={day} className="text-center font-semibold text-gray-600">
              {day}
            </div>
          ))}
        </div>
        <div className="grid grid-cols-7 gap-2">
          {daysInMonth.map(renderCalendarDay)}
        </div>
        <AnimatePresence>
          {renderAppointmentDetails()}
        </AnimatePresence>
      </div>
    </div>
  );
};

export default MeetingCalendar;