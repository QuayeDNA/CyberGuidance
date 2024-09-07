import { useEffect, useState } from 'react';
import PropTypes from 'prop-types';
import { getAppointmentHistory } from '../../axiosServices/appointmentServices';

const ChatList = ({ onSelectAppointment }) => {
  const [appointments, setAppointments] = useState([]);
  const [searchQuery, setSearchQuery] = useState('');

  useEffect(() => {
    const fetchAppointments = async () => {
      try {
        const appointmentHistory = await getAppointmentHistory();
        setAppointments(appointmentHistory);
      } catch (error) {
        console.error('Error fetching appointment history:', error);
      }
    };

    fetchAppointments();
  }, []);

  const filteredAppointments = appointments.filter(appointment =>
    appointment.counselor &&
    appointment.counselor.username &&
    appointment.counselor.username.toLowerCase().includes(searchQuery.toLowerCase())
  );

  return (
    <div className="w-full max-w-md p-4 bg-white shadow-md rounded-lg">
      <input
        type="text"
        value={searchQuery}
        onChange={(e) => setSearchQuery(e.target.value)}
        placeholder="Search..."
        className="w-full p-2 mb-4 border border-gray-300 rounded-lg"
      />
      <ul className="space-y-4">
        {filteredAppointments.map((appointment) => (
          <li
            key={appointment.id}
            className="flex items-center p-2 border border-gray-300 rounded-lg cursor-pointer hover:bg-gray-100"
            onClick={() => onSelectAppointment(appointment)}
          >
            <img
              src={appointment.counselor.profilePicture}
              alt={appointment.counselor.username}
              className="w-12 h-12 rounded-full mr-4"
            />
            <span className="font-medium">{appointment.counselor.username}</span>
          </li>
        ))}
      </ul>
    </div>
  );
};

ChatList.propTypes = {
  onSelectAppointment: PropTypes.func.isRequired,
};

export default ChatList;