import { useState, useRef, useEffect } from 'react';
import { motion } from 'framer-motion';
import PropTypes from 'prop-types';

const CreatePin = ({ onPinCreated, onSkip }) => {
  const [pin, setPin] = useState(['', '', '', '']);
  const [confirmPin, setConfirmPin] = useState(['', '', '', '']);
  const [step, setStep] = useState(1);
  const [error, setError] = useState('');
  const inputRefs = useRef([]);

  useEffect(() => {
    inputRefs.current[0]?.focus();
  }, [step]);

  const handleChange = (index, value, isPinConfirmation = false) => {
    const newPin = isPinConfirmation ? [...confirmPin] : [...pin];
    newPin[index] = value;
    isPinConfirmation ? setConfirmPin(newPin) : setPin(newPin);

    if (value && index < 3) {
      inputRefs.current[index + 1].focus();
    }
  };

  const handleKeyDown = (e, index, isPinConfirmation = false) => {
    if (e.key === 'Backspace' && !e.target.value && index > 0) {
      inputRefs.current[index - 1].focus();
    }
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    const currentPin = pin.join('');
    const currentConfirmPin = confirmPin.join('');

    if (step === 1) {
      if (currentPin.length === 4) {
        setStep(2);
        setConfirmPin(['', '', '', '']);
      } else {
        setError('Please enter a 4-digit PIN.');
      }
    } else {
      if (currentPin === currentConfirmPin) {
        localStorage.setItem('userPin', currentPin);
        onPinCreated();
      } else {
        setError('PINs do not match. Please try again.');
        setStep(1);
        setPin(['', '', '', '']);
        setConfirmPin(['', '', '', '']);
      }
    }
  };

  const renderPinInputs = (pinArray, isPinConfirmation = false) => (
    <div className="flex justify-center space-x-4">
      {pinArray.map((digit, index) => (
        <input
          key={index}
          type="password"
          maxLength={1}
          value={digit}
          onChange={(e) => handleChange(index, e.target.value, isPinConfirmation)}
          onKeyDown={(e) => handleKeyDown(e, index, isPinConfirmation)}
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
        className="bg-white p-8 rounded-2xl shadow-lg w-full max-w-md"
      >
        <h2 className="text-3xl font-light mb-6 text-center text-gray-800">
          {step === 1 ? 'Create PIN' : 'Confirm PIN'}
        </h2>
        <p className="text-sm text-gray-600 mb-8 text-center">
          {step === 1
            ? 'Create a 4-digit PIN to secure your conversations.'
            : 'Please confirm your PIN to ensure its correct.'}
        </p>
        <form onSubmit={handleSubmit} className="space-y-8">
          {step === 1 ? renderPinInputs(pin) : renderPinInputs(confirmPin, true)}
          <div className="flex space-x-4">
            <motion.button
              type="submit"
              whileHover={{ scale: 1.05 }}
              whileTap={{ scale: 0.95 }}
              className="flex-1 bg-indigo-600 text-white rounded-full py-3 px-4 font-medium hover:bg-indigo-700 focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:ring-offset-2 transition-colors"
            >
              {step === 1 ? 'Next' : 'Create PIN'}
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