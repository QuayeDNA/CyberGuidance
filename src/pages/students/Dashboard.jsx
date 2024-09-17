import { useState, useEffect } from 'react';
import axios from 'axios';
import { motion } from 'framer-motion';
import { Tab, TabGroup, TabList, TabPanels, TabPanel  } from '@headlessui/react';
import { FiCalendar, FiBook, FiUser } from 'react-icons/fi';
import SessionView from "../../components/studentsApp/SessionCardView";
import Notes from "../../components/studentsApp/Notes";
import ArticlesCarousel from "../../components/studentsApp/ArticleCarousel";
import SessionCalendar from "../../components/studentsApp/SessionCalendar";
import RecommendedCounselors from "../../components/ui/cards/RecommendedCounselors";
import PropTypes from 'prop-types';
import articlesData from '../../components/data/articlesData';
const Dashboard = () => {
  const [firstName, setFirstName] = useState('');

  useEffect(() => {
    fetchProfileData();
  }, []);

  const fetchProfileData = async () => {
    try {
      const response = await axios.get('https://cyber-guidance.onrender.com/api/user-info/', {
        headers: { Authorization: `Bearer ${localStorage.getItem('token')}` },
      });
      setFirstName(response.data.user.personalInfo.fullName.split(' ')[0]);
    } catch (error) {
      console.error('Error fetching profile data:', error);
    }
  };

  const CardWrapper = ({ children, title, icon: Icon, className = '' }) => (
    <motion.div
      className={`bg-white rounded-xl shadow-md overflow-hidden ${className}`}
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.5 }}
    >
      <div className="p-6">
        <div className="flex items-center mb-4">
          <Icon className="w-6 h-6 text-indigo-600 mr-2" />
          <h3 className="text-xl font-semibold text-gray-800">{title}</h3>
        </div>
        {children}
      </div>
    </motion.div>
  );

  CardWrapper.propTypes = {
    children: PropTypes.node,
    title: PropTypes.string,
    icon: PropTypes.elementType,
    className: PropTypes.string,
    };

  return (
    <div className="container mx-auto px-4 py-8">
      <motion.div
        initial={{ opacity: 0, y: -20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.5 }}
        className="text-left mb-8"
      >
        <h2 className="text-3xl font-bold text-gray-800">Welcome, {firstName || 'User'}</h2>
        <p className="text-gray-600 mt-2">Your safe space awaits</p>
      </motion.div>

      <div className="mb-8">
        <RecommendedCounselors />
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        <CardWrapper title="Upcoming Sessions" icon={FiCalendar}>
          <SessionView />
        </CardWrapper>

        <CardWrapper title="My Notes" icon={FiBook} className="md:col-span-2 lg:col-span-2">
          <Notes />
        </CardWrapper>

        <CardWrapper title="Calendar" icon={FiCalendar}>
          <SessionCalendar />
        </CardWrapper>

        <CardWrapper title="Recommended Articles" icon={FiBook}>
          <ArticlesCarousel articles={articlesData} />
        </CardWrapper>

        <CardWrapper title="Client Resources" icon={FiUser}>
  <TabGroup>
    <TabList className="flex space-x-1 rounded-xl bg-indigo-100 p-1">
      <Tab className={({ selected }) =>
        `w-full rounded-lg py-2.5 text-sm font-medium leading-5 transition duration-300
         ${selected ? 'bg-white text-indigo-700 shadow' : 'text-indigo-500 hover:bg-white/[0.12] hover:text-indigo-600'}`
      }>
        Tips
      </Tab>
      <Tab className={({ selected }) =>
        `w-full rounded-lg py-2.5 text-sm font-medium leading-5 transition duration-300
         ${selected ? 'bg-white text-indigo-700 shadow' : 'text-indigo-500 hover:bg-white/[0.12] hover:text-indigo-600'}`
      }>
        Resources
      </Tab>
    </TabList>
    <TabPanels className="mt-4">
      {/* Tips Section */}
      <TabPanel className="rounded-xl bg-gradient-to-r from-indigo-500 via-purple-500 to-blue-500 text-white p-4 shadow-md">
        <h3 className="text-lg font-semibold mb-2">Counseling Tips</h3>
        <ul className="list-disc list-inside space-y-2">
          <li className="flex items-center space-x-2">
            <FiUser className="text-white" />
            <span>Active Listening</span>
          </li>
          <li className="flex items-center space-x-2">
            <FiUser className="text-white" />
            <span>Empathy</span>
          </li>
          <li className="flex items-center space-x-2">
            <FiUser className="text-white" />
            <span>Open-Ended Questions</span>
          </li>
          <li className="flex items-center space-x-2">
            <FiUser className="text-white" />
            <span>Building Rapport</span>
          </li>
        </ul>
      </TabPanel>

      {/* Resources Section */}
      <TabPanel className="rounded-xl bg-gradient-to-r from-indigo-500 via-purple-500 to-blue-500 text-white p-4 shadow-md">
        <h3 className="text-lg font-semibold mb-2">Available Resources</h3>
        <ul className="list-disc list-inside space-y-2">
          <li className="flex items-center space-x-2">
            <FiBook className="text-white" />
            <span>Books</span>
          </li>
          <li className="flex items-center space-x-2">
            <FiBook className="text-white" />
            <span>Online Courses</span>
          </li>
          <li className="flex items-center space-x-2">
            <FiCalendar className="text-white" />
            <span>Workshops</span>
          </li>
          <li className="flex items-center space-x-2">
            <FiCalendar className="text-white" />
            <span>Webinars</span>
          </li>
        </ul>
      </TabPanel>
    </TabPanels>
  </TabGroup>
</CardWrapper>

      </div>
    </div>
  );
};

export default Dashboard;