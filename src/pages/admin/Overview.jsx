import { useState, useEffect } from 'react';
import { motion } from 'framer-motion';
import { FaUsers, FaCalendarAlt, FaChartBar, FaBell, FaUserMd, FaClock, FaStar, FaExclamationTriangle } from 'react-icons/fa';
import { getDashboardCounts, getTodayUpcomingAppointmentsAdmin } from '../../axiosServices/reportApi';
import { ClipLoader } from 'react-spinners';

const DashboardOverview = () => {
  const [stats, setStats] = useState([]);
  const [recentActivities, setRecentActivities] = useState([]);
  const [upcomingAppointments, setUpcomingAppointments] = useState([]);
  const [loadingStats, setLoadingStats] = useState(true);
  const [loadingAppointments, setLoadingAppointments] = useState(true);

  useEffect(() => {
    const fetchDashboardCounts = async () => {
      try {
        const data = await getDashboardCounts();
        const overviewCounts = data.overviewCounts;
        setStats([
          { title: 'Total Users', value: overviewCounts.totalUsers, icon: FaUsers, color: 'bg-blue-500' },
          { title: 'Active Counselors', value: overviewCounts.activeCounselors, icon: FaUserMd, color: 'bg-green-500' },
          { title: 'Appointments Today', value: overviewCounts.todayAppointments, icon: FaCalendarAlt, color: 'bg-yellow-500' },
          { title: 'Active Sessions', value: overviewCounts.activeAppointments, icon: FaChartBar, color: 'bg-purple-500' },
          { title: 'Avg. Session Duration', value: `${overviewCounts.averageAppointmentDuration} min`, icon: FaClock, color: 'bg-indigo-500' },
          { title: 'User Satisfaction', value: `${overviewCounts.averageUserSatisfaction}/5`, icon: FaStar, color: 'bg-orange-500' },
          { title: 'Unresolved Issues', value: overviewCounts.unresolvedIssues, icon: FaExclamationTriangle, color: 'bg-red-500' },
          { title: 'New Notifications', value: 10, icon: FaBell, color: 'bg-pink-500' }, // Assuming static value for notifications
        ]);
        setLoadingStats(false);
      } catch (error) {
        console.error('Error fetching dashboard counts:', error);
        setLoadingStats(false);
      }
    };

    const fetchUpcomingAppointments = async () => {
      try {
        const data = await getTodayUpcomingAppointmentsAdmin();
        setUpcomingAppointments(data.appointments);
        setLoadingAppointments(false);
      } catch (error) {
        console.error('Error fetching upcoming appointments:', error);
        setLoadingAppointments(false);
      }
    };

    const fetchRecentActivities = () => {
      const sampleActivities = [
        { user: 'John Doe', action: 'Logged in', time: '2 minutes ago' },
        { user: 'Jane Smith', action: 'Scheduled an appointment', time: '10 minutes ago' },
        { user: 'Alice Johnson', action: 'Completed a session', time: '30 minutes ago' },
        { user: 'Bob Brown', action: 'Updated profile', time: '1 hour ago' },
      ];
      setRecentActivities(sampleActivities);
    };

    fetchDashboardCounts();
    fetchUpcomingAppointments();
    fetchRecentActivities();
  }, []);

  return (
    <motion.div
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      transition={{ duration: 0.5 }}
      className="p-6 space-y-6"
    >
      <h2 className="text-2xl font-bold mb-6">Dashboard Overview</h2>
      
      {/* Stats Grid */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
        {stats.map((stat, index) => (
          <motion.div
            key={index}
            whileHover={{ scale: 1.05 }}
            className={`p-6 rounded-lg shadow-md text-white ${stat.color}`}
          >
            {loadingStats ? (
              <div className="flex justify-center items-center h-full">
                <ClipLoader color="#ffffff" />
              </div>
            ) : (
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-sm font-medium">{stat.title}</p>
                  <p className="mt-1 text-3xl font-semibold">{stat.value}</p>
                </div>
                <stat.icon className="h-8 w-8" />
              </div>
            )}
          </motion.div>
        ))}
      </div>

      {/* Recent Activities and Upcoming Appointments */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        {/* Recent Activities */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.2 }}
          className="bg-white p-6 rounded-lg shadow-md"
        >
          <h3 className="text-xl font-semibold mb-4">Recent Activities</h3>
          <ul className="space-y-3">
            {recentActivities.length > 0 ? (
              recentActivities.map((activity, index) => (
                <li key={index} className="flex justify-between items-center">
                  <div>
                    <p className="font-medium">{activity.user}</p>
                    <p className="text-sm text-gray-500">{activity.action}</p>
                  </div>
                  <span className="text-xs text-gray-400">{activity.time}</span>
                </li>
              ))
            ) : (
              <p className="text-sm text-gray-500">No recent activities.</p>
            )}
          </ul>
        </motion.div>

        {/* Upcoming Appointments */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.3 }}
          className="bg-white p-6 rounded-lg shadow-md"
        >
          <h3 className="text-xl font-semibold mb-4">Upcoming Appointments</h3>
          <ul className="space-y-3">
            {loadingAppointments ? (
              <div className="flex justify-center items-center h-full">
                <ClipLoader color="#4A5568" />
              </div>
            ) : upcomingAppointments.length > 0 ? (
              upcomingAppointments.map((appointment, index) => (
                <li key={index} className="flex justify-between items-center">
                  <div>
                    <p className="font-medium">{appointment.student.name}</p>
                    <p className="text-sm text-gray-500">with {appointment.counselor.name}</p>
                  </div>
                  <span className="text-sm font-medium text-indigo-600">{appointment.timeSlot}</span>
                </li>
              ))
            ) : (
              <p className="text-sm text-gray-500">No appointments today.</p>
            )}
          </ul>
        </motion.div>
      </div>
    </motion.div>
  );
};

export default DashboardOverview;