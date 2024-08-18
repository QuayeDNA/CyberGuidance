import { useState, useEffect } from 'react';
import { useForm } from 'react-hook-form';
import { motion } from 'framer-motion';
import PropTypes from 'prop-types';

const PinEntry = ({ onCorrectPin }) => {
  const [error, setError] = useState('');
  const [storedPin, setStoredPin] = useState('');
  const { register, handleSubmit, setValue, watch } = useForm({
    mode: 'onChange',
    defaultValues: { pin: '' },
  });

  const pin = watch('pin');

  useEffect(() => {
    const userPin = localStorage.getItem('userPin');
    if (userPin) {
      setStoredPin(userPin);
    } else {
      setError('No PIN set. Please set a PIN in Security Settings.');
    }
  }, []);

  const onSubmit = (data) => {
    if (data.pin === storedPin) {
      onCorrectPin();
    } else {
      setError('Incorrect PIN. Please try again.');
      setValue('pin', '');
    }
  };

  const handleButtonClick = (digit) => {
    if (pin.length < 4) {
      setValue('pin', pin + digit);
    }
  };

  return (
    <div className="flex items-center justify-center min-h-screen bg-gradient-to-br from-blue-50 to-indigo-100">
      <motion.div 
        initial={{ opacity: 0, scale: 0.9 }}
        animate={{ opacity: 1, scale: 1 }}
        transition={{ duration: 0.5 }}
        className="bg-white p-8 rounded-2xl shadow-lg w-full max-w-sm"
      >
        <h2 className="text-3xl font-light mb-8 text-center text-gray-800">Enter PIN</h2>
        <form onSubmit={handleSubmit(onSubmit)} className="space-y-6">
          <div className="flex justify-center space-x-4">
            {[0, 1, 2, 3].map((index) => (
              <motion.div
                key={index}
                className="w-3 h-3 rounded-full bg-gray-300"
                animate={{
                  scale: pin.length > index ? 1.2 : 1,
                  backgroundColor: pin.length > index ? "#4F46E5" : "#D1D5DB"
                }}
              />
            ))}
          </div>
          <input
            type="password"
            {...register('pin')}
            className="sr-only"
            maxLength={4}
          />
          <div className="grid grid-cols-3 gap-4 justify-items-center">
            {[1, 2, 3, 4, 5, 6, 7, 8, 9, '', 0, ''].map((digit, index) => (
              <motion.button
                key={index}
                type="button"
                onClick={() => digit !== '' && handleButtonClick(digit.toString())}
                whileHover={{ scale: 1.1 }}
                whileTap={{ scale: 0.95 }}
                className={`w-16 h-16 rounded-full text-2xl font-light focus:outline-none ${
                  digit === '' ? 'invisible' : 'bg-white text-gray-800 shadow-md hover:shadow-lg transition-shadow'
                }`}
              >
                {digit}
              </motion.button>
            ))}
          </div>
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
      </motion.div>
    </div>
  );
};

PinEntry.propTypes = {
  onCorrectPin: PropTypes.func.isRequired,
};

export default PinEntry;