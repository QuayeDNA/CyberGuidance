import { useState } from 'react';
import { FaBell, FaCog, FaSignOutAlt, FaBars, FaUserCircle, FaUserAlt, FaHome, FaComment, FaTools } from 'react-icons/fa';
import { Link, NavLink, useLocation } from 'react-router-dom';
import LogoutModal from '../ui/modal/logoutModal';

function Navbar() {
    const [showNotificationDropdown, setShowNotificationDropdown] = useState(false);
    const [showMenuDropdown, setShowMenuDropdown] = useState(false);
    const [isModalOpen, setIsModalOpen] = useState(false);

    const location = useLocation();

    const navLinks = [
        { id: 1, to: '/main/dashboard', icon: <FaHome className="mr-2" />, text: 'Dashboard' },
        { id: 2, to: '/main/counselors', icon: <FaUserAlt className="mr-2" />, text: 'Find a Councellor' },
        { id: 3, to: '/main/message', icon: <FaComment className="mr-2" />, text: 'Messages' },
        { id: 4, to: '/main/user', icon: <FaUserCircle className='mr-2' />, text: "User" },
        { id: 5, to: '/main/articles', icon: <FaTools className='mr-2' />, text: "Articles"}

    ];

    const notifications = [
        {
            id: 1,
            title: 'New Appointment',
            message: 'You have a new appointment scheduled for tomorrow.',
            time: '2 hours ago',
            link: '/appointments',
        },
        {
            id: 2,
            title: 'Counseling Session',
            message: 'Your counseling session has been confirmed.',
            time: '4 hours ago',
            link: '/sessions',
        },
        {
            id: 3,
            title: 'New Message',
            message: 'You received a new message from your counselor.',
            time: '6 hours ago',
            link: '/messages',
        },
    ];

    const toggleNotificationDropdown = () => {
        setShowNotificationDropdown(!showNotificationDropdown);
        setShowMenuDropdown(false); // Close user dropdown if open
    };

    const toggleMenuDropdown = () => {
        setShowMenuDropdown(!showMenuDropdown);
        setShowNotificationDropdown(false); // Close notification dropdown if open
    };

    return (
        <header className="bg-white shadow-md py-4 fixed z-20 w-full">
            <div className="mx-auto px-6 flex justify-between items-center">
                <div className="flex items-center space-x-4">
                    {/* Logo and App Name */}
                    <img src="../../../public/Logo.svg" alt="TTU Counseling Logo" className="h-12 bg-gray-700 rounded-lg p-1" />
                    <span className="text-gray-700 text-xl font-semibold hidden lg:block">CyberGuidance</span>
                </div>
                <div className="mx-auto px-2 justify-center items-center hidden md:flex">
                    {/* Large screen navigation */}
                    <div className="space-x-6  lg:space-x-8  items-center justify-center hidden xl:flex">
                        {navLinks.map((link) => (
                            <NavLink
                                key={link.id}
                                to={link.to}
                                className={({ isActive }) =>
                                    `text-gray-700 hover:text-white hover:bg-blue-500 px-3 lg:px-4 py-2 rounded-full transition duration-200 flex items-center ${isActive ? 'bg-blue-500 px-2 lg:px-4 py-2 text-white rounded-full' : ''}`
                                }
                            >
                                {link.icon}
                                <span className={`hidden sm:inline ${location.pathname === link.to ? 'block' : 'hidden'}`}>{link.text}</span>
                            </NavLink>
                        ))}
                    </div>
                <div className="space-x-6 flex items-center xl:hidden">
                    {navLinks.map((link) => (
                        <NavLink
                            key={link.id}
                            to={link.to}
                            className={({ isActive }) =>
                                `text-gray-700 transition duration-200 flex items-center ${isActive ? 'bg-blue-500 px-4 py-2 text-white rounded-full' : ''}`
                            }
                        >
                            {link.icon}
                            <span className={`${location.pathname === link.to ? 'block' : 'hidden'}`}>{link.text}</span>
                        </NavLink>
                    ))}
                </div>

                </div>
                <div className="relative flex items-center space-x-6">
                    <button
                        id="notificationIcon"
                        className="text-gray-500 hover:text-gray-700 transition duration-200 relative"
                        onClick={toggleNotificationDropdown}
                    >
                        <FaBell className="text-lg" />
                        {notifications.length > 0 && (
                            <span className="absolute top-0 right-0 inline-block w-2 h-2 bg-red-600 rounded-full"></span>
                        )}
                    </button>
                    {showNotificationDropdown && (
                        <div
                            id="notificationDropdown"
                            className="absolute right-0 top-10 w-80 bg-white border rounded-lg shadow-xl overflow-auto z-20"
                            style={{ maxHeight: '300px', scrollbarWidth: 'thin', scrollbarColor: '#808080 transparent' }}
                        >
                            <div className="p-4 overflow-y-auto">
                                {notifications.map((notification) => (
                                    <div key={notification.id} className="mb-4 p-3 rounded-lg flex flex-col space-y-2 bg-gray-100">
                                        <div>
                                            <h3 className="text-md font-semibold mb-1">{notification.title}</h3>
                                            <p className="text-sm text-gray-700">{notification.message}</p>
                                        </div>
                                        <div className="flex justify-between items-center">
                                            <p className="text-xs text-gray-500">{notification.time}</p>
                                            <Link to={notification.link} className="text-blue-500 hover:underline text-sm">
                                                View
                                            </Link>
                                        </div>
                                    </div>
                                ))}
                            </div>
                        </div>
                    )}
                    <button
                        className="text-gray-500 hover:text-blue-600 transition duration-200"
                        onClick={toggleMenuDropdown}
                    >
                        <FaBars className="text-lg" />
                    </button>
                    {showMenuDropdown && (
                        <div
                            id="userDropdown"
                            className="absolute right-0 top-10 w-48 p-4 bg-white border rounded-lg shadow-xl z-50"
                        >
                            <Link to="/settings" className="flex items-center text-gray-700 hover:text-blue-500 transition duration-200 mb-2">
                                <FaCog className="mr-2" /> Settings
                            </Link>
                            <button
                                onClick={() => setIsModalOpen(true)}
                                className="flex items-center text-gray-700 hover:text-blue-500 transition duration-200"
                            >
                                <FaSignOutAlt className="mr-2" /> Logout
                            </button>

                            {isModalOpen && <LogoutModal onClose={() => setIsModalOpen(false)} />}
                        </div>
                    )}
                </div>
            </div>
        </header>
    );
}

export default Navbar;
