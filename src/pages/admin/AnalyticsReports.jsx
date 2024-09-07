import { useState, useEffect } from 'react';
import { motion } from 'framer-motion';
import { FaUsers, FaUserGraduate, FaUserTie, FaCalendarCheck, FaClock, FaSmile, FaExclamationTriangle, FaFileAlt, FaDownload, FaPrint, FaTimes } from 'react-icons/fa';
import {
  BarChart, Bar, PieChart, Pie, Cell,
  XAxis, YAxis, CartesianGrid, Tooltip, Legend, ResponsiveContainer
} from 'recharts';
import { getDashboardCounts } from '../../axiosServices/reportApi';
import PropTypes from 'prop-types';

const AnalyticsReports = () => {
  const [overviewCounts, setOverviewCounts] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [generatingReport, setGeneratingReport] = useState(false);
  const [showReportCard, setShowReportCard] = useState(false);

  useEffect(() => {
    const fetchData = async () => {
      try {
        const response = await getDashboardCounts();
        setOverviewCounts(response.overviewCounts);
        setLoading(false);
      } catch (err) {
        setError('Failed to fetch dashboard data');
        setLoading(false);
      }
    };

    fetchData();
  }, []);

  const handleGenerateReport = () => {
    setGeneratingReport(true);
    // Simulate report generation
    setTimeout(() => {
      setGeneratingReport(false);
      setShowReportCard(true);
    }, 2000);
  };

  const handleDownloadPDF = () => {
    // Implement PDF download logic here
    alert('Downloading PDF...');
  };

  const handlePrint = () => {
    window.print();
  };

  if (loading) return <div className='mx-auto'>Loading...</div>;
  if (error) return <div>{error}</div>;

  const userTypeData = [
    { name: 'Students', value: overviewCounts.totalStudents },
    { name: 'Counselors', value: overviewCounts.totalCounselors },
  ];

  const appointmentData = [
    { name: 'Today\'s Appointments', value: overviewCounts.todayAppointments },
    { name: 'Active Appointments', value: overviewCounts.activeAppointments },
  ];

  const COLORS = ['#0088FE', '#00C49F', '#FFBB28', '#FF8042'];

  return (
    <motion.div
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      transition={{ duration: 0.5 }}
      className="p-6"
    >
      <h2 className="text-2xl font-bold mb-6">Analytics and Reports</h2>

      <div className="bg-white p-6 rounded-lg shadow-md mb-6">
        <h3 className="text-lg font-semibold mb-4 flex items-center">
          <FaFileAlt className="mr-2 text-indigo-600" />
          Generate Report
        </h3>
        <button
          onClick={handleGenerateReport}
          disabled={generatingReport}
          className="bg-indigo-600 text-white px-4 py-2 rounded hover:bg-indigo-700 transition duration-300"
        >
          {generatingReport ? 'Generating...' : 'Generate Report'}
        </button>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-8">
        <Card icon={<FaUsers />} title="Total Users" value={overviewCounts.totalUsers} color="bg-blue-500" />
        <Card icon={<FaUserGraduate />} title="Total Students" value={overviewCounts.totalStudents} color="bg-green-500" />
        <Card icon={<FaUserTie />} title="Total Counselors" value={overviewCounts.totalCounselors} color="bg-yellow-500" />
        <Card icon={<FaCalendarCheck />} title="Today's Appointments" value={overviewCounts.todayAppointments} color="bg-red-500" />
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 mb-8">
        <Card icon={<FaClock />} title="Avg. Appointment Duration" value={`${overviewCounts.averageAppointmentDuration} min`} color="bg-purple-500" />
        <Card icon={<FaSmile />} title="Avg. User Satisfaction" value={`${overviewCounts.averageUserSatisfaction}/5`} color="bg-pink-500" />
        <Card icon={<FaExclamationTriangle />} title="Unresolved Issues" value={overviewCounts.unresolvedIssues} color="bg-orange-500" />
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        <ChartCard title="User Type Distribution">
          <ResponsiveContainer width="100%" height={300}>
            <PieChart>
              <Pie
                data={userTypeData}
                cx="50%"
                cy="50%"
                labelLine={false}
                outerRadius={80}
                fill="#8884d8"
                dataKey="value"
                label={({ name, value }) => `${name}: ${value}`}
              >
                {userTypeData.map((_, index) => (
                  <Cell key={`cell-${index}`} fill={COLORS[index % COLORS.length]} />
                ))}
              </Pie>
              <Tooltip />
              <Legend />
            </PieChart>
          </ResponsiveContainer>
        </ChartCard>

        <ChartCard title="Appointment Overview">
          <ResponsiveContainer width="100%" height={300}>
            <BarChart data={appointmentData}>
              <CartesianGrid strokeDasharray="3 3" />
              <XAxis dataKey="name" />
              <YAxis />
              <Tooltip />
              <Legend />
              <Bar dataKey="value" fill="#8884d8" />
            </BarChart>
          </ResponsiveContainer>
        </ChartCard>
      </div>

      {showReportCard && (
        <motion.div
          initial={{ y: '-100%' }}
          animate={{ y: 0 }}
          exit={{ y: '-100%' }}
          transition={{ type: 'spring', stiffness: 300, damping: 30 }}
          className="fixed top-0 left-12 right-0 bg-white p-6 shadow-lg z-[9999] max-h-screen overflow-y-auto"
        >
          <div className="flex justify-between items-center mb-4">
            <h3 className="text-xl font-bold">Generated Report</h3>
            <button
              onClick={() => setShowReportCard(false)}
              className="text-gray-500 hover:text-gray-700"
            >
              <FaTimes size={24} />
            </button>
          </div>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div>
              <h4 className="font-semibold mb-2">User Growth</h4>
              <ul>
                {/* Example data, replace with actual report data */}
                <li>January: 100 users (10% growth)</li>
                <li>February: 110 users (10% growth)</li>
              </ul>
            </div>
            <div>
              <h4 className="font-semibold mb-2">Appointment Types</h4>
              <ul>
                {/* Example data, replace with actual report data */}
                <li>Consultation: 50 (50%)</li>
                <li>Follow-up: 50 (50%)</li>
              </ul>
            </div>
          </div>
          <div className="mt-6 flex justify-end space-x-4">
            <button
              onClick={handleDownloadPDF}
              className="bg-blue-500 text-white px-4 py-2 rounded hover:bg-blue-600 transition duration-300 flex items-center"
            >
              <FaDownload className="mr-2" /> Download PDF
            </button>
            <button
              onClick={handlePrint}
              className="bg-green-500 text-white px-4 py-2 rounded hover:bg-green-600 transition duration-300 flex items-center"
            >
              <FaPrint className="mr-2" /> Print
            </button>
          </div>
        </motion.div>
      )}
    </motion.div>
  );
};

const Card = ({ icon, title, value, color }) => (
  <div className={`p-6 rounded-lg shadow-md text-white ${color}`}>
    <div className="flex items-center mb-4">
      <span className="mr-2">{icon}</span>
      <h3 className="text-lg font-semibold">{title}</h3>
    </div>
    <p className="text-3xl font-bold">{value}</p>
  </div>
);
Card.propTypes = {
  icon: PropTypes.element.isRequired,
  title: PropTypes.string.isRequired,
  value: PropTypes.oneOfType([PropTypes.string, PropTypes.number]).isRequired,
  color: PropTypes.string.isRequired,
};

const ChartCard = ({ title, children }) => (
  <div className="bg-white p-6 rounded-lg shadow-md">
    <h3 className="text-lg font-semibold mb-4">{title}</h3>
    {children}
  </div>
);

ChartCard.propTypes = {
  title: PropTypes.string.isRequired,
  children: PropTypes.node.isRequired,
};

export default AnalyticsReports;