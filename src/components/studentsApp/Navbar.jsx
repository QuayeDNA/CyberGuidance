import { useState, useEffect, useRef } from "react";
import {
  FaBell,
  FaSignOutAlt,
  FaBars,
  FaUserAlt,
  FaHome,
  FaComment,
  FaRegNewspaper,
  FaCog,
} from "react-icons/fa";
import { NavLink, useNavigate } from "react-router-dom";
import { motion, AnimatePresence } from "framer-motion";
import ConfirmationModal from "./ConfirmationModal";
import { useAuth } from "../../components/contexts/AuthContext";

const useNotifications = () => {
  const [notifications, setNotifications] = useState([]);

  useEffect(() => {
    // Load notifications from localStorage on component mount
    const storedNotifications = JSON.parse(
      localStorage.getItem("notifications") || "[]"
    );
    setNotifications(storedNotifications);

    // Set up an interval to check for new notifications
    const intervalId = setInterval(() => {
      checkForNewNotifications();
    }, 5000); // Check every 5 seconds

    return () => clearInterval(intervalId);
  }, []);

  const checkForNewNotifications = () => {
    // Simulate receiving new notifications
    const chance = Math.random();
    if (chance < 0.3) {
      // 30% chance of new notification
      const newNotification = {
        id: Date.now(),
        title: "New Notification",
        message: `This is a new notification ${chance.toFixed(2)}`,
        time: new Date().toLocaleTimeString(),
        isRead: false,
      };

      setNotifications((prevNotifications) => {
        let updatedNotifications = [newNotification, ...prevNotifications];

        // Cap the notifications at 20
        if (updatedNotifications.length > 20) {
          updatedNotifications = updatedNotifications.slice(0, 20);
        }

        localStorage.setItem(
          "notifications",
          JSON.stringify(updatedNotifications)
        );
        return updatedNotifications;
      });
    }
  };

  const markAsRead = (id) => {
    setNotifications((prevNotifications) => {
      const updatedNotifications = prevNotifications.map((notif) =>
        notif.id === id ? { ...notif, isRead: true } : notif
      );
      localStorage.setItem(
        "notifications",
        JSON.stringify(updatedNotifications)
      );
      return updatedNotifications;
    });
  };

  return { notifications, markAsRead };
};

