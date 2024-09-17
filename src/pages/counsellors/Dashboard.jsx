import { useState, useEffect } from 'react';
import axios from 'axios';
import { motion } from 'framer-motion';
import { FiCalendar, FiBook, FiUser } from 'react-icons/fi';
import SessionView from "../../components/counselorsApp/SessionCardView";
import ClientNotes from "../../components/counselorsApp/ClientNotes";
import ArticlesCarousel from "../../components/counselorsApp/ArticleCarousel";
import SessionCalendar from "../../components/counselorsApp/SessionCalendar";
import PropTypes from 'prop-types';
import articlesData from '../../components/data/articlesData';

const CounselorDashboard = () => {
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
                <h2 className="text-3xl font-bold text-gray-800">Welcome, {firstName || 'Counselor'}</h2>
                <p className="text-gray-600 mt-2">Here&apos;s an overview of your counseling practice.</p>
            </motion.div>

            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                <CardWrapper title="Upcoming Sessions" icon={FiCalendar}>
                    <SessionView />
                </CardWrapper>

                <CardWrapper title="Client Notes" icon={FiBook} className="md:col-span-2 lg:col-span-2">
                    <ClientNotes />
                </CardWrapper>

                <CardWrapper title="Calendar" icon={FiCalendar}>
                    <SessionCalendar />
                </CardWrapper>

                <CardWrapper title="Recommended Articles" icon={FiBook}>
                    <ArticlesCarousel articles={articlesData} />
                </CardWrapper>

                <CardWrapper title="Client Resources" icon={FiUser}>
    <div className="relative bg-gradient-to-r from-blue-500 to-purple-600 text-white p-4 rounded-lg shadow-md overflow-hidden h-full">
        <div className="absolute top-0 right-0 w-20 h-20 opacity-20">
            <FiUser className="w-full h-full text-white" />
        </div>
        <p className="text-sm">
            Access a variety of resources to enhance your counseling skills.
        </p>
        <ul className="list-disc list-inside mt-4 space-y-1">
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
        <div className="mt-6">
            <button className="w-full bg-white text-blue-600 py-2 px-4 rounded-lg font-semibold shadow hover:bg-gray-200 transition duration-300">
                Explore More
            </button>
        </div>
    </div>
</CardWrapper>

            </div>
        </div>
    );
};

export default CounselorDashboard;