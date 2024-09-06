import { useState, useEffect } from 'react';
import { motion } from 'framer-motion';
import { FaUsers, FaCalendarAlt, FaChartBar, FaBell, FaUserMd, FaClock, FaStar, FaExclamationTriangle } from 'react-icons/fa';
import { getDashboardCounts, getTodayUpcomingAppointmentsAdmin } from '../../axiosServices/reportApi';

const DashboardOverview = () => {
  const [stats, setStats] = useState([]);
  const [recentActivities, setRecentActivities] = useState([]);
  const [upcomingAppointments, setUpcomingAppointments] = useState([]);

  useEffect(() => {
    const fetchDashboardCounts = async () => {
      try {
        const data = await getDashboardCounts();
        const overviewCounts = data.overviewCounts;
        setStats([
          { title: 'Total Users', value: overviewCounts.totalUsers, icon: FaUsers, color: 'text-blue-600' },
          { title: 'Active Counselors', value: overviewCounts.activeCounselors, icon: FaUserMd, color: 'text-green-600' },
          { title: 'Appointments Today', value: overviewCounts.todayAppointments, icon: FaCalendarAlt, color: 'text-yellow-600' },
          { title: 'Active Sessions', value: overviewCounts.activeAppointments, icon: FaChartBar, color: 'text-purple-600' },
          { title: 'Avg. Session Duration', value: `${overviewCounts.averageAppointmentDuration} min`, icon: FaClock, color: 'text-indigo-600' },
          { title: 'User Satisfaction', value: `${overviewCounts.averageUserSatisfaction}/5`, icon: FaStar, color: 'text-orange-600' },
          { title: 'Unresolved Issues', value: overviewCounts.unresolvedIssues, icon: FaExclamationTriangle, color: 'text-red-600' },
          { title: 'New Notifications', value: 10, icon: FaBell, color: 'text-pink-600' }, // Assuming static value for notifications
        ]);
      } catch (error) {
        console.error('Error fetching dashboard counts:', error);
      }
    };

    const fetchUpcomingAppointments = async () => {
      try {
        const data = await getTodayUpcomingAppointmentsAdmin();
        setUpcomingAppointments(data.appointments);
      } catch (error) {
        console.error('Error fetching upcoming appointments:', error);
      }
    };

    fetchDashboardCounts();
    fetchUpcomingAppointments();
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
            className="bg-white p-6 rounded-lg shadow-md"
          >
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm font-medium text-gray-500">{stat.title}</p>
                <p className="mt-1 text-3xl font-semibold text-gray-900">{stat.value}</p>
              </div>
              <stat.icon className={`h-8 w-8 ${stat.color}`} />
            </div>
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
            {recentActivities.map((activity, index) => (
              <li key={index} className="flex justify-between items-center">
                <div>
                  <p className="font-medium">{activity.user}</p>
                  <p className="text-sm text-gray-500">{activity.action}</p>
                </div>
                <span className="text-xs text-gray-400">{activity.time}</span>
              </li>
            ))}
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
            {upcomingAppointments.length > 0 ? (
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