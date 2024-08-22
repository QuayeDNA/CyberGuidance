import { useState, useEffect } from "react";
import axios from "axios";
import moment from "moment";

const SessionView = () => {
  const [activeTab, setActiveTab] = useState("upcoming");
  const [upcomingSessions, setUpcomingSessions] = useState([]);
  const [pastSessions, setPastSessions] = useState([]);

  useEffect(() => {
    const fetchAppointmentHistory = async () => {
      try {
        const response = await axios.get(
          "https://cyber-guidance.onrender.com/api/appointment-history",
          {
            headers: {
              Authorization: `Bearer ${localStorage.getItem("token")}`,
            },
          }
        );

        const { appointments } = response.data;

        const now = moment();
        const upcoming = [];
        const past = [];

        appointments.forEach((appointment) => {
          const appointmentDate = moment(appointment.date);
          if (appointmentDate.isAfter(now)) {
            upcoming.push({
              id: appointment.id,
              date: appointmentDate.format("YYYY-MM-DD"),
              timeSlot: appointment.timeSlot,
              counselor: appointment.counselor.fullName,
              reason: appointment.reason,
            });
          } else {
            past.push({
              id: appointment.id,
              date: appointmentDate.format("YYYY-MM-DD"),
              timeSlot: appointment.timeSlot,
              counselor: appointment.counselor.fullName,
              reason: appointment.reason,
            });
          }
        });

        setUpcomingSessions(upcoming);
        setPastSessions(past);
      } catch (error) {
        console.error("Error fetching appointment history:", error);
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
          className={`flex-1 py-2 ${
            activeTab === "upcoming"
              ? "text-blue-500 border-b-2 border-blue-500 bg-gray-50"
              : "text-gray-500"
          }`}
          onClick={() => handleTabClick("upcoming")}>
          Upcoming
        </button>
        <button
          className={`flex-1 py-2 ${
            activeTab === "past"
              ? "text-blue-500 border-b-2 border-blue-500 bg-gray-50"
              : "text-gray-500"
          }`}
          onClick={() => handleTabClick("past")}>
          Past
        </button>
      </div>

      {/* Session Lists */}
      <div className="overflow-hidden">
        {activeTab === "upcoming" ? (
          <div className="max-h-[260px] overflow-y-auto">
            {upcomingSessions.length > 0 ? (
              <div className="space-y-4">
                {upcomingSessions.map((session) => (
                  <div
                    key={session.id}
                    className="bg-white p-4 shadow-md rounded-lg flex justify-between items-center border border-gray-200">
                    <div className="">
                      <p className="text-sm font-semibold text-gray-700">
                        {session.date}
                      </p>
                      <p className="text-sm text-gray-600">
                        {session.timeSlot}
                      </p>
                    </div>
                    <div>
                      <p className="text-sm font-semibold text-gray-700">
                        {session.counselor}
                      </p>
                      <p className="text-sm text-gray-600">
                        {session.fullName}
                      </p>
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
                  <div
                    key={session.id}
                    className="bg-white p-4 shadow-md rounded-lg flex justify-between items-center border border-gray-200">
                    <div>
                      <p className="text-sm font-semibold text-gray-700">
                        {session.date}
                      </p>
                      <p className="text-sm text-gray-600">
                        {session.timeSlot}
                      </p>
                    </div>
                    <div>
                      <p className="text-sm font-semibold text-gray-700">
                        {session.counselor}
                      </p>
                      <p className="text-sm text-gray-600">
                        {session.fullName}
                      </p>
                    </div>
                  </div>
                ))}
              </div>
            ) : (
              <p>No past sessions at the moment.</p>
            )}
          </div>
        )}
      </div>
    </div>
  );
};

export default SessionView;
