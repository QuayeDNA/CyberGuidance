import { useState, useEffect, useRef } from "react";
import {
  FaSignOutAlt,
  FaBars,
  FaUserAlt,
  FaHome,
  FaComment,
  FaRegNewspaper,
  FaCog,
  FaClock,
} from "react-icons/fa";
import { NavLink, useNavigate } from "react-router-dom";
import { motion, AnimatePresence } from "framer-motion";
import ConfirmationModal from "./ConfirmationModal";
import { useAuth } from "../../components/contexts/AuthContext";

function Navbar() {
  const [showMenuDropdown, setShowMenuDropdown] = useState(false);
  const [showLogoutModal, setShowLogoutModal] = useState(false);
  const [showTimePopup, setShowTimePopup] = useState(false);

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
  const timePopupRef = useRef(null);

  useEffect(() => {
    const handleClickOutside = (event) => {
      if (
        menuDropdownRef.current &&
        !menuDropdownRef.current.contains(event.target)
      ) {
        setShowMenuDropdown(false);
      }
      if (
        timePopupRef.current &&
        !timePopupRef.current.contains(event.target)
      ) {
        setShowTimePopup(false);
      }
    };

    document.addEventListener("mousedown", handleClickOutside);
    return () => {
      document.removeEventListener("mousedown", handleClickOutside);
    };
  }, []);

  const toggleMenuDropdown = () => {
    setShowMenuDropdown(!showMenuDropdown);
    setShowTimePopup(false);
  };

  const toggleTimePopup = () => {
    setShowTimePopup(!showTimePopup);
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
        <nav className="hidden lg:flex items-center space-x-6">
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
            onClick={toggleTimePopup}>
            <FaClock className="text-lg" />
          </button>
          <AnimatePresence>
            {showTimePopup && (
              <motion.div
                ref={timePopupRef}
                initial={{ opacity: 0, y: -10 }}
                animate={{ opacity: 1, y: 0 }}
                exit={{ opacity: 0, y: -10 }}
                transition={{ duration: 0.2 }}
                className="absolute right-0 top-12 w-48 bg-white border rounded-lg shadow-xl overflow-hidden z-30 p-4">
                <p className="text-center text-gray-700">
                  {new Date().toLocaleTimeString()}
                </p>
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