
import { motion } from 'framer-motion';
import { FaSpinner } from 'react-icons/fa';

const LoadingComponent = () => {
  return (
    <div className="flex items-center justify-center h-screen bg-gray-100">
      <motion.div
        animate={{
          rotate: 360,
          transition: {
            duration: 1,
            repeat: Infinity,
            ease: "linear"
          }
        }}
        className="text-4xl text-blue-500"
      >
        <FaSpinner />
      </motion.div>
      <motion.p
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        transition={{ delay: 0.5 }}
        className="ml-4 text-xl font-semibold text-gray-700"
      >
        Loading...
      </motion.p>
    </div>
  );
};

export default LoadingComponent;