function Navbar() {
  const [showMenuDropdown, setShowMenuDropdown] = useState(false);
  const [showLogoutModal, setShowLogoutModal] = useState(false);
  const [showNotificationDropdown, setShowNotificationDropdown] =
    useState(false);
  const { notifications, markAsRead } = useNotifications();

  const navigate = useNavigate();
  const { logout } = useAuth();

  const navLinks = [
    {
      id: 1,
      to: "/student/dashboard",
      icon: <FaHome className="mr-2" />,
      text: "Dashboard",
    },
    {
      id: 2,
      to: "/student/counselors",
      icon: <FaUserAlt className="mr-2" />,
      text: "Counsellors",
    },
    {
      id: 3,
      to: "/student/appointment",
      icon: <FaUserAlt className="mr-2" />,
      text: "Appointments",
    },
    {
      id: 4,
      to: "/student/message",
      icon: <FaComment className="mr-2" />,
      text: "Messages",
    },
    {
      id: 5,
      to: "/student/articles",
      icon: <FaRegNewspaper className="mr-2" />,
      text: "Articles",
    },
  ];

  const menuDropdownRef = useRef(null);
  const notificationDropdownRef = useRef(null);

  useEffect(() => {
    const handleClickOutside = (event) => {
      if (
        menuDropdownRef.current &&
        !menuDropdownRef.current.contains(event.target)
      ) {
        setShowMenuDropdown(false);
      }
      if (
        notificationDropdownRef.current &&
        !notificationDropdownRef.current.contains(event.target)
      ) {
        setShowNotificationDropdown(false);
      }
    };

    document.addEventListener("mousedown", handleClickOutside);
    return () => {
      document.removeEventListener("mousedown", handleClickOutside);
    };
  }, []);

  const toggleMenuDropdown = () => {
    setShowMenuDropdown(!showMenuDropdown);
    setShowNotificationDropdown(false);
  };

  const toggleNotificationDropdown = () => {
    setShowNotificationDropdown(!showNotificationDropdown);
    setShowMenuDropdown(false);
  };

  const handleSettingsClick = () => {
    navigate("/student/user");
  };

  const handleLogout = () => {
    setShowLogoutModal(true); // Show the logout confirmation modal
  };

  const confirmLogout = async () => {
    await logout();
    navigate("/login");
  };

  return (
    <header className="bg-white shadow-md py-4 fixed z-20 w-full">
      <div className="container mx-auto px-2 flex justify-between items-center">
        <div className="flex items-center space-x-4">
          <img
            src="/logo/Logo.svg"
            alt="TTU Counseling Logo"
            className="h-12 bg-gray-700 rounded-lg p-1"
          />
          <span className="text-gray-700 text-xl font-semibold hidden lg:block">
            E-Counselling
          </span>
        </div>
        <nav className="hidden md:flex items-center space-x-6">
          {navLinks.map((link) => (
            <NavLink
              key={link.id}
              to={link.to}
              className={({ isActive }) =>
                `text-gray-700  transition duration-200 flex items-center ${
                  isActive
                    ? "bg-blue-500 py-2 px-4 text-white rounded-full font-semibold"
                    : ""
                }`
              }>
              {link.icon}
              <span>{link.text}</span>
            </NavLink>
          ))}
        </nav>
        <div className="relative flex items-center space-x-6">
          <button
            className="text-gray-500 hover:text-blue-600 transition duration-200 relative"
            onClick={toggleNotificationDropdown}>
            <FaBell className="text-lg" />
            {notifications.some((n) => !n.isRead) && (
              <span className="absolute -top-1 -right-1 inline-flex items-center justify-center px-2 py-1 text-xs font-bold leading-none text-white transform translate-x-1/2 -translate-y-1/2 bg-red-600 rounded-full">
                {notifications.filter((n) => !n.isRead).length}
              </span>
            )}
          </button>
          <AnimatePresence>
            {showNotificationDropdown && (
              <motion.div
                ref={notificationDropdownRef}
                initial={{ opacity: 0, y: -10 }}
                animate={{ opacity: 1, y: 0 }}
                exit={{ opacity: 0, y: -10 }}
                transition={{ duration: 0.2 }}
                className="absolute right-0 top-12 w-80 bg-white border rounded-lg shadow-xl overflow-hidden z-30">
                <div className="p-4 max-h-96 overflow-y-auto">
                  {notifications.length > 0 ? (
                    notifications.map((notification) => (
                      <div
                        key={notification.id}
                        className={`mb-4 p-3 rounded-lg flex flex-col space-y-2 ${
                          notification.isRead ? "bg-gray-100" : "bg-blue-50"
                        }`}>
                        <div>
                          <h3 className="text-md font-semibold mb-1">
                            {notification.title}
                          </h3>
                          <p className="text-sm text-gray-700">
                            {notification.message}
                          </p>
                        </div>
                        <div className="flex justify-between items-center">
                          <p className="text-xs text-gray-500">
                            {notification.time}
                          </p>
                          <button
                            onClick={() => markAsRead(notification.id)}
                            className="text-blue-500 hover:underline text-sm">
                            Mark as read
                          </button>
                        </div>
                      </div>
                    ))
                  ) : (
                    <p className="text-center text-gray-500">
                      No notifications
                    </p>
                  )}
                </div>
              </motion.div>
            )}
          </AnimatePresence>
          <button
            className="text-gray-500 hover:text-blue-600 transition duration-200"
            onClick={toggleMenuDropdown}>
            <FaBars className="text-lg" />
          </button>
          <AnimatePresence>
            {showMenuDropdown && (
              <motion.div
                ref={menuDropdownRef}
                initial={{ opacity: 0, y: -10 }}
                animate={{ opacity: 1, y: 0 }}
                exit={{ opacity: 0, y: -10 }}
                transition={{ duration: 0.2 }}
                className="absolute right-0 top-12 w-48 p-4 bg-white border rounded-lg shadow-xl z-30 space-y-4">
                <button
                  onClick={handleSettingsClick}
                  className="flex items-center text-gray-700 hover:text-blue-500 transition duration-200 w-full text-left">
                  <FaCog className="mr-2" /> Settings
                </button>
                <button
                  onClick={handleLogout}
                  className="flex items-center text-gray-700 hover:text-blue-500 transition duration-200 w-full text-left">
                  <FaSignOutAlt className="mr-2" /> Logout
                </button>
              </motion.div>
            )}
          </AnimatePresence>
          {showLogoutModal && (
            <ConfirmationModal
              title="Confirm Logout"
              message="Are you sure you want to log out?"
              onConfirm={confirmLogout}
              onCancel={() => setShowLogoutModal(false)}
            />
          )}
        </div>
      </div>
    </header>
  );
}

export default Navbar;