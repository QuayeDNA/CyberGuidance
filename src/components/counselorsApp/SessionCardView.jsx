import { useState } from 'react';


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
            client: 'John Doe',
            method: 'Video Call',
        },
        // ... more sessions
    ];
    
    const pastSessions = [
        {
            id: 4,
            date: '2024-06-28',
            time: '15:00',
            client: 'Jane Smith',
            method: 'Video Call',
        },
        // ... more sessions
    ];

    return (
        <div>

            {/* Tab Buttons */}
            <div className="flex justify-center mb-4">

                <button
                    className={`flex-1 py-2 ${activeTab === 'upcoming' ? 'text-blue-500 border-b-2 border-blue-500 bg-gray-50' : 'text-gray-500'}`}
                    onClick={() => handleTabClick('upcoming')}
                >
                    Upcoming
                </button>
                <button
                    className={`flex-1 py-2 ${activeTab === 'past' ? 'text-blue-500 border-b-2 border-blue-500 bg-gray-50' : 'text-gray-500'}`}
                    onClick={() => handleTabClick('past')}
                >
                    Past
                </button>
            </div>

            {/* Session Lists */}
            <div className="overflow-hidden">
                {activeTab === 'upcoming' ? (
                    <div className="max-h-[260px] overflow-y-auto">
                        {upcomingSessions.length > 0 ? (
                            <div className="space-y-4">
                                {upcomingSessions.map((session) => (
                                    <div key={session.id} className="bg-white p-4 shadow-md rounded-lg flex justify-between items-center border border-gray-200">
                                        <div className=''>
                                            <p className="text-sm font-semibold text-gray-700">{session.date}</p>
                                            <p className="text-sm text-gray-600">{session.time}</p>
                                        </div>
                                        <div>
                                            <p className="text-sm font-semibold text-gray-700">{session.client}</p>
                                            <p className="text-sm text-gray-600">{session.method}</p>
                                        </div>
                                    </div>
                                ))}
                            </div>
                        ) : (
                            <p>No upcoming sessions at the moment.</p>
                        )}
                    </div>
                ) : (
                    <div className="max-h-[260px] overflow-y-auto">
                        {pastSessions.length > 0 ? (
                            <div className="space-y-4">
                                {pastSessions.map((session) => (
                                    <div key={session.id} className="bg-white p-4 shadow-md rounded-lg flex justify-between items-center
                                    border border-gray-200  ">
                                        <div>
                                            <p className="text-sm font-semibold text-gray-700">{session.date}</p>
                                            <p className="text-sm text-gray-600">{session.time}</p>
                                        </div>
                                        <div>
                                            <p className="text-sm font-semibold text-gray-700">{session.counselor}</p>
                                            <p className="text-sm text-gray-600">{session.method}</p>
                                        </div>
                                    </div>
                                ))}
                            </div>
                        ) : (
                            <p>No upcoming sessions at the moment.</p>
                        )}
                    </div>
                )}
            </div>
        </div>
    );
};

export default SessionView;