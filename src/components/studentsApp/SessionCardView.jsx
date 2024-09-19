import { useState, useEffect } from 'react';
import axios from 'axios';
import moment from 'moment';
import { FaCalendarAlt, FaClock, FaHistory } from 'react-icons/fa';
import { Tooltip } from 'react-tooltip';

const truncateText = (text, wordLimit) => {
  const words = text.split(' ');
  if (words.length > wordLimit) {
    return words.slice(0, wordLimit).join(' ') + '...';
  }
  return text;
};

const SessionView = () => {
  const [activeTab, setActiveTab] = useState('upcoming');
  const [upcomingSessions, setUpcomingSessions] = useState([]);
  const [ongoingSessions, setOngoingSessions] = useState([]);
  const [pastSessions, setPastSessions] = useState([]);
  const [loading, setLoading] = useState(true); // Loading state

  useEffect(() => {
    const fetchAppointmentHistory = async () => {
      setLoading(true); // Start loading
      try {
        const response = await axios.get('https://cyber-guidance.onrender.com/api/appointment-history', {
          headers: {
            Authorization: `Bearer ${localStorage.getItem('token')}`,
          },
        });

        const { appointments } = response.data;

        const now = moment();
        const upcoming = [];
        const ongoing = [];
        const past = [];

        appointments.forEach((appointment) => {
          const appointmentDate = moment(appointment.date);
          const appointmentEndTime = moment(appointment.endTime);

          if (appointmentDate.isAfter(now)) {
            upcoming.push({
              id: appointment.id,
              date: appointmentDate.format('YYYY-MM-DD'),
              timeSlot: appointment.timeSlot,
              client: appointment.counselor.fullName,
              reason: appointment.reason,
            });
          } else if (appointmentDate.isBefore(now) && appointmentEndTime.isAfter(now)) {
            ongoing.push({
              id: appointment.id,
              date: appointmentDate.format('YYYY-MM-DD'),
              timeSlot: appointment.timeSlot,
              client: appointment.counselor.fullName,
              reason: appointment.reason,
            });
          } else {
            past.push({
              id: appointment.id,
              date: appointmentDate.format('YYYY-MM-DD'),
              timeSlot: appointment.timeSlot,
              client: appointment.counselor.fullName,
              reason: appointment.reason,
            });
          }
        });

        setUpcomingSessions(upcoming);
        setOngoingSessions(ongoing);
        setPastSessions(past);
      } catch (error) {
        console.error('Error fetching appointment history:', error);
      } finally {
        setLoading(false); // End loading
      }
    };

    fetchAppointmentHistory();
  }, []);

  const handleTabClick = (tab) => {
    setActiveTab(tab);
  };

  return (
    <div>
      {/* Tab Buttons */}
      <div className="flex justify-center mb-4">
        <button
          className={`flex-1 py-2 ${activeTab === 'upcoming' ? 'text-blue-500 border-b-2 border-blue-500 bg-gray-50' : 'text-gray-500'}`}
          onClick={() => handleTabClick('upcoming')}
          data-tip="Upcoming"
        >
          <span className="hidden sm:inline">Upcoming</span>
          <FaCalendarAlt className="sm:hidden mx-auto" />
        </button>
        <button
          className={`flex-1 py-2 ${activeTab === 'ongoing' ? 'text-blue-500 border-b-2 border-blue-500 bg-gray-50' : 'text-gray-500'}`}
          onClick={() => handleTabClick('ongoing')}
          data-tip="Ongoing"
        >
          <span className="hidden sm:inline">Ongoing</span>
          <FaClock className="sm:hidden mx-auto" />
        </button>
        <button
          className={`flex-1 py-2 ${activeTab === 'past' ? 'text-blue-500 border-b-2 border-blue-500 bg-gray-50' : 'text-gray-500'}`}
          onClick={() => handleTabClick('past')}
          data-tip="Past"
        >
          <span className="hidden sm:inline">Past</span>
          <FaHistory className="sm:hidden mx-auto" />
        </button>
        <Tooltip place="top" type="dark" effect="solid" />
      </div>

      {/* Session Lists */}
      <div className="overflow-hidden">
        {loading ? (
          <div className="flex justify-center items-center h-64">
            <p>Loading...</p>
          </div>
        ) : (
          <>
            {activeTab === 'upcoming' && (
              <div className="max-h-[260px] overflow-y-auto">
                {upcomingSessions.length > 0 ? (
                  <div className="space-y-4">
                    {upcomingSessions.map((session) => (
                      <div key={session.id} className="bg-white p-4 shadow-md rounded-lg flex justify-between items-center border border-gray-200">
                        <div>
                          <p className="text-sm font-semibold text-gray-700">{session.date}</p>
                          <p className="text-sm text-gray-600">{session.timeSlot}</p>
                        </div>
                        <div className='text-right'>
                          <p className="text-sm font-semibold text-gray-700">{session.client}</p>
                          <p className="text-sm text-gray-600">{truncateText(session.reason, 10)}</p>
                        </div>
                      </div>
                    ))}
                  </div>
                ) : (
                  <p>No upcoming sessions at the moment.</p>
                )}
              </div>
            )}

            {activeTab === 'ongoing' && (
              <div className="max-h-[260px] overflow-y-auto">
                {ongoingSessions.length > 0 ? (
                  <div className="space-y-4">
                    {ongoingSessions.map((session) => (
                      <div key={session.id} className="bg-white p-4 shadow-md rounded-lg flex justify-between items-center border border-gray-200">
                        <div>
                          <p className="text-sm font-semibold text-gray-700">{session.date}</p>
                          <p className="text-sm text-gray-600">{session.timeSlot}</p>
                        </div>
                        <div className='text-right'>
                          <p className="text-sm font-semibold text-gray-700">{session.client}</p>
                          <p className="text-sm text-gray-600">{truncateText(session.reason, 10)}</p>
                        </div>
                      </div>
                    ))}
                  </div>
                ) : (
                  <p>No ongoing sessions at the moment.</p>
                )}
              </div>
            )}

            {activeTab === 'past' && (
              <div className="max-h-[260px] overflow-y-auto">
                {pastSessions.length > 0 ? (
                  <div className="space-y-4">
                    {pastSessions.map((session) => (
                      <div key={session.id} className="bg-white p-4 shadow-md rounded-lg flex justify-between items-center border border-gray-200">
                        <div>
                          <p className="text-sm font-semibold text-gray-700">{session.date}</p>
                          <p className="text-sm text-gray-600">{session.timeSlot}</p>
                        </div>
                        <div className='text-right'>
                          <p className="text-sm font-semibold text-gray-700">{session.client}</p>
                          <p className="text-sm text-gray-600">{truncateText(session.reason, 10)}</p>
                        </div>
                      </div>
                    ))}
                  </div>
                ) : (
                  <p>No past sessions at the moment.</p>
                )}
              </div>
            )}
          </>
        )}
      </div>
    </div>
  );
};

export default SessionView;