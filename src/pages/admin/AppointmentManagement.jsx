import { useState, useEffect } from 'react';
import { motion } from 'framer-motion';
import { FaCalendarAlt, FaClock, FaUser, FaMapMarkerAlt, FaPhoneAlt, FaVideo, FaComments, FaUserFriends, FaEdit, FaTrash, FaSearch } from 'react-icons/fa';

const AppointmentManagement = () => {
  const [appointments, setAppointments] = useState([]);
  const [filteredAppointments, setFilteredAppointments] = useState([]);
  const [searchTerm, setSearchTerm] = useState('');
  const [filterMode, setFilterMode] = useState('all');
  const [filterDate, setFilterDate] = useState('');
  const [stats, setStats] = useState({ total: 0, upcoming: 0, completed: 0, cancelled: 0 });

  useEffect(() => {
    // Simulating API call to fetch appointments
    const fetchAppointments = async () => {
      // In a real application, you would fetch this data from your backend
      const data = [
        { id: 1, student: 'Alice Johnson', counselor: 'Dr. Smith', date: '2024-07-30', time: '10:00 AM', venue: 'Room 101', mode: 'in-person', status: 'upcoming' },
        { id: 2, student: 'Bob Williams', counselor: 'Dr. Brown', date: '2024-07-31', time: '2:00 PM', venue: 'Zoom', mode: 'video', status: 'upcoming' },
        { id: 3, student: 'Charlie Davis', counselor: 'Dr. White', date: '2024-07-29', time: '11:30 AM', venue: 'Phone', mode: 'voice', status: 'completed' },
        { id: 4, student: 'Diana Miller', counselor: 'Dr. Green', date: '2024-08-01', time: '3:00 PM', venue: 'WhatsApp', mode: 'text', status: 'upcoming' },
      ];
      setAppointments(data);
      setFilteredAppointments(data);
      updateStats(data);
    };

    fetchAppointments();
  }, []);

  const updateStats = (data) => {
    const stats = data.reduce((acc, appointment) => {
      acc.total++;
      acc[appointment.status]++;
      return acc;
    }, { total: 0, upcoming: 0, completed: 0, cancelled: 0 });
    setStats(stats);
  };

  const handleSearch = (e) => {
    const term = e.target.value.toLowerCase();
    setSearchTerm(term);
    filterAppointments(term, filterMode, filterDate);
  };

  const handleFilterMode = (mode) => {
    setFilterMode(mode);
    filterAppointments(searchTerm, mode, filterDate);
  };

  const handleFilterDate = (e) => {
    const date = e.target.value;
    setFilterDate(date);
    filterAppointments(searchTerm, filterMode, date);
  };

  const filterAppointments = (term, mode, date) => {
    let filtered = appointments.filter(appointment => 
      (appointment.student.toLowerCase().includes(term) || 
       appointment.counselor.toLowerCase().includes(term)) &&
      (mode === 'all' || appointment.mode === mode) &&
      (date === '' || appointment.date === date)
    );
    setFilteredAppointments(filtered);
  };

  const handleEditAppointment = (id) => {
    // Implement edit functionality
    console.log('Edit appointment', id);
  };

  const handleCancelAppointment = (id) => {
    if (window.confirm('Are you sure you want to cancel this appointment?')) {
      const updatedAppointments = appointments.map(appointment => 
        appointment.id === id ? { ...appointment, status: 'cancelled' } : appointment
      );
      setAppointments(updatedAppointments);
      setFilteredAppointments(updatedAppointments);
      updateStats(updatedAppointments);
    }
  };

  const getModeIcon = (mode) => {
    switch (mode) {
      case 'in-person': return <FaUserFriends className="text-blue-500" />;
      case 'video': return <FaVideo className="text-green-500" />;
      case 'voice': return <FaPhoneAlt className="text-yellow-500" />;
      case 'text': return <FaComments className="text-purple-500" />;
      default: return null;
    }
  };

  return (
    <motion.div
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      transition={{ duration: 0.5 }}
      className="p-6"
    >
      <h2 className="text-2xl font-bold mb-6">Appointment Management</h2>
      
      {/* Stats Section */}
      <div className="grid grid-cols-1 md:grid-cols-4 gap-4 mb-6">
        {Object.entries(stats).map(([key, value]) => (
          <div key={key} className="bg-white p-4 rounded-lg shadow">
            <h3 className="text-lg font-semibold capitalize">{key}</h3>
            <p className="text-2xl font-bold">{value}</p>
          </div>
        ))}
      </div>

      {/* Filters */}
      <div className="mb-6 flex flex-wrap items-center gap-4">
        <div className="relative">
          <input
            type="text"
            placeholder="Search appointments..."
            className="pl-10 pr-4 py-2 border rounded-lg"
            value={searchTerm}
            onChange={handleSearch}
          />
          <FaSearch className="absolute left-3 top-3 text-gray-400" />
        </div>
        <select
          className="p-2 border rounded-lg"
          value={filterMode}
          onChange={(e) => handleFilterMode(e.target.value)}
        >
          <option value="all">All Modes</option>
          <option value="in-person">In-Person</option>
          <option value="video">Video Call</option>
          <option value="voice">Voice Call</option>
          <option value="text">Text Message</option>
        </select>
        <input
          type="date"
          className="p-2 border rounded-lg"
          value={filterDate}
          onChange={handleFilterDate}
        />
      </div>

      {/* Appointments Table */}
      <div className="bg-white shadow-md rounded-lg overflow-hidden">
        <table className="min-w-full divide-y divide-gray-200">
          <thead className="bg-gray-50">
            <tr>
              <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Student</th>
              <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Counselor</th>
              <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Date & Time</th>
              <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Venue</th>
              <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Mode</th>
              <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Status</th>
              <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Actions</th>
            </tr>
          </thead>
          <tbody className="bg-white divide-y divide-gray-200">
            {filteredAppointments.map((appointment) => (
              <tr key={appointment.id}>
                <td className="px-6 py-4 whitespace-nowrap">
                  <div className="flex items-center">
                    <FaUser className="text-gray-400 mr-2" />
                    {appointment.student}
                  </div>
                </td>
                <td className="px-6 py-4 whitespace-nowrap">
                  <div className="flex items-center">
                    <FaUser className="text-gray-400 mr-2" />
                    {appointment.counselor}
                  </div>
                </td>
                <td className="px-6 py-4 whitespace-nowrap">
                  <div className="flex items-center">
                    <FaCalendarAlt className="text-gray-400 mr-2" />
                    {appointment.date}
                    <FaClock className="text-gray-400 ml-4 mr-2" />
                    {appointment.time}
                  </div>
                </td>
                <td className="px-6 py-4 whitespace-nowrap">
                  <div className="flex items-center">
                    <FaMapMarkerAlt className="text-gray-400 mr-2" />
                    {appointment.venue}
                  </div>
                </td>
                <td className="px-6 py-4 whitespace-nowrap">
                  <div className="flex items-center">
                    {getModeIcon(appointment.mode)}
                    <span className="ml-2 capitalize">{appointment.mode}</span>
                  </div>
                </td>
                <td className="px-6 py-4 whitespace-nowrap">
                  <span className={`px-2 inline-flex text-xs leading-5 font-semibold rounded-full 
                    ${appointment.status === 'upcoming' ? 'bg-green-100 text-green-800' : 
                      appointment.status === 'completed' ? 'bg-blue-100 text-blue-800' : 
                      'bg-red-100 text-red-800'}`}>
                    {appointment.status}
                  </span>
                </td>
                <td className="px-6 py-4 whitespace-nowrap">
                  <button onClick={() => handleEditAppointment(appointment.id)} className="text-indigo-600 hover:text-indigo-900 mr-4">
                    <FaEdit />
                  </button>
                  <button onClick={() => handleCancelAppointment(appointment.id)} className="text-red-600 hover:text-red-900">
                    <FaTrash />
                  </button>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </motion.div>
  );
};

export default AppointmentManagement;