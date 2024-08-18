import { useState } from 'react';
import { useForm } from 'react-hook-form';
import { motion } from 'framer-motion';
import PropTypes from 'prop-types';

const CreatePin = ({ onPinCreated, onSkip }) => {
  const [error, setError] = useState('');
  const { register, handleSubmit, setValue, watch, reset } = useForm({
    mode: 'onChange',
    defaultValues: { pin: '', confirmPin: '' },
  });
  const pin = watch('pin');
  const confirmPin = watch('confirmPin');

  const onSubmit = (data) => {
    if (data.pin !== data.confirmPin) {
      setError('PINs do not match. Please try again.');
      reset();
      return;
    }
    localStorage.setItem('userPin', data.pin);
    onPinCreated();
  };

  const handleButtonClick = (digit, field) => {
    if (field === 'pin' && pin.length < 4) {
      setValue('pin', pin + digit);
    } else if (field === 'confirmPin' && confirmPin.length < 4) {
      setValue('confirmPin', confirmPin + digit);
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
        <h2 className="text-3xl font-light mb-8 text-center text-gray-800">Create PIN</h2>
        <p className="text-sm text-gray-600 mb-4 text-center">
          Create a 4-digit PIN to secure your conversations. You can skip this step if you prefer.
        </p>
        <form onSubmit={handleSubmit(onSubmit)} className="space-y-6">
          <div className="space-y-4">
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">Enter PIN</label>
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
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">Confirm PIN</label>
              <div className="flex justify-center space-x-4">
                {[0, 1, 2, 3].map((index) => (
                  <motion.div
                    key={index}
                    className="w-3 h-3 rounded-full bg-gray-300"
                    animate={{
                      scale: confirmPin.length > index ? 1.2 : 1,
                      backgroundColor: confirmPin.length > index ? "#4F46E5" : "#D1D5DB"
                    }}
                  />
                ))}
              </div>
            </div>
          </div>
          <input type="password" {...register('pin')} className="sr-only" maxLength={4} />
          <input type="password" {...register('confirmPin')} className="sr-only" maxLength={4} />
          <div className="grid grid-cols-3 gap-4 justify-items-center">
            {[1, 2, 3, 4, 5, 6, 7, 8, 9, '', 0, ''].map((digit, index) => (
              <motion.button
                key={index}
                type="button"
                onClick={() => {
                  if (digit !== '') {
                    handleButtonClick(digit.toString(), pin.length === 4 ? 'confirmPin' : 'pin');
                  }
                }}
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
          <div className="flex space-x-4">
            <motion.button
              type="submit"
              whileHover={{ scale: 1.05 }}
              whileTap={{ scale: 0.95 }}
              className="flex-1 bg-indigo-600 text-white rounded-full py-3 px-4 font-medium hover:bg-indigo-700 focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:ring-offset-2 transition-colors"
            >
              Create PIN
            </motion.button>
            <motion.button
              type="button"
              onClick={onSkip}
              whileHover={{ scale: 1.05 }}
              whileTap={{ scale: 0.95 }}
              className="flex-1 bg-gray-200 text-gray-800 rounded-full py-3 px-4 font-medium hover:bg-gray-300 focus:outline-none focus:ring-2 focus:ring-gray-500 focus:ring-offset-2 transition-colors"
            >
              Skip
            </motion.button>
          </div>
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

CreatePin.propTypes = {
  onPinCreated: PropTypes.func.isRequired,
  onSkip: PropTypes.func.isRequired,
};

export default CreatePin;