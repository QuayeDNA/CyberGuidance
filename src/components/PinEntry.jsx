import { useState, useRef, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { FaCheckCircle } from 'react-icons/fa';
import PropTypes from 'prop-types';

const PinEntry = ({ onCorrectPin }) => {
  const [pin, setPin] = useState(['', '', '', '']);
  const [error, setError] = useState('');
  const [storedPin, setStoredPin] = useState('');
  const [showSuccess, setShowSuccess] = useState(false);
  const inputRefs = useRef([]);

  useEffect(() => {
    const userPin = localStorage.getItem('userPin');
    if (userPin) {
      setStoredPin(userPin);
    } else {
      setError('No PIN set. Please set a PIN in Security Settings.');
    }
    inputRefs.current[0]?.focus();
  }, []);

  const handleChange = (index, value) => {
    const newPin = [...pin];
    newPin[index] = value;
    setPin(newPin);

    if (value && index < 3) {
      inputRefs.current[index + 1].focus();
    }
  };

  const handleKeyDown = (e, index) => {
    if (e.key === 'Backspace' && !e.target.value && index > 0) {
      inputRefs.current[index - 1].focus();
    }
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    const enteredPin = pin.join('');
    if (enteredPin === storedPin) {
      setShowSuccess(true);
      setTimeout(() => {
        onCorrectPin();
      }, 1000);
    } else {
      setError('Incorrect PIN. Please try again.');
      setPin(['', '', '', '']);
      inputRefs.current[0].focus();
    }
  };

  const renderPinInputs = (pinArray) => (
    <div className="flex justify-center space-x-4">
      {pinArray.map((digit, index) => (
        <input
          key={index}
          type="password"
          maxLength={1}
          value={digit}
          onChange={(e) => handleChange(index, e.target.value)}
          onKeyDown={(e) => handleKeyDown(e, index)}
          ref={(el) => (inputRefs.current[index] = el)}
          className="w-12 h-12 text-center text-2xl border-2 border-gray-300 rounded-lg focus:border-indigo-500 focus:ring focus:ring-indigo-200 focus:ring-opacity-50"
        />
      ))}
    </div>
  );

  return (
    <div className="flex items-center justify-center min-h-screen bg-gradient-to-br from-blue-50 to-indigo-100 p-4">
      <motion.div
        initial={{ opacity: 0, scale: 0.9 }}
        animate={{ opacity: 1, scale: 1 }}
        transition={{ duration: 0.5 }}
        className="bg-white p-8 rounded-2xl shadow-lg w-full max-w-md relative"
      >
        <h2 className="text-3xl font-light mb-6 text-center text-gray-800">Enter PIN</h2>
        <p className="text-sm text-gray-600 mb-8 text-center">
          Please enter your 4-digit PIN to continue.
        </p>
        <form onSubmit={handleSubmit} className="space-y-8">
          {renderPinInputs(pin)}
          <motion.button
            type="submit"
            whileHover={{ scale: 1.05 }}
            whileTap={{ scale: 0.95 }}
            className="w-full bg-indigo-600 text-white rounded-full py-3 px-4 font-medium hover:bg-indigo-700 focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:ring-offset-2 transition-colors"
            disabled={!storedPin}
          >
            Confirm
          </motion.button>
        </form>
        {error && (
          <motion.p
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            className="text-red-500 mt-4 text-center text-sm"
          >
            {error}
          </motion.p>
        )}
        <AnimatePresence>
          {showSuccess && (
            <motion.div
              initial={{ opacity: 0, scale: 0.8 }}
              animate={{ opacity: 1, scale: 1 }}
              exit={{ opacity: 0, scale: 0.8 }}
              className="absolute inset-0 flex items-center justify-center bg-white bg-opacity-90"
            >
              <FaCheckCircle className="text-green-500 text-6xl" />
            </motion.div>
          )}
        </AnimatePresence>
      </motion.div>
    </div>
  );
};

PinEntry.propTypes = {
  onCorrectPin: PropTypes.func.isRequired,
};

export default PinEntry;