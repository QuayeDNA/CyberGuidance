import { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { FaBell, FaCheckCircle, FaExclamationCircle, FaInfoCircle, FaTrash, FaEye, FaEyeSlash } from 'react-icons/fa';
import { format, formatDistanceToNow } from 'date-fns';

const NotificationsCenter = () => {
  const [notifications, setNotifications] = useState([]);
  const [showAll, setShowAll] = useState(false);
  const [filter, setFilter] = useState('all');

  useEffect(() => {
    // Simulating fetching notifications from an API
    const fetchNotifications = async () => {
      // In a real app, you would fetch from an API here
      const mockNotifications = [
        { id: 1, type: 'info', message: 'New user registered', timestamp: new Date(Date.now() - 2 * 60 * 60 * 1000), read: false },
        { id: 2, type: 'success', message: 'Report generated successfully', timestamp: new Date(Date.now() - 24 * 60 * 60 * 1000), read: true },
        { id: 3, type: 'warning', message: 'System update scheduled', timestamp: new Date(Date.now() - 3 * 24 * 60 * 60 * 1000), read: false },
        { id: 4, type: 'error', message: 'Failed to process payment', timestamp: new Date(Date.now() - 4 * 60 * 60 * 1000), read: false },
      ];
      setNotifications(mockNotifications);
    };

    fetchNotifications();
  }, []);

  const getIcon = (type) => {
    switch (type) {
      case 'success':
        return <FaCheckCircle className="text-green-500" />;
      case 'warning':
        return <FaExclamationCircle className="text-yellow-500" />;
      case 'error':
        return <FaExclamationCircle className="text-red-500" />;
      default:
        return <FaInfoCircle className="text-blue-500" />;
    }
  };

  const markAsRead = (id) => {
    setNotifications(notifications.map(notif =>
      notif.id === id ? { ...notif, read: true } : notif
    ));
  };

  const deleteNotification = (id) => {
    setNotifications(notifications.filter(notif => notif.id !== id));
  };

  const clearAll = () => {
    setNotifications([]);
  };

  const filteredNotifications = notifications.filter(notif => {
    if (filter === 'all') return true;
    if (filter === 'unread') return !notif.read;
    return notif.type === filter;
  });

  const displayedNotifications = showAll ? filteredNotifications : filteredNotifications.slice(0, 3);

  return (
    <motion.div
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      transition={{ duration: 0.5 }}
      className="p-6 bg-gray-100 min-h-screen"
    >
      <div className="max-w-2xl mx-auto">
        <h2 className="text-2xl font-bold mb-6 flex items-center">
          <FaBell className="mr-2" />
          Notifications Center
        </h2>
        <div className="mb-4 flex justify-between items-center">
          <select
            value={filter}
            onChange={(e) => setFilter(e.target.value)}
            className="p-2 border rounded-md"
          >
            <option value="all">All</option>
            <option value="unread">Unread</option>
            <option value="info">Info</option>
            <option value="success">Success</option>
            <option value="warning">Warning</option>
            <option value="error">Error</option>
          </select>
          <button
            onClick={clearAll}
            className="bg-red-500 text-white px-4 py-2 rounded-md hover:bg-red-600 transition duration-300"
          >
            Clear All
          </button>
        </div>
        <div className="bg-white shadow-md rounded-lg overflow-hidden">
          <AnimatePresence>
            {displayedNotifications.map((notification) => (
              <motion.div
                key={notification.id}
                initial={{ opacity: 0, y: -20 }}
                animate={{ opacity: 1, y: 0 }}
                exit={{ opacity: 0, y: -20 }}
                transition={{ duration: 0.3 }}
                className={`p-4 border-b last:border-b-0 flex items-start ${notification.read ? 'bg-gray-50' : 'bg-white'}`}
              >
                <div className="mr-4">{getIcon(notification.type)}</div>
                <div className="flex-1">
                  <p className={`font-semibold ${notification.read ? 'text-gray-600' : 'text-black'}`}>{notification.message}</p>
                  <p className="text-sm text-gray-500">
                    {formatDistanceToNow(notification.timestamp, { addSuffix: true })}
                  </p>
                  <p className="text-xs text-gray-400">
                    {format(notification.timestamp, 'MMM d, yyyy HH:mm')}
                  </p>
                </div>
                <div className="flex flex-col space-y-2">
                  <button
                    onClick={() => markAsRead(notification.id)}
                    className="text-blue-500 hover:text-blue-700"
                    title={notification.read ? "Mark as unread" : "Mark as read"}
                  >
                    {notification.read ? <FaEyeSlash /> : <FaEye />}
                  </button>
                  <button
                    onClick={() => deleteNotification(notification.id)}
                    className="text-red-500 hover:text-red-700"
                    title="Delete notification"
                  >
                    <FaTrash />
                  </button>
                </div>
              </motion.div>
            ))}
          </AnimatePresence>
        </div>
        {filteredNotifications.length > 3 && (
          <div className="mt-4 text-center">
            <button
              onClick={() => setShowAll(!showAll)}
              className="text-blue-500 hover:text-blue-700"
            >
              {showAll ? 'Show Less' : 'Show All'}
            </button>
          </div>
        )}
        {filteredNotifications.length === 0 && (
          <p className="text-center text-gray-500 mt-4">No notifications to display.</p>
        )}
      </div>
    </motion.div>
  );
};

export default NotificationsCenter;