import { useState } from 'react';
import { Link, Outlet, useNavigate, useLocation } from 'react-router-dom';
import {
  FaTachometerAlt,
  FaUsers,
  FaCalendarAlt,
  FaChartBar,
  FaCog,
  FaBell,
  FaSignOutAlt,
  FaBars,
  FaTimes
} from 'react-icons/fa';

const AdminDashboard = () => {
  const [isSidebarOpen, setIsSidebarOpen] = useState(false);
  const navigate = useNavigate();
  const location = useLocation();

  const handleLogout = () => {
    // Implement your logout logic here
    console.log('Logging out...');
    navigate('/admin/login');
  };

  const toggleSidebar = () => {
    setIsSidebarOpen(!isSidebarOpen);
  };

  const navItems = [
    { path: '/admin/overview', icon: FaTachometerAlt, label: 'Overview' },
    { path: '/admin/users', icon: FaUsers, label: 'Users' },
    { path: '/admin/appointments', icon: FaCalendarAlt, label: 'Appointments' },
    { path: '/admin/analytics', icon: FaChartBar, label: 'Analytics' },
    { path: '/admin/settings', icon: FaCog, label: 'Settings' },
    { path: '/admin/notifications', icon: FaBell, label: 'Notifications' },
  ];

  return (
    <div className="flex h-screen bg-gray-100">
      {/* Sidebar for larger screens */}
      <div className={`bg-indigo-800 text-white w-64 space-y-6 py-7 px-2 absolute inset-y-0 left-0 transform ${isSidebarOpen ? 'translate-x-0' : '-translate-x-full'} md:relative md:translate-x-0 transition duration-200 ease-in-out`}>
        <div className="flex items-center justify-between px-4">
          <h2 className="text-2xl font-semibold">Admin Dashboard</h2>
          <button onClick={toggleSidebar} className="md:hidden">
            <FaTimes size={24} />
          </button>
        </div>
        <nav>
          {navItems.map((item) => (
            <Link
              key={item.path}
              to={item.path}
              className={`block py-2.5 px-4 rounded transition duration-200 hover:bg-indigo-700 ${
                location.pathname === item.path ? 'bg-indigo-700' : ''
              }`}
            >
              <item.icon className="inline-block mr-2" />
              {item.label}
            </Link>
          ))}
        </nav>
        <div className="px-4 py-2 mt-auto">
          <div className="bg-indigo-900 rounded-lg p-2 mb-4">
            <span className="block text-sm">Admin</span>
            <span className="block text-xs opacity-75">John Doe</span>
          </div>
          <button
            onClick={handleLogout}
            className="w-full bg-red-600 hover:bg-red-700 text-white py-2 px-4 rounded transition duration-200"
          >
            <FaSignOutAlt className="inline-block mr-2" />
            Logout
          </button>
        </div>
      </div>

      {/* Main content */}
      <div className="flex-1 flex flex-col overflow-hidden">
        <header className="bg-white shadow-md">
          <div className="flex items-center justify-between p-4">
            <button onClick={toggleSidebar} className="text-gray-500 focus:outline-none focus:text-gray-700 md:hidden">
              <FaBars size={24} />
            </button>
            <h1 className="text-xl font-semibold">Welcome, Admin</h1>
          </div>
        </header>
        <main className="flex-1 overflow-x-hidden overflow-y-auto p-6">
          <Outlet />
        </main>
      </div>
    </div>
  );
};

export default AdminDashboard;