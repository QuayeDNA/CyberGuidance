import { useState, useEffect } from 'react';
import { format, isSameDay, isSameMonth, startOfMonth, endOfMonth, eachDayOfInterval, isToday } from 'date-fns';
import { motion, AnimatePresence } from 'framer-motion';
import { FaChevronLeft, FaChevronRight, FaClock, FaUser, FaVideo } from 'react-icons/fa';
import { getAppointmentHistory } from '../../axiosServices/appointmentServices';
import { Dialog, DialogBackdrop, DialogTitle } from '@headlessui/react';

const MeetingCalendar = () => {
  const [currentDate, setCurrentDate] = useState(new Date());
  const [appointments, setAppointments] = useState([]);
  const [selectedDate, setSelectedDate] = useState(null);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [dayAppointments, setDayAppointments] = useState([]);

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

  const handleDayClick = (day) => {
    setSelectedDate(day);
    setDayAppointments(getDayAppointments(day));
    setIsModalOpen(true);
  };

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
        onClick={() => handleDayClick(day)}
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

    return (
      <Dialog open={isModalOpen} onClose={() => setIsModalOpen(false)} className="fixed inset-0 z-10 overflow-y-auto">
        <div className="flex items-center justify-center min-h-screen px-4">
          <DialogBackdrop className="fixed inset-0 bg-black opacity-30" />
          <div className="relative bg-white rounded-lg shadow-lg max-w-md mx-auto p-6">
            <DialogTitle className="text-lg font-semibold mb-3">{format(selectedDate, 'MMMM d, yyyy')}</DialogTitle>
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
            <button
              onClick={() => setIsModalOpen(false)}
              className="mt-4 px-4 py-2 bg-blue-500 text-white rounded-lg"
            >
              Close
            </button>
          </div>
        </div>
      </Dialog>
    );
  };

  return (
    <div className="max-w-2xl mx-auto">
      <div className="flex justify-between items-center mb-6">
        <h2 className="lg:text-2xl md:text-xl text-lg font-bold text-gray-800">
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
        {['Sun', 'Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat'].map((day, index) => (
          <div key={index} className="text-center font-semibold text-gray-600">
            <span className="hidden sm:inline">{day}</span>
            <span className="sm:hidden">{day.charAt(0)}</span>
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
  );
};

export default MeetingCalendar;