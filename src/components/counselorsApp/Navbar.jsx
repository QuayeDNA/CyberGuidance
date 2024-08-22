import { useState, useEffect } from 'react';
import { FaBell, FaSignOutAlt, FaBars, FaUserCircle, FaCalendarAlt, FaHome, FaComments,FaRegNewspaper } from 'react-icons/fa';
import { NavLink, useNavigate } from 'react-router-dom';
import { motion, AnimatePresence } from 'framer-motion';
import { useAuth } from '../../components/contexts/AuthContext'; // Import useAuth hook
import ConfirmationModal from './ConfirmationModal'; // Import ConfirmationModal component

function Navbar() {
    const [showNotificationDropdown, setShowNotificationDropdown] = useState(false);
    const [showMenuDropdown, setShowMenuDropdown] = useState(false);
    const [showLogoutModal, setShowLogoutModal] = useState(false); // State for logout modal
    const [notifications, setNotifications] = useState([]);
    const { logout } = useAuth(); // Get logout function from AuthContext

    const navigate = useNavigate();

    const navLinks = [
        { id: 1, to: '/counselor/dashboard', icon: <FaHome className="mr-2" />, text: 'Dashboard' },
        { id: 2, to: '/counselor/sessions', icon: <FaCalendarAlt className="mr-2" />, text: 'Sessions' },
        { id: 3, to: '/counselor/message', icon: <FaComments className="mr-2" />, text: 'Messages' },
        { id: 4, to: '/counselor/user', icon: <FaUserCircle className='mr-2' />, text: "Profile" },
        { id: 5, to: '/counselor/articles', icon: <FaRegNewspaper className='mr-2' />, text: "Articles" }
    ];

    useEffect(() => {
        // Simulating fetching notifications from an API
        const fetchNotifications = async () => {
            // Replace this with actual API call
            const response = await new Promise(resolve => setTimeout(() => resolve([
                {
                    id: 1,
                    title: 'New Session',
                    message: 'You have a new counseling session scheduled for tomorrow.',
                    time: '2 hours ago',
                    link: '/counselor/sessions',
                    isRead: false,
                },
                {
                    id: 2,
                    title: 'Session Reminder',
                    message: 'Reminder: You have a counseling session in 1 hour.',
                    time: '4 hours ago',
                    link: '/counselor/sessions',
                    isRead: true,
                },
                {
                    id: 3,
                    title: 'New Message',
                    message: 'You received a new message from a client.',
                    time: '6 hours ago',
                    link: '/counselor/messages',
                    isRead: false,
                },
            ]), 1000));
            setNotifications(response);
        };

        fetchNotifications();
    }, []);

    
  const markAsRead = (id) => {
    setNotifications(
      notifications.map((notif) =>
        notif.id === id ? { ...notif, isRead: true } : notif
      )
    );
  };

    const toggleNotificationDropdown = () => {
        setShowNotificationDropdown(!showNotificationDropdown);
        setShowMenuDropdown(false);
    };

    const toggleMenuDropdown = () => {
        setShowMenuDropdown(!showMenuDropdown);
        setShowNotificationDropdown(false);
    };

    const handleLogout = () => {
        setShowLogoutModal(true); // Show the logout confirmation modal
    };

    const confirmLogout = async () => {
        await logout();
        navigate('/login');
    };

    return (
        <header className="bg-white shadow-md py-4 fixed z-20 w-full">
            <div className="container mx-auto px-2 flex justify-between items-center">
                <div className="flex items-center space-x-4">
                    <img src="/logo/Logo.svg" alt="Counseling Platform Logo" className="h-12 bg-gray-700 rounded-lg p-1" />
                    <span className="text-gray-700 text-xl font-semibold hidden lg:block">Counselor Dashboard</span>
                </div>
                <nav className="hidden md:flex items-center space-x-6">
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
                        onClick={toggleNotificationDropdown}
                    >
                        <FaBell className="text-lg" />
                        {notifications.some(n => !n.isRead) && (
                            <span className="absolute -top-1 -right-1 inline-flex items-center justify-center px-2 py-1 text-xs font-bold leading-none text-white transform translate-x-1/2 -translate-y-1/2 bg-red-600 rounded-full">
                                {notifications.filter(n => !n.isRead).length}
                            </span>
                        )}
                    </button>
                    <AnimatePresence>
                        {showNotificationDropdown && (
                            <motion.div
                                initial={{ opacity: 0, y: -10 }}
                                animate={{ opacity: 1, y: 0 }}
                                exit={{ opacity: 0, y: -10 }}
                                transition={{ duration: 0.2 }}
                                className="absolute right-0 top-12 w-80 bg-white border rounded-lg shadow-xl overflow-hidden z-30"
                            >
                                <div className="p-4 max-h-96 overflow-y-auto">
                                    {notifications.length > 0 ? (
                                        notifications.map((notification) => (
                                            <div
                                                key={notification.id}
                                                className={`mb-4 p-3 rounded-lg flex flex-col space-y-2 ${notification.isRead ? 'bg-gray-100' : 'bg-blue-50'
                                                    }`}
                                            >
                                                <div>
                                                    <h3 className="text-md font-semibold mb-1">{notification.title}</h3>
                                                    <p className="text-sm text-gray-700">{notification.message}</p>
                                                </div>
                                                <div className="flex justify-between items-center">
                                                    <p className="text-xs text-gray-500">{notification.time}</p>
                                                    <button
                                                        onClick={() => markAsRead(notification.id)}
                                                        className="text-blue-500 hover:underline text-sm"
                                                    >
                                                        Mark as read
                                                    </button>
                                                </div>
                                            </div>
                                        ))
                                    ) : (
                                        <p className="text-center text-gray-500">No notifications</p>
                                    )}
                                </div>
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