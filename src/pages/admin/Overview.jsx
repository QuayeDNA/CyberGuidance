
import { motion } from 'framer-motion';
import { FaUsers, FaCalendarAlt, FaChartBar, FaBell, FaUserMd, FaClock, FaStar, FaExclamationTriangle } from 'react-icons/fa';

const DashboardOverview = () => {
  const stats = [
    { title: 'Total Users', value: 1500, icon: FaUsers, color: 'text-blue-600' },
    { title: 'Active Counselors', value: 25, icon: FaUserMd, color: 'text-green-600' },
    { title: 'Appointments Today', value: 50, icon: FaCalendarAlt, color: 'text-yellow-600' },
    { title: 'Active Sessions', value: 15, icon: FaChartBar, color: 'text-purple-600' },
    { title: 'Avg. Session Duration', value: '45 min', icon: FaClock, color: 'text-indigo-600' },
    { title: 'User Satisfaction', value: '4.8/5', icon: FaStar, color: 'text-orange-600' },
    { title: 'Unresolved Issues', value: 5, icon: FaExclamationTriangle, color: 'text-red-600' },
    { title: 'New Notifications', value: 10, icon: FaBell, color: 'text-pink-600' },
  ];

  const recentActivities = [
    { user: 'John Doe', action: 'Completed a session', time: '10 minutes ago' },
    { user: 'Jane Smith', action: 'Booked an appointment', time: '1 hour ago' },
    { user: 'Dr. Williams', action: 'Updated availability', time: '2 hours ago' },
    { user: 'Alice Johnson', action: 'Left a review', time: '3 hours ago' },
  ];

  const upcomingAppointments = [
    { counselor: 'Dr. Brown', client: 'Mike Ross', time: '2:00 PM' },
    { counselor: 'Dr. Green', client: 'Rachel Zane', time: '3:30 PM' },
    { counselor: 'Dr. White', client: 'Harvey Specter', time: '5:00 PM' },
  ];

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
            {upcomingAppointments.map((appointment, index) => (
              <li key={index} className="flex justify-between items-center">
                <div>
                  <p className="font-medium">{appointment.counselor}</p>
                  <p className="text-sm text-gray-500">with {appointment.client}</p>
                </div>
                <span className="text-sm font-medium text-indigo-600">{appointment.time}</span>
              </li>
            ))}
          </ul>
        </motion.div>
      </div>
    </motion.div>
  );
};

export default DashboardOverview;