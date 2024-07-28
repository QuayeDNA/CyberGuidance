import { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { format } from 'date-fns';
import { FaCalendar, FaClock, FaMapMarkerAlt, FaVideo, FaSearch, FaFilter, FaArrowLeft } from 'react-icons/fa';


const CounselorSessions = () => {
  const [clients, setClients] = useState([]);
  const [filter, setFilter] = useState('all');
  const [searchTerm, setSearchTerm] = useState('');
  const [currentPage, setCurrentPage] = useState(1);
  const [selectedClient, setSelectedClient] = useState(null);
  const [selectedSession, setSelectedSession] = useState(null);
  const [sessionNotes, setSessionNotes] = useState('');
  const clientsPerPage = 10;

  useEffect(() => {
    fetchClients();
  }, []);

  const fetchClients = async () => {
    try {
      // Simulating an API call
      const response = await new Promise(resolve =>
        setTimeout(() => resolve([
          {
            id: 1,
            name: 'John Doe',
            sessions: [
              { id: 1, date: new Date(2023, 6, 25, 14, 30), status: 'upcoming', notes: '', location: 'Office', method: 'in-person' },
              { id: 2, date: new Date(2023, 6, 18, 10, 0), status: 'completed', notes: 'Discussed career goals and potential paths.', location: 'Video Call', method: 'online' },
            ]
          },
          {
            id: 2,
            name: 'Jane Smith',
            sessions: [
              { id: 3, date: new Date(2023, 6, 26, 11, 15), status: 'completed', notes: '', location: 'Coffee Shop', method: 'in-person' },
              { id: 4, date: new Date(2023, 6, 19, 15, 45), status: 'completed', notes: 'Worked on stress management techniques.', location: 'Office', method: 'in-person' },
            ]
          },
          // Add more clients as needed
        ]), 1000)
      );
      setClients(response);
    } catch (error) {
      console.error('Error fetching clients:', error);
      // Here you could set an error state and display an error message to the user
    }
  };

  const filteredClients = clients.filter(client =>
    client.name.toLowerCase().includes(searchTerm.toLowerCase()) &&
    (filter === 'all' || client.sessions.some(session => session.status === filter))
  );

  const indexOfLastClient = currentPage * clientsPerPage;
  const indexOfFirstClient = indexOfLastClient - clientsPerPage;
  const currentClients = filteredClients.slice(indexOfFirstClient, indexOfLastClient);

  const paginate = (pageNumber) => setCurrentPage(pageNumber);

  const handleViewClientSessions = (client) => {
    setSelectedClient(client);
  };

  const handleViewSessionDetails = (session) => {
    setSelectedSession(session);
    setSessionNotes(session.notes);
  };

  const handleSaveSessionNotes = () => {
    if (selectedSession) {
      const updatedClients = clients.map(client =>
        client.id === selectedClient.id
          ? {
              ...client,
              sessions: client.sessions.map(session =>
                session.id === selectedSession.id
                  ? { ...session, notes: sessionNotes }
                  : session
              )
            }
          : client
      );
      setClients(updatedClients);
      setSelectedSession(null);
    }
  };

  const handleUpdateSession = (updatedSession) => {
    const updatedClients = clients.map(client =>
      client.id === selectedClient.id
        ? {
            ...client,
            sessions: client.sessions.map(session =>
              session.id === updatedSession.id ? updatedSession : session
            )
          }
        : client
    );
    setClients(updatedClients);
    setSelectedSession(updatedSession);
  };

  return (
    <div className="p-6 bg-gray-100 min-h-screen">
      <h1 className="text-3xl font-bold mb-6 text-gray-800">My Clients</h1>
      
      {!selectedClient && (
        <>
          <div className="flex flex-col md:flex-row justify-between mb-6">
            <div className="flex items-center mb-4 md:mb-0">
              <FaFilter className="text-gray-600 mr-2 text-md" />
              <select 
                value={filter} 
                onChange={(e) => setFilter(e.target.value)}
                className="bg-white border border-gray-300 rounded-md py-2 px-4 focus:outline-none focus:ring-2 focus:ring-blue-500"
              >
                <option value="all">All</option>
                <option value="upcoming">Upcoming</option>
                <option value="completed">Completed</option>
              </select>
            </div>
            <div className="relative">
              <FaSearch className="absolute left-3 top-3 text-gray-400" />
              <input
                type="text"
                placeholder="Search by client name"
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
                className="bg-white border border-gray-300 rounded-md py-2 pl-10 pr-4 focus:outline-none focus:ring-2 focus:ring-blue-500 w-full md:w-64"
              />
            </div>
          </div>

          {currentClients.length === 0 ? (
            <div className="bg-white rounded-lg shadow-md p-6 text-center">
              <p className="text-xl text-gray-600">No clients found. Start adding new clients to see them here!</p>
            </div>
          ) : (
            <AnimatePresence>
              {currentClients.map(client => (
                <motion.div
                  key={client.id}
                  initial={{ opacity: 0, y: 20 }}
                  animate={{ opacity: 1, y: 0 }}
                  exit={{ opacity: 0, y: -20 }}
                  transition={{ duration: 0.3 }}
                  className="bg-white rounded-lg shadow-md p-6 mb-4"
                >
                  <div className="flex justify-between items-center mb-4">
                    <h2 className="text-xl font-semibold text-gray-800">{client.name}</h2>
                    <span className="text-sm text-gray-600">{client.sessions.length} sessions</span>
                  </div>
                  <button
                    onClick={() => handleViewClientSessions(client)}
                    className="bg-blue-500 hover:bg-blue-600 text-white font-medium py-2 px-4 rounded-md transition duration-300 ease-in-out"
                  >
                    View Sessions
                  </button>
                </motion.div>
              ))}
            </AnimatePresence>
          )}

          <div className="flex justify-center mt-6">
            {Array.from({ length: Math.ceil(filteredClients.length / clientsPerPage) }).map((_, index) => (
              <button
                key={index}
                onClick={() => paginate(index + 1)}
                className={`mx-1 px-3 py-1 rounded-md ${
                  currentPage === index + 1
                    ? 'bg-blue-500 text-white'
                    : 'bg-gray-200 text-gray-700 hover:bg-gray-300'
                }`}
              >
                {index + 1}
              </button>
            ))}
          </div>
        </>
      )}

      {selectedClient && !selectedSession && (
        <div className="bg-white rounded-lg shadow-md p-6">
          <div className="flex items-center mb-6">
            <button
              onClick={() => setSelectedClient(null)}
              className="mr-4 text-blue-500 hover:text-blue-600"
            >
              <FaArrowLeft size={24} />
            </button>
            <h2 className="text-2xl font-bold">{selectedClient.name}&apos;s Sessions</h2>
          </div>
          {selectedClient.sessions.length === 0 ? (
            <p className="text-xl text-gray-600 text-center">No sessions found for this client.</p>
          ) : (
            <div className="space-y-4">
              {selectedClient.sessions.map(session => (
                <div
                  key={session.id}
                  className={`border-l-4 ${
                    session.status === 'upcoming' ? 'border-blue-500' : 'border-green-500'
                  } bg-white rounded-lg shadow p-4`}
                >
                  <div className="flex justify-between items-center mb-2">
                    <span className="text-lg font-semibold">{format(session.date, 'MMMM d, yyyy')}</span>
                    <span className={`px-3 py-1 rounded-full text-sm font-medium ${
                      session.status === 'upcoming' ? 'bg-blue-100 text-blue-800' : 'bg-green-100 text-green-800'
                    }`}>
                      {session.status}
                    </span>
                  </div>
                  <div className="grid grid-cols-2 gap-2 mb-2">
                    <div className="flex items-center">
                      <FaClock className="text-gray-500 mr-2" />
                      <span>{format(session.date, 'h:mm a')}</span>
                    </div>
                    <div className="flex items-center">
                      <FaMapMarkerAlt className="text-gray-500 mr-2" />
                      <span>{session.location}</span>
                    </div>
                    <div className="flex items-center">
                      <FaVideo className="text-gray-500 mr-2" />
                      <span>{session.method}</span>
                    </div>
                  </div>
                  <button
                    onClick={() => handleViewSessionDetails(session)}
                    className="bg-blue-500 hover:bg-blue-600 text-white font-medium py-1 px-3 rounded-md transition duration-300 ease-in-out text-sm"
                  >
                    View Details
                  </button>
                </div>
              ))}
            </div>
          )}
        </div>
      )}

      <AnimatePresence>
        {selectedSession && (
          <motion.div
            initial={{ opacity: 0, scale: 0.9 }}
            animate={{ opacity: 1, scale: 1 }}
            exit={{ opacity: 0, scale: 0.9 }}
            transition={{ duration: 0.3 }}
            className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center p-4"
          >
            <div className="bg-white rounded-lg shadow-xl p-6 w-full max-w-2xl">
              <h2 className="text-2xl font-bold mb-4">Session Details: {selectedClient.name}</h2>
              <div className="grid grid-cols-2 gap-4 mb-6">
                <div className="flex items-center">
                  <FaCalendar className="text-gray-500 mr-2" />
                  <input
                    type="date"
                    value={format(selectedSession.date, 'yyyy-MM-dd')}
                    onChange={(e) => handleUpdateSession({...selectedSession, date: new Date(e.target.value)})}
                    className="border border-gray-300 rounded-md p-2"
                  />
                </div>
                <div className="flex items-center">
                  <FaClock className="text-gray-500 mr-2" />
                  <input
                    type="time"
                    value={format(selectedSession.date, 'HH:mm')}
                    onChange={(e) => {
                      const [hours, minutes] = e.target.value.split(':');
                      const newDate = new Date(selectedSession.date);
                      newDate.setHours(hours);
                      newDate.setMinutes(minutes);
                      handleUpdateSession({...selectedSession, date: newDate});
                    }}
                    className="border border-gray-300 rounded-md p-2"
                  />
                </div>
                <div className="flex items-center">
                  <FaMapMarkerAlt className="text-gray-500 mr-2" />
                  <input
                    type="text"
                    value={selectedSession.location}
                    onChange={(e) => handleUpdateSession({...selectedSession, location: e.target.value})}
                    placeholder="Location"
                    className="border border-gray-300 rounded-md p-2"
                  />
                </div>
                <div className="flex items-center">
                  <FaVideo className="text-gray-500 mr-2" />
                  <select
                    value={selectedSession.method}
                    onChange={(e) => handleUpdateSession({...selectedSession, method: e.target.value})}
                    className="border border-gray-300 rounded-md p-2"
                  >
                    <option value="in-person">In-person</option>
                    <option value="online">Online</option>
                  </select>
                </div>
              </div>
              <h3 className="text-xl font-semibold mb-2">Session Notes</h3>
              <textarea
                value={sessionNotes}
                onChange={(e) => setSessionNotes(e.target.value)}
                placeholder="Write your session notes here..."
                className="w-full h-32 border border-gray-300 rounded-md p-2 mb-4"
              />
              <div className="flex justify-end space-x-4">
                <button
                  onClick={handleSaveSessionNotes}
                  className="bg-green-500 hover:bg-green-600 text-white font-medium py-2 px-4 rounded-md transition duration-300 ease-in-out"
                >
                  Save Notes
                </button>
                <button
                  onClick={() => setSelectedSession(null)}
                  className="bg-gray-300 hover:bg-gray-400 text-gray-800 font-medium py-2 px-4 rounded-md transition duration-300 ease-in-out"
                >
                  Close
                </button>
              </div>
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
};

export default CounselorSessions;