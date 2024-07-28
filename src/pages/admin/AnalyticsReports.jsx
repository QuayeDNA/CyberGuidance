import { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { FaChartLine, FaChartBar, FaChartPie, FaClock, FaFileAlt, FaDownload, FaPrint, FaTimes } from 'react-icons/fa';
import {
  LineChart, Line, BarChart, Bar, PieChart, Pie, AreaChart, Area,
  XAxis, YAxis, CartesianGrid, Tooltip, Legend, ResponsiveContainer, Cell
} from 'recharts';

const AnalyticsReports = () => {
  const [reportPeriod, setReportPeriod] = useState('day');
  const [generatingReport, setGeneratingReport] = useState(false);
  const [showReportCard, setShowReportCard] = useState(false);

  // Mock data for charts (same as before)
  const userGrowthData = [
    { month: 'Jan', students: 100, counselors: 10, totalUsers: 110, growthRate: 0 },
    { month: 'Feb', students: 150, counselors: 12, totalUsers: 162, growthRate: 47.27 },
    { month: 'Mar', students: 200, counselors: 15, totalUsers: 215, growthRate: 32.72 },
    { month: 'Apr', students: 250, counselors: 18, totalUsers: 268, growthRate: 24.65 },
    { month: 'May', students: 300, counselors: 20, totalUsers: 320, growthRate: 19.40 },
    { month: 'Jun', students: 350, counselors: 22, totalUsers: 372, growthRate: 16.25 },
  ];

  const appointmentData = [
    { type: 'Academic', count: 150, percentage: 30 },
    { type: 'Career', count: 100, percentage: 20 },
    { type: 'Personal', count: 80, percentage: 16 },
    { type: 'Mental Health', count: 120, percentage: 24 },
    { type: 'Other', count: 50, percentage: 10 },
  ];

  const userDemographicsData = [
    { name: 'Undergraduate', value: 60, count: 3000 },
    { name: 'Graduate', value: 25, count: 1250 },
    { name: 'PhD', value: 15, count: 750 },
  ];

  const sessionDurationData = [
    { duration: '15-30 min', count: 50, percentage: 17.86 },
    { duration: '30-45 min', count: 80, percentage: 28.57 },
    { duration: '45-60 min', count: 120, percentage: 42.86 },
    { duration: '60+ min', count: 30, percentage: 10.71 },
  ];

  const satisfactionRateData = [
    { month: 'Jan', rate: 4.2, responses: 150 },
    { month: 'Feb', rate: 4.3, responses: 180 },
    { month: 'Mar', rate: 4.5, responses: 200 },
    { month: 'Apr', rate: 4.4, responses: 220 },
    { month: 'May', rate: 4.6, responses: 250 },
    { month: 'Jun', rate: 4.7, responses: 280 },
  ];

  const COLORS = ['#0088FE', '#00C49F', '#FFBB28', '#FF8042', '#8884D8'];

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

  return (
    <motion.div
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      transition={{ duration: 0.5 }}
      className="p-6 relative"
    >
      <h2 className="text-2xl font-bold mb-6">Analytics and Reports</h2>
      
      {/* Report Generation Section */}
      <div className="bg-white p-6 rounded-lg shadow-md mb-6">
        <h3 className="text-lg font-semibold mb-4 flex items-center">
          <FaFileAlt className="mr-2 text-indigo-600" />
          Generate Report
        </h3>
        <div className="flex items-center space-x-4">
          <select
            value={reportPeriod}
            onChange={(e) => setReportPeriod(e.target.value)}
            className="border rounded p-2"
          >
            <option value="day">Daily</option>
            <option value="week">Weekly</option>
            <option value="month">Monthly</option>
            <option value="year">Yearly</option>
            <option value="semester">Per Semester</option>
            <option value="academic_year">Academic Year</option>
          </select>
          <button
            onClick={handleGenerateReport}
            disabled={generatingReport}
            className="bg-indigo-600 text-white px-4 py-2 rounded hover:bg-indigo-700 transition duration-300"
          >
            {generatingReport ? 'Generating...' : 'Generate Report'}
          </button>
        </div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        <div className="bg-white p-6 rounded-lg shadow-md">
          <h3 className="text-lg font-semibold mb-4 flex items-center">
            <FaChartLine className="mr-2 text-indigo-600" />
            User Growth and Growth Rate
          </h3>
          <ResponsiveContainer width="100%" height={300}>
            <LineChart data={userGrowthData}>
              <CartesianGrid strokeDasharray="3 3" />
              <XAxis dataKey="month" />
              <YAxis yAxisId="left" />
              <YAxis yAxisId="right" orientation="right" />
              <Tooltip />
              <Legend />
              <Line yAxisId="left" type="monotone" dataKey="totalUsers" stroke="#8884d8" activeDot={{ r: 8 }} />
              <Line yAxisId="right" type="monotone" dataKey="growthRate" stroke="#82ca9d" />
            </LineChart>
          </ResponsiveContainer>
        </div>
        <div className="bg-white p-6 rounded-lg shadow-md">
          <h3 className="text-lg font-semibold mb-4 flex items-center">
            <FaChartBar className="mr-2 text-indigo-600" />
            Appointment Types Distribution
          </h3>
          <ResponsiveContainer width="100%" height={300}>
            <BarChart data={appointmentData}>
              <CartesianGrid strokeDasharray="3 3" />
              <XAxis dataKey="type" />
              <YAxis />
              <Tooltip />
              <Legend />
              <Bar dataKey="count" fill="#8884d8" />
              <Bar dataKey="percentage" fill="#82ca9d" />
            </BarChart>
          </ResponsiveContainer>
        </div>
        <div className="bg-white p-6 rounded-lg shadow-md">
          <h3 className="text-lg font-semibold mb-4 flex items-center">
            <FaChartPie className="mr-2 text-indigo-600" />
            User Demographics
          </h3>
          <ResponsiveContainer width="100%" height={300}>
            <PieChart>
              <Pie
                data={userDemographicsData}
                cx="50%"
                cy="50%"
                labelLine={false}
                outerRadius={80}
                fill="#8884d8"
                dataKey="value"
                label={({ name, value, count }) => `${name} ${value}% (${count})`}
              >
                {userDemographicsData.map((entry, index) => (
                  <Cell key={`cell-${index}`} fill={COLORS[index % COLORS.length]} />
                ))}
              </Pie>
              <Tooltip />
              <Legend />
            </PieChart>
          </ResponsiveContainer>
        </div>
        <div className="bg-white p-6 rounded-lg shadow-md">
          <h3 className="text-lg font-semibold mb-4 flex items-center">
            <FaClock className="mr-2 text-indigo-600" />
            Session Duration Distribution
          </h3>
          <ResponsiveContainer width="100%" height={300}>
            <BarChart data={sessionDurationData}>
              <CartesianGrid strokeDasharray="3 3" />
              <XAxis dataKey="duration" />
              <YAxis yAxisId="left" />
              <YAxis yAxisId="right" orientation="right" />
              <Tooltip />
              <Legend />
              <Bar yAxisId="left" dataKey="count" fill="#82ca9d" />
              <Bar yAxisId="right" dataKey="percentage" fill="#8884d8" />
            </BarChart>
          </ResponsiveContainer>
        </div>
        <div className="bg-white p-6 rounded-lg shadow-md">
          <h3 className="text-lg font-semibold mb-4 flex items-center">
            <FaChartLine className="mr-2 text-indigo-600" />
            Satisfaction Rate Trend
          </h3>
          <ResponsiveContainer width="100%" height={300}>
            <AreaChart data={satisfactionRateData}>
              <CartesianGrid strokeDasharray="3 3" />
              <XAxis dataKey="month" />
              <YAxis yAxisId="left" domain={[0, 5]} />
              <YAxis yAxisId="right" orientation="right" />
              <Tooltip />
              <Legend />
              <Area yAxisId="left" type="monotone" dataKey="rate" stroke="#8884d8" fill="#8884d8" />
              <Line yAxisId="right" type="monotone" dataKey="responses" stroke="#82ca9d" />
            </AreaChart>
          </ResponsiveContainer>
        </div>
      </div>
       {/* Sliding Report Card */}
       <AnimatePresence>
        {showReportCard && (
          <motion.div
            initial={{ y: '-100%' }}
            animate={{ y: 0 }}
            exit={{ y: '-100%' }}
            transition={{ type: 'spring', stiffness: 300, damping: 30 }}
            className="fixed top-0 left-0 right-0 bg-white p-6 shadow-lg z-50 max-h-screen overflow-y-auto"
          >
            <div className="flex justify-between items-center mb-4">
              <h3 className="text-xl font-bold">Generated Report: {reportPeriod}</h3>
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
                  {userGrowthData.map((data, index) => (
                    <li key={index}>
                      {data.month}: {data.totalUsers} users ({data.growthRate.toFixed(2)}% growth)
                    </li>
                  ))}
                </ul>
              </div>
              <div>
                <h4 className="font-semibold mb-2">Appointment Types</h4>
                <ul>
                  {appointmentData.map((data, index) => (
                    <li key={index}>
                      {data.type}: {data.count} ({data.percentage}%)
                    </li>
                  ))}
                </ul>
              </div>
              <div>
                <h4 className="font-semibold mb-2">User Demographics</h4>
                <ul>
                  {userDemographicsData.map((data, index) => (
                    <li key={index}>
                      {data.name}: {data.value}% ({data.count} users)
                    </li>
                  ))}
                </ul>
              </div>
              <div>
                <h4 className="font-semibold mb-2">Session Duration</h4>
                <ul>
                  {sessionDurationData.map((data, index) => (
                    <li key={index}>
                      {data.duration}: {data.count} ({data.percentage}%)
                    </li>
                  ))}
                </ul>
              </div>
              <div>
                <h4 className="font-semibold mb-2">Satisfaction Rate</h4>
                <ul>
                  {satisfactionRateData.map((data, index) => (
                    <li key={index}>
                      {data.month}: {data.rate.toFixed(1)} ({data.responses} responses)
                    </li>
                  ))}
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
      </AnimatePresence>
    </motion.div>
  );
};

export default AnalyticsReports;