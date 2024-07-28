import { useState, useEffect } from 'react';
import { motion } from 'framer-motion';
import { FaCog, FaBell, FaMoon, FaLanguage, FaFont, FaLock, FaSave } from 'react-icons/fa';
import { Switch } from '@headlessui/react';
import { ToastContainer, toast } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';

const SystemSettings = () => {
  const [settings, setSettings] = useState({
    emailNotifications: true,
    darkMode: false,
    language: 'en',
    fontSize: 'medium',
    twoFactorAuth: false,
    autoSave: true,
  });

  useEffect(() => {
    // Load settings from localStorage on component mount
    const savedSettings = localStorage.getItem('systemSettings');
    if (savedSettings) {
      setSettings(JSON.parse(savedSettings));
    }
  }, []);

  useEffect(() => {
    // Apply dark mode
    if (settings.darkMode) {
      document.documentElement.classList.add('dark');
    } else {
      document.documentElement.classList.remove('dark');
    }

    // Apply font size
    document.body.style.fontSize = getFontSize(settings.fontSize);
  }, [settings.darkMode, settings.fontSize]);

  const handleSettingChange = (setting, value) => {
    setSettings(prevSettings => ({
      ...prevSettings,
      [setting]: value
    }));
  };

  const saveSettings = () => {
    localStorage.setItem('systemSettings', JSON.stringify(settings));
    toast.success('Settings saved successfully!');
  };

  const getFontSize = (size) => {
    switch (size) {
      case 'small': return '14px';
      case 'medium': return '16px';
      case 'large': return '18px';
      default: return '16px';
    }
  };

  return (
    <motion.div
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      transition={{ duration: 0.5 }}
      className="p-6 dark:bg-gray-800 dark:text-white"
    >
      <h2 className="text-2xl font-bold mb-6 flex items-center">
        <FaCog className="mr-2" />
        System Settings
      </h2>
      <div className="bg-white dark:bg-gray-700 shadow-md rounded-lg p-6">
        <div className="mb-6">
          <label className="flex items-center">
            <FaBell className="mr-2" />
            <span className="mr-4">Email Notifications</span>
            <Switch
              checked={settings.emailNotifications}
              onChange={(checked) => handleSettingChange('emailNotifications', checked)}
              className={`${
                settings.emailNotifications ? 'bg-indigo-600' : 'bg-gray-200'
              } relative inline-flex items-center h-6 rounded-full w-11`}
            >
              <span className="sr-only">Enable email notifications</span>
              <span
                className={`${
                  settings.emailNotifications ? 'translate-x-6' : 'translate-x-1'
                } inline-block w-4 h-4 transform bg-white rounded-full`}
              />
            </Switch>
          </label>
        </div>
        <div className="mb-6">
          <label className="flex items-center">
            <FaMoon className="mr-2" />
            <span className="mr-4">Dark Mode</span>
            <Switch
              checked={settings.darkMode}
              onChange={(checked) => handleSettingChange('darkMode', checked)}
              className={`${
                settings.darkMode ? 'bg-indigo-600' : 'bg-gray-200'
              } relative inline-flex items-center h-6 rounded-full w-11`}
            >
              <span className="sr-only">Enable dark mode</span>
              <span
                className={`${
                  settings.darkMode ? 'translate-x-6' : 'translate-x-1'
                } inline-block w-4 h-4 transform bg-white rounded-full`}
              />
            </Switch>
          </label>
        </div>
        <div className="mb-6">
          <label className="flex items-center mb-2">
            <FaLanguage className="mr-2" />
            <span>Language</span>
          </label>
          <select
            value={settings.language}
            onChange={(e) => handleSettingChange('language', e.target.value)}
            className="w-full p-2 border rounded-md dark:bg-gray-600 dark:border-gray-500"
          >
            <option value="en">English</option>
            <option value="es">Spanish</option>
            <option value="fr">French</option>
            <option value="de">German</option>
            <option value="zh">Chinese</option>
          </select>
        </div>
        <div className="mb-6">
          <label className="flex items-center mb-2">
            <FaFont className="mr-2" />
            <span>Font Size</span>
          </label>
          <select
            value={settings.fontSize}
            onChange={(e) => handleSettingChange('fontSize', e.target.value)}
            className="w-full p-2 border rounded-md dark:bg-gray-600 dark:border-gray-500"
          >
            <option value="small">Small</option>
            <option value="medium">Medium</option>
            <option value="large">Large</option>
          </select>
        </div>
        <div className="mb-6">
          <label className="flex items-center">
            <FaLock className="mr-2" />
            <span className="mr-4">Two-Factor Authentication</span>
            <Switch
              checked={settings.twoFactorAuth}
              onChange={(checked) => handleSettingChange('twoFactorAuth', checked)}
              className={`${
                settings.twoFactorAuth ? 'bg-indigo-600' : 'bg-gray-200'
              } relative inline-flex items-center h-6 rounded-full w-11`}
            >
              <span className="sr-only">Enable two-factor authentication</span>
              <span
                className={`${
                  settings.twoFactorAuth ? 'translate-x-6' : 'translate-x-1'
                } inline-block w-4 h-4 transform bg-white rounded-full`}
              />
            </Switch>
          </label>
        </div>
        <div className="mb-6">
          <label className="flex items-center">
            <FaSave className="mr-2" />
            <span className="mr-4">Auto-save</span>
            <Switch
              checked={settings.autoSave}
              onChange={(checked) => handleSettingChange('autoSave', checked)}
              className={`${
                settings.autoSave ? 'bg-indigo-600' : 'bg-gray-200'
              } relative inline-flex items-center h-6 rounded-full w-11`}
            >
              <span className="sr-only">Enable auto-save</span>
              <span
                className={`${
                  settings.autoSave ? 'translate-x-6' : 'translate-x-1'
                } inline-block w-4 h-4 transform bg-white rounded-full`}
              />
            </Switch>
          </label>
        </div>
        <button 
          onClick={saveSettings}
          className="bg-indigo-600 text-white px-4 py-2 rounded-md hover:bg-indigo-700 transition duration-300"
        >
          Save Settings
        </button>
      </div>
      <ToastContainer position="bottom-right" />
    </motion.div>
  );
};

export default SystemSettings;