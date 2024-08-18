import PropTypes from 'prop-types';
import { motion, AnimatePresence } from 'framer-motion';

const ConfirmationModal = ({ title, message, onConfirm, onCancel }) => {
    return (
        <AnimatePresence>
            <motion.div
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                exit={{ opacity: 0 }}
                className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50"
            >
                <motion.div
                    initial={{ scale: 0.8 }}
                    animate={{ scale: 1 }}
                    exit={{ scale: 0.8 }}
                    className="bg-white rounded-lg shadow-lg p-6 w-96"
                >
                    <h2 className="text-xl font-semibold mb-4">{title}</h2>
                    <p className="mb-6">{message}</p>
                    <div className="flex justify-end space-x-4">
                        <button
                            onClick={onCancel}
                            className="px-4 py-2 bg-gray-300 rounded hover:bg-gray-400 transition duration-200"
                        >
                            Cancel
                        </button>
                        <button
                            onClick={onConfirm}
                            className="px-4 py-2 bg-blue-600 text-white rounded hover:bg-blue-700 transition duration-200"
                        >
                            Confirm
                        </button>
                    </div>
                </motion.div>
            </motion.div>
        </AnimatePresence>
    );
};

ConfirmationModal.propTypes = {
    title: PropTypes.string.isRequired,
    message: PropTypes.string.isRequired,
    onConfirm: PropTypes.func.isRequired,
    onCancel: PropTypes.func.isRequired,
};

export default ConfirmationModal;