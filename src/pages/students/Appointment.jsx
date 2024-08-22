import { useState, useEffect } from 'react';
import { useAuth } from '../../components/contexts/AuthContext';
import { Link } from 'react-router-dom';
import { FaSpinner, FaSearch, FaFilter, FaCalendarAlt } from 'react-icons/fa';
import moment from 'moment';
import PropTypes from 'prop-types';

const AppointmentCard = ({ appointment }) => (
  <div className="bg-white shadow-md rounded-lg p-4 flex items-start space-x-4 hover:shadow-lg transition-shadow duration-300">
    <img 
      src={appointment.counselor.avatarUrl || 'https://picsum.photos/200'} 
      alt={appointment.counselor.fullName} 
      className="w-16 h-16 rounded-full object-cover"
    />
    <div className="flex-grow">
      <h3 className="text-lg font-semibold text-gray-800">{appointment.counselor.fullName}</h3>
      <p className="text-sm text-gray-600">{moment(appointment.date).format('MMMM D, YYYY')}</p>
      <p className="text-sm text-gray-600">{moment(appointment.timeSlot, 'HH:mm').format('h:mm A')}</p>
      <p className="text-sm font-medium mt-2">Reason: {appointment.reason}</p>
      <span className={`mt-2 inline-block px-2 py-1 text-xs font-semibold rounded-full ${
        appointment.status === 'Completed' ? 'bg-green-100 text-green-800' :
        appointment.status === 'Cancelled' ? 'bg-red-100 text-red-800' :
        'bg-blue-100 text-blue-800'
      }`}>
        {appointment.status}
      </span>
    </div>
  </div>
);

AppointmentCard.propTypes = {
  appointment: PropTypes.object.isRequired,
};

const AppointmentHistory = () => {
  const { token } = useAuth();
  const [appointments, setAppointments] = useState([]);
  const [filteredAppointments, setFilteredAppointments] = useState([]);
  const [isLoading, setIsLoading] = useState(true);
  const [searchTerm, setSearchTerm] = useState('');
  const [statusFilter, setStatusFilter] = useState('All');

  useEffect(() => {
    const fetchAppointmentHistory = async () => {
      try {
        const response = await fetch('https://cyber-guidance.onrender.com/api/appointment-history', {
          headers: {
            'Authorization': `Bearer ${token}`,
          },
        });

        if (!response.ok) {
          throw new Error('Failed to fetch appointment history');
        }

        const data = await response.json();
        setAppointments(data.appointments);
        setFilteredAppointments(data.appointments);
        setIsLoading(false);
      } catch (error) {
        console.error('Error fetching appointment history:', error);
        setIsLoading(false);
      }
    };

    fetchAppointmentHistory();
  }, [token]);

  useEffect(() => {
    const filtered = appointments.filter(appointment => 
      (appointment.counselor.fullName.toLowerCase().includes(searchTerm.toLowerCase()) ||
       appointment.reason.toLowerCase().includes(searchTerm.toLowerCase())) &&
      (statusFilter === 'All' || appointment.status === statusFilter)
    );
    setFilteredAppointments(filtered);
  }, [searchTerm, statusFilter, appointments]);

  if (isLoading) {
    return (
      <div className="flex justify-center items-center h-screen">
        <FaSpinner className="animate-spin h-8 w-8 text-blue-500" />
        <p className="ml-2">Loading appointments...</p>
      </div>
    );
  }

  if (appointments.length === 0) {
    return (
      <div className="flex flex-col items-center justify-center h-screen">
        <FaCalendarAlt className="text-6xl text-gray-400 mb-4" />
        <h2 className="text-2xl font-semibold text-gray-700 mb-2">No Appointments Yet</h2>
        <p className="text-gray-600 mb-4">You haven&apos;t booked any appointments.</p>
        <Link to="/student/counselors" className="bg-blue-500 text-white px-6 py-2 rounded-full hover:bg-blue-600 transition-colors duration-300">
          Book an Appointment
        </Link>
      </div>
    );
  }

  return (
    <div className="max-w-4xl mx-auto p-4 md:p-6 lg:p-8">
      <h1 className="text-3xl font-bold mb-6 text-gray-800">Appointment History</h1>

      <div className="mb-6 flex flex-col md:flex-row md:items-center md:space-x-4">
        <div className="relative flex-grow mb-4 md:mb-0">
          <input
            type="text"
            placeholder="Search appointments..."
            className="w-full pl-10 pr-4 py-2 border rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
          />
          <FaSearch className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400" />
        </div>
        <div className="relative">
          <select
            className="appearance-none bg-white border rounded-lg pl-10 pr-8 py-2 focus:outline-none focus:ring-2 focus:ring-blue-500"
            value={statusFilter}
            onChange={(e) => setStatusFilter(e.target.value)}
          >
            <option value="All">All Statuses</option>
            <option value="Scheduled">Scheduled</option>
            <option value="Completed">Completed</option>
            <option value="Cancelled">Cancelled</option>
          </select>
          <FaFilter className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400" />
        </div>
      </div>

      <div className="space-y-4">
        {filteredAppointments.map((appointment) => (
          <AppointmentCard key={appointment.id} appointment={appointment} />
        ))}
      </div>
    </div>
  );
};

export default AppointmentHistory;