import { useState, useEffect, useRef } from "react";
import { Link, Outlet, useNavigate, useLocation } from "react-router-dom";
import {
  FaTachometerAlt,
  FaUsers,
  FaCalendarAlt,
  FaChartBar,
  FaCog,
  FaBell,
  FaSignOutAlt,
  FaBars,
  FaTimes,
  FaFileAlt,
} from "react-icons/fa";
import { useAuth } from "../../components/contexts/AuthContext";
import PropTypes from "prop-types";
import { Tooltip } from "react-tooltip";

// Confirmation Modal Component
const ConfirmationModal = ({ isOpen, onConfirm, onCancel }) => {
  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 bg-gray-600 bg-opacity-50 flex items-center justify-center z-50">
      <div className="bg-white p-6 rounded shadow-lg">
        <h2 className="text-xl mb-4">Confirm Logout</h2>
        <p className="mb-4">Are you sure you want to logout?</p>
        <div className="flex justify-end">
          <button
            onClick={onCancel}
            className="bg-gray-300 hover:bg-gray-400 text-gray-800 py-2 px-4 rounded mr-2">
            Cancel
          </button>
          <button
            onClick={onConfirm}
            className="bg-red-600 hover:bg-red-700 text-white py-2 px-4 rounded">
            Confirm
          </button>
        </div>
      </div>
    </div>
  );
};

ConfirmationModal.propTypes = {
  isOpen: PropTypes.bool.isRequired,
  onConfirm: PropTypes.func.isRequired,
  onCancel: PropTypes.func.isRequired,
};

const AdminDashboard = () => {
  const [isSidebarOpen, setIsSidebarOpen] = useState(false);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const sidebarRef = useRef(null);
  const navigate = useNavigate();
  const location = useLocation();
  const { logout, currentUser } = useAuth();

  const handleLogout = () => {
    setIsModalOpen(true);
  };

  const confirmLogout = async () => {
    try {
      await logout();
      console.log("Logging out...");
      navigate("/admin/login");
    } catch (error) {
      console.error("Logout failed:", error);
    } finally {
      setIsModalOpen(false);
    }
  };

  const cancelLogout = () => {
    setIsModalOpen(false);
  };

  const toggleSidebar = () => {
    setIsSidebarOpen(!isSidebarOpen);
  };

  const handleClickOutside = (event) => {
    if (sidebarRef.current && !sidebarRef.current.contains(event.target)) {
      setIsSidebarOpen(false);
    }
  };

  useEffect(() => {
    if (isSidebarOpen) {
      document.addEventListener("mousedown", handleClickOutside);
    } else {
      document.removeEventListener("mousedown", handleClickOutside);
    }

    return () => {
      document.removeEventListener("mousedown", handleClickOutside);
    };
  }, [isSidebarOpen]);

  const navItems = [
    { path: "/admin/overview", icon: FaTachometerAlt, label: "Overview" },
    { path: "/admin/users", icon: FaUsers, label: "Users" },
    { path: "/admin/appointments", icon: FaCalendarAlt, label: "Appointments" },
    { path: "/admin/reports", icon: FaFileAlt, label: "Reports" },
    { path: "/admin/analytics", icon: FaChartBar, label: "Analytics" },
    { path: "/admin/settings", icon: FaCog, label: "Settings" },
    { path: "/admin/notifications", icon: FaBell, label: "Notifications" },
  ];

  const getRandomBadge = () => {
    const colors = ["bg-red-500", "bg-green-500", "bg-blue-500", "bg-yellow-500", "bg-purple-500"];
    const randomColor = colors[Math.floor(Math.random() * colors.length)];
    return randomColor;
  };

  const username = currentUser?.username || "Admin";
  const userBadge = getRandomBadge();

  return (
    <div className="flex h-screen bg-gray-100">
      {/* Sidebar for larger screens */}
      <div
        ref={sidebarRef}
        className={`bg-blue-700 z-[1000] text-white w-64 space-y-6 py-7 px-2 absolute inset-y-0 left-0 transform ${
          isSidebarOpen ? "translate-x-0" : "-translate-x-full"
        } md:relative md:translate-x-0 transition duration-200 ease-in-out`}>
        <div className="flex items-center justify-between px-4">
          <h2 className="text-xl font-semibold">E-Counselling</h2>
          <button onClick={toggleSidebar} className="md:hidden">
            <FaTimes size={24} />
          </button>
        </div>
        <nav>
          {navItems.map((item) => (
            <Link
              key={item.path}
              to={item.path}
              className={`flex items-center py-2.5 px-4 rounded transition duration-200 hover:bg-indigo-700 ${
                location.pathname === item.path ? "bg-indigo-700" : ""
              }`}
              data-tooltip-id={item.label}
              data-tooltip-content={item.label}>
              <item.icon className="inline-block mr-2" />
              <span className="inline">{item.label}</span>
            </Link>
          ))}
        </nav>
        <div className="mt-auto px-4 py-2">
          <div className="flex items-center bg-indigo-900 rounded-lg p-2 mb-4">
            <div className={`h-8 w-8 rounded-full ${userBadge} flex items-center justify-center text-white font-bold`}>
              {username.charAt(0).toUpperCase()}
            </div>
            <div className="ml-3">
              <span className="block text-sm">{username}</span>
              <span className="block text-xs opacity-75">Admin</span>
            </div>
          </div>
          <button
            onClick={handleLogout}
            className="w-full bg-red-600 hover:bg-red-700 text-white py-2 px-4 rounded transition duration-200">
            <FaSignOutAlt className="inline-block mr-2" />
            Logout
          </button>
        </div>
      </div>

      {/* Main content */}
      <div className="flex-1 flex flex-col overflow-hidden">
        <header className="bg-white shadow-md">
          <div className="flex items-center justify-between p-4">
            <button
              onClick={toggleSidebar}
              className="text-gray-500 focus:outline-none focus:text-gray-700 md:hidden">
              <FaBars size={24} />
            </button>
            <h1 className="text-xl font-semibold">Welcome, Admin</h1>
          </div>
        </header>
        <main className="flex-1 overflow-x-hidden overflow-y-auto p-6">
          <Outlet />
        </main>
      </div>

      {/* Confirmation Modal */}
      <ConfirmationModal
        isOpen={isModalOpen}
        onConfirm={confirmLogout}
        onCancel={cancelLogout}
      />

      {/* Tooltips */}
      {navItems.map((item) => (
        <Tooltip key={item.label} id={item.label} place="right" />
      ))}
    </div>
  );
};

export default AdminDashboard;