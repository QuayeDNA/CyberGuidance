import { useState } from 'react';
import { FaCalendarAlt, FaClock, FaUser, FaVideo, FaBuilding, FaComments } from 'react-icons/fa';

const SessionView = () => {
    const [activeTab, setActiveTab] = useState('upcoming');

    const handleTabClick = (tab) => {
        setActiveTab(tab);
    };

    // Dummy data for sessions (replace with actual data)
    const upcomingSessions = [
        {
            id: 1,
            date: '2024-07-01',
            time: '14:00',
            counselor: 'Dr. Smith',
            method: 'Video Call',
        },
        {
            id: 2,
            date: '2024-07-03',
            time: '10:30',
            counselor: 'Dr. Johnson',
            method: 'In-person',
        },
        {
            id: 3,
            date: '2024-07-05',
            time: '16:00',
            counselor: 'Dr. Brown',
            method: 'Messaging',
        },
    ];

    const pastSessions = [
        {
            id: 4,
            date: '2024-06-28',
            time: '15:00',
            counselor: 'Dr. White',
            method: 'Video Call',
        },
        {
            id: 5,
            date: '2024-06-25',
            time: '11:00',
            counselor: 'Dr. Green',
            method: 'In-person',
        },
        {
            id: 6,
            date: '2024-06-22',
            time: '14:30',
            counselor: 'Dr. Black',
            method: 'Messaging',
        },
    ];

    const getMethodIcon = (method) => {
        switch (method) {
            case 'Video Call':
                return <FaVideo className="text-blue-500" />;
            case 'In-person':
                return <FaBuilding className="text-green-500" />;
            case 'Messaging':
                return <FaComments className="text-purple-500" />;
            default:
                return null;
        }
    };

    return (
        <div className="p-2">
            {/* Tab Buttons */}
            <div className="flex justify-center mb-6">
                <button
                    className={`flex-1 py-3 px-6 rounded-l-full font-semibold transition-all duration-300 ${
                        activeTab === 'upcoming'
                            ? 'bg-indigo-600 text-white shadow-md'
                            : 'bg-white text-indigo-600 hover:bg-indigo-100'
                    }`}
                    onClick={() => handleTabClick('upcoming')}
                >
                    Upcoming
                </button>
                <button
                    className={`flex-1 py-3 px-6 rounded-r-full font-semibold transition-all duration-300 ${
                        activeTab === 'past'
                            ? 'bg-indigo-600 text-white shadow-md'
                            : 'bg-white text-indigo-600 hover:bg-indigo-100'
                    }`}
                    onClick={() => handleTabClick('past')}
                >
                    Past
                </button>
            </div>

            {/* Session Lists */}
            <div className="bg-white rounded-lg shadow-inner p-1">
                {activeTab === 'upcoming' ? (
                    <div className="max-h-[400px] overflow-y-auto">
                        {upcomingSessions.length > 0 ? (
                            <div className="space-y-4">
                                {upcomingSessions.map((session) => (
                                    <div key={session.id} className="bg-gradient-to-r from-indigo-50 to-purple-50 p-4 rounded-lg shadow-md hover:shadow-lg transition-shadow duration-300 flex justify-between items-center">
                                        <div className="flex items-center space-x-4">
                                            <div className="bg-white p-3 rounded-full shadow">
                                                <FaCalendarAlt className="text-indigo-600 text-xl" />
                                            </div>
                                            <div>
                                                <p className="text-lg font-semibold text-indigo-700">{session.date}</p>
                                                <div className="flex items-center space-x-2">
                                                    <FaClock className="text-indigo-400" />
                                                    <p className="text-indigo-600">{session.time}</p>
                                                </div>
                                            </div>
                                        </div>
                                        <div className="text-right">
                                            <div className="flex items-center justify-end space-x-2">
                                                <FaUser className="text-indigo-400" />
                                                <p className="text-lg font-semibold text-indigo-700">{session.counselor}</p>
                                            </div>
                                            <div className="flex items-center justify-end space-x-2 mt-1">
                                                {getMethodIcon(session.method)}
                                                <p className="text-indigo-600">{session.method}</p>
                                            </div>
                                        </div>
                                    </div>
                                ))}
                            </div>
                        ) : (
                            <div className="text-center py-10">
                                <img src="https://img.icons8.com/color/96/000000/mental-health.png" alt="No sessions" className="mx-auto mb-4" />
                                <p className="text-xl text-indigo-700 font-semibold">No upcoming sessions</p>
                                <p className="text-indigo-600 mt-2">Your journey to well-being starts with scheduling a session.</p>
                            </div>
                        )}
                    </div>
                ) : (
                    <div className="max-h-[400px] overflow-y-auto">
                        {pastSessions.length > 0 ? (
                            <div className="space-y-4">
                                {pastSessions.map((session) => (
                                    <div key={session.id} className="bg-gradient-to-r from-gray-50 to-indigo-50 p-4 rounded-lg shadow-md hover:shadow-lg transition-shadow duration-300 flex justify-between items-center">
                                        <div className="flex items-center space-x-4">
                                            <div className="bg-white p-3 rounded-full shadow">
                                                <FaCalendarAlt className="text-indigo-600 text-xl" />
                                            </div>
                                            <div>
                                                <p className="text-lg font-semibold text-indigo-700">{session.date}</p>
                                                <div className="flex items-center space-x-2">
                                                    <FaClock className="text-indigo-400" />
                                                    <p className="text-indigo-600">{session.time}</p>
                                                </div>
                                            </div>
                                        </div>
                                        <div className="text-right">
                                            <div className="flex items-center justify-end space-x-2">
                                                <FaUser className="text-indigo-400" />
                                                <p className="text-lg font-semibold text-indigo-700">{session.counselor}</p>
                                            </div>
                                            <div className="flex items-center justify-end space-x-2 mt-1">
                                                {getMethodIcon(session.method)}
                                                <p className="text-indigo-600">{session.method}</p>
                                            </div>
                                        </div>
                                    </div>
                                ))}
                            </div>
                        ) : (
                            <div className="text-center py-10">
                                <img src="https://img.icons8.com/color/96/000000/mental-health.png" alt="No sessions" className="mx-auto mb-4" />
                                <p className="text-xl text-indigo-700 font-semibold">No past sessions</p>
                                <p className="text-indigo-600 mt-2">Your counseling journey is yet to begin. Schedule your first session today!</p>
                            </div>
                        )}
                    </div>
                )}
            </div>
        </div>
    );
};

export default SessionView;