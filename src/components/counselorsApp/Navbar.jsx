import { useState, useEffect, useRef } from 'react';
import { FaClock, FaSignOutAlt, FaBars, FaUserCircle, FaCalendarAlt, FaHome, FaComments, FaRegNewspaper } from 'react-icons/fa';
import { NavLink, useNavigate } from 'react-router-dom';
import { motion, AnimatePresence } from 'framer-motion';
import { useAuth } from '../../components/contexts/AuthContext'; // Import useAuth hook
import ConfirmationModal from './ConfirmationModal'; // Import ConfirmationModal component
import { updateCounselorAvailability } from '../../axiosServices/reportApi'; // Import the API function
import axios from 'axios';

function Navbar() {
    const [showMenuDropdown, setShowMenuDropdown] = useState(false);
    const [showLogoutModal, setShowLogoutModal] = useState(false); // State for logout modal
    const [isAvailable, setIsAvailable] = useState(false); // Initialize with false
    const [isLoaded, setIsLoaded] = useState(false);
    const [showTimePopup, setShowTimePopup] = useState(false); // State for time popup
    const { logout } = useAuth(); // Get logout function from AuthContext

    const navigate = useNavigate();
    const menuRef = useRef(null);

    const navLinks = [
        { id: 1, to: '/counselor/dashboard', icon: <FaHome className="mr-2" />, text: 'Dashboard' },
        { id: 2, to: '/counselor/sessions', icon: <FaCalendarAlt className="mr-2" />, text: 'Sessions' },
        { id: 3, to: '/counselor/message', icon: <FaComments className="mr-2" />, text: 'Messages' },
        { id: 4, to: '/counselor/user', icon: <FaUserCircle className='mr-2' />, text: "Profile" },
        { id: 5, to: '/counselor/articles', icon: <FaRegNewspaper className='mr-2' />, text: "Articles" }
    ];

    useEffect(() => {
        // Fetch user profile data to get availability status
        const fetchProfileData = async () => {
            try {
                const response = await axios.get(
                    "https://cyber-guidance.onrender.com/api/user-info/",
                    {
                        headers: {
                            Authorization: `Bearer ${localStorage.getItem("token")}`,
                        },
                    }
                );
                const profileData = response.data.user;
                setIsAvailable(profileData.isAvailable);
                setIsLoaded(true); // Set isLoaded to true after fetching data
            } catch (err) {
                console.error('Error fetching profile data:', err.message);
                setIsLoaded(true); // Set isLoaded to true even if there's an error
            }
        };

        fetchProfileData();
    }, []);

    const toggleMenuDropdown = () => {
        setShowMenuDropdown(!showMenuDropdown);
    };

    const handleLogout = () => {
        setShowLogoutModal(true); // Show the logout confirmation modal
    };

    const confirmLogout = async () => {
        await logout();
        navigate('/login');
    };

    const handleToggleAvailability = async () => {
        try {
            const newAvailability = !isAvailable;
            await updateCounselorAvailability(newAvailability);
            setIsAvailable(newAvailability);
        } catch (error) {
            console.error('Error updating availability:', error.message);
        }
    };

    const handleClickOutside = (event) => {
        if (menuRef.current && !menuRef.current.contains(event.target)) {
            setShowMenuDropdown(false);
        }
    };

    useEffect(() => {
        if (showMenuDropdown) {
            document.addEventListener('mousedown', handleClickOutside);
        } else {
            document.removeEventListener('mousedown', handleClickOutside);
        }

        return () => {
            document.removeEventListener('mousedown', handleClickOutside);
        };
    }, [showMenuDropdown]);

    const toggleTimePopup = () => {
        setShowTimePopup(!showTimePopup);
    };

    return (
        <header className="bg-white shadow-md py-4 fixed z-20 w-full">
            <div className="container mx-auto px-2 flex justify-between items-center">
                <div className="flex items-center space-x-4">
                    <img src="/logo/Logo.svg" alt="Counseling Platform Logo" className="h-12 bg-gray-700 rounded-lg p-1" />
                    <span className="text-gray-700 text-xl font-semibold hidden lg:block">Counselor Dashboard</span>
                </div>
                <nav className="hidden lg:flex items-center space-x-6">
                    {navLinks.map((link) => (
                        <NavLink
                            key={link.id}
                            to={link.to}
                            className={({ isActive }) =>
                                `text-gray-700 transition duration-200 flex items-center ${isActive ? 'bg-blue-500 py-2 px-4 text-white rounded-full font-semibold' : ''
                                }`
                            }
                        >
                            {link.icon}
                            <span>{link.text}</span>
                        </NavLink>
                    ))}
                </nav>
                <div className="relative flex items-center space-x-6">
                    <button
                        className="text-gray-500 hover:text-blue-600 transition duration-200 relative"
                        onClick={toggleTimePopup}
                    >
                        <FaClock className="text-lg" />
                    </button>
                    <AnimatePresence>
                        {showTimePopup && (
                            <motion.div
                                initial={{ opacity: 0, y: -10 }}
                                animate={{ opacity: 1, y: 0 }}
                                exit={{ opacity: 0, y: -10 }}
                                transition={{ duration: 0.2 }}
                                className="absolute right-0 top-12 w-48 bg-white border rounded-lg shadow-xl p-4 z-30"
                            >
                                <p className="text-center text-gray-700">{new Date().toLocaleTimeString()}</p>
                            </motion.div>
                        )}
                    </AnimatePresence>
                    <button
                        className="text-gray-500 hover:text-blue-600 transition duration-200"
                        onClick={toggleMenuDropdown}
                    >
                        <FaBars className="text-lg" />
                    </button>
                    <AnimatePresence>
                        {showMenuDropdown && (
                            <motion.div
                                ref={menuRef}
                                initial={{ opacity: 0, y: -10 }}
                                animate={{ opacity: 1, y: 0 }}
                                exit={{ opacity: 0, y: -10 }}
                                transition={{ duration: 0.2 }}
                                className="absolute right-0 top-12 w-48 p-4 bg-white border rounded-lg shadow-xl z-30"
                            >
                                <button
                                    onClick={handleLogout}
                                    className="flex items-center text-gray-700 hover:text-blue-500 transition duration-200 w-full text-left"
                                >
                                    <FaSignOutAlt className="mr-2" /> Logout
                                </button>
                            </motion.div>
                        )}
                    </AnimatePresence>
                    <div className="flex items-center space-x-2">
                        <span className="text-gray-700">Available</span>
                        {isLoaded && ( // Only render the toggle when data is loaded
                            <label className="relative inline-flex items-center cursor-pointer">
                                <input 
                                    type="checkbox" 
                                    checked={isAvailable} 
                                    onChange={handleToggleAvailability} 
                                    className="sr-only peer" 
                                />
                                <div className="w-11 h-6 bg-gray-200 rounded-full peer peer-focus:ring-4 peer-focus:ring-blue-300 dark:peer-focus:ring-blue-800 peer-checked:after:translate-x-full peer-checked:after:border-white after:content-[''] after:absolute after:top-0.5 after:left-[2px] after:bg-white after:border-gray-300 after:border after:rounded-full after:h-5 after:w-5 after:transition-all peer-checked:bg-blue-600"></div>
                            </label>
                        )}
                    </div>
                </div>
            </div>
            {showLogoutModal && (
                <ConfirmationModal
                    title="Confirm Logout"
                    message="Are you sure you want to log out?"
                    onConfirm={confirmLogout}
                    onCancel={() => setShowLogoutModal(false)}
                />
            )}
        </header>
    );
}

export default Navbar;